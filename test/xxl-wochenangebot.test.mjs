import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { pages } from "../src/pages.mjs";
import { xxlWochenangebot } from "../src/xxl-wochenangebot.mjs";

const route = "/bodybuilding-wettkaempfe-2026/";
const markup = pages.find((seite) => seite.route === route).render();

test("das Werbeband steht auf der Wettkampfkalender-Seite", () => {
  assert.match(markup, /class="xxl-band"/);
  assert.match(markup, /XXL Nutrition<br><span>diese Woche\.<\/span>/);

  // Das Band gehört unter das Kopfbild, nicht ans Seitenende: Genau dort hat
  // Dominik es haben wollen, und nur dort sieht es die Mehrheit der Aufrufe.
  assert.ok(
    markup.indexOf('class="xxl-band"') < markup.indexOf('class="section bbcal-intro"'),
    "das Band muss vor dem ersten Inhaltsabschnitt stehen"
  );
});

test("jedes Angebot nennt Normalpreis, Aktionspreis und Preis mit Code", () => {
  const euro = (cent) => `${(cent / 100).toFixed(2).replace(".", ",")}&nbsp;€`;

  for (const produkt of xxlWochenangebot.produkte) {
    assert.ok(markup.includes(`<s>${euro(produkt.uvpCent)}</s>`), `${produkt.name}: Normalpreis fehlt`);
    assert.ok(markup.includes(euro(produkt.preisCent)), `${produkt.name}: Aktionspreis fehlt`);
    assert.ok(markup.includes(euro(produkt.codeCent)), `${produkt.name}: Preis mit Code fehlt`);
  }
});

test("der Preis mit Code ist der Aktionspreis abzüglich des Partner-Rabatts", () => {
  const { rabattProzent, produkte } = xxlWochenangebot;

  assert.ok(produkte.length > 0, "ohne Angebote hat das Band keinen Zweck");

  for (const produkt of produkte) {
    assert.equal(
      produkt.codeCent,
      Math.round((produkt.preisCent * (100 - rabattProzent)) / 100),
      `${produkt.name}: Preis mit Code passt nicht zu ${rabattProzent} %`
    );
    assert.ok(produkt.preisCent < produkt.uvpCent, `${produkt.name}: kein echter Nachlass`);
  }
});

test("jeder Partnerlink ist als Werbung gekennzeichnet und für Suchmaschinen entwertet", () => {
  const band = markup.slice(markup.indexOf('class="xxl-band"'), markup.indexOf('class="section bbcal-intro"'));
  const links = band.match(/<a\b[^>]*href="https:\/\/[^"]*xxlnutrition[^"]*"[^>]*>/g) || [];

  assert.ok(links.length >= xxlWochenangebot.produkte.length, "jedes Produkt braucht seinen Link");

  for (const link of links) {
    assert.match(link, /rel="sponsored noopener noreferrer"/, `unentwerteter Partnerlink: ${link}`);
    assert.match(link, /target="_blank"/, `Partnerlink ohne eigenes Fenster: ${link}`);
  }

  assert.match(band, /class="ad-note ad-note--band" href="\/werbung-partnerlinks\/">Werbung<\/a>/);
  assert.match(band, /href="\/xxl-nutrition-rabattcode\/"/);
});

test("der Code lässt sich kopieren — dieselbe Mechanik wie auf der Rabattcode-Seite", () => {
  const band = markup.slice(markup.indexOf('class="xxl-band"'), markup.indexOf('class="section bbcal-intro"'));

  // main.js sucht die Rückmeldung über .code-card; ohne diese Klasse bliebe der
  // Knopf stumm.
  assert.match(band, /class="code-card xxl-band__code"/);
  assert.match(band, new RegExp(`data-copy-code="${xxlWochenangebot.code}"`));
  assert.match(band, /data-code-value>Dominik</);
  assert.match(band, /data-copy-feedback/);
});

test("das Band nennt den Stand und schreibt keinen Preis fest", () => {
  const band = markup.slice(markup.indexOf('class="xxl-band"'), markup.indexOf('class="section bbcal-intro"'));

  assert.match(band, /ohne Gewähr/);
  assert.match(band, /Warenkorb von XXL Nutrition/);
  assert.match(band, /Nutrition Partner/);
});

test("Rabatthöhe und Code stimmen mit der Rabattcode-Seite überein", async () => {
  const quelle = await readFile(new URL("../src/pages.mjs", import.meta.url), "utf8");
  const seite = quelle.slice(quelle.indexOf("function xxlNutritionRabattcodePage()"));

  assert.match(seite, new RegExp(`const code = "${xxlWochenangebot.code}"`));
  assert.match(seite, new RegExp(`const rabatt = "${xxlWochenangebot.rabattProzent} %"`));
});
