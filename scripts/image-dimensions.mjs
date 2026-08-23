// Trägt width und height in die <img>-Tags der Seitenvorlagen nach.
//
// Warum: Ohne die beiden Angaben kennt der Browser das Seitenverhältnis erst,
// wenn das Bild geladen ist — bis dahin hat es keine Höhe und der Text darunter
// springt beim Eintreffen nach unten. Mit den echten Pixelmaßen (und
// "img { height: auto }" in styles.css) bleibt der Platz von Anfang an frei.
//
// Aufruf:
//   node scripts/image-dimensions.mjs             → zeigt nur, was fehlt
//   node scripts/image-dimensions.mjs --schreiben → trägt die Maße ein
//
// Angefasst werden nur Tags mit fest geschriebenem Dateinamen. Wo die Quelle aus
// einer Variablen kommt, lässt sich das Maß hier nicht bestimmen.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const bilderOrdner = join(root, "assets", "images");
const schreiben = process.argv.includes("--schreiben");
const dateien = ["src/pages.mjs", "src/components.mjs"].map((pfad) => join(root, pfad));

const masse = new Map();

async function massFuer(name) {
  if (!masse.has(name)) {
    try {
      const info = await sharp(join(bilderOrdner, name)).metadata();
      masse.set(name, { breite: info.width, hoehe: info.height });
    } catch {
      masse.set(name, null);
    }
  }

  return masse.get(name);
}

let ergaenzt = 0;
let uebersprungen = 0;

for (const datei of dateien) {
  const inhalt = readFileSync(datei, "utf8");
  const tags = [...inhalt.matchAll(/<img\b[^>]*>/g)].map((treffer) => treffer[0]);
  let neu = inhalt;

  for (const tag of new Set(tags)) {
    if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) continue;

    const quelle = tag.match(/src="\/assets\/images\/([A-Za-z0-9._-]+)"/);

    if (!quelle) {
      uebersprungen += 1;
      continue;
    }

    const mass = await massFuer(quelle[1]);

    if (!mass?.breite || !mass?.hoehe) {
      uebersprungen += 1;
      continue;
    }

    // Direkt hinter das src-Attribut, damit die Tags lesbar bleiben.
    const ersetzt = tag.replace(
      /(src="\/assets\/images\/[A-Za-z0-9._-]+")/,
      `$1 width="${mass.breite}" height="${mass.hoehe}"`
    );

    neu = neu.replaceAll(tag, ersetzt);
    ergaenzt += 1;
    console.log(`${String(mass.breite).padStart(5)}x${String(mass.hoehe).padEnd(5)}  ${quelle[1]}`);
  }

  if (neu !== inhalt && schreiben) {
    writeFileSync(datei, neu, "utf8");
  }
}

console.log(`\n${ergaenzt} Bildverweise ${schreiben ? "ergänzt" : "wären zu ergänzen"} · ${uebersprungen} übersprungen (Dateiname steht nicht fest).`);

if (!schreiben) {
  console.log('Probelauf. Mit "--schreiben" werden die Vorlagen geändert.');
}
