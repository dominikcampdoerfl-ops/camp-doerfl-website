import { watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
import "./server.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const watchTargets = [resolve(root, "src"), resolve(root, "assets")];

let buildQueued = false;
let buildRunning = false;
let rebuildTimer = null;

async function runBuild(reason = "manual") {
  if (buildRunning) {
    buildQueued = true;
    return;
  }

  buildRunning = true;

  try {
    console.log(`[dev] rebuilding (${reason})`);
    await buildSite();
  } catch (error) {
    console.error("[dev] rebuild failed");
    console.error(error);
  } finally {
    buildRunning = false;

    if (buildQueued) {
      buildQueued = false;
      await runBuild("queued");
    }
  }
}

function scheduleBuild(reason) {
  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuildTimer = null;
    void runBuild(reason);
  }, 120);
}

for (const target of watchTargets) {
  watch(
    target,
    { recursive: true },
    (_eventType, filename) => {
      if (!filename) return;
      scheduleBuild(`${target.split("/").pop()}/${filename}`);
    }
  );
}

console.log("[dev] watching src and assets for changes");
