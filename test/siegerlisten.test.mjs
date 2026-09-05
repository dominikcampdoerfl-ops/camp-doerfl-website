import assert from "node:assert/strict";
import test from "node:test";

import {
  arnoldKlassen,
  olympiaKlassen,
  siegerReihen,
  titelRangliste
} from "../src/bodybuilding-champions.mjs";
import { pages } from "../src/pages.mjs";

const seite = (route) => pages.find((eintrag) => eintrag.route === route)?.render() || "";
const olympia = seite("/mr-olympia-sieger/");
const arnold = seite("/arnold-classic-sieger/");

test("beide Siegerlisten sind eigene Seiten", () => {
  assert.ok(olympia.length > 0, "Mr.-Olympia-Seite rendert nichts");
  assert.ok(arnold.length > 0, "Arnold-Classic-Seite rendert nichts");
});

test("die Jahresreihen sind lückenlos und ohne Dopplung", () => {
  for (const [name, klassen] of [["Olympia", olympiaKlassen], ["Arnold", arnoldKlassen]]) {
    for (const klasse of klassen) {
      const jahre = siegerReihen([klasse]).map((reihe) => reihe.jahr);
      assert.equal(new Set(jahre).size, jahre.length, `${name}/${klasse.id}: ein Jahr steht doppelt`);

      // Innerhalb einer Serie darf kein Jahr fehlen; echte Pausen sind in den
      // Daten als getrennte Einträge hinterlegt.
      for (const eintrag of klasse.sieger) {
        if (!Array.isArray(eintrag.jahr)) continue;
        const [von, bis] = eintrag.jahr;
        assert.ok(bis > von, `${name}/${klasse.id}: Serie ${von}–${bis} ist keine Serie`);
      }
    }
  }
});

test("die Königsklassen decken sich mit den bekannten Rekorden", () => {
  const olympiaOpen = titelRangliste(olympiaKlassen, "mens-open");
  assert.equal(olympiaOpen[0].titel, 8, "Der Rekord in der offenen Klasse sind acht Titel");
  assert.deepEqual(
    olympiaOpen.filter((eintrag) => eintrag.titel === 8).map((eintrag) => eintrag.name).sort(),
    ["Lee Haney", "Ronnie Coleman"]
  );
  assert.equal(olympiaOpen.find((eintrag) => eintrag.name === "Arnold Schwarzenegger").titel, 7);

  const arnoldOpen = titelRangliste(arnoldKlassen, "mens-open");
  assert.equal(arnoldOpen[0].name, "Dexter Jackson");
  assert.equal(arnoldOpen[0].titel, 5);

  // Iris Kyle ist die erfolgreichste Athletin des Sports.
  const olympiaGesamt = titelRangliste(olympiaKlassen);
  assert.equal(olympiaGesamt.find((eintrag) => eintrag.name === "Iris Kyle").titel, 10);
});

test("die Eckpunkte der Geschichte stehen richtig in den Daten", () => {
  const reihen = siegerReihen(olympiaKlassen);
  const treffer = (jahr, klasseId) => reihen.find((r) => r.jahr === jahr && r.klasseId === klasseId)?.name;

  assert.equal(treffer(1965, "mens-open"), "Larry Scott");
  assert.equal(treffer(1980, "mens-open"), "Arnold Schwarzenegger");
  assert.equal(treffer(2008, "mens-open"), "Dexter Jackson");
  assert.equal(treffer(2025, "mens-open"), "Derek Lunsford");
  assert.equal(treffer(2024, "mens-open"), "Samson Dauda");

  // Die Ms. Olympia pausierte zwischen 2015 und 2019.
  for (const jahr of [2015, 2016, 2017, 2018, 2019]) {
    assert.equal(treffer(jahr, "ms-olympia"), undefined, `Ms. Olympia ${jahr} wurde nicht ausgetragen`);
  }

  const arnoldReihen = siegerReihen(arnoldKlassen);
  assert.equal(arnoldReihen.find((r) => r.jahr === 1989 && r.klasseId === "mens-open")?.name, "Rich Gaspari");
  assert.equal(arnoldReihen.find((r) => r.jahr === 2026 && r.klasseId === "mens-open")?.name, "Andrew Jacked");

  // Classic Physique am Arnold ist bis in die laufende Saison gepflegt.
  assert.equal(arnoldReihen.find((r) => r.jahr === 2025 && r.klasseId === "classic-physique")?.name, "Mike Sommerfeld");
  assert.equal(arnoldReihen.find((r) => r.jahr === 2026 && r.klasseId === "classic-physique")?.name, "Wesley Vissers");
});

test("die Tabelle steht vollständig im HTML, auch ohne JavaScript", () => {
  const zeilen = (markup) => (markup.match(/data-suche="/g) || []).length;
  assert.equal(zeilen(olympia), siegerReihen(olympiaKlassen).length);
  assert.equal(zeilen(arnold), siegerReihen(arnoldKlassen).length);

  // Filter sind eine Abkürzung, keine Voraussetzung.
  for (const markup of [olympia, arnold]) {
    assert.ok(markup.includes("data-champs-search"), "Suchfeld fehlt");
    assert.ok(markup.includes("data-champs-division"), "Klassenfilter fehlt");
    assert.ok(markup.includes("data-champs-year"), "Jahresfilter fehlt");
  }

  // Je Klasse ein Block, damit die Liste überschaubar bleibt. <details> hält
  // den Inhalt auch zugeklappt im HTML — sonst sähe ein Crawler nur die erste
  // Klasse.
  assert.equal((olympia.match(/data-champs-group/g) || []).length, olympiaKlassen.length);
  assert.equal((arnold.match(/data-champs-group/g) || []).length, arnoldKlassen.length);
  for (const markup of [olympia, arnold]) {
    assert.match(markup, /<details class="champs-group"/);
    // Nur der erste Block steht offen, der Rest ist zugeklappt.
    assert.equal((markup.match(/data-champs-group[^>]*\sopen/g) || []).length, 1);
  }
});

test("beide Seiten erklären den Wettbewerb und verlinken einander", () => {
  assert.match(olympia, /href="\/arnold-classic-sieger\/"/);
  assert.match(arnold, /href="\/mr-olympia-sieger\/"/);

  for (const markup of [olympia, arnold]) {
    assert.ok(markup.includes('"@type":"FAQPage"'), "FAQ-Auszeichnung fehlt");
    assert.match(markup, /href="\/bodybuilding-coaching-wettkampfvorbereitung\/"/);
  }
});
