import { cp, mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "./pages.mjs";
import { site } from "./data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
await copyFile(join(root, "src", "styles.css"), join(dist, "assets", "styles.css"));
await copyFile(join(root, "src", "main.js"), join(dist, "assets", "main.js"));

for (const page of pages) {
  const outputDir = page.route === "/" ? dist : join(dist, page.route.replace(/^\/|\/$/g, ""));
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), page.render(), "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
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

console.log(`Built ${pages.length} pages into ${dist}`);
