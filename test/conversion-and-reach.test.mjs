import test from "node:test";
import assert from "node:assert/strict";

import { pages } from "../src/pages.mjs";

const pageMarkup = (route) => {
  const page = pages.find((candidate) => candidate.route === route);
  assert.ok(page, `Missing page: ${route}`);
  return page.render();
};

test("core service pages expose a contextual mobile inquiry path", () => {
  const cases = [
    ["/personal-trainer-nürnberg/", "Training anfragen", "premium-training"],
    ["/koerperanalyse-nuernberg/", "Analyse anfragen", "koerperanalyse"],
    ["/firmenfitness/", "Firmenfitness anfragen", "firmenfitness"],
    ["/gesundheitstag-nuernberg/", "Gesundheitstag anfragen", "firmenfitness"]
  ];

  for (const [route, label, topic] of cases) {
    const markup = pageMarkup(route);
    assert.match(markup, /class="mobile-inquiry-bar"/);
    assert.match(markup, new RegExp(label));
    assert.match(markup, new RegExp(`topic=${topic}`));
  }
});

test("informational calendar pages are not covered by a fixed inquiry bar", () => {
  assert.doesNotMatch(pageMarkup("/triathlon-kalender-2026/"), /class="mobile-inquiry-bar"/);
});

test("homepage links visibly to the primary local search intents", () => {
  const markup = pageMarkup("/");
  assert.match(markup, /Was suchst du in Nürnberg\?/);
  assert.match(markup, /href="\/personal-trainer-nürnberg\/"/);
  assert.match(markup, /href="\/koerperanalyse-nuernberg\/"/);
  assert.match(markup, /href="\/gesundheitstag-nuernberg\/"/);
  assert.match(markup, /href="\/personal-training-kosten-nuernberg\/"/);
  assert.match(markup, />Moderator Nürnberg</);
  assert.match(markup, /href="\/events\/"/);
});

test("service pages declare their real geographic coverage", () => {
  const personalTraining = pageMarkup("/personal-trainer-nürnberg/");
  const corporateFitness = pageMarkup("/firmenfitness/");

  assert.match(personalTraining, /Personal Training für Nürnberg, Fürth und Erlangen/);
  assert.match(corporateFitness, /Firmenfitness\. <br><span>Deutschlandweit/);
  assert.match(corporateFitness, /"@type":"Country","name":"Deutschland"/);
  assert.match(personalTraining, /"dateModified":"2026-08-11"/);
  assert.match(corporateFitness, /"dateModified":"2026-08-11"/);
});

test("corporate fitness presents three concrete offers and verifiable experience", () => {
  const markup = pageMarkup("/firmenfitness/");

  assert.match(markup, /Gesundheitstag mit InBody und Beratung/);
  assert.match(markup, /Warum Dranbleiben für unsere Gesundheit kein Nice-to-have ist/);
  assert.match(markup, /Bewegungsimpuls und Team-Aktivierung/);
  assert.match(markup, /Stadt Nürnberg/);
  assert.match(markup, /Neunkirchener Achsenfabrik/);
  assert.match(markup, /Caverion GmbH/);
  assert.match(markup, /Bis 25/);
  assert.match(markup, /100\+/);
  assert.match(markup, /Mehrere Standorte/);
  assert.match(markup, /Was HR und Geschäftsführung vorab wissen müssen/);
});

test("Personal Trainer Nürnberg is the single authoritative service destination", () => {
  const training = pageMarkup("/personal-trainer-nürnberg/");
  const home = pageMarkup("/");
  const contact = pageMarkup("/kontakt/");

  assert.match(training, /<title>Personal Trainer Nürnberg \| Dominik Dörfl – echte Erfolge<\/title>/);
  assert.match(training, /<link rel="canonical" href="https:\/\/www\.campdoerfl\.de\/personal-trainer-nürnberg\/">/);
  assert.match(training, /Warum Dominik Dörfl als Personal Trainer in Nürnberg/);
  assert.match(training, /13<\/dt><dd>Deutsche Meistertitel im betreuten Team/);
  assert.match(training, /126<\/dt><dd>dokumentierte Wettkampfplatzierungen/);
  assert.match(training, /"jobTitle":"Personal Trainer in Nürnberg"/);
  assert.match(training, /"dateModified":"2026-08-11"/);
  assert.match(home, /<title>Camp Dörfl \| Performance System Nürnberg<\/title>/);
  assert.match(contact, /Personal Trainer Nürnberg: Leistungen und Erfolge ansehen/);
});

test("bodybuilding calendar covers high-impression search questions", () => {
  const markup = pageMarkup("/bodybuilding-wettkaempfe-2026/");

  assert.match(markup, /Bodybuilding Wettkämpfe 2026: IFBB Pro, NPC &amp; Termine/);
  assert.match(markup, /Welche Frauenklassen gibt es bei Bodybuilding-Wettkämpfen/);
  assert.match(markup, /Bodybuilding-Weltmeisterschaft 2026 in Riga/);
  assert.match(markup, /Frauenklassen, Natural Bodybuilding und Verbände im Überblick/);
});

test("bodybuilding calendar separates all requested international systems", () => {
  const markup = pageMarkup("/bodybuilding-wettkaempfe-2026/");

  assert.match(markup, /IFBB Professional League/);
  assert.match(markup, /NPC Worldwide/);
  assert.match(markup, /IFBB International/);
  assert.match(markup, /Olympia 2026/);
  assert.match(markup, /European Pro Qualifier/);
  assert.match(markup, /IFBB World Men’s & Women’s Championships/);
  assert.match(markup, /https:\/\/www\.ifbbpro\.com\/schedule\//);
  assert.match(markup, /https:\/\/www\.ifbbpro\.com\/npc-worldwide\/schedule\//);
  assert.match(markup, /https:\/\/ifbb\.com\/wp-content\/uploads\/2026\/05\/calendar-2026-1\.pdf/);
  assert.match(markup, /bbcal-source-group--international/);
  assert.match(markup, /bbcal-federation--international/);
  assert.match(markup, /bbcal-more-events/);
  assert.match(markup, /Weitere 14 öffnen/);
});

test("boxing calendar includes IBF and BDB as professional organisations", () => {
  const markup = pageMarkup("/boxen-wettkaempfe-2026/");

  assert.match(markup, /International Boxing Federation/);
  assert.match(markup, /Regie Suganob vs\. Sivenathi Nontshinga/);
  assert.match(markup, /https:\/\/www\.ibf-usba-boxing\.com\/schedule\//);
  assert.match(markup, /Bund Deutscher Berufsboxer/);
  assert.match(markup, /https:\/\/www\.bund-deutscher-berufsboxer\.de\/termine\//);
  assert.match(markup, /Noch kein offizieller 2026-Termin veröffentlicht/);
  assert.match(markup, /Was ist der Unterschied zwischen IBF und BDB/);
});

test("contact form communicates a low-friction personal response", () => {
  const markup = pageMarkup("/kontakt/");
  assert.match(markup, /Unverbindlich anfragen/);
  assert.match(markup, /ohne Callcenter und ohne Umwege/);
});
