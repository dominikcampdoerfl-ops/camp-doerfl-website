import { navItems, site, sponsors } from "./data.mjs";

const brandLogoPath = "/assets/images/camp-doerfl-logo.png";
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
  }
};

export function buttonLink(label, href, variant = "primary") {
  return `<a class="button button--${variant}" href="${href}"><span>${label}</span><span aria-hidden="true">&rarr;</span></a>`;
}

function brandLogo() {
  return `<span class="brand__mark"><img class="brand__logo" src="${brandLogoPath}" alt=""></span>`;
}

function socialPlatformFromUrl(url = "") {
  const normalized = url.toLowerCase();

  if (normalized.includes("instagram.com")) return "instagram";
  if (normalized.includes("facebook.com") || normalized.includes("fb.com")) return "facebook";
  if (normalized.includes("linkedin.com")) return "linkedin";

  return null;
}

function socialProfileUrls() {
  return [site.instagram, site.facebook, site.linkedin].filter(Boolean);
}

function socialIconImage(platform) {
  const icon = socialPlatformIcons[platform];

  if (!icon) return "";

  return `<img class="social-link__icon" src="${icon.src}" alt="" aria-hidden="true">`;
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

export function contactHref(topicSlug = "") {
  return topicSlug ? `/kontakt/?topic=${encodeURIComponent(topicSlug)}#kontaktformular` : "/kontakt/#kontaktformular";
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
    `
  };

  return `<span class="program-icon">${icons[name] || icons.app}</span>`;
}

function navIconForHref(href) {
  if (href === "/") return "home";
  if (href === "/events/") return "events";
  if (href === "/firmenfitness/") return "team";
  if (href === "/personal-coaching/") return "trainer";
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
  const imageStyle = image ? ` style="--hero-image: url('/assets/images/camp-doerfl-hero.png')"` : "";
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
                  .map((stat) => `<div><strong>${stat.value}</strong><span>${stat.label}</span></div>`)
                  .join("")}</div>`
              : ""
          }
        </div>
        ${visual ? `<div class="hero__visual" data-reveal>${visual}</div>` : ""}
      </div>
    </section>
  `;
}

export function offerCards(items) {
  return `
    <div class="card-grid card-grid--offers">
      ${items
        .map(
          (item) => `
            <a class="offer-card" href="${item.href}" data-reveal>
              <span class="card-tag">${item.tag}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              <span class="card-meta">${item.meta}</span>
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

export function statStrip(items) {
  return `
    <div class="landing-stat-strip">
      ${items
        .map(
          (item) => `
            <article class="landing-stat" data-reveal>
              <strong>${item.value}</strong>
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
                <img src="${item.image}" alt="${item.title}"${item.imagePosition ? ` style="object-position: ${item.imagePosition};"` : ""}>
              </div>
              <div class="media-program-card__body">
                <div class="media-program-card__top">
                  <span class="card-tag">${item.tag}</span>
                  ${item.icon ? uiIcon(item.icon) : ""}
                </div>
                <h3>${item.title}</h3>
                <strong>${item.meta}</strong>
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
                <img src="${item.image}" alt="${item.title}">
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
                <img src="${item.image}" alt="${item.alt || item.title}">
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
                <img src="${item.image}" alt="${item.alt || item.title}">
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
        .map(
          (item) => `
            <article class="feature-card" data-reveal>
              ${item.detail ? `<span class="feature-card__detail">${item.detail}</span>` : ""}
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
        )
        .join("")}
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
              <strong>${item.value}</strong>
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
          ${sponsors.map((sponsor) => `<strong>${sponsor}</strong>`).join("")}
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
          <strong>84</strong>
        </div>
        <div class="score-ring" aria-hidden="true"><span>84</span></div>
        <div class="metric-row"><span>Training</span><strong>4/5</strong></div>
        <div class="metric-row"><span>Ernährung</span><strong>91%</strong></div>
        <div class="metric-row"><span>Schlaf</span><strong>7:22h</strong></div>
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
            <option value="Premium Personal Training">Premium Personal Training</option>
            <option value="Firmenfitness">Firmenfitness</option>
            <option value="Events und Moderation">Events und Moderation</option>
            <option value="Camp Dörfl App">Camp Dörfl App</option>
            <option value="Kooperation und Sponsoring">Kooperation und Sponsoring</option>
            <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
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
        <p class="contact-form__note">
          Deine Nachricht wird direkt an ${site.email} gesendet.
        </p>
        <div class="contact-form__actions contact-form__actions--single">
          <button class="button button--primary" type="submit"><span>Nachricht absenden</span><span aria-hidden="true">&rarr;</span></button>
        </div>
        <p class="contact-form__status" data-contact-status aria-live="polite"></p>
      </div>
    </form>
  `;
}

function navbar(activePath) {
  const primaryNavItems = navItems.filter((item) => item.href !== "/kontakt/" && item.href !== "/app/");
  const appItem = navItems.find((item) => item.href === "/app/");
  const contactItem = navItems.find((item) => item.href === "/kontakt/");
  const navSocials = socialProfileUrls();
  const desktopSocialMarkup = navSocials.length ? socialIconLinks(navSocials, { className: "social-link--chip social-link--nav" }) : "";
  const mobileSocialMarkup = navSocials.length ? socialIconLinks(navSocials, { className: "social-link--chip social-link--nav-menu" }) : "";
  const mobileNavItems = [...primaryNavItems, ...(appItem ? [appItem] : []), ...(contactItem ? [contactItem] : [])];
  const renderMobileNavItem = (item) => `
    <a class="site-nav__entry${activePath === item.href ? " is-active" : ""}" href="${item.href}" ${activePath === item.href ? 'aria-current="page"' : ""}>
      <span class="site-nav__entry-main">
        <span class="site-nav__entry-icon">${uiIcon(navIconForHref(item.href))}</span>
        <span class="site-nav__entry-label">${item.label}</span>
      </span>
      <span class="site-nav__entry-arrow" aria-hidden="true">&rsaquo;</span>
    </a>
  `;

  return `
    <header class="site-header" data-site-header>
      <a class="skip-link" href="#main">Zum Inhalt springen</a>
      <div class="nav-shell">
        <a class="brand" href="/" aria-label="Camp Dörfl Startseite">
          ${brandLogo()}
          <span><strong>Camp Dörfl</strong><small>Performance System</small></span>
        </a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
          <span></span><span></span><span></span>
          <b>Menü</b>
        </button>
        <nav class="site-nav" id="site-nav" data-site-nav>
          <div class="site-nav__overlay">
            <div class="site-nav__brand-block" aria-hidden="true">
              <span class="site-nav__brand-mark">${brandLogo()}</span>
              <span class="site-nav__brand-copy"><strong>Camp Dörfl</strong><small>Performance System</small></span>
            </div>
            <div class="site-nav__list">
              ${mobileNavItems.map((item) => renderMobileNavItem(item)).join("")}
            </div>
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
          ${desktopSocialMarkup ? `<div class="nav-socials" role="group" aria-label="Social Media">${desktopSocialMarkup}</div>` : ""}
          ${
            appItem
              ? `<a class="nav-cta${activePath === appItem.href ? " is-active" : ""}" href="${appItem.href}"><span>${appItem.label}</span><span aria-hidden="true">&rarr;</span></a>`
              : ""
          }
        </div>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="section-shell footer-grid">
        <div>
          <a class="brand brand--footer" href="/">
            ${brandLogo()}
            <span><strong>Camp Dörfl</strong><small>Performance System</small></span>
          </a>
          <p>Performance System für Personal Training, Premium Personal Training, Firmenfitness, Events und die Camp Dörfl App.</p>
        </div>
        <div>
          <h2>Navigation</h2>
          ${navItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
        </div>
        <div>
          <h2>Kontakt</h2>
          <a href="mailto:${site.email}">${site.email}</a>
          ${socialIconLinks(socialProfileUrls(), { className: "social-link--chip social-link--footer" })}
          <span>${site.location}</span>
        </div>
      </div>
      <div class="footer-bottom section-shell">
        <span>© ${new Date().getFullYear()} Camp Dörfl</span>
        <div class="footer-bottom__links">
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Datenschutz</a>
          <a href="/cookies/">Cookies</a>
          <a href="/werbung-partnerlinks/">Partnerlinks & Werbung</a>
          <a href="/barrierefreiheit/">Barrierefreiheit</a>
          <button class="footer-link-button" type="button" data-open-consent>Cookie-Einstellungen</button>
          <span>Performance für Training, Ernährung, Gesundheit und Community.</span>
        </div>
      </div>
    </footer>
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

export function layout({ title, description, path, keywords = [], content, bodyClass = "" }) {
  const canonicalPath = path === "/" ? "/" : path;
  const canonical = `${site.url}${canonicalPath}`;
  const allKeywords = [...site.keywords, ...keywords].join(", ");
  const sameAs = socialProfileUrls();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: site.name,
        description,
        url: canonical,
        email: site.email,
        sameAs,
        areaServed: "Nürnberg",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.streetAddress,
          postalCode: site.postalCode,
          addressLocality: site.city,
          addressCountry: "DE"
        },
        serviceType: ["Personal Training", "Premium Personal Training", "Firmenfitness", "Event Moderation"],
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
        name: site.ownerName,
        jobTitle: "Personal Trainer, Coach und Moderator",
        worksFor: {
          "@type": "Organization",
          name: site.name
        },
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
        name: site.name,
        url: site.url
      }
    ]
  };

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${allKeywords}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:locale" content="de_DE">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${site.url}/assets/images/camp-doerfl-hero.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${site.url}/assets/images/camp-doerfl-hero.png">
	    <meta name="theme-color" content="#fbf7ef">
	    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/camp-doerfl-logo.png">
	    <link rel="stylesheet" href="/assets/styles.css">
	    <link rel="stylesheet" href="/assets/mobile-overrides.css">
	    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ""}>
    ${navbar(path)}
    <main id="main">
      ${content}
    </main>
    ${footer()}
    ${consentManager()}
    <script src="/assets/main.js" defer></script>
  </body>
</html>`;
}
