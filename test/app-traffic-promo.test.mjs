import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const expectedPromos = {
  "/bodybuilding-wettkaempfe-2026/": "bodybuilding-kalender",
  "/boxen-wettkaempfe-2026/": "boxen-kalender",
  "/triathlon-kalender-2026/": "triathlon-kalender",
  "/laufkalender-2026/": "laufkalender",
  "/golfturniere-2026/": "golfturniere-kalender",
  "/sport-spot-finden/": "sport-spot-finder"
};

test("calendar and sport discovery pages promote the Camp Dörfl App", () => {
  for (const [route, ref] of Object.entries(expectedPromos)) {
    const page = pages.find((candidate) => candidate.route === route);
    assert.ok(page, `${route} must exist`);

    const markup = page.render();
    assert.match(markup, /class="section app-traffic-promo"/, `${route} must render the app promotion`);
    assert.match(markup, /Plane dein Training\./, `${route} must use the app planning message`);
    assert.match(markup, new RegExp(`/app/\\?ref=${ref}`), `${route} must use its own app traffic reference`);
  }
});
