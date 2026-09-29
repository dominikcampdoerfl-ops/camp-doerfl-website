/**
 * Prüft den veröffentlichten Stand unter campdoerfl.ch.
 *
 *   npm run ch:live
 *
 * Warum zusätzlich zu ch/pruefen.mjs: Dort läuft der Worker gegen ein
 * gestelltes ASSETS-Binding. Live liegt davor Cloudflares eigener Asset-Server,
 * und der bringt eigenes Verhalten mit. Genau daran hing beim ersten Deploy
 * eine Weiterleitungsschleife auf der Startseite: Auf /index.html antwortete
 * er mit 307 auf /, der Worker reichte das durch. Kein lokaler Test konnte das
 * sehen — dieser hier schon.
 *
 * Er löst absichtlich über 1.1.1.1 auf: Ein frisch angelegter DNS-Eintrag
 * hängt sonst am Negativ-Cache des eigenen Rechners.
 */

import { Resolver } from "node:dns/promises";
import { readFile } from "node:fs/promises";
import { request } from "node:https";
import { dirname, join, resolve as pfadAufloesen } from "node:path";
import { fileURLToPath } from "node:url";

import { marke } from "./marke.mjs";

const hier = dirname(fileURLToPath(import.meta.url));
const dist = pfadAufloesen(hier, "..", "dist-ch");
const host = new URL(marke.url).hostname;

const { unterseiten } = await import("./marke.mjs");

const fehler = [];
const pruefe = (bedingung, meldung) => {
  if (!bedingung) fehler.push(meldung);
};

const aufloeser = new Resolver();
aufloeser.setServers(["1.1.1.1", "8.8.8.8"]);

let adressen;
try {
  adressen = await aufloeser.resolve4(host);
} catch (ursache) {
  console.error(`${host} löst nicht auf: ${ursache.message}`);
  process.exit(1);
}

const ip = adressen[0];
console.log(`${host} → ${adressen.join(", ")}`);

/** Eine Anfrage an die echte Adresse, mit passendem SNI und Host-Kopf. */
function hole(pfad, { hostname = host, folgen = false } = {}) {
  return new Promise((erfuellen, ablehnen) => {
    const anfrage = request(
      {
        host: ip,
        servername: hostname,
        headers: { Host: hostname, "User-Agent": "camp-doerfl-ch-livecheck" },
        path: pfad,
        method: "GET",
        timeout: 20000
      },
      (antwort) => {
        const stuecke = [];
        antwort.on("data", (stueck) => stuecke.push(stueck));
        antwort.on("end", () =>
          erfuellen({
            status: antwort.statusCode,
            kopf: antwort.headers,
            koerper: Buffer.concat(stuecke).toString("utf8")
          })
        );
      }
    );
    anfrage.on("timeout", () => anfrage.destroy(new Error("Zeitüberschreitung")));
    anfrage.on("error", ablehnen);
    anfrage.end();
  });
}

/* ----------------------------------------------------------- Routen ----- */

const start = await hole("/");
pruefe(start.status === 200, `Die Startseite antwortet mit ${start.status} statt 200.`);
pruefe(
  !start.kopf.location,
  `Die Startseite leitet weiter — nach ${start.kopf.location}. Das ist eine Schleife.`
);
pruefe(
  (start.kopf["content-type"] ?? "").includes("text/html"),
  `Die Startseite liefert ${start.kopf["content-type"]} statt HTML.`
);

const faelle = [
  ["/index.html", 301, `https://${host}/`],
  ["/robots.txt", 200, null],
  ["/sitemap.xml", 200, null],
  ["/diese-seite-gibt-es-nicht/", 404, null],
  ["/diese-seite-gibt-es-nicht", 301, `https://${host}/diese-seite-gibt-es-nicht/`],
  ...unterseiten.flatMap((seite) => [
    [seite.href, 200, null],
    [seite.href.replace(/\/$/, ""), 301, `https://${host}${seite.href}`]
  ])
];

for (const [pfad, status, ziel] of faelle) {
  const antwort = await hole(pfad);
  pruefe(antwort.status === status, `${pfad} antwortet mit ${antwort.status} statt ${status}.`);
  if (ziel) pruefe(antwort.kopf.location === ziel, `${pfad} leitet nach ${antwort.kopf.location} statt ${ziel}.`);
}

const mitWww = await hole("/", { hostname: `www.${host}` });
pruefe(mitWww.status === 301, `www antwortet mit ${mitWww.status} statt 301.`);
pruefe(mitWww.kopf.location === `https://${host}/`, `www leitet nach ${mitWww.kopf.location}.`);

/* ------------------------------------------------------- Kopfzeilen ----- */

const erwartet = JSON.parse(await readFile(join(dist, "server", "kopfzeilen.json"), "utf8"));
for (const [name, wert] of Object.entries(erwartet)) {
  pruefe(
    start.kopf[name.toLowerCase()] === wert,
    `Kopfzeile ${name} ist live anders als gebaut.\n      live: ${start.kopf[name.toLowerCase()]}\n      soll: ${wert}`
  );
}
pruefe(!start.kopf["x-robots-tag"], "Die echte Domain wird live auf noindex gesetzt.");

const einBild = start.koerper.match(/\/assets\/ch\/[A-Za-z0-9.-]+\.(?:avif|webp|jpg)/)?.[0];
pruefe(Boolean(einBild), "Im ausgelieferten HTML steht kein einziges Bild.");
if (einBild) {
  const bild = await hole(einBild);
  pruefe(bild.status === 200, `${einBild} antwortet mit ${bild.status}.`);
  pruefe(
    (bild.kopf["cache-control"] ?? "").includes("immutable"),
    `${einBild} wird nicht dauerhaft zwischengespeichert.`
  );
}

/* ------------------------------------- Stimmt live mit dem Build überein? */

const gebaut = await readFile(join(dist, "index.html"), "utf8");

// Direkt nach einem Deploy hat nicht jeder Cloudflare-Knoten den neuen Stand
// schon geholt: Die erste Anfrage kann noch die vorherige Fassung treffen.
// Deshalb wird hier ein paarmal nachgefasst, bevor das als Fehler gilt — ein
// Prüflauf, der grundlos Alarm schlägt, wird beim nächsten Mal ignoriert.
let ausgeliefert = start.koerper;
let stimmtUeberein = ausgeliefert.trim() === gebaut.trim();

for (let versuch = 1; versuch <= 5 && !stimmtUeberein; versuch += 1) {
  console.log(`Der Knoten liefert noch den vorherigen Stand — neuer Versuch in 6 s (${versuch}/5).`);
  await new Promise((r) => setTimeout(r, 6000));
  ausgeliefert = (await hole("/")).koerper;
  stimmtUeberein = ausgeliefert.trim() === gebaut.trim();
}

pruefe(
  stimmtUeberein,
  "Die ausgelieferte Seite ist auch nach mehreren Versuchen nicht der Stand in dist-ch/. Entweder fehlt ein Deploy oder es wurde seither gebaut."
);

/* -------------------------------------------------- Unterseiten --------- */

// Was live ankommt, muss dem Build entsprechen — und die eigene CSP darf das
// eigene Markup nicht blockieren. Deshalb wird geprüft, dass keine
// data:-Ressourcen übrig sind und die Schriften als Dateien kommen.
for (const seite of unterseiten) {
  const antwort = await hole(seite.href);
  pruefe(antwort.status === 200, `${seite.href} antwortet mit ${antwort.status}.`);
  if (antwort.status !== 200) continue;

  const gebaut = await readFile(join(dist, seite.href.replace(/^\/|\/$/g, ""), "index.html"), "utf8");
  pruefe(
    antwort.koerper.trim() === gebaut.trim(),
    `${seite.href} wird nicht in dem Stand ausgeliefert, der in dist-ch/ liegt.`
  );
  pruefe(
    !/data:(?:font|image)/.test(antwort.koerper),
    `${seite.href} liefert noch eingebettete Schriften oder Bilder aus.`
  );
  pruefe(
    antwort.koerper.includes("/assets/fonts/"),
    `${seite.href} bezieht die Schriften nicht aus /assets/fonts/.`
  );

  const sitemapAntwort = await hole("/sitemap.xml");
  const indexierbar = !/content="[^"]*noindex/i.test(antwort.koerper);
  pruefe(
    sitemapAntwort.koerper.includes(`https://${host}${seite.href}`) === indexierbar,
    `${seite.href}: Sitemap-Eintrag und robots-Angabe passen nicht zusammen.`
  );
}

/* ------------------------------------------------------------ Bilanz ---- */

if (fehler.length) {
  console.error(`\n${fehler.length} Beanstandung(en) am Livestand:`);
  for (const meldung of fehler) console.error(`  · ${meldung}`);
  process.exit(1);
}

console.log(`https://${host}/ geprüft: Routen, Kopfzeilen, Zwischenspeicher und Inhalt stimmen mit dem Build überein.`);
