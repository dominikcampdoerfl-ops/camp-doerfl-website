import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { pages } from "../src/pages.mjs";
import { ALLE_SPRACHEN, QUELLSPRACHE } from "../src/i18n/sprachen.mjs";

const quelltext = (datei) => readFile(new URL(`../src/${datei}`, import.meta.url), "utf8");

test("der Umschalter kennt jede Sprache aus dem Register", () => {
  const markup = pages.find((seite) => seite.route === "/shop/").render();

  for (const sprache of ALLE_SPRACHEN) {
    assert.match(
      markup,
      new RegExp(`data-language="${sprache.code}"`),
      `Sprache ${sprache.code} fehlt im Umschalter`
    );
  }

  const gefunden = [...markup.matchAll(/data-language="([a-z-]+)"/g)].map((treffer) => treffer[1]);
  assert.deepEqual(
    [...new Set(gefunden)].sort(),
    ALLE_SPRACHEN.map((sprache) => sprache.code).sort(),
    "Umschalter und Sprachregister sind auseinandergelaufen"
  );
});

test("die Umschaltung führt keine eigene Sprachliste", async () => {
  // Vorher stand in main.js `const SPRACH_PRAEFIXE = ["/en", "/zh"]`. Als
  // Türkisch dazukam, blieb die Liste stehen: Auf jeder /tr/-Seite fand die
  // Umschaltung kein Präfix, „Deutsch“ ließ einen stehen, und die übrigen
  // Flaggen bauten /en/tr/… — drei von vier Klicks endeten im Nichts.
  // Die Präfixe kommen jetzt aus den Schaltflächen, also aus dem Register.
  const js = await quelltext("main.js");

  const zuweisung = js.match(/const SPRACH_PRAEFIXE = ([\s\S]*?);\n/);
  assert.ok(zuweisung, "SPRACH_PRAEFIXE nicht gefunden");
  assert.match(
    zuweisung[1],
    /querySelectorAll\("\[data-language\]"\)/,
    "Die Präfixe werden nicht aus der Seite gelesen — eine neue Sprache bricht das Umschalten wieder"
  );

  for (const sprache of ALLE_SPRACHEN) {
    if (sprache.code === QUELLSPRACHE.code) continue;
    assert.doesNotMatch(
      zuweisung[1],
      new RegExp(`"/${sprache.code}"`),
      `Sprachkürzel ${sprache.code} steht fest im Skript statt im Register`
    );
  }
});

test("eine stillgelegte Flagge ist als solche zu erkennen", async () => {
  // Gesperrte und freie Flagge hatten dieselbe Deckkraft und beide
  // "cursor: pointer" — man tippte darauf, und nichts geschah. Der erklärende
  // title erscheint auf Touchgeräten nie, also muss man es sehen können.
  const css = await quelltext("styles.css");
  const regeln = css.slice(css.indexOf("[data-language-pending]"));

  assert.ok(css.includes("[data-language-pending]"), "kein Stil für stillgelegte Flaggen");
  assert.match(regeln, /cursor:\s*not-allowed/, "stillgelegte Flagge zeigt keinen Verboten-Zeiger");
  assert.match(regeln, /grayscale\(1\)/, "stillgelegte Flagge ist nicht entfärbt");
});

test("jede Sprachfassung verweist per hreflang auf alle fertigen Fassungen", async () => {
  // Stichprobe auf einer vollständig übersetzten Seite: Die Fassungen müssen
  // sich gegenseitig kennen, sonst wertet eine Suchmaschine sie als getrennte
  // Seiten statt als Übersetzungen. Die Angaben entstehen erst beim Bauen,
  // deshalb wird hier die gebaute Seite gelesen und nicht render().
  const markup = await readFile(new URL("../dist/shop/index.html", import.meta.url), "utf8");
  const angaben = [...markup.matchAll(/hreflang="([^"]+)"/g)].map((treffer) => treffer[1]);

  assert.ok(angaben.includes("x-default"), "x-default fehlt");
  for (const sprache of ALLE_SPRACHEN) {
    // Chinesisch steht als zh-Hans in der Adresse, nicht als zh.
    assert.ok(
      angaben.includes(sprache.htmlLang),
      `hreflang für ${sprache.code} fehlt (erwartet ${sprache.htmlLang})`
    );
  }
});
