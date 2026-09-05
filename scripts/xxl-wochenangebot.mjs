// Holt das Wochenangebot von XXL Nutrition und legt es als Datenmodul ab.
//
// Der Shop liegt hinter einer Bot-Prüfung: Ein Abruf ohne Browser bekommt 403,
// und die Seite selbst darf laut ihrer Sicherheitsrichtlinie nichts nach außen
// schicken. Deshalb läuft der Weg über einen echten Browser, in dem das Angebot
// bereits offen ist — dieses Skript nimmt nur entgegen, was von dort kommt.
//
// Aufruf:
//   npm run xxl
//
// Danach steht der Sammel-Schnipsel in der Zwischenablage. Auf
// https://xxlnutrition.com/de/angebot/wochenangebot die Konsole öffnen
// (Alt+Cmd+I), einfügen, Enter. Der Browser lädt eine Datei in den
// Download-Ordner herunter; dieses Skript wartet darauf und räumt sie weg.
//
// Das Angebot wechselt wöchentlich. Nach jedem Lauf gehören `npm test` und
// `npm run cf:deploy` dazu, sonst steht auf der Seite das Angebot der Vorwoche.

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const QUELLE = "https://xxlnutrition.com/de/angebot/wochenangebot";
const bilderOrdner = join(root, "assets", "images", "xxl-angebote");
const datenDatei = join(root, "src", "xxl-wochenangebot.mjs");

// Wo der Browser ablegt. Safari hängt bei gleichem Namen "-2" an, deshalb wird
// nach Muster gesucht und die jüngste Datei genommen.
const downloadOrdner = process.env.XXL_DOWNLOADS ?? join(homedir(), "Downloads");
const MUSTER = /^xxl-wochenangebot.*\.json$/;

// Der Partner-Code und sein Abzug. Beides steht auch in pages.mjs auf
// /xxl-nutrition-rabattcode/ — ändert XXL Nutrition die Konditionen, gehören
// beide Stellen angefasst.
const CODE = "Dominik";
const RABATT_PROZENT = 10;

// Der Canvas-Encoder des Browsers schreibt WebP sehr verschwenderisch — Safari
// liefert für dieselbe Bildgröße rund das Achtfache dessen, was sharp braucht.
// Deshalb geht jedes Bild hier noch einmal durch. 78 ist bei freigestellten
// Produktfotos nicht von der Vorlage zu unterscheiden.
const WEBP_QUALITAET = 78;

function schnipsel() {
  return readFileSync(join(root, "scripts", "xxl-sammeln.js"), "utf8");
}

// Auf dem Mac landet der Schnipsel direkt in der Zwischenablage. Klappt das
// nicht, wird der Pfad genannt — der Ablauf bleibt derselbe.
function inDieZwischenablage(text) {
  return new Promise((fertig) => {
    const kopieren = spawn("pbcopy");
    kopieren.on("error", () => fertig(false));
    kopieren.on("close", (code) => fertig(code === 0));
    kopieren.stdin.end(text);
  });
}

function gefundeneDateien(nichtVor) {
  if (!existsSync(downloadOrdner)) return [];

  return readdirSync(downloadOrdner)
    .filter((name) => MUSTER.test(name))
    .map((name) => ({ name, pfad: join(downloadOrdner, name) }))
    .filter((eintrag) => {
      try {
        return statSync(eintrag.pfad).mtimeMs >= nichtVor;
      } catch {
        return false;
      }
    })
    .sort((a, b) => statSync(b.pfad).mtimeMs - statSync(a.pfad).mtimeMs);
}

/* Wartet, bis der Browser die Datei abgelegt hat.
 *
 * Nur Dateien, die nach dem Start dieses Laufs entstanden sind, zählen — sonst
 * würde eine liegengebliebene Datei der Vorwoche stillschweigend übernommen.
 * Und erst wenn die Größe zwei Blicke lang gleich bleibt, ist der Download auch
 * wirklich fertig. */
async function warteAufDatei(nichtVor, sekunden = 900) {
  let letzteGroesse = -1;

  for (let versuch = 0; versuch < sekunden; versuch += 1) {
    const [neueste] = gefundeneDateien(nichtVor);

    if (neueste) {
      const groesse = statSync(neueste.pfad).size;
      if (groesse > 0 && groesse === letzteGroesse) return neueste;
      letzteGroesse = groesse;
    }

    await new Promise((fertig) => setTimeout(fertig, 1000));
  }

  return null;
}

function bildName(slug, bytes) {
  return `xxl-${slug}-${createHash("sha256").update(bytes).digest("hex").slice(0, 8)}.webp`;
}

// Was aus früheren Wochen übrig ist, wird ohnehin nicht mehr ausgeliefert —
// der Build kopiert nur referenzierte Dateien. Hier fliegt es auch vom
// Arbeitsplatz, damit der Ordner den aktuellen Stand zeigt.
function raeumeAuf(behalten) {
  if (!existsSync(bilderOrdner)) return [];

  const alt = readdirSync(bilderOrdner).filter((name) => /^xxl-.+\.webp$/.test(name) && !behalten.has(name));
  for (const name of alt) unlinkSync(join(bilderOrdner, name));
  return alt;
}

function datenModul(produkte, stand) {
  const zeilen = produkte
    .map((produkt) => `  {
    name: ${JSON.stringify(produkt.name)},
    url: ${JSON.stringify(produkt.url)},
    bild: ${JSON.stringify(produkt.bild)},
    breite: ${produkt.breite},
    hoehe: ${produkt.hoehe},
    ab: ${produkt.ab},
    uvpCent: ${produkt.uvpCent},
    preisCent: ${produkt.preisCent},
    codeCent: ${produkt.codeCent},
    merkmale: ${JSON.stringify(produkt.merkmale)}
  }`)
    .join(",\n");

  return `// Erzeugt von scripts/xxl-wochenangebot.mjs — nicht von Hand ändern.
//
// Das Wochenangebot von XXL Nutrition, Stand ${stand}. Neu holen mit:
//   npm run xxl
//
// "codeCent" ist der Angebotspreis abzüglich der ${RABATT_PROZENT} % des
// Partner-Codes. Ob der Code auf bereits reduzierte Artikel zusätzlich greift,
// legt XXL Nutrition fest; verbindlich ist immer der Warenkorb.

export const xxlWochenangebot = {
  stand: ${JSON.stringify(stand)},
  quelle: ${JSON.stringify(QUELLE)},
  code: ${JSON.stringify(CODE)},
  rabattProzent: ${RABATT_PROZENT},
  produkte: [
${zeilen}
  ]
};
`;
}

const start = Date.now();
const kopiert = await inDieZwischenablage(schnipsel());

console.log("");
console.log("  Wochenangebot holen — drei Schritte:");
console.log("");
console.log(`  1. ${QUELLE} im Browser öffnen`);
console.log("  2. Konsole öffnen (Alt+Cmd+I) und einfügen:");
console.log(kopiert
  ? "     Der Schnipsel liegt in der Zwischenablage — Cmd+V, Enter."
  : "     Inhalt von scripts/xxl-sammeln.js einfügen.");
console.log("  3. Den Download bestätigen, falls der Browser fragt.");
console.log("");
console.log(`  Warte auf xxl-wochenangebot.json in ${downloadOrdner} — Abbruch mit Strg+C.`);
console.log("");

const datei = await warteAufDatei(start);

if (!datei) {
  console.error("  Keine Datei angekommen. Lief der Schnipsel in der Konsole durch?");
  process.exit(1);
}

const paket = JSON.parse(readFileSync(datei.pfad, "utf8"));
mkdirSync(bilderOrdner, { recursive: true });

const produkte = [];
const behalten = new Set();

for (const produkt of paket.produkte) {
  // Der Name kommt aus dem Browser und darf den Zielordner nicht verlassen.
  if (!/^[a-z0-9-]+$/.test(produkt.slug || "")) continue;

  const bytes = await sharp(Buffer.from(produkt.b64, "base64")).webp({ quality: WEBP_QUALITAET }).toBuffer();
  const masse = await sharp(bytes).metadata();
  const name = bildName(produkt.slug, bytes);

  behalten.add(name);
  writeFileSync(join(bilderOrdner, name), bytes);

  produkte.push({
    name: produkt.name,
    url: new URL(produkt.pfad, "https://www.xxlnutrition.com").toString(),
    bild: `/assets/images/xxl-angebote/${name}`,
    breite: masse.width,
    hoehe: masse.height,
    ab: produkt.ab,
    uvpCent: produkt.uvpCent,
    preisCent: produkt.preisCent,
    codeCent: Math.round((produkt.preisCent * (100 - RABATT_PROZENT)) / 100),
    merkmale: produkt.merkmale
  });
}

writeFileSync(datenDatei, datenModul(produkte, paket.stand));
const entfernt = raeumeAuf(behalten);

// Die heruntergeladene Datei hat ihren Zweck erfüllt und enthält alle Bilder
// noch einmal als Text — sie hat im Download-Ordner nichts verloren.
unlinkSync(datei.pfad);

console.log(`  ${produkte.length} Angebote geschrieben, Stand ${paket.stand}.`);
if (entfernt.length) console.log(`  ${entfernt.length} Bilder aus früheren Wochen entfernt.`);
console.log("  Weiter mit: npm test, dann npm run cf:deploy");
console.log("");
