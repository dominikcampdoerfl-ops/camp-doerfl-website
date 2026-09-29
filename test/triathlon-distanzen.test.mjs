import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";
import { dtuTriathlonEvents2026 } from "../src/triathlon-events-2026.mjs";
import { internationalTriathlonEvents2026 } from "../src/sports-calendar-data.mjs";

const route = "/triathlon-distanzen/";
const markup = pages.find((seite) => seite.route === route).render();
const nurText = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const strukturierteDaten = JSON.parse(
  markup.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
);
const knoten = (typ) => strukturierteDaten["@graph"].filter((eintrag) => eintrag["@type"] === typ);

// Die Strecken sind genormt. Steht hier eine falsche Zahl, ist die ganze Seite
// wertlos — deshalb stehen sie im Test noch einmal, unabhängig vom Quelltext.
const genormt = [
  ["Super-Sprint", "0,4 km", "10 km", "2,5 km", "12,9 km"],
  ["Sprintdistanz", "0,75 km", "20 km", "5 km", "25,75 km"],
  ["Olympische Distanz", "1,5 km", "40 km", "10 km", "51,5 km"],
  ["Mitteldistanz", "1,9 km", "90 km", "21,1 km", "113 km"],
  ["Langdistanz", "3,8 km", "180 km", "42,195 km", "226 km"]
];

test("jede Distanz steht mit ihren genormten Strecken in der Tabelle", () => {
  const text = nurText(markup);

  for (const [name, schwimmen, rad, laufen, gesamt] of genormt) {
    assert.ok(text.includes(name), `Distanz fehlt: ${name}`);
    for (const strecke of [schwimmen, rad, laufen, gesamt]) {
      assert.ok(text.includes(strecke), `${name}: Strecke ${strecke} steht nicht auf der Seite`);
    }
  }
});

test("die Kurzantwort beantwortet die Frage der Überschrift sofort", () => {
  const h1 = nurText(markup.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
  assert.equal(h1, "Welche Triathlon-Distanzen gibt es?");
  assert.equal((markup.match(/<h1\b/g) || []).length, 1);

  const box = markup.slice(markup.indexOf('class="answer-box"'), markup.indexOf("</section>", markup.indexOf('class="answer-box"')));
  const text = nurText(box);
  assert.match(text, /Fünf Distanzen/);
  // Alle fünf Distanzen mit Zahlen, bevor irgendein Fließtext beginnt.
  for (const [, schwimmen] of genormt) {
    const zahl = schwimmen.replace(" km", "");
    assert.ok(text.includes(zahl), `Kurzantwort nennt ${zahl} nicht`);
  }
});

test("die genannten Rennen stammen aus dem echten Kalender", () => {
  // Die Startorte werden im Kalender nachgeschlagen. Steht hier ein Rennen,
  // das es dort nicht gibt, behauptet die Seite einen Termin.
  const alle = [...dtuTriathlonEvents2026, ...internationalTriathlonEvents2026];
  // Nur der Startort-Block: Ohne obere Grenze liefe der Ausschnitt bis zum
  // Quellenverzeichnis weiter und prüfte dessen Links mit.
  const beginn = markup.indexOf('class="tri-startorte"');
  const liste = markup.slice(beginn, markup.indexOf("<h2", beginn));
  const eintraege = [...liste.matchAll(/<a href="(https:\/\/[^"]+)"[^>]*>([^<]+)<\/a>/g)];

  assert.ok(eintraege.length >= 15, `zu wenige Rennen gelistet: ${eintraege.length}`);

  for (const [, url, name] of eintraege) {
    const treffer = alle.find((event) => event.name === name);
    assert.ok(treffer, `Rennen steht nicht im Kalender: ${name}`);
    assert.equal(treffer.url, url, `${name}: verweist nicht auf die Quelle des Veranstalters`);
  }
});

test("Autor, Datum und Quellen sind ausgezeichnet", () => {
  const artikel = strukturierteDaten["@graph"].find(
    (eintrag) => typeof eintrag["@id"] === "string" && eintrag["@id"].endsWith("#article")
  );
  assert.ok(artikel, "Article-Knoten fehlt");
  assert.equal(artikel.headline, "Welche Triathlon-Distanzen gibt es?");
  assert.equal(artikel.author["@id"], "https://www.campdoerfl.de/#person");
  assert.match(artikel.datePublished, /^\d{4}-\d{2}-\d{2}$/);

  // Die Quellen sind der Grund, warum die Seite belastbar ist.
  const quellen = markup.slice(markup.indexOf('class="source-panel"'));
  for (const pflicht of ["triathlon.org", "triathlondeutschland.de", "ironman.com"]) {
    assert.ok(quellen.includes(pflicht), `Originalquelle fehlt: ${pflicht}`);
  }
});

test("die FAQ trifft die Fragen, mit denen gesucht wird", () => {
  const faqSeite = knoten("FAQPage");
  assert.equal(faqSeite.length, 1);

  const fragen = faqSeite[0].mainEntity.map((eintrag) => eintrag.name);
  for (const erwartet of [
    "Welche Triathlon-Distanzen gibt es?",
    "Wie lang ist die olympische Distanz beim Triathlon?",
    "Wie lang ist ein Ironman?",
    "Was ist der Unterschied zwischen Mitteldistanz und Ironman 70.3?",
    "Mit welcher Distanz sollte ich als Anfänger starten?"
  ]) {
    assert.ok(fragen.includes(erwartet), `Frage fehlt: ${erwartet}`);
  }

  for (const eintrag of faqSeite[0].mainEntity) {
    assert.doesNotMatch(eintrag.acceptedAnswer.text, /[<>]/, `Markup im JSON-LD: ${eintrag.name}`);
  }
});

test("die Seite hängt im Triathlon-Cluster und nicht allein", () => {
  const liste = knoten("BreadcrumbList")[0];
  assert.deepEqual(
    liste.itemListElement.map((eintrag) => eintrag.name),
    ["Home", "Triathlon Kalender 2026", "Triathlon Distanzen"]
  );

  for (const quelle of ["/triathlon-kalender-2026/", "/laufkalender-2026/", "/expertenwissen/"]) {
    const seite = pages.find((eintrag) => eintrag.route === quelle).render();
    const haupt = seite.slice(seite.indexOf('<main id="main">'), seite.indexOf("</main>"));
    assert.match(haupt, /href="\/triathlon-distanzen\/"/, `${quelle} verlinkt die Distanzseite nicht`);
  }
});
