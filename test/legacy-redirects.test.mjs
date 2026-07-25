import assert from "node:assert/strict";
import test from "node:test";
import { pages } from "../src/pages.mjs";
import { resolveLegacyRedirect } from "../src/redirects.mjs";
import { legacyPaths } from "./fixtures/legacy-paths.mjs";

await import("../src/build.mjs");
const worker = (await import("../dist/server/index.js")).default;
const assetEnvironment = {
  ASSETS: {
    fetch: async () => new Response("asset", { status: 200 })
  }
};

async function fetchWorker(path, origin = "https://www.campdoerfl.de") {
  return worker.fetch(new Request(`${origin}${path}`), assetEnvironment);
}

test("the historical inventory is unique and every legacy path resolves", () => {
  assert.equal(new Set(legacyPaths).size, legacyPaths.length);

  for (const path of legacyPaths) {
    assert.ok(resolveLegacyRedirect(path), `Missing redirect rule for ${path}`);
  }
});

test("the generated production worker returns a permanent redirect for the complete matrix", async () => {
  const query = "?utm_source=legacy&utm_campaign=relaunch%202026&ref=abc%2F123";

  for (const path of legacyPaths) {
    const expectedPathname = resolveLegacyRedirect(path);
    const response = await fetchWorker(`${path}${query}`);
    const location = new URL(response.headers.get("location"));

    assert.equal(response.status, 301, `Expected HTTP 301 for ${path}`);
    assert.equal(location.origin, "https://www.campdoerfl.de", `Wrong origin for ${path}`);
    assert.equal(decodeURI(location.pathname), expectedPathname, `Wrong target for ${path}`);
    assert.equal(location.search, query, `Query string was not preserved for ${path}`);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
});

test("semantic exceptions win over their broader legacy groups", async () => {
  const expectedTargets = new Map([
    ["/fuer-unternehmen/moderator-in-nuernberg/", "/events/"],
    ["/fuer-unternehmen/speaker/konferenz/", "/events/"],
    ["/fuer-unternehmen/keynote/fuehrung/", "/events/"],
    ["/fuer-unternehmen/veranstaltungen/kongress/", "/events/"],
    ["/fuer-unternehmen/bgm/gesundheitstag/", "/firmenfitness/"],
    ["/fuer-unternehmen/gesundheitscheck/inbody/", "/firmenfitness/"],
    ["/fuer-athleten/erfolge-im-team/guenter-preis/", "/erfolge-im-team/"],
    ["/fuer-athleten/online-coaching/", "/personal-trainer-nürnberg/"],
    ["/fitness-online-coach/", "/personal-trainer-nürnberg/"],
    ["/athletenbereich/erfolge-im-team/guenter-preis/", "/erfolge-im-team/"],
    ["/athletenbereich/bodybuilding-coach/gewichtslimits/", "/personal-trainer-nürnberg/"],
    ["/athletenbereich/camp-doerfl-podcast/", "/ueber-dominik/"],
    ["/athletenbereich/supplement-empfehlung/", "/partner/"],
    ["/personal-training-in-nuernberg/xxl-nutrition/", "/partner/"],
    ["/preise-und-leistungen/", "/personal-training-kosten-nuernberg/"],
    ["/shop/fitness-ebook/", "/app/"],
    ["/cookie-einstellungen/", "/cookies/"],
    ["/agb/", "/impressum/"],
    ["/jetzt-buchen/erstgespraech/", "/kontakt/"]
  ]);

  for (const [path, expectedPathname] of expectedTargets) {
    assert.equal(resolveLegacyRedirect(path), expectedPathname, `Wrong source mapping for ${path}`);

    const response = await fetchWorker(path);
    assert.equal(response.status, 301);
    assert.equal(decodeURI(new URL(response.headers.get("location")).pathname), expectedPathname);
  }
});

test("apex/http legacy requests reach the canonical target in one hop", async () => {
  const response = await fetchWorker(
    "/personal-trainer/?utm_source=bookmark",
    "http://campdoerfl.de"
  );

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://www.campdoerfl.de/personal-trainer-n%C3%BCrnberg/?utm_source=bookmark"
  );
});

test("slash, case and old HTML variants normalize to the same destination", async () => {
  const variants = [
    "/PERSONAL-TRAINER",
    "/personal-trainer.html",
    "/personal-trainer/index.html",
    "//personal-trainer//"
  ];

  for (const variant of variants) {
    const response = await fetchWorker(variant);
    assert.equal(response.status, 301, `Expected normalized redirect for ${variant}`);
    assert.equal(
      decodeURI(new URL(response.headers.get("location")).pathname),
      "/personal-trainer-nürnberg/",
      `Wrong normalized target for ${variant}`
    );
  }
});

test("the former canonical coaching URL permanently redirects to the new SEO route", async () => {
  const response = await fetchWorker("/personal-coaching/?utm_source=existing-link");
  const location = new URL(response.headers.get("location"));

  assert.equal(response.status, 301);
  assert.equal(decodeURI(location.pathname), "/personal-trainer-nürnberg/");
  assert.equal(location.search, "?utm_source=existing-link");
});

test("current routes are never caught by a legacy rule", async () => {
  for (const page of pages) {
    assert.equal(resolveLegacyRedirect(page.route), null, `Current route was redirected: ${page.route}`);

    const response = await fetchWorker(page.route);
    assert.equal(response.status, 200, `Current route did not reach assets: ${page.route}`);
    assert.equal(response.headers.get("location"), null);
  }
});
