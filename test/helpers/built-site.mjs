import { readdir, stat } from "node:fs/promises";

// `node --test` startet jede Testdatei in einem eigenen Prozess. Würde jede
// davon den Build selbst anstoßen, räumten mehrere Läufe gleichzeitig `dist/`
// ab und fielen übereinander (ENOTEMPTY). Deshalb baut `npm test` einmal vorab
// (Skript `pretest`) und hier wird nur gebaut, wenn `dist/` fehlt oder älter
// ist als der Quelltext — sonst prüfte ein einzeln gestarteter Test einen
// veralteten Stand und meldete Grün für Code, der so nie lief.
export async function ensureBuiltSite() {
  const workerPath = new URL("../../dist/server/index.js", import.meta.url);
  const built = await stat(workerPath).catch(() => null);

  if (!built || built.mtimeMs < (await newestSourceChange())) {
    await import("../../src/build.mjs");
  }
}

async function newestSourceChange() {
  const sourceDir = new URL("../../src/", import.meta.url);
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const times = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => (await stat(new URL(entry.name, sourceDir))).mtimeMs)
  );

  return Math.max(0, ...times);
}
