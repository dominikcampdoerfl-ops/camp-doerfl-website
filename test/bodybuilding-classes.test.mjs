import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const renderClassesPage = () => {
  const page = pages.find(({ route }) => route === "/bodybuilding-klassen-gewichtslimits/");
  assert.ok(page, "bodybuilding classes page must be registered");
  return page.render();
};

test("bodybuilding class guide compares the three requested rule systems", () => {
  const markup = renderClassesPage();

  assert.match(markup, /DBFV e\.V\./);
  assert.match(markup, /NAC Germany/);
  assert.match(markup, /NPC Worldwide/);
  assert.match(markup, /data-class-calculator/);
  assert.match(markup, /Classic Physique: alle Größenlimits/);
  assert.match(markup, /Bikini \/ Bikini Shape/);
  assert.match(markup, /Men’s Physique/);
});

test("bodybuilding class guide links only to official federation rules", () => {
  const markup = renderClassesPage();

  assert.match(markup, /https:\/\/www\.dbfv\.de\/wettkampfregeln\//);
  assert.match(markup, /https:\/\/www\.nac-germany\.de\/klassen-regeln\.html/);
  assert.match(markup, /https:\/\/www\.ifbbpro\.com\/npc-worldwide\/rules\//);
  assert.match(markup, /"@type":"FAQPage"/);
});
