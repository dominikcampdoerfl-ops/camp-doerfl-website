import { resolveContactTopicValue } from "./contact-topics.js";

const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

const LANGUAGE_STORAGE_KEY = "campdoerfl-language";
const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const storedLanguage = (() => {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
})();
const selectedLanguage = requestedLanguage === "en" || (!requestedLanguage && storedLanguage === "en") ? "en" : "de";

const setLanguageControls = (language) => {
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const setEnglishPageMetadata = () => {
  document.documentElement.lang = "en";
  document.documentElement.dataset.language = "en";
  document.title = `${document.title} | English`;
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", "en_US");
};

const translateText = async (texts) => {
  const separator = (index) => `[[[CAMPDOERFL_TRANSLATION_SPLIT_${index}]]]`;
  const source = texts.map((text, index) => `${text}\n${separator(index)}`).join("\n");
  const query = new URLSearchParams({ client: "gtx", sl: "de", tl: "en", dt: "t" });
  query.append("q", source);
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query.toString()}`);
  if (!response.ok) throw new Error("Translation request failed");

  const data = await response.json();
  const translatedSource = data[0].map((entry) => entry?.[0] || "").join("");
  const translations = [];
  let remainder = translatedSource;

  texts.forEach((_, index) => {
    const marker = separator(index);
    const markerIndex = remainder.indexOf(marker);
    if (markerIndex === -1) {
      translations.push("");
      return;
    }
    translations.push(remainder.slice(0, markerIndex).trim());
    remainder = remainder.slice(markerIndex + marker.length).trimStart();
  });

  return translations;
};

const pageTextEntries = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.closest("script, style, svg, [translate='no'], .notranslate")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const entries = [];
  let node;
  while ((node = walker.nextNode())) entries.push({ node, text: node.nodeValue.trim() });

  document.querySelectorAll("[alt], [placeholder], [aria-label], [title]").forEach((element) => {
    if (element.closest("[translate='no'], .notranslate")) return;
    ["alt", "placeholder", "aria-label", "title"].forEach((attribute) => {
      const text = element.getAttribute(attribute)?.trim();
      if (text && !/^(?:DE|EN)$/i.test(text)) entries.push({ element, attribute, text });
    });
  });
  return entries;
};

const translatePageToEnglish = async () => {
  const entries = pageTextEntries();
  const batches = [];
  let batch = [];
  let batchLength = 0;

  entries.forEach((entry) => {
    const entryLength = encodeURIComponent(entry.text).length;
    if (batch.length && (batch.length >= 18 || batchLength + entryLength > 4000)) {
      batches.push(batch);
      batch = [];
      batchLength = 0;
    }
    batch.push(entry);
    batchLength += entryLength;
  });
  if (batch.length) batches.push(batch);

  for (const batch of batches) {
    const translations = await translateText(batch.map((entry) => entry.text));
    batch.forEach((entry, index) => {
      const translation = translations[index];
      if (!translation) return;
      if (entry.node) entry.node.nodeValue = entry.node.nodeValue.replace(entry.text, translation);
      if (entry.element) entry.element.setAttribute(entry.attribute, translation);
    });
  }
};

setLanguageControls(selectedLanguage);
document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language === "en" ? "en" : "de";
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {}
    const url = new URL(window.location.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.location.assign(url);
  });
});

if (selectedLanguage === "en") {
  setEnglishPageMetadata();
  translatePageToEnglish().catch(() => {
    // Keep the original German content visible if the translation service is temporarily unavailable.
  });
}

if (navToggle && nav) {
  const navToggleLabel = navToggle.querySelector(".nav-toggle__label");
  const desktopNav = window.matchMedia("(min-width: 980px)");
  const navParent = nav.parentNode;
  const navNextSibling = nav.nextSibling;
  let lastFocusedElement = null;

  const placeNavigation = () => {
    if (desktopNav.matches) {
      if (nav.parentNode !== navParent) {
        navParent?.insertBefore(nav, navNextSibling);
      }
      return;
    }

    if (nav.parentNode !== document.body) {
      document.body.append(nav);
    }
  };

  const setNavState = (isOpen, { focusFirst = false } = {}) => {
    const isDesktop = desktopNav.matches;
    const shouldOpen = !isDesktop && isOpen;
    navToggle.setAttribute("aria-expanded", String(shouldOpen));
    const isEnglish = selectedLanguage === "en";
    navToggle.setAttribute("aria-label", shouldOpen ? (isEnglish ? "Close navigation" : "Navigation schließen") : isEnglish ? "Open navigation" : "Navigation öffnen");
    navToggle.classList.toggle("is-open", shouldOpen);
    nav.classList.toggle("is-open", shouldOpen);
    nav.setAttribute("aria-hidden", String(!isDesktop && !shouldOpen));

    if (header instanceof HTMLElement) {
      header.classList.toggle("is-nav-open", shouldOpen);
    }

    if (navToggleLabel instanceof HTMLElement) {
      navToggleLabel.textContent = shouldOpen ? (isEnglish ? "Close" : "Schließen") : isEnglish ? "Menu" : "Menü";
    }

    document.body.classList.toggle("nav-open", shouldOpen);

    if (shouldOpen) {
      lastFocusedElement = document.activeElement;
      if (focusFirst) {
        window.requestAnimationFrame(() => nav.querySelector("a")?.focus());
      }
    } else if (isOpen === false && lastFocusedElement instanceof HTMLElement && !isDesktop) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    } else if (isDesktop) {
      lastFocusedElement = null;
    }
  };

  placeNavigation();
  setNavState(false);

  navToggle.addEventListener("click", (event) => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen, { focusFirst: event.detail === 0 });
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setNavState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }

    if (event.key === "Tab" && nav.classList.contains("is-open")) {
      const focusable = [...nav.querySelectorAll("a, button"), navToggle].filter(
        (element) => element instanceof HTMLElement && !element.hasAttribute("disabled")
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node) || !(header instanceof HTMLElement)) return;
    if (!header.contains(event.target) && !nav.contains(event.target)) {
      setNavState(false);
    }
  });

  desktopNav.addEventListener("change", () => {
    setNavState(false);
    placeNavigation();
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("main > section:not(.ff-hero):not(.hero)").forEach((section) => {
  const revealTarget = section.querySelector(":scope > .section-shell, :scope > .hero__inner, :scope > [class*='__inner']");
  if (revealTarget && !revealTarget.hasAttribute("data-reveal")) {
    revealTarget.setAttribute("data-reveal", "section");
  }
});

const revealItems = document.querySelectorAll("[data-reveal]");
revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-order", String(index % 4));
});

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -7%" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroSections = document.querySelectorAll(".ff-hero, .hero, .bbcal-hero, .spot-hero");
requestAnimationFrame(() => {
  heroSections.forEach((heroSection) => heroSection.classList.add("is-hero-ready"));
});

const counterItems = document.querySelectorAll(
  ".ff-hero__facts dt, .hero__stat-value, .landing-stat__value, .stat-card__value, .bbcal-hero__stat strong, .spot-results-count strong, .coaching-success-proof__stats strong"
);

const parseCounter = (element) => {
  const text = element.textContent?.trim() || "";
  const match = text.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const rawNumber = match[0];
  const decimals = rawNumber.includes(",") || rawNumber.includes(".") ? (rawNumber.split(/[.,]/)[1] || "").length : 0;
  return {
    start: match.index || 0,
    end: (match.index || 0) + rawNumber.length,
    value: Number(rawNumber.replace(",", ".")),
    decimals,
    original: text
  };
};

const animateCounter = (element) => {
  if (!(element instanceof HTMLElement) || element.dataset.counted === "true") return;
  const counter = parseCounter(element);
  if (!counter || !Number.isFinite(counter.value)) return;
  element.dataset.counted = "true";
  if (prefersReducedMotion.matches) return;

  const startedAt = performance.now();
  const prefix = counter.original.slice(0, counter.start);
  const suffix = counter.original.slice(counter.end);
  const formatter = new Intl.NumberFormat(document.documentElement.lang === "en" ? "en-US" : "de-DE", {
    minimumFractionDigits: counter.decimals,
    maximumFractionDigits: counter.decimals
  });
  const tick = (now) => {
    const progress = Math.min((now - startedAt) / 1500, 1);
    const current = counter.value * (1 - Math.pow(1 - progress, 4));
    element.textContent = `${prefix}${formatter.format(current)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = counter.original;
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  counterItems.forEach((item) => counterObserver.observe(item));
} else {
  counterItems.forEach((item) => animateCounter(item));
}

const parallaxHeroes = [...document.querySelectorAll(".ff-hero, .bbcal-hero, .spot-hero")];
if (parallaxHeroes.length && !prefersReducedMotion.matches) {
  let parallaxFrame = 0;
  const updateParallax = () => {
    parallaxFrame = 0;
    parallaxHeroes.forEach((heroSection) => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(-18, Math.min(18, rect.top * -0.035));
      heroSection.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });
  };
  const requestParallaxUpdate = () => {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
  };
  updateParallax();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate, { passive: true });
}

const setContactFormStatus = (form, message = "", state = "") => {
  const status = form.querySelector("[data-contact-status]");
  if (!(status instanceof HTMLElement)) return;

  status.textContent = message;
  status.dataset.state = state;
};

const buildContactSubject = (form) => {
  const topicField = form.querySelector('[name="topic"]');
  const nameField = form.querySelector('[name="name"]');
  const companyField = form.querySelector('[name="company"]');
  const topic = topicField instanceof HTMLSelectElement ? topicField.value.trim() : "";
  const name = nameField instanceof HTMLInputElement ? nameField.value.trim() : "";
  const company = companyField instanceof HTMLInputElement ? companyField.value.trim() : "";
  const parts = ["Camp Dörfl Anfrage"];

  if (topic) parts.push(topic);
  if (company) {
    parts.push(company);
  } else if (name) {
    parts.push(name);
  }

  return parts.join(" · ");
};

document.querySelectorAll("[data-contact-simple-form]").forEach((form) => {
  const topicField = form.querySelector("[data-contact-topic-select]");
  const subjectField = form.querySelector('[name="_subject"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const fallbackEmail = "dominik@campdoerfl.de";
  const fallbackEndpoint = `https://formsubmit.co/ajax/${fallbackEmail}`;
  const topicParam = new URLSearchParams(window.location.search).get("topic");

  if (topicField instanceof HTMLSelectElement && topicParam) {
    const requestedTopicValue = resolveContactTopicValue(topicParam);
    const requestedTopic = Array.from(topicField.options).find((option) => option.value === requestedTopicValue);

    if (requestedTopic) {
      topicField.value = requestedTopic.value;
    }
  }

  const defaultTopicValue = topicField instanceof HTMLSelectElement ? topicField.value : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('[name="_honey"]');
    if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) return;

    if (subjectField instanceof HTMLInputElement) {
      subjectField.value = buildContactSubject(form);
    }

    const formData = new FormData(form);
    const endpoint = form.getAttribute("data-contact-endpoint") || fallbackEndpoint;

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    setContactFormStatus(form, "Deine Nachricht wird gesendet.", "info");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Senden fehlgeschlagen");
      }

      form.reset();

      if (topicField instanceof HTMLSelectElement && defaultTopicValue) {
        topicField.value = defaultTopicValue;
      }

      if (subjectField instanceof HTMLInputElement) {
        subjectField.value = "Camp Dörfl Kontaktanfrage";
      }

      setContactFormStatus(form, "Deine Nachricht wurde erfolgreich gesendet.", "success");
    } catch (error) {
      setContactFormStatus(
        form,
        `Das Senden hat gerade nicht funktioniert. Schreib alternativ direkt an ${fallbackEmail}.`,
        "warn"
      );
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
});

const CONSENT_STORAGE_KEY = "campdoerfl-consent";
const CONSENT_VERSION = "2026-06-17";

const consentRoot = document.querySelector("[data-consent-root]");
const consentBanner = document.querySelector("[data-consent-banner]");
const consentBackdrop = document.querySelector("[data-consent-backdrop]");
const consentModal = document.querySelector("[data-consent-modal]");
const externalMediaField = document.querySelector('[data-consent-field="externalMedia"]');

const canUseLocalStorage = () => {
  try {
    localStorage.setItem("__campdoerfl_test__", "1");
    localStorage.removeItem("__campdoerfl_test__");
    return true;
  } catch {
    return false;
  }
};

const createConsentState = (raw = {}) => ({
  essential: true,
  externalMedia: Boolean(raw.externalMedia),
  version: CONSENT_VERSION,
  savedAt: raw.savedAt || new Date().toISOString()
});

const readStoredConsent = () => {
  if (!canUseLocalStorage()) return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;

    return createConsentState(parsed);
  } catch {
    return null;
  }
};

const writeStoredConsent = (consent) => {
  if (!canUseLocalStorage()) return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Intentionally ignored so the site remains usable even when storage is blocked.
  }
};

let storedConsent = readStoredConsent();
let pendingVideoEmbed = null;
const videoObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!(entry.target instanceof HTMLElement) || !entry.isIntersecting || !getConsentState().externalMedia) return;
            activateVideoEmbed(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.24, rootMargin: "240px 0px" }
      )
    : null;

const getConsentState = () => storedConsent || createConsentState();
const hasStoredConsent = () => storedConsent !== null;

const showConsentRoot = () => {
  if (consentRoot instanceof HTMLElement) consentRoot.hidden = false;
};

const hideConsentRootIfInactive = () => {
  if (!(consentRoot instanceof HTMLElement)) return;
  const bannerHidden = !(consentBanner instanceof HTMLElement) || consentBanner.hidden;
  const modalHidden = !(consentModal instanceof HTMLElement) || consentModal.hidden;

  if (bannerHidden && modalHidden) {
    consentRoot.hidden = true;
  }
};

const showConsentBanner = () => {
  if (!(consentBanner instanceof HTMLElement)) return;

  showConsentRoot();
  consentBanner.hidden = false;

  if (consentBackdrop instanceof HTMLElement) consentBackdrop.hidden = true;
  if (consentModal instanceof HTMLElement) consentModal.hidden = true;

  document.body.classList.remove("consent-modal-open");
};

const closeConsentModal = () => {
  if (consentModal instanceof HTMLElement) consentModal.hidden = true;
  if (consentBackdrop instanceof HTMLElement) consentBackdrop.hidden = true;

  document.body.classList.remove("consent-modal-open");

  if (hasStoredConsent()) {
    hideConsentRootIfInactive();
  } else if (consentBanner instanceof HTMLElement) {
    consentBanner.hidden = false;
  }
};

const openConsentModal = () => {
  showConsentRoot();

  if (consentBanner instanceof HTMLElement) consentBanner.hidden = true;
  if (consentBackdrop instanceof HTMLElement) consentBackdrop.hidden = false;
  if (consentModal instanceof HTMLElement) consentModal.hidden = false;

  if (externalMediaField instanceof HTMLInputElement) {
    externalMediaField.checked = getConsentState().externalMedia;
  }

  document.body.classList.add("consent-modal-open");
};

const dismissConsentModal = () => {
  pendingVideoEmbed = null;
  closeConsentModal();
};

const activateVideoEmbed = (embed) => {
  if (!(embed instanceof HTMLElement) || embed.dataset.videoLoaded === "true") return;

  const src = embed.getAttribute("data-video-src");
  const title = embed.getAttribute("data-video-title") || "YouTube Video";
  if (!src) return;

  const url = new URL(src, window.location.href);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");

  const iframe = document.createElement("iframe");
  iframe.src = url.toString();
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  embed.dataset.videoLoaded = "true";
  embed.replaceChildren(iframe);
};

const restoreVideoEmbed = (embed) => {
  if (!(embed instanceof HTMLElement)) return;

  const placeholderHtml = embed.dataset.placeholderHtml;
  if (!placeholderHtml) return;

  if (videoObserver) {
    videoObserver.unobserve(embed);
  }

  embed.dataset.videoLoaded = "false";
  embed.innerHTML = decodeURIComponent(placeholderHtml);
};

const queueVideoEmbed = (embed) => {
  if (!(embed instanceof HTMLElement) || embed.dataset.videoLoaded === "true" || !getConsentState().externalMedia) return;

  if (videoObserver) {
    videoObserver.observe(embed);
    return;
  }

  activateVideoEmbed(embed);
};

const syncVideoEmbeds = () => {
  const externalMediaAllowed = getConsentState().externalMedia;

  document.querySelectorAll("[data-video-embed]").forEach((embed) => {
    if (!(embed instanceof HTMLElement)) return;

    if (!embed.dataset.placeholderHtml) {
      embed.dataset.placeholderHtml = encodeURIComponent(embed.innerHTML);
    }

    if (!externalMediaAllowed && embed.dataset.videoLoaded === "true") {
      restoreVideoEmbed(embed);
    }

    embed.dataset.externalMedia = externalMediaAllowed ? "granted" : "denied";

    const hint = embed.querySelector(".premium-video-launch__hint");
    if (hint instanceof HTMLElement) {
      hint.textContent = externalMediaAllowed
        ? "Startet automatisch stumm. Ton im Player aktivieren."
        : "Bitte zuerst externe Medien freigeben.";
    }

    if (externalMediaAllowed) {
      queueVideoEmbed(embed);
    } else if (videoObserver) {
      videoObserver.unobserve(embed);
    }
  });
};

const applyConsentState = () => {
  document.documentElement.dataset.externalMediaConsent = getConsentState().externalMedia ? "granted" : "denied";

  if (externalMediaField instanceof HTMLInputElement) {
    externalMediaField.checked = getConsentState().externalMedia;
  }

  syncVideoEmbeds();
};

const saveConsent = ({ externalMedia }) => {
  storedConsent = createConsentState({ externalMedia });
  writeStoredConsent(storedConsent);
  applyConsentState();

  if (consentBanner instanceof HTMLElement) consentBanner.hidden = true;
  closeConsentModal();

  if (pendingVideoEmbed && storedConsent.externalMedia) {
    activateVideoEmbed(pendingVideoEmbed);
  }

  pendingVideoEmbed = null;
};

const handleConsentAction = (action) => {
  if (action === "accept-all") {
    saveConsent({ externalMedia: true });
    return;
  }

  if (action === "save-selection") {
    saveConsent({ externalMedia: externalMediaField instanceof HTMLInputElement ? externalMediaField.checked : false });
    return;
  }

  saveConsent({ externalMedia: false });
};

const handleVideoTrigger = (trigger) => {
  if (!(trigger instanceof HTMLAnchorElement)) return;

  const embed = trigger.closest("[data-video-embed]");
  if (!(embed instanceof HTMLElement)) return;

  if (!getConsentState().externalMedia) {
    pendingVideoEmbed = embed;
    openConsentModal();
    return;
  }

  activateVideoEmbed(embed);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && consentModal instanceof HTMLElement && !consentModal.hidden) {
    dismissConsentModal();
  }
});

document.querySelectorAll("[data-open-consent], [data-consent-open-settings]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openConsentModal();
  });
});

document.querySelectorAll("[data-consent-action]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    handleConsentAction(trigger.getAttribute("data-consent-action"));
  });
});

document.querySelectorAll("[data-consent-close], [data-consent-backdrop]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    dismissConsentModal();
  });
});

document.querySelectorAll(".premium-video-launch").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    handleVideoTrigger(trigger);
  });
});

applyConsentState();

if (!hasStoredConsent()) {
  showConsentBanner();
}

const initTriathlonCalendar = () => {
  const root = document.querySelector("[data-tri-calendar]");
  if (!(root instanceof HTMLElement)) return;

  const form = root.querySelector("[data-tri-filter]");
  const postcodeInput = root.querySelector("[data-tri-postcode]");
  const radiusSelect = root.querySelector("[data-tri-radius]");
  const countrySelect = root.querySelector("[data-tri-country]");
  const resetButton = root.querySelector("[data-tri-reset]");
  const countOutput = root.querySelector("[data-tri-result-count]");
  const labelOutput = root.querySelector("[data-tri-result-label]");
  const statusOutput = root.querySelector("[data-tri-status]");
  const emptyOutput = root.querySelector("[data-tri-empty]");
  const events = [...root.querySelectorAll("[data-tri-event]")];
  const monthGroups = [...root.querySelectorAll("[data-tri-month]")];
  const pastArchive = root.querySelector("[data-calendar-past-archive]");
  const submitButton = form?.querySelector("button[type='submit']");

  if (!(form instanceof HTMLFormElement) || !(postcodeInput instanceof HTMLInputElement) ||
      !(radiusSelect instanceof HTMLSelectElement) || !(countrySelect instanceof HTMLSelectElement)) return;

  const countryNames = {
    DE: "Deutschland", AT: "Österreich", CH: "Schweiz", ES: "Spanien", IT: "Italien",
    LU: "Luxemburg", BE: "Belgien", NL: "Niederlande", FR: "Frankreich"
  };

  const distanceInKilometres = (latA, lonA, latB, lonB) => {
    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371;
    const latitudeDifference = toRadians(latB - latA);
    const longitudeDifference = toRadians(lonB - lonA);
    const a = Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(longitudeDifference / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const updateMonthGroups = () => {
    monthGroups.forEach((group) => {
      const visibleEvents = [...group.querySelectorAll("[data-tri-event]")].filter((event) => !event.hidden);
      group.hidden = visibleEvents.length === 0;
      const monthCount = group.querySelector("[data-tri-month-count]");
      if (monthCount instanceof HTMLElement) monthCount.textContent = `${visibleEvents.length} ${visibleEvents.length === 1 ? "Termin" : "Termine"}`;
    });
    if (pastArchive instanceof HTMLDetailsElement) {
      const visibleArchiveEvents = [...pastArchive.querySelectorAll("[data-tri-event]")].filter((event) => !event.hidden);
      pastArchive.hidden = visibleArchiveEvents.length === 0;
    }
  };

  const setResults = ({ origin = null, radius = null, country = "", status = "" } = {}) => {
    let visibleCount = 0;
    events.forEach((event) => {
      const eventCountry = event.getAttribute("data-country") || "";
      let visible = !country || eventCountry === country;
      const distanceOutput = event.querySelector("[data-event-distance]");

      if (origin && visible) {
        const latitude = Number(event.getAttribute("data-lat"));
        const longitude = Number(event.getAttribute("data-lon"));
        const distance = distanceInKilometres(origin.latitude, origin.longitude, latitude, longitude);
        visible = Number.isFinite(distance) && distance <= radius;
        if (distanceOutput instanceof HTMLElement) {
          distanceOutput.textContent = `${Math.round(distance)} km entfernt`;
          distanceOutput.hidden = !visible;
        }
      } else if (distanceOutput instanceof HTMLElement) {
        distanceOutput.hidden = true;
      }

      event.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    updateMonthGroups();
    if (countOutput instanceof HTMLElement) countOutput.textContent = String(visibleCount);
    if (labelOutput instanceof HTMLElement) labelOutput.textContent = visibleCount === 1 ? " passender Termin" : " passende Termine";
    if (statusOutput instanceof HTMLElement) statusOutput.textContent = status || "Alle Länder und Entfernungen werden angezeigt.";
    if (emptyOutput instanceof HTMLElement) emptyOutput.hidden = visibleCount !== 0;
  };

  const geocodePostcode = async (postcode, country) => {
    const assumedCountry = country || "DE";
    const query = `${postcode}, ${countryNames[assumedCountry]}`;
    const params = new URLSearchParams({ q: query, lang: "de", limit: "5" });
    const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    const countryMatch = data.features?.find((feature) =>
      feature?.properties?.countrycode?.toUpperCase() === assumedCountry
    ) || data.features?.[0];
    const coordinates = countryMatch?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) throw new Error("Postcode not found");
    return { longitude: Number(coordinates[0]), latitude: Number(coordinates[1]), country: assumedCountry };
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const postcode = postcodeInput.value.trim();
    const country = countrySelect.value;
    const radius = Number(radiusSelect.value);

    if (!postcode) {
      const countryLabel = country ? countryNames[country] : "allen Ländern";
      setResults({ country, status: `Kalender für ${countryLabel}. Für die Umgebungssuche zusätzlich eine Postleitzahl eingeben.` });
      return;
    }

    if (postcode.length < 3) {
      postcodeInput.setCustomValidity("Bitte eine vollständige Postleitzahl eingeben.");
      postcodeInput.reportValidity();
      postcodeInput.setCustomValidity("");
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.querySelector("span")?.replaceChildren("Suche läuft …");
    }
    if (statusOutput instanceof HTMLElement) statusOutput.textContent = "Postleitzahl wird lokalisiert …";

    try {
      const origin = await geocodePostcode(postcode, country);
      const effectiveCountry = country || origin.country;
      if (!country) countrySelect.value = effectiveCountry;
      setResults({
        origin,
        radius,
        country: effectiveCountry,
        status: `Rennen im Umkreis von ${radius} km um ${postcode} in ${countryNames[effectiveCountry]}. Entfernungen sind Luftlinie.`
      });
    } catch {
      setResults({ country, status: "Die Postleitzahl konnte gerade nicht gefunden werden. Bitte Eingabe prüfen oder nur nach Land filtern." });
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.querySelector("span")?.replaceChildren("Passende Rennen finden");
      }
    }
  });

  resetButton?.addEventListener("click", () => {
    postcodeInput.value = "";
    radiusSelect.value = "50";
    countrySelect.value = "";
    setResults();
  });
};

initTriathlonCalendar();

const initRunningCalendar = () => {
  const root = document.querySelector("[data-run-calendar]");
  if (!(root instanceof HTMLElement)) return;

  const form = root.querySelector("[data-run-filter]");
  const postcodeInput = root.querySelector("[data-run-postcode]");
  const radiusSelect = root.querySelector("[data-run-radius]");
  const categorySelect = root.querySelector("[data-run-category]");
  const queryInput = root.querySelector("[data-run-query]");
  const resetButton = root.querySelector("[data-run-reset]");
  const countOutput = root.querySelector("[data-run-result-count]");
  const labelOutput = root.querySelector("[data-run-result-label]");
  const statusOutput = root.querySelector("[data-run-status]");
  const emptyOutput = root.querySelector("[data-run-empty]");
  const events = [...root.querySelectorAll("[data-run-event]")];
  const categoryGroups = [...root.querySelectorAll("[data-run-group]")];
  const pastArchive = root.querySelector("[data-calendar-past-archive]");
  const submitButton = form?.querySelector("button[type='submit']");

  if (!(form instanceof HTMLFormElement) || !(postcodeInput instanceof HTMLInputElement) ||
      !(radiusSelect instanceof HTMLSelectElement) || !(categorySelect instanceof HTMLSelectElement) ||
      !(queryInput instanceof HTMLInputElement)) return;

  const categoryNames = {
    half: "Halbmarathon", marathon: "Marathon", mammut: "Mammutmarsch",
    mega: "Megamarsch", ultra: "Ultra Running"
  };

  const normaliseSearch = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de-DE")
    .replace(/ß/g, "ss")
    .trim();

  const distanceInKilometres = (latA, lonA, latB, lonB) => {
    const toRadians = (value) => (value * Math.PI) / 180;
    const latitudeDifference = toRadians(latB - latA);
    const longitudeDifference = toRadians(lonB - lonA);
    const a = Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(longitudeDifference / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const updateGroups = () => {
    categoryGroups.forEach((group) => {
      const visibleEvents = [...group.querySelectorAll("[data-run-event]")].filter((event) => !event.hidden);
      group.hidden = visibleEvents.length === 0;
      const groupCount = group.querySelector("[data-run-group-count]");
      if (groupCount instanceof HTMLElement) groupCount.textContent = `${visibleEvents.length} ${visibleEvents.length === 1 ? "Termin" : "Termine"}`;
    });
    if (pastArchive instanceof HTMLDetailsElement) {
      const visibleArchiveEvents = [...pastArchive.querySelectorAll("[data-run-event]")].filter((event) => !event.hidden);
      pastArchive.hidden = visibleArchiveEvents.length === 0;
    }
  };

  const setResults = ({ origin = null, radius = null, category = "", query = "", status = "" } = {}) => {
    const normalisedQuery = normaliseSearch(query);
    let visibleCount = 0;
    events.forEach((event) => {
      const eventCategory = event.getAttribute("data-category") || "";
      const searchable = normaliseSearch(event.getAttribute("data-search") || "");
      let visible = (!category || eventCategory === category) && (!normalisedQuery || searchable.includes(normalisedQuery));
      const distanceOutput = event.querySelector("[data-run-distance]");

      if (origin && visible) {
        const latitude = Number(event.getAttribute("data-lat"));
        const longitude = Number(event.getAttribute("data-lon"));
        const distance = distanceInKilometres(origin.latitude, origin.longitude, latitude, longitude);
        visible = Number.isFinite(distance) && distance <= radius;
        if (distanceOutput instanceof HTMLElement) {
          distanceOutput.textContent = `${Math.round(distance)} km entfernt`;
          distanceOutput.hidden = !visible;
        }
      } else if (distanceOutput instanceof HTMLElement) {
        distanceOutput.hidden = true;
      }

      event.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    updateGroups();
    if (countOutput instanceof HTMLElement) countOutput.textContent = String(visibleCount);
    if (labelOutput instanceof HTMLElement) labelOutput.textContent = visibleCount === 1 ? " passender Termin" : " passende Termine";
    if (statusOutput instanceof HTMLElement) statusOutput.textContent = status || "Alle Kategorien und Entfernungen werden angezeigt.";
    if (emptyOutput instanceof HTMLElement) emptyOutput.hidden = visibleCount !== 0;
  };

  const geocodePostcode = async (postcode) => {
    const params = new URLSearchParams({ q: `${postcode}, Deutschland`, lang: "de", limit: "5" });
    const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    const match = data.features?.find((feature) => feature?.properties?.countrycode?.toUpperCase() === "DE") || data.features?.[0];
    const coordinates = match?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) throw new Error("Postcode not found");
    return { longitude: Number(coordinates[0]), latitude: Number(coordinates[1]) };
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const postcode = postcodeInput.value.trim();
    const radius = Number(radiusSelect.value);
    const category = categorySelect.value;
    const query = queryInput.value.trim();
    const filterDescription = [category ? categoryNames[category] : "alle Laufwelten", query ? `Suche „${query}“` : ""].filter(Boolean).join(" · ");

    if (!postcode) {
      setResults({ category, query, status: `${filterDescription}. Für die Umgebungssuche zusätzlich eine Postleitzahl eingeben.` });
      return;
    }

    if (!/^\d{5}$/.test(postcode)) {
      postcodeInput.setCustomValidity("Bitte eine gültige fünfstellige deutsche Postleitzahl eingeben.");
      postcodeInput.reportValidity();
      postcodeInput.setCustomValidity("");
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.querySelector("span")?.replaceChildren("Suche läuft …");
    }
    if (statusOutput instanceof HTMLElement) statusOutput.textContent = "Postleitzahl wird lokalisiert …";

    try {
      const origin = await geocodePostcode(postcode);
      setResults({
        origin, radius, category, query,
        status: `${filterDescription} im Umkreis von ${radius} km um ${postcode}. Entfernungen sind Luftlinie.`
      });
    } catch {
      setResults({ category, query, status: "Die Postleitzahl konnte gerade nicht gefunden werden. Bitte Eingabe prüfen oder ohne Umkreis filtern." });
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.querySelector("span")?.replaceChildren("Passende Läufe finden");
      }
    }
  });

  resetButton?.addEventListener("click", () => {
    postcodeInput.value = "";
    radiusSelect.value = "50";
    categorySelect.value = "";
    queryInput.value = "";
    setResults();
  });
};

initRunningCalendar();

const initSportSpotFinder = () => {
  const form = document.querySelector("[data-spot-search]");
  const configElement = document.querySelector("#sportspot-config");
  if (!(form instanceof HTMLFormElement) || !(configElement instanceof HTMLScriptElement)) return;

  const placeInput = form.elements.namedItem("place");
  const radiusSelect = form.elements.namedItem("radius");
  const sportSelect = form.elements.namedItem("sport");
  const submitButton = form.querySelector("button[type='submit']");
  const categoryButtons = [...document.querySelectorAll("[data-spot-category]")];
  const additionalCategoryButtons = [...document.querySelectorAll("[data-spot-category-additional]")];
  const categoryToggle = document.querySelector("[data-spot-category-toggle]");
  const resultsList = document.querySelector("[data-spot-results]");
  const resultActions = document.querySelector("[data-spot-results-actions]");
  const loadMoreButton = document.querySelector("[data-spot-load-more]");
  const countOutput = document.querySelector("[data-spot-count]");
  const countLabel = document.querySelector("[data-spot-count-label]");
  const status = document.querySelector("[data-spot-status]");
  const map = document.querySelector("[data-spot-map]");
  const mapTiles = document.querySelector("[data-spot-map-tiles]");
  const mapPins = document.querySelector("[data-spot-map-pins]");
  const mapEmpty = document.querySelector("[data-spot-map-empty]");
  const mapLabel = document.querySelector("[data-spot-map-label]");
  const attribution = document.querySelector("[data-spot-attribution]");
  let categories = [];

  try {
    categories = JSON.parse(configElement.textContent || "{}").categories || [];
  } catch {
    return;
  }

  let selectedCategory = "";
  let visibleResultCount = 6;
  let currentResults = [];
  let currentOrigin = null;
  let currentRadius = 50;

  const categoryById = (id) => categories.find((category) => category.id === id) || null;
  const setAdditionalCategoriesOpen = (open) => {
    additionalCategoryButtons.forEach((button) => { button.hidden = !open; });
    if (!(categoryToggle instanceof HTMLButtonElement)) return;
    categoryToggle.setAttribute("aria-expanded", String(open));
    const label = categoryToggle.querySelector("span");
    if (label) label.textContent = open
      ? "Weniger Sportarten anzeigen"
      : `Weitere ${additionalCategoryButtons.length} Sportarten anzeigen`;
  };
  const setSelectedCategory = (id) => {
    selectedCategory = categoryById(id)?.id || "";
    if (sportSelect instanceof HTMLSelectElement) sportSelect.value = selectedCategory;
    categoryButtons.forEach((button) => {
      const active = button.dataset.spotCategory === selectedCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const selectedButton = categoryButtons.find((button) => button.dataset.spotCategory === selectedCategory);
    if (selectedButton?.hidden) setAdditionalCategoriesOpen(true);
  };

  const setStatus = (title, message, marker = "01") => {
    if (!(status instanceof HTMLElement)) return;
    const mark = status.querySelector(".spot-results-status__mark");
    const heading = status.querySelector("strong");
    const copy = status.querySelector("p");
    if (mark) mark.textContent = marker;
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = message;
  };

  const haversineDistance = (origin, destination) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const latitudeDelta = toRadians(destination.latitude - origin.latitude);
    const longitudeDelta = toRadians(destination.longitude - origin.longitude);
    const a = Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(toRadians(origin.latitude)) * Math.cos(toRadians(destination.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const geocodePlace = async (place) => {
    const params = new URLSearchParams({ q: `${place}, Deutschland`, lang: "de", limit: "8" });
    const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Ortssuche nicht erreichbar");
    const data = await response.json();
    const match = data.features?.find((feature) => feature?.properties?.countrycode?.toUpperCase() === "DE") || data.features?.[0];
    const coordinates = match?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) throw new Error("Ort nicht gefunden");
    return {
      longitude: Number(coordinates[0]),
      latitude: Number(coordinates[1]),
      label: match.properties?.name || match.properties?.city || place,
      region: match.properties?.state || "Deutschland"
    };
  };

  const fetchSportSpots = async (origin, radius, category) => {
    const radiusMeters = Math.round(radius * 1000);
    const clauses = category.tags.flatMap((tag) => ["node", "way", "relation"].map((type) =>
      `${type}(around:${radiusMeters},${origin.latitude},${origin.longitude})${tag};`
    )).join("");
    const query = `[out:json][timeout:25];(${clauses});out center 120;`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ data: query })
    });
    if (!response.ok) throw new Error("Sportstätten-Suche nicht erreichbar");
    const data = await response.json();
    const seen = new Set();
    return (data.elements || []).map((element) => {
      const latitude = Number(element.lat ?? element.center?.lat);
      const longitude = Number(element.lon ?? element.center?.lon);
      const name = element.tags?.name || element.tags?.operator || `${category.label} Sport Spot`;
      const key = `${name}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || seen.has(key)) return null;
      seen.add(key);
      const locality = element.tags?.["addr:city"] || element.tags?.["addr:place"] || origin.label;
      const street = [element.tags?.["addr:street"], element.tags?.["addr:housenumber"]].filter(Boolean).join(" ");
      return {
        id: `${element.type}-${element.id}`,
        name,
        latitude,
        longitude,
        locality,
        address: street || locality,
        category: category.label,
        distance: haversineDistance(origin, { latitude, longitude }),
        osmUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`
      };
    }).filter(Boolean).filter((spot) => spot.distance <= radius).sort((a, b) => a.distance - b.distance);
  };

  const tileCoordinate = (latitude, longitude, zoom) => {
    const scale = 2 ** zoom;
    const latitudeRadians = latitude * Math.PI / 180;
    return {
      x: ((longitude + 180) / 360) * scale,
      y: ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * scale
    };
  };

  const renderMap = (origin, radius, results) => {
    if (!(mapTiles instanceof HTMLElement) || !(mapPins instanceof HTMLElement)) return;
    const zoom = radius <= 25 ? 10 : radius <= 50 ? 9 : radius <= 100 ? 8 : 7;
    const center = tileCoordinate(origin.latitude, origin.longitude, zoom);
    const startX = Math.floor(center.x) - 1;
    const startY = Math.floor(center.y) - 1;
    mapTiles.replaceChildren();
    mapPins.replaceChildren();

    for (let yOffset = 0; yOffset < 3; yOffset += 1) {
      for (let xOffset = 0; xOffset < 3; xOffset += 1) {
        const tile = document.createElement("img");
        tile.className = "spot-map__tile";
        tile.alt = "";
        tile.loading = "lazy";
        tile.src = `https://tile.openstreetmap.org/${zoom}/${startX + xOffset}/${startY + yOffset}.png`;
        mapTiles.append(tile);
      }
    }

    results.slice(0, 60).forEach((spot, index) => {
      const coordinate = tileCoordinate(spot.latitude, spot.longitude, zoom);
      const left = ((coordinate.x - startX) / 3) * 100;
      const top = ((coordinate.y - startY) / 3) * 100;
      if (left < -3 || left > 103 || top < -3 || top > 103) return;
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "spot-map-pin";
      pin.style.left = `${left}%`;
      pin.style.top = `${top}%`;
      pin.dataset.spotId = spot.id;
      pin.setAttribute("aria-label", `${spot.name}, ${spot.distance.toFixed(1)} Kilometer entfernt`);
      const pinNumber = document.createElement("span");
      pinNumber.textContent = String(index + 1).padStart(2, "0");
      pin.append(pinNumber);
      mapPins.append(pin);
    });

    if (mapEmpty instanceof HTMLElement) mapEmpty.hidden = true;
    if (attribution instanceof HTMLElement) attribution.hidden = false;
    if (mapLabel instanceof HTMLElement) mapLabel.textContent = `${origin.label} · ${radius} km`;
  };

  const activateSpot = (spotId, scroll = false) => {
    document.querySelectorAll("[data-spot-id]").forEach((element) => element.classList.toggle("is-active", element.dataset.spotId === spotId));
    if (scroll) document.querySelector(`.spot-result[data-spot-id="${CSS.escape(spotId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const renderResults = () => {
    if (!(resultsList instanceof HTMLElement)) return;
    resultsList.replaceChildren();
    currentResults.slice(0, visibleResultCount).forEach((spot, index) => {
      const article = document.createElement("article");
      article.className = "spot-result";
      article.dataset.spotId = spot.id;

      const number = document.createElement("span");
      number.className = "spot-result__number";
      number.textContent = String(index + 1).padStart(2, "0");

      const copy = document.createElement("div");
      copy.className = "spot-result__copy";
      const category = document.createElement("small");
      category.textContent = spot.category;
      const title = document.createElement("strong");
      title.textContent = spot.name;
      const address = document.createElement("p");
      address.textContent = spot.address;
      copy.append(category, title, address);

      const distance = document.createElement("span");
      distance.className = "spot-result__distance";
      distance.textContent = spot.distance < 1 ? `${Math.round(spot.distance * 1000)} m` : `${spot.distance.toFixed(1)} km`;

      const link = document.createElement("a");
      link.className = "spot-result__link";
      link.href = spot.osmUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `${spot.name} auf OpenStreetMap öffnen`);
      article.addEventListener("mouseenter", () => activateSpot(spot.id));
      article.append(number, copy, distance, link);
      resultsList.append(article);
    });
    if (resultActions instanceof HTMLElement) resultActions.hidden = currentResults.length === 0;
    if (loadMoreButton instanceof HTMLButtonElement) loadMoreButton.hidden = visibleResultCount >= currentResults.length;
  };

  categoryButtons.forEach((button) => button.addEventListener("click", () => {
    setSelectedCategory(button.dataset.spotCategory);
    if (placeInput instanceof HTMLInputElement && placeInput.value.trim()) form.requestSubmit();
  }));

  if (sportSelect instanceof HTMLSelectElement) {
    sportSelect.addEventListener("change", () => setSelectedCategory(sportSelect.value));
  }

  categoryToggle?.addEventListener("click", () => {
    const willOpen = categoryToggle.getAttribute("aria-expanded") !== "true";
    setAdditionalCategoriesOpen(willOpen);
  });

  document.querySelectorAll("[data-spot-shortcut]").forEach((button) => button.addEventListener("click", () => {
    setSelectedCategory(button.dataset.spotShortcut);
    if (placeInput instanceof HTMLInputElement && placeInput.value.trim()) form.requestSubmit();
    else {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      placeInput?.focus({ preventScroll: true });
    }
  }));

  mapPins?.addEventListener("click", (event) => {
    const pin = event.target.closest("[data-spot-id]");
    if (pin) activateSpot(pin.dataset.spotId, true);
  });

  loadMoreButton?.addEventListener("click", () => {
    visibleResultCount += 6;
    renderResults();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!(placeInput instanceof HTMLInputElement) || !(radiusSelect instanceof HTMLSelectElement) || !(sportSelect instanceof HTMLSelectElement)) return;
    const place = placeInput.value.trim();
    if (place.length < 2) {
      placeInput.setCustomValidity("Bitte eine Postleitzahl oder einen Ort eingeben.");
      placeInput.reportValidity();
      placeInput.setCustomValidity("");
      return;
    }

    const category = categoryById(selectedCategory);
    if (!category) {
      sportSelect.setCustomValidity("Bitte zuerst eine Sportart auswählen.");
      sportSelect.reportValidity();
      sportSelect.setCustomValidity("");
      return;
    }
    currentRadius = Number(radiusSelect.value) || 50;
    visibleResultCount = 6;
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
    const submitLabel = submitButton?.querySelector("span");
    if (submitLabel) submitLabel.textContent = "Suche läuft …";
    setStatus("Wir suchen passende Sport Spots", `${category.label} im Umkreis von ${currentRadius} km werden geladen.`, "…");

    try {
      currentOrigin = await geocodePlace(place);
      currentResults = await fetchSportSpots(currentOrigin, currentRadius, category);
      renderMap(currentOrigin, currentRadius, currentResults);
      renderResults();
      if (countOutput) countOutput.textContent = String(currentResults.length);
      if (countLabel) countLabel.textContent = currentResults.length === 1 ? "Sport Spot" : "Sport Spots";
      if (currentResults.length) {
        setStatus(`${currentResults.length} passende ${category.label} Spots`, `Sortiert nach Entfernung rund um ${currentOrigin.label}. Wähle einen Eintrag für die Detailansicht auf der Karte.`, "✓");
      } else {
        setStatus("Keine passenden Spots gefunden", `Vergrößere den Umkreis oder wähle eine andere Sportart für ${currentOrigin.label}.`, "0");
      }
      document.querySelector("#ergebnisse")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      currentResults = [];
      renderResults();
      if (countOutput) countOutput.textContent = "0";
      setStatus("Die Suche ist gerade nicht erreichbar", "Bitte prüfe den Ort und versuche es gleich noch einmal. Die Kartendaten werden live geladen.", "!");
    } finally {
      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = "Sport Spots finden";
    }
  });

  setSelectedCategory(selectedCategory);
};

initSportSpotFinder();

const initBodybuildingWeeksOut = () => {
  const countdowns = document.querySelectorAll("[data-weeks-out][data-event-date]");
  if (!countdowns.length) return;

  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  countdowns.forEach((countdown) => {
    const [year, month, day] = countdown.dataset.eventDate.split("-").map(Number);
    if (!year || !month || !day) return;
    const eventDate = Date.UTC(year, month - 1, day);
    const daysRemaining = Math.round((eventDate - today) / dayInMilliseconds);
    const value = countdown.querySelector("strong");
    const label = countdown.querySelector("small");
    countdown.classList.remove("is-show-day", "is-show-over");

    if (daysRemaining < 0) {
      if (value) value.textContent = "SHOW";
      if (label) label.textContent = "OVER";
      countdown.classList.add("is-show-over");
      countdown.setAttribute("aria-label", "Wettkampf bereits ausgetragen");
      return;
    }

    if (daysRemaining === 0) {
      if (value) value.textContent = "SHOW";
      if (label) label.textContent = "DAY";
      countdown.classList.add("is-show-day");
      countdown.setAttribute("aria-label", "Wettkampftag ist heute");
      return;
    }

    const weeksRemaining = Math.ceil(daysRemaining / 7);
    if (value) value.textContent = String(weeksRemaining);
    if (label) label.textContent = weeksRemaining === 1 ? "WEEK OUT" : "WEEKS OUT";
    countdown.setAttribute("aria-label", `${weeksRemaining} ${weeksRemaining === 1 ? "Woche" : "Wochen"} bis zum Wettkampf, noch ${daysRemaining} ${daysRemaining === 1 ? "Tag" : "Tage"}`);
    countdown.title = `Noch ${daysRemaining} ${daysRemaining === 1 ? "Tag" : "Tage"} bis zur Show`;
  });
};

initBodybuildingWeeksOut();

const initCoachSuccessYears = () => {
  const yearLinks = document.querySelectorAll('.coach-success__years a[href^="#coach-erfolge-"]');
  if (!yearLinks.length) return;

  const openYear = (target, { scroll = true } = {}) => {
    if (!(target instanceof HTMLDetailsElement)) return;
    target.open = true;
    if (scroll) {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  };

  yearLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!(target instanceof HTMLDetailsElement)) return;
      event.preventDefault();
      openYear(target);
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  if (window.location.hash.startsWith("#coach-erfolge-")) {
    openYear(document.querySelector(window.location.hash), { scroll: false });
  }
};

initCoachSuccessYears();
