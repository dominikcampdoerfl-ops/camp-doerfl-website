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

  const setNavState = (isOpen) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    const isEnglish = selectedLanguage === "en";
    navToggle.setAttribute("aria-label", isOpen ? (isEnglish ? "Close navigation" : "Navigation schließen") : isEnglish ? "Open navigation" : "Navigation öffnen");
    navToggle.classList.toggle("is-open", isOpen);
    nav.classList.toggle("is-open", isOpen);
    nav.setAttribute("aria-hidden", String(!isOpen));

    if (header instanceof HTMLElement) {
      header.classList.toggle("is-nav-open", isOpen);
    }

    if (navToggleLabel instanceof HTMLElement) {
      navToggleLabel.textContent = isOpen ? (isEnglish ? "Close" : "Schließen") : isEnglish ? "Menu" : "Menü";
    }

    document.body.classList.toggle("nav-open", isOpen);
  };

  setNavState(false);

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen);
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
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node) || !(header instanceof HTMLElement)) return;
    if (!header.contains(event.target)) {
      setNavState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 880) {
      setNavState(false);
    }
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const normalizeContactTopicKey = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
    const normalizedTopicParam = normalizeContactTopicKey(topicParam);
    const requestedTopic = Array.from(topicField.options).find(
      (option) => normalizeContactTopicKey(option.value) === normalizedTopicParam
    );

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
