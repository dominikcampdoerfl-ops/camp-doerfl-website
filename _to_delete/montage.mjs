import sharp from 'sharp';
import { existsSync } from 'node:fs';

const namen = process.argv.slice(3);
const ziel = process.argv[2];
const B = 300, H = 300, SPALTEN = 4;
const zeilen = Math.ceil(namen.length / SPALTEN);

const kacheln = [];
for (let i = 0; i < namen.length; i++) {
  let pfad = `assets/images/${namen[i]}.webp`;
  if (!existsSync(pfad)) pfad = `assets/images/${namen[i]}.jpg`;
  if (!existsSync(pfad)) { console.error('fehlt:', namen[i]); continue; }
  const buf = await sharp(pfad).resize(B, H, { fit: 'cover' }).toBuffer();
  kacheln.push({ input: buf, left: (i % SPALTEN) * B, top: Math.floor(i / SPALTEN) * H });
}

await sharp({ create: { width: B * SPALTEN, height: H * zeilen, channels: 3, background: '#111' } })
  .composite(kacheln)
  .jpeg({ quality: 82 })
  .toFile(ziel);
console.log('fertig:', ziel, kacheln.length, 'Kacheln');
