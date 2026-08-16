import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { pages } from "./pages.mjs";
import { resolveCanonicalRedirect, resolveLegacyRedirect } from "./redirects.mjs";
import { securityHeaders } from "./security.mjs";
import {
  isMemberAreaPath,
  memberAssetCandidates,
  memberCacheControl,
  memberSecurityHeaders
} from "./member-area.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const canonicalRoutes = pages.map((page) => page.route);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  // Ab hier: Dateitypen des App-Web-Exports unter /member/
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".wasm": "application/wasm",
  ".map": "application/json; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(root, clean);
}

async function resolveFile(urlPath) {
  let filePath = safePath(urlPath);
  const fileStat = await stat(filePath).catch(() => null);
  if (fileStat?.isDirectory()) {
    filePath = join(filePath, "index.html");
  } else if (!extname(filePath)) {
    filePath = join(filePath, "index.html");
  }
  const finalStat = await stat(filePath).catch(() => null);
  return finalStat?.isFile() ? filePath : join(root, "index.html");
}

function applySecurityHeaders(res, headers = securityHeaders) {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

// Vorschau der Member Area: dieselbe Auflösungsreihenfolge wie im
// Cloudflare-Worker (src/member-area.mjs), damit lokal nichts funktioniert,
// was live scheitern würde — und umgekehrt.
async function resolveMemberFile(pathname) {
  for (const candidate of memberAssetCandidates(pathname)) {
    const filePath = safePath(candidate);
    const fileStat = await stat(filePath).catch(() => null);

    if (fileStat?.isFile()) {
      return filePath;
    }
  }

  return null;
}

async function serveMemberArea(req, res, pathname) {
  const filePath = await resolveMemberFile(pathname);

  applySecurityHeaders(res, memberSecurityHeaders);
  res.setHeader("Cache-Control", memberCacheControl(pathname));

  if (!filePath) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not found");
    return;
  }

  res.setHeader("Content-Type", types[extname(filePath)] || "application/octet-stream");
  createReadStream(filePath)
    .on("error", () => {
      res.statusCode = 500;
      res.end("Internal Server Error");
    })
    .pipe(res);
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");

  if (isMemberAreaPath(requestUrl.pathname)) {
    await serveMemberArea(req, res, requestUrl.pathname);
    return;
  }

  const redirectTarget =
    resolveLegacyRedirect(requestUrl.pathname) ||
    resolveCanonicalRedirect(requestUrl.pathname, canonicalRoutes);

  if (redirectTarget) {
    applySecurityHeaders(res);
    res.statusCode = 301;
    res.setHeader("Location", `${redirectTarget}${requestUrl.search}`);
    res.end();
    return;
  }

  const filePath = await resolveFile(req.url || "/");
  applySecurityHeaders(res);
  res.setHeader("Content-Type", types[extname(filePath)] || "application/octet-stream");
  createReadStream(filePath)
    .on("error", () => {
      res.statusCode = 500;
      res.end("Internal Server Error");
    })
    .pipe(res);
});

server.listen(port, host, () => {
  console.log(`Camp Dörfl website running at http://${host}:${port}`);
});
