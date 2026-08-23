import assert from "node:assert/strict";
import test from "node:test";
import { pages } from "../src/pages.mjs";
import { securityHeaders } from "../src/security.mjs";
import { ensureBuiltSite } from "./helpers/built-site.mjs";
import {
  MEMBER_API_ORIGIN,
  MEMBER_BASE_PATH,
  isMemberAreaPath,
  memberAssetCandidates,
  memberCacheControl,
  memberSecurityHeaders
} from "../src/member-area.mjs";

await ensureBuiltSite();
const worker = (await import("../dist/server/index.js")).default;

// Nachbau der Cloudflare-Asset-Bindung: kennt genau die Dateien, die der
// Web-Export der App erzeugt (Seite je Route, gehashte Bundles) — und ahmt das
// Verhalten von Cloudflare nach: HTML wird unter der sauberen Adresse
// ausgeliefert, ein direkter Aufruf der .html-Datei endet in einer
// 307-Weiterleitung dorthin.
function assetEnvironmentFor(existingFiles) {
  const available = new Set(existingFiles);

  const cleanUrlFor = (filePath) =>
    filePath.endsWith("/index.html")
      ? filePath.slice(0, -"index.html".length)
      : filePath.replace(/\.html$/, "");

  return {
    ASSETS: {
      fetch: async (request) => {
        const { pathname } = new URL(request.url);

        if (available.has(pathname)) {
          return pathname.endsWith(".html")
            ? Response.redirect(new URL(cleanUrlFor(pathname), request.url), 307)
            : new Response(`inhalt:${pathname}`, {
                status: 200,
                headers: { "Content-Type": "text/javascript" }
              });
        }

        const matchingFile = [...available].find(
          (filePath) => filePath.endsWith(".html") && cleanUrlFor(filePath) === pathname
        );

        return matchingFile
          ? new Response(`inhalt:${matchingFile}`, {
              status: 200,
              headers: { "Content-Type": "text/html" }
            })
          : new Response("Not found", { status: 404 });
      }
    }
  };
}

async function fetchWorker(path, environment, origin = "https://www.campdoerfl.de") {
  return worker.fetch(new Request(`${origin}${path}`), environment);
}

test("die Member Area beansprucht nur ihren eigenen Pfad", () => {
  assert.equal(isMemberAreaPath("/member"), true);
  assert.equal(isMemberAreaPath("/member/"), true);
  assert.equal(isMemberAreaPath("/member/explore"), true);
  assert.equal(isMemberAreaPath("/membership/"), false);
  assert.equal(isMemberAreaPath("/"), false);

  // Keine Seite der Website darf unter /member/ liegen, sonst verdeckt die App sie.
  for (const page of pages) {
    assert.equal(isMemberAreaPath(page.route), false, `Route kollidiert mit der Member Area: ${page.route}`);
  }
});

test("Routen der App fallen auf ihre Seite und zuletzt auf den Router zurück", () => {
  // Die saubere Adresse steht immer vorn: Cloudflare leitet ".../index.html"
  // sonst auf /member/ um und der Einstieg dreht sich im Kreis.
  assert.deepEqual(memberAssetCandidates("/member"), ["/member/", "/member/index.html"]);
  assert.deepEqual(memberAssetCandidates("/member/"), ["/member/", "/member/index.html"]);
  assert.deepEqual(memberAssetCandidates("/member/explore"), [
    "/member/explore",
    "/member/explore.html",
    "/member/",
    "/member/index.html"
  ]);

  // Fehlende Dateien dürfen niemals als HTML beantwortet werden — ein Bundle,
  // das plötzlich Markup zurückgibt, bricht die App ohne erkennbaren Fehler.
  assert.deepEqual(memberAssetCandidates("/member/_expo/static/js/web/entry-abc.js"), [
    "/member/_expo/static/js/web/entry-abc.js"
  ]);

  assert.deepEqual(memberAssetCandidates("/kontakt/"), []);
});

test("gehashte Dateien der App dürfen dauerhaft im Cache liegen, Seiten nie", () => {
  assert.match(memberCacheControl("/member/_expo/static/js/web/entry-abc.js"), /immutable/);
  assert.match(memberCacheControl("/member/assets/assets/images/logo.png"), /immutable/);
  assert.equal(memberCacheControl("/member/explore"), "public, max-age=0, must-revalidate");
});

test("der Worker liefert die App aus und hält sie aus dem Suchindex", async () => {
  const environment = assetEnvironmentFor([
    "/member/index.html",
    "/member/explore.html",
    "/member/_expo/static/js/web/entry-abc.js"
  ]);

  // Der Einstieg muss die App ausliefern und darf nicht weiterleiten.
  const start = await fetchWorker("/member/", environment);
  assert.equal(start.status, 200);
  assert.equal(await start.text(), "inhalt:/member/index.html");
  assert.equal(start.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(
    start.headers.get("content-security-policy"),
    memberSecurityHeaders["Content-Security-Policy"]
  );

  const withoutSlash = await fetchWorker("/member", environment);
  assert.equal(withoutSlash.status, 200);

  const route = await fetchWorker("/member/explore", environment);
  assert.equal(route.status, 200);
  assert.equal(await route.text(), "inhalt:/member/explore.html");

  const bundle = await fetchWorker("/member/_expo/static/js/web/entry-abc.js", environment);
  assert.equal(bundle.status, 200);
  assert.match(bundle.headers.get("cache-control"), /immutable/);

  // Unbekannte Route: der Router der App entscheidet, nicht die Website.
  const unknown = await fetchWorker("/member/gibt-es-nicht", environment);
  assert.equal(unknown.status, 200);
  assert.equal(await unknown.text(), "inhalt:/member/index.html");

  // Fehlendes Bundle bleibt ein Fehler.
  const missing = await fetchWorker("/member/_expo/static/js/web/fehlt.js", environment);
  assert.equal(missing.status, 404);
});

test("die Member Area landet immer auf der kanonischen Domain", async () => {
  const environment = assetEnvironmentFor(["/member/index.html"]);
  const response = await fetchWorker("/member/explore", environment, "https://campdoerfl.de");

  // Die Sitzung liegt im localStorage und gilt nur pro Herkunft — ein Wechsel
  // zwischen Apex und www würde die Anmeldung verlieren.
  assert.equal(response.status, 301);
  assert.equal(new URL(response.headers.get("location")).origin, "https://www.campdoerfl.de");
});

test("die Marketingseiten bleiben streng gesichert, die App darf mehr", () => {
  const sitePolicy = securityHeaders["Content-Security-Policy"];
  const memberPolicy = memberSecurityHeaders["Content-Security-Policy"];

  // Das Login-Fenster der Website meldet direkt beim App-Backend an.
  assert.ok(sitePolicy.includes(MEMBER_API_ORIGIN));
  assert.ok(sitePolicy.includes("script-src 'self' 'unsafe-inline';"));
  assert.ok(!sitePolicy.includes("unsafe-eval"));

  // Der Expo-Build braucht Blob-Worker und erzeugt Animationsfunktionen zur Laufzeit.
  assert.ok(memberPolicy.includes("worker-src 'self' blob:"));
  assert.ok(memberPolicy.includes("'unsafe-eval'"));
  assert.ok(memberPolicy.includes("script-src 'self'"));
  assert.ok(!memberPolicy.includes("script-src *"));
});

test("jede Seite trägt den Member-Zugang und das Login-Fenster", () => {
  for (const page of pages) {
    const html = page.render();

    assert.ok(
      html.includes(`class="nav-action nav-action--member" href="${MEMBER_BASE_PATH}/"`),
      `Member-Schaltfläche fehlt auf ${page.route}`
    );
    assert.ok(html.includes("data-member-login-form"), `Login-Fenster fehlt auf ${page.route}`);
    assert.ok(html.includes("Herzlich Willkommen"), `Login-Titel fehlt auf ${page.route}`);
    assert.ok(
      html.includes('name="email"') && html.includes('name="password"'),
      `Login-Felder fehlen auf ${page.route}`
    );
  }
});
