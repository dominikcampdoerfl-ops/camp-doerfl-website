import assert from "node:assert/strict";
import test from "node:test";
import { pages } from "../src/pages.mjs";
import { resolveLegacyRedirect } from "../src/redirects.mjs";

const storyRoute = "/erfolge-im-team/guenter-preis/";
const storyPage = pages.find((page) => page.route === storyRoute);

test("Günter Preis has a dedicated, indexable success story", () => {
  assert.ok(storyPage, "Dedicated Günter Preis page is missing");
  const html = storyPage.render();

  assert.match(html, /Gesundheit zuerst/);
  assert.match(html, /Vizeweltmeister/);
  assert.match(html, /Langzeitblutzucker/);
  assert.match(html, /Nierenwerte/);
  assert.match(html, /kein medizinisches Versprechen/i);
  assert.match(html, /Diagnostik sowie Änderungen verschriebener Medikamente/);
  assert.match(html, /class="guenter-story-jump"/);
  assert.match(html, /id="kennenlernen"/);
  assert.match(html, /id="gesundheit"/);
  assert.match(html, /id="diabetes-in-deutschland"/);
  assert.match(html, /id="heute"/);
  assert.match(html, /id="buehne"/);
  assert.match(html, /10,2 %/);
  assert.match(html, /40<sup>%<\/sup>/);
  assert.match(html, /DiRECT/);
  assert.match(html, /Remission ist möglich – aber nicht garantiert/);
  assert.match(html, /"@type":"Article"/);
});

test("all five supplied story images are used with descriptive alternatives", () => {
  const html = storyPage.render();
  // Ohne Endung geprüft: Die Bilder liegen seit der Optimierung als WebP vor
  // (scripts/optimize-images.mjs). Entscheidend ist, dass alle fünf Motive mit
  // beschreibendem Alternativtext auf der Seite stehen.
  const images = [
    "guenter-preis-coach-stage",
    "guenter-preis-portrait-2024",
    "guenter-preis-stage-2026",
    "guenter-preis-training-front",
    "guenter-preis-training-side"
  ];

  for (const image of images) {
    assert.match(
      html,
      new RegExp(`<img[^>]+${image}\\.(?:jpe?g|png|webp)[^>]+alt="[^"]+"`),
      `Missing image or alt text: ${image}`
    );
  }
});

test("Personal Training and team success pages link to the full story", () => {
  for (const route of ["/personal-trainer-nuernberg/", "/erfolge-im-team/"]) {
    const page = pages.find((entry) => entry.route === route);
    assert.ok(page, `Missing source page: ${route}`);
    assert.match(page.render(), /href="\/erfolge-im-team\/guenter-preis\/"/);
    assert.match(page.render(), /Neue Erfolgsgeschichte/);
  }
});

test("historical Günter Preis articles redirect directly to the new story", () => {
  const historicalPaths = [
    "/athletenbereich/erfolge-im-team/guenter-preis/",
    "/fuer-athleten/erfolge-im-team/guenter-preis/",
    "/erfolge-im-camp-doerfl/lebenseinstellung-bodybuilding-mit-guenter-preis/"
  ];

  for (const path of historicalPaths) {
    assert.equal(resolveLegacyRedirect(path), storyRoute);
  }
});
