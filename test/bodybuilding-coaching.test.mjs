import assert from "node:assert/strict";
import test from "node:test";
import { pages } from "../src/pages.mjs";

const route = "/bodybuilding-coaching-wettkampfvorbereitung/";
const page = pages.find((candidate) => candidate.route === route);

test("bodybuilding coaching page converts new and switching athletes", () => {
  assert.ok(page, "bodybuilding coaching route must exist");
  const markup = page.render();

  assert.match(markup, /Bodybuilding Coach Nürnberg & Online/);
  assert.match(markup, /Erster Wettkampf/);
  assert.match(markup, /Coach-Wechsel/);
  assert.match(markup, /IFBB Pro Bodybuilding/);
  assert.match(markup, /Olympia-Athleten/);
  assert.match(markup, /href="\/bodybuilding-wettkaempfe-2026\/"/);
  assert.match(markup, /href="\/bodybuilding-klassen-gewichtslimits\/"/);
  assert.match(markup, /data-contact-simple-form/);
  assert.match(markup, /Bodybuilding Coaching & Wettkampfvorbereitung/);
});

test("bodybuilding coaching page emits indexable service and FAQ data", () => {
  const markup = page.render();

  assert.match(markup, /<link rel="canonical" href="https:\/\/www\.campdoerfl\.de\/bodybuilding-coaching-wettkampfvorbereitung\/">/);
  assert.match(markup, /Bodybuilding Coaching, Contest Prep und Wettkampfvorbereitung/);
  assert.match(markup, /FAQPage/);
  assert.match(markup, /ServicePage/);
  assert.match(markup, /dateModified/);
});
