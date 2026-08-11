/**
 * Permanent redirects for pages that existed before the 2026 relaunch.
 *
 * Exact rules are evaluated first. Prefix rules deliberately cover both the
 * archived URLs listed below and additional Jimdo descendants that may still
 * exist in bookmarks, backlinks or a search-engine index.
 */
export const legacyRedirectRules = Object.freeze({
  exact: Object.freeze({
    "/agb/": "/impressum/",
    "/archiv/bodybuilding-wettkaempfe-2024/": "/bodybuilding-wettkaempfe-2026/",
    "/archiv/halbmarathon-termine-2024/": "/laufkalender-2026/",
    "/athletenbereich/archiv/bodybuilding-wettkaempfe-2024/": "/bodybuilding-wettkaempfe-2026/",
    "/athletenbereich/archiv/halbmarathon-termine-2024/": "/laufkalender-2026/",
    "/athletenbereich/bodybuilding-wettkaempfe-2024/": "/bodybuilding-wettkaempfe-2026/",
    "/athletenbereich/bodybuilding-wettkaempfe-2025/": "/bodybuilding-wettkaempfe-2026/",
    "/athletenbereich/bodybuilding-wettkaempfe-2026/": "/bodybuilding-wettkaempfe-2026/",
    "/athletenbereich/bodybuilding-coach/": "/bodybuilding-coaching-wettkampfvorbereitung/",
    "/athletenbereich/bodybuilding/": "/bodybuilding-coaching-wettkampfvorbereitung/",
    "/athletenbereich/bodybuilding-gewichtslimits/": "/bodybuilding-klassen-gewichtslimits/",
    "/athletenbereich/bodybuilding-klassen-gewichtslimits/": "/bodybuilding-klassen-gewichtslimits/",
    "/athletenbereich/wettkampf-info/klassen-kategorien/": "/bodybuilding-klassen-gewichtslimits/",
    "/athletenbereich/wettkampf-info/bodybuilding-verbaende/": "/bodybuilding-coaching-wettkampfvorbereitung/",
    "/athletenbereich/camp-doerfl-podcast/": "/ueber-dominik/",
    "/athletenbereich/erfolge-im-camp-doerfl/lebenseinstellung-bodybuilding-mit-guenter-preis/": "/erfolge-im-team/guenter-preis/",
    "/athletenbereich/erfolge-im-team/guenter-preis/": "/erfolge-im-team/guenter-preis/",
    "/athletenbereich/halbmarathon-termine-2024/": "/laufkalender-2026/",
    "/athletenbereich/supplement-empfehlung/": "/partner/",
    "/athletenbereich/triathlon-termine-2024/": "/triathlon-kalender-2026/",
    "/camp-doerfl-podcast/": "/ueber-dominik/",
    "/bodybuilding/": "/bodybuilding-coaching-wettkampfvorbereitung/",
    "/cookie-einstellungen/": "/cookies/",
    "/dein-trainer/": "/ueber-dominik/",
    "/dein-trainer/partner/": "/partner/",
    "/die-starken-partner/": "/partner/",
    "/die-starken-partner/bgm-angebote/": "/firmenfitness/",
    "/die-starken-partner/bgm-angebote-fuer-unternehmen/": "/firmenfitness/",
    "/erfolge-im-camp-doerfl/lebenseinstellung-bodybuilding-mit-guenter-preis/": "/erfolge-im-team/guenter-preis/",
    "/firmenfitness-aus-nuernberg/gesundheitstag/": "/gesundheitstag-nuernberg/",
    "/firmenfitness-in-nuernberg/gesundheitstag/": "/gesundheitstag-nuernberg/",
    "/firmenfitness-nuernberg/": "/firmenfitness/",
    "/firmenfitness/bgm-angebote/": "/firmenfitness/",
    "/firmenfitness/gesundheitstag/": "/gesundheitstag-nuernberg/",
    "/fitnessstudio-in-nuernberg/supplement-shop-nuernberg/": "/partner/",
    "/gesundheitstag/": "/gesundheitstag-nuernberg/",
    "/gesundheitstag-in-nuernberg/": "/gesundheitstag-nuernberg/",
    "/gesundheitstage-nuernberg/": "/gesundheitstag-nuernberg/",
    "/jetzt-buchen/koerperanalyse-nuernberg-bia-messung/": "/koerperanalyse-nuernberg/",
    "/fuer-athleten/erfolge-im-team/guenter-preis/": "/erfolge-im-team/guenter-preis/",
    "/home/die-starken-partner/": "/partner/",
    "/home/preise-und-leistungen/": "/personal-training-kosten-nuernberg/",
    "/lieferbedingungen/": "/impressum/",
    "/personal-coaching/": "/personal-trainer-nürnberg/",
    "/personal-trainer-nuernberg/": "/personal-trainer-nürnberg/",
    "/personal-training-in-nuernberg/xxl-nutrition/": "/partner/",
    "/preise/": "/personal-training-kosten-nuernberg/",
    "/preise-und-leistungen/": "/personal-training-kosten-nuernberg/",
    "/shop/basis-magazin---fitness-ebook/": "/app/",
    "/shop/fitness-ebook/": "/app/",
    "/shop/fitness-magazin/": "/app/",
    "/startseite/aktuelle-news/": "/erfolge-im-team/",
    "/downloads/": "/app/",
    "/widerrufsbelehrung/": "/impressum/",
    "/widerrufsrecht/": "/impressum/"
  }),
  prefixes: Object.freeze([
    Object.freeze({ from: "/athletenbereich/erfolge-im-team/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/athletenbereich/erfolge-im-camp-doerfl/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/athletenbereich/archiv/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/athletenbereich/aktuelle-news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/athletenbereich/news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-coach/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-doku/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-gewichtslimits/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-klassen-gewichtslimits/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-verbaende/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/bodybuilding-wettkaempfe-", to: "/bodybuilding-wettkaempfe-2026/" }),
    Object.freeze({ from: "/athletenbereich/halbmarathon-termine-", to: "/laufkalender-2026/" }),
    Object.freeze({ from: "/athletenbereich/triathlon-termine-", to: "/triathlon-kalender-2026/" }),
    Object.freeze({ from: "/athletenbereich/ablauf-bodybuilding-wettkampf/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/blog/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/fitness-blog/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/hybrid-training/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/athletenbereich/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/home/aktuelle-news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/home/news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/aktuelle-news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/camp-doerfl-news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/news/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/archiv/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/erfolge-im-camp-doerfl/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/erfolge/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/personal-trainer-nuernberg/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/personal-trainer-in-nuernberg/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/personal-training-in-nuernberg/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/personal-training-nuernberg/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/personal-training/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/personal-trainer/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/coaching-angebote/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/dein-personal-trainer/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fitness-online-coaching/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/premium-online-coaching/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/online-coaching/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fitness-online-coach/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/betreuung-fuer-frauen/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fuer-die-ladys/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fuer-athleten/erfolge-im-team/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/fuer-athleten/erfolge/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/fuer-athleten/athletenteam/", to: "/erfolge-im-team/" }),
    Object.freeze({ from: "/fuer-athleten/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fitnessstudio-in-nuernberg/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/bodybuilding-doku/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/bodybuilding/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/camp-doerfl-blog/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/blog/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/fitness-shop/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/shop/", to: "/personal-trainer-nürnberg/" }),
    Object.freeze({ from: "/firmenfitness-aus-nuernberg/", to: "/firmenfitness/" }),
    Object.freeze({ from: "/firmenfitness-in-nuernberg/", to: "/firmenfitness/" }),
    Object.freeze({ from: "/fuer-unternehmen/moderator/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/moderator-in-nuernberg/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/moderator-nuernberg/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/moderation/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/event/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/events/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/eventmoderation/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/event-moderation/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/speaker/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/keynote/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/keynote-speaker/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/veranstaltung/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/veranstaltungen/", to: "/events/" }),
    Object.freeze({ from: "/fuer-unternehmen/bgm/", to: "/firmenfitness/" }),
    Object.freeze({ from: "/fuer-unternehmen/gesundheitscheck/", to: "/firmenfitness/" }),
    Object.freeze({ from: "/fuer-unternehmen/gesundheitstag/", to: "/gesundheitstag-nuernberg/" }),
    Object.freeze({ from: "/fuer-unternehmen/", to: "/firmenfitness/" }),
    Object.freeze({ from: "/veranstaltungen-und-events/", to: "/events/" }),
    Object.freeze({ from: "/speaker-und-moderator/", to: "/events/" }),
    Object.freeze({ from: "/speaker/", to: "/events/" }),
    Object.freeze({ from: "/jetzt-buchen/", to: "/kontakt/" })
  ])
});

export function normalizeLegacyPathname(pathname) {
  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (!decodedPathname.startsWith("/")) {
    return null;
  }

  let normalized = decodedPathname.normalize("NFC").toLowerCase().replace(/\/{2,}/g, "/");
  normalized = normalized.replace(/\/index\.html?$/, "/").replace(/\.html?$/, "");

  if (normalized === "/") {
    return normalized;
  }

  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function resolveCanonicalRedirect(pathname, canonicalRoutes) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  if (!normalizedPathname) {
    return null;
  }

  const canonicalTarget = canonicalRoutes.find(
    (route) => normalizeLegacyPathname(route) === normalizedPathname
  );

  if (!canonicalTarget) {
    return null;
  }

  let decodedPathname;

  try {
    decodedPathname = decodeURIComponent(pathname).normalize("NFC");
  } catch {
    return null;
  }

  return decodedPathname === canonicalTarget ? null : canonicalTarget;
}

export function resolveLegacyRedirect(pathname) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  if (!normalizedPathname) {
    return null;
  }

  const exactTarget = legacyRedirectRules.exact[normalizedPathname];

  if (exactTarget) {
    return exactTarget;
  }

  for (const rule of legacyRedirectRules.prefixes) {
    if (normalizedPathname === rule.from || normalizedPathname.startsWith(rule.from)) {
      return rule.to;
    }
  }

  return null;
}
