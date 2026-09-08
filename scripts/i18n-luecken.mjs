// Zeigt, welche Textbausteine einer Seite noch keine englische Uebersetzung
// haben. Ohne Argument: Uebersicht aller Seiten, nach Restaufwand sortiert.
//
//   npm run i18n            — Uebersicht
//   npm run i18n -- /shop/  — offene Bausteine einer Seite
//
// Die Ausgabe ist so formatiert, dass sich Zeilen direkt nach src/i18n/en.mjs
// uebernehmen lassen.

import { readFile } from "node:fs/promises";
import { pages } from "../src/pages.mjs";
import { erstelleUebersetzer, uebersetzeHtml } from "../src/i18n/translate-html.mjs";
import { sammleEigennamen } from "../src/i18n/eigennamen.mjs";
const sprachCode = process.env.SPRACHE || "en";
const { woerterbuch } = await import(`../src/i18n/${sprachCode}.mjs`);
const { SPRACHEN } = await import("../src/i18n/sprachen.mjs");
const sprache = SPRACHEN.find((s) => s.code === sprachCode);
const eigennamen = await sammleEigennamen();
const karte = new Map(Object.entries(woerterbuch));
const ziel = process.argv[2] || "--liste";
if (ziel === "--liste") {
  const zeilen=[];
  for (const page of pages) {
    const pfad = page.route==="/"?"dist/index.html":`dist${page.route}index.html`;
    let html; try{html=await readFile(pfad,"utf8")}catch{continue}
    const f=new Set(); uebersetzeHtml(html, erstelleUebersetzer(karte,{fehlstellen:f,eigennamen,vokabular:sprache.vokabular}), {});
    zeilen.push([f.size,page.route]);
  }
  for(const [n,r] of zeilen.sort((a,b)=>a[0]-b[0])) console.log(String(n).padStart(5), r);
} else {
  const page = pages.find(p=>p.route===ziel);
  const pfad = page.route==="/"?"dist/index.html":`dist${page.route}index.html`;
  const html = await readFile(pfad,"utf8");
  const f=new Set(); uebersetzeHtml(html, erstelleUebersetzer(karte,{fehlstellen:f,eigennamen,vokabular:sprache.vokabular}), {});
  console.log(`# ${ziel} — ${f.size} offen`);
  for (const t of f) console.log(JSON.stringify(t));
}
