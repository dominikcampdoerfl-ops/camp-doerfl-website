import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { securityHeaders } from "./security.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
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

function applySecurityHeaders(res) {
  for (const [name, value] of Object.entries(securityHeaders)) {
    res.setHeader(name, value);
  }
}

const server = createServer(async (req, res) => {
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
