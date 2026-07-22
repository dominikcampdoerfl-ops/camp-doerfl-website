import { cp, mkdir, rm, writeFile, copyFile, readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "./pages.mjs";
import { site } from "./data.mjs";
import { legacyRedirectRules } from "./redirects.mjs";
import { securityHeaders } from "./security.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const maxCloudflareAssetBytes = 25 * 1024 * 1024;
const productionHost = new URL(site.url).hostname;
const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
const workerEntrypoint = `const productionHost = ${JSON.stringify(productionHost)};
const apexHost = ${JSON.stringify(site.domain)};
const legacyRedirectRules = ${JSON.stringify(legacyRedirectRules, null, 2)};
const securityHeaders = ${JSON.stringify(securityHeaders, null, 2)};

function secureResponse(response) {
  const secured = new Response(response.body, response);

  for (const [name, value] of Object.entries(securityHeaders)) {
    secured.headers.set(name, value);
  }

  return secured;
}

function secureRedirect(location) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: location.toString(),
      ...securityHeaders
    }
  });
}

function canonicalHttpsRedirect(request) {
  const url = new URL(request.url);
  const isProductionHost = url.hostname === productionHost || url.hostname === apexHost;

  if (!isProductionHost) {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname === apexHost) {
    url.protocol = "https:";
    url.hostname = productionHost;
    return secureRedirect(url);
  }

  return null;
}

function normalizeLegacyPathname(pathname) {
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (!decodedPathname.startsWith("/")) {
    return null;
  }

  let normalized = decodedPathname.toLowerCase().replace(/\\/{2,}/g, "/");
  normalized = normalized.replace(/\\/index\\.html?$/, "/").replace(/\\.html?$/, "");

  if (normalized === "/") {
    return normalized;
  }

  return normalized.endsWith("/") ? normalized : normalized + "/";
}

function resolveLegacyRedirect(pathname) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  if (!normalizedPathname) {
    return null;
  }

  const exactTarget = legacyRedirectRules.exact[normalizedPathname];

  if (exactTarget) {
    return exactTarget;
  }

  for (const rule of legacyRedirectRules.prefixes) {
    if (normalizedPathname === rule.from || normalizedPathname.startsWith(rule.from)) {
      return rule.to;
    }
  }

  return null;
}

function legacyContentRedirect(request) {
  const url = new URL(request.url);
  const targetPathname = resolveLegacyRedirect(url.pathname);

  if (!targetPathname) {
    return null;
  }

  url.pathname = targetPathname;

  if (url.hostname === productionHost || url.hostname === apexHost) {
    url.protocol = "https:";
    url.hostname = productionHost;
  }

  return secureRedirect(url);
}

const notFound = () =>
  secureResponse(new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  }));

function assetRequest(request, pathname) {
  return new Request(new URL(pathname, request.url), request);
}

export default {
  async fetch(request, env) {
    const redirect = legacyContentRedirect(request) || canonicalHttpsRedirect(request);

    if (redirect) {
      return redirect;
    }

    // Google-Search-Console-Verifizierung: Die Datei muss unter exakt
    // /google….html mit Status 200 antworten. Cloudflares Asset-Serving
    // leitet .html-Pfade sonst per 307 auf die Clean-URL um, was die
    // Verifizierung scheitern lässt – daher den Inhalt direkt ausliefern.
    const requestUrl = new URL(request.url);
    if (/^\\/google[0-9a-f]+\\.html$/.test(requestUrl.pathname)) {
      const direct = await env.ASSETS.fetch(
        assetRequest(request, requestUrl.pathname.replace(/\\.html$/, ""))
      );

      if (direct.status !== 404) {
        return secureResponse(direct);
      }
    }

    let response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return secureResponse(response);
    }

    const url = new URL(request.url);
    const hasExtension = url.pathname.split("/").pop()?.includes(".") ?? false;
    const fallbackPath = url.pathname.endsWith("/")
      ? \`\${url.pathname}index.html\`
      : hasExtension
        ? ""
        : \`\${url.pathname}/index.html\`;

    if (!fallbackPath) {
      return notFound();
    }

    response = await env.ASSETS.fetch(assetRequest(request, fallbackPath));
    return response.status === 404 ? notFound() : secureResponse(response);
  },
};
`;

async function copyDeployableAssets(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });

  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDeployableAssets(sourcePath, targetPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const { size } = await stat(sourcePath);
    if (size > maxCloudflareAssetBytes) {
      console.warn(`Skipping asset larger than 25 MiB for Cloudflare deploy: ${sourcePath}`);
      continue;
    }

    await copyFile(sourcePath, targetPath);
  }
}

async function collectFiles(dir, predicate) {
  const matches = [];

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      matches.push(...(await collectFiles(path, predicate)));
      continue;
    }

    if (entry.isFile() && predicate(path)) {
      matches.push(path);
    }
  }

  return matches;
}

async function collectReferencedAssetPaths(searchDir) {
  const textFiles = await collectFiles(searchDir, (path) => /\.(?:html|css|js|xml|txt|json)$/i.test(path));
  const assetPaths = new Set();

  for (const filePath of textFiles) {
    const content = await readFile(filePath, "utf8");

    for (const match of content.matchAll(/\/assets\/[A-Za-z0-9._/-]+/g)) {
      assetPaths.add(match[0].replace(/^\/+/, ""));
    }
  }

  return [...assetPaths].sort();
}

async function copyReferencedAssets(assetPaths) {
  for (const assetPath of assetPaths) {
    const sourcePath = join(root, assetPath);
    const targetPath = join(dist, assetPath);

    if (await pathExists(targetPath)) {
      continue;
    }

    if (!(await pathExists(sourcePath))) {
      console.warn(`Referenced asset missing: ${assetPath}`);
      continue;
    }

    const { size } = await stat(sourcePath);
    if (size > maxCloudflareAssetBytes) {
      console.warn(`Skipping referenced asset larger than 25 MiB for Cloudflare deploy: ${sourcePath}`);
      continue;
    }

    await mkdir(dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
  }
}

async function pathExists(path) {
  return Boolean(await stat(path).catch(() => null));
}

export async function buildSite() {
  const hostingConfigPath = join(root, ".openai", "hosting.json");
  const hostingConfig = JSON.parse(await readFile(hostingConfigPath, "utf8"));
  const runtimeHostingConfig = {
    d1: hostingConfig.d1 ?? null,
    r2: hostingConfig.r2 ?? null
  };

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  const publicDir = join(root, "public");
  if (await pathExists(publicDir)) {
    await copyDeployableAssets(publicDir, dist);
  }
  await mkdir(join(dist, "assets"), { recursive: true });
  await copyFile(join(root, "src", "styles.css"), join(dist, "assets", "styles.css"));
  await copyFile(join(root, "src", "mobile-overrides.css"), join(dist, "assets", "mobile-overrides.css"));
  await copyFile(join(root, "src", "main.js"), join(dist, "assets", "main.js"));
  await copyFile(join(root, "src", "contact-topics.js"), join(dist, "assets", "contact-topics.js"));

  for (const page of pages) {
    const outputDir = page.route === "/" ? dist : join(dist, page.route.replace(/^\/|\/$/g, ""));
    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, "index.html"), page.render(), "utf8");
  }

  const sitemapPages = pages.filter((page) => page.includeInSitemap !== false);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
    .map(
      (page) => `  <url>
    <loc>${site.url}${page.route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");
  await writeFile(
    join(dist, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
    "utf8"
  );

  const securityTxtExpires = new Date(Date.now() + oneYearInMilliseconds)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
  const securityTxt = `Contact: mailto:${site.email}
Expires: ${securityTxtExpires}
Preferred-Languages: de, en
Canonical: ${site.url}/.well-known/security.txt
`;

  await mkdir(join(dist, ".well-known"), { recursive: true });
  await writeFile(join(dist, ".well-known", "security.txt"), securityTxt, "utf8");
  await writeFile(join(dist, "security.txt"), securityTxt, "utf8");

  await mkdir(join(dist, ".openai"), { recursive: true });
  await writeFile(join(dist, ".openai", "hosting.json"), `${JSON.stringify(runtimeHostingConfig, null, 2)}\n`, "utf8");

  const referencedAssets = await collectReferencedAssetPaths(dist);
  await copyReferencedAssets(referencedAssets);

  const serverDir = join(dist, "server");
  const serverPublicDir = join(serverDir, "public");

  await mkdir(serverPublicDir, { recursive: true });

  for (const entry of await readdir(dist, { withFileTypes: true })) {
    if (entry.name === "server") continue;
    await cp(join(dist, entry.name), join(serverPublicDir, entry.name), { recursive: true });
  }

  await writeFile(join(serverDir, "index.js"), workerEntrypoint, "utf8");

  console.log(`Built ${pages.length} pages into ${dist}`);
}

await buildSite();
