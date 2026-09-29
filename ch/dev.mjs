/**
 * Watch-Betrieb für campdoerfl.ch: baut bei jeder Änderung in at/ neu und
 * liefert den Stand unter http://127.0.0.1:4180 aus.
 *
 *   node ch/dev.mjs
 */

import { watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bauen } from "./build.mjs";

const hier = dirname(fileURLToPath(import.meta.url));

let laeuft = false;
let angefordert = false;
let uhr = null;

async function neuBauen(grund) {
  if (laeuft) {
    angefordert = true;
    return;
  }

  laeuft = true;

  try {
    console.log(`[ch] baut neu (${grund})`);
    await bauen();
  } catch (fehler) {
    console.error("[ch] Build fehlgeschlagen");
    console.error(fehler);
  } finally {
    laeuft = false;
    if (angefordert) {
      angefordert = false;
      await neuBauen("nachgeholt");
    }
  }
}

function anmelden(grund) {
  if (uhr) clearTimeout(uhr);
  uhr = setTimeout(() => {
    uhr = null;
    void neuBauen(grund);
  }, 120);
}

await neuBauen("Start");
await import("./server.mjs");

watch(resolve(hier), { recursive: true }, (_art, datei) => {
  if (!datei) return;
  if (datei.startsWith("node_modules")) return;
  anmelden(`at/${datei}`);
});

console.log("[ch] beobachtet ch/ auf Änderungen");
