import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const renderPage = (route) => {
  const page = pages.find((candidate) => candidate.route === route);
  assert.ok(page, `${route} must exist`);
  return page.render();
};

test("the pricing page lists every current Personal Training price", () => {
  const markup = renderPage("/personal-training-kosten-nuernberg/");

  assert.match(markup, /Einzelsession/);
  assert.match(markup, /120 € \/ 150 €/);
  assert.match(markup, /inkl\. 2D-Körperanalyse/);
  assert.match(markup, /5er-Karte/);
  assert.match(markup, /500 €/);
  assert.match(markup, /10er-Karte/);
  assert.match(markup, /800 €/);
  assert.match(markup, /Premium Begleitung/);
  assert.match(markup, /ab 200 €/);
  assert.match(markup, /monatlich/);
});

test("pricing is linked from Personal Training Nürnberg and every footer", () => {
  const pricingHref = 'href="/personal-training-kosten-nuernberg/"';
  const trainingMarkup = renderPage("/personal-trainer-nürnberg/");
  const homeMarkup = renderPage("/");

  assert.ok(trainingMarkup.split(pricingHref).length >= 3, "training page must include its contextual link and footer link");
  assert.match(trainingMarkup, /Preise für Personal Training ansehen/);
  assert.match(homeMarkup, /Personal Training Kosten/);
  assert.match(homeMarkup, new RegExp(pricingHref));
});
