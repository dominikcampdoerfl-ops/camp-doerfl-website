/**
 * Trägt die österreichischen Wettkampftermine in
 * at/seiten/bodybuilding-wettkaempfe-2026.html ein.
 *
 *   node scripts/at-wettkampftermine.mjs
 *
 * Die Seite selbst kam als fertiges HTML. Termine gehören trotzdem nicht von
 * Hand in 3.900 Zeilen Markup — hier stehen sie an einer Stelle, das Skript
 * schreibt die Terminlisten und die strukturierten Daten neu. Alles andere an
 * der Datei bleibt unangetastet.
 *
 * **Wer einen Termin ändert, ändert ihn hier** und lässt das Skript neu laufen.
 *
 * Recherchestand 12.09.2026, ausschliesslich aus den Seiten der Verbände bzw.
 * der IFBB selbst — nicht aus Sammelkalendern.
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const datei = join(wurzel, "at", "seiten", "bodybuilding-wettkaempfe-2026.html");

/** Termine je Verbandsabschnitt, Schlüssel ist die id im Markup. */
export const termine = {
  "ifbb-austria": [
    {
      id: "ifbb-klagenfurt",
      datum: "2026-03-28",
      ende: "2026-03-29",
      zeit: "28. März – 29. März 2026",
      art: "Diamond Cup · Beginner Cup",
      titel: "IFBB Diamond Cup Austria &amp; Beginner Cup International",
      ort: "All Stars Studios, Klagenfurt am Wörthersee",
      notiz:
        "Am selben Wochenende lief der Semi Pro Klagenfurt. Qualifikation zur Europameisterschaft; die Ergebnislisten stehen beim Verband.",
      quelle: "https://ifbb.com/ifbb-diamond-cup-austria-2026/"
    },
    {
      id: "ifbb-hitzendorf",
      datum: "2026-09-12",
      ende: "2026-09-13",
      zeit: "12. September – 13. September 2026",
      art: "IFBB-Wettkampfwochenende",
      titel: "Newcomer Cup, Fitness Mania Classic &amp; Mr. / Ms. Universe",
      ort: "Kirschenhalle Hitzendorf bei Graz",
      notiz:
        "Samstag Newcomer Cup und Fitness Mania Classic, Sonntag Mr. &amp; Ms. Universe Austria — offen für Athleten aller IFBB-Verbände.",
      quelle: "https://ifbbaustria.at/termine/national"
    }
  ],
  "npc-austria": [
    {
      id: "npc-wels",
      datum: "2026-04-25",
      zeit: "25. April 2026",
      art: "Regional Qualifier",
      titel: "Austria Natural Regional &amp; Austria Open Regional",
      ort: "Stadthalle Wels",
      notiz:
        "Zwei ausgeschriebene Wettkämpfe am selben Tag und am selben Ort — Natural und Open getrennt gewertet.",
      quelle: "https://npcnewsonline.com/schedule_event/2026-npc-worldwide-austria-natural-regional/"
    },
    {
      id: "npc-austrian-oak",
      datum: "2026-08-22",
      ende: "2026-08-23",
      zeit: "22. August – 23. August 2026",
      art: "Regional &amp; Pro Qualifier",
      titel: "The Austrian Oak",
      ort: "Marx Halle, Wien",
      notiz:
        "Samstag Natural Regional, Sonntag Pro Qualifier mit IFBB Pro Cards. Einwaage am Freitag.",
      quelle: "https://www.npcaustria.at/event-informationen-austrian-oak/"
    }
  ],
  anbf: [
    {
      id: "anbf-herbst",
      datum: "2026-10-03",
      zeit: "3. Oktober 2026",
      art: "Natural-Meisterschaft",
      titel: "ANBF Herbstmeisterschaft 2026",
      ort: "TipsArena Linz",
      notiz: "Anmeldung war vom 9. Mai bis 29. August geöffnet.",
      quelle: "https://anbf.at/wettkampf/2026"
    }
  ],
  abpf: [
    {
      id: "abpf-meisterschaften",
      datum: "2026-05-30",
      zeit: "30. Mai 2026",
      art: "Meisterschaft &amp; Neulinge",
      titel: "17. Int. Österreichische Meisterschaften &amp; 9. Neulingsmeisterschaften",
      ort: "Lugner City, Wien",
      notiz: "Beginn 14:00 Uhr.",
      quelle: "https://abpf.at/"
    },
    {
      id: "abpf-cup",
      datum: "2026-10-24",
      zeit: "24. Oktober 2026",
      art: "WM-Qualifikation",
      titel: "17. Internationaler Austria Cup",
      ort: "Lugner City, Wien",
      notiz:
        "Qualifikation für die 17. WBPF-Weltmeisterschaft vom 3. bis 9. Dezember 2026 in Vientiane, Laos. Beginn 14:00 Uhr.",
      quelle: "https://abpf.at/"
    }
  ],
  "nabba-wff": [
    {
      id: "nabba-em",
      datum: "2026-06-06",
      zeit: "6. Juni 2026",
      art: "Europameisterschaft",
      titel: "29. NABBA Europameisterschaft",
      ort: "Kirschenhalle Hitzendorf bei Graz",
      notiz: "Die Europameisterschaft des Verbands, ausgetragen in Österreich.",
      quelle: "https://nabba-austria.at/"
    },
    {
      id: "nabba-austria-open",
      datum: "2026-10-03",
      zeit: "3. Oktober 2026",
      art: "Meisterschaft",
      titel: "Herbstmeisterschaft 2026 · Austria Open",
      ort: "KUZ Mattersburg",
      notiz:
        "Am selben Tag wie die ANBF-Herbstmeisterschaft in Linz — zwei Veranstaltungen, zwei Verbände.",
      quelle: "https://nabba-austria.at/"
    }
  ]
};

const karte = (t) =>
  `<article class="bbcal-event" id="${t.id}" data-event data-datum="${t.datum}"${
    t.ende ? ` data-ende="${t.ende}"` : ""
  }><time class="bbcal-event__date" datetime="${t.datum}">${t.zeit}</time>` +
  `<div class="bbcal-event__body"><span class="bbcal-event__type">${t.art}</span>` +
  `<h3>${t.titel}</h3><p>${t.ort}</p><p>${t.notiz}</p>` +
  `<p><a class="" href="${t.quelle}" target="_blank" rel="noopener noreferrer">Ausschreibung / Ergebnisse <span aria-hidden="true">↗</span></a></p></div>` +
  `<div class="bbcal-event__meta"><span class="bbcal-weeks-out" data-countdown data-datum="${t.datum}"${
    t.ende ? ` data-ende="${t.ende}"` : ""
  }><strong>–</strong><small>–</small></span>` +
  `<span class="bbcal-event__status" data-status>Termin bestätigt</span></div></article>`;

/**
 * Schreibt die Termine in die Seite. Läuft nur beim direkten Aufruf — die
 * Prüfung importiert diese Datei wegen `termine` und darf dabei nichts
 * verändern.
 */
export async function eintragen() {
  let html = await readFile(datei, "utf8");

  // Zuerst jede vorhandene Terminkarte entfernen — überall im Dokument, nicht nur
  // in den Listen. Sonst bleiben Karten aus einem früheren Lauf stehen, etwa im
  // Archiv, und die Seite zeigt Termine doppelt. So ist der Lauf wiederholbar
  // und repariert einen kaputten Stand von selbst.
  const vorher = (html.match(/<article class="bbcal-event"/g) ?? []).length;
  html = html.replace(/<article class="bbcal-event"[\s\S]*?<\/article>/g, "");
  if (vorher) console.log(`  ${vorher} vorhandene Terminkarte(n) entfernt`);

  for (const [verband, liste] of Object.entries(termine)) {
    const anker = `<section class="bbcal-federation" id="${verband}"`;
    const start = html.indexOf(anker);
    if (start === -1) throw new Error(`Abschnitt ${verband} nicht gefunden.`);

    const auf = '<div class="bbcal-event-list" data-kommende>';
    const listenAnfang = html.indexOf(auf, start);
    if (listenAnfang === -1) throw new Error(`Terminliste in ${verband} nicht gefunden.`);

    // Das schliessende Tag der Liste suchen, nicht das erste </div> überhaupt:
    // In den Terminkarten stecken weitere <div>. Ein naives indexOf trifft das
    // innere und lässt die alten Karten hinter der neuen Liste stehen — genau so
    // sind beim ersten Lauf Doppelungen entstanden.
    let tiefe = 0;
    let listenEnde = -1;
    const muster = /<div\b[^>]*>|<\/div>/g;
    muster.lastIndex = listenAnfang;

    for (let treffer; (treffer = muster.exec(html)); ) {
      tiefe += treffer[0] === "</div>" ? -1 : 1;
      if (tiefe === 0) {
        listenEnde = treffer.index;
        break;
      }
    }

    if (listenEnde === -1) throw new Error(`Ende der Terminliste in ${verband} nicht gefunden.`);

    html =
      html.slice(0, listenAnfang) +
      `${auf}${liste.map(karte).join("")}</div>` +
      html.slice(listenEnde + 6);
  }

    const alle = Object.values(termine).flat();
  const heute = new Date().toISOString().slice(0, 10);

  /* --- Textstellen, die mit den Terminen zusammenhängen ------------------- */
  // Diese Änderungen standen vorher von Hand in der Datei. Nach einem
  // Zurücksetzen auf die Vorlage wären sie weg — deshalb gehören sie hierher.

  // Die Vorschau war auf noindex gesetzt. Die Seite soll gefunden werden.
  html = html.replace(
    '<meta name="robots" content="noindex, nofollow">',
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'
  );

  // Quellenangabe: alle fünf Verbände haben inzwischen einen Termin.
  const quelleAnfang = html.indexOf("<p>Zusammengestellt von Dominik Dörfl");
  if (quelleAnfang !== -1) {
    const quelleEnde = html.indexOf("</p>", quelleAnfang) + 4;
    html =
      html.slice(0, quelleAnfang) +
      "<p>Zusammengestellt von Dominik Dörfl, IFBB Pro Athlet. Die Angaben von IFBB Austria, " +
      "NPC Austria, ANBF, ABPF und NABBA / WFF Austria wurden am 12. September 2026 auf den Seiten " +
      "der Verbände beziehungsweise der IFBB selbst gelesen, nicht in Sammelkalendern.</p>" +
      html.slice(quelleEnde);
  }

  html = html.replace(
    "Diese Übersicht berücksichtigt IFBB Austria, NPC Austria, ANBF, ABPF sowie NABBA / WFF Austria. Die Verbände",
    "Diese Übersicht berücksichtigt IFBB Austria, NPC Austria, ANBF, ABPF sowie NABBA / WFF Austria — alle fünf mit mindestens einem bestätigten Termin 2026. Die Verbände"
  );

  html = html.replace(
    "Die ANBF kündigt ihre Herbstmeisterschaft am 3. Oktober 2026 in Linz an.",
    "Die ANBF kündigt ihre Herbstmeisterschaft am 3. Oktober 2026 in Linz an — am selben Tag richtet NABBA / WFF in Mattersburg die Herbstmeisterschaft · Austria Open aus."
  );

  // Die Vorschaukacheln baut das Skript der Seite beim Laden neu auf; ohne
  // JavaScript bliebe hier der Stand der Vorlage stehen. Leeren ist ehrlicher
  // als ein veralteter Aushang.
  {
    const auf = '<div class="bbcal-next-grid" data-naechste>';
    const a = html.indexOf(auf);
    if (a !== -1) {
      let tiefe = 0;
      let ende = -1;
      const muster = /<div\b[^>]*>|<\/div>/g;
      muster.lastIndex = a;
      for (let treffer; (treffer = muster.exec(html)); ) {
        tiefe += treffer[0] === "</div>" ? -1 : 1;
        if (tiefe === 0) {
          ende = treffer.index;
          break;
        }
      }
      if (ende !== -1) {
        const naechste = alle
          .filter((x) => (x.ende ?? x.datum) >= heute)
          .sort((x, y) => x.datum.localeCompare(y.datum))
          .slice(0, 4);
        const kachel = (x, i) =>
          `<a href="#${x.id}" class="bbcal-next-card"><span class="bbcal-next-card__index">0${i + 1}</span>` +
          `<span class="bbcal-weeks-out" data-countdown data-datum="${x.datum}"${
            x.ende ? ` data-ende="${x.ende}"` : ""
          }><strong>–</strong><small>–</small></span>` +
          `<time datetime="${x.datum}">${x.zeit}</time><h3>${x.titel}</h3><p>${x.ort}</p>` +
          `<span class="bbcal-next-card__arrow" aria-hidden="true">→</span></a>`;
        html = html.slice(0, a) + auf + naechste.map(kachel).join("") + "</div>" + html.slice(ende + 6);
      }
    }
  }

/* --- Strukturierte Daten: dieselbe Liste, keine zweite Pflege ------------- */
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

  for (const eintrag of ld["@graph"]) {
    if (eintrag["@type"] !== "ItemList") continue;
    eintrag.itemListElement = alle
      .slice()
      .sort((a, b) => a.datum.localeCompare(b.datum))
      .map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.titel.replace(/&amp;/g, "&"),
        url: `https://campdoerfl.at/bodybuilding-wettkaempfe-2026/#${t.id}`
      }));
  }

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  );

  await writeFile(datei, html, "utf8");

  const jeVerband = Object.entries(termine)
    .map(([k, v]) => `${k}: ${v.length}`)
    .join(", ");
  console.log(`at/seiten/bodybuilding-wettkaempfe-2026.html: ${alle.length} Termine eingetragen`);
  console.log(`  ${jeVerband}`);
}

const direktGestartet = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (direktGestartet) {
  await eintragen();
}
