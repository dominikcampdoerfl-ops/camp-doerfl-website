// Haengt einen Abschnitt an das Woerterbuch einer Sprache an.
// Aufruf: node scripts/i18n-eintragen.mjs "<Ueberschrift>" <datei.json> [sprachcode]
// Ohne Sprachcode wird "en" verwendet.
// Die JSON-Datei ist ein Objekt { "deutsch": "english", ... }.
import { readFile, writeFile } from "node:fs/promises";

const [ueberschrift, jsonPfad, sprachCode = "en"] = process.argv.slice(2);
const eintraege = JSON.parse(await readFile(jsonPfad, "utf8"));
const pfad = new URL(`../src/i18n/${sprachCode}.mjs`, import.meta.url);
let quelle = await readFile(pfad, "utf8");

const zeilen = Object.entries(eintraege).map(([de, en]) => `  ${JSON.stringify(de)}: ${JSON.stringify(en)},`);
const block = `\n  // ============================================================\n  // ${ueberschrift}\n  // ============================================================\n${zeilen.join("\n")}\n`;

const ende = quelle.lastIndexOf("\n};");
if (ende === -1) throw new Error("Abschluss des Woerterbuchs nicht gefunden");

// Das letzte Paar braucht ein Komma, bevor der neue Block folgt.
let kopf = quelle.slice(0, ende);
if (!kopf.trimEnd().endsWith(",")) kopf = `${kopf.trimEnd()},`;

quelle = `${kopf}\n${block}${quelle.slice(ende + 1)}`;
await writeFile(pfad, quelle, "utf8");
console.log(`${zeilen.length} Eintraege ergaenzt (${sprachCode}): ${ueberschrift}`);
