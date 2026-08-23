import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

// Google schneidet den Titel bei rund 60 und die Beschreibung bei rund 160
// Zeichen ab. Was darüber steht, sieht in den Suchergebnissen abgehackt aus —
// deshalb steht die Grenze hier und fällt beim Testlauf auf, nicht erst live.
const TITEL_MAX = 60;
const BESCHREIBUNG_MAX = 160;

function kopfDaten(page) {
  const markup = page.render();

  return {
    titel: (markup.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "",
    beschreibung: (markup.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "",
  };
}

test("kein Seitentitel wird in den Suchergebnissen abgeschnitten", () => {
  for (const page of pages) {
    const { titel } = kopfDaten(page);

    assert.ok(titel.length > 0, `${page.route}: kein Titel gesetzt`);
    assert.ok(
      titel.length <= TITEL_MAX,
      `${page.route}: Titel ist ${titel.length} Zeichen lang (höchstens ${TITEL_MAX}) — "${titel}"`
    );
  }
});

test("keine Beschreibung wird in den Suchergebnissen abgeschnitten", () => {
  for (const page of pages) {
    const { beschreibung } = kopfDaten(page);

    assert.ok(beschreibung.length > 0, `${page.route}: keine Beschreibung gesetzt`);
    assert.ok(
      beschreibung.length <= BESCHREIBUNG_MAX,
      `${page.route}: Beschreibung ist ${beschreibung.length} Zeichen lang (höchstens ${BESCHREIBUNG_MAX})`
    );
  }
});

test("jeder Titel trägt eine eigene Aussage", () => {
  const gesehen = new Map();

  for (const page of pages) {
    const { titel } = kopfDaten(page);
    const vorher = gesehen.get(titel);

    assert.equal(vorher, undefined, `Titel doppelt vergeben: ${page.route} und ${vorher}`);
    gesehen.set(titel, page.route);
  }
});
