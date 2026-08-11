import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pages } from "../src/pages.mjs";

const render = (route) => pages.find((page) => page.route === route)?.render() || "";

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("core CSS and JavaScript always use a content-fingerprinted immutable path", async () => {
  const components = await readFile(new URL("../src/components.mjs", import.meta.url), "utf8");
  const build = await readFile(new URL("../src/build.mjs", import.meta.url), "utf8");

  assert.match(components, /\/assets\/__ASSET_VERSION__\/styles\.css/);
  assert.match(components, /\/assets\/__ASSET_VERSION__\/design-contract\.css/);
  assert.doesNotMatch(components, /styles\.css\?v=/);
  assert.match(build, /createHash\("sha256"\)/);
  assert.match(build, /replaceAll\("__ASSET_VERSION__", assetVersion\)/);
});

test("new editorial templates declare explicit light and dark color schemes", () => {
  for (const route of [
    "/expertenwissen/",
    "/personal-trainer-auswaehlen-nuernberg/",
    "/bodybuilding-wettkampfvorbereitung-dauer/",
    "/bia-inbody-koerperanalyse-vergleich/",
    "/redaktionelle-richtlinien/"
  ]) {
    const markup = render(route);
    assert.match(markup, /data-color-scheme="dark"/);
  }

  for (const route of [
    "/personal-trainer-auswaehlen-nuernberg/",
    "/bodybuilding-wettkampfvorbereitung-dauer/",
    "/bia-inbody-koerperanalyse-vergleich/",
    "/redaktionelle-richtlinien/"
  ]) {
    assert.match(render(route), /data-color-scheme="light"/);
  }
});

test("the design contract meets WCAG AA contrast for normal body text", async () => {
  const contract = await readFile(new URL("../src/design-contract.css", import.meta.url), "utf8");
  assert.match(contract, /\[data-color-scheme="light"\]/);
  assert.match(contract, /\[data-color-scheme="dark"\]/);
  assert.ok(contrast("#5d5549", "#fcfaf5") >= 4.5);
  assert.ok(contrast("#17130d", "#fcfaf5") >= 4.5);
  assert.ok(contrast("#ded5c5", "#11100d") >= 4.5);
  assert.ok(contrast("#fffdf8", "#11100d") >= 4.5);
});
