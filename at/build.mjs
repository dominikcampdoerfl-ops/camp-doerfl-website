/**
 * Build für campdoerfl.at.
 *
 * Getrennt von src/build.mjs. Er liest nichts aus src/, schreibt nichts nach
 * dist/ und rührt keine Datei der deutschen Website an. Gemeinsam benutzt
 * werden nur die Dateien unter assets/ — und die werden ausschließlich gelesen.
 *
 *   node at/build.mjs
 */

import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, writeFile, copyFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { marke, sprachfassungen } from "./marke.mjs";
import { seite } from "./seite.mjs";
import { bildWerk } from "./bilder.mjs";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, "..");
const ziel = join(wurzel, "dist-at");
const kernDateien = ["styles.css", "main.js"];

async function vorhanden(pfad) {
  return Boolean(await stat(pfad).catch(() => null));
}

function kennung(...teile) {
  const hash = createHash("sha256");
  for (const teil of teile) hash.update(teil);
  return hash.digest("hex").slice(0, 12);
}

/** Sicherheitskopfzeilen. Eigene Fassung — die der .de-Seite passt hier nicht. */
function kopfzeilen(skriptHashes, stilHashes) {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    // Kein 'unsafe-inline'. Der einzige eingebettete <script>-Block sind die
    // strukturierten Daten; er steht als Hash in der Richtlinie.
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://formsubmit.co",
      `script-src 'self' ${skriptHashes.map((hash) => `'${hash}'`).join(" ")}`.trim(),
      `style-src 'self' ${stilHashes.map((hash) => `'${hash}'`).join(" ")}`.trim(),
      "font-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self' https://formsubmit.co",
      "upgrade-insecure-requests"
    ].join("; ")
  };
}

function arbeiter(sicherheit) {
  return `const kopfzeilen = ${JSON.stringify(sicherheit, null, 2)};
const produktionsHost = ${JSON.stringify(new URL(marke.url).hostname)};

function gesichert(antwort, pfad, nurZumTesten = false) {
  const neu = new Response(antwort.body, antwort);

  for (const [name, wert] of Object.entries(kopfzeilen)) {
    neu.headers.set(name, wert);
  }

  if (nurZumTesten) {
    neu.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Nur erfolgreiche Antworten dürfen ein Jahr lang liegen bleiben — ein
  // versehentliches 404 wäre sonst genauso lange zementiert.
  if (pfad.startsWith("/assets/") && antwort.ok) {
    neu.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (neu.headers.get("Content-Type")?.includes("text/html")) {
    neu.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  return neu;
}

function umleiten(ziel) {
  return new Response(null, { status: 301, headers: { Location: ziel, ...kopfzeilen } });
}

function anfrage(original, pfad) {
  const adresse = new URL(original.url);
  adresse.pathname = pfad;
  adresse.search = "";
  return new Request(adresse.toString(), original);
}

export default {
  async fetch(request, env) {
    const adresse = new URL(request.url);
    const istProduktion = adresse.hostname === produktionsHost || adresse.hostname === "www." + produktionsHost;

    // Eine kanonische Adresse: https, ohne www.
    if (istProduktion && (adresse.protocol !== "https:" || adresse.hostname !== produktionsHost)) {
      adresse.protocol = "https:";
      adresse.hostname = produktionsHost;
      return umleiten(adresse.toString());
    }

    let pfad = adresse.pathname;

    try {
      pfad = decodeURIComponent(pfad);
    } catch {
      return gesichert(new Response("Bad request", { status: 400 }), "/");
    }

    // Der Worker ist zusätzlich unter workers.dev erreichbar. Dort steht
    // dieselbe Seite — für Suchmaschinen wäre das eine zweite Fassung.
    const nurZumTesten = !istProduktion;

    // Eine Form pro Adresse, und zwar die mit Schrägstrich am Ende — so wie es
    // die übrigen Camp-Dörfl-Seiten halten und wie es in den Canonicals steht.
    // /index.html und die Form ohne Schrägstrich leiten dorthin um.
    if (pfad.endsWith("/index.html")) {
      return umleiten(new URL(pfad.replace(/index\\.html$/, ""), adresse).toString() + adresse.search);
    }

    // Ohne Schrägstrich und ohne Dateiendung: auf die Form mit Schrägstrich.
    if (pfad !== "/" && !pfad.endsWith("/") && !pfad.slice(pfad.lastIndexOf("/")).includes(".")) {
      return umleiten(new URL(pfad + "/", adresse).toString() + adresse.search);
    }

    // Verzeichnisadressen holen ihre index.html selbst — html_handling steht
    // auf "none", der Asset-Server tut das nicht von sich aus.
    if (pfad.endsWith("/")) {
      const antwort = await env.ASSETS.fetch(anfrage(request, pfad + "index.html"));

      if (antwort.status !== 404) {
        return gesichert(antwort, pfad, nurZumTesten);
      }

      const seite404 = await env.ASSETS.fetch(anfrage(request, "/404.html"));
      return gesichert(
        new Response(seite404.body, { status: 404, headers: seite404.headers }),
        pfad,
        nurZumTesten
      );
    }

    const antwort = await env.ASSETS.fetch(anfrage(request, pfad));

    if (antwort.status === 404) {
      const seite404 = await env.ASSETS.fetch(anfrage(request, "/404.html"));
      return gesichert(
        new Response(seite404.body, { status: 404, headers: seite404.headers }),
        pfad,
        nurZumTesten
      );
    }

    return gesichert(antwort, pfad, nurZumTesten);
  }
};
`;
}

const seite404 = `<!doctype html>
<html lang="de-AT">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Seite nicht gefunden | Camp Dörfl</title>
    <meta name="robots" content="noindex, follow">
    <link rel="stylesheet" href="/assets/__ASSET_VERSION__/styles.css">
  </head>
  <body>
    <main class="flaeche dunkel" style-placeholder>
      <div class="schacht" >
        <p class="marke-zeile">Fehler 404</p>
        <h1 class="anzeige anzeige--2">Diese Seite<br>gibt es nicht.</h1>
        <p class="lauftext">Camp Dörfl Österreich ist eine einzige Seite. Von hier geht es zurück zum Anfang.</p>
        <p><a class="knopf knopf--gold" href="/">Zur Startseite <span class="knopf__pfeil" aria-hidden="true">&rarr;</span></a></p>
      </div>
    </main>
  </body>
</html>
`;

/**
 * Eigenständige Unterseiten aus at/seiten/.
 *
 * Sie bringen Markup, CSS und JavaScript selbst mit. Der Build schreibt sie
 * nicht um — er lagert nur die eingebetteten Bilder aus (sonst wiegt eine
 * einzige Seite ein Megabyte) und sammelt die Hashes der eingebetteten Blöcke
 * für die Sicherheitsrichtlinie ein.
 */
async function unterseitenBauen(ziel, schriftNamen, schriftInhalte, schriftVersion) {
  const quelle = join(hier, "seiten");

  if (!(await vorhanden(quelle))) return [];

  const seiten = [];

  for (const eintrag of (await readdir(quelle, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!eintrag.isFile() || !eintrag.name.endsWith(".html")) continue;

    const route = `/${eintrag.name.replace(/\.html$/, "")}/`;
    let html = await readFile(join(quelle, eintrag.name), "utf8");

    // Eingebettete Schriften ersetzen. Sie sind byte-identisch mit denen unter
    // assets/fonts/, die die Seite ohnehin ausliefert — als data: wögen sie
    // rund 200 KB pro Aufruf, als Datei liegen sie ein Jahr im Cache und sind
    // für jeden, der vorher die Startseite gesehen hat, schon da. Zugleich
    // bleibt font-src in der Richtlinie auf 'self' und braucht kein data:.
    for (const treffer of [...html.matchAll(/@font-face\s*\{[^}]*\}/g)]) {
      const block = treffer[0];
      const daten = block.match(/base64,([A-Za-z0-9+/=]+)/)?.[1];
      if (!daten) continue;

      const rohdaten = Buffer.from(daten, "base64");
      const passend = schriftNamen.find((name) => schriftInhalte[schriftNamen.indexOf(name)].equals(rohdaten));

      if (!passend) {
        console.warn(
          `  ${route}: eine eingebettete Schrift hat keine Entsprechung unter assets/fonts/ und bleibt eingebettet.`
        );
        continue;
      }

      html = html.replace(
        block,
        block.replace(
          /src:\s*url\(([^)]*base64[^)]*)\)/,
          `src: url("/assets/fonts/${passend}${schriftVersion ? `?${schriftVersion}` : ""}")`
        )
      );
    }

    // Eingebettete Bilder auslagern: aus data: wird eine Datei mit
    // Inhaltskennung, die ein Jahr lang zwischengespeichert werden darf.
    const bilderZiel = join(ziel, "assets", "at");
    await mkdir(bilderZiel, { recursive: true });
    let ausgelagert = 0;

    const treffer = [...html.matchAll(/data:image\/([a-z+]+);base64,([A-Za-z0-9+/=]+)/g)];
    const ersetzungen = new Map();

    for (const [ganz, typ, daten] of treffer) {
      if (ersetzungen.has(ganz)) continue;
      const rohdaten = Buffer.from(daten, "base64");
      const endung = typ === "svg+xml" ? "svg" : typ === "jpeg" ? "jpg" : typ;
      const name = `eingebettet-${kennung(rohdaten)}.${endung}`;
      await writeFile(join(bilderZiel, name), rohdaten);
      ersetzungen.set(ganz, `/assets/at/${name}`);
      ausgelagert += 1;
    }

    for (const [von, nach] of ersetzungen) html = html.replaceAll(von, nach);

    const ordner = join(ziel, route.replace(/^\/|\/$/g, ""));
    await mkdir(ordner, { recursive: true });
    await writeFile(join(ordner, "index.html"), html, "utf8");

    seiten.push({
      route,
      html,
      ausgelagert,
      // Nur indexierbare Seiten gehören in die Sitemap.
      indexierbar: !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)
    });
  }

  return seiten;
}

export async function bauen() {
  const beginn = Date.now();

  await rm(ziel, { recursive: true, force: true });
  await mkdir(ziel, { recursive: true });

  /* --- Schriften ---------------------------------------------------------- */
  const cssRoh = await readFile(join(hier, "styles.css"), "utf8");
  const schriftNamen = [...new Set([...cssRoh.matchAll(/\/assets\/fonts\/([A-Za-z0-9._-]+\.woff2)/g)].map((t) => t[1]))].sort();
  const schriftInhalte = await Promise.all(
    schriftNamen.map((name) => readFile(join(wurzel, "assets", "fonts", name)))
  );
  const schriftVersion = schriftNamen.length ? `f-${kennung(Buffer.concat(schriftInhalte))}` : "";

  const schriftZiel = join(ziel, "assets", "fonts");
  await mkdir(schriftZiel, { recursive: true });
  await Promise.all(
    schriftNamen.map((name) => copyFile(join(wurzel, "assets", "fonts", name), join(schriftZiel, name)))
  );

  /* --- CSS und JS mit Kennung -------------------------------------------- */
  const kernInhalte = await Promise.all(kernDateien.map((name) => readFile(join(hier, name))));
  const anlagenVersion = `v-${kennung(Buffer.concat(kernInhalte), schriftVersion)}`;
  const anlagenZiel = join(ziel, "assets", anlagenVersion);
  await mkdir(anlagenZiel, { recursive: true });

  await Promise.all(
    kernDateien.map(async (name, index) => {
      if (!name.endsWith(".css")) {
        return writeFile(join(anlagenZiel, name), kernInhalte[index]);
      }
      // Die Schriftadressen bekommen die Kennung erst hier — die Quelldatei
      // bleibt sauber lesbar.
      const text = kernInhalte[index]
        .toString("utf8")
        .replaceAll(/\/assets\/fonts\/([A-Za-z0-9._-]+\.woff2)/g, `/assets/fonts/$1?${schriftVersion}`);
      return writeFile(join(anlagenZiel, name), text, "utf8");
    })
  );

  /* --- Seite -------------------------------------------------------------- */
  const werk = bildWerk({ ziel });
  let html = await seite({ werk });
  html = html.replaceAll("__ASSET_VERSION__", anlagenVersion).replaceAll("__FONT_VERSION__", schriftVersion);

  const anzahlBilder = await werk.schreiben();
  await writeFile(join(ziel, "index.html"), html, "utf8");

  await writeFile(
    join(ziel, "404.html"),
    seite404.replaceAll("__ASSET_VERSION__", anlagenVersion).replace(" style-placeholder", ""),
    "utf8"
  );

  /* --- Eigenständige Unterseiten ------------------------------------------ */
  const unterseiten = await unterseitenBauen(ziel, schriftNamen, schriftInhalte, schriftVersion);

  /* --- Hashes aller eingebetteten Skripte für die CSP --------------------- */
  // So bleibt script-src ohne 'unsafe-inline': Jeder Block steht namentlich in
  // der Richtlinie. Kommt ein Block dazu, wandert sein Hash automatisch mit.
  // Über alle Seiten hinweg, nicht nur die Startseite: Die Unterseiten bringen
  // eigenes CSS und JavaScript eingebettet mit. Ohne ihre Hashes blockiert die
  // Richtlinie das eigene Markup, und die Seite käme ohne Gestaltung an.
  const alleSeiten = [html, ...unterseiten.map((seite) => seite.html)];
  const hashesSammeln = (muster) => {
    const raus = new Set();
    for (const seite of alleSeiten) {
      for (const treffer of seite.matchAll(muster)) {
        raus.add(`sha256-${createHash("sha256").update(treffer[1], "utf8").digest("base64")}`);
      }
    }
    return [...raus];
  };

  const skriptHashes = hashesSammeln(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g);
  const stilHashes = hashesSammeln(/<style[^>]*>([\s\S]*?)<\/style>/g);

  /* --- sitemap, robots ---------------------------------------------------- */
  const heute = new Date().toISOString().slice(0, 10);
  const hreflangZeilen = sprachfassungen
    .map((fassung) => `    <xhtml:link rel="alternate" hreflang="${fassung.hreflang}" href="${fassung.url}"/>`)
    .join("\n");

  const weitereEintraege = unterseiten
    .filter((seite) => seite.indexierbar)
    .map(
      (seite) => `  <url>
    <loc>${marke.url}${seite.route}</loc>
    <lastmod>${heute}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${marke.url}/</loc>
    <lastmod>${heute}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${hreflangZeilen}
  </url>
${weitereEintraege}
</urlset>
`;
  await writeFile(join(ziel, "sitemap.xml"), sitemap, "utf8");

  const robots = `User-agent: *
Allow: /

Sitemap: ${marke.url}/sitemap.xml
`;
  await writeFile(join(ziel, "robots.txt"), robots, "utf8");

  /* --- Dateien, die unverändert ausgeliefert werden müssen ---------------- */
  // at/oeffentlich/ landet 1:1 in der Wurzel. Bestätigungsdateien von
  // Suchmaschinen prüfen den genauen Inhalt — hier wird nichts angefasst.
  const oeffentlichQuelle = join(hier, "oeffentlich");
  let mitgereicht = 0;

  if (await vorhanden(oeffentlichQuelle)) {
    for (const eintrag of await readdir(oeffentlichQuelle, { withFileTypes: true })) {
      if (!eintrag.isFile()) continue;
      if (eintrag.name === "LIESMICH.md" || eintrag.name.startsWith(".")) continue;
      await copyFile(join(oeffentlichQuelle, eintrag.name), join(ziel, eintrag.name));
      mitgereicht += 1;
    }
  }

  /* --- Worker ------------------------------------------------------------- */
  const serverVerzeichnis = join(ziel, "server");
  const oeffentlich = join(serverVerzeichnis, "public");
  await mkdir(oeffentlich, { recursive: true });

  for (const eintrag of await readdir(ziel, { withFileTypes: true })) {
    if (eintrag.name === "server") continue;
    await cp(join(ziel, eintrag.name), join(oeffentlich, eintrag.name), { recursive: true });
  }

  const sicherheit = kopfzeilen(skriptHashes, stilHashes);
  await writeFile(join(serverVerzeichnis, "index.js"), arbeiter(sicherheit), "utf8");
  // Damit die Vorschau dieselben Kopfzeilen setzt wie der Worker: Was lokal
  // funktioniert, funktioniert dann auch live — und umgekehrt.
  await writeFile(join(serverVerzeichnis, "kopfzeilen.json"), JSON.stringify(sicherheit, null, 2), "utf8");

  const dauer = ((Date.now() - beginn) / 1000).toFixed(1);
  console.log(
    `campdoerfl.at gebaut: ${1 + unterseiten.length} Seite(n), ${anzahlBilder} Bilddateien, ${schriftNamen.length} Schriften` +
      `${mitgereicht ? `, ${mitgereicht} Datei(en) aus at/oeffentlich/` : ""} → dist-at/ (${dauer}s)`
  );

  for (const seite of unterseiten) {
    console.log(
      `  ${seite.route} — ${seite.ausgelagert} Bild(er) ausgelagert, ` +
        `${seite.indexierbar ? "indexierbar" : "auf noindex, nicht in der Sitemap"}`
    );
  }

  return { ziel, anlagenVersion, schriftVersion };
}

const direktGestartet = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (direktGestartet) {
  await bauen();
}

export { ziel as ausgabeVerzeichnis, vorhanden };
