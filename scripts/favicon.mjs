// Erzeugt die Browser-Symbole aus dem Markenlogo.
// Aufruf: node scripts/favicon.mjs
//
// Safari zeigt im Tab kein WebP-Symbol und keine 2000er Originaldatei an und
// fragt zusätzlich /favicon.ico und /apple-touch-icon.png in der Wurzel ab.
// Deshalb gibt es hier dieselben Größen wie auf campdoerfl.at (at/bilder.mjs).
// Die Dateien unter /assets/ sind ein Jahr unveränderlich gecacht: Ändert sich
// das Logo, bekommen sie einen neuen Namen.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const quelle = new URL("../assets/images/camp-doerfl-logo.png", import.meta.url);
const hintergrund = "#fbf7ef";

const zugeschnitten = await sharp(await readFile(quelle)).trim({ threshold: 10 }).toBuffer();
const transparent = (kante) =>
  sharp(zugeschnitten)
    .resize(kante, kante, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

// iOS füllt Transparenz beim Home-Bildschirm schwarz – das Touch-Icon bekommt
// deshalb den hellen Seitenhintergrund und etwas Luft um das runde Emblem.
const mitHintergrund = async (kante) => {
  const innen = Math.round(kante * 0.84);
  const emblem = await sharp(zugeschnitten)
    .resize(innen, innen, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width: kante, height: kante, channels: 4, background: hintergrund } })
    .composite([{ input: emblem, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

function icoBauen(pngListe, kanten) {
  const kopf = Buffer.alloc(6);
  kopf.writeUInt16LE(0, 0);
  kopf.writeUInt16LE(1, 2);
  kopf.writeUInt16LE(pngListe.length, 4);
  let versatz = 6 + pngListe.length * 16;
  const verzeichnis = pngListe.map((png, i) => {
    const eintrag = Buffer.alloc(16);
    eintrag.writeUInt8(kanten[i], 0);
    eintrag.writeUInt8(kanten[i], 1);
    eintrag.writeUInt16LE(1, 4);
    eintrag.writeUInt16LE(32, 6);
    eintrag.writeUInt32LE(png.length, 8);
    eintrag.writeUInt32LE(versatz, 12);
    versatz += png.length;
    return eintrag;
  });
  return Buffer.concat([kopf, ...verzeichnis, ...pngListe]);
}

const bilder = new URL("../assets/images/", import.meta.url);
const wurzel = new URL("../public/", import.meta.url);
await mkdir(wurzel, { recursive: true });

const kanten = [16, 32, 48];
await writeFile(new URL("favicon.ico", wurzel), icoBauen(await Promise.all(kanten.map(transparent)), kanten));
await writeFile(new URL("camp-doerfl-symbol-32.png", bilder), await transparent(32));
await writeFile(new URL("camp-doerfl-symbol-192.png", bilder), await transparent(192));
const touch = await mitHintergrund(180);
await writeFile(new URL("camp-doerfl-symbol-180.png", bilder), touch);
await writeFile(new URL("apple-touch-icon.png", wurzel), touch);

console.log("Symbole geschrieben: public/favicon.ico, public/apple-touch-icon.png, assets/images/camp-doerfl-symbol-{32,180,192}.png");
