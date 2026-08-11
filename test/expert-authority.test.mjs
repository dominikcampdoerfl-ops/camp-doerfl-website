import test from "node:test";
import assert from "node:assert/strict";
import { pages } from "../src/pages.mjs";

const render = (route) => pages.find((page) => page.route === route)?.render() || "";

test("expert hub and three source-backed guides are public and internally connected", () => {
  const hub = render("/expertenwissen/");
  const guides = [
    "/personal-trainer-auswaehlen-nuernberg/",
    "/bodybuilding-wettkampfvorbereitung-dauer/",
    "/bia-inbody-koerperanalyse-vergleich/"
  ];

  for (const route of guides) {
    assert.match(hub, new RegExp(`href="${route.replaceAll("/", "\\/")}"`));
    const markup = render(route);
    assert.match(markup, /"@type":"Article"/);
    assert.match(markup, /Dominik Dörfl/);
    assert.match(markup, /Quellen/);
    assert.match(markup, /dateModified/);
    assert.match(markup, /redaktionelle-richtlinien/);
  }
});

test("the canonical person profile exposes verified external evidence", () => {
  const markup = render("/ueber-dominik/");
  assert.match(markup, /DBFV Deutsche Meisterschaft 2018/);
  assert.match(markup, /Bayerischer Landesverband/);
  assert.match(markup, /Apple Podcasts/);
  assert.match(markup, /"subjectOf"/);
  assert.match(markup, /"knowsAbout"/);
});

test("editorial policy documents authorship, sourcing, corrections and AI support", () => {
  const markup = render("/redaktionelle-richtlinien/");
  assert.match(markup, /Verantwortlicher Autor/);
  assert.match(markup, /Quellenstandard/);
  assert.match(markup, /Aktualisierung und Korrekturen/);
  assert.match(markup, /KI-Unterstützung/);
});
