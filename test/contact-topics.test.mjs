import assert from "node:assert/strict";
import test from "node:test";

import { contactForm, contactHref } from "../src/components.mjs";
import {
  contactTopics,
  normalizeContactTopicKey,
  resolveContactTopicKey,
  resolveContactTopicValue
} from "../src/contact-topics.js";
import { pages } from "../src/pages.mjs";

const expectedTopics = {
  app: "Camp Dörfl App",
  "premium-training": "Premium Personal Training",
  firmenfitness: "Firmenfitness",
  events: "Events und Moderation",
  "executive-performance": "Executive Performance"
};

test("canonical CTA topics resolve to their exact form values", () => {
  for (const [key, value] of Object.entries(expectedTopics)) {
    assert.equal(resolveContactTopicKey(key), key);
    assert.equal(resolveContactTopicValue(key), value);
    assert.equal(contactHref(key), `/kontakt/?topic=${key}#kontaktformular`);
  }
});

test("human labels and supported legacy aliases resolve reliably", () => {
  assert.equal(resolveContactTopicValue("Premium Personal Training"), "Premium Personal Training");
  assert.equal(resolveContactTopicValue("premium-personal-training"), "Premium Personal Training");
  assert.equal(resolveContactTopicValue("Gesundheitstag"), "Firmenfitness");
  assert.equal(resolveContactTopicValue("events-und-moderation"), "Events und Moderation");
  assert.equal(resolveContactTopicValue("Camp Dörfl App"), "Camp Dörfl App");
  assert.equal(resolveContactTopicValue("executive-coaching"), "Executive Performance");
  assert.equal(normalizeContactTopicKey("Camp Dörfl App"), "camp-dorfl-app");
});

test("invalid or empty topics fall back to an unselected general contact form", () => {
  assert.equal(resolveContactTopicValue("unbekannter-bereich"), "");
  assert.equal(resolveContactTopicValue(""), "");
  assert.equal(contactHref("unbekannter-bereich"), "/kontakt/#kontaktformular");
  assert.equal(contactHref(), "/kontakt/#kontaktformular");
});

test("the contact form renders every configured topic exactly once", () => {
  const markup = contactForm();

  for (const topic of contactTopics) {
    const option = `<option value="${topic.label}">${topic.label}</option>`;
    assert.equal(markup.split(option).length - 1, 1, `${topic.label} must occur once as an option`);
  }
});

test("all five service pages emit their canonical preselection URL", () => {
  const pageTopics = {
    "/app/": "app",
    "/personal-coaching/": "premium-training",
    "/firmenfitness/": "firmenfitness",
    "/events/": "events",
    "/executive-performance/": "executive-performance"
  };

  for (const [route, topic] of Object.entries(pageTopics)) {
    const page = pages.find((candidate) => candidate.route === route);
    assert.ok(page, `${route} must exist`);
    assert.match(page.render(), new RegExp(`/kontakt/\\?topic=${topic}#kontaktformular`));
  }
});
