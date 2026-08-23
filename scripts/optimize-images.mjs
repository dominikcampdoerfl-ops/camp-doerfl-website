// Wandelt die im Quelltext referenzierten PNG- und JPEG-Bilder nach WebP um und
// zieht die Verweise nach. Die Originale bleiben liegen: Sie sind die Vorlage für
// künftige Umwandlungen, werden aber nicht mehr referenziert — und der Build
// kopiert nur referenzierte Dateien nach dist/, sie gehen also nicht mehr live.
//
// Aufruf:
//   node scripts/optimize-images.mjs           → zeigt nur, was passieren würde
//   node scripts/optimize-images.mjs --schreiben → wandelt um und schreibt Verweise
//
// Bewusst ausgenommen:
// - "*-social.*": das og:image. WhatsApp, LinkedIn und einige Mailprogramme
//   zeigen WebP-Vorschaubilder unzuverlässig an.
// - das Markenlogo: steckt in strukturierten Daten, im Apple-Touch-Icon und im
//   Pressedownload und muss als PNG erreichbar bleiben.

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const bilderOrdner = join(root, "assets", "images");
// Vorlagen in Originalauflösung. Werden nirgends referenziert und deshalb auch
// nicht ausgeliefert — sie sind nur da, damit sich jederzeit neu rendern lässt.
const vorlagenOrdner = join(bilderOrdner, "original");
const schreiben = process.argv.includes("--schreiben");

// Größte Kante. Die breiteste Darstellung liegt bei rund 1440 Pixeln; 1800 lässt
// Luft für scharfe Darstellung auf dichten Bildschirmen, ohne Ballast.
const MAX_KANTE = 1800;
const WEBP_QUALITAET = 80;

const ausgenommen = (name) => /-social\.(png|jpe?g)$/i.test(name) || /^camp-doerfl-logo\./i.test(name);

function quellDateien() {
  const dateien = [];
  const sammle = (ordner) => {
    for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
      const pfad = join(ordner, eintrag.name);
      if (eintrag.isDirectory()) {
        sammle(pfad);
        continue;
      }
      if (/\.(mjs|js|css|json)$/.test(eintrag.name)) dateien.push(pfad);
    }
  };
  sammle(join(root, "src"));
  return dateien;
}

function referenzierteBilder(dateien) {
  const treffer = new Map();

  for (const datei of dateien) {
    const inhalt = readFileSync(datei, "utf8");
    for (const match of inhalt.matchAll(/\/assets\/images\/([A-Za-z0-9._-]+\.(?:png|jpe?g))/g)) {
      const name = match[1];
      if (!treffer.has(name)) treffer.set(name, new Set());
      treffer.get(name).add(datei);
    }
  }

  return treffer;
}

async function wandle(name) {
  const quelle = join(bilderOrdner, name);
  const zielName = `${basename(name, extname(name))}.webp`;
  const ziel = join(bilderOrdner, zielName);
  const vorher = statSync(quelle).size;
  const bild = sharp(quelle);
  const info = await bild.metadata();
  const langeKante = Math.max(info.width ?? 0, info.height ?? 0);
  const skalieren = langeKante > MAX_KANTE;

  if (schreiben) {
    await bild
      .resize(
        skalieren
          ? { width: info.width >= info.height ? MAX_KANTE : undefined, height: info.height > info.width ? MAX_KANTE : undefined, withoutEnlargement: true }
          : {}
      )
      .webp({ quality: WEBP_QUALITAET, effort: 5 })
      .toFile(ziel);
  }

  const nachher = schreiben ? statSync(ziel).size : Math.round(vorher * 0.2);

  return { name, zielName, vorher, nachher, breite: info.width, hoehe: info.height, skaliert: skalieren };
}

function schreibeVerweise(umbenennungen, dateien) {
  let geaendert = 0;

  for (const datei of dateien) {
    const alt = readFileSync(datei, "utf8");
    let neu = alt;

    for (const [vonName, nachName] of umbenennungen) {
      neu = neu.replaceAll(`/assets/images/${vonName}`, `/assets/images/${nachName}`);
    }

    if (neu !== alt) {
      if (schreiben) writeFileSync(datei, neu, "utf8");
      geaendert += 1;
    }
  }

  return geaendert;
}

function formatiere(bytes) {
  return `${String(Math.round(bytes / 1024)).padStart(5)} kB`;
}

const dateien = quellDateien();
const bilder = [...referenzierteBilder(dateien).keys()].sort();
const zuWandeln = bilder.filter((name) => !ausgenommen(name));
const uebersprungen = bilder.filter((name) => ausgenommen(name));

console.log(`${bilder.length} referenzierte PNG/JPEG gefunden · ${zuWandeln.length} werden gewandelt · ${uebersprungen.length} bleiben unangetastet\n`);

const ergebnisse = [];
for (const name of zuWandeln) {
  ergebnisse.push(await wandle(name));
}

ergebnisse.sort((a, b) => b.vorher - a.vorher);

for (const eintrag of ergebnisse.slice(0, 15)) {
  const ersparnis = Math.round((1 - eintrag.nachher / eintrag.vorher) * 100);
  console.log(
    `${formatiere(eintrag.vorher)} → ${formatiere(eintrag.nachher)}  (−${String(ersparnis).padStart(2)} %)  ${eintrag.skaliert ? "verkleinert " : "            "}${eintrag.name}`
  );
}

const vorher = ergebnisse.reduce((summe, eintrag) => summe + eintrag.vorher, 0);
const nachher = ergebnisse.reduce((summe, eintrag) => summe + eintrag.nachher, 0);

console.log(`\nGesamt: ${formatiere(vorher)} → ${formatiere(nachher)} (−${Math.round((1 - nachher / vorher) * 100)} %)`);

const umbenennungen = ergebnisse.map((eintrag) => [eintrag.name, eintrag.zielName]);
const geaenderteDateien = schreibeVerweise(umbenennungen, dateien);

console.log(`Verweise in ${geaenderteDateien} Quelldateien ${schreiben ? "umgeschrieben" : "wären umzuschreiben"}.`);
console.log(`Unangetastet: ${uebersprungen.join(", ") || "—"}`);

// ---------------------------------------------------------------------------
// Zweiter Durchgang: WebP-Dateien, die schon da waren.
// Viele liegen in 2200 bis 2560 Pixeln vor und wiegen dadurch ein halbes
// Megabyte, obwohl sie nirgends größer als etwa 700 Pixel dargestellt werden.
// Der Dateiname bleibt gleich, deshalb ist hier kein Verweis anzufassen.
// ---------------------------------------------------------------------------

const GROESSEN_SCHWELLE = 200 * 1024;

function vorhandeneWebp() {
  const namen = new Set();

  for (const datei of dateien) {
    const inhalt = readFileSync(datei, "utf8");
    for (const match of inhalt.matchAll(/\/assets\/images\/([A-Za-z0-9._-]+\.webp)/g)) {
      namen.add(match[1]);
    }
  }

  return [...namen].filter((name) => !ergebnisse.some((eintrag) => eintrag.zielName === name));
}

const kandidaten = [];

for (const name of vorhandeneWebp()) {
  const pfad = join(bilderOrdner, name);
  let groesse;

  try {
    groesse = statSync(pfad).size;
  } catch {
    continue;
  }

  // Liegt schon eine Vorlage im Originalordner, wurde die Datei bereits
  // gestrafft. Ein zweiter Durchlauf würde sie nur ein weiteres Mal
  // verlustbehaftet kodieren, ohne nennenswert Platz zu sparen.
  if (existsSync(join(vorlagenOrdner, name))) {
    continue;
  }

  const info = await sharp(pfad).metadata();
  const langeKante = Math.max(info.width ?? 0, info.height ?? 0);

  if (langeKante > MAX_KANTE || groesse > GROESSEN_SCHWELLE) {
    kandidaten.push({ name, pfad, groesse, breite: info.width, hoehe: info.height, langeKante });
  }
}

console.log(`\n${kandidaten.length} vorhandene WebP-Dateien sind größer als nötig.`);

const gestrafft = [];

for (const kandidat of kandidaten) {
  if (!schreiben) {
    gestrafft.push({ ...kandidat, nachher: Math.round(kandidat.groesse * 0.45) });
    continue;
  }

  mkdirSync(vorlagenOrdner, { recursive: true });
  const vorlage = join(vorlagenOrdner, kandidat.name);
  renameSync(kandidat.pfad, vorlage);

  await sharp(vorlage)
    .resize({
      width: kandidat.breite >= kandidat.hoehe ? Math.min(kandidat.breite, MAX_KANTE) : undefined,
      height: kandidat.hoehe > kandidat.breite ? Math.min(kandidat.hoehe, MAX_KANTE) : undefined,
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITAET, effort: 5 })
    .toFile(kandidat.pfad);

  gestrafft.push({ ...kandidat, nachher: statSync(kandidat.pfad).size });
}

gestrafft.sort((a, b) => b.groesse - a.groesse);

for (const eintrag of gestrafft.slice(0, 10)) {
  const ersparnis = Math.round((1 - eintrag.nachher / eintrag.groesse) * 100);
  console.log(`${formatiere(eintrag.groesse)} → ${formatiere(eintrag.nachher)}  (−${String(ersparnis).padStart(2)} %)  ${eintrag.name}`);
}

const webpVorher = gestrafft.reduce((summe, eintrag) => summe + eintrag.groesse, 0);
const webpNachher = gestrafft.reduce((summe, eintrag) => summe + eintrag.nachher, 0);

if (gestrafft.length > 0) {
  console.log(`\nGesamt WebP: ${formatiere(webpVorher)} → ${formatiere(webpNachher)} (−${Math.round((1 - webpNachher / webpVorher) * 100)} %)`);
  console.log(`Vorlagen in Originalauflösung: ${vorlagenOrdner.replace(root, "")}`);
}

if (!schreiben) {
  console.log('\nProbelauf. Mit "--schreiben" werden die Dateien wirklich erzeugt.');
}
