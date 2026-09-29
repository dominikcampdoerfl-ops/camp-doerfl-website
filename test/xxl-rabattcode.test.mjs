import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const route = "/xxl-nutrition-rabattcode/";
const markup = pages.find((seite) => seite.route === route).render();

const strukturierteDaten = JSON.parse(
  markup.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
);
const knoten = (typ) => strukturierteDaten["@graph"].filter((eintrag) => eintrag["@type"] === typ);

const nurText = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

test("Titel und Überschrift nennen Code und Rabatt in einem Satz", () => {
  const titel = markup.match(/<title>([^<]*)<\/title>/)[1];
  const h1 = nurText(markup.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);

  assert.equal(titel, "XXL Nutrition Rabattcode 2026: DOMINIK – 10 % Rabatt");
  assert.equal(h1, "XXL Nutrition Rabattcode: 10 % mit DOMINIK sparen");

  // Genau eine H1 — sonst streitet die Seite mit sich selbst darüber, worum es
  // geht, und keine Maschine weiß, welcher Satz die Antwort ist.
  assert.equal((markup.match(/<h1\b/g) || []).length, 1);
});

test("die Antwortbox steht vor jedem Fließtext und beantwortet die Frage", () => {
  const h1Ende = markup.indexOf("</h1>");
  const box = markup.indexOf('class="code-card code-card--answer"');
  const lead = markup.indexOf('class="ff-hero__lead"');

  assert.ok(box > h1Ende, "die Antwortbox gehört unter die H1");
  assert.ok(box < lead, "die Antwortbox gehört vor den Fließtext");

  const ausschnitt = nurText(markup.slice(box, lead));
  assert.match(ausschnitt, /Aktueller XXL Nutrition Rabattcode/);
  assert.match(ausschnitt, /Rabatt 10 %/);
  assert.match(ausschnitt, /Stand September 2026/);
  assert.match(ausschnitt, /Zum Shop/);
});

test("die Karte zeigt DOMINIK und übergibt der Zwischenablage die echte Schreibweise", () => {
  // main.js sucht Rückmeldung und Wert über .code-card; ohne diese Klasse
  // bliebe der Knopf stumm.
  const box = markup.slice(markup.indexOf('class="code-card code-card--answer"'));

  assert.match(box, /data-copy-code="Dominik"/);
  assert.match(box, /<dd class="answer-facts__code"><span data-code-value>Dominik<\/span><\/dd>/);
  assert.match(box, /data-copy-feedback/);
});

test("der Partnerlink ist gekennzeichnet und für Suchmaschinen entwertet", () => {
  const links = markup.match(/<a\b[^>]*href="https:\/\/[^"]*xxlnutrition[^"]*"[^>]*>/g) || [];

  assert.ok(links.length > 0, "ohne Link zum Shop hat die Seite keinen Zweck");

  for (const link of links) {
    assert.match(link, /rel="sponsored noopener noreferrer"/, `unentwerteter Partnerlink: ${link}`);
    assert.match(link, /target="_blank"/, `Partnerlink ohne eigenes Fenster: ${link}`);
  }

  assert.match(markup, /class="ad-note ad-note--hero" href="\/werbung-partnerlinks\/"/);
});

test("die FAQ beantwortet die Fragen, mit denen Menschen suchen", () => {
  const faqSeite = knoten("FAQPage");
  assert.equal(faqSeite.length, 1);

  const fragen = faqSeite[0].mainEntity.map((eintrag) => eintrag.name);

  for (const erwartet of [
    "Wie lautet der aktuelle XXL Nutrition Rabattcode?",
    "Wie viel Rabatt gibt DOMINIK?",
    "Wo gebe ich den XXL Nutrition Code ein?",
    "Funktioniert der Code auch bei Angeboten?",
    "Gibt es einen XXL Nutrition Influencer Code?"
  ]) {
    assert.ok(fragen.includes(erwartet), `Frage fehlt: ${erwartet}`);
  }

  for (const eintrag of faqSeite[0].mainEntity) {
    const antwort = eintrag.acceptedAnswer.text;
    assert.ok(antwort.length > 40, `zu dünne Antwort: ${eintrag.name}`);
    // Markup im JSON-LD zerlegt die Auszeichnung für jeden, der sie
    // zeichenweise ausliest — die sichtbare Antwort darf verlinken, diese nicht.
    assert.doesNotMatch(antwort, /[<>]/, `Markup in den strukturierten Daten: ${eintrag.name}`);
  }
});

test("Brotkrumen stehen sichtbar und in denselben Worten in den Daten", () => {
  const liste = knoten("BreadcrumbList");
  assert.equal(liste.length, 1);

  const stufen = liste[0].itemListElement.map((eintrag) => eintrag.name);
  assert.deepEqual(stufen, ["Home", "Partner", "XXL Nutrition Rabattcode"]);

  // Das erste </nav> im Dokument gehört der Kopfleiste — gesucht ist das nach
  // dem Beginn der Brotkrumen.
  const beginn = markup.indexOf('class="breadcrumb-trail"');
  const spur = markup.slice(beginn, markup.indexOf("</nav>", beginn));
  for (const stufe of stufen) {
    assert.ok(nurText(spur).includes(stufe), `Brotkrume fehlt sichtbar: ${stufe}`);
  }
  assert.match(spur, /aria-current="page"/);
});

test("die Seite benennt XXL Nutrition als Entität, nicht nur als Wort", () => {
  const marke = knoten("Organization").find((eintrag) => eintrag.name === "XXL Nutrition");
  assert.ok(marke, "XXL Nutrition fehlt als eigener Knoten");
  assert.match(marke.url, /xxlnutrition\.com/);

  const seite = knoten("WebPage")[0];
  assert.deepEqual(seite.mentions, [{ "@id": marke["@id"] }]);
});

test("passende Seiten verweisen mit sprechendem Ankertext hierher", () => {
  const quellen = [
    "/bodybuilding-wettkaempfe-2026/",
    "/partner/",
    "/shop/",
    "/bodybuilding-coaching-wettkampfvorbereitung/",
    "/werbung-partnerlinks/"
  ];

  for (const quelle of quellen) {
    const seite = pages.find((eintrag) => eintrag.route === quelle).render();
    const verweise = seite.match(/<a[^>]*href="\/xxl-nutrition-rabattcode\/"[^>]*>([\s\S]*?)<\/a>/g) || [];

    assert.ok(verweise.length > 0, `${quelle} verlinkt die Rabattcode-Seite nicht`);
    assert.ok(
      verweise.some((verweis) => /Rabattcode/i.test(nurText(verweis))),
      `${quelle}: kein sprechender Ankertext, nur ${verweise.map(nurText).join(" | ")}`
    );
  }
});

test("Stand, Jahreszahl und dateModified stammen aus derselben Zeile", () => {
  const seite = knoten("WebPage")[0];

  assert.equal(seite.dateModified, "2026-09-10");
  assert.match(markup, /<title>[^<]*Rabattcode 2026:/);
  assert.match(nurText(markup), /Stand September 2026/);

  const eintrag = pages.find((seite) => seite.route === route);
  assert.equal(eintrag.lastModified, seite.dateModified);
});
