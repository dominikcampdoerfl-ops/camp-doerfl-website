import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../src/pages.mjs";

const structuredDataPattern = /<script type="application\/ld\+json">([^<]+)<\/script>/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

test("every VideoObject includes Google's required upload date", () => {
  let videoCount = 0;

  for (const page of pages) {
    const markup = page.render();
    const structuredDataMatch = markup.match(structuredDataPattern);

    assert.ok(structuredDataMatch, `${page.route}: structured data is missing`);

    const structuredData = JSON.parse(structuredDataMatch[1]);
    const videoObjects = structuredData["@graph"].filter((entry) => entry["@type"] === "VideoObject");

    for (const video of videoObjects) {
      videoCount += 1;
      assert.match(video.uploadDate || "", isoDatePattern, `${video["@id"]}: uploadDate is missing or invalid`);
      assert.ok(video.thumbnailUrl?.length, `${video["@id"]}: thumbnailUrl is missing`);
      assert.ok(video.embedUrl || video.contentUrl, `${video["@id"]}: embedUrl or contentUrl is required`);
    }
  }

  assert.ok(videoCount > 0, "the generated site must contain VideoObject data");
});
