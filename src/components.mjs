import { encodePath, navCategories, navItems, site, sponsors } from "./data.mjs";
import { contactTopics, resolveContactTopicKey } from "./contact-topics.js";
import { MEMBER_BASE_PATH } from "./member-area.mjs";

// Ein Markenzeichen, zwei Dateien mit klar getrennter Aufgabe:
// - brandLogoSourcePath ist die 2000er Originaldatei für strukturierte Daten,
//   das Apple-Touch-Icon und den Presse-Download.
// - brandLogoDisplayPath ist die 96er Anzeigegröße für alles Sichtbare im Layout
//   (Kopfzeile, Navigation, Fußzeile) und für das Favicon.
const brandLogoSourcePath = "/assets/images/camp-doerfl-logo.png";
const brandLogoDisplayPath = "/assets/images/camp-doerfl-logo-96.webp";
const defaultRobotsContent = "index,follow,max-image-preview:large";
const defaultSocialImage = "/assets/images/home-hero-stadium-wide-social.jpg";
const socialPlatformIcons = {
  instagram: {
    label: "Instagram",
    src: "/assets/images/social-instagram.svg"
  },
  facebook: {
    label: "Facebook",
    src: "/assets/images/social-facebook.svg"
  },
  linkedin: {
    label: "LinkedIn",
    src: "/assets/images/social-linkedin.svg"
  },
  spotify: {
    label: "Spotify",
    src: "/assets/images/social-spotify.webp"
  }
};

export function buttonLink(label, href, variant = "primary") {
  return `<a class="button button--${variant}" href="${href}"><span>${label}</span><span aria-hidden="true">&rarr;</span></a>`;
}

export function imageLoadingAttributes({ eager = false } = {}) {
  return eager ? ' loading="eager" decoding="async" fetchpriority="high"' : ' loading="lazy" decoding="async"';
}

// Die WhatsApp-Adresse wird aus site.phone abgeleitet, damit die Nummer nur an einer
// Stelle gepflegt wird und Fußzeile und Kontaktseite nicht auseinanderlaufen können.
export function whatsappNumber() {
  return site.phone.replace(/\D/g, "");
}

function brandLogo() {
  return `<span class="brand__mark"><img class="brand__logo" src="${brandLogoDisplayPath}" width="96" height="96" alt=""></span>`;
}

function socialPlatformFromUrl(url = "") {
  const normalized = url.toLowerCase();

  if (normalized.includes("instagram.com")) return "instagram";
  if (normalized.includes("facebook.com") || normalized.includes("fb.com")) return "facebook";
  if (normalized.includes("linkedin.com")) return "linkedin";
  if (normalized.includes("spotify.com")) return "spotify";

  return null;
}

function socialProfileUrls() {
  return [site.instagram, site.facebook, site.linkedin, site.spotify].filter(Boolean);
}

function socialIconImage(platform) {
  const icon = socialPlatformIcons[platform];

  if (!icon) return "";

  return `<img class="social-link__icon" src="${icon.src}" width="24" height="24" alt="">`;
}

export function socialIconLink(url, { className = "", label, iconOnly = true } = {}) {
  if (!url) return "";

  const platform = socialPlatformFromUrl(url);

  if (!platform) {
    return `<a${className ? ` class="${className}"` : ""} href="${url}" target="_blank" rel="noopener noreferrer">${label || url}</a>`;
  }

  const icon = socialPlatformIcons[platform];

  return `
    <a class="social-link${className ? ` ${className}` : ""}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label || `${icon.label} öffnen`}">
      ${socialIconImage(platform)}
      ${iconOnly ? "" : `<span>${label || icon.label}</span>`}
    </a>
  `;
}

export function socialIconLinks(urls, { className = "" } = {}) {
  const links = urls
    .filter(Boolean)
    .map((url) => socialIconLink(url, { className }))
    .join("");

  if (!links) return "";

  return `<div class="social-link-row">${links}</div>`;
}

export function socialButtonLabel(url, label) {
  const platform = socialPlatformFromUrl(url);

  if (!platform) return label;

  return `<span class="social-button-label">${socialIconImage(platform)}<span>${label}</span></span>`;
}

function normalizedAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return `${site.url}${defaultSocialImage}`;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${site.url}${pathOrUrl}`;
}

function htmlText(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function breadcrumbSchema(path, pageName) {
  if (path === "/") return null;

  const parentPages = {
    "/gesundheitstag-nuernberg/": ["Firmenfitness", "/firmenfitness/"],
    "/koerperanalyse-nuernberg/": ["Personal Trainer Nürnberg", "/personal-trainer-nuernberg/"],
    "/personal-training-kosten-nuernberg/": ["Personal Trainer Nürnberg", "/personal-trainer-nuernberg/"],
    "/executive-performance/": ["Firmenfitness", "/firmenfitness/"],
    "/erfolge-im-team/guenter-preis/": ["Erfolge im Team", "/erfolge-im-team/"],
    "/bodybuilding-wettkaempfe-2026/": ["Bodybuilding Coaching", "/bodybuilding-coaching-wettkampfvorbereitung/"],
    "/bodybuilding-klassen-gewichtslimits/": ["Bodybuilding Coaching", "/bodybuilding-coaching-wettkampfvorbereitung/"],
    "/personal-trainer-auswaehlen-nuernberg/": ["Personal Trainer Nürnberg", "/personal-trainer-nuernberg/"],
    "/bodybuilding-wettkampfvorbereitung-dauer/": ["Bodybuilding Coaching", "/bodybuilding-coaching-wettkampfvorbereitung/"],
    "/bia-inbody-koerperanalyse-vergleich/": ["Körperanalyse Nürnberg", "/koerperanalyse-nuernberg/"],
    "/keynote-speaker-nuernberg/": ["Moderator Nürnberg", "/moderator-nuernberg/"],
    "/fit-werden/": ["Personal Trainer Nürnberg", "/personal-trainer-nuernberg/"],
    "/xxl-nutrition-rabattcode/": ["Partner", "/partner/"]
  };
  const parent = parentPages[path];
  const itemListElement = [{
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: site.url
  }];

  if (parent) {
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      name: parent[0],
      item: `${site.url}${encodePath(parent[1])}`
    });
  }

  itemListElement.push({
    "@type": "ListItem",
    position: itemListElement.length + 1,
    name: pageName
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${encodePath(path)}#breadcrumb`,
    itemListElement
  };
}

export function contactHref(topicSlug = "") {
  const topicKey = resolveContactTopicKey(topicSlug);
  return topicKey ? `/kontakt/?topic=${encodeURIComponent(topicKey)}#kontaktformular` : "/kontakt/#kontaktformular";
}

function uiIcon(name) {
  const icons = {
    home: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 10.5 12 4l7.5 6.5"></path>
        <path d="M7.5 9.5V19h9V9.5"></path>
        <path d="M10 19v-5h4v5"></path>
      </svg>
    `,
    app: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="3.5" width="12" height="17" rx="3"></rect>
        <path d="M10 6.5h4"></path>
        <path d="M11.5 17.5h1"></path>
      </svg>
    `,
    trainer: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 10h17"></path>
        <path d="M6 7v6"></path>
        <path d="M18 7v6"></path>
        <path d="M8.5 7H6a2.5 2.5 0 0 0-2.5 2.5v1A2.5 2.5 0 0 0 6 13h2.5"></path>
        <path d="M15.5 7H18a2.5 2.5 0 0 1 2.5 2.5v1A2.5 2.5 0 0 1 18 13h-2.5"></path>
      </svg>
    `,
    coaching: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
        <path d="M5 20a7.5 7.5 0 0 1 14 0"></path>
        <path d="M18.5 7.5h2.5"></path>
        <path d="M19.75 6.25v2.5"></path>
      </svg>
    `,
    corporate: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 20V7.5h7V20"></path>
        <path d="M11.5 20V4h8V20"></path>
        <path d="M7 10.5h2"></path>
        <path d="M7 14h2"></path>
        <path d="M15 7.5h2"></path>
        <path d="M15 11h2"></path>
        <path d="M15 14.5h2"></path>
      </svg>
    `,
    team: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        <path d="M3.5 19a5.2 5.2 0 0 1 9 0"></path>
        <path d="M11.5 19a5.2 5.2 0 0 1 9 0"></path>
      </svg>
    `,
    events: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="6.5" width="15" height="13" rx="2.5"></rect>
        <path d="M8 4v4"></path>
        <path d="M16 4v4"></path>
        <path d="M4.5 10h15"></path>
        <path d="M8.5 13.5h2"></path>
        <path d="M13.5 13.5h2"></path>
      </svg>
    `,
    partner: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 12.5 5 9a2.8 2.8 0 0 1 4-4l3.5 3.5"></path>
        <path d="M15.5 11.5 19 15a2.8 2.8 0 1 1-4 4l-3.5-3.5"></path>
        <path d="m10 14 4-4"></path>
        <path d="m8.5 15.5 2 2"></path>
        <path d="m13.5 8.5 2 2"></path>
      </svg>
    `,
    contact: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5"></rect>
        <path d="m5 7 7 5 7-5"></path>
      </svg>
    `,
    member: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
        <path d="M8 8.5h8"></path>
        <path d="M8 12h8"></path>
        <path d="M8 15.5h5"></path>
      </svg>
    `,
    scan: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5H4.5V7"></path>
        <path d="M17 4.5h2.5V7"></path>
        <path d="M7 19.5H4.5V17"></path>
        <path d="M17 19.5h2.5V17"></path>
        <path d="M8 12h8"></path>
        <path d="M9.5 9.5h5"></path>
        <path d="M9.5 14.5h5"></path>
      </svg>
    `,
    route: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18c0-2 1.6-3.5 3.6-3.5 1.5 0 2.5-.7 2.9-2 .5-1.8 1.8-3 3.8-3 1.3 0 2.4.4 3.2 1.2"></path>
        <circle cx="6" cy="18" r="1.75"></circle>
        <circle cx="12" cy="11.5" r="1.75"></circle>
        <circle cx="18" cy="8.5" r="1.75"></circle>
      </svg>
    `,
    score: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.5 18.5 9 14l3 2.5 6.5-8"></path>
        <path d="M5 5.5v13h14"></path>
        <path d="M15.5 6.5H19v3.5"></path>
      </svg>
    `,
    member: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 4.5H18a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-3.5"></path>
        <path d="M10 16.5 14.5 12 10 7.5"></path>
        <path d="M14.5 12H4.5"></path>
      </svg>
    `
  };

  return `<span class="program-icon">${icons[name] || icons.app}</span>`;
}

// Flaggen für die Sprachwahl. Bewusst als Inline-SVG: keine zusätzliche
// Anfrage, gestochen scharf auf jedem Bildschirm und mitfärbbar über CSS.
function flagIcon(language) {
  if (language === "en") {
    return `
      <svg class="language-switcher__flag" viewBox="0 0 60 30" role="img" aria-hidden="true" focusable="false">
        <clipPath id="flag-en-band"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"></path></clipPath>
        <rect width="60" height="30" fill="#012169"></rect>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"></path>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" stroke-width="4" clip-path="url(#flag-en-band)"></path>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"></path>
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"></path>
      </svg>
    `;
  }

  return `
    <svg class="language-switcher__flag" viewBox="0 0 60 30" role="img" aria-hidden="true" focusable="false">
      <rect width="60" height="10" y="0" fill="#161616"></rect>
      <rect width="60" height="10" y="10" fill="#dd0000"></rect>
      <rect width="60" height="10" y="20" fill="#ffce00"></rect>
    </svg>
  `;
}

function navIconForHref(href) {
  if (href === "/") return "home";
  if (href === MEMBER_BASE_PATH + "/") return "member";
  if (href === "/moderator-nuernberg/") return "events";
  if (href === "/firmenfitness/") return "team";
  if (href === "/personal-trainer-nuernberg/") return "trainer";
  if (href === "/partner/") return "partner";
  if (href === "/app/") return "app";
  if (href === "/kontakt/") return "contact";
  return "app";
}

export function sectionHeader({ eyebrow, title, text, align = "left", headingLevel = 2 }) {
  const headingTag = headingLevel === 1 ? "h1" : "h2";
  return `
    <div class="section-header section-header--${align}" data-reveal>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <${headingTag}>${title}</${headingTag}>
      ${text ? `<p>${text}</p>` : ""}
    </div>
  `;
}

export function hero({ eyebrow, title, lead, primary, secondary, stats = [], image = false, visual = "", className = "" }) {
  const imageStyle = image ? ` style="--hero-image: url('/assets/images/camp-doerfl-hero.webp')"` : "";
  return `
    <section class="hero ${image ? "hero--image" : "hero--plain"} ${className}"${imageStyle}>
      <div class="hero__inner">
        <div class="hero__content" data-reveal>
          ${image ? `<div class="hero__brand-chip">${brandLogo()}<span>#MEMBER</span></div>` : ""}
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
          <h1>${title}</h1>
          <p class="hero__lead">${lead}</p>
          <div class="hero__actions">
            ${primary ? buttonLink(primary.label, primary.href, "primary") : ""}
            ${secondary ? buttonLink(secondary.label, secondary.href, "secondary") : ""}
          </div>
          ${
            stats.length
              ? `<div class="hero__stats">${stats
                  .map((stat) => `<div><span class="hero__stat-value">${stat.value}</span><span>${stat.label}</span></div>`)
                  .join("")}</div>`
              : ""
          }
        </div>
        ${visual ? `<div class="hero__visual" data-reveal>${visual}</div>` : ""}
      </div>
    </section>
  `;
}

export function statStrip(items) {
  return `
    <div class="landing-stat-strip">
      ${items
        .map(
          (item) => `
            <article class="landing-stat" data-reveal>
              <span class="landing-stat__value">${item.value}</span>
              <span>${item.label}</span>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function mediaProgramGrid(items) {
  return `
    <div class="media-program-grid">
      ${items
        .map(
          (item) => `
            <a class="media-program-card" href="${item.href}" data-reveal>
              <div class="media-program-card__image ${item.imageMode ? `media-program-card__image--${item.imageMode}` : ""}">
                <img src="${item.image}" alt="${item.alt || item.title}"${imageLoadingAttributes()}${item.imagePosition ? ` style="object-position: ${item.imagePosition};"` : ""}>
              </div>
              <div class="media-program-card__body">
                <div class="media-program-card__top">
                  <span class="card-tag">${item.tag}</span>
                  ${item.icon ? uiIcon(item.icon) : ""}
                </div>
                <h3>${item.title}</h3>
                <span class="media-program-card__meta">${item.meta}</span>
                <p>${item.text}</p>
                ${
                  item.highlights?.length
                    ? `<ul class="media-program-card__highlights">
                        ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
                      </ul>`
                    : ""
                }
                <span class="media-program-card__footer">
                  <span>${item.cta || "Mehr erfahren"}</span>
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

export function proofMosaic(items) {
  return `
    <div class="proof-mosaic">
      ${items
        .map(
          (item) => `
            <article class="proof-mosaic__card" data-reveal>
              <div class="proof-mosaic__image">
                <img src="${item.image}" alt="${item.alt || item.title}"${imageLoadingAttributes()}>
              </div>
              <div class="proof-mosaic__body">
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function devicePreviewGallery(items) {
  return `
    <div class="device-preview-gallery">
      ${items
        .map(
          (item) => `
            <article class="device-preview-card" data-reveal>
              <div class="device-preview-card__frame">
                <img src="${item.image}" alt="${item.alt || item.title}"${imageLoadingAttributes()}>
              </div>
              <div class="device-preview-card__body">
                ${item.detail ? `<span class="card-tag">${item.detail}</span>` : ""}
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function transformationGrid(items) {
  return `
    <div class="transformation-grid">
      ${items
        .map(
          (item) => `
            <article class="transformation-card" data-reveal>
              <div class="transformation-card__image">
                <img src="${item.image}" alt="${item.alt || item.title}"${imageLoadingAttributes()}>
              </div>
              <div class="transformation-card__body">
                ${item.detail ? `<span class="card-tag">${item.detail}</span>` : ""}
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function stepGrid(items) {
  return `
    <div class="step-grid">
      ${items
        .map(
          (item) => `
            <article class="step-card" data-reveal>
              <span class="step-card__index">${item.step}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function featureGrid(items, modifier = "") {
  return `
    <div class="feature-grid ${modifier}">
      ${items
        .map((item) => {
          const tag = item.href ? "a" : "article";
          const href = item.href ? ` href="${item.href}"` : "";
          return `
            <${tag} class="feature-card"${href} data-reveal>
              ${item.detail ? `<span class="feature-card__detail">${item.detail}</span>` : ""}
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              ${item.ctaLabel ? `<span class="feature-card__cta"><span>${item.ctaLabel}</span><span class="feature-card__cta-arrow" aria-hidden="true">&rarr;</span></span>` : ""}
            </${tag}>
          `;
        })
        .join("")}
    </div>
  `;
}

/* Leistungs-Slideshow: fasst alle Angebote noch einmal zusammen, diesmal mit
   mehr Tiefe als die Kacheln weiter oben. Ohne JavaScript bleibt die Spur eine
   horizontal scrollbare Liste — main.js ergaenzt Pfeile, Punkte und Tastatur. */
export function pathSlider(items, label = "Alle Leistungen", { autoplay = 0, itemLabel = "Leistung" } = {}) {
  const total = String(items.length).padStart(2, "0");

  const slides = items
    .map((item, index) => {
      const position = String(index + 1).padStart(2, "0");
      const points = (item.points || [])
        .map((point) => `<li>${point}</li>`)
        .join("");

      return `
        <li class="path-slide" data-path-slide role="group" aria-roledescription="Folie" aria-label="${position} von ${total}: ${item.title}">
          <div class="path-slide__intro">
            <p class="path-slide__count"><span>${position}</span> / ${total}</p>
            ${item.detail ? `<p class="path-slide__detail">${item.detail}</p>` : ""}
            <h3 class="path-slide__title">${item.title}</h3>
            <p class="path-slide__text">${item.text}</p>
            ${item.href && item.ctaLabel ? `<a class="button button--primary path-slide__cta" href="${item.href}"><span>${item.ctaLabel}</span><span aria-hidden="true">&rarr;</span></a>` : ""}
          </div>
          ${points ? `<ul class="path-slide__points">${points}</ul>` : ""}
        </li>
      `;
    })
    .join("");

  const dots = items
    .map(
      (item, index) =>
        `<button class="path-slider__dot${index === 0 ? " is-active" : ""}" type="button" data-path-dot="${index}" aria-label="${item.title} anzeigen"${index === 0 ? ' aria-current="true"' : ""}></button>`
    )
    .join("");

  return `
    <div class="path-slider" data-path-slider${autoplay ? ` data-path-autoplay="${autoplay}"` : ""} data-reveal aria-roledescription="Slideshow" aria-label="${label}">
      <div class="path-slider__frame">
        <ul class="path-slider__track" data-path-track>${slides}</ul>
      </div>
      <div class="path-slider__controls">
        <button class="path-slider__arrow" type="button" data-path-prev aria-label="Vorherige ${itemLabel}"><span aria-hidden="true">&larr;</span></button>
        <div class="path-slider__dots" data-path-dots>${dots}</div>
        <button class="path-slider__arrow" type="button" data-path-next aria-label="Naechste ${itemLabel}"><span aria-hidden="true">&rarr;</span></button>
      </div>
    </div>
  `;
}

export function capabilityGrid(items) {
  return `
    <div class="capability-grid">
      ${items
        .map(
          (item) => `
            <article class="capability-card" data-reveal>
              ${item.detail ? `<span class="feature-card__detail">${item.detail}</span>` : ""}
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              <ul>
                ${item.items.map((entry) => `<li>${entry}</li>`).join("")}
              </ul>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function achievementGrid(items) {
  return `
    <div class="achievement-grid">
      ${items
        .map(
          (item) => `
            <div class="stat-card" data-reveal>
              <span class="stat-card__value">${item.value}</span>
              <span>${item.label}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export function summaryRows(items) {
  return `
    <div class="summary-rows">
      ${items
        .map(
          (item) => `
            <article class="summary-row" data-reveal>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

const appFeatureIcons = {
  training: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6m3-8v10m10-10v10m3-8v6M7 12h10"/><path d="M2 10v4h2v-4H2Zm3-3v10h2V7H5Zm12 0v10h2V7h-2Zm3 3v4h2v-4h-2Z"/></svg>`,
  nutrition: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4.1 0-7-2.8-7-6.7C5 10.5 7.8 8 11.5 8c4.1 0 7.5 2.8 7.5 6.7S16.1 21 12 21Z"/><path d="M12 8c.2-2.3 1.7-4 4-4M11 6c1.1-1.2 2.5-1.8 4.2-1.8"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M8 12h8M12 8v8"/></svg>`,
  club: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><path d="M7.8 16c2.2-4.8 3.8-4.8 5.4-4.8 1.7 0 2.5-1.2 3.1-2.5"/></svg>`,
  progress: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5m0 14h16"/><path d="m7 15 4-4 3 2 4-5"/><path d="M15 8h3v3"/></svg>`,
  ai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 .9 3.1L16 7l-3.1.9L12 11l-.9-3.1L8 7l3.1-.9L12 3ZM6 13l.7 2.3L9 16l-2.3.7L6 19l-.7-2.3L3 16l2.3-.7L6 13Zm11 1 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/></svg>`
};

export function appFunctionGrid(items) {
  return `
    <div class="app-feature-grid" aria-label="Funktionen der Camp Dörfl Fitness App">
      ${items
        .map(
          (item, index) => `
            <article class="app-feature-card app-feature-card--${item.icon}" data-reveal>
              <span class="app-feature-card__number">${String(index + 1).padStart(2, "0")}</span>
              <span class="app-feature-card__icon">${appFeatureIcons[item.icon]}</span>
              <p class="app-feature-card__label">${item.label}</p>
              <h3>${item.title}</h3>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function timelineList(items) {
  return `
    <div class="timeline">
      ${items
        .map(
          (item) => `
            <article class="timeline__item" data-reveal>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function processList(items) {
  return `
    <ol class="process-list">
      ${items
        .map(
          (item, index) => `
            <li data-reveal>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <p>${item}</p>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

export function pricingCards(cards) {
  return `
    <div class="pricing-grid">
      ${cards
        .map(
          (card) => `
            <article class="pricing-card ${card.featured ? "pricing-card--featured" : ""}" data-reveal>
              <span class="card-tag">${card.tag}</span>
              <h3>${card.title}</h3>
              <p class="pricing-card__price">${card.price}</p>
              <p>${card.text}</p>
              <ul>
                ${card.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function startCards(cards) {
  return `
    <div class="start-card-grid">
      ${cards
        .map(
          (card) => `
            <article class="start-card" data-reveal>
              <span class="card-tag">${card.tag}</span>
              <h3>${card.title}</h3>
              <p class="start-card__price">${card.price}</p>
              <p>${card.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function ctaSection({ eyebrow, title, text, primary, secondary }) {
  return `
    <section class="cta-band">
      <div class="section-shell cta-band__inner" data-reveal>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="hero__actions">
          ${primary ? buttonLink(primary.label, primary.href, "primary") : ""}
          ${secondary ? buttonLink(secondary.label, secondary.href, "secondary-light") : ""}
        </div>
      </div>
    </section>
  `;
}

export function sponsorStrip() {
  return `
    <section class="sponsor-strip" aria-label="Partner und Ökosystem">
      <div class="section-shell sponsor-strip__inner">
        <span>Ökosystem und Partner</span>
        <div>
          ${sponsors.map((sponsor) => `<span class="sponsor-strip__name">${sponsor}</span>`).join("")}
        </div>
      </div>
    </section>
  `;
}

export function appVisual() {
  return `
    <div class="app-visual" aria-label="Camp Dörfl App Vorschau">
      <div class="app-visual__phone">
        <div class="app-visual__topbar">
          <span>Camp Score</span>
          <span class="app-visual__score-value">84</span>
        </div>
        <div class="score-ring" aria-hidden="true"><span>84</span></div>
        <div class="metric-row"><span>Training</span><span class="metric-row__value">4/5</span></div>
        <div class="metric-row"><span>Ernährung</span><span class="metric-row__value">91%</span></div>
        <div class="metric-row"><span>Schlaf</span><span class="metric-row__value">7:22h</span></div>
        <div class="route-line" aria-hidden="true"></div>
        <div class="app-visual__nav">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="app-visual__stack" aria-hidden="true">
        <span>Check-in</span>
        <span>GPS Challenge</span>
        <span>Nutrition Score</span>
      </div>
    </div>
  `;
}

export function testimonialSection() {
  return `
    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Social Proof",
          title: "Erfahrung aus Sport, Business und Bühne.",
          text:
            "Camp Dörfl entsteht nicht aus Theorie. Es verbindet Meistertitel, Ausdauer-Challenges, Athleten-Coaching, Events, App-Entwicklung und Unternehmertum."
        })}
        <div class="quote-grid">
          <blockquote data-reveal>
            <p>Performance wird erst wertvoll, wenn sie im echten Leben funktioniert: bei Verantwortung, Stress, Familie, Termindruck und trotzdem klaren Zielen.</p>
            <cite>Dominik Dörfl</cite>
          </blockquote>
          <div class="proof-list" data-reveal>
            <span>Olympia-Athleten und internationale Top-Platzierungen</span>
            <span>Moderation hochwertiger Sport-, Fitness- und Business-Events</span>
            <span>Digitale App-Entwicklung und physische Community-Hubs</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function faq(items) {
  return `
    <div class="faq">
      ${items
        .map(
          (item) => `
            <details data-reveal>
              <summary>${item.question}</summary>
              <p>${item.answer}</p>
            </details>
          `
        )
        .join("")}
    </div>
  `;
}

export function contactForm() {
  return `
    <form
      class="contact-form contact-form--simple"
      data-contact-simple-form
      action="https://formsubmit.co/${site.email}"
      data-contact-endpoint="https://formsubmit.co/ajax/${site.email}"
      method="POST"
    >
      <input class="contact-form__trap" type="text" name="_honey" tabindex="-1" autocomplete="off">
      <input type="hidden" name="_subject" value="Camp Dörfl Kontaktanfrage">
      <input type="hidden" name="_template" value="table">
      <div class="form-grid form-grid--contact-simple">
        <label>
          <span>Name</span>
          <input name="name" autocomplete="name" required>
        </label>
        <label>
          <span>E-Mail</span>
          <input name="email" type="email" autocomplete="email" required>
        </label>
        <label>
          <span>Telefon</span>
          <input name="phone" autocomplete="tel">
        </label>
        <label>
          <span>Unternehmen / Marke</span>
          <input name="company" autocomplete="organization">
        </label>
        <label>
          <span>Bereich</span>
          <select name="topic" data-contact-topic-select>
            <option value="">Bitte auswählen</option>
            ${contactTopics.map((topic) => `<option value="${topic.label}">${topic.label}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Bevorzugter Kontaktweg</span>
          <select name="preferred_contact">
            <option value="">Bitte auswählen</option>
            <option value="E-Mail">E-Mail</option>
            <option value="Telefon">Telefon</option>
            <option value="Beides ist möglich">Beides ist möglich</option>
          </select>
        </label>
      </div>
      <label class="contact-form__message contact-form__message--simple">
        <span>Nachricht</span>
        <textarea name="message" rows="8" required placeholder="Schreib hier kurz, worum es geht."></textarea>
      </label>
      <div class="form-footer form-footer--contact form-footer--contact-simple">
        <div class="contact-form__trust" id="contact-trust-note" aria-label="Antwortzeit und Datenschutz">
          <div class="contact-form__trust-item contact-form__trust-item--response">
            <span class="contact-form__trust-mark" aria-hidden="true">01</span>
            <div>
              <span class="contact-form__trust-label">Persönliche Rückmeldung</span>
              <strong>Meist innerhalb eines Werktags.</strong>
            </div>
          </div>
          <div class="contact-form__trust-item contact-form__trust-item--privacy">
            <span class="contact-form__trust-mark" aria-hidden="true">02</span>
            <div>
              <span class="contact-form__trust-label">Vertraulich behandelt</span>
              <p>Deine Angaben werden ausschließlich zur Bearbeitung deiner Anfrage verwendet. <a href="/datenschutz/">Datenschutz ansehen&nbsp;→</a></p>
            </div>
          </div>
        </div>
        <div class="contact-form__actions contact-form__actions--single">
          <button class="button button--primary" type="submit" aria-describedby="contact-trust-note"><span>Unverbindlich anfragen</span><span aria-hidden="true">&rarr;</span></button>
        </div>
        <p class="contact-form__status" data-contact-status aria-live="polite"></p>
      </div>
    </form>
  `;
}

const inquiryByPath = Object.freeze({
  "/": { topic: "", label: "Beratung anfragen" },
  "/personal-trainer-nuernberg/": { topic: "premium-training", label: "Training anfragen" },
  "/personal-training-kosten-nuernberg/": { topic: "premium-training", label: "Training anfragen" },
  "/bodybuilding-coaching-wettkampfvorbereitung/": { topic: "bodybuilding-coaching", label: "Coaching anfragen" },
  "/koerperanalyse-nuernberg/": { topic: "koerperanalyse", label: "Analyse anfragen" },
  "/executive-performance/": { topic: "executive-performance", label: "Platz anfragen" },
  "/firmenfitness/": { topic: "firmenfitness", label: "Firmenfitness anfragen" },
  "/gesundheitstag-nuernberg/": { topic: "firmenfitness", label: "Gesundheitstag anfragen" },
  "/moderator-nuernberg/": { topic: "events", label: "Event anfragen" },
  "/app/": { topic: "app", label: "App-Zugang anfragen" },
  "/partner/": { topic: "kooperation", label: "Kooperation anfragen" },
  "/ueber-dominik/": { topic: "premium-training", label: "Zusammenarbeit anfragen" },
  "/erfolge-im-team/": { topic: "premium-training", label: "Coaching anfragen" }
});

function inquiryForPath(path) {
  const inquiry = inquiryByPath[path];
  return inquiry ? { ...inquiry, href: contactHref(inquiry.topic) } : null;
}

function mobileInquiryBar(path) {
  const inquiry = inquiryForPath(path);
  if (!inquiry) return "";

  return `
    <aside class="mobile-inquiry-bar" aria-label="Direkte Anfrage">
      <a href="${inquiry.href}">
        <span class="mobile-inquiry-bar__copy"><small>Unverbindlich · persönlich</small><strong>${inquiry.label}</strong></span>
        <span class="mobile-inquiry-bar__arrow" aria-hidden="true">&rarr;</span>
      </a>
    </aside>
  `;
}

// Verzeichnis aller weiteren Seiten im Menü — nach Anliegen gruppiert, damit
// niemand eine lange Liste durchsuchen muss. Was oben schon als Haupteinstieg
// steht, wird hier nicht wiederholt.
function menuDirectory(shownItems, activePath) {
  const shownHrefs = new Set(shownItems.map((item) => item.href));
  const groups = navCategories
    .map((category) => ({
      title: category.title,
      items: category.items.filter((item) => !shownHrefs.has(item.href))
    }))
    .filter((category) => category.items.length > 0);

  if (groups.length === 0) return "";

  return `
    <div class="site-nav__directory">
      <p class="site-nav__directory-title">Alle Seiten</p>
      ${groups
        .map(
          (group) => `
            <section class="site-nav__group">
              <h2 class="site-nav__group-title">${group.title}</h2>
              <div class="site-nav__group-links">
                ${group.items
                  .map(
                    (item) => `<a href="${item.href}"${item.isMember ? " data-member-login" : ""}${activePath === item.href ? ' class="is-active" aria-current="page"' : ""}>${item.label}</a>`
                  )
                  .join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function navbar(activePath) {
  const primaryNavOrder = [
    "/",
    "/personal-trainer-nuernberg/",
    "/firmenfitness/",
    "/fit-werden/",
    "/moderator-nuernberg/",
    "/partner/"
  ];
  const primaryNavItems = primaryNavOrder
    .map((href) => navItems.find((item) => item.href === href))
    .filter(Boolean);
  const appItem = navItems.find((item) => item.href === "/app/");
  const contactItem = navItems.find((item) => item.href === "/kontakt/");
  const inquiry = inquiryForPath(activePath);
  const contextualContactItem = contactItem
    ? {
        ...contactItem,
        href: inquiry?.href || contactItem.href,
        label: inquiry?.label || "Beratung anfragen",
        iconHref: contactItem.href,
        isContact: true
      }
    : null;
  const navSocials = socialProfileUrls();
  const mobileSocialMarkup = navSocials.length ? socialIconLinks(navSocials, { className: "social-link--chip social-link--nav-menu" }) : "";
  // Member Area: Der Verweis zeigt auf /member/ und funktioniert damit auch ohne
  // JavaScript. Ist JavaScript aktiv, fängt main.js den Klick ab und öffnet
  // stattdessen das Login-Fenster — mit bestehender Sitzung geht es direkt in die App.
  const memberItem = {
    href: `${MEMBER_BASE_PATH}/`,
    label: "Member Area",
    isMember: true
  };
  const mobileNavItems = [
    ...primaryNavItems,
    ...(appItem ? [appItem] : []),
    memberItem,
    ...(contextualContactItem ? [contextualContactItem] : [])
  ];
  // In der Desktop-Leiste steht der volle Name. Auf schmalen Notebooks
  // (unter 1200 px) wird "Nürnberg" per CSS ausgeblendet, sonst schiebt die
  // Zeile die Anfragen-Schaltfläche über den Rand. Im Kompaktmenü und in der
  // Fußzeile steht immer die vollständige Bezeichnung.
  const desktopLabels = {
    "/personal-trainer-nuernberg/": 'Personal Training<span class="site-nav__label-city"> Nürnberg</span>'
  };
  const renderNavItem = (item) => `
    <a class="site-nav__entry${item.href === "/app/" || item.isContact || item.isMember ? " site-nav__entry--supplemental" : ""}${activePath === item.href ? " is-active" : ""}" href="${item.href}" ${item.isMember ? "data-member-login" : ""} ${activePath === item.href ? 'aria-current="page"' : ""}>
      <span class="site-nav__entry-main">
        <span class="site-nav__entry-icon">${uiIcon(navIconForHref(item.iconHref || item.href))}</span>
        <span class="site-nav__entry-label">
          <span class="site-nav__label-desktop">${desktopLabels[item.href] || item.label}</span>
          <span class="site-nav__label-mobile">${item.label}</span>
        </span>
      </span>
      <span class="site-nav__entry-arrow" aria-hidden="true">&rsaquo;</span>
    </a>
  `;
  // Sprachwahl über Flaggen statt Kürzel. Der Name der Schaltfläche steht als
  // unsichtbarer Text daneben, damit Screenreader und Tastatur weiterhin
  // "Deutsch" bzw. "English" vorfinden.
  const languageSwitcher = (className = "") => `
    <div class="language-switcher${className ? ` ${className}` : ""}" data-language-switcher translate="no" role="group" aria-label="Sprache auswählen">
      <button class="language-switcher__button is-active" type="button" data-language="de" aria-pressed="true" title="Deutsch">
        ${flagIcon("de")}<span class="language-switcher__name">Deutsch</span>
      </button>
      <button class="language-switcher__button" type="button" data-language="en" aria-pressed="false" title="English">
        ${flagIcon("en")}<span class="language-switcher__name">English</span>
      </button>
    </div>
  `;

  return `
    <header class="site-header" data-site-header>
      <a class="skip-link" href="#main">Zum Inhalt springen</a>
      <div class="nav-shell">
        <a class="brand" href="/" aria-label="Camp Dörfl Startseite">
          ${brandLogo()}
          <span><span class="brand__name">Camp Dörfl</span><small>Performance System</small></span>
        </a>
        ${languageSwitcher("language-switcher--brand")}
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
          <span></span><span></span><span></span>
          <span class="nav-toggle__label">Menü</span>
        </button>
        <nav class="site-nav" id="site-nav" data-site-nav aria-label="Hauptnavigation">
          <div class="site-nav__overlay">
            <div class="site-nav__brand-block">
              <span class="site-nav__brand-mark">${brandLogo()}</span>
              <span class="site-nav__brand-copy">
                <span class="site-nav__brand-name">Was möchtest du erreichen?</span>
                <small>Training, Team oder Performance System</small>
              </span>
            </div>
            <div class="site-nav__list">
              ${mobileNavItems.map((item) => renderNavItem(item)).join("")}
            </div>
            ${menuDirectory(mobileNavItems, activePath)}
            ${
              mobileSocialMarkup
                ? `<div class="site-nav__footer">
                     <p class="site-nav__social-title">Folge uns</p>
                     <div class="site-nav__socials" role="group" aria-label="Social Media">${mobileSocialMarkup}</div>
                   </div>`
                : ""
            }
          </div>
        </nav>
        <div class="nav-extras">
          ${appItem ? `<a class="nav-action nav-action--app${activePath === appItem.href ? " is-active" : ""}" href="${appItem.href}" ${activePath === appItem.href ? 'aria-current="page"' : ""}>App</a>` : ""}
          <a class="nav-action nav-action--member" href="${MEMBER_BASE_PATH}/" data-member-login>Login</a>
          ${contextualContactItem ? `<a class="nav-action nav-action--contact${activePath === "/kontakt/" ? " is-active" : ""}" href="${contextualContactItem.href}" ${activePath === "/kontakt/" ? 'aria-current="page"' : ""}><span>Anfragen</span><span aria-hidden="true">&nearr;</span></a>` : ""}
        </div>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="section-shell footer-grid">
        <div class="footer-panel footer-brand-panel">
          <a class="brand brand--footer" href="/">
            ${brandLogo()}
            <span><span class="brand__name">Camp Dörfl</span><small>Performance System</small></span>
          </a>
          <p>Performance System für Personal Training, Premium Personal Training, Firmenfitness, Events und die Camp Dörfl App.</p>
          <a class="footer-primary-link" href="/kontakt/"><span>Anfrage starten</span><span aria-hidden="true">&nearr;</span></a>
        </div>
        <div class="footer-panel footer-nav-panel">
          <h2>Navigation</h2>
          <div class="footer-nav-groups">
            ${navCategories
              .map(
                (category) => `
                  <section class="footer-nav-group">
                    <h3>${category.title}</h3>
                    <div class="footer-nav-links">
                      ${category.items
                        .map(
                          (item) => `<a href="${item.href}"${item.isMember ? " data-member-login" : ""}>${item.label}</a>`
                        )
                        .join("")}
                    </div>
                  </section>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="footer-panel footer-contact-panel">
          <h2>Kontakt</h2>
          <a class="footer-email" href="mailto:${site.email}">${site.email}</a>
          <a class="footer-phone" href="tel:${site.phone}">${site.phoneDisplay}</a>
          <a class="footer-whatsapp" href="https://wa.me/${whatsappNumber()}" target="_blank" rel="noopener noreferrer">Direkt über WhatsApp schreiben</a>
          <span class="footer-location">${site.location}</span>
          ${socialIconLinks(socialProfileUrls(), { className: "social-link--chip social-link--footer" })}
        </div>
      </div>
      <div class="footer-bottom section-shell">
        <span class="footer-copyright">© ${new Date().getFullYear()} Camp Dörfl</span>
        <div class="footer-bottom__links">
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Datenschutz</a>
          <a href="/cookies/">Cookies</a>
          <a href="/werbung-partnerlinks/">Partnerlinks & Werbung</a>
          <a href="/barrierefreiheit/">Barrierefreiheit</a>
          <a href="/datenschutzformular-app/">Datenschutzformular App</a>
          <button class="footer-link-button" type="button" data-open-consent>Cookie-Einstellungen</button>
        </div>
        <span class="footer-bottom__claim">Performance für Training, Ernährung, Gesundheit und Community.</span>
      </div>
    </footer>
  `;
}

// Feather-Icons in derselben Strichstärke und Form wie im Login der App
// (app/login.tsx). Bewusst inline: Das Login-Fenster darf auf keine weitere
// Datei warten müssen.
function memberIcon(name) {
  const icons = {
    mail: '<path d="M4 6h16v12H4z"></path><path d="m4 7 8 6 8-6"></path>',
    lock: '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2"></rect><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"></path>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
    "eye-off":
      '<path d="M9.9 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 4"></path><path d="M6.6 7.6A16.9 16.9 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.9-.8"></path><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path><path d="m3.5 3.5 17 17"></path>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"></path>',
    "log-in":
      '<path d="M14.5 4.5H18a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-3.5"></path><path d="M10 16.5 14.5 12 10 7.5"></path><path d="M14.5 12H4.5"></path>',
    clock: '<circle cx="12" cy="12" r="8"></circle><path d="M12 7.5V12l3 1.8"></path>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4-3 7.2-7 9-4-1.8-7-5-7-9V6l7-2.5Z"></path>',
    close: '<path d="m6.5 6.5 11 11"></path><path d="m17.5 6.5-11 11"></path>'
  };

  return `<svg class="member-login__icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

// Das Login-Fenster der Member Area — dieselbe Bildsprache und derselbe Wortlaut
// wie der Login-Screen der App (app/login.tsx). Nach der Anmeldung übernimmt die
// App unter /member/ die Sitzung und öffnet den Member- bzw. Coach-Bereich.
function memberLoginDialog() {
  return `
    <div class="member-login" data-member-login-root hidden>
      <div class="member-login__backdrop" data-member-login-dismiss hidden></div>
      <section
        class="member-login__dialog"
        data-member-login-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-login-title"
        aria-describedby="member-login-lead"
        hidden>
        <button class="member-login__close" type="button" data-member-login-close aria-label="Login schließen">${memberIcon("close")}</button>

        <div class="member-login__hero">
          <span class="member-login__logo"><img src="${brandLogoDisplayPath}" width="96" height="96" alt="" loading="lazy" decoding="async"></span>
          <p class="member-login__eyebrow">Member Area</p>
          <h2 id="member-login-title">Herzlich Willkommen</h2>
          <p class="member-login__lead" id="member-login-lead">Melde dich an, um deine persönlichen Inhalte, Termine und Coaching-Updates zu sehen.</p>
        </div>

        <form class="member-login__form" data-member-login-form novalidate>
          <div class="member-login__field">
            <label class="member-login__label" for="member-login-email">E-Mail</label>
            <div class="member-login__input">
              ${memberIcon("mail")}
              <input
                id="member-login-email"
                name="email"
                type="email"
                inputmode="email"
                autocomplete="username"
                autocapitalize="none"
                spellcheck="false"
                placeholder="name@beispiel.de"
                required>
            </div>
          </div>

          <div class="member-login__field">
            <label class="member-login__label" for="member-login-password">Passwort</label>
            <div class="member-login__input">
              ${memberIcon("lock")}
              <input
                id="member-login-password"
                name="password"
                type="password"
                autocomplete="current-password"
                placeholder="Dein Passwort"
                required>
              <button class="member-login__reveal" type="button" data-member-login-reveal aria-label="Passwort anzeigen" aria-pressed="false">${memberIcon("eye")}</button>
            </div>
          </div>

          <div class="member-login__options">
            <label class="member-login__remember">
              <input type="checkbox" name="remember" checked>
              <span class="member-login__checkbox" aria-hidden="true">${memberIcon("check")}</span>
              <span>Eingeloggt bleiben</span>
            </label>
            <button class="member-login__link" type="button" data-member-login-reset>Neues Passwort an meine E-Mail senden</button>
          </div>

          <p class="member-login__notice" data-member-login-notice role="status" hidden></p>

          <div class="member-login__error" data-member-login-error role="alert" hidden>
            <strong data-member-login-error-title>Login nicht möglich</strong>
            <span data-member-login-error-text></span>
          </div>

          <button class="member-login__submit" type="submit" data-member-login-submit>
            <span class="member-login__submit-icon" data-member-login-submit-icon>${memberIcon("log-in")}</span>
            <span data-member-login-submit-label>Einloggen</span>
          </button>
        </form>

        <div class="member-login__foot">
          <p class="member-login__hint">${memberIcon("shield")}<span>Gleiche Zugangsdaten wie in der App. Die Anmeldung läuft verschlüsselt über das Camp-Dörfl-Backend.</span></p>
          <p class="member-login__access"><strong>Noch keinen Zugang?</strong> <a href="/kontakt/">Melde dich bei Dominik</a> — dein Zugang wird persönlich freigegeben.</p>
          __MEMBER_APP_BUILD_NOTE__
        </div>
      </section>
    </div>
  `;
}

function consentManager() {
  return `
    <div class="consent-root" data-consent-root hidden>
      <div class="consent-backdrop" data-consent-backdrop hidden></div>
      <section class="consent-banner" data-consent-banner hidden aria-label="Cookie- und Einwilligungshinweis">
        <div class="consent-banner__copy">
          <p class="eyebrow">Privatsphäre</p>
          <h2>Cookies, lokale Speicherungen und externe Medien</h2>
          <p>Diese Website nutzt erforderliche Speicherungen für Grundfunktionen und fragt für externe Medien wie YouTube vorab deine Freigabe ab. Du kannst jetzt auswählen und die Entscheidung später jederzeit ändern.</p>
        </div>
        <div class="consent-banner__actions">
          <button class="button button--ghost" type="button" data-consent-open-settings><span>Einstellungen</span><span aria-hidden="true">&rarr;</span></button>
          <button class="button button--secondary-light" type="button" data-consent-action="essential"><span>Nur erforderliche</span><span aria-hidden="true">&rarr;</span></button>
          <button class="button button--primary" type="button" data-consent-action="accept-all"><span>Alle akzeptieren</span><span aria-hidden="true">&rarr;</span></button>
        </div>
        <p class="consent-banner__note">Mehr dazu in <a href="/cookies/">Cookies</a> und <a href="/datenschutz/">Datenschutz</a>.</p>
      </section>

      <section class="consent-modal" data-consent-modal hidden role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <div class="consent-modal__panel">
          <div class="consent-modal__head">
            <div>
              <p class="eyebrow">Einwilligungen</p>
              <h2 id="consent-title">Deine Privatsphäre-Einstellungen</h2>
            </div>
            <button class="consent-close" type="button" data-consent-close aria-label="Dialog schließen">&times;</button>
          </div>
          <div class="consent-modal__body">
            <p>Hier legst du fest, welche Speicherungen und externen Inhalte auf deinem Endgerät aktiviert werden dürfen. Erforderliche Funktionen bleiben immer aktiv.</p>

            <article class="consent-option">
              <div class="consent-option__copy">
                <h3>Erforderlich</h3>
                <p>Notwendig für Navigation, Sicherheitsfunktionen und das Merken deiner Einwilligungsentscheidung.</p>
              </div>
              <label class="consent-switch consent-switch--locked">
                <input type="checkbox" checked disabled>
                <span>Immer aktiv</span>
              </label>
            </article>

            <article class="consent-option">
              <div class="consent-option__copy">
                <h3>Externe Medien</h3>
                <p>Erlaubt das Laden eingebetteter YouTube-Inhalte. Nach deiner Freigabe kann im sichtbaren Bereich automatisch eine Verbindung zu YouTube aufgebaut werden.</p>
              </div>
              <label class="consent-switch">
                <input type="checkbox" data-consent-field="externalMedia">
                <span>Externe Medien erlauben</span>
              </label>
            </article>

            <p class="consent-modal__foot">Du kannst diese Auswahl jederzeit über den Link „Cookie-Einstellungen“ im Footer ändern.</p>
          </div>
          <div class="consent-modal__actions">
            <button class="button button--secondary-light" type="button" data-consent-action="essential"><span>Nur erforderliche</span><span aria-hidden="true">&rarr;</span></button>
            <button class="button button--ghost" type="button" data-consent-action="save-selection"><span>Auswahl speichern</span><span aria-hidden="true">&rarr;</span></button>
            <button class="button button--primary" type="button" data-consent-action="accept-all"><span>Alle akzeptieren</span><span aria-hidden="true">&rarr;</span></button>
          </div>
        </div>
      </section>
    </div>
  `;
}

/* ---------------------------------------------------------------
   Cloudflare Web Analytics

   Ohne Cookies, ohne localStorage, ohne Wiedererkennung über Seiten
   hinweg — deshalb ist keine Einwilligung nötig und das Skript läuft
   unabhängig vom Consent-Banner. Erhoben werden Seitenaufrufe,
   Herkunft, Land und Ladezeiten.

   Das Token stammt aus dem Cloudflare-Dashboard und ist kein Geheimnis:
   Es steht ohnehin im ausgelieferten HTML. Ohne Token wird gar nichts
   eingebunden, die Seite funktioniert dann unverändert.
   --------------------------------------------------------------- */
const WEB_ANALYTICS_TOKEN = "0e97d1729e144d108067a82218067414";

function webAnalyticsSnippet() {
  if (!WEB_ANALYTICS_TOKEN) return "";
  return `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${WEB_ANALYTICS_TOKEN}"}'></script>`;
}

export function layout({
  title,
  description,
  path,
  keywords = [],
  content,
  bodyClass = "",
  robots = defaultRobotsContent,
  pageName = "",
  pageType = "WebPage",
  dateModified = "2026-08-11",
  socialImage = defaultSocialImage,
  socialImageAlt = "Camp Dörfl Performance System in Nürnberg",
  extraStructuredData = []
}) {
  const canonicalPath = path === "/" ? "/" : path;
  const hasMobileInquiry = Boolean(inquiryForPath(path));
  const canonical = `${site.url}${encodePath(canonicalPath)}`;
  const sameAs = socialProfileUrls();
  const resolvedPageName = htmlText(pageName || title.split("|")[0].trim()) || site.name;
  const resolvedSocialImage = normalizedAbsoluteUrl(socialImage);
  const breadcrumb = breadcrumbSchema(canonicalPath, resolvedPageName);
  const organizationId = `${site.url}/#organization`;
  const businessId = `${site.url}/#business`;
  const personId = `${site.url}/#person`;
  const websiteId = `${site.url}/#website`;
  const webpageId = `${canonical}#webpage`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        alternateName: "Camp Dörfl – Personal Trainer Nürnberg",
        url: site.url,
        logo: normalizedAbsoluteUrl(brandLogoSourcePath),
        image: resolvedSocialImage,
        email: site.email,
        telephone: site.phone,
        founder: { "@type": "Person", "@id": personId },
        sameAs,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: site.email,
            telephone: site.phone,
            availableLanguage: ["de", "en"],
            areaServed: "DE"
          }
        ]
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService", "SportsActivityLocation"],
        "@id": businessId,
        name: site.name,
        alternateName: "Camp Dörfl – Personal Trainer Nürnberg",
        description,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        logo: normalizedAbsoluteUrl(brandLogoSourcePath),
        image: resolvedSocialImage,
        priceRange: "€€€",
        currenciesAccepted: "EUR",
        founder: { "@id": personId },
        parentOrganization: { "@id": organizationId },
        sameAs,
        areaServed: [
          { "@type": "City", name: "Nürnberg" },
          { "@type": "City", name: "Fürth" },
          { "@type": "City", name: "Erlangen" }
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: site.streetAddress,
          postalCode: site.postalCode,
          addressLocality: site.city,
          addressRegion: "Bayern",
          addressCountry: "DE"
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 49.4884,
          longitude: 11.0231
        },
        serviceType: [
          "Personal Trainer Nürnberg",
          "Personal Training",
          "Premium Personal Training",
          "Firmenfitness",
          "Event Moderation"
        ],
        knowsAbout: [
          "Personal Trainer Nürnberg",
          "Premium Personal Training Nürnberg",
          "Moderator in Nürnberg",
          "Firmenfitness",
          "Performance System"
        ]
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.ownerName,
        url: `${site.url}/ueber-dominik/`,
        image: normalizedAbsoluteUrl("/assets/images/dominik-about-gym-portrait.webp"),
        description:
          "Dominik Dörfl ist Personal Trainer, Bodybuilding- und Performance-Coach, Moderator und Gründer von Camp Dörfl in Nürnberg.",
        jobTitle: "Personal Trainer, Bodybuilding- und Performance-Coach",
        worksFor: {
          "@id": organizationId
        },
        knowsAbout: [
          "Personal Training",
          "Bodybuilding",
          "Wettkampfvorbereitung",
          "Krafttraining",
          "Körperanalyse",
          "Sporternährung",
          "Firmenfitness",
          "Ausdauertraining"
        ],
        award: [
          "Deutscher Meister im Bodybuilding",
          "Deutscher Meister im Powerlifting",
          "IFBB Pro Bodybuilding"
        ],
        subjectOf: [
          { "@type": "WebPage", url: "https://dbfv.de/wp-content/uploads/Ergebnisliste-DM-JunMas2018.pdf", name: "DBFV Ergebnisliste Deutsche Meisterschaft 2018" },
          { "@type": "PodcastSeries", url: "https://podcasts.apple.com/us/podcast/erfolg-bewusst-steuern-der-camp-d%C3%B6rfl-podcast/id1549119123", name: "Camp Dörfl Podcast – Erfolg bewusst steuern" },
          { "@type": "WebPage", url: "https://blv-bfk.de/90-2/", name: "Bayerischer Landesverband für Bodybuilding, Fitness und Kraftsport – PLZ 90" }
        ],
        sameAs,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.streetAddress,
          postalCode: site.postalCode,
          addressLocality: site.city,
          addressCountry: "DE"
        }
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        url: site.url,
        inLanguage: "de-DE",
        publisher: { "@id": organizationId }
      },
      {
        "@type": pageType,
        "@id": webpageId,
        name: resolvedPageName,
        url: canonical,
        description,
        inLanguage: "de-DE",
        ...(dateModified ? { dateModified } : {}),
        isPartOf: { "@id": websiteId },
        about: { "@id": businessId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: resolvedSocialImage
        },
        ...(breadcrumb ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {})
      },
      ...(breadcrumb ? [breadcrumb] : []),
      ...extraStructuredData
    ]
  };

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:locale" content="de_DE">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${resolvedSocialImage}">
    <meta property="og:image:alt" content="${socialImageAlt}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${resolvedSocialImage}">
    <meta name="twitter:image:alt" content="${socialImageAlt}">
	    <meta name="theme-color" content="#fbf7ef">
	    <link rel="icon" type="image/webp" href="${brandLogoDisplayPath}">
	    <link rel="icon" type="image/png" href="${brandLogoSourcePath}">
	    <link rel="apple-touch-icon" sizes="180x180" href="${brandLogoSourcePath}">
	    <link rel="stylesheet" href="/assets/__ASSET_VERSION__/styles.css">
	    <link rel="stylesheet" href="/assets/__ASSET_VERSION__/mobile-overrides.css">
	    <link rel="stylesheet" href="/assets/__ASSET_VERSION__/design-contract.css">
	    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  </head>
  <body${bodyClass || hasMobileInquiry ? ` class="${[bodyClass, hasMobileInquiry ? "has-mobile-inquiry-bar" : ""].filter(Boolean).join(" ")}"` : ""}>
    ${navbar(path)}
    <main id="main">
      ${content}
    </main>
    ${footer()}
    ${mobileInquiryBar(path)}
    ${memberLoginDialog()}
    ${consentManager()}
    <script type="module" src="/assets/__ASSET_VERSION__/main.js"></script>
    ${webAnalyticsSnippet()}
  </body>
</html>`;
}
