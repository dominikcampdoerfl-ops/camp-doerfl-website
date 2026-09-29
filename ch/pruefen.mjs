/**
 * Prüft den gebauten Stand von campdoerfl.ch.
 *
 *   node ch/build.mjs && node ch/pruefen.mjs
 *
 * Der Lauf besteht aus zwei Teilen: statische Prüfungen am HTML (schnell,
 * immer) und Prüfungen im echten Browser (Überlauf, Kontrast, Konsolenfehler,
 * ruhiger Modus). Fehlt Chrome, entfällt nur der zweite Teil — der Lauf
 * schlägt deswegen nicht fehl.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, "..");
const dist = join(wurzel, "dist-ch");
const PORT = Number(process.env.CH_PRUEF_PORT ?? 4191);

const fehler = [];
const hinweise = [];

function pruefe(bedingung, meldung) {
  if (!bedingung) fehler.push(meldung);
}

/* ========================================================== statisch ===== */

const html = await readFile(join(dist, "index.html"), "utf8");
const {
  appAnsichten,
  laufzeiten,
  waehrung,
  monatswert,
  monatsAufzaehlung,
  leistungen,
  staedte,
  bewertungen,
  erfolge,
  faq: faqDaten
} = await import("./marke.mjs");

/* --- Schweizer Hochdeutsch -------------------------------------------------
   Die eine Regel, die auf dieser Seite überall gilt und die man beim Texten
   am leichtesten vergisst. Sie wird deshalb zuerst geprüft — am gebauten
   HTML, nicht an den Quellen. */
{
  const treffer = [...html.matchAll(/[^\s>]{0,24}ß[^\s<]{0,24}/g)].map((t) => t[0]);
  pruefe(
    treffer.length === 0,
    `Schweizer Hochdeutsch: „ß“ gehört hier nicht hin (${treffer.length} Stelle(n)): ${[...new Set(treffer)]
      .slice(0, 6)
      .join(", ")}`
  );
}

// Die häufigsten Wörter, bei denen die deutsche Schreibung durchrutscht.
for (const wort of ["regelmäßig", "größ", "Straße", "fließ", "außer", "heiß", "maßgeschneidert"]) {
  pruefe(!html.toLowerCase().includes(wort.toLowerCase()), `Deutsche Schreibung „${wort}“ im Markup.`);
}

// --- Grundgerüst und SEO ---------------------------------------------------
const h1 = [...html.matchAll(/<h1[\s\S]*?<\/h1>/g)];
pruefe(h1.length === 1, `Es muss genau eine H1 geben, gefunden: ${h1.length}`);
const h1Text = (h1[0]?.[0] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
pruefe(/online coaching/i.test(h1Text), `H1 nennt "Online Coaching" nicht: "${h1Text}"`);
pruefe(/schweiz/i.test(h1Text), `H1 nennt "Schweiz" nicht: "${h1Text}"`);

pruefe(
  html.includes("<title>Online Coaching Schweiz | Camp Dörfl</title>"),
  "Der Seitentitel stimmt nicht mehr."
);
pruefe(/<meta name="description" content="[^"]{80,165}"/.test(html), "Meta-Description fehlt oder ist zu kurz/lang.");
pruefe(html.includes('<link rel="canonical" href="https://campdoerfl.ch/">'), "Canonical fehlt.");
pruefe(html.includes('hreflang="de-CH"'), "hreflang de-CH fehlt.");
pruefe(html.includes('lang="de-CH"'), "html lang fehlt.");

// Die Schweizer Seite ist eigenständig — kein Canonical auf .de oder .at.
{
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  pruefe(
    !/campdoerfl\.(de|at)/.test(canonical),
    `Canonical zeigt auf eine andere Landesfassung: ${canonical}`
  );
  // hreflang wirkt nur beidseitig. Beide Landesfassungen liegen in diesem
  // Repository — die Gegenseite lässt sich also nachschlagen, statt sie
  // anzunehmen. Nennt eine Seite eine andere, ohne genannt zu werden, wertet
  // Google die Angabe nicht aus und behandelt die Seiten als Dubletten.
  const alternativen = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  const { sprachfassungen: atFassungen, marke: atMarke } = await import("../at/marke.mjs");
  const { marke: chMarke } = await import("./marke.mjs");

  pruefe(
    alternativen.some(([, kuerzel]) => kuerzel === "de-CH"),
    "hreflang nennt die eigene Adresse nicht — ohne Selbstverweis wertet Google die Gruppe nicht."
  );

  for (const [, kuerzel, adresse] of alternativen) {
    if (adresse.startsWith(`${chMarke.url}/`)) continue;

    if (adresse.startsWith(`${atMarke.url}/`)) {
      pruefe(
        atFassungen.some((fassung) => fassung.url === `${chMarke.url}/`),
        `Diese Seite nennt ${adresse}, aber at/marke.mjs nennt campdoerfl.ch nicht zurück — hreflang wirkt nur beidseitig.`
      );
      continue;
    }

    fehler.push(`hreflang ${kuerzel} zeigt auf ${adresse} — diese Fassung ist hier nicht bekannt.`);
  }
}

for (const tag of ["og:title", "og:description", "og:image", "og:url", "og:locale", "twitter:card", "twitter:image"]) {
  pruefe(html.includes(`"${tag}"`), `${tag} fehlt.`);
}
pruefe(html.includes('content="de_CH"'), "og:locale ist nicht de_CH.");
const ogBild = html.match(/property="og:image" content="([^"]+)"/)?.[1];
pruefe(ogBild?.startsWith("https://campdoerfl.ch/"), "og:image ist keine absolute Adresse auf campdoerfl.ch.");
pruefe(ogBild?.endsWith(".jpg"), "og:image sollte JPEG sein — WhatsApp und LinkedIn zeigen WebP unzuverlässig.");

// --- Symbole ---------------------------------------------------------------
// Google unterstützt für Favicons nur ICO, PNG, JPEG, SVG, GIF und BMP. Mit
// einem reinen WebP-Symbol bleibt im Suchergebnis die graue Weltkugel stehen.
{
  const symbolVerweise = [...html.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*>/g)].map((t) => t[0]);
  pruefe(symbolVerweise.length > 0, "Im Kopf steht kein einziges Symbol.");
  pruefe(
    symbolVerweise.some((v) => v.includes("/favicon.ico")),
    "Kein Verweis auf /favicon.ico im Kopf."
  );
  pruefe(
    symbolVerweise.some((v) => v.includes('type="image/png"')),
    "Kein PNG-Symbol im Kopf."
  );
  pruefe(
    !symbolVerweise.some((v) => v.includes(".webp")),
    "Ein Symbol wird als WebP angeboten — das versteht Googles Favicon-Abruf nicht."
  );
  pruefe(Boolean(await stat(join(dist, "favicon.ico")).catch(() => null)), "/favicon.ico fehlt im Build.");
}

// --- Überschriften in der richtigen Ordnung -------------------------------
const ebenen = [...html.matchAll(/<h([1-3])[\s>]/g)].map((t) => Number(t[1]));
let vorige = 0;
for (const ebene of ebenen) {
  pruefe(ebene <= vorige + 1, `Überschriftenebene springt von h${vorige} auf h${ebene}.`);
  vorige = ebene;
}

// --- Bilder ----------------------------------------------------------------
const bilder = [...html.matchAll(/<img\s[^>]*>/g)].map((t) => t[0]);
pruefe(bilder.length > 0, "Es ist kein einziges Bild im Markup.");

for (const bild of bilder) {
  const quelle = bild.match(/src="([^"]+)"/)?.[1] ?? "(ohne src)";
  pruefe(/\salt="/.test(bild), `Bild ohne alt: ${quelle}`);
  pruefe(/\swidth="\d+"/.test(bild) && /\sheight="\d+"/.test(bild), `Bild ohne Masse (Layoutsprung): ${quelle}`);
  pruefe(/\ssizes="/.test(bild), `Bild ohne sizes: ${quelle}`);
}

const heldBild = bilder.find((b) => b.includes("dominik-ironman-run-nuernberg"));
pruefe(Boolean(heldBild), "Das Ironman-Laufbild fehlt als Heldenbild.");
pruefe(heldBild?.includes('loading="eager"'), "Das Heldenbild darf nicht lazy geladen werden.");
pruefe(heldBild?.includes('fetchpriority="high"'), "Das Heldenbild ist nicht priorisiert (LCP).");
pruefe(
  bilder.filter((b) => b.includes('loading="lazy"')).length >= bilder.length - 3,
  "Zu viele Bilder werden sofort geladen."
);

// Nur echte Aufnahmen von Dominik. Die Seite darf keine Bilder aus dem
// Verzeichnis der österreichischen Fassung ziehen.
pruefe(!html.includes("/assets/at/"), "Die Seite bindet Bilder aus dem AT-Verzeichnis ein.");
pruefe(
  bilder.filter((b) => b.includes("ch-app-")).length === appAnsichten.length,
  `Es sind nicht alle ${appAnsichten.length} App-Ansichten als Bild eingebunden.`
);

// --- Jede referenzierte Datei muss es auch geben --------------------------
const verweise = new Set(
  [...html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)]
    .flatMap((t) => t[1].split(","))
    .map((wert) => wert.trim().split(" ")[0])
    .filter((wert) => wert.startsWith("/"))
);

for (const verweis of verweise) {
  const pfad = join(dist, decodeURIComponent(verweis.split("?")[0]));
  // eslint-disable-next-line no-await-in-loop
  const vorhanden = await stat(pfad).catch(() => null);
  pruefe(Boolean(vorhanden), `Verwiesene Datei fehlt im Build: ${verweis}`);
}

// --- Strukturierte Daten ---------------------------------------------------
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
pruefe(Boolean(ld), "Strukturierte Daten fehlen.");

let daten = null;
try {
  daten = JSON.parse(ld);
} catch (ursache) {
  fehler.push(`Strukturierte Daten sind kein gültiges JSON: ${ursache.message}`);
}

if (daten) {
  const typen = daten["@graph"].map((eintrag) => eintrag["@type"]);
  for (const erwartet of ["WebSite", "Organization", "Person", "Service", "FAQPage"]) {
    pruefe(typen.includes(erwartet), `Strukturierte Daten ohne ${erwartet}.`);
  }
  // Bewertungen gehören nicht in die eigenen strukturierten Daten.
  pruefe(!ld.includes("aggregateRating"), "aggregateRating steht in den strukturierten Daten.");
  pruefe(!ld.includes('"Review"'), "Review steht in den strukturierten Daten.");
  // Keine erfundene Niederlassung: kein LocalBusiness, keine Adresse.
  pruefe(!ld.includes("LocalBusiness"), "LocalBusiness in den strukturierten Daten — es gibt keinen Standort.");
  pruefe(!ld.includes("PostalAddress"), "PostalAddress in den strukturierten Daten — es gibt keine Adresse.");

  const dienst = daten["@graph"].find((eintrag) => eintrag["@type"] === "Service");
  pruefe(dienst?.areaServed?.["@type"] === "Country", "Das Liefergebiet ist kein Land.");
  pruefe(dienst?.areaServed?.name === "Schweiz", "Das Liefergebiet ist nicht die Schweiz.");
  pruefe(/Schweiz/.test(dienst?.name ?? ""), "Der Dienst heisst nicht nach der Schweiz.");

  const fragenLd = daten["@graph"]
    .find((eintrag) => eintrag["@type"] === "FAQPage")
    .mainEntity.map((eintrag) => eintrag.name);
  const fragenHtml = [...html.matchAll(/<summary>([\s\S]*?)<span class="faq__zeichen"/g)].map((t) => t[1].trim());
  pruefe(
    fragenLd.length === fragenHtml.length && fragenLd.every((frage, i) => frage === fragenHtml[i]),
    "FAQ im Markup und in den strukturierten Daten laufen auseinander."
  );
  pruefe(fragenHtml.length === faqDaten.length, "Nicht alle FAQ-Einträge stehen im Markup.");
}

// --- Inhalt ----------------------------------------------------------------
pruefe(!/lorem ipsum/i.test(html), "Lorem-Ipsum-Text im Markup.");
// Eine Vorlage, die auf ein Feld zugreift, das es nicht gibt, schreibt still
// „undefined“ in die Seite. Das ist in keinem Fall gewollt.
for (const wort of ["undefined", "NaN", "[object Object]"]) {
  pruefe(!html.includes(`>${wort}<`) && !html.includes(`${wort} `), `„${wort}“ steht im Markup — eine Vorlage greift ins Leere.`);
}
pruefe(!/TODO|FIXME|PLATZHALTER/i.test(html), "Platzhalter-Marker im Markup.");
// Was hinter einem false-Flag liegt, gibt es für Nutzer nicht (lib/featureFlags.ts der App).
pruefe(!/camp[- ]score/i.test(html), "Camp Score wird beworben, ist in der App aber abgeschaltet.");
pruefe(
  !/terminbuchung|termin buchen|jetzt termin/i.test(html),
  "Die Seite verspricht eine Terminbuchung, die es hier nicht gibt."
);
// Ehrlichkeit zur Verfügbarkeit: keine Standorte in der Schweiz behaupten.
pruefe(
  /keine Niederlassung/i.test(html) && /keine Standorte/i.test(html),
  "Der Hinweis fehlt, dass es in der Schweiz keine Standorte gibt."
);
pruefe(/schweizweit/i.test(html), "Das Wort „schweizweit“ kommt nirgends vor.");

// Preispositionierung: Camp Dörfl wirbt nicht über den Preis. „Bester
// Monatspreis“ ist die vorgegebene Auszeichnung der längsten Laufzeit und
// deshalb ausgenommen — alles andere in dieser Liste hat hier nichts verloren.
const ohneKennzeichnungen = html.replaceAll("Bester Monatspreis", "");
for (const wort of ["billig", "günstig", "Discount", "Schnäppchen", "Rabatt", "sparen", "% sparen", "Angebotspreis"]) {
  pruefe(
    !new RegExp(wort, "i").test(ohneKennzeichnungen),
    `Preiswerbung „${wort}“ im Markup — Camp Dörfl wirbt nicht über den Preis.`
  );
}

// --- Keine erfundenen Schweizer Kundinnen und Kunden ----------------------
{
  const stimmenBlock = html.match(/<section class="flaeche dunkel stimmen"[\s\S]*?<\/section>/)?.[0] ?? "";
  pruefe(Boolean(stimmenBlock), "Der Abschnitt mit den Bewertungen fehlt.");
  for (const stadt of staedte.flat()) {
    pruefe(
      !stimmenBlock.includes(stadt),
      `Bei den Bewertungen steht „${stadt}“ — für keine dieser Stimmen ist ein Ort belegt.`
    );
  }
  for (const stimme of bewertungen.stimmen) {
    pruefe(
      !("ort" in stimme) || Boolean(stimme.ort),
      `Die Stimme von ${stimme.name} trägt ein leeres Ortsfeld.`
    );
  }
  pruefe(
    html.includes(`>${bewertungen.schnitt}<`) || html.includes(`${bewertungen.schnitt}<span>`),
    "Die Gesamtwertung steht nicht auf der Seite."
  );
}

// --- Preise ----------------------------------------------------------------
const preisFrage = faqDaten.find((eintrag) => /kostet/i.test(eintrag.frage));
pruefe(Boolean(preisFrage), "In den FAQ fehlt die Frage nach dem Preis.");

for (const eintrag of laufzeiten) {
  const betrag = waehrung.markup(eintrag.preis);
  pruefe(html.includes(betrag), `Preis ${eintrag.preis} ${waehrung.code} steht nicht auf der Seite.`);
  pruefe(
    preisFrage && preisFrage.antwort.includes(String(eintrag.preis)),
    `Die FAQ-Antwort zum Preis nennt ${eintrag.preis} ${waehrung.code} nicht.`
  );

  // Der Monatswert steht bei allen drei Laufzeiten — auch beim einen Monat.
  const { gerundet, gerundetNoetig } = monatswert(eintrag);
  const monatsZeile = `${gerundetNoetig ? "rund " : ""}${waehrung.markup(gerundet)} pro Monat`;
  pruefe(
    html.includes(monatsZeile),
    `Der Monatswert „${monatsZeile.replace("&nbsp;", " ")}“ für ${eintrag.dauer} fehlt.`
  );

  // Geht die Division nicht auf, muss „rund“ davorstehen. Ohne das behauptet
  // die Seite einen Gesamtpreis, den sie gar nicht verlangt: 6 × 125 wären
  // 750 statt 749 CHF.
  if (gerundetNoetig) {
    pruefe(
      html.includes(`rund ${waehrung.markup(gerundet)} pro Monat`),
      `Bei ${eintrag.dauer} geht ${eintrag.preis} / ${eintrag.monate} nicht auf (${(
        eintrag.preis / eintrag.monate
      ).toFixed(2)}) — der Monatswert braucht ein „rund“.`
    );
  } else {
    pruefe(
      !html.includes(`rund ${waehrung.markup(gerundet)} pro Monat`),
      `Bei ${eintrag.dauer} geht die Division glatt auf — „rund“ ist dort falsch.`
    );
  }
  // Jede Laufzeit hat einen eigenen Knopf, der die Laufzeit ins Formular trägt.
  pruefe(
    html.includes(`data-laufzeit="${eintrag.dauer}"`),
    `Der Knopf für die Laufzeit „${eintrag.dauer}“ fehlt.`
  );
  pruefe(html.includes(eintrag.knopf), `Die Knopfbeschriftung „${eintrag.knopf}“ fehlt.`);
  if (eintrag.kennzeichnung) {
    pruefe(html.includes(eintrag.kennzeichnung), `Die Auszeichnung „${eintrag.kennzeichnung}“ fehlt.`);
  }
}

pruefe(
  (html.match(/preise__feld--hervor/g) ?? []).length >= 1 &&
    laufzeiten.filter((e) => e.hervorgehoben).length === 1,
  "Es muss genau eine Laufzeit hervorgehoben sein."
);
pruefe(html.includes("Alle Beträge in Schweizer Franken."), "Der Hinweis auf die Währung fehlt.");

// Preisbereich und FAQ nennen dieselbe Monatsstaffel — wortgleich.
{
  const unterschiedFrage = faqDaten.find((eintrag) => /Unterschied/i.test(eintrag.frage));
  pruefe(html.includes(monatsAufzaehlung), "Die Monatsstaffel fehlt im Preisbereich.");
  pruefe(
    unterschiedFrage?.antwort.includes(monatsAufzaehlung),
    "Preisbereich und FAQ nennen die Monatsstaffel unterschiedlich."
  );
}

// Die Schweizer Seite rechnet ausschliesslich in Franken. Ein übriggebliebener
// Euro-Betrag wäre entweder ein vergessener Rest oder eine zweite Währung auf
// derselben Seite — beides falsch.
{
  const euroReste = [...html.matchAll(/[^\s>]{0,12}(?:&euro;|€|\bEUR\b)[^\s<]{0,12}/g)].map((t) => t[0]);
  pruefe(
    euroReste.length === 0,
    `Euro-Beträge auf der Schweizer Seite (${euroReste.length}): ${[...new Set(euroReste)].slice(0, 5).join(", ")}`
  );
}

for (const punkt of leistungen) {
  pruefe(html.includes(punkt), `„${punkt}“ fehlt bei „Immer enthalten“.`);
}

if (daten) {
  const angebote = daten["@graph"].find((eintrag) => eintrag["@type"] === "Service")?.offers ?? [];
  pruefe(
    angebote.length === laufzeiten.length &&
      laufzeiten.every(
        (eintrag, i) =>
          angebote[i].price === String(eintrag.preis) && angebote[i].priceCurrency === waehrung.code
      ),
    "Die Preise in den strukturierten Daten stimmen nicht mit den Laufzeiten überein."
  );
  // Ohne gesicherte Angabe zur Umsatzsteuer wird auch keine behauptet.
  pruefe(!ld.includes("valueAddedTaxIncluded"), "Die strukturierten Daten behaupten etwas zur Mehrwertsteuer.");
}

// --- Zurückhaltung bei der Schweiz ----------------------------------------
// Die Flagge markiert den Markt: einmal in der Kopfzeile, einmal in der
// Schublade. Mehr wäre Dekor — kein Matterhorn-, Edelweiss- oder Uhrenkitsch.
{
  const flaggen = (html.match(/class="flagge"/g) ?? []).length;
  pruefe(flaggen >= 1, "Die Flagge fehlt in der Kopfzeile.");
  pruefe(
    flaggen <= 2,
    `Die Flagge steht ${flaggen}-mal auf der Seite — vorgesehen sind Kopfzeile und Schublade.`
  );
  pruefe(
    /<svg class="flagge" viewBox="0 0 32 32"/.test(html),
    "Die Flagge ist nicht quadratisch — die Schweizer Flagge ist kein Rechteck."
  );
  pruefe(
    /role="img" aria-label="Schweiz"/.test(html),
    "Die Flagge in der Kopfzeile hat keinen zugänglichen Namen."
  );
  pruefe(
    (html.match(/class="kopf__land"/g) ?? []).length === 1,
    "Die Länderkennzeichnung steht nicht genau einmal in der Kopfzeile."
  );
}
for (const kitsch of ["Matterhorn", "Edelweiss", "Schokolade", "Uhrwerk", "Alpenpanorama"]) {
  pruefe(!new RegExp(kitsch, "i").test(html), `Schweiz-Klischee „${kitsch}“ im Markup.`);
}
pruefe(
  (html.match(/schweiz__umriss/g) ?? []).length === 2,
  "Der Umriss der Schweiz soll genau zweimal vorkommen (Schweiz-Abschnitt und Abschluss)."
);

// Schweizer Rot kommt im Stylesheet höchstens zweimal zum Einsatz.
{
  const css = await readFile(join(hier, "styles.css"), "utf8");
  const einsaetze = (css.match(/var\(--rot\)/g) ?? []).length;
  pruefe(
    einsaetze <= 2,
    `Schweizer Rot wird ${einsaetze}-mal aus dem Stylesheet eingesetzt — vorgesehen sind höchstens zwei Micro-Akzente. Das Rot der Flagge steckt im SVG und zählt hier nicht mit.`
  );
}

// --- Navigation und Sprungziele -------------------------------------------
{
  const ziele = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((t) => t[1]));
  const anker = [...html.matchAll(/href="#([^"]+)"/g)].map((t) => t[1]);
  for (const ziel of new Set(anker)) {
    pruefe(ziele.has(ziel), `Der Anker #${ziel} führt ins Leere.`);
  }
  for (const pflicht of ["system", "ablauf", "dominik", "erfahrungen", "preise", "faq", "start", "schweiz"]) {
    pruefe(ziele.has(pflicht), `Der Abschnitt #${pflicht} fehlt.`);
  }
}

// --- Formular --------------------------------------------------------------
pruefe(html.includes('action="https://formsubmit.co/'), "Das Formular hat keinen Rückfall ohne JavaScript.");
pruefe(html.includes('data-endpunkt="https://formsubmit.co/ajax/'), "Der AJAX-Endpunkt des Formulars fehlt.");
pruefe(html.includes('name="_honey"'), "Die Spam-Falle im Formular fehlt.");
pruefe(/name="Einwilligung"[^>]*required/.test(html), "Die Einwilligung ist nicht verpflichtend.");
pruefe(html.includes('value="campdoerfl.ch"'), "Die Herkunft der Anfrage wird nicht mitgeschickt.");
pruefe(html.includes("data-laufzeit-feld"), "Im Formular fehlt das Feld, in das die Preisknöpfe schreiben.");

// --- Sicherheitskopfzeilen -------------------------------------------------
const kopfzeilen = JSON.parse(await readFile(join(dist, "server", "kopfzeilen.json"), "utf8"));
const csp = kopfzeilen["Content-Security-Policy"];
pruefe(!csp.includes("unsafe-inline"), "Die CSP erlaubt unsafe-inline.");
pruefe(csp.includes("https://formsubmit.co"), "Die CSP lässt das Formularziel nicht zu.");

const eingebettet = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)];
const { createHash } = await import("node:crypto");
for (const [, inhalt] of eingebettet) {
  const hash = `sha256-${createHash("sha256").update(inhalt, "utf8").digest("base64")}`;
  pruefe(csp.includes(hash), `Eingebettetes Skript ohne Hash in der CSP: ${inhalt.slice(0, 40)}…`);
}

// --- Dateien aus ch/oeffentlich/ -------------------------------------------
// Bestätigungsdateien von Suchmaschinen werden Byte für Byte geprüft. Kommt hier
// etwas nicht an oder verändert an, schlägt die Bestätigung fehl.
{
  const oeffentlichVerzeichnis = join(hier, "oeffentlich");
  if (existsSync(oeffentlichVerzeichnis)) {
    for (const eintrag of await readdir(oeffentlichVerzeichnis, { withFileTypes: true })) {
      if (!eintrag.isFile() || eintrag.name === "LIESMICH.md" || eintrag.name.startsWith(".")) continue;
      // eslint-disable-next-line no-await-in-loop
      const vorlage = await readFile(join(oeffentlichVerzeichnis, eintrag.name));
      // eslint-disable-next-line no-await-in-loop
      const gebaut = await readFile(join(dist, eintrag.name)).catch(() => null);
      pruefe(Boolean(gebaut), `ch/oeffentlich/${eintrag.name} fehlt im Build.`);
      if (gebaut) {
        pruefe(gebaut.equals(vorlage), `ch/oeffentlich/${eintrag.name} wurde beim Build verändert.`);
      }
    }
  }
}

// --- Erfolge im Team -------------------------------------------------------
{
  pruefe(html.includes('id="erfolge"'), "Der Abschnitt „Erfolge im Team“ fehlt.");

  // Zahlen und Beschriftungen stehen wirklich auf der Seite.
  for (const eintrag of erfolge.zahlen) {
    pruefe(html.includes(`<dt>${eintrag.wert}</dt>`), `Die Kennzahl „${eintrag.wert}“ fehlt.`);
    pruefe(html.includes(eintrag.label), `Die Beschriftung „${eintrag.label}“ fehlt.`);
  }

  // In sich stimmig: Siege ≤ Podestplätze ≤ Platzierungen. Fängt Zahlendreher
  // ab, wenn der Bestand auf campdoerfl.de nachgeführt wird.
  const zahl = (label) => Number(erfolge.zahlen.find((e) => e.label === label)?.wert);
  const platzierungen = zahl("Platzierungen");
  const siege = zahl("erste Plätze");
  const podeste = zahl("Podestplätze");
  pruefe(
    Number.isFinite(platzierungen) && Number.isFinite(siege) && Number.isFinite(podeste),
    "Platzierungen, erste Plätze und Podestplätze sind nicht alle als Zahl hinterlegt."
  );
  pruefe(
    siege <= podeste && podeste <= platzierungen,
    `Die Kennzahlen widersprechen sich: ${siege} Siege, ${podeste} Podestplätze, ${platzierungen} Platzierungen.`
  );

  // Die Schweizer Ergebnisse sind der Grund, warum dieser Abschnitt hier
  // überhaupt etwas Schweizerisches behaupten darf — sie müssen dastehen.
  pruefe(erfolge.schweiz.length >= 1, "Es ist kein Schweizer Ergebnis hinterlegt.");
  for (const eintrag of erfolge.schweiz) {
    pruefe(html.includes(eintrag), `Das Schweizer Ergebnis „${eintrag}“ fehlt im Markup.`);
    pruefe(
      /\(\d{4}\)/.test(eintrag),
      `Dem Schweizer Ergebnis „${eintrag}“ fehlt die Jahreszahl.`
    );
  }

  // Vorher-Nachher-Aufnahmen: alle vier eingebunden, jede mit eigenem alt.
  // Nicht am Präfix „original-“ festmachen: Einzelne Aufnahmen liegen als
  // eigene, beschnittene Fassung ein (transformation-front-progress-anonym)
  // und tragen den Präfix dann nicht.
  const bildStaemme = erfolge.transformationen.map((fall) =>
    fall.datei.replace(/\.[^.]+$/, "").replaceAll("/", "-")
  );
  const transformationsBilder = bilder.filter((b) => bildStaemme.some((stamm) => b.includes(stamm)));
  pruefe(
    transformationsBilder.length === erfolge.transformationen.length,
    `Es sind ${transformationsBilder.length} statt ${erfolge.transformationen.length} Vorher-Nachher-Aufnahmen eingebunden.`
  );
  for (const fall of erfolge.transformationen) {
    pruefe(html.includes(fall.titel), `Die Bildunterschrift „${fall.titel}“ fehlt.`);
    pruefe(html.includes(fall.alt), `Der alt-Text zu „${fall.detail}“ fehlt.`);
    pruefe(
      /vorher/i.test(fall.alt) && /nachher/i.test(fall.alt),
      `Der alt-Text zu „${fall.detail}“ sagt nicht, dass es ein Vorher-Nachher-Vergleich ist.`
    );
  }

  // Ehrlichkeit: keine Schweizer Kundschaft behaupten, kein Ergebnis versprechen.
  pruefe(
    /nicht auf die Schweiz allein/i.test(html),
    "Der Hinweis fehlt, dass sich die Erfolge auf das Coaching insgesamt beziehen."
  );
  pruefe(
    /Ergebnisse sind individuell/i.test(html),
    "Der Hinweis fehlt, dass Ergebnisse individuell sind und sich nicht versprechen lassen."
  );
  const erfolgsBlock = html.match(/<section class="flaeche hell erfolge"[\s\S]*?<\/section>/)?.[0] ?? "";
  pruefe(Boolean(erfolgsBlock), "Der Erfolgs-Abschnitt liess sich nicht aus dem Markup lesen.");
  for (const stadt of staedte.flat()) {
    pruefe(
      !erfolgsBlock.includes(stadt),
      `Im Erfolgs-Abschnitt steht „${stadt}“ — für keine dieser Personen ist ein Wohnort belegt.`
    );
  }
  // Keine Garantien.
  for (const wort of ["garantiert", "Garantie", "sicher \\d+ kg", "in nur \\d+ Wochen"]) {
    pruefe(
      !new RegExp(wort, "i").test(erfolgsBlock),
      `Der Erfolgs-Abschnitt verspricht etwas („${wort}“).`
    );
  }
}

// --- Sitemap und robots ----------------------------------------------------
const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
pruefe(sitemap.includes("<loc>https://campdoerfl.ch/</loc>"), "Die Sitemap führt die Startseite nicht.");
pruefe(sitemap.includes('hreflang="de-CH"'), "Die Sitemap nennt de-CH nicht.");
const robots = await readFile(join(dist, "robots.txt"), "utf8");
pruefe(robots.includes("Sitemap: https://campdoerfl.ch/sitemap.xml"), "robots.txt verweist nicht auf die Sitemap.");

// --- Trennung von den beiden anderen Websites ------------------------------
for (const datei of await readdir(hier)) {
  if (!datei.endsWith(".mjs") && !datei.endsWith(".js") && !datei.endsWith(".css")) continue;
  // eslint-disable-next-line no-await-in-loop
  const inhalt = await readFile(join(hier, datei), "utf8");
  pruefe(
    !/from\s+"\.\.\/src\//.test(inhalt) && !/require\(["']\.\.\/src\//.test(inhalt),
    `ch/${datei} greift auf src/ der deutschen Website zu.`
  );
  pruefe(
    !/from\s+"\.\.\/at\//.test(inhalt) && !/require\(["']\.\.\/at\//.test(inhalt),
    `ch/${datei} greift auf at/ der österreichischen Website zu.`
  );
}
pruefe(!existsSync(join(wurzel, "dist", "ch")), "Der CH-Build ist in dist/ der deutschen Website gelandet.");
pruefe(!existsSync(join(wurzel, "dist-at", "ch")), "Der CH-Build ist in dist-at/ der österreichischen Website gelandet.");

/* ======================================================== Unterseiten ===== */

const { marke: markeDaten } = await import("./marke.mjs");

// ch/seiten/ bringt eigenständige Seiten mit eigenem CSS und JavaScript mit.
// Ohne Hash in der Richtlinie blockiert die CSP das eigene Markup — die Seite
// käme ohne Gestaltung an, und zwar erst live, nicht lokal.
const unterseitenListe = [];
const unterseitenQuelle = join(hier, "seiten");

if (existsSync(unterseitenQuelle)) {
  for (const eintrag of await readdir(unterseitenQuelle, { withFileTypes: true })) {
    if (!eintrag.isFile() || !eintrag.name.endsWith(".html")) continue;

    const route = `/${eintrag.name.replace(/\.html$/, "")}/`;
    const pfad = join(dist, route.replace(/^\/|\/$/g, ""), "index.html");
    const seiteHtml = await readFile(pfad, "utf8").catch(() => null);

    pruefe(Boolean(seiteHtml), `${route} fehlt im Build.`);
    if (!seiteHtml) continue;

    unterseitenListe.push({ route, html: seiteHtml });

    const benannt = (was) => `${route}: ${was}`;

    const h1Treffer = [...seiteHtml.matchAll(/<h1[\s\S]*?<\/h1>/g)];
    pruefe(h1Treffer.length === 1, benannt(`${h1Treffer.length} H1 statt genau einer.`));
    pruefe(/<title>[^<]{10,}<\/title>/.test(seiteHtml), benannt("Der Titel fehlt oder ist zu kurz."));
    pruefe(/<meta name="description" content="[^"]{60,}"/.test(seiteHtml), benannt("Die Beschreibung fehlt."));
    pruefe(
      seiteHtml.includes(`<link rel="canonical" href="${markeDaten.url}${route}">`),
      benannt(`Das Canonical zeigt nicht auf ${markeDaten.url}${route} (mit Schrägstrich am Ende).`)
    );
    pruefe(/lang="de-CH"/.test(seiteHtml), benannt("html lang fehlt."));

    // Die Bilder müssen als Dateien vorliegen, nicht mehr eingebettet.
    pruefe(
      !/data:image\/[a-z+]+;base64,/.test(seiteHtml),
      benannt("Es stecken noch eingebettete Bilder im HTML — der Build sollte sie auslagern.")
    );

    // Jeder eingebettete Block braucht seinen Hash in der Richtlinie.
    for (const [muster, bereich] of [
      [/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g, "script-src"],
      [/<style[^>]*>([\s\S]*?)<\/style>/g, "style-src"]
    ]) {
      for (const treffer of seiteHtml.matchAll(muster)) {
        const hash = `sha256-${createHash("sha256").update(treffer[1], "utf8").digest("base64")}`;
        pruefe(
          csp.includes(hash),
          benannt(`Ein eingebetteter Block fehlt in ${bereich} der CSP — die Seite käme ohne Gestaltung an.`)
        );
      }
    }

    // Verwiesene Dateien müssen existieren.
    // Sprungmarken und Suchteile abschneiden; reine Anker sind keine Dateien.
    for (const verweis of new Set(
      [...seiteHtml.matchAll(/(?:src|href)="(\/[^"]+)"/g)]
        .map((treffer) => treffer[1].split("?")[0].split("#")[0])
        .filter((wert) => wert && wert !== "/")
    )) {
      const dateiPfad = join(dist, decodeURIComponent(verweis));
      // eslint-disable-next-line no-await-in-loop
      pruefe(Boolean(await stat(dateiPfad).catch(() => null)), benannt(`Verwiesene Datei fehlt: ${verweis}`));
    }

    // Kein verwaister Zustand: Die Startseite muss auf die Unterseite verweisen.
    pruefe(
      html.includes(`href="${route}"`),
      benannt("Die Startseite verweist nicht auf diese Seite — verwaiste Seiten ranken schlechter.")
    );

    // Indexierbare Seiten gehören in die Sitemap.
    const indexierbar = !/content="[^"]*noindex/i.test(seiteHtml);
    const sitemapInhalt = await readFile(join(dist, "sitemap.xml"), "utf8");
    pruefe(
      sitemapInhalt.includes(`${markeDaten.url}${route}`) === indexierbar,
      benannt(
        indexierbar
          ? "Die Seite ist indexierbar, steht aber nicht in der Sitemap."
          : "Die Seite steht auf noindex, aber in der Sitemap."
      )
    );
  }
}

/* ============================================================ Worker ===== */

// Der Worker entscheidet über Weiterleitungen, 404 und Cache — geht dort etwas
// kaputt, ist die Seite kaputt. Deshalb wird er hier mit einem gestellten
// ASSETS-Binding durchgespielt.
{
  const modul = await import(`${join(dist, "server", "index.js")}?t=${Date.now()}`);
  const bekannt = new Set(["/index.html", "/404.html", "/robots.txt", "/sitemap.xml",
    ...unterseitenListe.map((seite) => `${seite.route}index.html`)
  ]);
  const env = {
    ASSETS: {
      fetch: async (anfrage) => {
        const pfad = new URL(anfrage.url).pathname;
        return bekannt.has(pfad)
          ? new Response("inhalt", {
              headers: { "Content-Type": pfad.endsWith(".html") ? "text/html" : "text/plain" }
            })
          : new Response("fehlt", { status: 404 });
      }
    }
  };

  const hole = (adresse) => modul.default.fetch(new Request(adresse), env);

  const faelle = [
    ["https://campdoerfl.ch/", 200, null],
    ["https://www.campdoerfl.ch/", 301, "https://campdoerfl.ch/"],
    ["http://campdoerfl.ch/", 301, "https://campdoerfl.ch/"],
    ["https://campdoerfl.ch/index.html", 301, "https://campdoerfl.ch/"],
    ["https://campdoerfl.ch/robots.txt", 200, null],
    ["https://campdoerfl.ch/gibtsnicht/", 404, null],
    ["https://campdoerfl.ch/gibtsnicht", 301, "https://campdoerfl.ch/gibtsnicht/"]
  ];

  for (const seite of unterseitenListe) {
    faelle.push([`https://campdoerfl.ch${seite.route}`, 200, null]);
    faelle.push([
      `https://campdoerfl.ch${seite.route.replace(/\/$/, "")}`,
      301,
      `https://campdoerfl.ch${seite.route}`
    ]);
  }

  for (const [adresse, status, ziel] of faelle) {
    const antwort = await hole(adresse);
    pruefe(antwort.status === status, `Worker: ${adresse} liefert ${antwort.status} statt ${status}.`);
    if (ziel) {
      pruefe(
        antwort.headers.get("Location") === ziel,
        `Worker: ${adresse} leitet nach ${antwort.headers.get("Location")} statt ${ziel}.`
      );
    }
  }

  const fehlendesBild = await hole("https://campdoerfl.ch/assets/ch/gibtsnicht.avif");
  pruefe(
    !(fehlendesBild.headers.get("Cache-Control") ?? "").includes("immutable"),
    "Worker: Eine fehlende Datei unter /assets/ würde ein Jahr lang zwischengespeichert."
  );

  const startseite = await hole("https://campdoerfl.ch/");
  pruefe(
    startseite.headers.get("Content-Security-Policy") === csp,
    "Worker: Die CSP der Antwort weicht von der abgelegten ab."
  );
  pruefe(!startseite.headers.get("X-Robots-Tag"), "Worker: Die echte Domain wird auf noindex gesetzt.");

  const testAdresse = await hole("https://camp-doerfl-ch.workers.dev/");
  pruefe(
    (testAdresse.headers.get("X-Robots-Tag") ?? "").includes("noindex"),
    "Worker: Die workers.dev-Adresse ist nicht auf noindex gesetzt — sie wäre eine zweite Fassung der Seite."
  );
}

/* =========================================================== Browser ===== */

const chromePfade = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
];
const chrome = process.env.CHROME_PATH ?? chromePfade.find((pfad) => existsSync(pfad));

if (!chrome) {
  hinweise.push("Kein Chrome gefunden — Überlauf, Kontrast und Konsolenfehler wurden nicht geprüft (CHROME_PATH setzen).");
} else {
  const server = spawn("node", [join(hier, "server.mjs")], {
    cwd: wurzel,
    env: { ...process.env, CH_PORT: String(PORT) },
    stdio: "ignore"
  });

  try {
    await warteAufServer();
    const { default: puppeteer } = await import("puppeteer-core");
    const browser = await puppeteer.launch({ executablePath: chrome, headless: "new" });

    try {
      const seite = await browser.newPage();
      const konsole = [];
      seite.on("console", (m) => m.type() === "error" && konsole.push(m.text()));
      seite.on("pageerror", (e) => konsole.push(`pageerror: ${e.message}`));

      await seite.setViewport({ width: 1440, height: 900 });
      await seite.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle0" });
      await seite.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        document.querySelectorAll("[data-auftauchen]").forEach((el) => el.classList.add("ist-sichtbar"));
        document.querySelector("[data-auftritt]")?.classList.add("ist-aufgetreten");
      });
      await new Promise((r) => setTimeout(r, 600));

      // Taucht überhaupt alles auf? Ein zu spezifischer Versteck-Selektor lässt
      // Text unsichtbar stehen, ohne dass irgendetwas fehlschlägt.
      const versteckt = await seite.evaluate(async () => {
        const warten = (ms) => new Promise((r) => setTimeout(r, ms));
        document.documentElement.style.scrollBehavior = "auto";
        const hoehe = document.documentElement.scrollHeight;
        for (let y = 0; y < hoehe; y += window.innerHeight * 0.75) {
          window.scrollTo(0, y);
          await warten(120);
        }
        window.scrollTo(0, 0);
        await warten(1400);

        return Array.from(
          document.querySelectorAll("[data-auftauchen], [data-auftritt] .maske > span, [data-auftritt] .held__unterzeile")
        )
          .filter((el) => Number(getComputedStyle(el).opacity) < 0.9)
          .map((el) => (el.textContent || "").trim().slice(0, 40) || el.className);
      });

      for (const stelle of versteckt) {
        fehler.push(`Bleibt nach dem Scrollen unsichtbar: „${stelle}“`);
      }

      await seite.evaluate(() => {
        document.querySelectorAll("[data-auftauchen]").forEach((el) => el.classList.add("ist-sichtbar"));
        document.querySelector("[data-auftritt]")?.classList.add("ist-aufgetreten");
      });
      await new Promise((r) => setTimeout(r, 400));

      const schwach = await seite.evaluate(() => {
        const zuRgb = (wert) => (wert.match(/[\d.]+/g) ?? []).map(Number);
        const kanal = (c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        const leuchte = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
        const verhaeltnis = (a, b) => {
          const [hell, dunkel] = leuchte(a) > leuchte(b) ? [a, b] : [b, a];
          return (leuchte(hell) + 0.05) / (leuchte(dunkel) + 0.05);
        };

        function untergrund(el) {
          let knoten = el;
          while (knoten && knoten !== document.documentElement) {
            const stil = getComputedStyle(knoten);
            const farbe = zuRgb(stil.backgroundColor);
            // Über Fotos und Verläufen ist die Farbe nicht eindeutig — dort
            // lieber nichts melden als etwas Falsches.
            if (stil.backgroundImage !== "none") return null;
            if (farbe.length >= 3 && (farbe[3] === undefined || farbe[3] > 0.85)) return farbe.slice(0, 3);
            knoten = knoten.parentElement;
          }
          return null;
        }

        const treffer = [];
        for (const el of document.querySelectorAll("p, li, h1, h2, h3, a, span, summary, dt, dd, label, button")) {
          if (!el.textContent.trim()) continue;
          if (el.children.length && !Array.from(el.childNodes).some((k) => k.nodeType === 3 && k.textContent.trim()))
            continue;
          const kasten = el.getBoundingClientRect();
          if (!kasten.width || !kasten.height) continue;
          const stil = getComputedStyle(el);
          if (stil.visibility === "hidden" || stil.opacity === "0") continue;
          const hinten = untergrund(el);
          if (!hinten) continue;
          const wert = verhaeltnis(zuRgb(stil.color).slice(0, 3), hinten);
          const gross =
            parseFloat(stil.fontSize) >= 24 || (parseFloat(stil.fontSize) >= 18.66 && Number(stil.fontWeight) >= 700);
          if (wert < (gross ? 3 : 4.5)) {
            treffer.push({
              text: el.textContent.trim().slice(0, 45),
              wert: Number(wert.toFixed(2)),
              noetig: gross ? 3 : 4.5
            });
          }
        }
        return treffer;
      });

      for (const t of schwach) {
        fehler.push(`Kontrast ${t.wert}:1 (nötig ${t.noetig}:1) bei „${t.text}“`);
      }

      /* --- Breiten: kein waagerechter Überlauf, keine abgeschnittenen Köpfe,
             touchfreundliche Knöpfe. Die Liste entspricht dem Abschlusscheck. */
      for (const breite of [1920, 1440, 1280, 768, 430, 390]) {
        await seite.setViewport({ width: breite, height: 900 });
        await new Promise((r) => setTimeout(r, 400));

        const befund = await seite.evaluate(async () => {
          const warten = (ms) => new Promise((r) => setTimeout(r, ms));
          for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.7) {
            window.scrollTo(0, y);
            await warten(90);
          }
          window.scrollTo(0, 0);
          await Promise.all(
            [...document.images]
              .filter((b) => !b.complete)
              .map((b) => new Promise((r) => { b.onload = b.onerror = r; }))
          );

          // 1. Waagerechter Überlauf am Dokument.
          const ueberlauf = document.documentElement.scrollWidth - document.documentElement.clientWidth;

          // 2. Wie viel schneidet der Rahmen oben vom Motiv ab? Genau hier ging
          //    es auf der AT-Seite schief: Hochformat-Fotos in Querformat-Rahmen.
          const flaechen = ".saeule__bild img, .fuerwen__feld img, .leistung__rahmen img, .held__bild img";
          const beschnitten = [];

          for (const bild of document.querySelectorAll(flaechen)) {
            const kasten = bild.getBoundingClientRect();
            if (!kasten.width || !kasten.height || !bild.naturalWidth) continue;

            const massstab = Math.max(kasten.width / bild.naturalWidth, kasten.height / bild.naturalHeight);
            const gerenderteHoehe = bild.naturalHeight * massstab;
            const ueberstand = gerenderteHoehe - kasten.height;
            if (ueberstand <= 1) continue;

            const lage = getComputedStyle(bild).objectPosition.split(" ")[1] ?? "50%";
            const anteilOben = ((parseFloat(lage) / 100) * ueberstand) / gerenderteHoehe;

            if (anteilOben > 0.08) {
              beschnitten.push({ bild: bild.currentSrc.split("/").pop().slice(0, 44), oben: Math.round(anteilOben * 100) });
            }
          }

          // 3. Knöpfe müssen mit dem Daumen zu treffen sein.
          const klein = [];
          for (const el of document.querySelectorAll(".knopf, .stimmen__knopf, .kopf__burger")) {
            const kasten = el.getBoundingClientRect();
            if (!kasten.width || !kasten.height) continue;
            if (kasten.height < 44) klein.push({ text: el.textContent.trim().slice(0, 26), hoehe: Math.round(kasten.height) });
          }

          return { ueberlauf, beschnitten, klein };
        });

        pruefe(
          befund.ueberlauf <= 1,
          `Bei ${breite} px läuft die Seite ${befund.ueberlauf} px waagerecht über.`
        );
        for (const t of befund.beschnitten) {
          fehler.push(`Bei ${breite} px schneidet der Rahmen ${t.oben} % oben vom Motiv ab (${t.bild}) — dort sitzt der Kopf.`);
        }
        for (const t of befund.klein) {
          fehler.push(`Bei ${breite} px ist der Knopf „${t.text}“ nur ${t.hoehe} px hoch (nötig 44).`);
        }
      }

      /* --- Die Preisknöpfe stellen die Laufzeit im Formular ein. ---------- */
      await seite.setViewport({ width: 1440, height: 900 });
      await seite.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 400));

      const laufzeitProbe = await seite.evaluate(() => {
        const knopf = document.querySelector('[data-laufzeit="6 Monate"]');
        const feld = document.querySelector("[data-laufzeit-feld]");
        if (!knopf || !feld) return null;
        knopf.click();
        return feld.value;
      });
      pruefe(
        laufzeitProbe !== null && laufzeitProbe.startsWith("6 Monate"),
        `Der Knopf „6 Monate starten“ stellt die Laufzeit nicht ein (Feld steht auf „${laufzeitProbe}“).`
      );

      // Ruhiger Modus: Nichts darf unsichtbar bleiben.
      const ruhig = await browser.newPage();
      await ruhig.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await ruhig.setViewport({ width: 1440, height: 900 });
      await ruhig.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 500));
      const unsichtbar = await ruhig.evaluate(() =>
        Array.from(document.querySelectorAll("[data-auftauchen], [data-auftritt] .maske > span")).filter(
          (el) => Number(getComputedStyle(el).opacity) < 0.9
        ).length
      );
      pruefe(unsichtbar === 0, `Im ruhigen Modus bleiben ${unsichtbar} Elemente unsichtbar.`);

      pruefe(konsole.length === 0, `Fehler in der Browserkonsole: ${konsole.join(" | ")}`);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
}

async function warteAufServer() {
  for (let versuch = 0; versuch < 60; versuch += 1) {
    try {
      const antwort = await fetch(`http://127.0.0.1:${PORT}/`);
      if (antwort.ok) return;
    } catch {
      /* noch nicht da */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Vorschau-Server ist nicht hochgekommen.");
}

/* ============================================================ Bilanz ===== */

for (const hinweis of hinweise) console.log(`Hinweis: ${hinweis}`);

if (fehler.length) {
  console.error(`\n${fehler.length} Beanstandung(en):`);
  for (const meldung of fehler) console.error(`  · ${meldung}`);
  process.exit(1);
}

console.log(`campdoerfl.ch geprüft: ${bilder.length} Bilder, ${verweise.size} Verweise, alles in Ordnung.`);
