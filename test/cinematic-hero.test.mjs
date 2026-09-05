import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const render = (route) => pages.find((page) => page.route === route)?.render() || "";

const home = render("/");

test("die Startseite trägt den Cinematic Hero", () => {
  assert.match(home, /<section class="cine" data-cine>/);
  assert.match(home, /<div class="cine__stage" data-cine-stage>/);
  assert.match(home, /<div class="cine__veil" data-cine-veil aria-hidden="true"><\/div>/);
});

test("der Prototyp hat genau zwei Szenen — running vor strength", () => {
  const szenen = [...home.matchAll(/data-cine-scene="([a-z]+)"/g)].map((treffer) => treffer[1]);

  assert.deepEqual(szenen, ["running", "strength"]);
});

test("die Szenen zeigen auf die beiden Masterbilder", () => {
  assert.match(home, /src="\/assets\/images\/cinematic-hero\/source\/01-running\.jpg"/);
  assert.match(home, /src="\/assets\/images\/cinematic-hero\/source\/02-strength\.jpg"/);

  // Genau zwei Bilder im Hero, keine weiteren Szenen.
  const heroBilder = [...home.matchAll(/\/assets\/images\/cinematic-hero\/[A-Za-z0-9._/-]+/g)];
  assert.equal(heroBilder.length, 2);
});

// Szene 01 ist das erste sichtbare Bild. Wird sie lazy geladen, wandert der
// LCP nach hinten und der Auftakt bleibt beim ersten Aufruf schwarz.
test("Szene 01 wird früh geladen, Szene 02 erst bei Bedarf", () => {
  const running = home.match(/<img[^>]*01-running\.jpg[^>]*>/)?.[0] || "";
  const strength = home.match(/<img[^>]*02-strength\.jpg[^>]*>/)?.[0] || "";

  assert.match(running, /loading="eager"/);
  assert.match(running, /fetchpriority="high"/);
  assert.match(running, /decoding="async"/);

  assert.match(strength, /loading="lazy"/);
  assert.match(strength, /decoding="async"/);
  assert.doesNotMatch(strength, /fetchpriority/);
});

// Ohne width und height kennt der Browser das Seitenverhältnis erst, wenn das
// Bild da ist — und das Layout springt.
test("beide Szenenbilder tragen ihre echten Maße", () => {
  const bilder = [...home.matchAll(/<img[^>]*cinematic-hero[^>]*>/g)].map((treffer) => treffer[0]);

  assert.equal(bilder.length, 2);
  for (const bild of bilder) {
    assert.match(bild, /width="1536"/);
    assert.match(bild, /height="864"/);
  }
});

test("beide Szenenbilder haben einen aussagekräftigen Alt-Text", () => {
  const bilder = [...home.matchAll(/<img[^>]*cinematic-hero[^>]*>/g)].map((treffer) => treffer[0]);

  for (const bild of bilder) {
    const alt = bild.match(/alt="([^"]*)"/)?.[1] || "";
    assert.ok(alt.length > 10, `Alt-Text zu kurz: "${alt}"`);
    assert.match(alt, /Dominik Dörfl/);
  }
});

// Der alte Hero bringt eine eigene Parallax-Schleife und !important-Regeln mit.
// Bleibt er stehen, laufen beide Systeme auf derselben Fläche gegeneinander.
test("der alte Hero ist von der Startseite verschwunden", () => {
  assert.doesNotMatch(home, /hero-szene/);
  assert.doesNotMatch(home, /data-hero-szene/);
  assert.doesNotMatch(home, /ff-hero/);
});

test("die Startseite lädt GSAP, ScrollTrigger und hero-cinema.js in dieser Reihenfolge", () => {
  const gsapPos = home.indexOf("vendor/gsap/gsap.min.js");
  const scrollTriggerPos = home.indexOf("vendor/gsap/ScrollTrigger.min.js");
  const heroPos = home.indexOf("hero-cinema.js");
  const mainPos = home.indexOf("/main.js");

  assert.ok(gsapPos > -1, "gsap.min.js fehlt");
  assert.ok(scrollTriggerPos > -1, "ScrollTrigger.min.js fehlt");
  assert.ok(heroPos > -1, "hero-cinema.js fehlt");
  assert.ok(mainPos > -1, "main.js fehlt");

  assert.ok(gsapPos < scrollTriggerPos, "ScrollTrigger muss nach GSAP kommen");
  assert.ok(scrollTriggerPos < heroPos, "hero-cinema.js muss nach ScrollTrigger kommen");
  assert.ok(heroPos < mainPos, "main.js muss zuletzt kommen");
});

test("hero-cinema.js wird als defer-Script eingebunden", () => {
  assert.match(home, /<script defer src="\/assets\/__ASSET_VERSION__\/hero-cinema\.js"><\/script>/);
});

test("keine andere Route lädt den Hero oder GSAP", () => {
  const andere = pages.filter((page) => page.route !== "/");

  assert.ok(andere.length > 30, "Es sollten deutlich mehr Routen als die Startseite existieren");

  for (const page of andere) {
    const markup = page.render();

    assert.doesNotMatch(markup, /hero-cinema\.js/, `${page.route} lädt hero-cinema.js`);
    assert.doesNotMatch(markup, /vendor\/gsap/, `${page.route} lädt GSAP`);
    assert.doesNotMatch(markup, /data-cine/, `${page.route} enthält den Cinematic Hero`);
  }
});

// Die Sektionen hinter dem Hero sind unverändert geblieben — der Prototyp
// tauscht nur den Auftakt aus, nicht die Startseite.
test("der Seiteninhalt hinter dem Hero bleibt bestehen", () => {
  assert.match(home, /id="einstiege"/);
  assert.match(home, /ed-proof/);
  assert.match(home, /ed-google-reviews/);
  assert.match(home, /home-search-paths/);

  // Der Hero steht vor allem anderen.
  assert.ok(home.indexOf('data-cine>') < home.indexOf('id="einstiege"'));
});

test("im Hero steht kein Text — er wirkt allein über das Bild", () => {
  const hero = home.match(/<section class="cine" data-cine>[\s\S]*?<\/section>/)?.[0] || "";

  assert.ok(hero.length > 0, "Hero-Abschnitt nicht gefunden");
  assert.doesNotMatch(hero, /<h1|<h2|<p>|<button|<a /);

  // Übrig bleiben darf nur Markup, kein sichtbarer Fließtext.
  const sichtbar = hero.replace(/<[^>]*>/g, "").trim();
  assert.equal(sichtbar, "");
});
