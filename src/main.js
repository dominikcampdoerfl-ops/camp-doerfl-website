const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
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

const CONTACT_MAILTO_MAX_LENGTH = 1800;

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

const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below.
  }

  const helperField = document.createElement("textarea");
  helperField.value = text;
  helperField.setAttribute("readonly", "");
  helperField.style.position = "fixed";
  helperField.style.opacity = "0";
  helperField.style.pointerEvents = "none";
  document.body.append(helperField);
  helperField.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  helperField.remove();
  return copied;
};

const getContactControlLabel = (control) => {
  if (control.dataset.mailLabel) return control.dataset.mailLabel;

  const label = control.closest("label");
  const text = label?.querySelector("span")?.textContent?.trim();
  return text || control.name;
};

const getContactControlValue = (control) => {
  if (control instanceof HTMLSelectElement) {
    return control.value ? control.options[control.selectedIndex]?.textContent?.trim() || "" : "";
  }

  if (control instanceof HTMLInputElement && (control.type === "radio" || control.type === "checkbox")) {
    return control.checked ? control.value.trim() : "";
  }

  return control.value.trim();
};

const buildContactDraft = (form) => {
  const email = form.getAttribute("data-contact-email") || "kontakt@camp-doerfl.de";
  const fields = Array.from(form.querySelectorAll("input[name], select[name], textarea[name]")).filter(
    (control) =>
      control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement
  );
  const lines = [];

  fields.forEach((control) => {
    if (control.disabled || control.name === "website") return;

    const value = getContactControlValue(control);
    if (!value) return;

    const label = getContactControlLabel(control);
    if (control instanceof HTMLTextAreaElement) {
      lines.push("");
      lines.push(`${label}:`);
      lines.push(value);
      return;
    }

    lines.push(`${label}: ${value}`);
  });

  const selectedTopic = form.querySelector("[data-contact-topic]:checked");
  const topic = selectedTopic instanceof HTMLInputElement ? selectedTopic.value : "Kontakt";
  const name = form.querySelector('[name="name"]');
  const company = form.querySelector('[name="company"]');
  const nameValue = name instanceof HTMLInputElement ? name.value.trim() : "";
  const companyValue = company instanceof HTMLInputElement ? company.value.trim() : "";
  const subjectParts = ["Camp Dörfl Anfrage", topic];

  if (companyValue) {
    subjectParts.push(companyValue);
  } else if (nameValue) {
    subjectParts.push(nameValue);
  }

  const subject = subjectParts.join(" · ");
  const body = ["Hallo Camp Dörfl,", "", "hier ist meine Anfrage:", "", ...lines, "", "Viele Grüße"].join("\n");
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { email, subject, body, mailto };
};

const syncContactForm = (form) => {
  const activeTopic = form.querySelector("[data-contact-topic]:checked");
  if (!(activeTopic instanceof HTMLInputElement)) return;

  form.querySelectorAll("[data-contact-guide-panel]").forEach((panel) => {
    if (!(panel instanceof HTMLElement)) return;
    panel.hidden = panel.getAttribute("data-contact-guide-panel") !== activeTopic.value;
  });

  form.querySelectorAll("[data-contact-context]").forEach((section) => {
    if (!(section instanceof HTMLElement)) return;

    const isActive = section.getAttribute("data-contact-context") === activeTopic.value;
    section.hidden = !isActive;

    section.querySelectorAll("input, select, textarea").forEach((control) => {
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      ) {
        control.disabled = !isActive;
      }
    });
  });

  const messageLabel = form.querySelector("[data-contact-message-label]");
  if (messageLabel instanceof HTMLElement) {
    messageLabel.textContent = activeTopic.dataset.messageLabel || "Worum geht es in deiner Anfrage?";
  }

  const messageField = form.querySelector("[data-contact-message]");
  if (messageField instanceof HTMLTextAreaElement) {
    messageField.placeholder = activeTopic.dataset.messagePlaceholder || "Beschreibe kurz dein Anliegen.";
  }
};

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const topicRadios = Array.from(form.querySelectorAll("[data-contact-topic]")).filter(
    (control) => control instanceof HTMLInputElement
  );
  const topicParam = new URLSearchParams(window.location.search).get("topic");

  if (topicParam) {
    const normalizedTopicParam = normalizeContactTopicKey(topicParam);
    const requestedTopic = topicRadios.find(
      (radio) =>
        normalizeContactTopicKey(radio.dataset.topicSlug || "") === normalizedTopicParam ||
        normalizeContactTopicKey(radio.value) === normalizedTopicParam
    );

    if (requestedTopic) {
      requestedTopic.checked = true;
    }
  }

  syncContactForm(form);

  topicRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      syncContactForm(form);
      setContactFormStatus(form);
    });
  });

  const copyButton = form.querySelector("[data-contact-copy]");
  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener("click", async () => {
      const draft = buildContactDraft(form);
      const copied = await copyTextToClipboard(`An: ${draft.email}\nBetreff: ${draft.subject}\n\n${draft.body}`);

      setContactFormStatus(
        form,
        copied
          ? `Der Anfrage-Entwurf wurde kopiert. Du kannst ihn direkt an ${draft.email} senden.`
          : `Der Text konnte nicht automatisch kopiert werden. Sende deine Anfrage alternativ direkt an ${draft.email}.`,
        copied ? "success" : "warn"
      );
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) return;

    syncContactForm(form);
    const draft = buildContactDraft(form);

    if (draft.mailto.length > CONTACT_MAILTO_MAX_LENGTH) {
      const copied = await copyTextToClipboard(`An: ${draft.email}\nBetreff: ${draft.subject}\n\n${draft.body}`);

      setContactFormStatus(
        form,
        copied
          ? `Die Anfrage ist für einen direkten Mail-Entwurf zu lang. Der komplette Text wurde kopiert und kann an ${draft.email} eingefügt werden.`
          : `Die Anfrage ist für einen direkten Mail-Entwurf zu lang. Bitte sende sie direkt an ${draft.email}.`,
        copied ? "info" : "warn"
      );
      return;
    }

    setContactFormStatus(form, "Dein E-Mail-Entwurf wird geöffnet.", "info");
    window.location.href = draft.mailto;
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
