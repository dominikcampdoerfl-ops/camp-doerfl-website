// ============================================================
// Deutsch -> Englisch auf dem fertigen HTML
//
// Die Seiten entstehen als deutsche Vorlagen in src/pages.mjs. Statt diese
// 19.600 Zeilen zu verdoppeln, wird die gerenderte Seite hier ein zweites Mal
// durchlaufen: Jeder sichtbare Textabschnitt und jedes uebersetzbare Attribut
// wird im Woerterbuch nachgeschlagen und ersetzt. Was dort fehlt, bleibt
// deutsch stehen und wird als Fehlstelle gemeldet — eine halb uebersetzte
// Seite ist damit immer sichtbar, nie stillschweigend.
//
// Absichtlich unangetastet bleiben: Skripte, Stile, Adressen, Zahlen und
// alles unter [translate="no"] oder .notranslate.
// ============================================================

import { erstelleRegeln } from "./regeln.mjs";

const UEBERSETZBARE_ATTRIBUTE = ["alt", "title", "aria-label", "placeholder"];
const META_MIT_TEXT = new Set([
  "description",
  "og:title",
  "og:description",
  "twitter:title",
  "twitter:description",
  "og:image:alt",
  "twitter:image:alt"
]);

// Nur Werte unter diesen Schluesseln werden in strukturierten Daten ersetzt.
// Alles andere (@type, @id, url, Datumsangaben, Preise) bleibt unberuehrt.
const JSONLD_TEXTFELDER = new Set([
  "name",
  "alternateName",
  "description",
  "headline",
  "text",
  "abstract",
  "disambiguatingDescription",
  "jobTitle",
  "slogan",
  "caption"
]);

export function normalisiere(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Ein Textabschnitt ist nur dann uebersetzenswert, wenn er ueberhaupt Buchstaben
// enthaelt. Reine Zahlen, Pfeile, Trennzeichen und Masszahlen bleiben stehen.
function istUebersetzenswert(text) {
  if (!text) return false;
  // Reine HTML-Entitaeten wie &rarr; oder &nbsp; tragen keinen Text, auch wenn
  // ihr Name aus Buchstaben besteht.
  if (/^(?:\s|&[a-zA-Z]+;|&#\d+;)+$/.test(text)) return false;
  // Betraege enthalten keine Buchstaben, muessen aber trotzdem durch die
  // Regeln: "1.158 €" heisst im Englischen "€1,158".
  if (/[\d.,]\s*(?:&nbsp;|\s)*€/.test(text)) return true;
  if (!/\p{L}{2,}/u.test(text)) return false;
  if (/^(?:DE|EN)$/i.test(text)) return false;
  // Adressen bleiben, wie sie sind.
  if (/^\S+@\S+\.\S+$/.test(text) && !/beispiel/i.test(text)) return false;
  if (/^https?:\/\//.test(text)) return false;
  return true;
}

export function erstelleUebersetzer(woerterbuch, { fehlstellen, eigennamen, vokabular } = {}) {
  let regeln = [];

  // Loest einen Ausdruck auf und gibt null zurueck, wenn nichts greift.
  // Die Regeln rufen diese Funktion fuer ihre Teilausdruecke erneut auf,
  // damit "Offizielle Quelle fuer <Name>" den Namen sauber durchreicht.
  const loese = (kern) => {
    if (!istUebersetzenswert(kern)) return kern;

    // Ein Eintrag von Hand schlaegt alles andere — auch den Eigennamenschutz.
    // So laesst sich jeder Sonderfall uebersteuern, etwa "Nuernberg", das als
    // Veranstaltungsort in den Daten steht, im englischen Fliesstext aber
    // "Nuremberg" heissen soll.
    const treffer = woerterbuch.get(kern);
    if (treffer !== undefined) return treffer;

    if (eigennamen && eigennamen.has(kern)) return kern;

    for (const regel of regeln) {
      if (regel.pruefe(kern)) return regel.wende(kern);
    }
    return null;
  };

  regeln = erstelleRegeln(loese, vokabular);

  return function uebersetze(rohtext) {
    const kern = normalisiere(rohtext);
    if (!istUebersetzenswert(kern)) return null;

    const ergebnis = loese(kern);
    if (ergebnis === null) {
      if (fehlstellen) fehlstellen.add(kern);
      return null;
    }
    // Bleibt der Text gleich, wird das Markup nicht angefasst.
    return ergebnis === kern ? null : ergebnis;
  };
}

// Ersetzt den Kern eines Textabschnitts und behaelt die umgebenden
// Leerzeichen und Zeilenumbrueche bei, damit die Formatierung erhalten bleibt.
function ersetzeKern(rohtext, neu) {
  const vorne = rohtext.match(/^\s*/)[0];
  const hinten = rohtext.match(/\s*$/)[0];
  return `${vorne}${neu}${hinten}`;
}

function maskiereAttributwert(wert) {
  return wert.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function demaskiere(wert) {
  return wert
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function uebersetzeJsonLd(rohJson, uebersetze) {
  let daten;
  try {
    daten = JSON.parse(rohJson);
  } catch {
    return rohJson;
  }

  const gehe = (wert) => {
    if (Array.isArray(wert)) return wert.map(gehe);
    if (wert && typeof wert === "object") {
      const neu = {};
      for (const [schluessel, inhalt] of Object.entries(wert)) {
        if (typeof inhalt === "string" && JSONLD_TEXTFELDER.has(schluessel)) {
          neu[schluessel] = uebersetze(inhalt) ?? inhalt;
        } else {
          neu[schluessel] = gehe(inhalt);
        }
      }
      return neu;
    }
    return wert;
  };

  return JSON.stringify(gehe(daten));
}

// Zerlegt das HTML in Tags und Text. Da das Markup aus unseren eigenen
// Vorlagen stammt, reicht diese Zerlegung; fremdes HTML wird hier nicht
// verarbeitet.
export function uebersetzeHtml(html, uebersetze, { rewriteLink } = {}) {
  const teile = html.split(/(<[^>]*>)/);
  const ergebnis = [];

  let ueberspringenBis = null; // "script" | "style"
  let inRohJson = false;
  // Tiefe der Bereiche, die nicht uebersetzt werden duerfen.
  let sperrtiefe = 0;
  let sperrmarke = null;

  for (const teil of teile) {
    if (!teil) continue;

    if (teil.startsWith("<")) {
      const istEndtag = teil.startsWith("</");
      const name = (teil.match(/^<\/?\s*([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase();

      if (ueberspringenBis) {
        if (istEndtag && name === ueberspringenBis) {
          ueberspringenBis = null;
          inRohJson = false;
        }
        ergebnis.push(teil);
        continue;
      }

      if (!istEndtag && (name === "script" || name === "style")) {
        ueberspringenBis = name;
        inRohJson = name === "script" && /type=["']application\/ld\+json["']/.test(teil);
        ergebnis.push(teil);
        continue;
      }

      // Bereiche, die ausdruecklich nicht uebersetzt werden.
      if (!istEndtag && /\btranslate=["']no["']|\bclass=["'][^"']*\bnotranslate\b/.test(teil) && !teil.endsWith("/>")) {
        if (sperrtiefe === 0) sperrmarke = name;
        sperrtiefe += 1;
      } else if (sperrtiefe > 0 && !istEndtag && name === sperrmarke) {
        sperrtiefe += 1;
      } else if (sperrtiefe > 0 && istEndtag && name === sperrmarke) {
        sperrtiefe -= 1;
      }

      ergebnis.push(sperrtiefe > 0 ? teil : uebersetzeTag(teil, uebersetze, rewriteLink));
      continue;
    }

    if (ueberspringenBis) {
      ergebnis.push(inRohJson ? uebersetzeJsonLd(teil, uebersetze) : teil);
      continue;
    }

    if (sperrtiefe > 0) {
      ergebnis.push(teil);
      continue;
    }

    const neu = uebersetze(teil);
    ergebnis.push(neu === null ? teil : ersetzeKern(teil, neu));
  }

  return ergebnis.join("");
}

function uebersetzeTag(tag, uebersetze, rewriteLink) {
  let neu = tag;

  for (const attribut of UEBERSETZBARE_ATTRIBUTE) {
    neu = neu.replace(new RegExp(`\\b${attribut}="([^"]*)"`, "g"), (treffer, wert) => {
      const ersetzung = uebersetze(demaskiere(wert));
      return ersetzung === null ? treffer : `${attribut}="${maskiereAttributwert(ersetzung)}"`;
    });
  }

  // <meta name="description"> und die Sozial-Vorschauen.
  const metaName = (neu.match(/\b(?:name|property)="([^"]+)"/) || [])[1];
  if (/^<meta\b/i.test(neu) && metaName && META_MIT_TEXT.has(metaName)) {
    neu = neu.replace(/\bcontent="([^"]*)"/, (treffer, wert) => {
      const ersetzung = uebersetze(demaskiere(wert));
      return ersetzung === null ? treffer : `content="${maskiereAttributwert(ersetzung)}"`;
    });
  }

  if (rewriteLink && /^<a\b/i.test(neu)) {
    neu = neu.replace(/\bhref="([^"]*)"/, (treffer, wert) => {
      const ziel = rewriteLink(demaskiere(wert));
      return ziel === null ? treffer : `href="${maskiereAttributwert(ziel)}"`;
    });
  }

  return neu;
}
