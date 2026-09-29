/**
 * Prüft den veröffentlichten Stand unter campdoerfl.at.
 *
 *   npm run at:live
 *
 * Warum zusätzlich zu at/pruefen.mjs: Dort läuft der Worker gegen ein
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
const dist = pfadAufloesen(hier, "..", "dist-at");
const host = new URL(marke.url).hostname;

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
        headers: { Host: hostname, "User-Agent": "camp-doerfl-at-livecheck" },
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

// Eine Form pro Adresse: die mit Schrägstrich am Ende.
const { unterseiten } = await import("./marke.mjs");

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

/* ------------------------------------------------------- robots.txt ----- */

// Cloudflare stellt der ausgelieferten robots.txt einen eigenen, verwalteten
// Block voran ("Managed robots.txt" / AI Crawl Control). Der steht nicht im
// Build und kann sich ohne Zutun ändern — deshalb wird hier geprüft, was
// wirklich ankommt, statt was gebaut wurde.
{
  const robots = await hole("/robots.txt");
  pruefe(robots.status === 200, `/robots.txt antwortet mit ${robots.status}.`);

  const zeilen = robots.koerper
    .split("\n")
    .map((z) => z.replace(/#.*$/, "").trim())
    .filter(Boolean);

  // Alle Gruppen sammeln, die für Googlebot gelten. Nach der Auslegung von
  // Google zählen dabei sämtliche passenden Gruppen zusammen.
  const verbote = [];
  let gilt = false;

  for (const zeile of zeilen) {
    const [feldRoh, ...restRoh] = zeile.split(":");
    const feld = feldRoh.trim().toLowerCase();
    const wert = restRoh.join(":").trim();

    if (feld === "user-agent") {
      gilt = wert === "*" || wert.toLowerCase() === "googlebot";
      continue;
    }
    if (gilt && feld === "disallow" && wert === "/") verbote.push(zeile);
  }

  pruefe(
    verbote.length === 0,
    `robots.txt sperrt Googlebot von der ganzen Seite aus: ${verbote.join(" / ")}`
  );
  pruefe(
    robots.koerper.includes(`Sitemap: https://${host}/sitemap.xml`),
    "In der ausgelieferten robots.txt fehlt der Verweis auf die Sitemap."
  );

  const signal = robots.koerper.match(/Content-Signal:\s*([^\n]+)/)?.[1];
  if (signal && !/search\s*=\s*yes/.test(signal)) {
    fehler.push(`Content-Signal erlaubt keine Suchindexierung: ${signal}`);
  }
}

/* ------------------------------- Bestätigungsdateien und Ähnliches ------ */

const oeffentlichVerzeichnis = join(hier, "oeffentlich");
const { readdir } = await import("node:fs/promises");
const { existsSync } = await import("node:fs");

if (existsSync(oeffentlichVerzeichnis)) {
  for (const eintrag of await readdir(oeffentlichVerzeichnis, { withFileTypes: true })) {
    if (!eintrag.isFile() || eintrag.name === "LIESMICH.md" || eintrag.name.startsWith(".")) continue;

    const soll = (await readFile(join(oeffentlichVerzeichnis, eintrag.name), "utf8")).trim();
    const ist = await hole(`/${eintrag.name}`);

    pruefe(ist.status === 200, `/${eintrag.name} antwortet mit ${ist.status} statt 200.`);
    pruefe(
      ist.koerper.trim() === soll,
      `/${eintrag.name} wird mit anderem Inhalt ausgeliefert als hinterlegt.\n      live: ${ist.koerper.trim().slice(0, 70)}\n      soll: ${soll.slice(0, 70)}`
    );
  }
}

/* ------------------------------------------------------- Kopfzeilen ----- */

const erwartet = JSON.parse(await readFile(join(dist, "server", "kopfzeilen.json"), "utf8"));
for (const [name, wert] of Object.entries(erwartet)) {
  pruefe(
    start.kopf[name.toLowerCase()] === wert,
    `Kopfzeile ${name} ist live anders als gebaut.\n      live: ${start.kopf[name.toLowerCase()]}\n      soll: ${wert}`
  );
}
pruefe(!start.kopf["x-robots-tag"], "Die echte Domain wird live auf noindex gesetzt.");

const symbolDatei = await hole("/favicon.ico");
pruefe(symbolDatei.status === 200, `/favicon.ico antwortet mit ${symbolDatei.status} statt 200.`);
pruefe(
  /icon/i.test(symbolDatei.kopf["content-type"] ?? ""),
  `/favicon.ico kommt als ${symbolDatei.kopf["content-type"]} an.`
);

const symbolPng = start.koerper.match(/\/assets\/at\/camp-doerfl-symbol-\d+-[a-f0-9]+\.png/)?.[0];
pruefe(Boolean(symbolPng), "Im ausgelieferten HTML steht kein PNG-Symbol.");
if (symbolPng) {
  const antwort = await hole(symbolPng);
  pruefe(antwort.status === 200, `${symbolPng} antwortet mit ${antwort.status}.`);
  pruefe(
    (antwort.kopf["content-type"] ?? "") === "image/png",
    `${symbolPng} kommt als ${antwort.kopf["content-type"]} an.`
  );
}

const einBild = start.koerper.match(/\/assets\/at\/[A-Za-z0-9.-]+\.(?:avif|webp|jpg)/)?.[0];
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
pruefe(
  start.koerper.trim() === gebaut.trim(),
  "Die ausgelieferte Seite ist nicht der Stand in dist-at/. Entweder fehlt ein Deploy oder es wurde seither gebaut."
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
    `${seite.href} wird nicht in dem Stand ausgeliefert, der in dist-at/ liegt.`
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

/* --------------------------------------------- Verweise nach außen ------ */

// Ein toter Verweis auf die Erfolgsliste oder die Geschichte würde genau das
// untergraben, wofür sie dastehen.
{
  const { erfolge, guenter } = await import("./marke.mjs");

  for (const adresse of [erfolge.quelle, guenter.link]) {
    try {
      const antwort = await fetch(adresse, { redirect: "follow", signal: AbortSignal.timeout(20000) });
      pruefe(antwort.ok, `${adresse} antwortet mit ${antwort.status}.`);
    } catch (ursache) {
      fehler.push(`${adresse} ist nicht erreichbar: ${ursache.message}`);
    }
  }
}

/* ------------------------------------------------------------ Bilanz ---- */

if (fehler.length) {
  console.error(`\n${fehler.length} Beanstandung(en) am Livestand:`);
  for (const meldung of fehler) console.error(`  · ${meldung}`);
  process.exit(1);
}

console.log(`https://${host}/ geprüft: Routen, Kopfzeilen, Zwischenspeicher und Inhalt stimmen mit dem Build überein.`);
