// Prüft jede gebaute Seite in einem echten Browser darauf, ob Text auf seinem
// tatsächlichen Untergrund lesbar ist.
//
// Warum ein echter Browser: Die Farbe eines Textes entsteht erst aus der
// Kaskade — aus zwei CSS-Dateien mit über tausend Regeln, Spezifitäten,
// !important-Schichten und Variablen. Statisch lässt sich das nicht zuverlässig
// nachrechnen. Genau daran sind die weißen Überschriften auf hellem Grund
// vorbeigerutscht: Jede Regel für sich war plausibel, erst das Zusammenspiel
// ergab unlesbaren Text.
//
// Aufruf:
//   npm run kontrast              → alle Seiten
//   npm run kontrast -- /impressum/ /app/   → nur diese
//
// Der Browser ist das installierte Google Chrome; es wird keiner mitgeliefert.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

import { pages } from "../src/pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const PORT = Number(process.env.KONTRAST_PORT ?? 4199);
const BASIS = `http://127.0.0.1:${PORT}`;

// Ab hier gilt Text als unlesbar. 3:1 ist die Grenze der Barrierefreiheits-
// richtlinie für große Schrift; darunter beginnt echtes Rätselraten.
const MINDEST_KONTRAST = 3;

const chromePfade = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

function findeChrome() {
  const pfad = process.env.CHROME_PATH ?? chromePfade.find((kandidat) => existsSync(kandidat));

  if (!pfad) {
    console.error("Kein Chrome gefunden. Pfad über CHROME_PATH setzen.");
    process.exit(1);
  }

  return pfad;
}

function starteServer() {
  const server = spawn("node", ["src/server.mjs"], {
    cwd: root,
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });

  return server;
}

async function warteAufServer() {
  for (let versuch = 0; versuch < 40; versuch += 1) {
    try {
      const antwort = await fetch(`${BASIS}/`);
      if (antwort.ok) return;
    } catch {
      // Server startet noch.
    }
    await new Promise((fertig) => setTimeout(fertig, 250));
  }

  throw new Error("Vorschau-Server ist nicht gestartet.");
}

// Im Browser ausgeführt: sammelt jeden sichtbaren Text mit seiner Farbe und der
// Farbe, die tatsächlich hinter ihm liegt.
function messeSeite(mindestKontrast) {
  const zahlen = (wert) => wert.match(/[\d.]+/g).map(Number);
  const relativeHelligkeit = ([r, g, b]) => {
    const kanal = (wert) => {
      const anteil = wert / 255;
      return anteil <= 0.03928 ? anteil / 12.92 : ((anteil + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
  };
  const kontrast = (vorne, hinten) => {
    const a = relativeHelligkeit(vorne);
    const b = relativeHelligkeit(hinten);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const mische = (vorne, hinten, alpha) => vorne.map((wert, index) => wert * alpha + hinten[index] * (1 - alpha));

  // Der Untergrund entsteht aus allen Flächen über der ersten deckenden: erst
  // nach oben sammeln, dann von unten nach oben übereinanderlegen. Wer stattdessen
  // beim ersten deckenden Vorfahren aufhört, übersieht helle Halbtransparenz
  // darüber — etwa eine Schaltfläche mit 90 % weißem Grund auf dunklem Abschnitt.
  // Bilder und Verläufe zählen als "unbekannt": Dort ist die Farbe nicht
  // bestimmbar, die Stelle wird übersprungen statt falsch gemeldet.
  const untergrund = (element) => {
    const schichten = [];
    let knoten = element;
    let basis = null;

    while (knoten && knoten !== document.documentElement) {
      const stil = getComputedStyle(knoten);

      if (stil.backgroundImage !== "none") return null;

      const farbe = zahlen(stil.backgroundColor);
      const alpha = farbe.length === 4 ? farbe[3] : 1;

      if (alpha >= 0.999) {
        basis = farbe.slice(0, 3);
        break;
      }

      if (alpha > 0) schichten.push({ farbe: farbe.slice(0, 3), alpha });

      knoten = knoten.parentElement;
    }

    if (!basis) {
      const körper = zahlen(getComputedStyle(document.body).backgroundColor);
      basis = körper.length === 4 && körper[3] < 0.999 ? [255, 255, 255] : körper.slice(0, 3);
    }

    // schichten[0] liegt dem Text am nächsten, muss also zuletzt aufgetragen werden.
    for (const schicht of schichten.reverse()) {
      basis = mische(schicht.farbe, basis, schicht.alpha);
    }

    return basis;
  };

  const funde = [];
  const auswahl = "main :is(h1,h2,h3,h4,h5,p,li,dt,dd,strong,b,em,span,a,address,code,small,figcaption,summary,label,button)";

  for (const element of document.querySelectorAll(auswahl)) {
    const text = [...element.childNodes]
      .filter((knoten) => knoten.nodeType === Node.TEXT_NODE)
      .map((knoten) => knoten.textContent.trim())
      .join(" ")
      .trim();

    if (text.length < 2) continue;

    const stil = getComputedStyle(element);
    if (stil.visibility === "hidden" || stil.display === "none" || Number(stil.opacity) < 0.15) continue;

    const masse = element.getBoundingClientRect();
    if (masse.width < 4 || masse.height < 4) continue;

    const hinten = untergrund(element);
    if (!hinten) continue;

    const vorneRoh = zahlen(stil.color);
    const alpha = vorneRoh.length === 4 ? vorneRoh[3] : 1;
    if (alpha < 0.15) continue;
    const vorne = alpha >= 0.999 ? vorneRoh.slice(0, 3) : mische(vorneRoh.slice(0, 3), hinten, alpha);

    const wert = kontrast(vorne, hinten);

    if (wert < mindestKontrast) {
      funde.push({
        text: text.slice(0, 48),
        tag: element.tagName.toLowerCase(),
        klasse: (element.className?.toString?.() ?? "").slice(0, 44),
        farbe: stil.color,
        untergrund: `rgb(${hinten.map(Math.round).join(", ")})`,
        kontrast: Math.round(wert * 100) / 100,
      });
    }
  }

  return funde;
}

const gewuenscht = process.argv.slice(2).filter((argument) => argument.startsWith("/"));
const routen = gewuenscht.length > 0 ? gewuenscht : pages.map((seite) => seite.route);

const server = starteServer();
let fehlerhaft = 0;

try {
  await warteAufServer();

  const browser = await puppeteer.launch({
    executablePath: findeChrome(),
    headless: true,
    args: ["--no-sandbox", "--force-color-profile=srgb"],
  });

  const seite = await browser.newPage();
  await seite.setViewport({ width: 1440, height: 900 });

  for (const route of routen) {
    await seite.goto(`${BASIS}${route}`, { waitUntil: "networkidle2", timeout: 30000 });

    // Einblend-Animationen und der Einwilligungshinweis würden echte Inhalte
    // verdecken; beides wird für die Messung stillgelegt.
    await seite.evaluate(() => {
      document.querySelector("[data-consent-root]")?.remove();
      document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
    });

    const funde = await seite.evaluate(messeSeite, MINDEST_KONTRAST);

    if (funde.length === 0) {
      console.log(`✔ ${route}`);
      continue;
    }

    fehlerhaft += 1;
    console.log(`✖ ${route} — ${funde.length} unlesbare Stellen`);

    for (const fund of funde.slice(0, 6)) {
      console.log(`    ${String(fund.kontrast).padStart(5)}:1  <${fund.tag}${fund.klasse ? ` class="${fund.klasse}"` : ""}>  ${fund.farbe} auf ${fund.untergrund}`);
      console.log(`           „${fund.text}"`);
    }

    if (funde.length > 6) console.log(`    … und ${funde.length - 6} weitere`);
  }

  await browser.close();
} finally {
  server.kill();
}

console.log(
  fehlerhaft === 0
    ? `\nAlle ${routen.length} Seiten sind lesbar (mindestens ${MINDEST_KONTRAST}:1).`
    : `\n${fehlerhaft} von ${routen.length} Seiten haben unlesbare Stellen.`
);

process.exit(fehlerhaft === 0 ? 0 : 1);
