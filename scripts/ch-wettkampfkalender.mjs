/**
 * Erzeugt ch/seiten/bodybuilding-wettkaempfe-2026.html aus der
 * österreichischen Fassung.
 *
 *   node scripts/ch-wettkampfkalender.mjs
 *
 * Warum abgeleitet und nicht neu geschrieben: Stil, Aufbau und die
 * Countdown-Mechanik sollen identisch sein. Getauscht werden Land, Sprache,
 * Domain, Zeitzone, die Schreibweise ohne ß — und die Inhalte, die hier unten
 * stehen. Wer einen Termin ändert, ändert ihn hier und lässt das Skript neu
 * laufen; Änderungen direkt in der HTML-Datei sind beim nächsten Lauf weg.
 *
 * Recherchestand: 12.09.2026, ausschliesslich aus den Seiten der Verbände
 * selbst. Details und ein geprüfter Widerspruch: ch/seiten/AUS-AT-ABGELEITET.md
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const quelle = join(wurzel, "at", "seiten", "bodybuilding-wettkaempfe-2026.html");
const ziel = join(wurzel, "ch", "seiten", "bodybuilding-wettkaempfe-2026.html");

const GELESEN = "12. September 2026";

/* ------------------------------------------------------------- Verbände --- */

const verbaende = [
  {
    id: "sbfv-ifbb",
    kuerzel: "SBFV",
    name: "SBFV · IFBB Switzerland",
    ueberbau: "IFBB International · Schweizer Bodybuilding- und Fitnessverband",
    text:
      "Schweizermeisterschaft, Mr. Universe und Beginner-Klassen. Der Verband führt auch die Wettkämpfe für Liechtenstein.",
    quelle: "https://sbfv.ch/termine/",
    termine: [
      {
        id: "sbfv-dietikon",
        datum: "2026-09-04",
        ende: "2026-09-06",
        zeit: "4. September – 6. September 2026",
        art: "Wettkampfwochenende",
        titel: "Schweizermeisterschaft &amp; IFBB Mr. Universe Switzerland",
        ort: "Stadthalle Dietikon",
        notiz:
          "Veranstaltungswochenende zusammengefasst; laut Verband sind 15 IFBB Pro Cards vergeben worden. Den Tag deiner Klasse nennt die Ausschreibung.",
        quelle: "https://sbfv.ch/termine/"
      }
    ]
  },
  {
    id: "npc-switzerland",
    kuerzel: "NPC Switzerland",
    name: "NPC Switzerland",
    ueberbau: "NPC Worldwide · IFBB Pro League",
    text:
      "Zwei Shows im Jahr, beide im CAMPUSSAAL in Brugg-Windisch. Eigenes System, getrennt vom SBFV.",
    quelle: "https://npcswitzerland.com/wettkampfuebersicht/",
    termine: [
      {
        id: "npc-spring-show",
        datum: "2026-04-04",
        zeit: "4. April 2026",
        art: "Regional Qualifier",
        titel: "Swiss Spring Show 2026",
        ort: "CAMPUSSAAL, Brugg-Windisch",
        notiz:
          "Check-in am Vortag. Klassen von True Novice bis Open, Bodybuilding bis Bikini.",
        quelle: "https://npcswitzerland.com/en/swiss-spring-show-2026/"
      },
      {
        id: "npc-grand-prix",
        datum: "2026-08-23",
        zeit: "23. August 2026",
        art: "Regional Qualifier",
        titel: "Swiss Grand Prix 2026",
        ort: "CAMPUSSAAL, Brugg-Windisch",
        notiz:
          "Die grössere der beiden NPC-Shows. Check-in am Vortag, Anmeldeschluss war der 19. August.",
        quelle: "https://npcswitzerland.com/en/swiss-grand-prix-2026/"
      }
    ]
  },
  {
    id: "snbf-wnbf",
    kuerzel: "SNBF",
    name: "SNBF · Natural",
    ueberbau: "WNBF · Swiss Natural Bodybuilding and Fitness Federation",
    text:
      "Natural-Verband seit 1997. Startberechtigt ist nur, wer seit mindestens zehn Jahren keine verbotenen Substanzen genommen hat; Grundlage ist die WADA-Liste.",
    quelle: "https://snbf.ch/termine/",
    termine: [
      {
        id: "snbf-meisterschaft",
        datum: "2026-10-31",
        zeit: "31. Oktober 2026",
        art: "Internationale Meisterschaft",
        titel: "28. Internationale Meisterschaft",
        ort: "Aegerihalle, Unterägeri ZG",
        notiz:
          "Startgeld CHF 200, Ticketverkauf lief ab 1. Juli. Ein Fremdkalender nennt den 25. Oktober — die Detailseite des Verbands nennt den 31. Oktober.",
        quelle: "https://snbf.ch/event/meisterschaft-2025/"
      }
    ]
  },
  {
    id: "nac-schweiz",
    kuerzel: "NAC Schweiz",
    name: "NAC Schweiz / OFBB",
    ueberbau: "NAC International",
    text:
      "Eigener Verband mit eigenem Klassensystem. Die Website ist zuletzt 2013 geändert worden, für 2026 ist dort kein Termin veröffentlicht — vor einer Planung lohnt die direkte Nachfrage.",
    quelle: "http://www.ofbb.ch/",
    termine: []
  }
];

/* ------------------------------------------------------------- Bausteine --- */

const terminKarte = (t) => `<article class="bbcal-event" id="${t.id}" data-event data-datum="${t.datum}"${
  t.ende ? ` data-ende="${t.ende}"` : ""
}><time class="bbcal-event__date" datetime="${t.datum}">${t.zeit}</time><div class="bbcal-event__body"><span class="bbcal-event__type">${
  t.art
}</span><h3>${t.titel}</h3><p>${t.ort}</p><p>${
  t.notiz
}</p><p><a class="" href="${t.quelle}" target="_blank" rel="noopener noreferrer">Ausschreibung / Ergebnisse <span aria-hidden="true">↗</span></a></p></div><div class="bbcal-event__meta"><span class="bbcal-weeks-out" data-countdown data-datum="${
  t.datum
}"${t.ende ? ` data-ende="${t.ende}"` : ""}><strong>–</strong><small>–</small></span><span class="bbcal-event__status" data-status>Termin bestätigt</span></div></article>`;

const verbandsBlock = (v, index) => `<section class="bbcal-federation" id="${v.id}"><header class="bbcal-federation__header"><span class="bbcal-federation__number">0${
  index + 1
}</span><div><p class="eyebrow">${v.ueberbau}</p><h2>${v.name}</h2><p>${
  v.text
}</p></div><a class="" href="${v.quelle}" target="_blank" rel="noopener noreferrer">Offizielle Quelle <span aria-hidden="true">↗</span></a></header><div class="bbcal-event-list" data-kommende>${v.termine
  .map(terminKarte)
  .join("")}</div><p class="kalender-leer" data-leer hidden>Kein weiterer kommender Termin in dieser Übersicht bestätigt. Aktuelle Ankündigungen findest du beim Verband.</p><details class="bbcal-archive" hidden><summary><span>Vergangene Termine 2026</span><strong data-archiv-zahl>0 Termine · öffnen ↓</strong></summary><div class="bbcal-event-list" data-archiv></div></details></section>`;

const sprungLink = (v, index) => `<a class="bbcal-source-link" href="#${v.id}"><span>0${
  index + 1
}</span><strong>${v.kuerzel}</strong><small>Termine &amp; Quellen ↓</small></a>`;

const faq = [
  [
    "Welche Bodybuilding-Verbände gibt es in der Schweiz?",
    "Diese Übersicht führt vier Bereiche: SBFV als IFBB Switzerland, NPC Switzerland im NPC-Worldwide-System, die SNBF für Natural-Wettkämpfe und NAC Schweiz / OFBB. Klassen, Wertung und Teilnahmebedingungen unterscheiden sich; die Quellen stehen im jeweiligen Abschnitt."
  ],
  [
    "Sind SBFV und NPC Switzerland dasselbe?",
    "Nein. Der SBFV ist dem Weltverband IFBB International angeschlossen und vergibt an der Schweizermeisterschaft IFBB Pro Cards. NPC Switzerland arbeitet im NPC-Worldwide- und IFBB-Pro-League-System. Die beiden Wege werden deshalb getrennt aufgeführt."
  ],
  [
    "Welche Natural-Wettkämpfe gibt es 2026 in der Schweiz?",
    "Die SNBF richtet am 31. Oktober 2026 ihre 28. Internationale Meisterschaft in der Aegerihalle in Unterägeri aus. Startberechtigt ist dort nur, wer seit mindestens zehn Jahren keine verbotenen Substanzen genommen hat. NPC Switzerland führt zusätzlich eigene Natural-Klassen innerhalb seiner Shows."
  ],
  [
    "Gibt es Newcomer- oder Beginner-Klassen?",
    "Ja. Der SBFV nennt eine eigene Beginner-Anmeldung, NPC Switzerland führt True-Novice- und Novice-Klassen. Ob du startberechtigt bist, entscheidet das Reglement des jeweiligen Verbands — nicht diese Übersicht."
  ],
  [
    "Können deutsche oder österreichische Athleten in der Schweiz starten?",
    "Das hängt von der Veranstaltung ab. Eine internationale Ausschreibung ist noch keine Startberechtigung: Nationalität, Mitgliedschaft, Lizenz und Qualifikation gehören vor der Anmeldung mit dem Veranstalter geklärt."
  ],
  [
    "Wie aktuell sind Termine und Countdown?",
    `Die Quellen wurden am ${GELESEN} bei den Verbänden selbst gelesen, nicht in Sammelkalendern. Countdown und die Einteilung in kommende und vergangene Veranstaltungen richten sich nach dem Datum in der Schweiz. Terminänderungen erkennt die Seite nicht automatisch; massgeblich bleibt die verlinkte Veranstalterseite.`
  ]
];

const strukturierteTermine = verbaende.flatMap((v) => v.termine);

/* ------------------------------------------------------------- Umbauen ---- */

let html = await readFile(quelle, "utf8");

const ersetzeBlock = (von, bis, neu, was) => {
  const a = html.indexOf(von);
  if (a === -1) throw new Error(`${was}: Anfang nicht gefunden (${von.slice(0, 40)})`);
  const b = html.indexOf(bis, a);
  if (b === -1) throw new Error(`${was}: Ende nicht gefunden (${bis.slice(0, 40)})`);
  html = html.slice(0, a) + neu + html.slice(b + bis.length);
};

// 1) Sprungnavigation
ersetzeBlock(
  '<nav class="bbcal-source-grid"',
  "</nav>",
  `<nav class="bbcal-source-grid" aria-label="Direkt zu einem Verband">${verbaende
    .map(sprungLink)
    .join("")}</nav>`,
  "Sprungnavigation"
);

// 2) Verbandsliste
ersetzeBlock(
  '<div class="bbcal-federations">',
  '<section class="section section--muted" id="international">',
  `<div class="bbcal-federations">${verbaende
    .map(verbandsBlock)
    .join("")}</div></div></section><section class="section section--muted" id="international">`,
  "Verbandsliste"
);

// 3) Vorschaukacheln "nächste Shows". Das Skript baut sie beim Laden neu auf,
//    aber ohne JavaScript bleibt stehen, was im Markup steht — und dort standen
//    die österreichischen Termine.
{
  const kommende = strukturierteTermine
    .map((t) => ({ ...t, verband: verbaende.find((v) => v.termine.includes(t)).kuerzel }))
    .sort((a, b) => a.datum.localeCompare(b.datum));

  const karte = (t, i) => `<a href="#${t.id}" class="bbcal-next-card"><span class="bbcal-next-card__index">0${
    i + 1
  }</span><span class="bbcal-weeks-out" data-countdown data-datum="${t.datum}"${
    t.ende ? ` data-ende="${t.ende}"` : ""
  }><strong>–</strong><small>–</small></span><time datetime="${t.datum}">${t.zeit}</time><h3>${
    t.titel
  }</h3><p>${t.verband} · ${t.ort}</p><span class="bbcal-next-card__arrow" aria-hidden="true">→</span></a>`;

  ersetzeBlock(
    '<div class="bbcal-next-grid" data-naechste>',
    "</div>",
    `<div class="bbcal-next-grid" data-naechste>${kommende.map(karte).join("")}</div>`,
    "Vorschaukacheln"
  );
}

// 4) FAQ
ersetzeBlock(
  '<div class="kalender-faq">',
  "</div>",
  `<div class="kalender-faq">${faq
    .map(([frage, antwort]) => `<details><summary>${frage}</summary><p>${antwort}</p></details>`)
    .join("")}</div>`,
  "FAQ"
);

// 5) Strukturierte Daten
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
for (const eintrag of ld["@graph"]) {
  if (eintrag["@type"] === "ItemList") {
    eintrag.name = "Bodybuilding Wettkämpfe 2026 in der Schweiz";
    eintrag.itemListElement = strukturierteTermine.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.titel.replace(/&amp;/g, "&"),
      url: `https://campdoerfl.ch/bodybuilding-wettkaempfe-2026/#${t.id}`
    }));
  }
  if (eintrag["@type"] === "FAQPage") {
    eintrag.mainEntity = faq.map(([frage, antwort]) => ({
      "@type": "Question",
      name: frage,
      acceptedAnswer: { "@type": "Answer", text: antwort }
    }));
  }
}
html = html.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
);

/* --------------------------------------------------------- Land tauschen -- */

const tausch = [
  // Zeitzone zuerst, sonst greift die Wien-Regel weiter unten hinein.
  ["Europe/Vienna", "Europe/Zurich"],
  ["tagInWien", "tagInZuerich"],
  ["Datum in Österreich", "Datum in der Schweiz"],
  ["Österreichische Termine", "Schweizer Termine"],
  ["in Österreich", "in der Schweiz"],
  ["Wettkampfkalender%20%C3%96sterreich", "Wettkampfkalender%20Schweiz"],
  ["campdoerfl.at", "campdoerfl.ch"],
  ["de-AT", "de-CH"],
  ["de_AT", "de_CH"],
  ["Camp Dörfl Österreich", "Camp Dörfl Schweiz"],
  ["ÖSTERREICH", "SCHWEIZ"],
  ["Österreich", "Schweiz"],
  ["österreich", "schweiz"],
  ["Fünf Bereiche", "Vier Bereiche"],
  [">5<", ">4<"],
  // Schweizer Schreibweise: kein ß.
  ["außerdem", "ausserdem"],
  ["maßgeblich", "massgeblich"],
  ["regelmäßige", "regelmässige"]
];

for (const [von, nach] of tausch) html = html.replaceAll(von, nach);

// Der Vorspann des Verbandsverzeichnisses nennt die Verbände namentlich —
// "Austria" überlebt den Länder-Tausch, deshalb hier gezielt.
html = html.replace(
  /<p>IFBB Austria[^<]*<\/p>/,
  "<p>SBFV, NPC Switzerland, SNBF und NAC Schweiz / OFBB: Jeder Bereich führt zum eigenen Wettkampfsystem.</p>"
);

// Schweizer Schreibweise auch in der Bedienhilfe.
html = html.replaceAll("öffnen und schließen", "öffnen und schliessen");

// Die Landmarke im Kopf: Aus der österreichischen Flagge und "AT" wird das
// Schweizerkreuz und "CH" — genau die Auszeichnung, die die Startseite nutzt.
const schweizerFlagge = `<svg class="flagge" viewBox="0 0 32 32" role="img" aria-label="Schweiz" focusable="false">
    <rect width="32" height="32" rx="3" fill="#d52b1e"/>
    <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7V6Z" fill="#fff"/>
    <rect x="0.5" y="0.5" width="31" height="31" rx="2.5" fill="none" stroke="rgba(255,255,255,0.16)"/>
  </svg>`;

html = html.replace(
  /<span class="kopf__land">[\s\S]*?<\/span>\s*(?=<button|<\/div>)/,
  `<span class="kopf__land">${schweizerFlagge}<span aria-hidden="true">CH</span></span>`
);

if (/kopf__land">\s*AT/.test(html) || />AT</.test(html.replace(/<style[\s\S]*?<\/style>/g, " "))) {
  throw new Error('Im Kopf steht noch "AT" — die Landmarke wurde nicht ersetzt.');
}

// Quellenabschnitt
html = html.replace(
  /<p>Zusammengestellt von Dominik Dörfl[\s\S]*?<\/p>/,
  `<p>Zusammengestellt von Dominik Dörfl, IFBB Pro Athlet. Die Angaben von SBFV, NPC Switzerland und SNBF wurden am ${GELESEN} auf den Seiten der Verbände selbst gelesen, nicht in Sammelkalendern. Für NAC Schweiz / OFBB und für NABBA / WFF ist kein Schweizer Termin 2026 hinterlegt.</p>`
);

await writeFile(ziel, html, "utf8");

// Länderreste überall suchen — auch im Skript, dort standen Zeitzone und
// Domain. Das ß dagegen nur im Seitentext: Kommentare im mitgeführten
// Stylesheet und Skript sind keine Inhalte.
const nurText = html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<script[\s\S]*?<\/script>/g, " ");
const rest = [
  ...["Österreich", "Austria", "campdoerfl.at", "de-AT", "Europe/Vienna"].filter((b) => html.includes(b)),
  ...(nurText.includes("ß") ? ["ß im Seitentext"] : [])
];

console.log(`ch/seiten/bodybuilding-wettkaempfe-2026.html geschrieben (${(html.length / 1024).toFixed(0)} KB)`);
console.log(`  ${verbaende.length} Verbände, ${strukturierteTermine.length} Termine, ${faq.length} Fragen`);
console.log(rest.length ? `  ⚠ noch enthalten: ${rest.join(", ")}` : "  keine österreichischen Reste");
