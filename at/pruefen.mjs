/**
 * Prüft den gebauten Stand von campdoerfl.at.
 *
 *   node at/build.mjs && node at/pruefen.mjs
 *
 * Der Lauf besteht aus zwei Teilen: statische Prüfungen am HTML (schnell, immer)
 * und Prüfungen im echten Browser (Kontrast, Konsolenfehler, ruhiger Modus).
 * Fehlt Chrome, entfällt nur der zweite Teil — der Lauf schlägt deswegen nicht fehl.
 */

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, "..");
const dist = join(wurzel, "dist-at");
const PORT = Number(process.env.AT_PRUEF_PORT ?? 4181);

const fehler = [];
const hinweise = [];

function pruefe(bedingung, meldung) {
  if (!bedingung) fehler.push(meldung);
}

/* ========================================================== statisch ===== */

const html = await readFile(join(dist, "index.html"), "utf8");

// --- Grundgerüst und SEO ---------------------------------------------------
const h1 = [...html.matchAll(/<h1[\s\S]*?<\/h1>/g)];
pruefe(h1.length === 1, `Es muss genau eine H1 geben, gefunden: ${h1.length}`);
const h1Text = (h1[0]?.[0] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
pruefe(/online coaching/i.test(h1Text), `H1 nennt "Online Coaching" nicht: "${h1Text}"`);
pruefe(/österreich/i.test(h1Text), `H1 nennt "Österreich" nicht: "${h1Text}"`);

// Titel und Beschreibung gegen die Daten prüfen, nicht gegen eine hier
// festgenagelte Zeichenkette — sonst schlägt jede gewollte Änderung fehl.
const { marke: markeDaten, sprachfassungen, suchbegriffe, saeulen, transformationen } = await import("./marke.mjs");

pruefe(html.includes(`<title>${markeDaten.titel}</title>`), "Der Seitentitel im Build passt nicht zu marke.titel.");
// Google zeigt rund 60 Zeichen Titel und 155 Zeichen Beschreibung. Darüber
// wird abgeschnitten, darunter bleibt Platz ungenutzt.
pruefe(
  markeDaten.titel.length <= 60,
  `Der Titel ist mit ${markeDaten.titel.length} Zeichen zu lang — Google schneidet bei rund 60 ab.`
);
pruefe(
  markeDaten.beschreibung.length >= 120 && markeDaten.beschreibung.length <= 158,
  `Die Beschreibung ist ${markeDaten.beschreibung.length} Zeichen lang — sinnvoll sind 120 bis 158.`
);
pruefe(html.includes(`<meta name="description" content="${markeDaten.beschreibung}">`), "Meta-Description fehlt.");
pruefe(html.includes('<link rel="canonical" href="https://campdoerfl.at/">'), "Canonical fehlt.");
pruefe(html.includes('lang="de-AT"'), "html lang fehlt.");

// hreflang: jede Fassung muss ausgegeben werden, und die eigene muss dabei sein.
for (const fassung of sprachfassungen) {
  pruefe(
    html.includes(`<link rel="alternate" hreflang="${fassung.hreflang}" href="${fassung.url}">`),
    `hreflang ${fassung.hreflang} fehlt im Kopf.`
  );
}
pruefe(
  sprachfassungen.some((f) => f.url === `${markeDaten.url}/`),
  "hreflang nennt die eigene Adresse nicht — ohne Selbstverweis wertet Google die Gruppe nicht."
);

for (const tag of ["og:title", "og:description", "og:image", "og:url", "og:locale", "twitter:card", "twitter:image"]) {
  pruefe(html.includes(`"${tag}"`), `${tag} fehlt.`);
}
const ogBild = html.match(/property="og:image" content="([^"]+)"/)?.[1];
pruefe(ogBild?.startsWith("https://campdoerfl.at/"), "og:image ist keine absolute Adresse auf campdoerfl.at.");
pruefe(ogBild?.endsWith(".jpg"), "og:image sollte JPEG sein — WhatsApp und LinkedIn zeigen WebP unzuverlässig.");

// --- Sitzt jedes Bild an seinem Platz? -------------------------------------
// Die Bilder kamen einmal aus einer Positionsliste mit ...spread darin. Beim
// Einfügen einer Gruppe verrutschte alles dahinter, und im Kopf stand statt des
// Logos ein Vorher-Nachher-Foto. Der Bau ist inzwischen anders, die Prüfung
// bleibt: Ein falsch zugeordnetes Bild fällt sonst nur beim Hinsehen auf.
{
  const platz = (muster, erwartet, was) => {
    const treffer = html.match(muster);
    pruefe(Boolean(treffer), `${was}: Stelle nicht im Markup gefunden.`);
    if (!treffer) return;
    pruefe(
      new RegExp(erwartet).test(treffer[0]),
      `${was}: erwartet „${erwartet}", gefunden „${(treffer[0].match(/[a-z0-9-]+(?=-\d+-[a-f0-9]+\.(?:avif|webp|jpg))/) ?? ["?"])[0]}".`
    );
  };

  platz(/<a class="kopf__marke"[\s\S]{0,600}?<img[^>]*>/, "camp-doerfl-logo", "Logo in der Kopfzeile");
  platz(/<div class="held__bild">[\s\S]{0,900}?<img[^>]*>/, "ironman-run", "Heldenbild");
  platz(/<div class="dominik__bild"[\s\S]{0,900}?<img[^>]*>/, "about-gym-portrait", "Porträt bei „Über mich\"");
  platz(/<div class="portraet__bild">[\s\S]{0,900}?<img[^>]*>/, "guenter-preis", "Porträt von Günter Preis");
  platz(/<div class="band__rahmen"[\s\S]{0,900}?<img[^>]*>/, "bike-blue", "Radbild");
  platz(/<div class="abschluss__bild"[\s\S]{0,900}?<img[^>]*>/, "strasse-der-mitte", "Abschlussbild");

  // Die Gruppen in ihrer Reihenfolge.
  const gruppe = (muster, dateien, was) => {
    const abschnitte = [...html.matchAll(muster)];
    pruefe(abschnitte.length === dateien.length, `${was}: ${abschnitte.length} statt ${dateien.length} Bilder.`);
    abschnitte.forEach((treffer, i) => {
      const stamm = (dateien[i] ?? "").replace(/\.[^.]+$/, "").replaceAll("/", "-");
      pruefe(treffer[0].includes(stamm), `${was} Nr. ${i + 1}: erwartet „${stamm}".`);
    });
  };

  gruppe(/<div class="saeule__bild">[\s\S]{0,900}?<img[^>]*>/g, saeulen.map((s) => s.bild.datei), "Säulen");
  gruppe(/<div class="wandel__bild">[\s\S]{0,900}?<img[^>]*>/g, transformationen.map((t) => t.datei), "Vorher-Nachher");

  // Und das eine Bild, bei dem der Ausschnitt über die Erkennbarkeit
  // entscheidet: nie die Vorlage einbinden, immer die beschnittene Fassung.
  pruefe(
    !/original-transformation-front-progress/.test(html),
    "Das frontale Vorher-Nachher-Bild wird als Vorlage eingebunden — dort sind Mund und Kinn zu sehen. Die -anonym-Fassung nutzen."
  );
}

// --- Symbole ---------------------------------------------------------------
// Google unterstützt für Favicons kein WebP. Ohne PNG oder ICO bleibt in der
// Search Console und im Suchergebnis die graue Weltkugel stehen — genau daran
// hing es bei campdoerfl.at.
const symbolVerweise = [...html.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*>/g)].map((t) => t[0]);
pruefe(symbolVerweise.length > 0, "Die Seite hat kein Symbol für Browser-Tab und Suchergebnis.");
pruefe(
  symbolVerweise.some((v) => /type="image\/png"/.test(v)),
  "Kein PNG-Symbol im Kopf — Google zeigt sonst kein Logo."
);
pruefe(
  symbolVerweise.some((v) => v.includes("/favicon.ico")),
  "Kein Verweis auf /favicon.ico im Kopf."
);
pruefe(
  !symbolVerweise.some((v) => /image\/webp/.test(v)),
  "Ein Symbol wird als WebP angeboten — das versteht Googles Favicon-Abruf nicht."
);
pruefe(Boolean(await stat(join(dist, "favicon.ico")).catch(() => null)), "/favicon.ico fehlt im Build.");


// --- Suchbegriffe -----------------------------------------------------------
// Zwei Fehler sind hier möglich, und beide fallen sonst niemandem auf: Ein
// Begriff, auf den die Seite ausgerichtet sein soll, kommt gar nicht vor — oder
// er kommt so oft vor, dass der Text nach Aufzählung klingt statt nach Sprache.
// Deshalb wird beides gemessen.
{
  const sichtbar = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");
  const woerter = sichtbar.trim().split(" ").length;

  for (const begriff of suchbegriffe) {
    const treffer = (sichtbar.match(new RegExp(begriff.replace(/ /g, "\\s+"), "gi")) ?? []).length;
    // Dichte in Wörtern, nicht in Vorkommen: "Personal Trainer" sind zwei.
    const dichte = (treffer * begriff.split(" ").length) / woerter;

    pruefe(treffer > 0, `Der Suchbegriff "${begriff}" kommt auf der Seite nicht vor.`);
    pruefe(
      dichte < 0.03,
      `"${begriff}" macht ${(dichte * 100).toFixed(1)} % des Textes aus (${treffer}×) — das liest sich als Aufzählung.`
    );
  }

  // Der wichtigste Begriff gehört in Titel und H1-Umfeld, nicht nur irgendwo.
  pruefe(/online coaching/i.test(markeDaten.titel), "Der Titel nennt \"Online Coaching\" nicht.");
  pruefe(
    suchbegriffe.some((begriff) => new RegExp(begriff, "i").test(markeDaten.beschreibung)),
    "Die Meta-Beschreibung nennt keinen der Suchbegriffe."
  );

  // Mindestens ein Begriff muss in einer Überschrift stehen — Überschriften
  // wiegen schwerer als Fließtext.
  const ueberschriften = [...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)]
    .map((treffer) => treffer[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " "))
    .join(" | ");
  for (const begriff of ["Online Coaching", "Personal Trainer"]) {
    pruefe(
      new RegExp(begriff.replace(/ /g, "\\s+"), "i").test(ueberschriften),
      `"${begriff}" steht in keiner H1 oder H2.`
    );
  }
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
  pruefe(/\swidth="\d+"/.test(bild) && /\sheight="\d+"/.test(bild), `Bild ohne Maße (Layoutsprung): ${quelle}`);
  pruefe(/\ssizes="/.test(bild), `Bild ohne sizes: ${quelle}`);
}

const ersteBild = bilder.find((b) => b.includes("dominik-ironman-run-nuernberg"));
pruefe(Boolean(ersteBild) && ersteBild.includes('loading="eager"'), "Das Heldenbild darf nicht lazy geladen werden.");
pruefe(
  bilder.filter((b) => b.includes('loading="lazy"')).length >= bilder.length - 3,
  "Zu viele Bilder werden sofort geladen."
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
  const logo = daten["@graph"].find((eintrag) => eintrag["@type"] === "Organization")?.logo ?? "";
  pruefe(
    /\.(?:png|jpe?g|svg)$/i.test(logo),
    `Das Logo in den strukturierten Daten ist kein PNG/JPEG/SVG: ${logo} — Google liest dort kein WebP.`
  );

  // Bewertungen gehören nicht in die eigenen strukturierten Daten.
  pruefe(!ld.includes("aggregateRating"), "aggregateRating steht in den strukturierten Daten.");
  pruefe(!ld.includes('"Review"'), "Review steht in den strukturierten Daten.");

  const fragenLd = daten["@graph"]
    .find((eintrag) => eintrag["@type"] === "FAQPage")
    .mainEntity.map((eintrag) => eintrag.name);
  const fragenHtml = [...html.matchAll(/<summary>([\s\S]*?)<span class="faq__zeichen"/g)].map((t) =>
    t[1].trim()
  );
  pruefe(
    fragenLd.length === fragenHtml.length && fragenLd.every((frage, i) => frage === fragenHtml[i]),
    "FAQ im Markup und in den strukturierten Daten laufen auseinander."
  );
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
// Ehrlichkeit zur Verfügbarkeit: keine Standorte in Österreich behaupten.
pruefe(
  /keine Standorte in Österreich/i.test(html),
  "Der Hinweis fehlt, dass es keine Standorte in Österreich gibt."
);

// --- App-Ansichten, Preise, Herkunftszeichen -------------------------------
const { appAnsichten, laufzeiten, faq: faqDaten } = await import("./marke.mjs");

const appBeschriftungen = [...html.matchAll(/<figcaption>([^<]+)<\/figcaption>/g)].map((t) => t[1].trim());
for (const ansicht of appAnsichten) {
  pruefe(appBeschriftungen.includes(ansicht.label), `App-Ansicht "${ansicht.label}" fehlt im Markup.`);
}
pruefe(
  bilder.filter((b) => b.includes("at-app-")).length >= appAnsichten.length,
  `Es sind nicht alle ${appAnsichten.length} App-Ansichten als Bild eingebunden.`
);

// Preis, Monatswert und FAQ-Antwort dürfen nicht auseinanderlaufen.
const preisFrage = faqDaten.find((eintrag) => /kostet/i.test(eintrag.frage));
for (const eintrag of laufzeiten) {
  pruefe(html.includes(`${eintrag.preis}&nbsp;&euro;`), `Preis ${eintrag.preis} € steht nicht auf der Seite.`);
  // Tausenderpunkt mitdenken: „1.200 €" ist derselbe Preis wie 1200.
  const antwortZahlen = (preisFrage?.antwort ?? "").replace(/\.(?=\d{3}\b)/g, "");
  pruefe(
    antwortZahlen.includes(String(eintrag.preis)),
    `Die FAQ-Antwort zum Preis nennt ${eintrag.preis} € nicht.`
  );
  if (eintrag.monate > 1) {
    const proMonat = Math.round(eintrag.preis / eintrag.monate);
    pruefe(
      html.includes(`${proMonat}&nbsp;&euro; pro Monat`),
      `Der Monatswert ${proMonat} € für ${eintrag.dauer} fehlt.`
    );
  }
}

if (daten) {
  const angebote = daten["@graph"].find((eintrag) => eintrag["@type"] === "Service")?.offers ?? [];
  pruefe(
    angebote.length === laufzeiten.length &&
      laufzeiten.every((eintrag, i) => angebote[i].price === String(eintrag.preis) && angebote[i].priceCurrency === "EUR"),
    "Die Preise in den strukturierten Daten stimmen nicht mit den Laufzeiten überein."
  );
  // Ohne gesicherte Angabe zur Umsatzsteuer wird auch keine behauptet.
  pruefe(!ld.includes("valueAddedTaxIncluded"), "Die strukturierten Daten behaupten etwas zur Umsatzsteuer.");
}

pruefe(/<svg class="flagge"[^>]*aria-label="Österreich"/.test(html), "Die Flagge fehlt in der Kopfzeile.");
pruefe(
  (html.match(/class="google-zeichen"/g) ?? []).length === 1,
  "Das Google-Zeichen steht nicht genau einmal auf der Seite."
);

// --- Erfolge im Team -------------------------------------------------------
const { erfolge, guenter } = await import("./marke.mjs");

for (const eintrag of erfolge.zahlen) {
  pruefe(
    html.includes(`<dt>${eintrag.wert}</dt>`),
    `Die Zahl ${eintrag.wert} (${eintrag.label}) steht nicht auf der Seite.`
  );
}
pruefe(html.includes(erfolge.quelle), "Der Verweis auf die vollständige Erfolgsliste fehlt.");
pruefe(html.includes(guenter.link), "Der Verweis auf die ganze Geschichte fehlt.");
pruefe(html.includes(guenter.hinweis), "Der Hinweis zum Einzelfall und zur ärztlichen Beratung fehlt.");
pruefe(
  /nicht auf Österreich beschränkt/.test(html),
  "Es fehlt der Hinweis, dass die Erfolge nicht aus Österreich stammen."
);

// Die Liste auf campdoerfl.de wächst jede Saison. Wenn dort gebaut wurde,
// werden die Summen hier dagegen gehalten — sonst laufen die beiden Seiten
// stillschweigend auseinander.
const deErfolge = join(wurzel, "dist", "erfolge-im-team", "index.html");

if (existsSync(deErfolge)) {
  const deHtml = await readFile(deErfolge, "utf8");
  const summen = [...deHtml.matchAll(/<strong>([^<]+)<\/strong><span>([^<]+)<\/span>/g)].map((treffer) => ({
    wert: treffer[1].trim(),
    label: treffer[2].trim()
  }));

  for (const eintrag of erfolge.zahlen) {
    const dort = summen.find((s) => s.label === eintrag.label);
    pruefe(
      dort && dort.wert === eintrag.wert,
      `${eintrag.label}: hier ${eintrag.wert}, auf campdoerfl.de ${dort?.wert ?? "nicht gefunden"} — at/marke.mjs nachziehen.`
    );
  }
} else {
  hinweise.push(
    "dist/erfolge-im-team/ fehlt — die Erfolgszahlen wurden nicht gegen campdoerfl.de geprüft (dort einmal \"npm run build\" laufen lassen)."
  );
}

// --- Formular --------------------------------------------------------------
pruefe(html.includes('action="https://formsubmit.co/'), "Das Formular hat keinen Rückfall ohne JavaScript.");
pruefe(html.includes('data-endpunkt="https://formsubmit.co/ajax/'), "Der AJAX-Endpunkt des Formulars fehlt.");
pruefe(html.includes('name="_honey"'), "Die Spam-Falle im Formular fehlt.");
pruefe(/name="Einwilligung"[^>]*required/.test(html), "Die Einwilligung ist nicht verpflichtend.");

// --- Sicherheitskopfzeilen -------------------------------------------------
const kopfzeilen = JSON.parse(await readFile(join(dist, "server", "kopfzeilen.json"), "utf8"));
const csp = kopfzeilen["Content-Security-Policy"];
pruefe(!csp.includes("unsafe-inline"), "Die CSP erlaubt unsafe-inline.");
pruefe(csp.includes("https://formsubmit.co"), "Die CSP lässt das Formularziel nicht zu.");

const eingebettet = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)];
for (const [, inhalt] of eingebettet) {
  const hash = `sha256-${createHash("sha256").update(inhalt, "utf8").digest("base64")}`;
  pruefe(csp.includes(hash), `Eingebettetes Skript ohne Hash in der CSP: ${inhalt.slice(0, 40)}…`);
}

// --- Dateien aus at/oeffentlich/ -------------------------------------------
// Bestätigungsdateien prüfen den genauen Inhalt. Fällt eine davon weg, verliert
// man den Zugriff auf die Property, ohne dass es sonst irgendwo auffällt.
const oeffentlichVerzeichnis = join(hier, "oeffentlich");

if (existsSync(oeffentlichVerzeichnis)) {
  for (const eintrag of await readdir(oeffentlichVerzeichnis, { withFileTypes: true })) {
    if (!eintrag.isFile() || eintrag.name === "LIESMICH.md" || eintrag.name.startsWith(".")) continue;

    const vorlage = await readFile(join(oeffentlichVerzeichnis, eintrag.name));
    const gebaut = await readFile(join(dist, eintrag.name)).catch(() => null);

    pruefe(Boolean(gebaut), `at/oeffentlich/${eintrag.name} fehlt im Build.`);
    pruefe(
      gebaut !== null && vorlage.equals(gebaut),
      `${eintrag.name} wurde beim Bauen verändert — Bestätigungsdateien müssen unverändert bleiben.`
    );
  }
}

// --- Sitemap und robots ----------------------------------------------------
const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
pruefe(sitemap.includes("<loc>https://campdoerfl.at/</loc>"), "Die Sitemap führt die Startseite nicht.");
const robots = await readFile(join(dist, "robots.txt"), "utf8");
pruefe(robots.includes("Sitemap: https://campdoerfl.at/sitemap.xml"), "robots.txt verweist nicht auf die Sitemap.");

// --- Trennung von der deutschen Website ------------------------------------
for (const datei of await readdir(hier)) {
  if (!datei.endsWith(".mjs") && !datei.endsWith(".js") && !datei.endsWith(".css")) continue;
  // eslint-disable-next-line no-await-in-loop
  const inhalt = await readFile(join(hier, datei), "utf8");
  pruefe(
    !/from\s+"\.\.\/src\//.test(inhalt) && !/require\(["']\.\.\/src\//.test(inhalt),
    `at/${datei} greift auf src/ der deutschen Website zu.`
  );
}
pruefe(!existsSync(join(wurzel, "dist", "at")), "Der AT-Build ist in dist/ der deutschen Website gelandet.");

/* ======================================================== Unterseiten ===== */

// at/seiten/ bringt eigenständige Seiten mit eigenem CSS und JavaScript mit.
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
    pruefe(/lang="de-AT"/.test(seiteHtml), benannt("html lang fehlt."));

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

    // Wettkampftermine: Die Karten im Markup müssen genau den Daten in
    // scripts/at-wettkampftermine.mjs entsprechen — keine fehlenden, keine
    // doppelten. Doppelte sind hier schon einmal entstanden.
    if (route === "/bodybuilding-wettkaempfe-2026/") {
      const { termine } = await import("../scripts/at-wettkampftermine.mjs");
      const erwartet = Object.values(termine).flat();
      const gefunden = [...seiteHtml.matchAll(/<article class="bbcal-event" id="([^"]+)"/g)].map((x) => x[1]);

      pruefe(
        gefunden.length === erwartet.length,
        benannt(`${gefunden.length} Terminkarten statt ${erwartet.length} — scripts/at-wettkampftermine.mjs neu laufen lassen.`)
      );
      pruefe(
        new Set(gefunden).size === gefunden.length,
        benannt(`Doppelte Terminkarten: ${gefunden.filter((x, i) => gefunden.indexOf(x) !== i).join(", ")}`)
      );
      for (const eintrag of erwartet) {
        pruefe(gefunden.includes(eintrag.id), benannt(`Termin „${eintrag.id}" fehlt im Markup.`));
        pruefe(
          seiteHtml.includes(`data-datum="${eintrag.datum}"`),
          benannt(`Datum ${eintrag.datum} (${eintrag.id}) steht nicht auf der Seite.`)
        );
      }

      // Jeder Verbandsabschnitt braucht mindestens einen Termin oder einen
      // sichtbaren Hinweis — ein leerer Abschnitt ohne Erklärung ergibt nichts.
      for (const teil of seiteHtml.split('<section class="bbcal-federation"').slice(1)) {
        const kennung = (teil.match(/id="([^"]+)"/) ?? [])[1];
        const hatTermin = teil.includes('<article class="bbcal-event"');
        pruefe(
          hatTermin || teil.includes("kalender-leer"),
          benannt(`Verbandsabschnitt „${kennung}" hat weder Termin noch Hinweis.`)
        );
      }
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
  const bekannt = new Set([
    "/index.html",
    "/404.html",
    "/robots.txt",
    "/sitemap.xml",
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

  // Eine Form pro Adresse: die mit Schrägstrich am Ende.
  const faelle = [
    ["https://campdoerfl.at/", 200, null],
    ["https://www.campdoerfl.at/", 301, "https://campdoerfl.at/"],
    ["http://campdoerfl.at/", 301, "https://campdoerfl.at/"],
    ["https://campdoerfl.at/index.html", 301, "https://campdoerfl.at/"],
    ["https://campdoerfl.at/robots.txt", 200, null],
    ["https://campdoerfl.at/gibtsnicht/", 404, null],
    ["https://campdoerfl.at/gibtsnicht", 301, "https://campdoerfl.at/gibtsnicht/"]
  ];

  // Jede Unterseite muss über ihre Route erreichbar sein, und die Form ohne
  // Schrägstrich muss dorthin umleiten.
  for (const seite of unterseitenListe) {
    faelle.push([`https://campdoerfl.at${seite.route}`, 200, null]);
    faelle.push([
      `https://campdoerfl.at${seite.route.replace(/\/$/, "")}`,
      301,
      `https://campdoerfl.at${seite.route}`
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

  const fehlendesBild = await hole("https://campdoerfl.at/assets/at/gibtsnicht.avif");
  pruefe(
    !(fehlendesBild.headers.get("Cache-Control") ?? "").includes("immutable"),
    "Worker: Eine fehlende Datei unter /assets/ würde ein Jahr lang zwischengespeichert."
  );

  const startseite = await hole("https://campdoerfl.at/");
  pruefe(
    startseite.headers.get("Content-Security-Policy") === csp,
    "Worker: Die CSP der Antwort weicht von der abgelegten ab."
  );
  pruefe(
    !startseite.headers.get("X-Robots-Tag"),
    "Worker: Die echte Domain wird auf noindex gesetzt."
  );

  const testAdresse = await hole("https://camp-doerfl-at.workers.dev/");
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
  hinweise.push("Kein Chrome gefunden — Kontrast und Konsolenfehler wurden nicht geprüft (CHROME_PATH setzen).");
} else {
  const server = spawn("node", [join(hier, "server.mjs")], {
    cwd: wurzel,
    env: { ...process.env, AT_PORT: String(PORT) },
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
        // Alles sichtbar machen: Was erst beim Scrollen auftaucht, soll trotzdem
        // auf Kontrast geprüft werden.
        document.querySelectorAll("[data-auftauchen]").forEach((el) => el.classList.add("ist-sichtbar"));
        document.querySelector("[data-auftritt]")?.classList.add("ist-aufgetreten");
      });
      await new Promise((r) => setTimeout(r, 600));

      // Zuerst: Taucht überhaupt alles auf? Ein zu spezifischer Versteck-Selektor
      // lässt Text unsichtbar stehen, ohne dass irgendetwas fehlschlägt — genau
      // das ist beim Umbau auf .hat-js einmal passiert.
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
            // Über Fotos und Verläufen ist die Farbe nicht eindeutig — dort lieber
            // nichts melden als etwas Falsches.
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
          const gross = parseFloat(stil.fontSize) >= 24 || (parseFloat(stil.fontSize) >= 18.66 && Number(stil.fontWeight) >= 700);
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

      // Wie viel schneidet der Rahmen oben vom Motiv ab? Genau hier ging es
      // schief: Untereinander standen die Hochformat-Fotos in einem
      // Querformat-Rahmen, und der Ausschnitt nahm ihnen die Köpfe.
      for (const breite of [390, 768, 1440]) {
        await seite.setViewport({ width: breite, height: 900 });
        await new Promise((r) => setTimeout(r, 400));

        const beschnitten = await seite.evaluate(async () => {
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

          const flaechen = ".saeule__bild img, .fuerwen__feld img, .band__rahmen img, .held__bild img";
          const treffer = [];

          for (const bild of document.querySelectorAll(flaechen)) {
            const kasten = bild.getBoundingClientRect();
            if (!kasten.width || !kasten.height || !bild.naturalWidth) continue;

            const massstab = Math.max(kasten.width / bild.naturalWidth, kasten.height / bild.naturalHeight);
            const gerenderteHoehe = bild.naturalHeight * massstab;
            const ueberstand = gerenderteHoehe - kasten.height;
            if (ueberstand <= 1) continue;

            const lage = getComputedStyle(bild).objectPosition.split(" ")[1] ?? "50%";
            const anteilOben = (parseFloat(lage) / 100) * ueberstand / gerenderteHoehe;

            if (anteilOben > 0.08) {
              treffer.push({
                bild: bild.currentSrc.split("/").pop().slice(0, 44),
                oben: Math.round(anteilOben * 100)
              });
            }
          }
          return treffer;
        });

        for (const t of beschnitten) {
          fehler.push(
            `Bei ${breite} px schneidet der Rahmen ${t.oben} % oben vom Motiv ab (${t.bild}) — dort sitzt der Kopf.`
          );
        }
      }

      await seite.setViewport({ width: 1440, height: 900 });
      await seite.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle0" });
      await new Promise((r) => setTimeout(r, 500));

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

console.log(`campdoerfl.at geprüft: ${bilder.length} Bilder, ${verweise.size} Verweise, alles in Ordnung.`);
