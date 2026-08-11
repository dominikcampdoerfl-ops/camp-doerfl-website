import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Googlebot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "Bytespider"
];

test("AI search, retrieval and model crawlers are explicitly allowed", async () => {
  const buildSource = await readFile(new URL("../src/build.mjs", import.meta.url), "utf8");

  for (const crawler of expectedCrawlers) {
    assert.match(
      buildSource,
      new RegExp(`User-agent: ${crawler.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\nAllow: /`),
      `${crawler} is not explicitly allowed`
    );
  }

  assert.match(buildSource, /User-agent: \*\nAllow: \//);
  assert.match(buildSource, /Sitemap: \$\{site\.url\}\/sitemap\.xml/);
  assert.match(buildSource, /# AI site guide: \$\{site\.url\}\/llms\.txt/);
});

test("llms.txt gives assistants a concise map of the public website", async () => {
  const buildSource = await readFile(new URL("../src/build.mjs", import.meta.url), "utf8");

  assert.match(buildSource, /Körperanalyse Nürnberg/);
  assert.match(buildSource, /Personal Trainer Nürnberg/);
  assert.match(buildSource, /Firmenfitness deutschlandweit/);
  assert.match(buildSource, /XML sitemap/);
});
