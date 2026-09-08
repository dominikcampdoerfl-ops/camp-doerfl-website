// ============================================================
// Aus einer deutschen Seite die uebersetzte Fassung erzeugen
//
// Nimmt das fertig gerenderte deutsche HTML und liefert die Entsprechung in
// einer Zielsprache: uebersetzte Texte, Adressen mit Sprachpraefix in internen
// Links, angepasste Kopfdaten und wechselseitige hreflang-Verweise.
//
// Das Modul kennt keine einzelne Sprache mehr. Was Englisch von Chinesisch
// unterscheidet, steht in sprachen.mjs; hier laeuft nur der Umbau.
// ============================================================

import { erstelleUebersetzer, uebersetzeHtml } from "./translate-html.mjs";
import { ALLE_SPRACHEN, QUELLSPRACHE, routeFuer } from "./sprachen.mjs";

// Verweise auf Seiten der Website zeigen in der uebersetzten Fassung auf die
// jeweilige Entsprechung. Dateien, die Member Area und alles Externe bleiben.
function erstelleLinkUmschreibung(routen, sprache) {
  return (href) => {
    if (!href.startsWith("/") || href.startsWith("//")) return null;
    const pfad = href.split(/(?=[?#])/)[0];
    const rest = href.slice(pfad.length);
    if (!routen.has(pfad)) return null;
    return `${routeFuer(pfad, sprache)}${rest}`;
  };
}

// Nur fertige Sprachfassungen werden verlinkt. Eine Seite, die auf Chinesisch
// noch Luecken hat, taucht in den hreflang-Verweisen nicht auf — sonst schickt
// Google Leser auf eine halb deutsche Seite.
function hreflangBlock(siteUrl, route, fertigeSprachen) {
  const zeilen = [`<link rel="alternate" hreflang="de" href="${siteUrl}${route}">`];
  for (const sprache of fertigeSprachen) {
    zeilen.push(
      `<link rel="alternate" hreflang="${sprache.htmlLang}" href="${siteUrl}${routeFuer(route, sprache)}">`
    );
  }
  zeilen.push(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${route}">`);
  return zeilen.join("\n    ");
}

// Die deutsche Fassung braucht dieselben Verweise, sonst kennt Google nur eine
// Richtung und wertet die uebersetzten Seiten als Doppelinhalt.
export function ergaenzeHreflang(html, siteUrl, route, fertigeSprachen) {
  if (!fertigeSprachen.length) return html;
  return html.replace("</head>", `  ${hreflangBlock(siteUrl, route, fertigeSprachen)}\n  </head>`);
}

// Eine uebersetzte Seite mit Luecken enthaelt noch deutsche Absaetze. Solche
// Seiten werden erzeugt und sind aufrufbar, aber ausdruecklich nicht
// indexierbar — sonst landen halbdeutsche Fassungen als fremdsprachige Treffer
// bei Google. Erst wenn eine Seite vollstaendig uebersetzt ist, faellt die
// Sperre weg und sie kommt in Sitemap und hreflang.
export function setzeNoindex(html) {
  if (/<meta name="robots"/.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,follow">');
  }
  return html.replace("</head>", '  <meta name="robots" content="noindex,follow">\n  </head>');
}

// Setzt im Sprachumschalter genau eine Sprache aktiv.
function setzeAktiveSprache(html, aktiv) {
  let neu = html;
  for (const sprache of ALLE_SPRACHEN) {
    const istAktiv = sprache.code === aktiv.code;
    neu = neu.replace(
      new RegExp(`(<button[^>]*data-language="${sprache.code}"[^>]*)aria-pressed="(?:true|false)"`),
      `$1aria-pressed="${istAktiv}"`
    );
    neu = neu.replace(
      new RegExp(`<button class="language-switcher__button(?: is-active)?" type="button" data-language="${sprache.code}"`),
      `<button class="language-switcher__button${istAktiv ? " is-active" : ""}" type="button" data-language="${sprache.code}"`
    );
  }
  return neu;
}

export function baueUebersetzteSeite(
  html,
  { route, siteUrl, sprache, woerterbuch, eigennamen, routen, fehlstellen }
) {
  const uebersetze = erstelleUebersetzer(woerterbuch, {
    fehlstellen,
    eigennamen,
    vokabular: sprache.vokabular
  });
  let seite = uebersetzeHtml(html, uebersetze, {
    rewriteLink: erstelleLinkUmschreibung(routen, sprache)
  });

  const deAdresse = `${siteUrl}${route}`;
  const zielAdresse = `${siteUrl}${routeFuer(route, sprache)}`;

  seite = seite
    .replace(`<html lang="${QUELLSPRACHE.htmlLang}">`, `<html lang="${sprache.htmlLang}">`)
    .replace(`<link rel="canonical" href="${deAdresse}">`, `<link rel="canonical" href="${zielAdresse}">`)
    .replace(
      `<meta property="og:locale" content="${QUELLSPRACHE.ogLocale}">`,
      `<meta property="og:locale" content="${sprache.ogLocale}">`
    )
    .replace(`<meta property="og:url" content="${deAdresse}">`, `<meta property="og:url" content="${zielAdresse}">`);

  return setzeAktiveSprache(seite, sprache);
}

// Auf einer deutschen Seite, deren Fassung in einer Sprache noch Luecken hat,
// wird der zugehoerige Schalter stillgelegt. Sonst landet man mit einem Klick
// auf einer halb deutschen Seite. Der Schalter verschwindet nicht, sondern wird
// als nicht verfuegbar ausgewiesen — so bleibt sichtbar, dass es die Sprache
// gibt, sie hier aber noch nicht fertig ist.
const HINWEIS = {
  en: "English version in preparation",
  zh: "中文版本正在准备中"
};

export function sperreSchalter(html, sprache) {
  return html.replace(
    new RegExp(`<button([^>]*?)data-language="${sprache.code}"([^>]*?)>`),
    (treffer, vorne, hinten) => {
      // Der vorhandene title wird ersetzt, nicht ergaenzt — zwei title-Attribute
      // an einem Element sind ungueltig.
      const rest = hinten.replace(/\s*title="[^"]*"/, "");
      const hinweis = HINWEIS[sprache.code] || `${sprache.name} in preparation`;
      return `<button${vorne}data-language="${sprache.code}"${rest} disabled aria-disabled="true" title="${hinweis}" data-language-pending="true">`;
    }
  );
}
