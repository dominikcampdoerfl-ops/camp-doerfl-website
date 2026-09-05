import { cp, mkdir, rm, writeFile, copyFile, readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "./pages.mjs";
import { encodePath, site } from "./data.mjs";
import { legacyRedirectRules } from "./redirects.mjs";
import { securityHeaders } from "./security.mjs";
import {
  MEMBER_BASE_PATH,
  MEMBER_BUILD_MANIFEST,
  MEMBER_SOURCE_DIR,
  isMemberAreaPath,
  memberAssetCandidates,
  memberCacheControl,
  memberSecurityHeaders
} from "./member-area.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const maxCloudflareAssetBytes = 25 * 1024 * 1024;
const productionHost = new URL(site.url).hostname;
const canonicalRoutes = pages.map((page) => page.route);
const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
const workerEntrypoint = `const productionHost = ${JSON.stringify(productionHost)};
const apexHost = ${JSON.stringify(site.domain)};
const canonicalRoutes = ${JSON.stringify(canonicalRoutes, null, 2)};
const legacyRedirectRules = ${JSON.stringify(legacyRedirectRules, null, 2)};
const securityHeaders = ${JSON.stringify(securityHeaders, null, 2)};
const memberSecurityHeaders = ${JSON.stringify(memberSecurityHeaders, null, 2)};

// Aus src/member-area.mjs übernommen, damit Worker, Build und Vorschau-Server
// dieselbe Pfadauflösung benutzen.
const isMemberAreaPath = ${isMemberAreaPath.toString()};
const memberAssetCandidates = ${memberAssetCandidates.toString()};
const memberCacheControl = ${memberCacheControl.toString()};

function secureResponse(response, requestUrl = "") {
  const secured = new Response(response.body, response);
  const pathname = requestUrl ? new URL(requestUrl).pathname : "";
  const isMemberArea = pathname ? isMemberAreaPath(pathname) : false;

  for (const [name, value] of Object.entries(isMemberArea ? memberSecurityHeaders : securityHeaders)) {
    secured.headers.set(name, value);
  }

  if (isMemberArea) {
    secured.headers.set("Cache-Control", memberCacheControl(pathname));
  } else if (pathname.startsWith("/assets/")) {
    secured.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (secured.headers.get("Content-Type")?.includes("text/html")) {
    secured.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  return secured;
}

// Die Member Area ist der Web-Export der App: eigene Routen, eigene Dateinamen,
// eigener Fallback. Sie läuft deshalb vor allen Website-Regeln und komplett an
// den Weiterleitungen der Marketingseiten vorbei.
async function serveMemberArea(request, env, pathname) {
  for (const candidate of memberAssetCandidates(pathname)) {
    const response = await env.ASSETS.fetch(assetRequest(request, candidate));

    if (response.status !== 404) {
      return secureResponse(response, request.url);
    }
  }

  return secureResponse(new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  }), request.url);
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

  let normalized = decodedPathname.normalize("NFC").toLowerCase().replace(/\\/{2,}/g, "/");
  normalized = normalized.replace(/\\/index\\.html?$/, "/").replace(/\\.html?$/, "");

  if (normalized === "/") {
    return normalized;
  }

  return normalized.endsWith("/") ? normalized : normalized + "/";
}

function resolveCanonicalRedirect(pathname) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  if (!normalizedPathname) {
    return null;
  }

  const canonicalTarget = canonicalRoutes.find(
    (route) => normalizeLegacyPathname(route) === normalizedPathname
  );

  if (!canonicalTarget) {
    return null;
  }

  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(pathname).normalize("NFC");
  } catch {
    return null;
  }

  return decodedPathname === canonicalTarget ? null : canonicalTarget;
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
    if (rule.descendantsOnly) {
      if (normalizedPathname !== rule.from && normalizedPathname.startsWith(rule.from)) {
        return rule.to;
      }

      continue;
    }

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

function canonicalPathRedirect(request) {
  const url = new URL(request.url);
  const targetPathname = resolveCanonicalRedirect(url.pathname);

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

const conversionEvents = new Set([
  "primary_cta",
  "contact_link",
  "form_start",
  "form_success",
  "form_error",
  "ai_referral"
]);

async function recordConversion(request, env) {
  if (request.method !== "POST") {
    return secureResponse(new Response("Method not allowed", { status: 405 }), request.url);
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return secureResponse(new Response("Forbidden", { status: 403 }), request.url);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > 2048) {
    return secureResponse(new Response("Payload too large", { status: 413 }), request.url);
  }

  const payload = await request.json().catch(() => null);
  const event = typeof payload?.event === "string" ? payload.event : "";
  if (!conversionEvents.has(event)) {
    return secureResponse(new Response("Invalid event", { status: 400 }), request.url);
  }

  const clean = (value, max = 180) => typeof value === "string" ? value.slice(0, max) : "";
  console.log(JSON.stringify({
    type: "camp_conversion",
    event,
    path: clean(payload.path),
    target: clean(payload.target),
    topic: clean(payload.topic, 100),
    source: clean(payload.source, 100),
    device: clean(payload.device, 20)
  }));

  return secureResponse(new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" }
  }), request.url);
}

export default {
  async fetch(request, env) {
    const memberUrl = new URL(request.url);

    if (isMemberAreaPath(memberUrl.pathname)) {
      // Auf die kanonische Domain führen, bevor die App lädt: Die Sitzung liegt
      // im localStorage und gilt nur pro Herkunft — ein Wechsel von der
      // Apex-Domain auf www würde die Anmeldung verlieren.
      return canonicalHttpsRedirect(request) || serveMemberArea(request, env, memberUrl.pathname);
    }

    const redirect = legacyContentRedirect(request) || canonicalPathRedirect(request) || canonicalHttpsRedirect(request);

    if (redirect) {
      return redirect;
    }

    // Google-Search-Console-Verifizierung: Die Datei muss unter exakt
    // /google….html mit Status 200 antworten. Cloudflares Asset-Serving
    // leitet .html-Pfade sonst per 307 auf die Clean-URL um, was die
    // Verifizierung scheitern lässt – daher den Inhalt direkt ausliefern.
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === "/api/conversion") {
      return recordConversion(request, env);
    }

    if (/^\\/google[0-9a-f]+\\.html$/.test(requestUrl.pathname)) {
      const direct = await env.ASSETS.fetch(
        assetRequest(request, requestUrl.pathname.replace(/\\.html$/, ""))
      );

      if (direct.status !== 404) {
        return secureResponse(direct, request.url);
      }
    }

    let response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return secureResponse(response, request.url);
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
    return response.status === 404 ? notFound() : secureResponse(response, request.url);
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

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function collectVideoObjects(value, videos = []) {
  if (!value || typeof value !== "object") return videos;
  if (value["@type"] === "VideoObject") videos.push(value);
  Object.values(value).forEach((child) => collectVideoObjects(child, videos));
  return videos;
}

// Der Web-Export der App liegt in `member-app/` und ist bewusst nicht im Git —
// er entsteht bei jedem Release neu (App-Repo: `npm run export:web`).
async function readMemberBuild() {
  const manifestPath = join(root, MEMBER_SOURCE_DIR, MEMBER_BUILD_MANIFEST);

  if (!(await pathExists(manifestPath))) {
    return null;
  }

  try {
    return JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    console.warn(`Member Area: ${MEMBER_BUILD_MANIFEST} ist unlesbar — Versionshinweis entfällt.`);
    return null;
  }
}

// Steht klein unter dem Login-Fenster, damit erkennbar ist, welcher App-Stand
// gerade im Browser läuft.
function memberBuildNote(memberBuild) {
  if (!memberBuild?.version) {
    return "";
  }

  const exportedAt = new Date(memberBuild.exportedAt ?? "");
  const stand = Number.isNaN(exportedAt.valueOf())
    ? ""
    : ` &middot; Stand ${exportedAt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`;

  return `<p class="member-login__build">Camp Dörfl App ${memberBuild.version}${stand}</p>`;
}

async function copyMemberArea() {
  const sourceDir = join(root, MEMBER_SOURCE_DIR);

  if (!(await pathExists(sourceDir))) {
    console.warn(
      `Member Area fehlt: Ordner "${MEMBER_SOURCE_DIR}/" nicht gefunden — ${MEMBER_BASE_PATH}/ wird nicht ausgeliefert.\n` +
        "  Web-Build der App erzeugen: im App-Repo \"npm run export:web\" ausführen."
    );
    return 0;
  }

  const targetDir = join(dist, MEMBER_BASE_PATH.replace(/^\/+/, ""));
  await copyDeployableAssets(sourceDir, targetDir);

  return (await collectFiles(targetDir, () => true)).length;
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
  // Ein Name darf einen Unterordner enthalten: Er ist der Pfad unterhalb von
  // src/ und wird unter derselben Kennung ausgeliefert. So bekommen die selbst
  // gehosteten GSAP-Dateien dieselbe Cache-Behandlung wie styles.css — wird die
  // Bibliothek ausgetauscht, ändert sich die Kennung mit.
  const coreAssetNames = [
    "styles.css",
    "mobile-overrides.css",
    "design-contract.css",
    "main.js",
    "contact-topics.js",
    "vendor/gsap/gsap.min.js",
    "vendor/gsap/ScrollTrigger.min.js"
  ];
  const coreAssetContents = await Promise.all(coreAssetNames.map((name) => readFile(join(root, "src", name))));
  // Die Schriften liegen unter einer festen Adresse und werden ein Jahr lang als
  // "immutable" ausgeliefert. Ohne eigene Kennung bekaemen wiederkehrende Besucher
  // nach einem Austausch weiter die alten Dateien aus dem Cache. Die Kennung wird
  // getrennt von assetVersion gebildet, damit eine reine CSS-Aenderung die
  // Schriften nicht unnoetig erneut laden laesst.
  const fontDir = join(root, "assets", "fonts");
  const fontNames = (await pathExists(fontDir))
    ? (await readdir(fontDir)).filter((name) => name.endsWith(".woff2")).sort()
    : [];
  const fontContents = await Promise.all(fontNames.map((name) => readFile(join(fontDir, name))));
  const fontVersion = fontNames.length
    ? `f-${createHash("sha256").update(Buffer.concat(fontContents)).digest("hex").slice(0, 12)}`
    : "";

  // Die Schriftkennung geht in die Asset-Version ein: Die Schrift-Adressen werden
  // erst beim Kopieren in das CSS geschrieben, die Quelldatei bleibt unveraendert.
  // Ohne diesen Zusatz behielte das CSS seine Adresse und wiederkehrende Besucher
  // bekaemen ein Jahr lang die alte Fassung mit den alten Schriften aus dem Cache.
  const assetVersion = `v-${createHash("sha256")
    .update(Buffer.concat(coreAssetContents))
    .update(fontVersion)
    .digest("hex")
    .slice(0, 12)}`;

  const versionedAssetDir = join(dist, "assets", assetVersion);
  await mkdir(versionedAssetDir, { recursive: true });
  await Promise.all(
    coreAssetNames.map(async (name) => {
      const zielPfad = join(versionedAssetDir, name);
      // Namen mit Unterordner brauchen ihr Verzeichnis, bevor kopiert wird.
      await mkdir(dirname(zielPfad), { recursive: true });

      if (!fontVersion || !name.endsWith(".css")) {
        return copyFile(join(root, "src", name), zielPfad);
      }
      const inhalt = await readFile(join(root, "src", name), "utf8");
      const mitKennung = inhalt.replaceAll(
        /\/assets\/fonts\/([A-Za-z0-9._-]+\.woff2)/g,
        `/assets/fonts/$1?${fontVersion}`
      );
      return writeFile(zielPfad, mitKennung, "utf8");
    })
  );

  const memberBuild = await readMemberBuild();
  const memberBuildNoteMarkup = memberBuildNote(memberBuild);

  const renderedPages = new Map();
  for (const page of pages) {
    const outputDir = page.route === "/" ? dist : join(dist, page.route.replace(/^\/|\/$/g, ""));
    await mkdir(outputDir, { recursive: true });
    const html = page
      .render()
      .replaceAll("__ASSET_VERSION__", assetVersion)
      .replaceAll("__FONT_VERSION__", fontVersion)
      .replaceAll("__MEMBER_APP_BUILD_NOTE__", memberBuildNoteMarkup);
    renderedPages.set(page.route, html);
    await writeFile(join(outputDir, "index.html"), html, "utf8");
  }

  const sitemapPages = pages.filter((page) => page.includeInSitemap !== false);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
    .map(
      (page) => `  <url>
    <loc>${site.url}${encodePath(page.route)}</loc>
    <lastmod>${page.lastModified || "2026-08-11"}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");

  const videoEntries = sitemapPages.flatMap((page) => {
    const html = renderedPages.get(page.route) || "";
    const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((match) => {
        try {
          return collectVideoObjects(JSON.parse(match[1]));
        } catch {
          return [];
        }
      });

    return structuredData.map((video) => ({ page, video }));
  });
  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries.map(({ page, video }) => `  <url>
    <loc>${escapeXml(`${site.url}${encodePath(page.route)}`)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(Array.isArray(video.thumbnailUrl) ? video.thumbnailUrl[0] : video.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.name)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:player_loc>${escapeXml(video.embedUrl)}</video:player_loc>
      <video:publication_date>${escapeXml(video.uploadDate)}</video:publication_date>
    </video:video>
  </url>`).join("\n")}
</urlset>`;
  await writeFile(join(dist, "video-sitemap.xml"), videoSitemap, "utf8");
  await writeFile(
    join(dist, "robots.txt"),
    `# AI search, live retrieval and model crawlers are explicitly welcome.
# Public pages remain governed by their page-level robots meta tags.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
Sitemap: ${site.url}/video-sitemap.xml
# AI site guide: ${site.url}/llms.txt
`,
    "utf8"
  );

  const llmsTxt = `# ${site.name}

> ${site.description}

Camp Dörfl is a public German-language website for personal training, body analysis, corporate fitness, events and the Camp Dörfl App in Nürnberg. AI search engines, assistants and retrieval systems may crawl, quote and link to the public content.

## Core services

- [Home](${site.url}/): Overview of Camp Dörfl and all services
- [Körperanalyse Nürnberg](${site.url}/koerperanalyse-nuernberg/): 2D body analysis, InBody BIA measurement and personal evaluation
- [Personal Trainer Nürnberg](${site.url}/personal-trainer-nuernberg/): Premium personal training and coaching
- [Firmenfitness deutschlandweit](${site.url}/firmenfitness/): Germany-wide corporate health days, InBody consultation, workplace-specific nutrition talks and team activation
- [Gesundheitstag Nürnberg](${site.url}/gesundheitstag-nuernberg/): Health-day formats for companies
- [Moderator Nürnberg](${site.url}/moderator-nuernberg/): Event moderation and stage formats
- [Camp Dörfl App](${site.url}/app/): Training, nutrition and progress tracking
- [About Dominik Dörfl](${site.url}/ueber-dominik/): Coach, athlete and moderator profile
- [Expert knowledge hub](${site.url}/expertenwissen/): Source-backed guides by Dominik Dörfl
- [How to choose a personal trainer](${site.url}/personal-trainer-auswaehlen-nuernberg/): Seven verifiable selection criteria
- [Bodybuilding contest prep duration](${site.url}/bodybuilding-wettkampfvorbereitung-dauer/): Evidence-informed planning guide
- [BIA, InBody and 2D body analysis](${site.url}/bia-inbody-koerperanalyse-vergleich/): Methods, benefits and limitations
- [Editorial guidelines](${site.url}/redaktionelle-richtlinien/): Authorship, sourcing, corrections and commercial transparency
- [Press and media](${site.url}/presse-medien/): Citable facts, media material and direct contact
- [Contact](${site.url}/kontakt/): Enquiries and contact options

## Expert identity

- Dominik Dörfl is the founder of Camp Dörfl and works as a personal trainer, bodybuilding and performance coach in Nürnberg.
- Publicly documented fields: personal training, bodybuilding contest preparation, strength training, body analysis, sports nutrition, corporate fitness and endurance performance.
- Claims and external evidence are linked from the canonical profile at ${site.url}/ueber-dominik/.
- Fachartikel clearly identify their author, review date and primary sources.

## Discovery

- [XML sitemap](${site.url}/sitemap.xml)
- Canonical public URL: ${site.url}/
- Primary language: German (de-DE)
- Service area: Nürnberg, Fürth and Erlangen, Germany
`;

  await writeFile(join(dist, "llms.txt"), llmsTxt, "utf8");

  const indexNowKey = "campdoerfl-indexnow-2026";
  await writeFile(join(dist, `${indexNowKey}.txt`), indexNowKey, "utf8");

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

  // Erst nach der Asset-Suche: Der Web-Export der App bringt seine Dateien
  // fertig referenziert mit und soll nicht gegen die Website-Assets geprüft werden.
  const memberFileCount = await copyMemberArea();

  const serverDir = join(dist, "server");
  const serverPublicDir = join(serverDir, "public");

  await mkdir(serverPublicDir, { recursive: true });

  for (const entry of await readdir(dist, { withFileTypes: true })) {
    if (entry.name === "server") continue;
    await cp(join(dist, entry.name), join(serverPublicDir, entry.name), { recursive: true });
  }

  await writeFile(join(serverDir, "index.js"), workerEntrypoint, "utf8");

  console.log(`Built ${pages.length} pages into ${dist}`);

  if (memberFileCount > 0) {
    console.log(
      `Member Area: ${memberFileCount} Dateien unter ${MEMBER_BASE_PATH}/ ` +
        `(Camp Dörfl App ${memberBuild?.version ?? "unbekannt"}, Commit ${memberBuild?.commit ?? "unbekannt"})`
    );
  }
}

await buildSite();
