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

const autoRevealSelectors = [
  ".pricing-card",
  ".start-card",
  ".corporate-reference-card",
  ".event-reference-card",
  ".partner-brand-card",
  ".basis-partner-card",
  ".spot-nearby-card",
  ".coach-success__totals > div"
];

document
  .querySelectorAll(autoRevealSelectors.map((selector) => `${selector}:not([data-reveal])`).join(", "))
  .forEach((item) => item.setAttribute("data-reveal", "card"));

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

  revealItems.forEach((item) => {
    // Very tall directory containers can never reach the observer's 10% threshold.
    // Keep their content visible and let their smaller child elements animate normally.
    if (item.getBoundingClientRect().height > window.innerHeight * 8) {
      item.classList.add("is-visible");
      return;
    }
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroSections = document.querySelectorAll(".ff-hero, .hero, .bbcal-hero, .spot-hero");
requestAnimationFrame(() => {
  heroSections.forEach((heroSection) => heroSection.classList.add("is-hero-ready"));
});

const counterItems = document.querySelectorAll(
  ".ff-hero__facts dt, .ff-hero__facts dd, .hero__stat-value, .landing-stat__value, .stat-card__value, .offer40-price__amount, .bbcal-hero__stat strong, .spot-results-count strong, .coaching-success-proof__stats strong, .coach-success__totals strong, .ed-proof__item dt, .ed-google-reviews__score, .pricing-card__price, .start-card__price, .guenter-story-preview__facts strong, .guenter-story-hero__facts dt, .guenter-story-health__facts dt, .guenter-story-medals strong, .guenter-story-chart__bars b"
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
  element.classList.add("is-counting");

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
    else {
      element.textContent = counter.original;
      element.classList.remove("is-counting");
      element.classList.add("is-counted");
    }
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

if (!prefersReducedMotion.matches) {
  const scrollProgress = document.createElement("div");
  scrollProgress.className = "site-scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  document.body.append(scrollProgress);

  let progressFrame = 0;
  const updateScrollProgress = () => {
    progressFrame = 0;
    const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.max(0, Math.min(1, window.scrollY / scrollableHeight));
    scrollProgress.style.setProperty("--scroll-progress", progress.toFixed(4));
  };
  const requestScrollProgressUpdate = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateScrollProgress);
  };

  updateScrollProgress();
  window.addEventListener("scroll", requestScrollProgressUpdate, { passive: true });
  window.addEventListener("resize", requestScrollProgressUpdate, { passive: true });
}

const setContactFormStatus = (form, message = "", state = "") => {
  const status = form.querySelector("[data-contact-status]");
  if (!(status instanceof HTMLElement)) return;

  status.textContent = message;
  status.dataset.state = state;
};

const trackedForms = new WeakSet();
const conversionDevice = window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";

const trackConversion = (event, { target = "", topic = "", source = "" } = {}) => {
  const referrer = document.referrer ? new URL(document.referrer).hostname : "direct";
  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    target: String(target).slice(0, 180),
    topic: String(topic).slice(0, 100),
    source: String(source || referrer).slice(0, 100),
    device: conversionDevice
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/conversion", new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch("/api/conversion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true
  }).catch(() => {});
};

const trackAiReferral = () => {
  const params = new URLSearchParams(window.location.search);
  const campaignSource = (params.get("utm_source") || "").toLowerCase();
  const referrerHost = (() => {
    try { return document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""; }
    catch { return ""; }
  })();
  const aiSources = ["chatgpt.com", "perplexity.ai", "claude.ai", "gemini.google.com", "copilot.microsoft.com"];
  const matchedSource = aiSources.find((host) => campaignSource.includes(host) || referrerHost === host || referrerHost.endsWith(`.${host}`));
  if (matchedSource) trackConversion("ai_referral", { target: campaignSource || referrerHost, source: matchedSource });
};

trackAiReferral();
document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (!(link instanceof HTMLAnchorElement)) return;

  const href = link.getAttribute("href") || "";
  if (href.startsWith("/kontakt/")) {
    trackConversion("primary_cta", { target: href });
  } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    trackConversion("contact_link", { target: href.split(":")[0] });
  }
});

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

  form.addEventListener("focusin", () => {
    if (trackedForms.has(form)) return;
    trackedForms.add(form);
    trackConversion("form_start", {
      topic: topicField instanceof HTMLSelectElement ? topicField.value : form.querySelector('[name="topic"]')?.value || ""
    });
  }, { once: true });

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
      trackConversion("form_success", { topic: defaultTopicValue });
    } catch (error) {
      setContactFormStatus(
        form,
        `Das Senden hat gerade nicht funktioniert. Schreib alternativ direkt an ${fallbackEmail}.`,
        "warn"
      );
      trackConversion("form_error", { topic: defaultTopicValue });
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
  let events = [...root.querySelectorAll("[data-tri-event]")];
  let monthGroups = [...root.querySelectorAll("[data-tri-month]")];
  const pastArchive = root.querySelector("[data-calendar-past-archive]");
  const submitButton = form?.querySelector("button[type='submit']");
  const totalEvents = Number(root.getAttribute("data-total-events")) || events.length;

  if (!(form instanceof HTMLFormElement) || !(postcodeInput instanceof HTMLInputElement) ||
      !(radiusSelect instanceof HTMLSelectElement) || !(countrySelect instanceof HTMLSelectElement)) return;

  const countryNames = {
    DE: "Deutschland", AT: "Österreich", CH: "Schweiz", ES: "Spanien", IT: "Italien",
    LU: "Luxemburg", BE: "Belgien", NL: "Niederlande", FR: "Frankreich"
  };

  const hydrateArchive = () => {
    if (!(pastArchive instanceof HTMLDetailsElement)) return false;
    const template = pastArchive.querySelector("[data-calendar-archive-template]");
    const content = pastArchive.querySelector("[data-calendar-archive-content]");
    if (!(template instanceof HTMLTemplateElement) || !(content instanceof HTMLElement)) return false;
    content.append(template.content.cloneNode(true));
    template.remove();
    events = [...root.querySelectorAll("[data-tri-event]")];
    monthGroups = [...root.querySelectorAll("[data-tri-month]")];
    return true;
  };

  pastArchive?.addEventListener("toggle", () => {
    if (pastArchive instanceof HTMLDetailsElement && pastArchive.open && hydrateArchive()) updateMonthGroups();
  });

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
    hydrateArchive();
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
    if (events.length < totalEvents && countOutput instanceof HTMLElement) {
      countOutput.textContent = String(totalEvents);
      if (labelOutput instanceof HTMLElement) labelOutput.textContent = " Termine im gesamten Kalender";
    }
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
  let events = [...root.querySelectorAll("[data-run-event]")];
  let categoryGroups = [...root.querySelectorAll("[data-run-group]")];
  const pastArchive = root.querySelector("[data-calendar-past-archive]");
  const submitButton = form?.querySelector("button[type='submit']");
  const totalEvents = Number(root.getAttribute("data-total-events")) || events.length;

  if (!(form instanceof HTMLFormElement) || !(postcodeInput instanceof HTMLInputElement) ||
      !(radiusSelect instanceof HTMLSelectElement) || !(categorySelect instanceof HTMLSelectElement) ||
      !(queryInput instanceof HTMLInputElement)) return;

  const categoryNames = {
    half: "Halbmarathon", marathon: "Marathon", mammut: "Mammutmarsch",
    mega: "Megamarsch", ultra: "Ultra Running"
  };

  const hydrateArchive = () => {
    if (!(pastArchive instanceof HTMLDetailsElement)) return false;
    const template = pastArchive.querySelector("[data-calendar-archive-template]");
    const content = pastArchive.querySelector("[data-calendar-archive-content]");
    if (!(template instanceof HTMLTemplateElement) || !(content instanceof HTMLElement)) return false;
    content.append(template.content.cloneNode(true));
    template.remove();
    events = [...root.querySelectorAll("[data-run-event]")];
    categoryGroups = [...root.querySelectorAll("[data-run-group]")];
    return true;
  };

  pastArchive?.addEventListener("toggle", () => {
    if (pastArchive instanceof HTMLDetailsElement && pastArchive.open && hydrateArchive()) updateGroups();
  });

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
    hydrateArchive();
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
    if (events.length < totalEvents && countOutput instanceof HTMLElement) {
      countOutput.textContent = String(totalEvents);
      if (labelOutput instanceof HTMLElement) labelOutput.textContent = " Termine im gesamten Kalender";
    }
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

const initBodybuildingClassCalculator = () => {
  const calculator = document.querySelector("[data-class-calculator]");
  if (!(calculator instanceof HTMLFormElement)) return;

  const federation = calculator.elements.namedItem("federation");
  const division = calculator.elements.namedItem("division");
  const heightInput = calculator.elements.namedItem("height");
  const weightInput = calculator.elements.namedItem("weight");
  const result = calculator.querySelector("[data-class-result]");
  if (!(federation instanceof HTMLSelectElement) || !(division instanceof HTMLSelectElement) || !(heightInput instanceof HTMLInputElement) || !(weightInput instanceof HTMLInputElement) || !(result instanceof HTMLOutputElement)) return;

  const npcClassicLimits = [
    [162.6, 75.7], [165.1, 78], [167.6, 80.3], [170.2, 82.6],
    [172.7, 84.8], [175.3, 88], [177.8, 91.6], [180.3, 94.8],
    [182.9, 98.4], [185.4, 101.6], [188, 105.2], [190.5, 108.4],
    [193, 111.6], [195.6, 114.8], [198.1, 117.9], [200.7, 121.1],
    [Infinity, 124.3]
  ];

  const dbfvBonus = (height, classicPhysique) => {
    const bonuses = classicPhysique ? [4, 6, 8, 11, 13, 15, 17] : [0, 2, 4, 7, 9, 11, 13];
    const index = height <= 168 ? 0 : height <= 171 ? 1 : height <= 175 ? 2 : height <= 180 ? 3 : height <= 188 ? 4 : height <= 196 ? 5 : 6;
    return bonuses[index];
  };

  const render = () => {
    const height = Number.parseFloat(heightInput.value);
    const weight = Number.parseFloat(weightInput.value);
    result.classList.remove("is-over");

    if (!Number.isFinite(height) || !Number.isFinite(weight)) {
      result.innerHTML = "<span>Dein Ergebnis</span><strong>Werte ergänzen</strong><p>Bitte Körpergröße und geplantes Bühnengewicht eingeben.</p>";
      return;
    }

    let limit = null;
    let label = "";
    let note = "";

    if (federation.value === "dbfv") {
      if (division.value === "classic-physique" || division.value === "classic-bodybuilding") {
        const isPhysique = division.value === "classic-physique";
        limit = height - 100 + dbfvBonus(height, isPhysique);
        label = `DBFV-Limit: ${limit.toFixed(1).replace(".0", "")} kg`;
        note = isPhysique ? "Männer/Open Classic Physique." : "Männer/Open Classic Bodybuilding.";
      } else if (division.value === "bodybuilding") {
        const weightClass = weight <= 70 ? "bis 70 kg" : weight <= 80 ? "bis 80 kg" : weight <= 90 ? "bis 90 kg" : weight <= 100 ? "bis 100 kg" : "über 100 kg";
        label = `Klasse ${weightClass}`;
        note = "DBFV Open Bodybuilding wird nach tatsächlichem Waagegewicht eingeteilt.";
      } else {
        label = "Größenklasse, kein kg-Limit";
        note = "DBFV Men’s Physique: bis 175 cm, bis 180 cm oder über 180 cm (Open).";
      }
    } else if (federation.value === "nac") {
      if (division.value === "classic-physique") {
        const bonus = height <= 170 ? 4 : height < 180 ? 6 : height <= 189 ? 8 : 10;
        limit = height - 100 + bonus;
        label = `NAC-Limit: ${limit.toFixed(1).replace(".0", "")} kg`;
        note = "Classic Physique nach Größe minus 100 plus Toleranz. Grenzfälle bei exakt 180/189 cm bestätigen.";
      } else if (division.value === "mens-physique") {
        limit = height - 100 + 2;
        label = `NAC-Limit: ${limit.toFixed(1).replace(".0", "")} kg`;
        note = "Men’s Physique nach Körpergröße minus 100 plus 2 kg.";
      } else if (division.value === "bodybuilding") {
        label = height <= 175 ? "Body II · bis 175 cm" : "Body I · über 175 cm";
        note = "NAC Bodybuilding wird nach Größe eingeteilt und hat kein Gewichtslimit.";
      } else {
        label = "Nicht als eigene Klasse geführt";
        note = "NAC Germany führt Classic Physique, aber keine separate Classic-Bodybuilding-Division.";
      }
    } else {
      if (division.value === "classic-physique") {
        const bracket = npcClassicLimits.find(([maxHeight]) => height <= maxHeight);
        limit = bracket?.[1] ?? 124.3;
        label = `NPC-Limit: ${limit.toFixed(1).replace(".0", "")} kg`;
        note = "Offizielle NPC/NPC Worldwide Classic-Physique-Tabelle; die Originalwerte basieren auf Zoll und Pfund.";
      } else if (division.value === "classic-bodybuilding") {
        label = "Nicht als eigene Klasse geführt";
        note = "NPC Worldwide bietet Classic Physique, aber keine separate Classic-Bodybuilding-Division.";
      } else {
        label = "Showabhängige Einteilung";
        note = division.value === "mens-physique" ? "Men’s Physique wird nach Körpergröße aufgeteilt, ohne kg-Limit." : "Bodybuilding-Klassen und Gewichtsstufen stehen in der konkreten Ausschreibung.";
      }
    }

    if (limit !== null) {
      const difference = limit - weight;
      const fits = difference >= -0.05;
      result.classList.toggle("is-over", !fits);
      result.innerHTML = `<span>${fits ? "Innerhalb des Limits" : "Über dem Limit"}</span><strong>${label}</strong><p>${fits ? `${difference.toFixed(1).replace(".0", "")} kg Spielraum.` : `${Math.abs(difference).toFixed(1).replace(".0", "")} kg über dem rechnerischen Maximum.`} ${note}</p>`;
      return;
    }

    result.innerHTML = `<span>Deine Einordnung</span><strong>${label}</strong><p>${note}</p>`;
  };

  calculator.addEventListener("input", render);
  calculator.addEventListener("change", render);
  render();
};

initBodybuildingClassCalculator();

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

/* ---------------------------------------------------------------
   Member Area — Login-Fenster und Übergabe an die App unter /member/

   Der Ablauf ist derselbe wie im Login der App (app/login.tsx):
   Anmeldung gegen /api/auth/login, bis zu drei Versuche mit großzügigem
   Timeout (das Backend schläft nach Leerlauf ein und braucht bis zu
   einer Minute zum Aufwachen), dieselben Meldungen, dieselbe Sitzung.
   Die Sitzung wird unter demselben Schlüssel abgelegt, den die App im
   Browser liest — deshalb startet sie direkt angemeldet.
   --------------------------------------------------------------- */
const MEMBER_ICON_EYE =
  '<svg class="member-login__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const MEMBER_ICON_EYE_OFF =
  '<svg class="member-login__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.9 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 4"></path><path d="M6.6 7.6A16.9 16.9 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.9-.8"></path><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path><path d="m3.5 3.5 17 17"></path></svg>';

const initMemberLogin = () => {
  const root = document.querySelector("[data-member-login-root]");
  const dialog = document.querySelector("[data-member-login-dialog]");
  const backdrop = document.querySelector("[data-member-login-dismiss]");
  const form = document.querySelector("[data-member-login-form]");
  const triggers = document.querySelectorAll("[data-member-login]");

  if (!root || !dialog || !form || !triggers.length) return;

  const API_URL = "https://camp-doerfl-backend.onrender.com";
  const SESSION_KEY = "camp-doerfl.auth-session";
  const APP_ENTRY_PATH = "/member/explore";
  const REQUEST_TIMEOUT_MS = 40000;
  const RETRY_DELAY_MS = 2500;
  const MAX_ATTEMPTS = 3;
  const SLOW_HINT_DELAY_MS = 4200;

  const emailInput = form.querySelector('input[name="email"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const rememberInput = form.querySelector('input[name="remember"]');
  const revealButton = form.querySelector("[data-member-login-reveal]");
  const resetButton = form.querySelector("[data-member-login-reset]");
  const submitButton = form.querySelector("[data-member-login-submit]");
  const submitLabel = form.querySelector("[data-member-login-submit-label]");
  const notice = form.querySelector("[data-member-login-notice]");
  const errorBox = form.querySelector("[data-member-login-error]");
  const errorTitle = form.querySelector("[data-member-login-error-title]");
  const errorText = form.querySelector("[data-member-login-error-text]");
  const closeButton = dialog.querySelector("[data-member-login-close]");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let isBusy = false;
  let slowHintTimer = null;
  let lastFocusedElement = null;

  const storageArea = (area) => {
    try {
      return window[area] ?? null;
    } catch {
      return null;
    }
  };

  const readStoredSession = () => {
    const raw =
      storageArea("localStorage")?.getItem(SESSION_KEY) ??
      storageArea("sessionStorage")?.getItem(SESSION_KEY) ??
      null;

    if (!raw) return null;

    try {
      const session = JSON.parse(raw);
      const isValid = session?.token && session?.expiresAt && session?.user?.email;

      if (!isValid || new Date(session.expiresAt).getTime() <= Date.now()) {
        storageArea("localStorage")?.removeItem(SESSION_KEY);
        storageArea("sessionStorage")?.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch {
      return null;
    }
  };

  // "Eingeloggt bleiben" abgewählt heißt: nur solange dieser Tab offen ist.
  // Genau so verhält sich die App im Browser (lib/auth.ts).
  const storeSession = (session, remember) => {
    const target = storageArea(remember ? "localStorage" : "sessionStorage");
    const other = storageArea(remember ? "sessionStorage" : "localStorage");

    other?.removeItem(SESSION_KEY);

    if (!target) return false;

    try {
      target.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch {
      return false;
    }
  };

  const setNotice = (message) => {
    if (!notice) return;
    notice.textContent = message || "";
    notice.hidden = !message;
  };

  const setError = (message, title = "Login nicht möglich") => {
    if (!errorBox) return;
    if (errorTitle) errorTitle.textContent = title;
    if (errorText) errorText.textContent = message || "";
    errorBox.hidden = !message;
  };

  const setBusy = (busy, label) => {
    isBusy = busy;
    submitButton.disabled = busy;
    submitButton.classList.toggle("is-busy", busy);
    if (submitLabel) submitLabel.textContent = label || (busy ? "Wird geprüft..." : "Einloggen");
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Das Backend auf Render schläft nach etwa 15 Minuten Leerlauf ein. Der Ping
  // beim Öffnen weckt es, während noch getippt wird — genau wie warmUpBackend()
  // beim Start der App.
  const warmUpBackend = () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    fetch(`${API_URL}/health`, { method: "GET", signal: controller.signal })
      .catch(() => null)
      .finally(() => clearTimeout(timeout));
  };

  class MemberApiError extends Error {
    constructor(message, { statusCode, isConnectionError } = {}) {
      super(message);
      this.statusCode = statusCode;
      this.isConnectionError = isConnectionError;
    }
  }

  const requestOnce = async (path, body, timeoutMs) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    } catch (error) {
      const aborted = error instanceof Error && error.name.toLowerCase() === "aborterror";
      throw new MemberApiError(
        aborted
          ? "Die Anfrage an den Memberbereich hat zu lange gedauert. Bitte versuche es gleich noch einmal."
          : "Der Memberbereich ist gerade nicht erreichbar. Bitte versuche es später erneut.",
        { statusCode: aborted ? 408 : undefined, isConnectionError: true }
      );
    } finally {
      clearTimeout(timeout);
    }

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      throw new MemberApiError(result?.message || "Die Authentifizierung ist fehlgeschlagen.", {
        statusCode: response.status,
        isConnectionError: response.status >= 502 || response.status === 408 || response.status === 429
      });
    }

    return result;
  };

  const shouldRetry = (error, attempt) =>
    attempt < MAX_ATTEMPTS &&
    error instanceof MemberApiError &&
    Boolean(
      error.isConnectionError ||
        error.statusCode === 408 ||
        error.statusCode === 429 ||
        (error.statusCode && error.statusCode >= 500)
    );

  const requestApi = async (path, body, timeoutMs = REQUEST_TIMEOUT_MS) => {
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        return await requestOnce(path, body, timeoutMs);
      } catch (error) {
        if (!shouldRetry(error, attempt)) throw error;
        lastError = error;
        await wait(RETRY_DELAY_MS);
      }
    }

    throw lastError;
  };

  const errorMessageFor = (error) => {
    if (error instanceof MemberApiError && error.statusCode === 429) {
      return "Zu viele Versuche in kurzer Zeit. Bitte warte einen Moment und probiere es dann erneut.";
    }

    if (error instanceof MemberApiError && error.statusCode && error.statusCode >= 500) {
      return "Der Memberbereich ist gerade nicht erreichbar. Bitte kurz warten und erneut versuchen.";
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return "Der Login ist gerade nicht möglich. Prüfe bitte deine Verbindung.";
  };

  const focusableElements = () =>
    [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null || element === document.activeElement);

  const trapFocus = (event) => {
    if (event.key !== "Tab") return;

    const focusable = focusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }

    trapFocus(event);
  };

  const openDialog = () => {
    if (!root.hidden) return;

    lastFocusedElement = document.activeElement;
    root.hidden = false;
    if (backdrop) backdrop.hidden = false;
    dialog.hidden = false;
    document.body.classList.add("member-login-open");
    document.addEventListener("keydown", handleKeydown);
    setNotice("");
    setError("");
    warmUpBackend();

    window.requestAnimationFrame(() => {
      (emailInput?.value ? passwordInput : emailInput)?.focus();
    });
  };

  function closeDialog() {
    if (root.hidden) return;

    root.hidden = true;
    if (backdrop) backdrop.hidden = true;
    dialog.hidden = true;
    document.body.classList.remove("member-login-open");
    document.removeEventListener("keydown", handleKeydown);
    window.clearTimeout(slowHintTimer);

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  const openMemberApp = (session) => {
    setNotice(`Angemeldet als ${session.user.name || session.user.email}. Die App wird geöffnet ...`);
    window.location.assign(APP_ENTRY_PATH);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      // Ohne JavaScript bleibt der Verweis auf /member/ — mit JavaScript
      // übernimmt das Login-Fenster, und eine gültige Sitzung springt direkt
      // in die App.
      event.preventDefault();

      const session = readStoredSession();

      if (session) {
        window.location.assign(APP_ENTRY_PATH);
        return;
      }

      openDialog();
    });
  });

  closeButton?.addEventListener("click", closeDialog);
  backdrop?.addEventListener("click", closeDialog);

  revealButton?.addEventListener("click", () => {
    const revealed = passwordInput.type === "text";
    passwordInput.type = revealed ? "password" : "text";
    revealButton.setAttribute("aria-pressed", String(!revealed));
    revealButton.setAttribute("aria-label", revealed ? "Passwort anzeigen" : "Passwort ausblenden");
    revealButton.innerHTML = revealed ? MEMBER_ICON_EYE : MEMBER_ICON_EYE_OFF;
    passwordInput.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isBusy) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = Boolean(rememberInput?.checked);

    setNotice("");

    // Dieselbe Mindestprüfung wie in der App: E-Mail und Passwort müssen da sein.
    if (email.length <= 3 || password.trim().length <= 5) {
      setError("Bitte gib E-Mail-Adresse und Passwort ein.", "Login unvollständig");
      (email.length <= 3 ? emailInput : passwordInput).focus();
      return;
    }

    setError("");
    setBusy(true, "Wird geprüft...");
    slowHintTimer = window.setTimeout(() => {
      setNotice("Der Memberbereich wird gerade geweckt. Bitte kurz geöffnet lassen.");
    }, SLOW_HINT_DELAY_MS);

    try {
      const result = await requestApi("/api/auth/login", { email, password });

      if (!result.session) {
        throw new MemberApiError("Der Login konnte nicht bestätigt werden.");
      }

      window.clearTimeout(slowHintTimer);

      if (!storeSession(result.session, remember)) {
        throw new MemberApiError(
          "Dein Browser erlaubt keine lokale Speicherung — ohne sie kann die Member Area die Anmeldung nicht übernehmen."
        );
      }

      openMemberApp(result.session);
    } catch (error) {
      window.clearTimeout(slowHintTimer);
      setNotice("");
      setError(errorMessageFor(error));
      setBusy(false);
    }
  });

  resetButton?.addEventListener("click", async () => {
    const email = emailInput.value.trim().toLowerCase();

    setError("");

    if (!emailPattern.test(email)) {
      setNotice("Bitte gib zuerst deine Login-E-Mail ein.");
      emailInput.focus();
      return;
    }

    resetButton.disabled = true;
    const label = resetButton.textContent;
    resetButton.textContent = "Wird gesendet...";

    try {
      const result = await requestApi("/api/auth/password-reset-request", { email }, 30000);
      setNotice(
        result.message ||
          "Wenn zu dieser E-Mail ein Member-Zugang existiert, senden wir ein neues temporäres Passwort direkt an diese Adresse."
      );
    } catch (error) {
      setNotice("");
      setError(errorMessageFor(error), "Passwort konnte nicht zurückgesetzt werden");
    } finally {
      resetButton.disabled = false;
      resetButton.textContent = label;
    }
  });
};

initMemberLogin();
