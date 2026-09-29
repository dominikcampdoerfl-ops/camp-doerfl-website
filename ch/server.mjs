/**
 * Vorschau-Server für campdoerfl.ch. Liest ausschliesslich aus dist-ch/ und
 * setzt dieselben Kopfzeilen wie der Worker, damit lokal nichts funktioniert,
 * was live scheitern würde.
 *
 *   node ch/server.mjs        → http://127.0.0.1:4190
 */

import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist-ch");
const port = Number(process.env.CH_PORT || 4190);
const host = process.env.CH_HOST || "127.0.0.1";

// Der Build legt die Kopfzeilen des Workers ab; die Vorschau benutzt genau
// dieselben. Fehlt die Datei, läuft die Vorschau mit dem Nötigsten weiter.
let kopfzeilen = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

try {
  kopfzeilen = JSON.parse(await readFile(join(wurzel, "server", "kopfzeilen.json"), "utf8"));
} catch {
  console.warn("[ch] server/kopfzeilen.json fehlt — erst \"node ch/build.mjs\" laufen lassen.");
}

const typen = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function sicherePfad(adresse) {
  const roh = decodeURIComponent(adresse.split("?")[0]);
  return join(wurzel, normalize(roh).replace(/^(\.\.[/\\])+/, ""));
}

const server = createServer(async (anfrage, antwort) => {
  const adresse = new URL(anfrage.url || "/", "http://localhost");
  let pfad = adresse.pathname;

  if (pfad === "/" || pfad === "") {
    pfad = "/index.html";
  }

  let datei = sicherePfad(pfad);
  let stand = await stat(datei).catch(() => null);

  if (stand?.isDirectory()) {
    datei = join(datei, "index.html");
    stand = await stat(datei).catch(() => null);
  }

  for (const [name, wert] of Object.entries(kopfzeilen)) {
    antwort.setHeader(name, wert);
  }

  if (!stand?.isFile()) {
    const vierNullVier = join(wurzel, "404.html");
    const hat404 = await stat(vierNullVier).catch(() => null);
    antwort.statusCode = 404;
    antwort.setHeader("Content-Type", "text/html; charset=utf-8");
    if (hat404?.isFile()) {
      createReadStream(vierNullVier).pipe(antwort);
    } else {
      antwort.end("Not found");
    }
    return;
  }

  antwort.setHeader("Content-Type", typen[extname(datei)] || "application/octet-stream");
  createReadStream(datei)
    .on("error", () => {
      antwort.statusCode = 500;
      antwort.end("Internal Server Error");
    })
    .pipe(antwort);
});

server.listen(port, host, () => {
  console.log(`Camp Dörfl Schweiz: http://${host}:${port}`);
});

export { server };
