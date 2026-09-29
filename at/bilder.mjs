/**
 * Bildaufbereitung für campdoerfl.at.
 *
 * Aus den vorhandenen Originalen unter assets/images/ entstehen beim Build
 * AVIF- und WebP-Fassungen in mehreren Breiten. Der Dateiname trägt eine
 * Kennung aus dem Inhalt: Ein ausgetauschtes Foto bekommt dadurch automatisch
 * eine neue Adresse und läuft nicht in den Jahres-Cache der /assets/-Regel.
 *
 * Ergebnisse landen zusätzlich in .at-bilder/ und werden von dort
 * wiederverwendet — der erste Build rechnet, jeder weitere kopiert nur.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, copyFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const quelle = join(wurzel, "assets", "images");
const lager = join(wurzel, ".at-bilder");

export const AUSGABE_PFAD = "assets/at";

const formate = [
  { endung: "avif", typ: "image/avif", optionen: { quality: 48, effort: 3, chromaSubsampling: "4:2:0" } },
  { endung: "webp", typ: "image/webp", optionen: { quality: 76, effort: 4 } }
];

async function vorhanden(pfad) {
  return Boolean(await stat(pfad).catch(() => null));
}

/** Läuft höchstens `gleichzeitig` Aufgaben parallel — sonst geht sharp in die Knie. */
async function nacheinander(aufgaben, gleichzeitig = 4) {
  const ergebnisse = [];
  let index = 0;

  async function arbeiter() {
    while (index < aufgaben.length) {
      const eigener = index++;
      ergebnisse[eigener] = await aufgaben[eigener]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(gleichzeitig, aufgaben.length) }, arbeiter));
  return ergebnisse;
}

function icoBauen(pngListe, kanten) {
  const kopf = Buffer.alloc(6);
  kopf.writeUInt16LE(0, 0); // reserviert
  kopf.writeUInt16LE(1, 2); // 1 = Symbol
  kopf.writeUInt16LE(pngListe.length, 4);

  let versatz = 6 + pngListe.length * 16;
  const verzeichnis = [];

  for (const [i, png] of pngListe.entries()) {
    const eintrag = Buffer.alloc(16);
    eintrag.writeUInt8(kanten[i] >= 256 ? 0 : kanten[i], 0); // Breite
    eintrag.writeUInt8(kanten[i] >= 256 ? 0 : kanten[i], 1); // Höhe
    eintrag.writeUInt8(0, 2); // Farbanzahl
    eintrag.writeUInt8(0, 3); // reserviert
    eintrag.writeUInt16LE(1, 4); // Ebenen
    eintrag.writeUInt16LE(32, 6); // Bit je Bildpunkt
    eintrag.writeUInt32LE(png.length, 8);
    eintrag.writeUInt32LE(versatz, 12);
    verzeichnis.push(eintrag);
    versatz += png.length;
  }

  return Buffer.concat([kopf, ...verzeichnis, ...pngListe]);
}

export function bildWerk({ ziel }) {
  const geplant = new Map();

  /**
   * `zuschnitt` schneidet vor dem Verkleinern einen festen Bereich aus der
   * Vorlage — gedacht für Fotos, die als Ganzes anders gerahmt sind, als die
   * Fläche sie braucht. Er geht in die Kennung ein: Ein anderer Ausschnitt
   * ergibt einen anderen Dateinamen und läuft nicht in den Jahres-Cache.
   */
  async function ableiten(
    dateiname,
    breiten,
    { fit = "cover", hoehenVerhaeltnis = null, zuschnitt = null } = {}
  ) {
    const quellPfad = join(quelle, dateiname);

    if (!(await vorhanden(quellPfad))) {
      throw new Error(`Bild fehlt: assets/images/${dateiname}`);
    }

    const rohdaten = await readFile(quellPfad);
    const kennung = createHash("sha256")
      .update(rohdaten)
      .update(JSON.stringify({ zuschnitt, hoehenVerhaeltnis, fit }))
      .digest("hex")
      .slice(0, 8);
    const masse = zuschnitt
      ? { width: zuschnitt.breite, height: zuschnitt.hoehe }
      : await sharp(rohdaten).metadata();
    // Quellen dürfen auch aus assets/images/original/ kommen; der Zielname
    // bleibt flach.
    const basis = dateiname.replace(/\.[^.]+$/, "").replaceAll("/", "-");
    // Nie hochrechnen: Breiten über der Vorlage fallen weg. Damit große
    // Flächen trotzdem scharf bleiben, kommt die Originalbreite dazu, sobald
    // eine gewünschte Breite darüber liegt.
    const passende = breiten.filter((breite) => breite <= masse.width);
    const nutzbareBreiten = [...new Set(
      breiten.some((breite) => breite > masse.width) ? [...passende, masse.width] : passende
    )].sort((a, b) => a - b);

    const fassungen = [];

    for (const breite of nutzbareBreiten) {
      const hoehe = hoehenVerhaeltnis ? Math.round(breite * hoehenVerhaeltnis) : null;

      for (const format of formate) {
        const name = `${basis}-${breite}-${kennung}.${format.endung}`;
        fassungen.push({ name, breite, hoehe, format });

        if (geplant.has(name)) continue;

        geplant.set(name, async () => {
          const lagerPfad = join(lager, name);
          const zielPfad = join(ziel, AUSGABE_PFAD, name);
          await mkdir(dirname(zielPfad), { recursive: true });

          if (await vorhanden(lagerPfad)) {
            await copyFile(lagerPfad, zielPfad);
            return;
          }

          const bild = sharp(rohdaten).rotate();

          if (zuschnitt) {
            bild.extract({
              left: zuschnitt.links,
              top: zuschnitt.oben,
              width: zuschnitt.breite,
              height: zuschnitt.hoehe
            });
          }

          if (hoehe) {
            bild.resize(breite, hoehe, { fit, position: sharp.strategy.attention });
          } else {
            bild.resize({ width: breite, withoutEnlargement: true });
          }

          const daten = await bild[format.endung](format.optionen).toBuffer();
          await mkdir(lager, { recursive: true });
          await writeFile(lagerPfad, daten);
          await writeFile(zielPfad, daten);
        });
      }
    }

    const groesste = nutzbareBreiten.at(-1);
    const anzeigeHoehe = hoehenVerhaeltnis
      ? Math.round(groesste * hoehenVerhaeltnis)
      : Math.round((masse.height / masse.width) * groesste);

    return {
      breite: groesste,
      hoehe: anzeigeHoehe,
      quellen: formate.map((format) => ({
        typ: format.typ,
        srcset: fassungen
          .filter((fassung) => fassung.format.endung === format.endung)
          .map((fassung) => `/${AUSGABE_PFAD}/${fassung.name} ${fassung.breite}w`)
          .join(", ")
      })),
      // Rückfall für Browser ohne <picture>: die mittlere WebP-Fassung.
      fallback: `/${AUSGABE_PFAD}/${
        fassungen.filter((f) => f.format.endung === "webp").at(Math.floor(nutzbareBreiten.length / 2))?.name ??
        fassungen.at(-1).name
      }`
    };
  }

  /**
   * Symbole für Browser-Tab und Suchergebnis.
   *
   * Wichtig: **PNG und ICO, kein WebP.** Google unterstützt für Favicons nur
   * ICO, PNG, JPEG, SVG, GIF und BMP — mit einem reinen WebP-Symbol bleibt in
   * der Search Console und in den Suchergebnissen die graue Weltkugel stehen.
   * Google empfiehlt außerdem Kantenlängen als Vielfache von 48.
   *
   * Der Rand um das Logo (rund 9 % je Seite) fällt weg: Bei 16 px zählt jedes
   * Pixel, und ein zentriertes Motiv mit Luft drumherum wird zum Punkt.
   */
  async function symbole(dateiname) {
    const rohdaten = await readFile(join(quelle, dateiname));
    const kennung = createHash("sha256").update(rohdaten).digest("hex").slice(0, 8);

    const zugeschnitten = await sharp(rohdaten).trim({ threshold: 10 }).toBuffer();
    const alsPng = (kante) =>
      sharp(zugeschnitten)
        .resize(kante, kante, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toBuffer();

    const pngNamen = {};
    for (const kante of [48, 96, 180, 192]) {
      pngNamen[kante] = `camp-doerfl-symbol-${kante}-${kennung}.png`;
    }

    geplant.set(`symbole-${kennung}`, async () => {
      await mkdir(join(ziel, AUSGABE_PFAD), { recursive: true });
      await mkdir(lager, { recursive: true });

      for (const [kante, name] of Object.entries(pngNamen)) {
        const lagerPfad = join(lager, name);
        const zielPfad = join(ziel, AUSGABE_PFAD, name);

        if (await vorhanden(lagerPfad)) {
          await copyFile(lagerPfad, zielPfad);
          continue;
        }

        const daten = await alsPng(Number(kante));
        await writeFile(lagerPfad, daten);
        await writeFile(zielPfad, daten);
      }

      // /favicon.ico: die Adresse, die Crawler und ältere Browser von sich aus
      // abfragen. Sie liegt in der Wurzel und trägt deshalb keine Kennung.
      const icoPfad = join(ziel, "favicon.ico");
      const icoLager = join(lager, `favicon-${kennung}.ico`);

      if (await vorhanden(icoLager)) {
        await copyFile(icoLager, icoPfad);
        return;
      }

      const ico = await icoBauen(await Promise.all([16, 32, 48].map(alsPng)), [16, 32, 48]);
      await writeFile(icoLager, ico);
      await writeFile(icoPfad, ico);
    });

    return {
      ico: "/favicon.ico",
      png48: `/${AUSGABE_PFAD}/${pngNamen[48]}`,
      png96: `/${AUSGABE_PFAD}/${pngNamen[96]}`,
      png180: `/${AUSGABE_PFAD}/${pngNamen[180]}`,
      png192: `/${AUSGABE_PFAD}/${pngNamen[192]}`
    };
  }

  /** Teilt-Bild fürs Teilen in sozialen Netzen: JPEG, weil WebP dort unzuverlässig ist. */
  async function sozialbild(dateiname, name) {
    const rohdaten = await readFile(join(quelle, dateiname));
    const kennung = createHash("sha256").update(rohdaten).digest("hex").slice(0, 8);
    const zielName = `${name}-${kennung}.jpg`;
    const lagerPfad = join(lager, zielName);
    const zielPfad = join(ziel, AUSGABE_PFAD, zielName);

    geplant.set(zielName, async () => {
      await mkdir(dirname(zielPfad), { recursive: true });

      if (await vorhanden(lagerPfad)) {
        await copyFile(lagerPfad, zielPfad);
        return;
      }

      const daten = await sharp(rohdaten)
        .rotate()
        .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      await mkdir(lager, { recursive: true });
      await writeFile(lagerPfad, daten);
      await writeFile(zielPfad, daten);
    });

    return { pfad: `/${AUSGABE_PFAD}/${zielName}`, breite: 1200, hoehe: 630 };
  }

  async function schreiben() {
    await nacheinander([...geplant.values()]);
    return geplant.size;
  }

  return { ableiten, sozialbild, symbole, schreiben };
}

/**
 * Baut ein <picture> mit AVIF, WebP und Maßangaben. Die Maße stehen im Markup,
 * damit der Browser den Platz reserviert, bevor das Bild da ist.
 */
export function bildMarkup(satz, { alt, sizes, klasse = "", laden = "lazy", fetchpriority = "" }) {
  const quellen = satz.quellen
    .map((quelle) => `<source type="${quelle.typ}" srcset="${quelle.srcset}" sizes="${sizes}">`)
    .join("");

  const attribute = [
    `src="${satz.fallback}"`,
    `alt="${alt}"`,
    `width="${satz.breite}"`,
    `height="${satz.hoehe}"`,
    `sizes="${sizes}"`,
    `loading="${laden}"`,
    `decoding="${laden === "eager" ? "sync" : "async"}"`,
    fetchpriority ? `fetchpriority="${fetchpriority}"` : "",
    klasse ? `class="${klasse}"` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `<picture>${quellen}<img ${attribute}></picture>`;
}
