import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pages } from "../src/pages.mjs";
import { resolveCanonicalRedirect, resolveLegacyRedirect } from "../src/redirects.mjs";
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
  const currentRoutes = new Set(pages.map((page) => page.route));

  for (const path of legacyPaths) {
    const target = resolveLegacyRedirect(path);
    assert.ok(target, `Missing redirect rule for ${path}`);
    assert.ok(currentRoutes.has(target), `Legacy URL does not land on a current page: ${path} → ${target}`);
    assert.equal(resolveLegacyRedirect(target), null, `Redirect chain detected: ${path} → ${target}`);
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
    ["/fuer-athleten/erfolge-im-team/guenter-preis/", "/erfolge-im-team/guenter-preis/"],
    ["/fuer-athleten/online-coaching/", "/personal-trainer-nürnberg/"],
    ["/fitness-online-coach/", "/personal-trainer-nürnberg/"],
    ["/athletenbereich/erfolge-im-team/guenter-preis/", "/erfolge-im-team/guenter-preis/"],
    ["/erfolge-im-camp-doerfl/lebenseinstellung-bodybuilding-mit-guenter-preis/", "/erfolge-im-team/guenter-preis/"],
    ["/athletenbereich/bodybuilding-coach/gewichtslimits/", "/personal-trainer-nürnberg/"],
    ["/athletenbereich/camp-doerfl-podcast/", "/ueber-dominik/"],
    ["/athletenbereich/supplement-empfehlung/", "/partner/"],
    ["/athletenbereich/archiv/halbmarathon-termine-2024/", "/laufkalender-2026/"],
    ["/athletenbereich/triathlon-termine-2024/", "/triathlon-kalender-2026/"],
    ["/athletenbereich/bodybuilding-wettkaempfe-2023/", "/bodybuilding-wettkaempfe-2026/"],
    ["/personal-training-in-nuernberg/xxl-nutrition/", "/partner/"],
    ["/personal-trainer-nuernberg/", "/personal-trainer-nürnberg/"],
    ["/personal-trainer-nuernberg/dein-gym-in-nuernberg/", "/personal-trainer-nürnberg/"],
    ["/firmenfitness-aus-nuernberg/gesundheitstag/", "/gesundheitstag-nuernberg/"],
    ["/fuer-unternehmen/gesundheitstag/", "/gesundheitstag-nuernberg/"],
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
  const canonicalRoutes = pages.map((page) => page.route);

  for (const page of pages) {
    assert.equal(resolveLegacyRedirect(page.route), null, `Current route was redirected: ${page.route}`);
    assert.equal(resolveCanonicalRedirect(page.route, canonicalRoutes), null, `Canonical route was normalized again: ${page.route}`);

    const response = await fetchWorker(page.route);
    assert.equal(response.status, 200, `Current route did not reach assets: ${page.route}`);
    assert.equal(response.headers.get("location"), null);
  }
});

test("current URL variants redirect to one clean canonical structure", async () => {
  const variants = new Map([
    ["/EVENTS", "/events/"],
    ["/events.html", "/events/"],
    ["/events/index.html", "/events/"],
    ["//events//", "/events/"],
    ["/PERSONAL-TRAINER-N%C3%9CRNBERG", "/personal-trainer-nürnberg/"]
  ]);
  const canonicalRoutes = pages.map((page) => page.route);

  for (const [variant, expectedPathname] of variants) {
    assert.equal(resolveCanonicalRedirect(variant, canonicalRoutes), expectedPathname);

    const response = await fetchWorker(`${variant}?utm_source=variant`);
    const location = new URL(response.headers.get("location"));

    assert.equal(response.status, 301);
    assert.equal(location.origin, "https://www.campdoerfl.de");
    assert.equal(decodeURI(location.pathname), expectedPathname);
    assert.equal(location.search, "?utm_source=variant");
  }
});

test("the sitemap contains canonical pages only", async () => {
  const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");

  for (const page of pages.filter((page) => page.includeInSitemap !== false)) {
    assert.ok(
      sitemap.includes(`<loc>https://www.campdoerfl.de${page.route}</loc>`),
      `Canonical page missing from sitemap: ${page.route}`
    );
  }

  for (const legacyPath of legacyPaths) {
    assert.ok(
      !sitemap.includes(`<loc>https://www.campdoerfl.de${legacyPath}</loc>`),
      `Legacy URL leaked into sitemap: ${legacyPath}`
    );
  }
});
