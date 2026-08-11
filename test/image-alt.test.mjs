import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const imageTagPattern = /<img\b[^>]*>/g;
const altPattern = /\balt=(?:"([^"]*)"|'([^']*)')/;
const srcPattern = /\bsrc=(?:"([^"]*)"|'([^']*)')/;
const decorativeImagePattern = /\/(?:camp-doerfl-logo\.png|social-(?:instagram|facebook|linkedin|spotify)\.(?:svg|png)|partner-(?:xxl-nutrition-logo|aeke-logo|trueformance-logo|clever-fit-nuernberg-sued|strava)\.(?:png|jpg))$/;

test("every rendered image has a purposeful alt attribute", () => {
  let imageCount = 0;

  for (const page of pages) {
    const markup = page.render();
    const imageTags = markup.match(imageTagPattern) || [];

    for (const tag of imageTags) {
      imageCount += 1;
      const altMatch = tag.match(altPattern);
      const srcMatch = tag.match(srcPattern);
      const src = srcMatch?.[1] || srcMatch?.[2] || "unknown image";

      assert.ok(altMatch, `${page.route}: ${src} is missing an alt attribute`);

      const alt = altMatch[1] ?? altMatch[2] ?? "";

      if (alt === "") {
        assert.match(src, decorativeImagePattern, `${page.route}: ${src} may not use an empty alt attribute`);
        continue;
      }

      assert.doesNotMatch(alt, /^(?:bild|foto|image|logo|icon|platzhalter)$/i, `${page.route}: ${src} has an overly generic alt text`);
      assert.doesNotMatch(alt, /\.(?:avif|gif|jpe?g|png|svg|webp)$/i, `${page.route}: ${src} uses a filename as alt text`);
    }
  }

  assert.ok(imageCount > 0, "the generated site must contain images");
});
