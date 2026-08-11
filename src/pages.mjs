import {
  achievements,
  appFunctionRows,
  corporateSteps,
  dominikFacts,
  executiveSteps,
  landingProofCards,
  site,
  timeline
} from "./data.mjs";
import {
  achievementGrid,
  contactHref,
  contactForm,
  ctaSection,
  devicePreviewGallery,
  appFunctionGrid,
  faq,
  featureGrid,
  imageLoadingAttributes,
  layout,
  pricingCards,
  processList,
  proofMosaic,
  sectionHeader,
  socialButtonLabel,
  socialIconLink,
  socialIconLinks,
  stepGrid,
  summaryRows,
  timelineList,
  transformationGrid
} from "./components.mjs";
import { dtuTriathlonEvents2026 } from "./triathlon-events-2026.mjs";
import { runningEvents2026 } from "./running-events-2026.mjs";
import {
  golfAssociations,
  golfEvents2026,
  internationalTriathlonEvents2026
} from "./sports-calendar-data.mjs";
import { popularSportSpotCategoryIds, sportSpotCategories } from "./sport-spots-data.mjs";

function serviceSchema({ path, name, serviceType, description, areaServed }) {
  return {
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name,
    serviceType,
    description,
    provider: { "@id": `${site.url}/#business` },
    areaServed: areaServed || [
      { "@type": "City", name: "Nürnberg" },
      { "@type": "City", name: "Fürth" },
      { "@type": "City", name: "Erlangen" }
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${site.url}${path}`
    }
  };
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return site.url;
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${site.url}${pathOrUrl}`;
}

function faqSchema(path, items) {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}

function videoObjectSchema({ path, id, name, description, thumbnailUrl, embedUrl, watchUrl, uploadDate }) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(uploadDate || "")) {
    throw new Error(`VideoObject ${id || name || "unknown"} requires a valid ISO 8601 uploadDate`);
  }

  return {
    "@type": "VideoObject",
    "@id": `${site.url}${path}#${id}`,
    name,
    description,
    thumbnailUrl: [absoluteUrl(thumbnailUrl)],
    uploadDate,
    embedUrl,
    url: watchUrl,
    publisher: {
      "@id": `${site.url}/#business`
    }
  };
}

function deferredVideoEmbed({
  embedUrl,
  watchUrl,
  title,
  image,
  alt,
  headline,
  actionLabel,
  eyebrow = "YouTube",
  short = false
}) {
  return `
    <div class="premium-video-embed${short ? " premium-video-embed--short" : ""}" data-video-embed data-video-src="${embedUrl}" data-video-title="${title}">
      <a class="premium-video-launch${short ? " premium-video-launch--short" : ""}" href="${watchUrl}" target="_blank" rel="noopener noreferrer" aria-label="${title} auf YouTube ansehen">
        <img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
        <span class="premium-video-launch__scrim" aria-hidden="true"></span>
        <span class="premium-video-launch__content">
          <span class="premium-video-launch__eyebrow">${eyebrow}</span>
          <span class="premium-video-launch__headline">${headline}</span>
          <span class="premium-video-launch__action">${actionLabel}</span>
          <span class="premium-video-launch__hint">Freigabe nötig. Danach kann YouTube automatisch laden.</span>
        </span>
      </a>
    </div>
  `;
}

function eventFormatShowcase(items) {
  const renderCard = (item, featured = false) => `
    <article class="event-format-card${featured ? " event-format-card--featured" : ""}" data-reveal>
      <figure class="event-format-card__media">
        <img src="${item.image}" alt="${item.alt}"${imageLoadingAttributes()} style="object-position: ${item.imagePosition || "center center"};">
      </figure>
      <div class="event-format-card__body">
        <div class="event-format-card__meta">
          <span class="event-format-card__number">${item.number}</span>
          <span class="event-format-card__detail">${item.detail}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <p class="event-format-card__note">${item.note}</p>
      </div>
    </article>
  `;

  const [featuredCard, ...stackCards] = items;

  return `
    <div class="event-format-showcase" aria-label="Event-Formate mit Anspruch">
      ${featuredCard ? renderCard(featuredCard, true) : ""}
      <div class="event-format-showcase__stack">
        ${stackCards.map((item) => renderCard(item)).join("")}
      </div>
    </div>
  `;
}

function corporateModuleShowcase(items) {
  return `
    <div class="corporate-module-stage" aria-label="Firmenfitness-System">
      <div class="corporate-module-grid">
        ${items
          .map(
            (item) => `
              <article class="corporate-module-card" data-reveal>
                <div class="corporate-module-card__body">
                  <div class="corporate-module-card__meta">
                    <span class="corporate-module-card__number">${item.number}</span>
                  </div>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                  ${
                    item.points?.length
                      ? `
                  <ul class="corporate-module-card__list" aria-label="${item.detail} Schwerpunkte">
                    ${item.points.map((point) => `<li>${point}</li>`).join("")}
                  </ul>`
                      : ""
                  }
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function corporateOfferShowcase(items) {
  const [featured, ...supporting] = items;
  const points = (item) => `
    <ul class="corporate-offer-card__points" aria-label="${item.detail} Leistungen">
      ${item.points.map((point) => `<li>${point}</li>`).join("")}
    </ul>`;

  return `
    <div class="corporate-offer-showcase" aria-label="Drei Firmenfitness-Angebote">
      <article class="corporate-offer-card corporate-offer-card--featured" data-reveal>
        <figure class="corporate-offer-card__media">
          <img src="${featured.image}" alt="${featured.alt}" style="object-position:${featured.imagePosition || "center"}"${imageLoadingAttributes()}>
          <span class="corporate-offer-card__media-label">${featured.detail}</span>
        </figure>
        <div class="corporate-offer-card__body">
          <div class="corporate-offer-card__meta"><span>${featured.number}</span><small>Firmenfitness-Angebot</small></div>
          <h3>${featured.shortTitle || featured.title}</h3>
          <p>${featured.text}</p>
          ${points(featured)}
        </div>
      </article>
      <div class="corporate-offer-showcase__stack">
        ${supporting
          .map(
            (item) => `
              <article class="corporate-offer-card corporate-offer-card--compact" data-reveal>
                <figure class="corporate-offer-card__media">
                  <img src="${item.image}" alt="${item.alt}" style="object-position:${item.imagePosition || "center"}"${imageLoadingAttributes()}>
                  <span class="corporate-offer-card__media-label">${item.detail}</span>
                </figure>
                <div class="corporate-offer-card__body">
                  <div class="corporate-offer-card__meta"><span>${item.number}</span><small>Firmenfitness-Angebot</small></div>
                  <h3>${item.shortTitle || item.title}</h3>
                  <p>${item.text}</p>
                  ${points(item)}
                </div>
              </article>`
          )
          .join("")}
      </div>
    </div>`;
}

function corporateOutcomeShowcase(items) {
  return `
    <div class="corporate-outcome-stage" aria-label="Wirkung von Firmenfitness">
      <article class="corporate-outcome-hero" data-reveal>
        <div class="corporate-outcome-hero__copy">
          <span class="corporate-outcome-hero__eyebrow">Wirkung im Unternehmen</span>
          <h3><span class="corporate-outcome-hero__nowrap">Gesundheit.</span><br>Im Team.<br><span class="corporate-outcome-hero__accent">Mit Wirkung.</span></h3>
          <p>
            Firmenfitness wird dann wertvoll, wenn Mitarbeitende ihre eigene Gesundheit besser verstehen, konkrete Impulse für den Alltag mitnehmen und das Unternehmen gleichzeitig ein starkes internes Format bekommt.
          </p>
        </div>
        <figure class="corporate-outcome-hero__media">
          <img src="/assets/images/dominik-gym-grey.webp" alt="Dominik Dörfl in einer professionellen Coaching-Szene"${imageLoadingAttributes()} />
        </figure>
      </article>
      <div class="corporate-outcome-grid">
        ${items
          .map(
            (item, index) => `
              <article class="corporate-outcome-card" data-reveal>
                <div class="corporate-outcome-card__meta">
                  <span class="corporate-outcome-card__number">${String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                ${
                  item.points?.length
                    ? `
                <ul class="corporate-outcome-card__list" aria-label="${item.detail} Schwerpunkte">
                  ${item.points.map((point) => `<li>${point}</li>`).join("")}
                </ul>`
                    : ""
                }
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

const homeFaq = [
  {
    question: "Ist Camp Dörfl Personal Trainer oder Premium Personal Training in Nürnberg?",
    answer:
      "Beides. Camp Dörfl verbindet Personal Training in Nürnberg mit Premium Personal Training aus Training, Ernährung, Analysen und alltagstauglicher Führung."
  },
  {
    question: "Kann ich bei euch auch Firmenfitness oder Events anfragen?",
    answer:
      "Ja. Neben Personal Training und App-Zugang bietet Camp Dörfl auch Firmenfitness, Gesundheitstage sowie Moderation und Performance-Impulse für Events in Nürnberg an."
  },
  {
    question: "Kann ich auch nur mit der App starten?",
    answer:
      "Ja. Die Camp Dörfl App kann als eigenständiger Einstieg genutzt werden, wenn du Training, Ernährung, Community, Routen und Fortschritt digital strukturieren willst."
  },
  {
    question: "Was bedeutet Performance System bei Camp Dörfl?",
    answer:
      "Training, Ernährung, Präsenz, Energie und Umsetzung werden nicht isoliert behandelt, sondern als zusammenhängendes System geführt. Genau dadurch wird Fortschritt im Alltag stabiler."
  }
];

const appFaq = [
  {
    question: "Was ist die Fitness App von Camp Dörfl?",
    answer:
      "Die Camp Dörfl Fitness App bündelt Training, Ernährung, Check-ins, Scans, GPS-Routen, Community und Fortschrittsanalyse in einem persönlichen Performance-System."
  },
  {
    question: "Für wen eignet sich die Fitness App?",
    answer:
      "Für Menschen, die Training und Ernährung im Alltag klar strukturieren, Fortschritte nachvollziehen und bei Bedarf direkten Coach-Zugang nutzen möchten – eigenständig oder kombiniert mit Coaching."
  },
  {
    question: "Gibt es in der Fitness App Trainings- und Ernährungspläne?",
    answer:
      "Ja. Individuelle Trainingsplanung, Ernährungsstruktur und die tägliche Umsetzung laufen in einer Oberfläche zusammen, statt über mehrere Tools verteilt zu sein."
  },
  {
    question: "Wie starte ich mit der Camp Dörfl Fitness App?",
    answer:
      "Der Einstieg beginnt mit einer kurzen Anfrage. Danach wird geklärt, ob reiner App-Zugang oder die Kombination mit Coaching sinnvoller ist und wie dein Setup aufgebaut wird."
  },
  {
    question: "Was kostet der Zugang zur Fitness App?",
    answer:
      "Das hängt davon ab, ob du die App eigenständig nutzen oder mit Coaching kombinieren willst. Im Erstkontakt wird geklärt, welches Modell zu deinem Ziel, deinem Alltag und deiner gewünschten Begleitung passt."
  },
  {
    question: "Welche Fitness-App-Funktionen helfen im Alltag besonders?",
    answer:
      "Vor allem der Member Bereich, die Trainings- und Ernährungsplanung, der Lebensmittel Truth Score, Barcode- und Live-Scans, GPS-Routen, Clubs und das Score System."
  }
];

const appPreviewCards = [
  {
    detail: "Member Area",
    title: "Dein Überblick für Plan, Check-ins und nächste Schritte.",
    text:
      "Der Member Bereich bringt Tagesstruktur, Score, Camp-Status und die nächsten To-dos in eine klare Startoberfläche.",
    image: "/assets/images/app-screen-member-area.webp",
    alt: "Camp Dörfl App Vorschau mit Member Area und Planansicht"
  },
  {
    detail: "Tracking",
    title: "Ernährung und Eingaben schnell und hochwertig erfassen.",
    text:
      "Foto-Scan, Barcode, Speisekarte und Sprachtracking holen Dokumentation aus dem Chaos und direkt in den Alltag.",
    image: "/assets/images/app-screen-tracking-tools.webp",
    alt: "Camp Dörfl App Vorschau mit Tracker-Werkzeugen und Sprachtracking"
  },
  {
    detail: "Performance Club",
    title: "Community, GPS und Club-Formate in einer App.",
    text:
      "Running Club, Cycling Club, Routen und Vergleiche verbinden digitale Struktur mit echter Bewegung und Motivation.",
    image: "/assets/images/app-screen-club.webp",
    alt: "Camp Dörfl App Vorschau mit Performance Club für Running und Cycling"
  }
];

const coachingFaq = [
  {
    question: "Für wen ist Personal Training in Nürnberg bei Camp Dörfl gedacht?",
    answer:
      "Für Menschen in Nürnberg, die nicht nur trainieren, sondern mit klarer persönlicher Führung, Ernährungsstruktur und messbaren Fortschritten an ihrem Ziel arbeiten möchten – auch bei einem vollen Kalender."
  },
  {
    question: "Was kostet Personal Training oder Premium Personal Training?",
    answer:
      "Eine Einzelsession kostet 120 Euro; inklusive 2D-Körperanalyse sind es 150 Euro. Die 5er-Karte kostet 500 Euro, die 10er-Karte 800 Euro und die Premium Begleitung startet ab 200 Euro monatlich. Alle Details findest du in der Preisübersicht."
  },
  {
    question: "Wie startet Personal Training in Nürnberg bei Camp Dörfl?",
    answer:
      "Der Start beginnt mit einer persönlichen Einordnung deiner Ausgangslage und Ziele. Danach folgen 2D-Körperanalyse, InBody, ein individueller Trainings- und Ernährungsplan, App-Zugang und die laufende Anpassung im Alltag."
  },
  {
    question: "Passt das Training auch bei wenig Zeit und vollem Kalender?",
    answer:
      "Ja. Genau dafür ist das System gemacht. Es richtet sich an Menschen mit Verantwortung, vollen Wochen und wenig Lust auf starre Fitness-Pläne, die am echten Alltag vorbeigehen."
  },
  {
    question: "Wie exklusiv ist die Betreuung?",
    answer:
      "Bewusst exklusiv. Es geht nicht um Masse, sondern um persönliche Führung, direkte Anpassung und einen Rahmen, in dem echte Entwicklung möglich wird."
  },
  {
    question: "Was macht das Training anders als Standardprogramme?",
    answer:
      "Es plant echte Wochen mit ein. Training, Ernährung, Alltagsbelastung, Personal Trainings und Analysen werden auf deinen Kalender abgestimmt."
  },
  {
    question: "Wo findet das Personal Training in Nürnberg statt?",
    answer:
      "Der persönliche Ausgangspunkt ist Camp Dörfl in Nürnberg. Je nach Ziel und vereinbartem Format werden Training, Analyse und Beratung passend geplant; auch Anfragen aus Fürth und Erlangen sind möglich."
  }
];

const corporateFaq = [
  {
    question: "Für welche Unternehmen ist Firmenfitness sinnvoll?",
    answer:
      "Für Unternehmen, die Gesundheitstage, Performance-Impulse oder hochwertige Gesundheitskommunikation mit echter Substanz umsetzen wollen."
  },
  {
    question: "Was kostet Firmenfitness oder ein Gesundheitstag?",
    answer:
      "Der Aufwand richtet sich nach Teamgröße, Modulen, Dauer und gewünschter Betreuung vor Ort. Nach einer kurzen Anfrage lässt sich schnell einschätzen, welches Format fachlich und wirtschaftlich sinnvoll ist."
  },
  {
    question: "Welche drei Firmenfitness-Angebote gibt es?",
    answer:
      "Camp Dörfl bietet Gesundheitstage mit InBody-Körperanalyse und Beratung, berufsfeldbezogene Ernährungsvorträge sowie aktive Bewegungs- und Teamimpulse an. Die Formate können einzeln gebucht oder sinnvoll kombiniert werden."
  },
  {
    question: "Wie läuft ein Gesundheitstag mit Camp Dörfl ab?",
    answer:
      "Die Teilnehmenden werden mit InBody und auf Wunsch mit ergänzender 2D-Technik analysiert. Direkt danach folgt eine persönliche, verständliche Beratung mit konkreten Empfehlungen für Ernährung, Bewegung und gesundheitsfördernde Routinen."
  },
  {
    question: "Für wie viele Mitarbeitende kann Firmenfitness geplant werden?",
    answer:
      "Sowohl kleinere Teams als auch größere Gesundheitstage sind möglich. Die Organisation wird so geplant, dass Teilnehmerzahl, Taktung und Beratungsqualität zusammenpassen."
  },
  {
    question: "Wird der Ernährungsvortrag an das Berufsfeld angepasst?",
    answer:
      "Ja. Der Vortrag ‚Warum Dranbleiben für unsere Gesundheit kein Nice-to-have ist‘ wird auf Arbeitsrealität, Schichtmodell, Büroalltag, körperliche Belastung oder Führungsverantwortung zugeschnitten. Ernährung und Sportintegration werden dadurch konkret statt allgemein."
  },
  {
    question: "Wie viel Abstimmung braucht das intern im Unternehmen?",
    answer:
      "So wenig wie möglich und so viel wie nötig. Camp Dörfl hilft dabei, Organisation, Kommunikation und Durchführung klar zu strukturieren, damit das Format intern leicht organisierbar bleibt."
  },
  {
    question: "Wo bietet Camp Dörfl Firmenfitness an?",
    answer:
      "Camp Dörfl hat seinen Ausgangspunkt in Nürnberg und bietet Gesundheitstage, Vorträge und Team-Aktivierungen deutschlandweit direkt in Unternehmen und öffentlichen Einrichtungen an."
  }
];

const eventFaq = [
  {
    question: "Welche Eventformate moderieren Sie?",
    answer:
      "Firmenveranstaltungen, Sportevents, Galas, Podiumsdiskussionen, Interviews, Eröffnungen und öffentliche Bühnenformate mit professioneller Führung."
  },
  {
    question: "Wie früh sollte ich einen Moderator für ein Event anfragen?",
    answer:
      "Je früher das Briefing steht, desto sauberer lassen sich Dramaturgie, Gäste und Ablauf vorbereiten. Eine frühe Anfrage ist ideal, kurzfristige Formate können je nach Terminlage aber ebenfalls geprüft werden."
  },
  {
    question: "Unterstützen Sie auch bei Ablauf, Briefing und Interviewführung?",
    answer:
      "Ja. Gute Moderation beginnt nicht erst auf der Bühne. Deshalb können Gesprächsführung, Übergänge, Dramaturgie und die Wirkung einzelner Programmpunkte im Vorfeld mitgedacht werden."
  },
  {
    question: "Sind auch Interviews mit besonderen Gästen und Entscheidern möglich?",
    answer:
      "Ja. Genau dafür ist das Format gemacht: klare Gesprächsführung, professionelle Präsenz und ein sicherer Rahmen für starke Gäste, Marken und öffentliche Figuren."
  },
  {
    question: "Kann Moderation auch mit Performance-Impulsen kombiniert werden?",
    answer:
      "Ja. Wenn es zum Event passt, kann die Moderation mit Impulsen zu Leistung, Präsenz, Energie und professionellem Auftreten verbunden werden."
  },
  {
    question: "Was zeichnet die Moderation von Camp Dörfl aus?",
    answer:
      "Energie, Timing, sportliche Sprache, Bühnenruhe und die Fähigkeit, Publikum, Veranstalter und Ablauf in einer klaren Linie zusammenzubringen."
  }
];

const homeDifferentiators = [
  {
    detail: "Klar geführt",
    title: "Klare Führung statt Fitness-Lärm",
    text:
      "Camp Dörfl richtet sich an Menschen, die keine Motivationsshow brauchen, sondern ein System, das auch bei Verantwortung, Termindruck und Familie hält."
  },
  {
    detail: "Digital + persönlich",
    title: "App und Training arbeiten zusammen",
    text:
      "Die Camp Dörfl App und das Premium Personal Training greifen ineinander. So entsteht ein roter Faden statt vieler loser Tools."
  },
  {
    detail: "Messbar",
    title: "Fortschritt wird sichtbar",
    text:
      "Über 2D-Körperanalysen, dokumentierte Einheiten, Scans und klare Check-ins wird Entwicklung schwarz auf weiß nachvollziehbar."
  }
];

const coachingAudienceCards = [
  {
    detail: "Zielgruppe",
    title: "Menschen mit Verantwortung",
    text:
      "Für Menschen, die beruflich liefern, privat viel tragen und sich körperlich wieder mit Klarheit, Präsenz und Energie erleben wollen."
  },
  {
    detail: "Rahmen",
    title: "Volle Kalender, reale Verantwortung",
    text:
      "Das Training ist für Menschen gebaut, die keine perfekten Wochen haben, aber trotzdem Ergebnisse wollen."
  },
  {
    detail: "Anspruch",
    title: "Exklusiv statt austauschbar",
    text:
      "Wenige Plätze, enge Begleitung und ein hochwertiges Setup für Menschen, die ehrliche Führung und messbare Resultate schätzen."
  }
];

const coachingIncludedCards = [
  {
    detail: "Personal Training",
    title: "Einzelstunde",
    text:
      "Technik, Struktur und direkter Trainingsreiz — als Einzeltermin oder 5er-/10er-Karte, ganz ohne Bindung.",
    href: contactHref("premium-training"),
    ctaLabel: "Termin anfragen"
  },
  {
    detail: "Premium Coaching",
    title: "Premium Betreuung",
    text:
      "Eng geführtes System aus gemeinsamen Trainings, 2D-Analyse, Fortschrittskontrolle sowie Trainings- und Ernährungsplanung.",
    href: contactHref("premium-training"),
    ctaLabel: "Premium-Begleitung prüfen"
  },
  {
    detail: "Digitaler Zugang",
    title: "Camp Dörfl App",
    text:
      "Der digitale Einstieg in individuelle Betreuung über Planung, Struktur und klare Fortschrittslogik.",
    href: "/app/",
    ctaLabel: "App entdecken"
  }
];

const coachingOutcomeRows = [
  {
    title: "Mehr Energie im Alltag",
    text:
      "Training und Ernährung werden so strukturiert, dass du dich im Berufsalltag wieder stabiler, fokussierter und belastbarer fühlst."
  },
  {
    title: "Sichtbare körperliche Entwicklung",
    text:
      "Weniger Körperfett, bessere Form und klarere Körperspannung werden nicht nur gespürt, sondern auch sauber dokumentiert."
  },
  {
    title: "Longevity ernst genommen",
    text:
      "Es geht nicht nur um Optik, sondern um ein System, das Gesundheit, Leistungsfähigkeit und Zukunftsfähigkeit verbindet."
  }
];

const homeEntryCards = [
  {
    detail: "01 / LIVE MODERATION",
    titleHtml: "MODERATOR &amp;<br><span>GASTGEBER</span>",
    text:
      "INTERVIEWS, OPENINGS UND BÜHNENFÜHRUNG MIT KLARER WIRKUNG.",
    image: "/assets/images/dominik-stage-suit.webp",
    srcset: "/assets/images/dominik-stage-suit-480.webp 480w, /assets/images/dominik-stage-suit-768.webp 768w, /assets/images/dominik-stage-suit.webp 1650w",
    alt: "Dominik Dörfl als Moderator bei einem Firmenevent",
    theme: "accent",
    href: "/events/",
    buttonLabel: "EVENT PLANEN"
  },
  {
    detail: "02 / CORPORATE HEALTH",
    titleHtml: "GESUNDHEITSTAGE,<br><span>DIE ETWAS BEWEGEN.</span>",
    text:
      "2D-SCAN, INBODY UND BERATUNG FÜR STARKE GESUNDHEITSTAGE.",
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    srcset: "/assets/images/dominik-coaching-bikeerg-480.webp 480w, /assets/images/dominik-coaching-bikeerg-768.webp 768w, /assets/images/dominik-coaching-bikeerg.webp 1236w",
    alt: "Firmenfitness mit InBody Messung und persönlicher Beratung",
    theme: "light",
    href: "/firmenfitness/",
    buttonLabel: "GESUNDHEITSTAG PLANEN"
  },
  {
    detail: "03 / PREMIUM COACHING",
    titleHtml: "PERSONAL TRAINING<br><span>VOM PROFI.</span>",
    text:
      "TRAINING UND ERNÄHRUNG IN PERSÖNLICHER PREMIUM-BEGLEITUNG.",
    image: "/assets/images/dominik-personal-coaching-client.webp",
    srcset: "/assets/images/dominik-personal-coaching-client-480.webp 480w, /assets/images/dominik-personal-coaching-client-768.webp 768w, /assets/images/dominik-personal-coaching-client.webp 1707w",
    alt: "Dominik Dörfl mit einem Klienten im Personal Training im Studio",
    theme: "coaching",
    href: "/personal-trainer-nürnberg/",
    buttonLabel: "TRAINIERE MIT MIR"
  },
  {
    detail: "04 / DIGITAL COACHING",
    titleHtml: "CAMP DÖRFL APP<br><span>DEIN SYSTEM.</span>",
    text:
      "TRAINING, ERNÄHRUNG UND FORTSCHRITT IN EINEM KLAREN DIGITALEN SYSTEM.",
    image: "/assets/images/home-app-banner-coaching.webp",
    srcset: "/assets/images/home-app-banner-coaching-480.webp 480w, /assets/images/home-app-banner-coaching-768.webp 768w, /assets/images/home-app-banner-coaching.webp 864w",
    alt: "Dominik Dörfl zeigt die Camp Dörfl App auf einem Smartphone im Fitnessstudio",
    theme: "app",
    href: "/app/",
    buttonLabel: "APP ENTDECKEN"
  }
];

const homeStoryRows = [
  {
    title: "Persönliche Führung statt Fitness-Overload",
    text:
      "Camp Dörfl sortiert Training, Ernährung und Umsetzung so, dass aus vielen guten Ideen ein belastbares System wird."
  },
  {
    title: "Messbare Entwicklung statt Motivation auf Zeit",
    text:
      "Analysen, Check-ins und klare Prioritäten machen Fortschritt sichtbar und halten ihn auch dann stabil, wenn der Kalender voll ist."
  }
];

const corporateModuleCards = [
  {
    number: "01",
    detail: "Gesundheitstag",
    title: "Gesundheitstag mit InBody und Beratung",
    shortTitle: "Gesundheitstag mit InBody",
    text:
      "Mitarbeitende erhalten eine fundierte InBody-Körperanalyse und direkt im Anschluss eine persönliche Einordnung ihrer Ergebnisse. So wird Gesundheit sichtbar, verständlich und konkret handlungsfähig.",
    points: ["InBody-Körperanalyse", "persönliche Auswertung", "konkrete nächste Schritte"],
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    alt: "Dominik Dörfl erläutert eine Körperanalyse im Rahmen eines Firmenfitness-Angebots",
    imagePosition: "center 36%"
  },
  {
    number: "02",
    detail: "Vortrag",
    title: "Ernährung verstehen. Im Beruf dranbleiben.",
    shortTitle: "Ernährung im Berufsalltag",
    text:
      "Der Vortrag ‚Warum Dranbleiben für unsere Gesundheit kein Nice-to-have ist‘ verbindet gesunde Ernährung mit realistischen Möglichkeiten, Sport in das jeweilige Berufsfeld zu integrieren.",
    points: ["berufsfeldbezogene Inhalte", "Ernährung ohne Dogmen", "Sport realistisch integrieren"],
    image: "/assets/images/dominik-athlete-nutrition.webp",
    alt: "Dominik Dörfl bei einer persönlichen Beratung zu Ernährung und Leistungsfähigkeit",
    imagePosition: "center 24%"
  },
  {
    number: "03",
    detail: "Aktivierung",
    title: "Bewegungsimpuls und Team-Aktivierung",
    shortTitle: "Bewegung &amp; Team-Aktivierung",
    text:
      "Ein aktives Format, das Bewegung direkt erlebbar macht und an Arbeitsumfeld, Zeitfenster und Gruppe angepasst wird. Eigenständig buchbar oder als Praxisbaustein zu Analyse und Vortrag.",
    points: ["direkt im Unternehmen", "an Belastung und Team angepasst", "einzeln oder kombinierbar"],
    image: "/assets/images/dominik-athlete-bike-yellow.webp",
    alt: "Dominik Dörfl im Radtrikot neben seinem Zeitfahrrad auf einer Landstraße",
    imagePosition: "center 20%"
  }
];

const corporateOutcomeRows = [
  {
    detail: "Mitarbeitende",
    title: "Mehr Gesundheitsbewusstsein im Alltag",
    text:
      "Mitarbeitende bekommen konkrete Hinweise zu Bewegung, Energie, Regeneration und Routinen und verstehen ihre eigene Gesundheit deutlich greifbarer."
  },
  {
    detail: "Team",
    title: "Mehr Bindung und Beteiligung",
    text:
      "Gemeinsame Aktivierungen und gute Moderation erzeugen Dynamik, Gesprächsstoff und ein stärkeres Wir-Gefühl im Unternehmen."
  },
  {
    detail: "Unternehmen",
    title: "Mehr hochwertige Gesundheitskommunikation",
    text:
      "Gesundheit wird nicht abstrakt oder belehrend vermittelt, sondern als professionelles Format mit Substanz, Klarheit und guter Außenwirkung."
  },
  {
    detail: "Umsetzung",
    title: "Mehr Umsetzbarkeit im Alltag",
    text:
      "Der Fokus liegt nicht auf Show, sondern auf Formaten, die für Mitarbeitende nachvollziehbar und für Unternehmen organisatorisch gut handhabbar bleiben."
  }
];

const corporateReferenceLogos = [
  {
    name: "Mathias-von-Flurl-Schule",
    image: "/assets/images/reference-mathias-von-flurl-schule.png",
    alt: "Mathias-von-Flurl-Schule Logo",
    url: "https://www.bs2-straubing.de/",
    text: "Berufliche Bildung mit einem Setting, in dem Gesundheit verständlich, nahbar und professionell vermittelt werden soll."
  },
  {
    name: "LWL",
    image: "/assets/images/reference-lwl.png",
    alt: "LWL Logo",
    url: "https://www.lwl.org/",
    text: "Öffentliche Institution mit Fokus auf hochwertige Gesundheitsimpulse für Menschen, Teams und moderne Arbeitswelten."
  },
  {
    name: "Clever Fit",
    image: "/assets/images/reference-clever-fit.png",
    alt: "Clever Fit Logo",
    url: "https://www.clever-fit.com/de/",
    text: "Fitnessnahes Umfeld, in dem Analyse, Beratung und Aktivierung direkt im Trainingskontext wirksam werden."
  },
  {
    name: "NAF",
    image: "/assets/images/reference-naf.png",
    alt: "NAF Logo",
    url: "https://www.nafaxles.com/de/",
    text: "Industrie- und Unternehmensumfeld, in dem Gesundheitstage klar, effizient und mit echter Alltagstauglichkeit umgesetzt werden."
  },
  {
    name: "Heidelberg Materials",
    image: "/assets/images/reference-heidelberg-materials.png",
    alt: "Heidelberg Materials Logo",
    url: "https://www.heidelbergmaterials.de/de",
    text: "Großes Unternehmensumfeld mit Anspruch an professionelle Kommunikation, gute Struktur und spürbaren Mehrwert vor Ort."
  },
  {
    name: "VLB",
    image: "/assets/images/reference-vlb.png",
    alt: "VLB Logo",
    url: "https://www.vlbbayern.de/",
    text: "Verbandsnahes Umfeld, in dem Inhalte verständlich, hochwertig und mit klarer Praxisnähe transportiert werden müssen."
  },
  {
    name: "Stadt Nürnberg",
    image: "/assets/images/reference-stadt-nuernberg.png",
    alt: "Stadt Nürnberg Logo",
    url: "https://www.nuernberg.de/internet/stadtportal/index.html",
    text: "Kommunales Umfeld, in dem Gesundheitskommunikation professionell, zugänglich und für unterschiedliche Zielgruppen anschlussfähig sein muss."
  },
  {
    name: "CCC Erlangen-EMN",
    image: "/assets/images/reference-ccc-erlangen-emn.png",
    alt: "CCC Erlangen-EMN Logo",
    url: "https://ccc-emn.de/",
    text: "Medizinisches und wissenschaftliches Umfeld mit Anspruch an Sorgfalt, Qualität und eine sensible, klare Ansprache."
  },
  {
    name: "alfafood GmbH",
    image: "/assets/images/reference-alfafood.png",
    alt: "alfafood GmbH Logo",
    url: "https://alfafood.eu",
    text: "Ernährungsnaher Kontext, in dem Produktbezug, Beratung und glaubwürdige Umsetzung sinnvoll zusammengeführt werden."
  }
];

const eventFormatCards = [
  {
    number: "01",
    detail: "Firmenveranstaltung",
    title: "Souverän eröffnen",
    text: "Klare Worte, sichere Führung und ein Auftakt, der Marke, Gastgeber und Publikum sofort auf ein Niveau bringt.",
    note: "Ideal für Formate, in denen der erste Eindruck bereits Teil der Markenwirkung ist.",
    image: "/assets/images/event-opening-moderation.webp",
    alt: "Dominik Dörfl bei einer Eröffnung auf der Bühne",
    imagePosition: "center 34%"
  },
  {
    number: "02",
    detail: "Sportevent",
    title: "Energie glaubwürdig transportieren",
    text: "Sportliche Praxis macht die Moderation nahbar, dynamisch und glaubwürdig, ohne dass Inszenierung aufgesetzt wirkt.",
    note: "Für Bühnen, auf denen Dynamik spürbar sein soll und trotzdem alles kontrolliert bleibt.",
    image: "/assets/images/event-stage-interview.webp",
    alt: "Dominik Dörfl moderiert ein Sportevent im Live-Moment",
    imagePosition: "64% 42%"
  },
  {
    number: "03",
    detail: "Gala und Panel",
    title: "Gespräche sauber führen",
    text: "Für Panels, Galas und Interviews, bei denen Timing, Ton und Gesprächsführung professionell getragen werden müssen.",
    note: "Besonders stark, wenn Gäste sichtbar werden sollen und der Ablauf elegant zusammenhalten muss.",
    image: "/assets/images/event-panel-talk.webp",
    alt: "Dominik Dörfl bei einer Paneldiskussion auf einer Bühne",
    imagePosition: "68% 54%"
  }
];

const eventReferenceLogos = [
  {
    name: "NRW BBKV e.V.",
    image: "/assets/images/event-reference-nrw-bbkv.jpg",
    alt: "NRW BBKV e.V. Logo",
    url: "https://www.instagram.com/nrw_bbkv/",
    text: "Landesverband für Bodybuilding und Fitness in Nordrhein-Westfalen mit starkem Bühnen- und Wettkampfbezug."
  },
  {
    name: "BLV BFK e.V.",
    image: "/assets/images/event-reference-blv-bfk.png",
    alt: "Logo des Bayerischen Landesverbands für Bodybuilding, Fitness und Kraftsport im DBFV e.V.",
    url: "https://blv-bfk.de/",
    text: "Bayerischer Landesverband für Bodybuilding, Fitness und Kraftsport mit professioneller Event- und Bühnenstruktur."
  },
  {
    name: "DBFV e.V.",
    image: "/assets/images/event-reference-dbfv.png",
    alt: "DBFV e.V. Logo",
    url: "https://www.dbfv.de/",
    text: "Deutscher Bodybuilding und Fitness Verband e.V. mit offiziellen Meisterschaften, Wertungen und Bühnenformaten."
  },
  {
    name: "VBB e.V.",
    image: "/assets/images/event-reference-vbb.jpg",
    alt: "VBB e.V. Logo",
    url: "https://www.instagram.com/vbb_ev/",
    text: "Verband mit sportnahen Live-Formaten, bei denen Präsenz, Timing und saubere Moderation direkt zählen."
  },
  {
    name: "Segmüller",
    image: "/assets/images/event-reference-segmueller.png",
    alt: "Segmüller Logo",
    url: "https://www.segmueller.de/",
    text: "Große Marken- und Veranstaltungsumgebung mit Anspruch an Auftreten, Ablauf und einen professionellen Gastgeberrahmen."
  },
  {
    name: "BZKF",
    image: "/assets/images/event-reference-bzkf.png",
    alt: "BZKF Logo",
    url: "https://bzkf.de/",
    text: "Formate mit Verbandshintergrund, in denen Vertrauen, klare Führung und ein würdiger Bühnenrahmen wichtig sind."
  }
];

const partnerValueCards = [
  {
    title: "Performance wird hier wirklich gelebt.",
    text:
      "Camp Dörfl verbindet Athletik, Bühne, Training, Unternehmen und Community. Genau dadurch wirken Marken nicht aufgesetzt, sondern sauber eingebettet."
  },
  {
    title: "Live, digital und im Alltag präsent.",
    text:
      "Kooperationen können über Events, Content, App-Umfeld, Community und direkte Produktnähe gleichzeitig sichtbar werden."
  },
  {
    title: "Partnerschaften folgen Haltung statt Beliebigkeit.",
    text:
      "Nicht jede Marke passt. Entscheidend sind Qualität, Zielgruppenfit und eine Zusammenarbeit, die langfristig glaubwürdig bleibt."
  }
];

const partnerBrandCards = [
  {
    name: "XXL Nutrition",
    label: "Nutrition Partner",
    image: "/assets/images/partner-xxl-nutrition-logo.png",
    alt: "XXL Nutrition Logo",
    href: "https://www.xxlnutrition.com/",
    linkLabel: "Zur Website",
    meta: "Code: Dominik",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/jvV0XFf21D8?autoplay=1&rel=0&modestbranding=1&playsinline=1",
    videoWatchUrl: "https://www.youtube.com/watch?v=jvV0XFf21D8",
    videoImage: "/assets/images/dominik-athlete-nutrition.webp",
    videoAlt: "Dominik Dörfl im Performance- und Ernaehrungs-Kontext fuer XXL Nutrition",
    videoHeadline: "XXL Nutrition im Einsatz.",
    videoActionLabel: "Short laden",
    videoEyebrow: "XXL Nutrition",
    videoButtonLabel: "Rabattcode:Dominik",
    text:
      "Sporternaehrung mit Fokus auf Protein, Kreatin, Pre-Workout und Supplements, die Leistung und Alltag sinnvoll verbinden."
  },
  {
    name: "AEKE",
    label: "Smart Gym Partner",
    image: "/assets/images/partner-aeke-logo.png",
    alt: "AEKE Logo",
    href: "https://eu.aeke.com/products/buy-aeke-k1?sca_ref=11019964.wKUJzkQCK3",
    linkLabel: "Zum AEKE K1",
    meta: "Direkter Partnerlink",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/yi6t6tSS4s0?autoplay=1&rel=0&modestbranding=1&playsinline=1",
    videoWatchUrl: "https://youtube.com/shorts/yi6t6tSS4s0",
    videoImage: "/assets/images/dominik-gym-grey.webp",
    videoAlt: "Dominik Dörfl beim Training im Gym",
    videoHeadline: "AEKE im Einsatz.",
    videoActionLabel: "Short laden",
    videoEyebrow: "YouTube Short",
    videoButtonLabel: "AEKE",
    videoNote:
      "Der Short zeigt AEKE dort, wo Partnerschaft glaubwürdig wird: im echten Trainingskontext statt in reiner Produktbehauptung.",
    text:
      "AI-gestuetztes Home-Gym-System mit 320+ Bewegungen, Ganzkoerpertraining und smart gefuehrten Workouts in hochwertiger Hardware."
  }
];

const partnerActivationRows = [
  {
    title: "Live und Bühne",
    text:
      "Events, Moderation, Panels und Vor-Ort-Präsenz bringen Marken in einen professionellen und echten Rahmen."
  },
  {
    title: "Content mit Alltagstiefe",
    text:
      "Produkte und Partnerschaften können dort gezeigt werden, wo Training, Ernährung und Leistung wirklich stattfinden."
  },
  {
    title: "App und digitales Umfeld",
    text:
      "Digitale Berührungspunkte sorgen dafür, dass Kooperationen nicht nur kurz sichtbar, sondern wiederkehrend erlebbar werden."
  },
  {
    title: "Community und Orte",
    text:
      "Mit Gym, Community, Unternehmen und Event-Formaten entstehen Berührungspunkte weit über klassische Werbung hinaus."
  }
];

const partnerWorkflowSteps = [
  "Kurzes Gespräch zu Marke, Zielgruppe und gewünschter Präsenz",
  "Prüfung von Zielgruppenfit, Haltung und echtem Mehrwert für beide Seiten",
  "Auswahl passender Formate wie Event, Content, App, Community oder Aktivierung",
  "Klare Umsetzung mit festen Zuständigkeiten, Timing und professioneller Kommunikation",
  "Laufende Auswertung, damit die Zusammenarbeit nicht nur sichtbar, sondern sinnvoll wird"
];

const partnerFaq = [
  {
    question: "Für welche Marken sind Partnerschaften mit Camp Dörfl interessant?",
    answer:
      "Vor allem für Marken, Produkte und Orte, die zu Leistung, Gesundheit, Ernährung, Training, Präsenz oder Community passen und glaubwürdig im Alltag verankert werden sollen."
  },
  {
    question: "Geht es nur um Social Media oder auch um reale Präsenz?",
    answer:
      "Beides ist möglich. Gerade die Verbindung aus Content, Event, Ort, Community und echter Anwendung macht Partnerschaften bei Camp Dörfl besonders wertvoll."
  },
  {
    question: "Sind auch regionale Kooperationen im Raum Nürnberg sinnvoll?",
    answer:
      "Ja. Regionale Partnerschaften können besonders stark sein, wenn sie Training, Unternehmen, Events oder Community direkt vor Ort erlebbar machen."
  },
  {
    question: "Wie startet eine Zusammenarbeit am besten?",
    answer:
      "Mit einer kurzen Anfrage und einer ehrlichen Einordnung. Danach wird geprüft, ob Marke, Produkt, Zielgruppe und Format wirklich zusammenpassen."
  }
];

const bodybuildingCalendarSources = [
  {
    id: "npc-germany",
    number: "01",
    name: "NPC Germany",
    descriptor: "NPC Worldwide · IFBB Pro League",
    sourceUrl: "https://www.ifbbproleaguegermany.de/",
    sourceLabel: "Offizieller NPC-Germany-Kalender",
    note: "Regional Shows, Pro Qualifier und Pro Shows in Deutschland.",
    events: [
      { date: "2026-08-29", label: "29. August 2026", name: "NPC Deutsche Meisterschaft", location: "Sankt Leon-Rot", type: "Regional Show" },
      { date: "2026-09-12", label: "12. September 2026", name: "European Championship", location: "Offenbach am Main", type: "Pro Qualifier" },
      { date: "2026-09-13", label: "13. September 2026", name: "Europa Pro", location: "Offenbach am Main", type: "Olympia Qualifier · Pro Show" },
      { date: "2026-09-26", label: "26. September 2026", name: "Weider Classic", location: "Friedberg", type: "Regional Show" },
      { date: "2026-10-03", label: "3. Oktober 2026", name: "Int. South German Cup", location: "Erlangen", type: "Regional Show" },
      { date: "2026-11-14", label: "14. November 2026", name: "NRW Cup", location: "Oer-Erkenschwick", type: "Regional Show" },
      { date: "2026-11-21", label: "21. November 2026", name: "Dennis James Classic", location: "Sankt Leon-Rot", type: "Pro Qualifier" },
      { date: "2026-03-28", label: "28. März 2026", name: "BaWü Championship", location: "Deutschland", type: "Regional Show", past: true },
      { date: "2026-04-04", label: "4. April 2026", name: "Ruhr Cup", location: "Deutschland", type: "Regional Show", past: true },
      { date: "2026-04-11", label: "11. April 2026", name: "Massive Soldier Berlin Classic", location: "Berlin", type: "Regional Show", past: true },
      { date: "2026-04-16", label: "16. April 2026", name: "FIBO Pro Qualifier", location: "Köln", type: "Pro Qualifier", past: true },
      { date: "2026-04-17", label: "17. April 2026", name: "FIBO Pro Championships", location: "Köln", type: "Pro Show", past: true },
      { date: "2026-04-25", label: "25. April 2026", name: "Iron Cup", location: "Deutschland", type: "Regional Show", past: true },
      { date: "2026-05-02", label: "2. Mai 2026", name: "All Stars Classic", location: "Deutschland", type: "Regional Show", past: true }
    ]
  },
  {
    id: "dbfv",
    number: "02",
    name: "DBFV e.V.",
    descriptor: "Deutscher Bodybuilding- und Fitness-Verband",
    sourceUrl: "https://www.dbfv.de/termine/",
    sourceLabel: "Offizieller DBFV-Terminkalender",
    note: "Nationale und internationale Meisterschaften des DBFV und seiner Landesverbände.",
    events: [
      { date: "2026-10-10", label: "10. Oktober 2026", name: "Int. Deutsche Newcomer", location: "Hofheim", type: "Newcomer" },
      { date: "2026-10-11", label: "11. Oktober 2026", name: "Int. Süddeutsche Meisterschaft", location: "Hofheim", type: "inkl. Junioren & Masters" },
      { date: "2026-10-17", label: "17. Oktober 2026", name: "Int. Deutsche Jugend-, Junioren- & Masters-Meisterschaft", location: "Petersberg", type: "Nationale Meisterschaft" },
      { date: "2026-10-18", label: "18. Oktober 2026", name: "Pure Classics", location: "Petersberg", type: "Classic Wettkampf" },
      { date: "2026-10-25", label: "25. Oktober 2026", name: "Int. Großer Preis von Hessen", location: "Stadthalle Fritzlar", type: "Regionalmeisterschaft" },
      { date: "2026-11-01", label: "1. November 2026", name: "Int. Berliner Meisterschaft", location: "Fontane-Haus, Berlin", type: "Regionalmeisterschaft" },
      { date: "2026-11-07", label: "7. November 2026", name: "Int. Ostdeutsche Meisterschaft", location: "Stadthalle Apolda", type: "Regionalmeisterschaft" },
      { date: "2026-11-14", label: "14. November 2026", name: "Int. BaWü Meisterschaft", location: "Staufenhalle Plüderhausen", type: "Regionalmeisterschaft" },
      { date: "2026-11-21", label: "21. November 2026", name: "Int. NRW Landesmeisterschaft", location: "Rheinhausenhalle Duisburg", type: "Landesmeisterschaft" },
      { date: "2026-11-22", label: "22. November 2026", name: "Int. Bayerische Meisterschaft", location: "Gersthofen", type: "Landesmeisterschaft" },
      { date: "2026-11-28", label: "28. November 2026", name: "Int. Deutsche Meisterschaft", location: "Wiesloch", type: "Deutsche Meisterschaft" },
      { date: "2026-04-26", label: "26. April 2026", name: "Deutsche Jugend-, Junioren- & Masters-Meisterschaft", location: "Petersberg", type: "Nationale Meisterschaft", past: true },
      { date: "2026-05-09", label: "9. Mai 2026", name: "NRW Landesmeisterschaft", location: "Rheinhausenhalle Duisburg", type: "Landesmeisterschaft", past: true },
      { date: "2026-05-23", label: "23. Mai 2026", name: "Deutsche Meisterschaft", location: "Wiesloch", type: "Deutsche Meisterschaft", past: true }
    ]
  },
  {
    id: "gnbf",
    number: "03",
    name: "GNBF e.V.",
    descriptor: "German Natural Bodybuilding & Fitness Federation",
    sourceUrl: "https://gnbf.net/meisterschaften/",
    sourceLabel: "Offizielle GNBF-Meisterschaften",
    note: "Natural-Bodybuilding-Meisterschaften mit eigenem Anti-Doping-Regelwerk.",
    events: [
      { date: "2026-09-19", endDate: "2026-09-20", label: "19.–20. September 2026", name: "10th GNBF Int. German Championships", location: "Stadthalle Walsrode", type: "inkl. Newcomer Championships" },
      { date: "2026-11-28", label: "28. November 2026", name: "1st GNBF German Open", location: "Stadthalle Walsrode", type: "German Open" }
    ]
  },
  {
    id: "nac-germany",
    number: "04",
    name: "NAC Germany",
    descriptor: "National Athletic Committee Germany",
    sourceUrl: "https://www.nac-germany.de/termine.html",
    sourceLabel: "Offizieller NAC-Terminkalender",
    note: "Newcomer-, Regional-, Deutsche und internationale Meisterschaften.",
    events: [
      { date: "2026-10-24", label: "24. Oktober 2026", name: "Int. Deutsche Newcomer – First Season", location: "PRISMA, Freiberg am Neckar", type: "Newcomer" },
      { date: "2026-10-24", label: "24. Oktober 2026", name: "Int. German Masters – Herbstsaison", location: "PRISMA, Freiberg am Neckar", type: "Masters" },
      { date: "2026-10-24", label: "24. Oktober 2026", name: "NAC Classic PRO AM", location: "PRISMA, Freiberg am Neckar", type: "Pro/Am" },
      { date: "2026-10-25", label: "25. Oktober 2026", name: "Int. Süddeutsche Meisterschaft", location: "PRISMA, Freiberg am Neckar", type: "Regionalmeisterschaft" },
      { date: "2026-11-07", label: "7. November 2026", name: "Großer Preis von Norddeutschland", location: "Stadthalle Walsrode", type: "Regionalmeisterschaft" },
      { date: "2026-11-07", label: "7. November 2026", name: "Int. Ostdeutsche Meisterschaft", location: "Fontane Kulturzentrum, Berlin", type: "Regionalmeisterschaft" },
      { date: "2026-11-08", label: "8. November 2026", name: "Int. Westdeutsche Meisterschaft", location: "Stadthalle Rheinbach", type: "Regionalmeisterschaft" },
      { date: "2026-11-14", label: "14. November 2026", name: "Int. Deutsche Meisterschaft – Herbst", location: "Koblenz", type: "Deutsche Meisterschaft" },
      { date: "2026-11-21", label: "21. November 2026", name: "Universe 2026", location: "Stadthalle Walsrode", type: "International" },
      { date: "2026-04-12", label: "12. April 2026", name: "Deutsche Newcomer Meisterschaft – First Season", location: "Deutschland", type: "Newcomer", past: true },
      { date: "2026-04-12", label: "12. April 2026", name: "German Masters – Frühjahr", location: "Deutschland", type: "Masters", past: true },
      { date: "2026-04-12", label: "12. April 2026", name: "Frey Classic", location: "Deutschland", type: "Pro/Am", past: true },
      { date: "2026-04-19", label: "19. April 2026", name: "Süddeutsche Meisterschaft", location: "Deutschland", type: "Regionalmeisterschaft", past: true },
      { date: "2026-05-02", label: "2. Mai 2026", name: "35. Int. Nordsee-Cup", location: "Norddeutschland", type: "Regionalmeisterschaft", past: true },
      { date: "2026-05-02", label: "2. Mai 2026", name: "Ostdeutsche Meisterschaft – Frühjahr", location: "Ostdeutschland", type: "Regionalmeisterschaft", past: true },
      { date: "2026-05-03", label: "3. Mai 2026", name: "Westdeutsche Meisterschaft – Frühjahr", location: "Stadthalle Rheinbach", type: "Regionalmeisterschaft", past: true },
      { date: "2026-05-23", label: "23. Mai 2026", name: "Deutsche Meisterschaft & WM-Qualifikation", location: "Stadthalle Walsrode", type: "Deutsche Meisterschaft", past: true },
      { date: "2026-06-06", label: "6. Juni 2026", name: "Weltmeisterschaft 2026", location: "Riga, Lettland", type: "International", past: true }
    ]
  },
  {
    id: "wff-nabba",
    number: "05",
    name: "WFF / NABBA",
    descriptor: "DFFV e.V. · WFF & NABBA Germany",
    sourceUrl: "https://www.wff-germany.de/termine",
    sourceLabel: "Offizieller WFF/NABBA-Terminkalender",
    note: "Deutsche Meisterschaften sowie ausgewählte Europa-, Welt- und Universe-Termine.",
    events: [
      { date: "2026-10-17", endDate: "2026-10-18", label: "17.–18. Oktober 2026", name: "WFF / NABBA Deutsche Meisterschaft", location: "Bad Langensalza, Thüringen", type: "Deutsche Meisterschaft" },
      { date: "2026-11-01", label: "1. November 2026", name: "NABBA Universe", location: "Vereinigtes Königreich", type: "International" },
      { date: "2026-11-14", endDate: "2026-11-15", label: "14.–15. November 2026", name: "WFF Universe", location: "Kulmbach", type: "International" },
      { date: "2026-06-06", label: "6. Juni 2026", name: "NABBA Europameisterschaft", location: "Graz, Österreich", type: "International", past: true },
      { date: "2026-06-06", endDate: "2026-06-07", label: "6.–7. Juni 2026", name: "WFF Europameisterschaft", location: "Manchester, UK", type: "International", past: true },
      { date: "2026-06-20", label: "20. Juni 2026", name: "NABBA Weltmeisterschaft", location: "Newcastle, UK", type: "International", past: true },
      { date: "2026-07-25", endDate: "2026-07-26", label: "25.–26. Juli 2026", name: "WFF Weltmeisterschaft", location: "Jaunde, Kamerun", type: "International", past: true }
    ]
  },
  {
    id: "pca-germany",
    number: "06",
    name: "PCA Germany",
    descriptor: "Physical Culture Association",
    sourceUrl: "https://www.pcaofficial.com/international",
    sourceLabel: "Offizieller PCA-International-Kalender",
    note: "Deutsche PCA-Shows in Vallendar; Anmeldung und Klassen direkt über PCA.",
    events: [
      { date: "2026-10-03", label: "3. Oktober 2026", name: "PCA German Championships", location: "Stadt- und Kongresshalle Vallendar", type: "German Championships" },
      { date: "2026-05-09", label: "9. Mai 2026", name: "PCA German Open", location: "Kongresshalle Vallendar", type: "German Open", past: true }
    ]
  },
  {
    id: "ifbb-pro-league",
    number: "07",
    name: "IFBB Professional League",
    descriptor: "IFBB Pro League · internationale Profi-Shows",
    sourceUrl: "https://www.ifbbpro.com/schedule/",
    sourceLabel: "Offizieller IFBB-Pro-League-Kalender",
    scope: "international",
    note: "Ausgewählte kommende Profi-Shows, pro Veranstaltung zusammengeführt. Der offizielle Kalender listet zusätzlich alle Starts nach Division und Masters-Klasse.",
    events: [
      { date: "2026-08-14", endDate: "2026-08-15", label: "14.–15. August 2026", name: "Texas Pro", location: "Irving, Texas, USA", type: "IFBB Pro League" },
      { date: "2026-08-22", endDate: "2026-08-23", label: "22.–23. August 2026", name: "Austrian Oak Pro", location: "Österreich", type: "IFBB Pro League" },
      { date: "2026-08-22", label: "22. August 2026", name: "Rising Phoenix Pro", location: "Phoenix, Arizona, USA", type: "IFBB Pro League" },
      { date: "2026-08-22", endDate: "2026-08-23", label: "22.–23. August 2026", name: "Asian Pro Championships", location: "Südkorea", type: "IFBB Pro League" },
      { date: "2026-08-30", label: "30. August 2026", name: "Alina Popa Classic Pro", location: "Rumänien", type: "IFBB Pro League" },
      { date: "2026-09-06", label: "6. September 2026", name: "Pro Masters World Championships", location: "Pittsburgh, Pennsylvania, USA", type: "IFBB Pro League Masters" },
      { date: "2026-09-13", label: "13. September 2026", name: "Europa Pro Championships", location: "Offenbach, Deutschland", type: "IFBB Pro League" },
      { date: "2026-09-24", endDate: "2026-09-27", label: "24.–27. September 2026", name: "Olympia 2026", location: "Las Vegas, Nevada, USA", type: "IFBB Pro League" },
      { date: "2026-10-02", endDate: "2026-10-03", label: "2.–3. Oktober 2026", name: "France Pro", location: "Frankreich", type: "IFBB Pro League" },
      { date: "2026-10-10", label: "10. Oktober 2026", name: "EVLS Prague Pro", location: "Prag, Tschechien", type: "IFBB Pro League" },
      { date: "2026-10-17", label: "17. Oktober 2026", name: "UK Pro", location: "Vereinigtes Königreich", type: "IFBB Pro League" },
      { date: "2026-10-25", label: "25. Oktober 2026", name: "Slovakia Pro", location: "Slowakei", type: "IFBB Pro League" },
      { date: "2026-10-31", endDate: "2026-11-01", label: "31. Oktober–1. November 2026", name: "Poland Pro", location: "Polen", type: "IFBB Pro League" },
      { date: "2026-11-07", endDate: "2026-11-08", label: "7.–8. November 2026", name: "Romania Muscle Fest Pro", location: "Rumänien", type: "IFBB Pro League" },
      { date: "2026-11-13", endDate: "2026-11-15", label: "13.–15. November 2026", name: "Ben Weider Natural Pro", location: "Alexandria, Virginia, USA", type: "IFBB Pro League Natural" },
      { date: "2026-11-21", endDate: "2026-11-22", label: "21.–22. November 2026", name: "Atlantic Coast Pro", location: "Fort Lauderdale, Florida, USA", type: "IFBB Pro League" },
      { date: "2026-11-29", label: "29. November 2026", name: "Spain Pro", location: "Spanien", type: "IFBB Pro League" },
      { date: "2026-12-05", endDate: "2026-12-06", label: "5.–6. Dezember 2026", name: "Saudi Arabia Pro", location: "Riad, Saudi-Arabien", type: "IFBB Pro League" }
    ]
  },
  {
    id: "npc-worldwide",
    number: "08",
    name: "NPC Worldwide",
    descriptor: "Internationale Regionals · Pro Qualifier",
    sourceUrl: "https://www.ifbbpro.com/npc-worldwide/schedule/",
    sourceLabel: "Offizieller NPC-Worldwide-Kalender",
    scope: "international",
    note: "Kommende internationale Pro Qualifier mit direktem Weg zur IFBB Pro Card. Regionals und weitere Ländertermine stehen im verlinkten vollständigen Live-Kalender.",
    events: [
      { date: "2026-08-14", endDate: "2026-08-16", label: "14.–16. August 2026", name: "Sud Americano Argentina Pro Qualifier", location: "Buenos Aires, Argentinien", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-08-15", endDate: "2026-08-16", label: "15.–16. August 2026", name: "Pharlabs Mexico Grand Battle Pro Qualifier", location: "Monterrey, Mexiko", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-08-22", endDate: "2026-08-23", label: "22.–23. August 2026", name: "Austrian Oak Pro Qualifier", location: "Wien, Österreich", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-08-22", endDate: "2026-08-23", label: "22.–23. August 2026", name: "World of Monsterzym Asian Pro Qualifier", location: "Seoul, Südkorea", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-01", label: "1. September 2026", name: "Algeria Pro Qualifier", location: "Algerien", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-05", endDate: "2026-09-06", label: "5.–6. September 2026", name: "Italy Pro Qualifier", location: "Mailand, Italien", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-05", endDate: "2026-09-06", label: "5.–6. September 2026", name: "Asian Masters Pro Qualifier", location: "Hongkong, China", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-05", endDate: "2026-09-06", label: "5.–6. September 2026", name: "World of Monsterzym Natural Pro Qualifier", location: "Seoul, Südkorea", type: "NPC Worldwide Natural Pro Qualifier" },
      { date: "2026-09-06", label: "6. September 2026", name: "AGP Philippines Pro Qualifier", location: "Manila, Philippinen", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-11", endDate: "2026-09-12", label: "11.–12. September 2026", name: "Iraq Pro Qualifier", location: "Kirkuk, Irak", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-11", endDate: "2026-09-12", label: "11.–12. September 2026", name: "Amateur Olympia Latin America", location: "Santo Domingo, Dominikanische Republik", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-12", label: "12. September 2026", name: "Huanji China Pro Qualifier", location: "Xi’an, China", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-12", endDate: "2026-09-13", label: "12.–13. September 2026", name: "European Pro Qualifier", location: "Offenbach, Deutschland", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-17", endDate: "2026-09-20", label: "17.–20. September 2026", name: "Turkey Pro Qualifier", location: "Izmir, Türkei", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-20", label: "20. September 2026", name: "GASP Classic Sweden Pro Qualifier", location: "Södertälje, Schweden", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-22", endDate: "2026-09-23", label: "22.–23. September 2026", name: "Amateur Olympia Las Vegas", location: "Las Vegas, Nevada, USA", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-09-26", endDate: "2026-09-27", label: "26.–27. September 2026", name: "Amateur Olympia South Korea", location: "Seoul, Südkorea", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-10-03", label: "3. Oktober 2026", name: "Toulouse Pro Qualifier", location: "Toulouse-Labège, Frankreich", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-10-03", label: "3. Oktober 2026", name: "Canadian National Pro Qualifier", location: "Toronto, Kanada", type: "NPC Worldwide Pro Qualifier" },
      { date: "2026-10-10", label: "10. Oktober 2026", name: "EVLS Prague Pro Qualifier", location: "Prag, Tschechien", type: "NPC Worldwide Pro Qualifier" }
    ]
  },
  {
    id: "ifbb-international",
    number: "09",
    name: "IFBB International",
    descriptor: "Offizieller internationaler IFBB-Kalender",
    sourceUrl: "https://ifbb.com/wp-content/uploads/2026/05/calendar-2026-1.pdf",
    sourceLabel: "Offizieller IFBB-Kalender 2026",
    scope: "international",
    note: "Internationale IFBB-Meisterschaften, Cups, Diamond Cups und Mr.-Universe-Termine aus dem offiziellen Kalenderstand vom 21. Mai 2026.",
    events: [
      { date: "2026-08-15", endDate: "2026-08-16", label: "15.–16. August 2026", name: "Miss & Mister America IFBB Cup", location: "Guayaquil, Ecuador", type: "IFBB International" },
      { date: "2026-08-27", endDate: "2026-08-30", label: "27.–30. August 2026", name: "Istanbul Fitness Expo & World Fitness Sport Games", location: "Istanbul, Türkei", type: "IFBB International" },
      { date: "2026-08-27", endDate: "2026-08-31", label: "27.–31. August 2026", name: "Central American & Caribbean Championships", location: "Guatemala", type: "IFBB International" },
      { date: "2026-09-04", endDate: "2026-09-06", label: "4.–6. September 2026", name: "Mr Universe Lebanon", location: "Beirut, Libanon", type: "IFBB International" },
      { date: "2026-09-04", endDate: "2026-09-06", label: "4.–6. September 2026", name: "Mr Universe Switzerland", location: "Schweiz", type: "IFBB International" },
      { date: "2026-09-04", endDate: "2026-09-06", label: "4.–6. September 2026", name: "IFBB Fitlap Cup", location: "Tallinn, Estland", type: "IFBB International" },
      { date: "2026-09-12", endDate: "2026-09-13", label: "12.–13. September 2026", name: "IFBB Mr Universe Austria", location: "Österreich", type: "IFBB International" },
      { date: "2026-09-12", label: "12. September 2026", name: "IFBB Diamond Cup Prague", location: "Prag, Tschechien", type: "IFBB International" },
      { date: "2026-09-15", endDate: "2026-09-18", label: "15.–18. September 2026", name: "IFBB West Asian Championships", location: "Jerewan, Armenien", type: "IFBB International" },
      { date: "2026-09-17", endDate: "2026-09-20", label: "17.–20. September 2026", name: "IFBB South American Championships", location: "Buenos Aires, Argentinien", type: "IFBB International" },
      { date: "2026-09-18", endDate: "2026-09-20", label: "18.–20. September 2026", name: "IFBB Diamond Cup Luxembourg", location: "Luxemburg", type: "IFBB International" },
      { date: "2026-09-30", endDate: "2026-10-05", label: "30. September–5. Oktober 2026", name: "IFBB World Men’s & Women’s Championships", location: "Ajman, Vereinigte Arabische Emirate", type: "IFBB Weltmeisterschaft" },
      { date: "2026-10-10", label: "10. Oktober 2026", name: "IFBB Mr Universe Canarias", location: "Teneriffa, Spanien", type: "IFBB International" },
      { date: "2026-10-16", endDate: "2026-10-17", label: "16.–17. Oktober 2026", name: "IFBB Diamond Cup Skopje", location: "Skopje, Nordmazedonien", type: "IFBB International" },
      { date: "2026-10-16", endDate: "2026-10-17", label: "16.–17. Oktober 2026", name: "IFBB World Fitness Cup", location: "Bratislava, Slowakei", type: "IFBB International" },
      { date: "2026-10-25", endDate: "2026-10-27", label: "25.–27. Oktober 2026", name: "IFBB Mediterranean Championships", location: "Santorini, Griechenland", type: "IFBB International" },
      { date: "2026-11-05", endDate: "2026-11-08", label: "5.–8. November 2026", name: "IFBB Asian Championships", location: "Bangkok, Thailand", type: "IFBB International" },
      { date: "2026-11-12", endDate: "2026-11-15", label: "12.–15. November 2026", name: "IFBB African Championships", location: "Alexandria, Ägypten", type: "IFBB International" },
      { date: "2026-11-13", endDate: "2026-11-15", label: "13.–15. November 2026", name: "IFBB Diamond Cup Cancun", location: "Cancún, Mexiko", type: "IFBB International" },
      { date: "2026-11-27", endDate: "2026-11-28", label: "27.–28. November 2026", name: "Mr Universe Verona", location: "Verona, Italien", type: "IFBB International" },
      { date: "2026-12-05", endDate: "2026-12-06", label: "5.–6. Dezember 2026", name: "IFBB Mr Universe Portugal", location: "Póvoa, Portugal", type: "IFBB International" },
      { date: "2026-12-12", endDate: "2026-12-13", label: "12.–13. Dezember 2026", name: "Mr Universe Roma", location: "Pomezia, Italien", type: "IFBB International" }
    ]
  }
];

const bodybuildingCalendarFaq = [
  {
    question: "Welche Bodybuilding-Verbände sind in der Übersicht enthalten?",
    answer:
      "Die Seite bündelt bestätigte Termine von NPC Germany, DBFV e.V., GNBF e.V., NAC Germany, WFF/NABBA Germany und PCA Germany."
  },
  {
    question: "Kann ich unabhängig von meinem bisherigen Verband starten?",
    answer:
      "Das hängt vom jeweiligen Regelwerk ab. Mitgliedschaft, Starterlizenz, Newcomer-Status und mögliche Qualifikationen müssen immer direkt beim ausrichtenden Verband geprüft werden."
  },
  {
    question: "Welcher Verband veranstaltet Natural-Bodybuilding-Wettkämpfe?",
    answer:
      "In dieser Übersicht steht die GNBF ausdrücklich für Natural Bodybuilding mit eigenem Anti-Doping-Regelwerk. Die konkreten Voraussetzungen veröffentlicht die GNBF auf ihrer offiziellen Website."
  },
  {
    question: "Wo finde ich Anmeldung, Klassen und Startgebühren?",
    answer:
      "Jeder Verbandsblock führt direkt zur offiziellen Quelle. Dort stehen die verbindlichen Angaben zu Anmeldung, Klassen, Lizenzen, Gebühren, Waage und Ablauf."
  },
  {
    question: "Sind die Termine garantiert?",
    answer:
      "Nein. Die Übersicht wird redaktionell aus offiziellen Verbandsquellen zusammengetragen. Verbindlich ist immer die aktuelle Veröffentlichung des jeweiligen Verbandes oder Veranstalters."
  },
  {
    question: "Welche Frauenklassen gibt es bei Bodybuilding-Wettkämpfen?",
    answer:
      "Je nach Verband werden unter anderem Bikini, Wellness, Figure, Women's Physique und Frauen-Bodybuilding angeboten. Bezeichnungen, Größenklassen, Gewichtslimits und Voraussetzungen unterscheiden sich; verbindlich ist die Ausschreibung des jeweiligen Veranstalters."
  },
  {
    question: "Wann fand die Bodybuilding-Weltmeisterschaft 2026 in Riga statt?",
    answer:
      "Die in diesem Kalender geführte NAC-Weltmeisterschaft 2026 fand am 6. Juni 2026 in Riga, Lettland, statt. Der Termin bleibt als bereits ausgetragener Wettkampf im Jahresarchiv sichtbar."
  },
  {
    question: "Was ist der Unterschied zwischen IFBB, IFBB Pro League und NPC Worldwide?",
    answer:
      "Die IFBB Professional League führt professionelle Wettbewerbe wie Olympia-Qualifikationsshows. NPC Worldwide organisiert internationale Regionals und Pro Qualifier auf dem Weg zur IFBB Pro Card. Die IFBB veröffentlicht einen eigenen internationalen Meisterschafts-, Cup- und Mr.-Universe-Kalender. Deshalb werden die drei Systeme hier getrennt dargestellt."
  },
  {
    question: "Sind alle Klassen einer IFBB-Pro-Show einzeln aufgeführt?",
    answer:
      "Nein. Damit eine Veranstaltung nicht mehrfach erscheint, wird jede ausgewählte Pro-Show einmal als Termin geführt. Welche Divisionen und Masters-Klassen tatsächlich angeboten werden, steht im verlinkten offiziellen IFBB-Pro-League-Kalender."
  }
];

const boxingCalendarSources = [
  {
    id: "wba",
    number: "01",
    division: "profi",
    name: "WBA",
    descriptor: "World Boxing Association",
    sourceUrl: "https://www.wbaboxing.com/wba-fights-schedule",
    note: "Ausgewählte Welt-, Interims- und Gold-Titelkämpfe aus dem laufend aktualisierten WBA-Kampfplan.",
    events: [
      { date: "2026-08-08", label: "8. August 2026", name: "Cherneka Johnson vs. Dina Thorslund", location: "Orlando, Florida · USA", type: "Bantamgewicht · Unified World Title" },
      { date: "2026-08-15", label: "15. August 2026", name: "Claressa Shields vs. Kaye Scott", location: "Atlanta, Georgia · USA", type: "Mittelgewicht · WBA/WBC" },
      { date: "2026-08-22", label: "22. August 2026", name: "Rolando Romero vs. Teofimo Lopez", location: "Las Vegas, Nevada · USA", type: "Weltergewicht · WBA Super World" },
      { date: "2026-08-29", label: "29. August 2026", name: "Mikaela Mayer vs. Chantelle Cameron", location: "Birmingham · Großbritannien", type: "Superweltergewicht · WBA/WBC/WBO" },
      { date: "2026-09-05", label: "5. September 2026", name: "Katie Taylor vs. Flora Pili", location: "Dublin · Irland", type: "Superleichtgewicht · Undisputed" },
      { date: "2026-10-25", label: "25. Oktober 2026", name: "Shauna Browne vs. Jade Burden", location: "London · Großbritannien", type: "Leichtgewicht · WBA Gold" },
      { date: "2026-05-23", label: "23. Mai 2026", name: "Oleksandr Usyk vs. Rico Verhoeven", location: "Gizeh · Ägypten", type: "Schwergewicht · WBA Super World", past: true }
    ]
  },
  {
    id: "wbc",
    number: "02",
    division: "profi",
    name: "WBC",
    descriptor: "World Boxing Council",
    sourceUrl: "https://wbcboxing.com/en/",
    note: "Offiziell angekündigte WBC-Welt-, Interims- und Silver-Titelkämpfe.",
    events: [
      { date: "2026-08-01", label: "1. August 2026", name: "William Zepeda vs. Lamont Roach Jr.", location: "Las Vegas, Nevada · USA", type: "Leichtgewicht · WBC World" },
      { date: "2026-08-15", label: "15. August 2026", name: "Claressa Shields vs. Kaye Scott", location: "Atlanta, Georgia · USA", type: "Mittelgewicht · WBC World" },
      { date: "2026-08-29", label: "29. August 2026", name: "Lester Martinez vs. Luka Plantić", location: "Los Angeles, Kalifornien · USA", type: "Supermittelgewicht · WBC Interim" },
      { date: "2026-08-29", label: "29. August 2026", name: "Luis Torres vs. Jordan White", location: "Los Angeles, Kalifornien · USA", type: "Leichtgewicht · WBC Silver" },
      { date: "2026-08-29", label: "29. August 2026", name: "Caroline Dubois vs. Amelia Moore", location: "Birmingham · Großbritannien", type: "Leichtgewicht · WBC World" },
      { date: "2026-01-10", label: "10. Januar 2026", name: "Agit Kabayel vs. Damian Knyba", location: "Oberhausen · Deutschland", type: "Schwergewicht · WBC Interim", past: true },
      { date: "2026-07-20", label: "20. Juli 2026", name: "Shokichi Iwata vs. Erik Badillo", location: "Tokio · Japan", type: "Halbfliegengewicht · WBC World", past: true }
    ]
  },
  {
    id: "wbf",
    number: "03",
    division: "profi",
    name: "WBF",
    descriptor: "World Boxing Federation",
    sourceUrl: "https://www.worldboxingfederation.org/wbfresults.htm",
    note: "Der offizielle Ergebnisdienst führt aktuell ausschließlich bereits ausgetragene WBF-Kämpfe für 2026.",
    events: [
      { date: "2026-05-02", label: "2. Mai 2026", name: "Givi Todua vs. Elmo Traya", location: "Tiflis · Georgien", type: "Mittelgewicht · Interim World", past: true },
      { date: "2026-05-01", label: "1. Mai 2026", name: "Phannarai Netisri vs. Lena Venjacob", location: "Hamburg · Deutschland", type: "Bantamgewicht · World", past: true },
      { date: "2026-05-01", label: "1. Mai 2026", name: "Alexander Pavlov vs. Dorde Krsmanovic", location: "Hamburg · Deutschland", type: "Weltergewicht · World", past: true },
      { date: "2026-05-01", label: "1. Mai 2026", name: "Steve Robinson vs. Angelo Venjakob", location: "Hamburg · Deutschland", type: "Schwergewicht · International", past: true },
      { date: "2026-02-07", label: "7. Februar 2026", name: "Artur Mann vs. Gregorio Garcia", location: "Bad Hersfeld · Deutschland", type: "Bridgergewicht · World", past: true },
      { date: "2026-02-07", label: "7. Februar 2026", name: "Viktor Temirov vs. Domenik Arnold", location: "Bad Hersfeld · Deutschland", type: "Mittelgewicht · World", past: true },
      { date: "2026-01-17", label: "17. Januar 2026", name: "Freddy Kiwitt vs. Suleiman Jafaru", location: "Flensburg · Deutschland", type: "Superweltergewicht · World", past: true }
    ]
  },
  {
    id: "wbo",
    number: "04",
    division: "profi",
    name: "WBO",
    descriptor: "World Boxing Organization",
    sourceUrl: "https://wboboxing.com/",
    note: "Bestätigte kommende Weltmeisterschaftskämpfe aus dem offiziellen WBO-Kampfplan.",
    events: [
      { date: "2026-08-08", label: "8. August 2026", name: "Cherneka Johnson vs. Dina Thorslund", location: "Orlando, Florida · USA", type: "Bantamgewicht · Unified World Title" },
      { date: "2026-08-08", label: "8. August 2026", name: "Desley Robinson vs. Tamm Thibeault", location: "Orlando, Florida · USA", type: "Mittelgewicht · WBO World" },
      { date: "2026-08-21", label: "21. August 2026", name: "Amanda Serrano vs. Lucrecia Manzur", location: "Kalifornien · USA", type: "Federgewicht · WBO World" },
      { date: "2026-08-29", label: "29. August 2026", name: "Chantelle Cameron vs. Mikaela Mayer", location: "Birmingham · Großbritannien", type: "Superweltergewicht · Unified World Title" },
      { date: "2026-08-29", label: "29. August 2026", name: "Caroline Dubois vs. Amelia Moore", location: "Birmingham · Großbritannien", type: "Leichtgewicht · WBO World" },
      { date: "2026-09-05", label: "5. September 2026", name: "Katie Taylor vs. Flora Pili", location: "Dublin · Irland", type: "Superleichtgewicht · Undisputed" },
      { date: "2026-07-25", label: "25. Juli 2026", name: "Hamzah Sheeraz vs. Simon Zachenhuber", location: "Dschidda · Saudi-Arabien", type: "Supermittelgewicht · WBO World", past: true }
    ]
  },
  {
    id: "ibf",
    number: "05",
    division: "profi",
    name: "IBF",
    descriptor: "International Boxing Federation",
    sourceUrl: "https://www.ibf-usba-boxing.com/schedule/",
    note: "Kommende IBF-Eliminator sowie internationale und regionale Titelkämpfe aus dem offiziellen IBF-Kampfplan.",
    events: [
      { date: "2026-09-12", label: "12. September 2026", name: "Regie Suganob vs. Sivenathi Nontshinga", location: "Bohol · Philippinen", type: "Halbfliegengewicht · IBF Eliminator #1" },
      { date: "2026-09-12", label: "12. September 2026", name: "Datu Adam vs. Oky Akbar", location: "Bohol · Philippinen", type: "Superbantamgewicht · IBF Asia" },
      { date: "2026-09-12", label: "12. September 2026", name: "Sol Cudos vs. Mercedes Rocio Reyna", location: "Buenos Aires · Argentinien", type: "Atomgewicht · IBF Latino Female" },
      { date: "2026-09-12", label: "12. September 2026", name: "Leonard Pores III vs. Andika D'Golden Boy", location: "Bohol · Philippinen", type: "Fliegengewicht · IBF Pan Pacific" },
      { date: "2026-09-12", label: "12. September 2026", name: "Reymart Tagacanao vs. Chunlin Kuang", location: "Bohol · Philippinen", type: "Superfliegengewicht · IBF Asia" },
      { date: "2026-09-19", label: "19. September 2026", name: "Shabaz Masoud vs. Ckari Mansilla", location: "Manchester · Großbritannien", type: "Federgewicht · IBF Intercontinental" },
      { date: "2026-10-03", label: "3. Oktober 2026", name: "Stan Surmacz vs. Alexis Barriere", location: "Montreal · Kanada", type: "Schwergewicht · IBF North American" },
      { date: "2026-10-03", label: "3. Oktober 2026", name: "Mea Motu vs. Mariah Turner", location: "Auckland · Neuseeland", type: "Federgewicht · IBF Intercontinental Female" }
    ]
  },
  {
    id: "bdb",
    number: "06",
    division: "profi",
    name: "Bund Deutscher Berufsboxer",
    shortName: "BDB",
    descriptor: "Profiboxen · Deutschland",
    sourceUrl: "https://www.bund-deutscher-berufsboxer.de/termine/",
    note: "Der BDB ist der deutsche Dachverband für Berufsboxerinnen und Berufsboxer. Seine offizielle Terminseite ist verlinkt; aktuell sind dort noch keine belastbaren 2026-Ansetzungen veröffentlicht.",
    emptyTitle: "Noch kein offizieller 2026-Termin veröffentlicht.",
    emptyText: "Sobald der BDB seinen Veranstaltungskalender aktualisiert, werden bestätigte Kampftage hier ergänzt.",
    events: []
  },
  {
    id: "world-boxing",
    number: "07",
    division: "amateur",
    name: "World Boxing",
    descriptor: "Olympisches Boxen · International",
    sourceUrl: "https://worldboxing.org/world-boxing-publishes-updated-2026-competition-calendar/",
    note: "Internationale Cups, Kontinentalmeisterschaften und Multisport-Events unter World-Boxing-Regeln.",
    events: [
      { date: "2026-07-23", endDate: "2026-08-02", label: "23. Juli–2. August 2026", name: "Commonwealth Games", location: "Glasgow · Schottland", type: "Elite · Multisport-Event", status: "Läuft" },
      { date: "2026-09-15", endDate: "2026-09-26", label: "15.–26. September 2026", name: "European Boxing Championships", location: "Sofia · Bulgarien", type: "Elite · Europameisterschaft" },
      { date: "2026-09-19", endDate: "2026-10-04", label: "19. September–4. Oktober 2026", name: "Asian Games", location: "Aichi/Nagoya · Japan", type: "Elite · Multisport-Event" },
      { date: "2026-10-10", endDate: "2026-10-17", label: "10.–17. Oktober 2026", name: "PanAmerican Boxing Championships", location: "Puebla · Mexiko", type: "Elite · Kontinentalmeisterschaft" },
      { date: "2026-10-31", endDate: "2026-11-13", label: "31. Oktober–13. November 2026", name: "Youth Olympic Games", location: "Dakar · Senegal", type: "U19 · Olympisches Jugendturnier" },
      { date: "2026-11-25", endDate: "2026-12-02", label: "25. November–2. Dezember 2026", name: "World Boxing Cup Finals", location: "Taschkent · Usbekistan", type: "Elite · World Cup Finals" },
      { date: "2026-03-08", endDate: "2026-03-15", label: "8.–15. März 2026", name: "World Boxing Futures Cup", location: "Bangkok · Thailand", type: "U19 · Nachwuchsturnier", past: true },
      { date: "2026-03-28", endDate: "2026-04-11", label: "28. März–11. April 2026", name: "Asian Boxing Championships", location: "Ulaanbaatar · Mongolei", type: "Elite · Kontinentalmeisterschaft", past: true },
      { date: "2026-04-20", endDate: "2026-04-26", label: "20.–26. April 2026", name: "World Boxing Cup – Stage 1", location: "Foz do Iguaçu · Brasilien", type: "Elite · World Cup", past: true },
      { date: "2026-06-15", endDate: "2026-06-20", label: "15.–20. Juni 2026", name: "World Boxing Cup – Stage 2", location: "Guiyang · China", type: "Elite · World Cup", past: true }
    ]
  },
  {
    id: "dbv",
    number: "08",
    division: "amateur",
    name: "Deutscher Boxsport-Verband",
    shortName: "DBV",
    descriptor: "Olympisches Boxen · Deutschland",
    sourceUrl: "https://www.boxverband.de/deutsche-meisterschaften-im-olympischen-boxen/",
    note: "Deutsche Meisterschaften der verschiedenen Altersklassen im olympischen Boxen.",
    events: [
      { date: "2026-09-29", endDate: "2026-10-03", label: "29. September–3. Oktober 2026", name: "Deutsche Meisterschaft U23", location: "Frankfurt am Main · Deutschland", type: "U23 · Deutsche Meisterschaft" },
      { date: "2026-11-03", endDate: "2026-11-07", label: "3.–7. November 2026", name: "Deutsche Meisterschaft U18", location: "Köln · Deutschland", type: "U18 · Deutsche Meisterschaft" },
      { date: "2026-12-08", endDate: "2026-12-12", label: "8.–12. Dezember 2026", name: "Deutsche Meisterschaft Elite", location: "Austragungsort noch offen", type: "Elite · Deutsche Meisterschaft" },
      { date: "2026-04-14", endDate: "2026-04-18", label: "14.–18. April 2026", name: "Deutsche Meisterschaft U17", location: "Bremerhaven · Deutschland", type: "U17 · Deutsche Meisterschaft", past: true },
      { date: "2026-05-12", endDate: "2026-05-16", label: "12.–16. Mai 2026", name: "Deutsche Meisterschaft U15", location: "Lindow (Mark) · Deutschland", type: "U15 · Deutsche Meisterschaft", past: true },
      { date: "2026-06-02", endDate: "2026-06-06", label: "2.–6. Juni 2026", name: "Deutsche Meisterschaft U19", location: "Warnemünde · Deutschland", type: "U19 · Deutsche Meisterschaft", past: true }
    ]
  }
];

const boxingCalendarFaq = [
  {
    question: "Was ist der Unterschied zwischen Profi- und Amateurboxen?",
    answer:
      "Profiboxen wird über einzelne Veranstalter und Titelverbände organisiert. Im olympischen Amateurboxen stehen Turniere, Nationalmannschaften, Altersklassen und Meisterschaften unter den Regeln von World Boxing und den nationalen Verbänden im Mittelpunkt."
  },
  {
    question: "Warum taucht ein Profikampf bei mehreren Verbänden auf?",
    answer:
      "Bei einem Vereinigungs- oder Undisputed-Kampf können Titel mehrerer Organisationen gleichzeitig auf dem Spiel stehen. Deshalb kann derselbe Kampf etwa bei WBA, WBC und WBO geführt werden."
  },
  {
    question: "Was ist der Unterschied zwischen IBF und BDB?",
    answer:
      "Die IBF ist eine internationale Titelorganisation mit Welt-, Eliminator- und Regionaltiteln. Der Bund Deutscher Berufsboxer (BDB) ist der deutsche Dachverband für Berufsboxerinnen und Berufsboxer und beaufsichtigt lizenzierte Profiboxveranstaltungen in Deutschland."
  },
  {
    question: "Wo finde ich Tickets und Übertragungen?",
    answer:
      "Die offiziellen Verbandsquellen führen zur jeweiligen Ankündigung oder zum aktuellen Kampfplan. Ticketanbieter und Sender können regional abweichen und sollten direkt beim Veranstalter geprüft werden."
  },
  {
    question: "Wie kann man an einer Deutschen Meisterschaft im Amateurboxen teilnehmen?",
    answer:
      "Meldungen zu Deutschen Meisterschaften erfolgen in der Regel über Vereine und Landesverbände. Altersklasse, Startberechtigung, Qualifikation und Meldeschluss legt der Deutsche Boxsport-Verband verbindlich fest."
  },
  {
    question: "Sind alle Termine garantiert?",
    answer:
      "Nein. Profikämpfe können verschoben oder neu angesetzt werden, und auch Turnierdetails können sich ändern. Verbindlich bleibt immer die aktuelle Veröffentlichung der Organisation oder des Veranstalters."
  }
];

const teamSuccessCards = [
  {
    detail: "Athleten",
    title: "Top-Athleten und ambitionierte Persönlichkeiten",
    text:
      "Camp Dörfl arbeitet nicht nur mit Sportlern auf hohem Niveau, sondern auch mit Menschen, die im Alltag viel Verantwortung tragen."
  },
  {
    detail: "System",
    title: "Training, App und Umsetzung greifen ineinander",
    text:
      "Die stärksten Ergebnisse entstehen dort, wo klare Führung, Daten und alltagstaugliche Umsetzung zusammenkommen."
  },
  {
    detail: "Ergebnis",
    title: "Fortschritt wird konkret",
    text:
      "Mehr Leistung, sichtbare körperliche Entwicklung und bessere Steuerung sind kein Zufall, sondern das Resultat eines Systems."
  }
];

const teamSuccessRows = [
  {
    title: "Was Erfolge im Team verbindet",
    text:
      "Die stärksten Entwicklungen entstehen nicht durch Hype, sondern durch einen ehrlichen Startpunkt, klare Struktur und konsequente Umsetzung."
  },
  {
    title: "Warum Menschen dranbleiben",
    text:
      "Weil Training, Ernährung, Community und Feedback nicht nebeneinander laufen, sondern sich gegenseitig verstärken."
  },
  {
    title: "Was sichtbar wird",
    text:
      "Mehr Energie, bessere Form, höhere Verlässlichkeit im Alltag und ein System, das sich auch langfristig tragen lässt."
  }
];

const coachSuccessYears = [
  {
    year: "2026",
    results: [
      "3. Platz Diamond Cup Austria Masters Bodybuilding",
      "2. Platz Diamond Cup Austria Classic Bodybuilding",
      "1. Platz Mr Universe Liechtenstein Classic Bodybuilding + IFBB Pro Card",
      "1. Platz Süddeutsche Meisterschaft Classic Physique 40+",
      "2. Platz Süddeutsche Meisterschaft Masters 50+",
      "4. Platz Süddeutsche Meisterschaft Masters 60+",
      "4. Platz Süddeutsche Meisterschaft Body 2"
    ]
  },
  {
    year: "2025",
    results: [
      "4. Platz Deutsche Newcomer Meisterschaft Bikini Fitness",
      "4. Platz BaWü-Meisterschaft Mens Physique",
      "5. Platz Deutsche Masters Meisterschaft Masters Bodybuilding Ü50",
      "3. Platz Deutsche Masters Meisterschaft Masters Bodybuilding Ü60",
      "5. Platz FIBO Cup Mens Physique",
      "1. Platz Fränkische Meisterschaft Bikini Fitness",
      "3. Platz Fränkische Meisterschaft Masters Bodybuilding Ü50",
      "1. Platz Olimp Cup Bodybuilding + Gesamtsieg",
      "1. Platz Olimp Cup Wellness Fitness",
      "2. Platz Bayerische Meisterschaft Bodybuilding bis 80 kg",
      "2. Platz All Stars Classic Mens Physique",
      "3. Platz Sweden Grand Prix Bodybuilding",
      "3. Platz Sweden Grand Prix Wellness Fitness",
      "1. Platz Süddeutsche Meisterschaft Masters Bodybuilding Ü60",
      "5. Platz Diamond Cup Luxemburg Classic Bodybuilding",
      "3. Platz Diamond Cup Prag Classic Bodybuilding",
      "3. Platz Deutsche Newcomer Meisterschaft Bodybuilding",
      "4. Platz Deutsche Newcomer Meisterschaft Fitness Figur",
      "3. Platz Mr Universe Switzerland Classic Bodybuilding",
      "3. Platz Süddeutsche Meisterschaft Masters Fitness Figur",
      "3. Platz NRW Meisterschaft Fitness Figur",
      "4. Platz Bayerische Meisterschaft Fitness Figur"
    ]
  },
  {
    year: "2024",
    results: [
      "1. Platz Invictus Cup Bodybuilding bis 80 kg",
      "1. Platz Fränkische Meisterschaft Bodybuilding bis 80 kg + Gesamtsieg",
      "4. Platz Fränkische Meisterschaft Classic Bodybuilding",
      "3. Platz Mr Universe Liechtenstein Bodybuilding",
      "1. Platz Deutsche Masters Meisterschaft Mens Physique",
      "3. Platz Deutsche Masters Meisterschaft Bodybuilding über 60",
      "3. Platz Deutsche Masters Meisterschaft Classic Physique",
      "6. Platz Deutsche Newcomer Meisterschaft Bodybuilding über 80 kg",
      "1. Platz Bayerische Meisterschaft Bodybuilding bis 80 kg + Gesamtsieg",
      "3. Platz Bayerische Meisterschaft Classic Bodybuilding",
      "4. Platz Bayerische Meisterschaft Bodybuilding bis 90 kg",
      "1. Platz Olimp Cup Bodybuilding bis 80 kg",
      "1. Platz Süddeutsche Meisterschaft Mens Physique",
      "1. Platz Berliner Meisterschaft Bodybuilding bis 90 kg",
      "2. Platz Berliner Meisterschaft Classic Bodybuilding",
      "1. Platz Deutsche Meisterschaft Bodybuilding bis 80 kg",
      "5. Platz Internationale Österreichische Meisterschaft Masters Bikini Fitness",
      "2. Platz Süddeutsche Meisterschaft Masters Bikini Fitness",
      "1. Platz Süddeutsche Meisterschaft Classic Physique Masters",
      "3. Platz Süddeutsche Meisterschaft Bodybuilding",
      "3. Platz Süddeutsche Meisterschaft Classic Physique Junioren",
      "1. Platz Deutsche Masters Meisterschaft Bikini Fitness Ü40",
      "1. Platz Deutsche Masters Meisterschaft Classic Physique",
      "1. Platz Süddeutsche Meisterschaft Classic Physique + Gesamtsieg",
      "1. Platz Bayerische Meisterschaft Classic Bodybuilding + Gesamtsieg",
      "1. Platz Bayerische Meisterschaft Bodybuilding +100 kg",
      "2. Platz Bayerische Meisterschaft Masters Bodybuilding",
      "3. Platz Bayerische Meisterschaft Masters Bikini",
      "4. Platz Bayerische Meisterschaft Bikini Fitness",
      "6. Platz Deutsche Meisterschaft Bodybuilding +100 kg"
    ]
  },
  {
    year: "2023",
    results: [
      "1. Platz Fitness Authority Polen Wellness Fitness",
      "2. Platz Fitness Authority Polen Bodybuilding",
      "2. Platz Bayerische Meisterschaft Bodybuilding über 90 kg",
      "2. Platz Fränkische Meisterschaft Bodybuilding über 90 kg",
      "2. Platz NRW Meisterschaft Bodybuilding über 100 kg",
      "1. Platz Deutsche Meisterschaft Bodybuilding über 100 kg",
      "1. Platz Ostdeutsche Meisterschaft Wellness Fitness",
      "1. Platz All Stars Classic Bodybuilding bis 102 kg",
      "1. Platz All Stars Classic Wellness Fitness",
      "3. Platz All Stars Classic Bodybuilding bis 80 kg",
      "2. Platz Deutsche Meisterschaft Masters Bikini Fitness",
      "2. Platz Sheru Classic Classic Physique Pro",
      "2. Platz Süddeutsche Meisterschaft Masters Bikini Fitness",
      "2. Platz Süddeutsche Meisterschaft Masters Mens Physique",
      "1. Platz Deutsche Masters Meisterschaft Mens Physique",
      "4. Platz Deutsche Newcomer Meisterschaft Mens Physique",
      "4. Platz Deutsche Newcomer Meisterschaft Masters Mens Physique",
      "1. Platz Süddeutsche Meisterschaft Masters Classic Physique",
      "1. Platz Süddeutsche Meisterschaft Bodybuilding",
      "4. Platz Ostdeutsche Meisterschaft Junioren Bodybuilding",
      "3. Platz Romanian Muscle Fest Pro Classic Physique"
    ]
  },
  {
    year: "2022",
    results: [
      "6. Platz Deutsche Meisterschaft Junioren",
      "6. Platz Deutsche Meisterschaft Bodybuilding",
      "2. Platz FIBO Cup Bikini Shape",
      "1. Platz Deutsche Newcomer Meisterschaft Junioren",
      "1. Platz Ostdeutsche Meisterschaft Junioren",
      "1. Platz Frey Classic Bikini Shape",
      "5. Platz Deutsche Newcomer Meisterschaft Bodybuilding",
      "2. Platz Mr Big Evolution Mens Physique",
      "1. Platz Fränkische Meisterschaft Bodybuilding bis 80 kg",
      "3. Platz Fränkische Meisterschaft Bodybuilding bis 100 kg",
      "1. Platz Fränkische Meisterschaft Bodybuilding über 100 kg",
      "4. Platz Fränkische Meisterschaft Bodybuilding bis 90 kg",
      "6. Platz Deutsche Newcomer Meisterschaft Bodybuilding",
      "5. Platz Süddeutsche Meisterschaft Masters Bodybuilding",
      "5. Platz Deutsche Meisterschaft Masters Bodybuilding",
      "2. Platz Fränkische Meisterschaft Classic Bodybuilding",
      "2. Platz Ostdeutsche Meisterschaft Junioren"
    ]
  },
  {
    year: "2021",
    results: [
      "1. Platz German Cup Bikini Fitness Masters",
      "3. Platz German Cup Bodybuilding bis 90 kg",
      "1. Platz Swiss Cup Bodybuilding bis 80 kg",
      "4. Platz German Cup Bikini Fitness",
      "1. Platz Schweizer Meisterschaft Bodybuilding bis 80 kg",
      "1. Platz Deutsche Newcomer Meisterschaft Fitness Figur",
      "4. Platz Ronny Rockel Classic Bikini Shape",
      "4. Platz Deutsche Newcomer Meisterschaft Junioren",
      "3. Platz Süddeutsche Meisterschaft Classic Bodybuilding",
      "1. Platz Süddeutsche Meisterschaft Junioren",
      "3. Platz Süddeutsche Meisterschaft Bikini",
      "1. Platz Ostdeutsche Meisterschaft Figur",
      "1. Platz Ostdeutsche Meisterschaft Bodybuilding",
      "1. Platz Deutsche Meisterschaft Bikini Shape",
      "2. Platz Bayerische Meisterschaft Classic Bodybuilding",
      "1. Platz Deutsche Meisterschaft Figur Fitness",
      "2. Platz Deutsche Meisterschaft Bodybuilding",
      "2. Platz Rhein Neckar Pokal Classic Bodybuilding",
      "1. Platz Rhein Neckar Pokal Bodybuilding bis 80 kg",
      "2. Platz Ms Universe Bikini Shape",
      "2. Platz Ms Universe Figur Fitness",
      "3. Platz Deutsche Meisterschaft Bodybuilding bis 80 kg",
      "5. Platz Diamond Cup Rom Bodybuilding bis 80 kg"
    ]
  },
  {
    year: "2019",
    results: [
      "1. Platz Niederbayerische Meisterschaft Masters Bodybuilding",
      "1. Platz Niederbayerische Meisterschaft Classic Bodybuilding",
      "1. Platz Bayerische Meisterschaft Classic Bodybuilding",
      "1. Platz Ostdeutsche Meisterschaft Bodybuilding",
      "1. Platz Deutsche Meisterschaft Bodybuilding bis 100 kg",
      "3. Platz IFBB Elite Pro Weltmeisterschaft Figure Fitness"
    ]
  }
];

const coachSuccessStats = coachSuccessYears.reduce(
  (stats, year) => {
    stats.placements += year.results.length;
    stats.wins += year.results.filter((result) => result.startsWith("1. Platz")).length;
    stats.podiums += year.results.filter((result) => /^[123]\. Platz/.test(result)).length;
    return stats;
  },
  { placements: 0, wins: 0, podiums: 0 }
);

function coachSuccessOverview() {
  const yearLinks = coachSuccessYears
    .map(({ year }) => `<a href="#coach-erfolge-${year}">${year}</a>`)
    .join("");

  const years = coachSuccessYears
    .map(({ year, results }, index) => {
      const wins = results.filter((result) => result.startsWith("1. Platz")).length;
      const podiums = results.filter((result) => /^[123]\. Platz/.test(result)).length;
      const list = results
        .map((result) => {
          const [, place, title] = result.match(/^(\d+)\. Platz\s+(.+)$/) || [null, "–", result];
          return `<li><span class="coach-success__place coach-success__place--${place}">${place}.</span><span>${title}</span></li>`;
        })
        .join("");

      return `
        <details class="coach-success__year" id="coach-erfolge-${year}"${index === 0 ? " open" : ""}>
          <summary>
            <span class="coach-success__year-label">${year}</span>
            <span class="coach-success__year-stats">${results.length} Platzierungen · ${wins} Siege · ${podiums} Podiumsplätze</span>
            <span class="coach-success__toggle" aria-hidden="true"></span>
          </summary>
          <ol class="coach-success__results">${list}</ol>
        </details>`;
    })
    .join("");

  return `
    <section class="section coach-success" id="coach-erfolge">
      <div class="section-shell">
        <div class="coach-success__intro">
          ${sectionHeader({
            eyebrow: "Erfolge als Coach",
            title: "Eine Bilanz, die das ganze Camp sichtbar macht.",
            text:
              "Von regionalen Meisterschaften bis zur internationalen Pro Card: Diese Übersicht bündelt die Platzierungen, die Athletinnen und Athleten mit Camp-Dörfl-Coaching erreicht haben."
          })}
          <div class="coach-success__totals" aria-label="Gesamtbilanz der Coach-Erfolge">
            <div><strong>${coachSuccessStats.placements}</strong><span>Platzierungen</span></div>
            <div><strong>${coachSuccessStats.wins}</strong><span>Siege</span></div>
            <div><strong>${coachSuccessStats.podiums}</strong><span>Podiumsplätze</span></div>
            <div><strong>${coachSuccessYears.length}</strong><span>Wettkampfjahre</span></div>
          </div>
        </div>
        <nav class="coach-success__years" aria-label="Coach-Erfolge nach Jahr">${yearLinks}</nav>
        <div class="coach-success__timeline">${years}</div>
        <p class="coach-success__note">Stand: 2026 · Aufgeführt sind die im Camp dokumentierten Wettkampfplatzierungen aus den Jahren 2019 und 2021 bis 2026.</p>
      </div>
    </section>`;
}

const campTransformationCards = [
  {
    detail: "Bühnenform",
    title: "Vom Startpunkt bis auf die Wettkampfbühne.",
    text:
      "Ein sichtbares Beispiel dafür, wie konsequente Führung, klare Struktur und saubere Umsetzung in eine komplett veränderte Form münden können.",
    image: "/assets/images/transformation-stage-win.webp",
    alt: "Vorher-Nachher-Transformation eines Camp-Dörfl-Klienten von Ausgangsform bis zur Bühnenform"
  },
  {
    detail: "Natural Shape",
    title: "Transformation mit echtem Leistungsanspruch.",
    text:
      "Nicht nur weniger Körperfett, sondern eine Entwicklung, die Disziplin, Präzision und langfristige Steuerung sichtbar macht.",
    image: "/assets/images/transformation-stage-shape.webp",
    alt: "Vorher-Nachher-Transformation eines Camp-Dörfl-Klienten bis zu einer definierten Wettkampfform"
  },
  {
    detail: "Alltag",
    title: "Spürbar leichter im echten Leben.",
    text:
      "Auch ohne Bühnenziel wird Entwicklung deutlich, wenn Training, Ernährung und Alltag endlich sinnvoll zusammenlaufen.",
    image: "/assets/images/transformation-front-progress.webp",
    alt: "Vorher-Nachher-Transformation eines Camp-Dörfl-Klienten im Frontalvergleich"
  },
  {
    detail: "Seitenprofil",
    title: "Veränderung, die auch seitlich klar sichtbar wird.",
    text:
      "Gerade im Profilvergleich werden Bauchumfang, Haltung und Körperspannung oft besonders deutlich erkennbar.",
    image: "/assets/images/transformation-side-progress.webp",
    alt: "Vorher-Nachher-Transformation eines Camp-Dörfl-Klienten im Seitenvergleich"
  }
];

function homePage() {
  const content = `
    <section class="ff-hero ff-hero--home-photo">
      <picture>
        <source media="(max-width: 900px)" srcset="/assets/images/home-hero-ironman-interview-mobile-480.webp 480w, /assets/images/home-hero-ironman-interview-mobile-720.webp 720w, /assets/images/home-hero-ironman-interview-mobile.webp 900w" sizes="100vw">
        <img class="ff-hero__img" src="/assets/images/home-hero-ironman-interview.webp" srcset="/assets/images/home-hero-ironman-interview-960.webp 960w, /assets/images/home-hero-ironman-interview.webp 1920w" sizes="100vw" alt="Dominik Dörfl als Ironman-Finisher mit Medaille bei einem Interview im Stadion"${imageLoadingAttributes({ eager: true })}>
      </picture>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <div class="ff-hero__home-card">
          <p class="ff-hero__eyebrow" data-reveal>Personal Training · Firmenfitness · Events · Nürnberg</p>
          <h1 class="ff-hero__title" data-reveal>Gesundheit.<br>Leistung.<br><span>Präsenz.</span></h1>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref()}"><span>Beratung anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--ghost" href="#einstiege"><span>Vier Einstiege ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <p class="ff-hero__mobile-welcome" data-reveal>Willkommen bei Camp Dörfl</p>
          <dl class="ff-hero__facts" data-reveal aria-label="Camp Dörfl in Zahlen">
            <div><dt>Moderator</dt><dd>knapp 100 Events</dd></div>
            <div><dt>Firmenfitness</dt><dd>für gesunde Unternehmen</dd></div>
            <div><dt>Fitness Trainer</dt><dd>ausgebildet & zertifiziert</dd></div>
            <div><dt>Profi Athlet</dt><dd>Fitness &amp; Bodybuilding</dd></div>
            <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
            <div><dt>Ironman</dt><dd>Finisher</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="ed-section ed-section--hero-sync" id="einstiege">
      <div class="section-shell">
        <div class="ed-section__stage">
          <div class="ed-section__head" data-reveal>
            <p class="eyebrow">Vier Einstiege</p>
            <h2 class="ed-section__title"><span>4 Wege</span> ins Performance System</h2>
          </div>
          <div class="ed-entry-grid" aria-label="Vier Einstiege ins Performance System">
            ${homeEntryCards
              .map(
                ({ titleHtml, image, srcset, alt, href, buttonLabel, theme }) => `
                  <a class="ed-entry ed-entry--${theme}" href="${href}" data-reveal>
                  <div class="ed-entry__media">
                    <img src="${image}" srcset="${srcset}" sizes="(max-width: 720px) calc(100vw - 76px), (max-width: 1100px) 50vw, 25vw" alt="${alt}"${imageLoadingAttributes()}>
                  </div>
                  <div class="ed-entry__body">
                    <h3>${titleHtml}</h3>
                    <span class="ed-entry__cta"><span class="ed-entry__cta-label">${buttonLabel}</span><span aria-hidden="true">&rarr;</span></span>
                  </div>
                  </a>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="ed-proof">
      <div class="section-shell">
        <div class="ed-proof__head" data-reveal>
          <p class="eyebrow">Praxis statt Theorie</p>
          <h2 class="ed-section__title">Gebaut aus echter Leistung.</h2>
          <p class="ed-section__lead">
            Athletik, Coaching, Bühne und Unternehmen greifen in einer klaren Handschrift zusammen.
          </p>
        </div>
        <dl class="ed-proof__grid">
          ${achievements
            .map(
              ({ value, label }) => `
                <div class="ed-proof__item" data-reveal>
                  <dt>${value}</dt>
                  <dd>${label}</dd>
                </div>
              `
            )
            .join("")}
        </dl>
      </div>
    </section>

    <section class="section ed-google-reviews" aria-labelledby="google-reviews-title">
      <div class="section-shell">
        <div class="ed-google-reviews__stage">
          <div class="ed-google-reviews__summary" data-reveal>
            <div class="ed-google-reviews__brand" aria-label="Google">
              <span aria-hidden="true">G</span><strong>Google</strong>
            </div>
            <p class="eyebrow">Google Bewertungen</p>
            <p class="ed-google-reviews__score" aria-label="5 von 5 Sternen">5,0<span>/5</span></p>
            <div class="ed-google-reviews__stars" aria-hidden="true">★★★★★</div>
            <p>34 Bewertungen von Kundinnen und Kunden, die Training, Ernährung und persönliche Begleitung mit Camp Dörfl erlebt haben.</p>
            <a class="ed-google-reviews__link" href="https://share.google/wUJdg1MGgXUMY8q5n" target="_blank" rel="noopener noreferrer">Alle Google Bewertungen <span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="ed-google-reviews__content">
            <div class="ed-google-reviews__head" data-reveal>
              <p class="eyebrow">Echte Erfahrungen</p>
              <h2 id="google-reviews-title">Was Menschen über Camp Dörfl sagen.</h2>
            </div>
            <div class="ed-google-reviews__grid">
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Sehr motivierend und professionell und vor allem zu 100 Prozent zuverlässig.“</blockquote>
                <figcaption data-initials="MS"><strong>Markus S.</strong><span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Sehr professionelle Betreuung. Sehr gute Beratung.“</blockquote>
                <figcaption data-initials="MT"><strong>Michael T.</strong><span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Super Beratung, jederzeit erreichbar und für jede Frage eine kompetente Antwort.“</blockquote>
                <figcaption data-initials="DI"><strong>Deniz I.</strong><span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Top Service, super empathisch auf mich eingegangen. Ich bin sehr zufrieden!“</blockquote>
                <figcaption data-initials="SS"><strong>Stefan S.</strong><span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Die Trainings- und Ernährungspläne sind perfekt auf die persönlichen Bedürfnisse und Ziele abgestimmt.“</blockquote>
                <figcaption data-initials="LS"><strong>Leon S.</strong><span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Seine ehrliche, motivierende und zielstrebige Art bringt mich Tag für Tag meinem Ziel näher.“</blockquote>
                <figcaption data-initials="MT"><strong>Meik T.</strong><span>Google Bewertung</span></figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted home-search-paths" aria-labelledby="home-search-paths-title">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Direkt zum passenden Angebot",
          title: "Was suchst du in Nürnberg?",
          text:
            "Wähle deinen konkreten Einstieg – vom persönlichen Coaching über die Körperanalyse bis zum Gesundheitstag für Unternehmen.",
          align: "center"
        }).replace("<h2", '<h2 id="home-search-paths-title"')}
        ${featureGrid(
          [
            {
              detail: "1:1 Coaching",
              title: "Personal Trainer Nürnberg",
              text: "Individuelles Training, Ernährung und persönliche Führung für ambitionierte Ziele.",
              href: "/personal-trainer-nürnberg/",
              ctaLabel: "Personal Training ansehen"
            },
            {
              detail: "2D · InBody · BIA",
              title: "Körperanalyse Nürnberg",
              text: "Körperzusammensetzung messen, Ergebnisse verstehen und klare nächste Schritte ableiten.",
              href: "/koerperanalyse-nuernberg/",
              ctaLabel: "Körperanalyse ansehen"
            },
            {
              detail: "Für Unternehmen",
              title: "Gesundheitstag Nürnberg",
              text: "Ein erlebbarer Gesundheitstag mit Analyse, Aktivierung und persönlicher Einordnung.",
              href: "/gesundheitstag-nuernberg/",
              ctaLabel: "Gesundheitstag ansehen"
            },
            {
              detail: "Preise & Formate",
              title: "Personal Training Kosten",
              text: "Leistungsumfang, Modelle und Investition für Personal Training transparent einordnen.",
              href: "/personal-training-kosten-nuernberg/",
              ctaLabel: "Kosten ansehen"
            },
            {
              detail: "Events · Bühne · Interviews",
              title: "Moderator Nürnberg",
              text: "Professionelle Moderation für Business-, Sport- und Bühnenformate mit Präsenz und Timing.",
              href: "/events/",
              ctaLabel: "Moderation ansehen"
            }
          ],
          "feature-grid--search-paths"
        )}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Nächster Schritt",
      title: "Lass uns dein Ziel kurz einordnen.",
      text:
        "Schreib kurz, was du erreichen möchtest. Dominik antwortet persönlich und klärt unverbindlich, welcher Einstieg für dich sinnvoll ist.",
      primary: { label: "Unverbindlich anfragen", href: contactHref() }
    })}
  `;

  return layout({
    path: "/",
    bodyClass: "page-premium page-home-reboot",
    title: "Camp Dörfl | Performance System Nürnberg",
    description:
      "Camp Dörfl ist das Performance System von Dominik Dörfl in Nürnberg – für persönliche Leistungsentwicklung, Firmenfitness, Event-Moderation und die Camp Dörfl App.",
    pageName: "Camp Dörfl",
    dateModified: "2026-08-10",
    socialImage: "/assets/images/home-hero-ironman-interview-social.jpg",
    socialImageAlt: "Dominik Dörfl als Ironman-Finisher im Stadion",
    keywords: [
      "Camp Dörfl Nürnberg",
      "Performance System Nürnberg",
      "Premium Coaching Nürnberg",
      "Firmenfitness Nürnberg",
      "Moderator Nürnberg"
    ],
    content
  });
}

function appPage() {
  const content = `
    <section class="ff-hero ff-hero--app ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/home-app-preview.webp" alt="Vorschau der Camp Dörfl App mit Training, Ernährung, Check-ins und Performance-Funktionen"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <div class="ff-hero__app-copy">
          <p class="ff-hero__eyebrow" data-reveal>Fitness App · Training · Ernährung · Fortschritt</p>
          <h1 class="ff-hero__title" data-reveal>Deine Fitness.<br><span>Komplett begleitet.</span><br>Professionell analysiert.</h1>
          <p class="ff-hero__lead" data-reveal>
            Die Fitness App von Camp Dörfl verbindet deinen Trainingsplan, Ernährung, praktische Alltagstools, Community und persönliche Begleitung in einem professionellen System.
          </p>
          <p class="ff-hero__support" data-reveal>10 Jahre Erfahrung. 13 Deutsche-Meister-Titel. Eine Vision: dich immer weiterzuentwickeln.</p>
          <div class="ff-hero__actions" data-reveal>
            <a class="app-store-symbol app-store-symbol--apple" href="https://apps.apple.com/de/app/camp-d%C3%B6rfl/id6767655689" target="_blank" rel="noopener noreferrer" aria-label="Camp Dörfl App im Apple App Store öffnen" title="Im Apple App Store öffnen">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.58 9.05 7.3c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1l.02-.01zM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </a>
            <span class="app-store-symbol app-store-symbol--android" role="img" aria-label="Android App – Link folgt" title="Android App – Link folgt">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 9.1h9.6v8.8a1.2 1.2 0 0 1-1.2 1.2h-.9v2.3a.9.9 0 0 1-1.8 0v-2.3h-1.8v2.3a.9.9 0 0 1-1.8 0v-2.3h-.9a1.2 1.2 0 0 1-1.2-1.2V9.1Zm1.5-3.8 1-1.7.7.4-.9 1.6a6.2 6.2 0 0 1 5 0l-.9-1.6.7-.4 1 1.7A5.2 5.2 0 0 1 17.2 8H6.8a5.2 5.2 0 0 1 1.9-2.7ZM9.7 7.1a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1Zm4.6 0a.55.55 0 1 0 0-1.1.55.55 0 0 0 0 1.1ZM5.4 9.8h.9v7.1a.9.9 0 0 1-1.8 0v-6.2c0-.5.4-.9.9-.9Zm13.2 0c.5 0 .9.4.9.9v6.2a.9.9 0 0 1-1.8 0V9.8h.9Z"/></svg>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/hF05HMpokj8?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/shorts/hF05HMpokj8",
            title: "Camp Dörfl Fitness App",
            image: "/assets/images/home-app-preview.webp",
            alt: "Vorschau der Camp Dörfl Fitness App",
            headline: "Die Camp Dörfl Fitness App im Einsatz.",
            actionLabel: "Short laden",
            eyebrow: "YouTube Short",
            short: true
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide app-function-stage">
        ${sectionHeader({
          eyebrow: "Fitness App mit echtem Nutzen",
          title: "Was bekommst du mit der Camp Dörfl Fitness App?",
          text:
            "Ein professionelles Fitness-App-System für Training, Ernährung und messbaren Fortschritt – mit Technologie, Expertenwissen und direktem Coach-Zugang."
        })}
        ${appFunctionGrid(appFunctionRows)}
      </div>
    </section>

    <section class="section section--tight">
      <div id="app-vorschau" class="section-shell section-shell--wide app-preview-stage">
        ${sectionHeader({
          eyebrow: "Fitness App im Alltag",
          title: "Alles, was du für deinen Fortschritt brauchst. In einer Fitness App.",
          text:
            "Trainingsplan, Ernährungsplan, Check-ins, Tools und Community sind dort, wo du sie brauchst: direkt in deiner Camp Dörfl Fitness App."
        })}
        ${devicePreviewGallery(appPreviewCards)}
      </div>
    </section>

    <section class="section section--muted corporate-cases-section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Aus der Praxis",
          title: "Gesundheit für unterschiedliche Arbeitswelten.",
          text:
            "Nicht jedes Team braucht dieselben Beispiele. Entscheidend ist, dass Ernährung, Bewegung und Gesundheit an die tatsächliche Belastung im Beruf anschließen.",
          align: "center"
        })}
        <div class="corporate-case-grid">
          <article class="corporate-case-card" data-reveal>
            <span class="corporate-case-card__sector">Kommune · Pflege &amp; Gesundheit</span>
            <h3>Stadt Nürnberg</h3>
            <p>Gesundheitskommunikation für Mitarbeitende aus Pflege- und Gesundheitsamt – verständlich, praxisnah und mit Blick auf anspruchsvolle Arbeitsbedingungen.</p>
            <ul><li>Ernährung im fordernden Berufsalltag</li><li>Bewegung trotz knapper Zeitfenster</li><li>Dranbleiben als Gesundheitsfaktor</li></ul>
          </article>
          <article class="corporate-case-card corporate-case-card--accent" data-reveal>
            <span class="corporate-case-card__sector">Industrie · Produktion</span>
            <h3>Neunkirchener Achsenfabrik</h3>
            <p>Ein Format für ein industrielles Arbeitsumfeld, in dem körperliche Belastung, Schichtrealität und alltagstaugliche Ernährung gemeinsam betrachtet werden.</p>
            <ul><li>passend zur Arbeitsrealität</li><li>konkrete Ernährungsimpulse</li><li>Sport sinnvoll integrieren</li></ul>
          </article>
          <article class="corporate-case-card" data-reveal>
            <span class="corporate-case-card__sector">Gebäudetechnik · Service</span>
            <h3>Caverion GmbH</h3>
            <p>Gesundheitsimpulse für eine Arbeitswelt zwischen Technik, Service, wechselnden Einsatzorten und Büro – ohne pauschale Standardempfehlungen.</p>
            <ul><li>berufsfeldbezogener Vortrag</li><li>Ernährung realistisch planen</li><li>Bewegung flexibel denken</li></ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Was du über die Fitness App wissen solltest.",
          text:
            "Die Camp Dörfl Fitness App ist das digitale Zentrum deines Systems und bewusst größer gedacht als eine normale Trainings-App."
        })}
        ${faq(appFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Camp Dörfl Fitness App",
      title: "Deine Fitness App für klare Fortschritte.",
      text:
        "Die Camp Dörfl Fitness App verbindet KI-gestützte Programmierung mit Expertenwissen, damit du für deinen nächsten Schritt eine klare, passende Antwort bekommst.",
      primary: { label: "App-Zugang anfragen", href: contactHref("app") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/app/",
    title: "Fitness App für Training, Ernährung & Fortschritt | Camp Dörfl",
    description:
      "Fitness App von Camp Dörfl: Trainingsplan, Ernährungsplan, Coach-Zugang, Scans, GPS-Routen, Community und Fortschrittsanalyse in einer App.",
    keywords: ["Fitness App", "Fitness App mit Trainingsplan", "Fitness App mit Ernährungsplan", "Fitness App mit Coach", "Camp Dörfl App"],
    bodyClass: "page-premium page-app",
    socialImage: "/assets/images/home-app-preview-social.jpg",
    socialImageAlt: "Vorschau der Camp Dörfl App mit Training, Ernährung und Check-ins",
    extraStructuredData: [
      serviceSchema({
        path: "/app/",
        name: "Camp Dörfl Fitness App",
        serviceType: "Fitness App für Training und Ernährung",
        description:
          "Fitness App für Training, Ernährung, Check-ins, Coach-Zugang, GPS-Routen, Community und Fortschrittsanalyse."
      }),
      faqSchema("/app/", appFaq)
    ],
    content
  });
}

function personalCoachingPage() {
  const content = `
    <section class="ff-hero ff-hero--coaching ff-hero--coaching-photo">
      <img class="ff-hero__img" src="/assets/images/premium-training-hero-wide.webp" srcset="/assets/images/premium-training-hero-wide-960.webp 960w, /assets/images/premium-training-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl als Personal Trainer in Nürnberg beim Training mit einem Kunden im Studio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Personal Trainer Nürnberg · 1:1 Coaching</p>
        <h1 class="ff-hero__title" data-reveal>Personal Trainer <br><span>Nürnberg.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Dein Personal Trainer in Nürnberg für Premium 1:1 Coaching: Training, 2D-Körperanalyse, InBody, Ernährung und persönliche Steuerung in einem klaren System.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("premium-training")}"><span>Beratung anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/koerperanalyse-nuernberg/"><span>Körperanalyse ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Leistungsbausteine im Premium Personal Training">
          <div><dt>1:1</dt><dd>Persönliche Führung</dd></div>
          <div><dt>2D</dt><dd>Analyse & InBody</dd></div>
          <div><dt>App</dt><dd>Check-ins & Steuerung</dd></div>
        </dl>
      </div>
    </section>

    <section class="pt-authority" aria-labelledby="pt-authority-title">
      <div class="section-shell section-shell--wide pt-authority__grid">
        <div class="pt-authority__copy" data-reveal>
          <p class="eyebrow">Erfahrung & nachweisbare Resultate</p>
          <h2 id="pt-authority-title">Warum Dominik Dörfl als Personal Trainer in Nürnberg?</h2>
          <p>Weil persönliche Erfahrung, dokumentierte Coaching-Erfolge und echte Kundenstimmen zusammenkommen: nicht als Werbeversprechen, sondern öffentlich nachvollziehbar.</p>
          <div class="pt-authority__links">
            <a href="/erfolge-im-team/">Alle Coaching-Erfolge ansehen <span aria-hidden="true">→</span></a>
            <a href="/ueber-dominik/">Dominik Dörfl kennenlernen <span aria-hidden="true">→</span></a>
            <a href="/personal-trainer-auswaehlen-nuernberg/">7 Kriterien für einen guten Personal Trainer <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <dl class="pt-authority__facts" data-reveal aria-label="Erfahrung und Referenzen von Personal Trainer Dominik Dörfl">
          <div><dt>10+</dt><dd>Jahre Coaching-Erfahrung</dd></div>
          <div><dt>13</dt><dd>Deutsche Meistertitel im betreuten Team</dd></div>
          <div><dt>${coachSuccessStats.placements}</dt><dd>dokumentierte Wettkampfplatzierungen</dd></div>
          <div><dt>5,0</dt><dd>Sterne aus 34 Google-Bewertungen</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Personal Training in Nürnberg",
            title: "1:1 Coaching, das zu deinem Alltag passt.",
            text:
              "Als Personal Trainer in Nürnberg begleite ich dich persönlich: mit ehrlichem Feedback, einem nachvollziehbaren Plan und einer Struktur, die auch außerhalb des Trainings funktioniert."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Erfahrung, die in dein Training einfließt</h3>
              <p>Leistungssport, Bühnenerfahrung und die praktische Arbeit mit Menschen mit anspruchsvollen Zielen bilden die Basis für dein individuelles Personal Training.</p>
            </article>
            <article class="summary-row">
              <h3>Steuerung statt isolierter Einzeltermine</h3>
              <p>Analyse, Training, Ernährung und regelmäßige Anpassung greifen ineinander, damit Fortschritt nicht vom Zufall oder kurzfristiger Motivation abhängt.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/KTvHOvTNJ8w?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=KTvHOvTNJ8w",
            title: "Camp Dörfl Premium Personal Training",
            image: "/assets/images/dominik-personal-coaching-client.webp",
            alt: "Dominik Dörfl im Premium Personal Training mit einem Kunden",
            headline: "Premium Personal Training im echten Einsatz.",
            actionLabel: "Video laden"
          })}
        </div>
      </div>
    </section>

    <section class="section section--coaching-start">
      <div class="section-shell section-shell--wide coaching-start-stage">
        <div class="coaching-start-stage__top">
          <div class="coaching-start-stage__head">
            ${sectionHeader({
              eyebrow: "Drei Wege",
              title: "Vom Einzeltraining bis zur <span>Premium-Begleitung.</span>",
              text:
                "Du kannst über Einzelstunden, Premium Coaching oder die Camp Dörfl App in das System einsteigen."
            })}
          </div>
          <figure class="coaching-start-stage__photo" data-reveal>
            <img src="/assets/images/dominik-bike-road-yellow.webp" alt="Dominik Doerfl mit Rennrad im gelb-weissen Trikot"${imageLoadingAttributes()}>
          </figure>
        </div>
        ${featureGrid(coachingIncludedCards, "feature-grid--coaching-start")}
      </div>
    </section>

    <section class="section section--muted section--coaching-outcome">
      <div class="section-shell section-shell--wide">
        <div class="coaching-outcome-stage">
          ${sectionHeader({
            eyebrow: "Ergebnis",
            title: "Was am Ende <span>spürbar anders</span> ist.",
            text:
              "Ziel des Trainings ist nicht nur mehr Wissen, sondern ein Zustand, den du in deinem Alltag wirklich merkst.",
            align: "center"
          })}
          ${summaryRows(coachingOutcomeRows)}
        </div>
      </div>
    </section>

    ${guenterStoryPreview("coaching")}

    <section class="section section--tight coaching-success-proof-section">
      <div class="section-shell section-shell--wide">
        <a class="coaching-success-proof" href="/erfolge-im-team/" data-reveal aria-label="Alle Erfolge im Team ansehen">
          <div class="coaching-success-proof__copy">
            <p class="eyebrow">Erfolge aus dem Camp Dörfl</p>
            <h2>Coaching, das sich <span>auf der Bühne beweist.</span></h2>
            <p>Vom ersten Wettkampf bis zur internationalen Pro Card: Ein kurzer Einblick in die dokumentierten Resultate der Athletinnen und Athleten aus dem Camp.</p>
            <span class="coaching-success-proof__cta">Alle Erfolge im Team ansehen <span aria-hidden="true">&rarr;</span></span>
          </div>
          <dl class="coaching-success-proof__stats" aria-label="Erfolgsbilanz im Camp Dörfl">
            <div><strong>${coachSuccessStats.placements}</strong><span>Platzierungen</span></div>
            <div><strong>${coachSuccessStats.wins}</strong><span>Siege</span></div>
            <div><strong>${coachSuccessStats.podiums}</strong><span>Podiumsplätze</span></div>
            <div><strong>IFBB</strong><span>Pro Card 2026</span></div>
          </dl>
          <figure class="coaching-success-proof__media">
            <img src="/assets/images/team-success-hero-960.jpg" alt="Camp-Dörfl-Athlet in erfolgreicher Wettkampfform"${imageLoadingAttributes()}>
          </figure>
        </a>
      </div>
    </section>

    <section class="section section--tight section--coaching-reference">
      <div class="section-shell section-shell--wide">
        <div class="coaching-reference-stage">
          <div class="coaching-reference-stage__copy" data-reveal>
            ${sectionHeader({
              eyebrow: "Video-Referenz",
              title: "Noch ein echter Einblick in die <span>Zusammenarbeit.</span>",
              text:
                "Nicht gestellt, nicht überladen: Der Short zeigt genau die Dynamik, Präsenz und persönliche Führung, für die Premium Personal Training bei Camp Dörfl steht."
            })}
            <div class="premium-proof-pills coaching-reference-stage__pills" aria-label="Qualitäten dieser Referenz">
              <span>1:1 Atmosphäre</span>
              <span>Klare Führung</span>
              <span>Premium Anspruch</span>
            </div>
            <div class="summary-rows summary-rows--compact">
              <article class="summary-row">
                <h3>Präsenz, die Vertrauen schafft</h3>
                <p>Persönliche Führung, klare Kommunikation und professionelles Coaching greifen spürbar ineinander.</p>
              </article>
              <article class="summary-row">
                <h3>Premium Coaching. Echt erlebt.</h3>
                <p>Ein unverstellter Einblick in eine Zusammenarbeit, die individuell, verbindlich und auf nachhaltige Entwicklung ausgerichtet ist.</p>
              </article>
            </div>
          </div>
          <div class="coaching-reference-stage__media editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
            ${deferredVideoEmbed({
              embedUrl: "https://www.youtube-nocookie.com/embed/bP7DKqZu5xc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
              watchUrl: "https://youtube.com/shorts/bP7DKqZu5xc?si=VaGdauquMqCuWNyE",
              title: "Camp Dörfl Premium Personal Training",
              image: "/assets/images/premium-training-short-reference.jpg",
            alt: "Vorschaubild eines YouTube-Shorts über das Premium Personal Training bei Camp Dörfl",
              headline: "Premium Personal Training als Short-Referenz.",
              actionLabel: "Short laden",
              eyebrow: "YouTube Short",
              short: true
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Preis & Einstieg",
          title: "Was kostet ein Personal Trainer in Nürnberg?",
          text:
            "Wenn du Personal Trainer in Nürnberg vergleichst, hilft dir unser Kosten-Guide dabei, Formate, Betreuungsumfang und den passenden Einstieg klar einzuordnen."
        })}
        <div class="summary-rows summary-rows--compact">
          <article class="summary-row" data-reveal>
            <h3>Der Umfang bestimmt den passenden Rahmen</h3>
            <p>Entscheidend sind nicht nur Dauer und Häufigkeit der Einheiten, sondern auch Analyse, App-Begleitung, Trainingsziel und die gewünschte Betreuungsintensität.</p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Preise und Formate transparent einordnen</h3>
            <p>Von der Einzelsession über 5er- und 10er-Karten bis zur monatlichen Premium Begleitung: Die vollständige Übersicht zeigt Preise und Leistungsrahmen auf einen Blick.</p>
          </article>
        </div>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="/personal-training-kosten-nuernberg/"><span>Preise für Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Vor Ort in der Metropolregion",
          title: "Personal Training für Nürnberg, Fürth und Erlangen.",
          text:
            "Der persönliche Ausgangspunkt liegt in Nürnberg. Auch Kundinnen und Kunden aus Fürth, Erlangen und der Metropolregion nutzen die Kombination aus 1:1 Training, Körperanalyse, Ernährungsstruktur und App-Begleitung."
        })}
        ${featureGrid(
          [
            { detail: "Nürnberg", title: "Persönlich und direkt", text: "Training, Analyse und Beratung werden individuell auf Ausgangslage, Alltag und Ziel abgestimmt." },
            { detail: "Fürth & Erlangen", title: "Kurze Wege, klare Struktur", text: "Das Coaching verbindet persönliche Termine mit digitaler Planung und laufender Anpassung." },
            { detail: "Metropolregion", title: "Mehr als eine Einzelstunde", text: "Körperanalyse, Training, Ernährung und Fortschrittskontrolle greifen in einem System zusammen." }
          ],
          "feature-grid--local-service"
        )}
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Passt das zu deinem Leben?",
          text:
            "Wenn du Verantwortung trägst, muss das Training zu deinem Kalender passen und nicht umgekehrt."
        })}
        ${faq(coachingFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Premium Personal Training",
      title: "Finde heraus, ob dein Personal Trainer in Nürnberg zu dir passt.",
      text:
        "In einer persönlichen Beratung klären wir, ob das Coaching zu deiner Ausgangslage, deinem Kalender und deinem Anspruch passt.",
      primary: { label: "Beratung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/personal-trainer-nürnberg/",
    title: "Personal Trainer Nürnberg | Dominik Dörfl – echte Erfolge",
    description:
      "Personal Trainer Nürnberg: über 10 Jahre Erfahrung, 13 Deutsche Meistertitel im betreuten Team und 126 Platzierungen. 1:1 Coaching mit Dominik Dörfl.",
    keywords: ["Personal Trainer Nürnberg", "Personal Training Nürnberg", "Premium Personal Training Nürnberg", "1:1 Personal Training Nürnberg", "Ernährungscoaching Nürnberg"],
    bodyClass: "page-premium page-coaching",
    pageName: "Personal Trainer Nürnberg",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/premium-training-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl beim Personal Training mit einem Kunden in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/personal-trainer-nürnberg/",
        name: "Personal Trainer Nürnberg – Camp Dörfl",
        serviceType: "Personal Training in Nürnberg",
        description:
          "Persönlich geführtes Personal Training in Nürnberg mit Analyse, Ernährungsplanung, App und laufender Anpassung."
      }),
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: "Dominik Dörfl",
        url: `${site.url}/ueber-dominik/`,
        jobTitle: "Personal Trainer in Nürnberg",
        award: [
          "Zweifacher Deutscher Meister im Bodybuilding und Powerlifting",
          "Coach eines Teams mit 13 Deutschen Meistertiteln",
          "Coach einer IFBB Pro Card 2026"
        ],
        knowsAbout: [
          "Personal Training",
          "Krafttraining",
          "Bodybuilding",
          "Ernährungsplanung",
          "Körperanalyse",
          "Wettkampfvorbereitung"
        ],
        subjectOf: [
          { "@type": "WebPage", "@id": `${site.url}/erfolge-im-team/#webpage` },
          { "@type": "WebPage", "@id": `${site.url}/erfolge-im-team/guenter-preis/#webpage` }
        ]
      },
      faqSchema("/personal-trainer-nürnberg/", coachingFaq),
      videoObjectSchema({
        path: "/personal-trainer-nürnberg/",
        id: "premium-training-video",
        name: "Camp Dörfl Premium Personal Training",
        description:
          "Video-Einblick in das Premium Personal Training von Camp Dörfl mit persönlicher Führung, Training und alltagstauglicher Struktur.",
        thumbnailUrl: "/assets/images/dominik-personal-coaching-client.webp",
        uploadDate: "2025-12-03T15:48:09-08:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/KTvHOvTNJ8w?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=KTvHOvTNJ8w"
      }),
      videoObjectSchema({
        path: "/personal-trainer-nürnberg/",
        id: "premium-training-short",
        name: "Camp Dörfl Premium Personal Training Short",
        description:
          "Kurzer Videoeinblick in die direkte 1:1 Zusammenarbeit im Premium Personal Training von Camp Dörfl.",
        thumbnailUrl: "/assets/images/premium-training-short-reference.jpg",
        uploadDate: "2026-06-16T13:34:05-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/bP7DKqZu5xc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://youtube.com/shorts/bP7DKqZu5xc?si=VaGdauquMqCuWNyE"
      })
    ],
    content
  });
}

function guenterStoryPreview(context = "team") {
  return `
    <section class="section section--tight guenter-story-preview-section guenter-story-preview-section--${context}">
      <div class="section-shell section-shell--wide">
        <a class="guenter-story-preview" href="/erfolge-im-team/guenter-preis/" data-reveal aria-label="Die Erfolgsgeschichte von Günter Preis lesen">
          <figure class="guenter-story-preview__media">
            <img src="/assets/images/guenter-preis-coach-stage.jpg" alt="Dominik Dörfl gemeinsam mit Günter Preis und seiner Medaille nach einem Bodybuilding-Wettkampf"${imageLoadingAttributes()}>
            <span class="guenter-story-preview__badge">Neue Erfolgsgeschichte</span>
          </figure>
          <div class="guenter-story-preview__copy">
            <p class="eyebrow">Erfolgsgeschichte · Günter Preis</p>
            <h2>Gesundheit zuerst.<br><span>Bühne später.</span></h2>
            <p>Eine zufällige Begegnung im Jahr 2021 wurde zum Anfang einer außergewöhnlichen Geschichte: erst raus aus der gesundheitlichen Gefahrenzone, dann zurück auf die Bühne – bis zum Vizeweltmeistertitel mit 63.</p>
            <dl class="guenter-story-preview__facts" aria-label="Günters Entwicklung in Zahlen">
              <div><strong>63</strong><span>Jahre</span></div>
              <div><strong>3</strong><span>Saisons im Team</span></div>
              <div><strong>2</strong><span>Jahre Gesundheitsfokus</span></div>
            </dl>
            <span class="guenter-story-preview__cta">Günters ganze Geschichte lesen <span aria-hidden="true">&rarr;</span></span>
          </div>
        </a>
      </div>
    </section>`;
}

function firmenfitnessPage() {
  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--firmenfitness ff-hero--firmenfitness-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/firmenfitness-hero-wide.webp" srcset="/assets/images/firmenfitness-hero-wide-960.webp 960w, /assets/images/firmenfitness-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl im Firmenfitness-Kontext mit Analyse und Beratung für Unternehmen"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Aus Nürnberg · Deutschlandweit im Einsatz</p>
          <h1 class="ff-hero__title" data-reveal>Firmenfitness. <br><span>Deutschlandweit.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Gesundheitstage mit InBody-Körperanalyse, berufsfeldbezogene Ernährungsvorträge und aktive Team-Impulse – direkt bei Ihnen im Unternehmen, in Nürnberg und in ganz Deutschland.
          </p>
          <p class="ff-hero__support" data-reveal>
            Drei klare Angebote, individuell an Mitarbeitende, Arbeitsrealität und Standort angepasst. Professionell geplant, verständlich vermittelt und organisatorisch sauber umgesetzt.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("firmenfitness")}"><span>Firmenfitness anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/gesundheitstag-nuernberg/"><span>Gesundheitstag ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="premium-proof-pills ff-hero__pills" data-reveal>
            <span>InBody &amp; Beratung</span>
            <span>Ernährungsvortrag</span>
            <span>Team-Aktivierung</span>
            <span>Deutschlandweit</span>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Firmenfitness-Module">
            <div><dt>3</dt><dd>klare Angebote</dd></div>
            <div><dt>InBody</dt><dd>mit Beratung</dd></div>
            <div><dt>DE</dt><dd>bundesweit vor Ort</dd></div>
          </dl>
      </div>
    </section>

    <section class="section corporate-offers-section" id="angebote">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Drei Angebote",
          title: "Firmenfitness, die zur Arbeitsrealität passt.",
          text:
            "Gesundheit wird dann relevant, wenn Mitarbeitende verstehen, was sie konkret tun können. Deshalb verbindet jedes Angebot fachliche Substanz mit einer Umsetzung, die zum jeweiligen Berufsfeld passt.",
          align: "center"
        })}
        ${corporateOfferShowcase(corporateModuleCards)}
        <div class="corporate-offers-cta" data-reveal>
          <p><strong>Noch nicht sicher, welches Angebot passt?</strong> Die drei Formate können einzeln geplant oder als Gesundheitstag sinnvoll kombiniert werden.</p>
          <a class="button button--primary" href="${contactHref("firmenfitness")}"><span>Passendes Format anfragen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        <div class="editorial-stage__media editorial-stage__media--video corporate-wide-video-stage" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/cDQ3xaj2we8?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=cDQ3xaj2we8",
            title: "Camp Dörfl Firmenfitness Querformat",
            image: "/assets/images/dominik-bike-blue.webp",
            alt: "Camp Dörfl Firmenfitness mit Aktivierung und Bewegungsbezug",
            headline: "Firmenfitness. Groß gedacht.",
            actionLabel: "Video laden"
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide corporate-reference-band" data-reveal>
        <div class="corporate-reference-band__copy">
          <p class="eyebrow">Referenzen Firmenfitness</p>
          <h2>Erfahrung aus Kommune, Industrie und Gebäudetechnik.</h2>
          <p>
            Camp Dörfl hat Gesundheitsformate unter anderem für die Stadt Nürnberg im Pflege- und Gesundheitsamt, die Neunkirchener Achsenfabrik und die Caverion GmbH umgesetzt. Dazu kommen weitere Einsätze in Unternehmen, Bildung und öffentlichem Umfeld.
          </p>
        </div>
        <div class="corporate-reference-band__logos" aria-label="Referenzen Firmenfitness">
          ${corporateReferenceLogos
            .map(
              ({ name, image, alt, url, text }) => `
                <a class="corporate-reference-card" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Website von ${name} öffnen">
                  <span class="corporate-reference-card__logo">
                    <img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
                  </span>
                  <span class="corporate-reference-card__divider" aria-hidden="true"></span>
                  <span class="corporate-reference-card__body">
                    <span class="reference-card__name">${name}</span>
                    <span>${text}</span>
                  </span>
                  <span class="corporate-reference-card__arrow" aria-hidden="true">&rsaquo;</span>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Warum Camp Dörfl",
            title: "Warum Dranbleiben kein Nice-to-have ist.",
            text:
              "Gesundheit konkurriert im Arbeitsalltag jeden Tag mit Zeitdruck, Schichtplänen und Belastung. Camp Dörfl übersetzt Ernährung und Bewegung deshalb in konkrete Möglichkeiten für das jeweilige Berufsfeld."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Inhalte passend zum Berufsfeld</h3>
              <p>Pflege, Verwaltung, Industrie, technischer Außendienst oder Büroarbeit stellen unterschiedliche Anforderungen. Vortrag und Beratung greifen genau diese Realität auf.</p>
            </article>
            <article class="summary-row">
              <h3>Wissen wird umsetzbar</h3>
              <p>Gesunde Ernährung und Sport werden nicht als Idealbild erklärt, sondern als realistische Entscheidungen, die auch in volle Arbeitstage passen.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/rQ9YocgKVSc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=rQ9YocgKVSc",
            title: "Camp Dörfl Firmenfitness",
            image: "/assets/images/dominik-athlete-nutrition.webp",
            alt: "Dominik Dörfl in einem Performance- und Ernährungs-Kontext",
            headline: "Firmenfitness im Einsatz.",
            actionLabel: "Video laden",
            short: true
          })}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Wirkung",
          title: "Was Unternehmen konkret davon haben.",
          text:
            "Das Format schafft Aufmerksamkeit, konkrete Handlungsempfehlungen und einen hochwertigen Anlass für echte Gesundheitskommunikation.",
          align: "center"
        })}
        ${corporateOutcomeShowcase(corporateOutcomeRows)}
      </div>
    </section>

    <section class="section corporate-reach-section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Deutschlandweit vor Ort",
          title: "Ein Standort oder mehrere. Ein klares System.",
          text:
            "Camp Dörfl kommt direkt in Ihr Unternehmen – von Nürnberg bis Hamburg, Berlin, Köln oder München. Umfang, Taktung und Aufbau werden an Teamgröße, Räumlichkeiten und mehrere Standorte angepasst.",
          align: "center"
        })}
        <div class="corporate-scale-grid">
          <article data-reveal><span>Bis 25</span><h3>Kompaktes Teamformat</h3><p>Persönlich, fokussiert und mit ausreichend Zeit für individuelle Fragen oder Auswertungen.</p></article>
          <article data-reveal><span>25–100</span><h3>Getakteter Gesundheitstag</h3><p>Klare Zeitfenster, verlässlicher Teilnehmerfluss und kombinierbare Analyse-, Beratungs- und Vortragsmodule.</p></article>
          <article data-reveal><span>100+</span><h3>Größerer Aktionstag</h3><p>Strukturierte Planung für größere Belegschaften, mehrere Gruppen oder ein Format mit verschiedenen Stationen.</p></article>
          <article data-reveal><span>Multi-Site</span><h3>Mehrere Standorte</h3><p>Einheitliche Gesundheitskommunikation mit einem Ablauf, der deutschlandweit reproduzierbar und trotzdem standortgerecht bleibt.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--muted corporate-process-section">
      <div class="section-shell section-shell--wide corporate-process-layout">
        <div class="corporate-process-copy" data-reveal>
          <p class="eyebrow">Von der Anfrage bis zum Einsatztag</p>
          <h2>Intern leicht zu planen. Vor Ort professionell geführt.</h2>
          <p>Sie liefern den organisatorischen Rahmen. Camp Dörfl entwickelt daraus ein Format, das zu Zielgruppe, Berufsfeld und gewünschter Wirkung passt.</p>
          <a class="button button--primary" href="${contactHref("firmenfitness")}"><span>Rahmen kurz einordnen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <ol class="corporate-process-list" aria-label="Ablauf einer Firmenfitness-Anfrage">
          <li data-reveal><span>01</span><div><h3>Ziel und Zielgruppe klären</h3><p>Berufsfeld, Mitarbeiterzahl, Standort und gewünschte Wirkung werden kurz eingeordnet.</p></div></li>
          <li data-reveal><span>02</span><div><h3>Angebot zusammenstellen</h3><p>Gesundheitstag, Vortrag, Aktivierung oder eine passende Kombination werden konkret geplant.</p></div></li>
          <li data-reveal><span>03</span><div><h3>Teilnehmerfluss vorbereiten</h3><p>Zeitfenster, Räume, interne Kommunikation und benötigte Ausstattung werden sauber abgestimmt.</p></div></li>
          <li data-reveal><span>04</span><div><h3>Deutschlandweit durchführen</h3><p>Camp Dörfl übernimmt das Format vor Ort und führt Mitarbeitende verständlich durch Inhalte, Analyse und Umsetzung.</p></div></li>
        </ol>
      </div>
    </section>

    <section class="section corporate-decision-section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Für Entscheider",
          title: "Was HR und Geschäftsführung vorab wissen müssen.",
          text:
            "Ein gutes Gesundheitsformat muss fachlich überzeugen und intern funktionieren. Deshalb werden Wirkung, Organisation und Kostenrahmen von Beginn an gemeinsam gedacht.",
          align: "center"
        })}
        <div class="corporate-decision-grid">
          <article data-reveal><span>01</span><h3>Der Umfang bleibt planbar</h3><p>Der Preis richtet sich transparent nach Format, Teilnehmerzahl, Dauer, Standort und Kombination der Angebote.</p></article>
          <article data-reveal><span>02</span><h3>Der Aufwand bleibt überschaubar</h3><p>Benötigte Räume, Zeitfenster und interne Vorbereitung werden vorab in einer klaren Checkliste zusammengefasst.</p></article>
          <article data-reveal><span>03</span><h3>Die Inhalte passen zur Belegschaft</h3><p>Beispiele und Handlungsempfehlungen orientieren sich an Berufsfeld, Schichtmodell und tatsächlichen Belastungen.</p></article>
          <article data-reveal><span>04</span><h3>Das Angebot ist skalierbar</h3><p>Vom kompakten Team bis zu mehreren Standorten wird das Format an die gewünschte Reichweite angepasst.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Was Unternehmen vorab klären.",
          text:
            "Die häufigsten Fragen zu Firmenfitness, Gesundheitstagen und dem Ablauf im Unternehmen."
        })}
        ${faq(corporateFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Firmenfitness",
      title: "Planen Sie Firmenfitness mit klarer Struktur.",
      text:
        "Nennen Sie uns Berufsfeld, Mitarbeiterzahl, Standort und Wunschformat. Sie erhalten eine klare Einschätzung, welches Firmenfitness-Angebot fachlich und organisatorisch passt.",
      primary: { label: "Firmenfitness anfragen", href: contactHref("firmenfitness") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/firmenfitness/",
    title: "Firmenfitness Nürnberg & deutschlandweit | Camp Dörfl",
    description:
      "Firmenfitness aus Nürnberg, deutschlandweit: Gesundheitstage mit InBody, persönliche Beratung, Ernährungsvorträge und Team-Aktivierung für Unternehmen.",
    keywords: ["Firmenfitness deutschlandweit", "Firmenfitness Nürnberg", "Gesundheitstag Unternehmen", "Ernährungsvortrag Unternehmen", "BGM", "Betriebliche Gesundheitsförderung"],
    bodyClass: "page-premium page-firmenfitness",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/firmenfitness-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl bei einer Firmenfitness-Analyse und Beratung",
    extraStructuredData: [
      serviceSchema({
        path: "/firmenfitness/",
        name: "Firmenfitness deutschlandweit – Camp Dörfl",
        serviceType: "Firmenfitness, Gesundheitstage und Ernährungsvorträge",
        description:
          "Deutschlandweite Gesundheitstage mit InBody-Körperanalyse und Beratung, berufsfeldbezogene Ernährungsvorträge sowie Bewegungs- und Team-Aktivierungen für Unternehmen.",
        areaServed: { "@type": "Country", name: "Deutschland" }
      }),
      faqSchema("/firmenfitness/", corporateFaq),
      videoObjectSchema({
        path: "/firmenfitness/",
        id: "firmenfitness-video",
        name: "Camp Dörfl Firmenfitness Querformat",
        description:
          "Video-Einblick in Firmenfitness und Gesundheitstage von Camp Dörfl mit Aktivierung, Analyse und verständlicher Beratung.",
        thumbnailUrl: "/assets/images/dominik-bike-blue-social.jpg",
        uploadDate: "2026-02-10T10:18:36-08:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/cDQ3xaj2we8?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=cDQ3xaj2we8"
      }),
      videoObjectSchema({
        path: "/firmenfitness/",
        id: "firmenfitness-short",
        name: "Camp Dörfl Firmenfitness Short",
        description:
          "Kurzer Videoeinblick in Camp Dörfl Firmenfitness mit Ernährungs- und Gesundheitsbezug im Unternehmenskontext.",
        thumbnailUrl: "/assets/images/dominik-athlete-nutrition-social.jpg",
        uploadDate: "2026-06-16T13:32:09-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/rQ9YocgKVSc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=rQ9YocgKVSc"
      })
    ],
    content
  });
}

function eventsPage() {
  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--events ff-hero--events-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/events-hero-wide.webp" srcset="/assets/images/events-hero-wide-960.webp 960w, /assets/images/events-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl als Moderator auf einer Eventbühne mit Publikum"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Events · Moderation · Hosting</p>
          <h1 class="ff-hero__title" data-reveal>Moderator <br><span>in Nürnberg.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Moderator in Nürnberg für Interviews, Panels, Eröffnungen und Bühnenformate mit sportlicher Präsenz, sauberer Dramaturgie und professioneller Ruhe.
          </p>
          <p class="ff-hero__support" data-reveal>
            Besonders stark, wenn Markenwirkung, Timing und sichere Gesprächsführung gleichzeitig zählen.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("events")}"><span>Event anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/firmenfitness/"><span>Firmenfitness ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="premium-proof-pills ff-hero__pills" data-reveal>
            <span>Interviews</span>
            <span>Eröffnungen</span>
            <span>Podium</span>
            <span>Gala & Sport</span>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Event-Schwerpunkte">
            <div><dt>Live</dt><dd>Bühne & Publikum</dd></div>
            <div><dt>Talk</dt><dd>Interviews & Panels</dd></div>
            <div><dt>Brand</dt><dd>Präsenz & Timing</dd></div>
          </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        <div class="editorial-stage__media editorial-stage__media--video corporate-wide-video-stage" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/1kpl2HrShto?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://youtu.be/1kpl2HrShto",
            title: "Camp Dörfl Events Video",
            image: "/assets/images/events-hero-wide.webp",
            alt: "Vorschaubild eines Videos mit Dominik Dörfl bei einer Eventmoderation",
            headline: "Events live erleben.",
            actionLabel: "Video laden"
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell editorial-stage event-moderation-intro">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Warum Camp Dörfl",
            title: "Moderation, die Bühne, Gäste und Ablauf zusammenhält.",
            text:
              "Camp Dörfl verbindet Energie, Timing und Bühnenruhe so, dass Gäste sicher geführt werden, das Publikum dranbleibt und der Ablauf professionell wirkt."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Spürbare Präsenz</h3>
              <p>Publikum, Gäste und Veranstalter merken sofort, wenn Sprache, Körpersprache und Energie professionell getragen werden.</p>
            </article>
            <article class="summary-row">
              <h3>Sichere Bühnenführung</h3>
              <p>Ideal für Eröffnungen, Interviews und Bühnenmomente, die nahbar wirken sollen und trotzdem komplett kontrolliert bleiben müssen.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/oTRIacnkFPc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=oTRIacnkFPc",
            title: "Camp Dörfl Events",
            image: "/assets/images/dominik-moderator-mic.webp",
            alt: "Dominik Dörfl als Moderator mit Mikrofon auf einer Bühne",
            headline: "Events im Einsatz.",
            actionLabel: "Video laden",
            short: true
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell editorial-stage editorial-stage--event-video">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Interview-Beispiel",
            title: "Interviews ruhig, präsent und professionell führen.",
            text:
              "Gerade im Gespräch zeigt sich, ob ein Moderator nur Fragen stellt oder einen Gast wirklich sicher durch den Moment führt. So entsteht eine Bühne, auf der Menschen kompetent wirken und Ihre Veranstaltung hochwertig getragen wird."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Gespräche mit Haltung</h3>
              <div class="event-interview-card__text">Fragen, Übergänge und Reaktionen bleiben klar, nahbar und souverän, ohne künstlich oder überladen zu wirken.</div>
            </article>
            <article class="summary-row">
              <h3>Stark für Gäste und Publikum</h3>
              <div class="event-interview-card__text">Ideal für Bühneninterviews, Talk-Momente und Einbindungen, bei denen Präsenz, Sicherheit und Vertrauen direkt sichtbar werden sollen.</div>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/yhV7cyw2Pgg?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://youtu.be/yhV7cyw2Pgg",
            title: "Camp Dörfl Interview Beispiel",
            image: "/assets/images/event-stage-interview.webp",
            alt: "Dominik Dörfl führt ein Interview auf einer Eventbühne",
            headline: "Interview live erleben.",
            actionLabel: "Interview laden",
            short: true
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide event-reference-band" data-reveal>
        <div class="event-reference-band__intro">
          <p class="eyebrow">Referenzen</p>
          <h2>Gebucht von Marken, Verbänden und Veranstaltern.</h2>
          <p>Professionelle Bühnenpraxis für Formate, bei denen Präsenz, Timing und Vertrauen zählen.</p>
        </div>
        <div class="event-reference-band__logos" aria-label="Event Referenzen">
          ${eventReferenceLogos
            .map(
              ({ name, image, alt, url, text }) => `
                <a class="event-reference-card" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Website von ${name} öffnen">
                  <span class="event-reference-card__logo">
                    <img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
                  </span>
                  <span class="event-reference-card__divider" aria-hidden="true"></span>
                  <span class="event-reference-card__copy">
                    <span class="reference-card__name">${name}</span>
                    <span>${text}</span>
                  </span>
                  <span class="event-reference-card__arrow" aria-hidden="true">&rsaquo;</span>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Event-Formate",
          title: "Welche Bühnenformate Camp Dörfl besonders stark trägt.",
          text:
            "Für Veranstalter, die einen Moderator suchen, der Ablauf, Publikum und Marke nicht nur zusammenbringt, sondern sichtbar aufwertet.",
          align: "center"
        })}
        ${eventFormatShowcase(eventFormatCards)}
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide event-rule-stage">
        <div class="event-rule-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Verband & Wettkampf",
            title: "Formate mit klarem Regelwerk.",
            text:
              "Wenn Timing, Reihenfolge und Ansagen nicht frei interpretierbar sind, braucht es Moderation, die Bühne, Protokoll und Publikum sauber zusammenhält."
          })}
          <div class="premium-proof-pills event-rule-stage__pills" data-reveal>
            <span>Meisterschaften</span>
            <span>Siegerehrungen</span>
            <span>Offizielle Abläufe</span>
          </div>
          <div class="event-rule-stage__signal" data-reveal>
            <span>Präzise geführt</span>
            <p>Gerade bei Wettkampf- und Verbandsformaten zählt nicht nur Präsenz, sondern die Sicherheit, Regeln verständlich, respektvoll und ohne Reibung auf die Bühne zu bringen.</p>
          </div>
        </div>
        <div class="event-rule-stage__gallery" data-reveal aria-label="Formate mit klarem Regelwerk bei Camp Dörfl Events">
          <figure class="event-rule-stage__card event-rule-stage__card--award">
            <img src="/assets/images/event-rule-award.avif" alt="Dominik Dörfl bei einer Ehrung im Gespräch mit einem Preisträger auf der Bühne"${imageLoadingAttributes()}>
            <figcaption>
              <p>Interviews und Übergaben, die Protokoll und Live-Moment gleichzeitig tragen.</p>
            </figcaption>
          </figure>
          <figure class="event-rule-stage__card event-rule-stage__card--stage">
            <img src="/assets/images/event-rule-stage.avif" alt="Dominik Dörfl moderiert auf einer Wettkampfbühne mit Mikrofon vor einem Verbands-Backdrop"${imageLoadingAttributes()}>
            <figcaption>
              <p>Klare Ansagen, saubere Calls und Führung mit Autorität ohne unnötige Härte.</p>
            </figcaption>
          </figure>
          <figure class="event-rule-stage__card event-rule-stage__card--podium">
            <img src="/assets/images/event-rule-podium.avif" alt="Dominik Dörfl mit Mikrofon und Unterlagen an einem Rednerpult bei einem offiziellen Ablauf"${imageLoadingAttributes()}>
            <figcaption>
              <p>Auch in dichten Programmen bleibt der Ton ruhig, verständlich und präsent.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide event-fun-stage">
        <div class="event-fun-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Publikumsaktivierung",
            title: "Formate mit Spaß-Faktor.",
            text:
              "Wenn ein Event nicht nur sauber moderiert, sondern Menschen direkt mitgenommen werden sollen, entstehen genau die Momente, über die danach gesprochen wird."
          })}
          <div class="premium-proof-pills event-fun-stage__pills" data-reveal>
            <span>Mitmach-Challenges</span>
            <span>Center-Events</span>
            <span>Publikum aktiviert</span>
          </div>
        </div>
        <div class="event-fun-stage__gallery" data-reveal aria-label="Formate mit Spaß-Faktor bei Camp Dörfl Events">
          <figure class="event-fun-stage__card event-fun-stage__card--lead">
            <img src="/assets/images/event-fun-segmueller-poster.webp" alt="Dominik Dörfl beim Segmüller Bayern-Wochenende neben einem Veranstaltungsaufsteller"${imageLoadingAttributes()}>
            <figcaption>
              <span>Segmüller</span>
              <h3>Bayern-Wochenende mit Challenge-Charakter.</h3>
            </figcaption>
          </figure>
          <figure class="event-fun-stage__card event-fun-stage__card--stemmen">
            <img src="/assets/images/event-fun-segmueller-stemmen.webp" alt="Dominik Dörfl mit zwei Maßkrügen vor einem Maßkrugstemmen-Stand"${imageLoadingAttributes()}>
            <figcaption>
              <span>Mitmachformat</span>
              <h3>Publikumsmomente mit Energie und Augenzwinkern.</h3>
            </figcaption>
          </figure>
          <figure class="event-fun-stage__card event-fun-stage__card--hosting">
            <img src="/assets/images/event-fun-segmueller-hosting.webp" alt="Dominik Dörfl moderiert ein Maßkrugstemmen mit einem Kind auf der Bühne"${imageLoadingAttributes()}>
            <figcaption>
              <span>Nah dran</span>
              <h3>Moderation, die Menschen direkt ins Erlebnis holt.</h3>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Was Veranstalter meist wissen wollen.",
          text:
            "Die wichtigsten Fragen zu Moderation, Eventformaten und dem professionellen Ablauf auf der Bühne."
        })}
        ${faq(eventFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Events",
      title: "Sichern Sie sich Moderation mit Ruhe, Energie und Timing.",
      text:
        "Camp Dörfl moderiert Sport-, Fitness- und Business-Events mit Energie, Klarheit und einer Handschrift, die hängen bleibt.",
      primary: { label: "Event anfragen", href: contactHref("events") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/events/",
    title: "Moderator Nürnberg für Events, Bühne & Interviews | Camp Dörfl",
    description:
      "Moderator in Nürnberg für Events, Interviews, Panels und Bühnenformate mit klarer Führung, Timing und professioneller Präsenz.",
    keywords: ["Moderator Nürnberg", "Eventmoderator Nürnberg", "Bühnenmoderation Nürnberg", "Interview Moderator Nürnberg"],
    bodyClass: "page-premium page-events",
    socialImage: "/assets/images/events-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl als Moderator auf einer Eventbühne in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/events/",
        name: "Moderator in Nürnberg – Camp Dörfl",
        serviceType: "Event-Moderation",
        description:
          "Moderation für Sport-, Fitness- und Business-Events mit Interviews, Panels, Eröffnungen und Hosting."
      }),
      faqSchema("/events/", eventFaq),
      videoObjectSchema({
        path: "/events/",
        id: "events-video",
        name: "Camp Dörfl Events Video",
        description:
          "Video-Einblick in die Event-Moderation von Camp Dörfl für Bühne, Publikum und Veranstalter.",
        thumbnailUrl: "/assets/images/events-hero-wide-social.jpg",
        uploadDate: "2025-09-05T02:09:12-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/1kpl2HrShto?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://youtu.be/1kpl2HrShto"
      }),
      videoObjectSchema({
        path: "/events/",
        id: "events-short",
        name: "Camp Dörfl Events Short",
        description:
          "Kurzer Videoeinblick in die Event-Moderation von Camp Dörfl mit Präsenz, Timing und Bühnenführung.",
        thumbnailUrl: "/assets/images/dominik-moderator-mic-social.jpg",
        uploadDate: "2026-06-16T09:04:24-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/oTRIacnkFPc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=oTRIacnkFPc"
      }),
      videoObjectSchema({
        path: "/events/",
        id: "interview-video",
        name: "Camp Dörfl Interview Beispiel",
        description:
          "Video-Beispiel für Interviewführung und Moderation von Camp Dörfl auf einer Live-Bühne.",
        thumbnailUrl: "/assets/images/event-stage-interview-social.jpg",
        uploadDate: "2026-06-17T15:24:51-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/yhV7cyw2Pgg?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://youtu.be/yhV7cyw2Pgg"
      })
    ],
    content
  });
}

function guenterPreisStoryPage() {
  const content = `
    <section class="guenter-story-hero">
      <div class="section-shell section-shell--wide guenter-story-hero__grid">
        <div class="guenter-story-hero__copy">
          <a class="guenter-story-backlink" href="/erfolge-im-team/"><span aria-hidden="true">&larr;</span> Erfolge im Team</a>
          <p class="eyebrow" data-reveal>Erfolgsgeschichte · Günter Preis</p>
          <h1 data-reveal>Gesundheit zuerst.<br><span>Dann kam die Bühne.</span></h1>
          <p class="guenter-story-hero__lead" data-reveal>Heute ist Günter mit 63 Jahren Vizeweltmeister und mehrfacher Bronzemedaillengewinner bei Deutschen Meisterschaften. Doch diese Geschichte beginnt nicht im Scheinwerferlicht. Sie beginnt mit besorgniserregenden Blutwerten, vielen Medikamenten – und einer Entscheidung: Gesundheit kommt vor Wettkampf.</p>
          <dl class="guenter-story-hero__facts" data-reveal aria-label="Eckdaten der Zusammenarbeit">
            <div><dt>2021</dt><dd>Kennengelernt</dd></div>
            <div><dt>3</dt><dd>gemeinsame Saisons</dd></div>
            <div><dt>63</dt><dd>Jahre alt</dd></div>
          </dl>
        </div>
        <figure class="guenter-story-hero__media" data-reveal>
          <img src="/assets/images/guenter-preis-coach-stage.jpg" alt="Dominik Dörfl und Günter Preis mit Medaille bei einer Bodybuilding-Meisterschaft"${imageLoadingAttributes({ eager: true })}>
          <span class="guenter-story-hero__seal" aria-hidden="true"><strong>63</strong><span>Jahre · heute</span></span>
          <figcaption>Dominik und Günter: aus einer Begegnung 2021 wurden drei gemeinsame Saisons.</figcaption>
        </figure>
      </div>
    </section>

    <nav class="guenter-story-jump" aria-label="Kapitel dieser Erfolgsgeschichte">
      <div class="section-shell section-shell--wide">
        <span>Günters Weg</span>
        <a href="#kennenlernen"><b>01</b> Kennenlernen</a>
        <a href="#gesundheit"><b>02</b> Ausgangslage</a>
        <a href="#diabetes-in-deutschland"><b>03</b> Warum es zählt</a>
        <a href="#heute"><b>04</b> Heute</a>
        <a href="#buehne"><b>05</b> Bühne</a>
      </div>
    </nav>

    <section class="section guenter-story-origin" id="kennenlernen">
      <div class="section-shell guenter-story-editorial">
        <div class="guenter-story-editorial__intro" data-reveal>
          <p class="eyebrow">Der Anfang</p>
          <h2>Eine Warteschlange.<br>Ein gutes Gefühl.<br><span>Und zunächst Funkstille.</span></h2>
        </div>
        <div class="guenter-story-editorial__body" data-reveal>
          <p class="guenter-story-dropcap">Manchmal beginnt eine große Geschichte an einem völlig unspektakulären Ort. 2021 standen Günter und Dominik bei einem Wettkampf in der Schlange zur Anmeldung. Ein kurzes Gespräch, sofortige Sympathie – dann gingen beide wieder ihrer Wege.</p>
          <p>Erst nach der Saison meldete Günter sich. Er wollte mit Camp Dörfl arbeiten, stärker werden und sportlich noch einmal angreifen. Doch beim ehrlichen Blick auf seine Ausgangslage rückte die Bühne zunächst weit in den Hintergrund.</p>
          <blockquote>„Wir haben nicht zuerst über Form, Gewicht oder Platzierungen gesprochen. Wir haben gesagt: Jetzt müssen wir deine gesundheitliche Basis stabilisieren.“</blockquote>
        </div>
      </div>
    </section>

    <section class="section section--muted guenter-story-start" id="gesundheit">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Gesundheit vor Wettkampf",
          title: "Der wichtigste Plan führte nicht zur Bühne – <span>sondern weg von der gesundheitlichen Gefahrenzone.</span>",
          text:
            "Günter lebte mit Typ-2-Diabetes und einer hohen Medikamenteneinnahme. Gleichzeitig machten die Nierenwerte Sorgen; eine mögliche Dialyse stand als ernstes Risiko im Raum. Aus dem sportlichen Coaching wurde deshalb zuerst ein präzise strukturierter Neustart – mit Gesundheit als einziger Priorität."
        })}
        <div class="guenter-story-plan">
          <article data-reveal>
            <span>01</span>
            <h3>Ausdauer gezielt erhöhen</h3>
            <p>Regelmäßiges Ausdauertraining wurde zu einem festen Bestandteil der Woche – planbar, messbar und passend zu Günters Belastbarkeit.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>Ernährung neu strukturieren</h3>
            <p>Die Ernährung wurde kohlenhydratbewusster aufgebaut und konsequent an Blutzuckerwerte, Alltag und Trainingsbelastung angepasst.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>Werte eng beobachten</h3>
            <p>Blutzucker und Blutwerte blieben laufend im Blick. So wurde nicht nach Gefühl gesteuert, sondern auf Grundlage der tatsächlichen Entwicklung.</p>
          </article>
          <article data-reveal>
            <span>04</span>
            <h3>Medikation ärztlich begleiten</h3>
            <p>Das Ziel war, Voraussetzungen für eine medizinisch verantwortete Reduzierung der Medikamente zu schaffen – beginnend bei Metformin.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section guenter-story-diabetes" id="diabetes-in-deutschland">
      <div class="section-shell section-shell--wide">
        <div class="guenter-story-diabetes__heading" data-reveal>
          <div>
            <p class="eyebrow">Weg vom Diabetes</p>
            <h2>Günter ist mein Typ.<br><span>Ein Kämpfer gegen Typ 2.</span></h2>
          </div>
          <div>
            <p>Günters Geschichte ist persönlich. Das Problem dahinter betrifft Millionen Menschen: Typ-2-Diabetes kann lange unbemerkt bleiben und auf Dauer auch die feinen Blutgefäße der Nieren schädigen.</p>
            <p>„Weg vom Diabetes“ bedeutet hier nicht Heilversprechen, sondern Richtung: Werte verstehen, Gewohnheiten verändern, medizinisch begleiten lassen und jeden messbaren Fortschritt konsequent absichern.</p>
          </div>
        </div>

        <div class="guenter-story-data" data-reveal>
          <article class="guenter-story-chart" aria-labelledby="diabetes-chart-title">
            <div class="guenter-story-chart__head">
              <div>
                <p class="eyebrow">Deutschland</p>
                <h3 id="diabetes-chart-title">Diagnostizierter Diabetes bei Erwachsenen</h3>
              </div>
              <strong>+4,4<span>Prozentpunkte</span></strong>
            </div>
            <div class="guenter-story-chart__plot" role="img" aria-label="Anteil der Erwachsenen mit diagnostiziertem Diabetes: 5,8 Prozent im Jahr 2003 und 10,2 Prozent im Jahr 2022">
              <div class="guenter-story-chart__grid" aria-hidden="true"><span>10 %</span><span>5 %</span><span>0 %</span></div>
              <div class="guenter-story-chart__bars">
                <div><i style="--bar-height: 56.9%"><b>5,8 %</b></i><span>2003</span></div>
                <div><i style="--bar-height: 100%"><b>10,2 %</b></i><span>2022</span></div>
              </div>
            </div>
            <p class="guenter-story-source">Quelle: <a href="https://www.gbe.rki.de/DE/Themen/Gesundheitszustand/KoerperlicheErkrankungen/DiabetesMellitus/DiabetesPraevalenz18Plus/diabetesPraevalenz_node.html" target="_blank" rel="noopener noreferrer">Robert Koch-Institut, GEDA 2003–2022 <span aria-hidden="true">&nearr;</span></a></p>
          </article>

          <div class="guenter-story-research">
            <article>
              <span class="guenter-story-research__number">40<sup>%</sup></span>
              <h3>Diabetes und Niere hängen eng zusammen.</h3>
              <p>Nach Angaben der Deutschen Diabetes Gesellschaft entwickeln etwa 40 Prozent der Menschen mit Typ-2-Diabetes eine Nierenschädigung. Dauerhaft erhöhte Blutzuckerwerte können die kleinen Gefäße der Niere schädigen; Bluthochdruck verstärkt das Risiko zusätzlich.</p>
              <a href="https://www.ddg.info/die-ddg/arbeitsgemeinschaften/diabetes-niere" target="_blank" rel="noopener noreferrer">Quelle: DDG, Diabetes &amp; Niere <span aria-hidden="true">&nearr;</span></a>
            </article>
            <article>
              <span class="guenter-story-research__tag">Was Forschung zeigt</span>
              <h3>Remission ist möglich – aber nicht garantiert.</h3>
              <p>Die randomisierte DiRECT-Studie zeigte, dass eine intensive Gewichtsmanagement-Intervention bei einem Teil der Teilnehmenden eine Remission des Typ-2-Diabetes erreichen konnte. Fachleute sprechen von Remission, wenn der HbA1c mindestens drei Monate ohne blutzuckersenkende Medikamente unter 6,5 Prozent liegt. Kontrollen bleiben notwendig.</p>
              <div class="guenter-story-research__links">
                <a href="https://doi.org/10.1016/S2213-8587(23)00385-6" target="_blank" rel="noopener noreferrer">DiRECT, 5-Jahres-Daten <span aria-hidden="true">&nearr;</span></a>
                <a href="https://www.diabinfo.de/fachkreise/forschung/artikel/article/die-definition-von-remission-bei-diabetes-typ-2.html" target="_blank" rel="noopener noreferrer">Definition der Remission <span aria-hidden="true">&nearr;</span></a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--dark guenter-story-health" id="heute">
      <div class="section-shell section-shell--wide guenter-story-health__grid">
        <figure class="guenter-story-health__media" data-reveal>
          <img src="/assets/images/guenter-preis-portrait-2024.jpg" alt="Günter Preis in athletischer Form während einer Wettkampfvorbereitung"${imageLoadingAttributes()}>
        </figure>
        <div class="guenter-story-health__copy" data-reveal>
          <p class="eyebrow">Der größte Erfolg</p>
          <h2>Zwei Jahre Struktur.<br><span>Heute durchweg gute Werte.</span></h2>
          <p>Woche für Woche entstand aus vielen kleinen Entscheidungen ein neuer Alltag: mehr Ausdauer, weniger Kohlenhydrate, eine veränderte Ernährung und kontinuierliche Blutzuckermessungen. Nicht spektakulär – aber konsequent, kontrolliert und über zwei Jahre durchgezogen.</p>
          <p>Heute kommt Günter nach eigener Auskunft ohne blutzuckersenkende Medikamente aus. Seine aktuellen Kontrollen zeigen nach seinen Angaben einen Langzeitblutzucker und Nierenwerte im Referenzbereich eines gesunden Menschen; sein Diabetes-Arzt entließ ihn aus der laufenden Spezialbetreuung. Für Günter ist genau das der größte Titel dieser Geschichte.</p>
          <dl class="guenter-story-health__facts" aria-label="Günters heutiger Gesundheitsstand">
            <div><dt>0</dt><dd>blutzuckersenkende Medikamente</dd></div>
            <div><dt>HbA1c</dt><dd>im gesunden Referenzbereich</dd></div>
            <div><dt>Nierenwerte</dt><dd>im gesunden Referenzbereich</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section guenter-story-competition" id="buehne">
      <div class="section-shell section-shell--wide guenter-story-competition__grid">
        <div class="guenter-story-competition__copy" data-reveal>
          <p class="eyebrow">Die sportliche Zugabe</p>
          <h2>Als die Gesundheit stabil war, wurde auch die Bühne wieder zum Ziel.</h2>
          <p>Erst als das Fundament wieder trug, kehrte das alte Ziel zurück. Aus der gesundheitlichen Stabilisierung wurde erneut Wettkampfvorbereitung – nun auf einer völlig anderen Basis. Drei gemeinsame Saisons später wurde Günter Vizeweltmeister und gewann mehrfach Bronze bei Deutschen Meisterschaften. Mit 63 Jahren.</p>
          <div class="guenter-story-medals" aria-label="Wettkampferfolge von Günter Preis">
            <div><strong>Vize</strong><span>Weltmeister</span></div>
            <div><strong>Mehrfach</strong><span>Bronze bei Deutschen Meisterschaften</span></div>
            <div><strong>3</strong><span>gemeinsame Saisons</span></div>
          </div>
          <blockquote>Die Medaillen machen diese Geschichte sichtbar. Ihr eigentlicher Wert liegt darin, dass Günter sich heute stärker und gesünder fühlt als vor einigen Jahren.</blockquote>
        </div>
        <figure class="guenter-story-competition__media" data-reveal>
          <img src="/assets/images/guenter-preis-stage-2026.jpg" alt="Günter Preis in Wettkampfform auf der Bühne der NABBA European Championship"${imageLoadingAttributes()}>
          <figcaption>Günter Preis auf der internationalen Wettkampfbühne.</figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--muted guenter-story-gallery-section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Der Weg dazwischen",
          title: "Fortschritt entsteht nicht am Wettkampftag.",
          text:
            "Die Bühne zeigt das Ergebnis. Entscheidend waren die vielen kontrollierten Wochen aus Training, Ernährung, Ausdauer und konsequenter Rückmeldung."
        })}
        <div class="guenter-story-gallery">
          <figure data-reveal>
            <img src="/assets/images/guenter-preis-training-front.jpg" alt="Günter Preis während eines Formchecks im Fitnessstudio von vorn"${imageLoadingAttributes()}>
            <figcaption>Formcheck im Training</figcaption>
          </figure>
          <figure data-reveal>
            <img src="/assets/images/guenter-preis-training-side.jpg" alt="Günter Preis während eines seitlichen Formchecks im Fitnessstudio"${imageLoadingAttributes()}>
            <figcaption>Konsequenz zwischen den Wettkämpfen</figcaption>
          </figure>
          <figure data-reveal>
            <img src="/assets/images/guenter-preis-coach-stage.jpg" alt="Dominik Dörfl und Günter Preis nach einer erfolgreichen Meisterschaft"${imageLoadingAttributes()}>
            <figcaption>Drei Saisons als Team</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section guenter-story-note-section">
      <div class="section-shell">
        <aside class="guenter-story-note" data-reveal aria-labelledby="guenter-medical-note-title">
          <p class="eyebrow">Wichtige Einordnung</p>
          <h2 id="guenter-medical-note-title">Eine persönliche Erfolgsgeschichte – kein medizinisches Versprechen.</h2>
          <p>Diese Seite beschreibt Günters individuellen Verlauf. Sie ersetzt keine ärztliche Beratung und lässt sich nicht pauschal auf andere Menschen übertragen. Diagnostik sowie Änderungen verschriebener Medikamente gehören ausschließlich in die Hände der behandelnden Ärztinnen und Ärzte. Auch bei stabilen Werten bleiben regelmäßige medizinische Kontrollen wichtig.</p>
          <a href="https://www.diabinfo.de/leben/typ-2-diabetes/grundlagen/krankheitsbild-und-symptome.html" target="_blank" rel="noopener noreferrer">Fachinformationen zu Typ-2-Diabetes und Remission <span aria-hidden="true">&nearr;</span></a>
        </aside>
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Personal Training Nürnberg",
      title: "Dein Ziel beginnt mit einer ehrlichen Bestandsaufnahme.",
      text:
        "Gesundheitliche Voraussetzungen, Alltag, Training und Ziele müssen zusammen betrachtet werden. Genau dort beginnt die persönliche Zusammenarbeit bei Camp Dörfl.",
      primary: { label: "Beratung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Personal Training ansehen", href: "/personal-trainer-nürnberg/" }
    })}
  `;

  return layout({
    path: "/erfolge-im-team/guenter-preis/",
    title: "Günter Preis: Gesundheit & Wettkampferfolg mit 63 | Camp Dörfl",
    pageName: "Erfolgsgeschichte Günter Preis",
    description:
      "Die Erfolgsgeschichte von Günter Preis: gesundheitliche Stabilisierung bei Typ-2-Diabetes, drei gemeinsame Wettkampfsaisons und Vizeweltmeister mit 63 Jahren.",
    keywords: ["Günter Preis Bodybuilding", "Erfolgsgeschichte Personal Training", "Bodybuilding mit 63", "Camp Dörfl Erfolge"],
    bodyClass: "page-premium page-guenter-story",
    socialImage: "/assets/images/guenter-preis-coach-stage.jpg",
    socialImageAlt: "Dominik Dörfl gemeinsam mit Günter Preis und Wettkampfmedaille",
    extraStructuredData: [
      {
        "@type": "Article",
        "@id": `${site.url}/erfolge-im-team/guenter-preis/#article`,
        headline: "Günter Preis: Gesundheit zuerst, dann die Bühne",
        description:
          "Günters persönliche Entwicklung vom gesundheitlichen Neustart bis zu internationalen Bodybuilding-Erfolgen mit 63 Jahren.",
        image: [absoluteUrl("/assets/images/guenter-preis-coach-stage.jpg")],
        datePublished: "2026-08-04",
        dateModified: "2026-08-04",
        author: { "@id": `${site.url}/#person` },
        publisher: { "@id": `${site.url}/#organization` },
        mainEntityOfPage: { "@id": `${site.url}/erfolge-im-team/guenter-preis/#webpage` }
      }
    ],
    content
  });
}

function teamSuccessPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--photo ff-hero--team">
      <img class="ff-hero__img" src="/assets/images/team-success-hero.jpg" srcset="/assets/images/team-success-hero-960.jpg 960w, /assets/images/team-success-hero.jpg 1920w" sizes="100vw" alt="Dominik Dörfl als erfolgreicher Bodybuilding-Athlet bei einem Outdoor-Shooting"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <div class="premium-badge">
            <span>ECHTE PRAXIS</span>
            <small>Erfahrung aus Sport, Coaching und Unternehmertum.</small>
          </div>
          <p class="ff-hero__eyebrow" data-reveal>Erfolge im Team</p>
          <h1 class="ff-hero__title" data-reveal>Erfolge.<br>Mit Struktur.<br><span>Im Team.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Camp Dörfl bringt Leistungssport, Coaching-Praxis, Community und Alltagstauglichkeit zusammen. Genau daraus entstehen Ergebnisse, die man sehen und fühlen kann.
          </p>
          <p class="ff-hero__support" data-reveal>
            Von Top-Athleten bis zu ambitionierten Menschen mit Verantwortung: Die gemeinsame Klammer ist ein System, das Fortschritt sauber führt.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("erfolge-im-team")}"><span>Zusammenarbeit anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/personal-trainer-nürnberg/"><span>Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Erfolge bei Camp Dörfl">
            <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
            <div><dt>Profi</dt><dd>Athletik & Bühne</dd></div>
            <div><dt>System</dt><dd>App bis Alltag</dd></div>
          </dl>
        </div>
        <div class="ff-hero__showcase ff-hero__showcase--photo" data-reveal>
          <figure class="ff-hero__photo-card">
            <img src="/assets/images/team-success-hero-960.jpg" alt="Dominik Dörfl in Wettkampfform bei einem Bodybuilding-Shooting"${imageLoadingAttributes()}>
          </figure>
          <article class="ff-hero__aside">
            <span class="card-tag">Im Team sichtbar</span>
            <h2>Erfolge auf mehreren Ebenen.</h2>
            <ul class="premium-checklist">
              <li>Top-Athleten und internationale Platzierungen</li>
              <li>Meistertitel und Profi-Niveau</li>
              <li>Coaching mit Alltagstauglichkeit</li>
              <li>App, Community und Umsetzung</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    ${guenterStoryPreview("team")}

    ${coachSuccessOverview()}

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Transformationen im Camp",
          title: "Entwicklung, die man nicht erklären muss.",
          text:
            "Diese Vorher-Nachher-Beispiele zeigen, was möglich wird, wenn ein ehrlicher Startpunkt auf klare Führung, Struktur und konsequente Umsetzung trifft."
        })}
        ${transformationGrid(campTransformationCards)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Was die Erfolge trägt",
          title: "Leistung entsteht dort, wo Struktur verlässlich wird.",
          text:
            "Ergebnisse im Team entstehen nicht aus Zufall, sondern aus einer Verbindung aus Klarheit, Verantwortung und konsequenter Führung."
        })}
        ${featureGrid(teamSuccessCards)}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Proof",
          title: "Erfahrung, die sichtbar geworden ist.",
          text:
            "Titel, Ausdauerleistungen, Coaching-Praxis und unternehmerische Perspektive bilden das Fundament hinter Camp Dörfl."
        })}
        ${proofMosaic(landingProofCards)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell editorial-stage editorial-stage--reverse">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Gemeinsame Klammer",
            title: "Was Ergebnisse im Team immer wieder möglich macht.",
            text:
              "Ob Athlet, Unternehmer oder ambitionierter Wiedereinsteiger: Fortschritt wird dann stabil, wenn er ehrlich gemessen, klar geführt und alltagstauglich umgesetzt wird."
          })}
          ${summaryRows(teamSuccessRows)}
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-coaching-bikeerg.webp" alt="Dominik Dörfl bei der Arbeit mit einem Klienten"${imageLoadingAttributes()}>
        </div>
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Camp Dörfl",
      title: "Wenn du Teil dieses Systems werden willst, melde dich.",
      text:
        "Ob App, Premium Personal Training oder der direkte Austausch: der sinnvollste Start ist eine klare Anfrage.",
      primary: { label: "Beratung anfragen", href: contactHref("erfolge-im-team") },
      secondary: { label: "Camp Dörfl App ansehen", href: "/app/" }
    })}
  `;

  return layout({
    path: "/erfolge-im-team/",
    title: "Erfolge im Team | Camp Dörfl Nürnberg",
    description:
      "Erfolge im Team bei Camp Dörfl Nürnberg: Erfahrung aus Leistungssport, Coaching, Community, Bühne und Unternehmertum für sichtbare Entwicklung.",
    keywords: ["Erfolge im Team", "Camp Dörfl Ergebnisse", "Transformation Coaching", "Dominik Dörfl"],
    bodyClass: "page-premium page-team",
    socialImage: "/assets/images/team-success-hero-social.jpg",
    socialImageAlt: "Dominik Dörfl mit Mikrofon und Team-Erfolgen im Hintergrund",
    content
  });
}

// Eigenständige Seite (früher Alias auf personalCoachingPage – wegen Duplicate-Content/SEO entkoppelt).
function executivePerformancePage() {
  const audienceCards = [
    {
      title: "Verantwortung statt Freizeit",
      text:
        "Geschäftsführer, Selbstständige und Führungskräfte mit vollem Kalender, die nicht mehr Zeit, sondern ein klares System brauchen.",
      detail: "Für volle Kalender"
    },
    {
      title: "Leistung im Alltag",
      text:
        "Menschen, die beruflich konstant performen müssen und körperlich wieder klarer, fitter und belastbarer werden wollen.",
      detail: "Für echte Belastung"
    },
    {
      title: "Anspruch statt Standard",
      text:
        "Wer keine Massenlösung will, sondern persönliche Führung, messbare Werte und einen Plan, der sich an reale Prioritäten anpasst.",
      detail: "Für Premium-Anspruch"
    }
  ];

  const outcomeRows = [
    {
      title: "Mehr Energie über den ganzen Tag",
      text:
        "Training, Ernährung und Routinen werden so gesteuert, dass Leistungsfähigkeit im Beruf und im Privaten spürbar steigt."
    },
    {
      title: "Sichtbare, messbare Entwicklung",
      text:
        "InBody und 2D-Analyse machen Fortschritt in Zahlen sichtbar, statt ihn dem Gefühl oder dem Zufall zu überlassen."
    },
    {
      title: "Ein System, das im Alltag hält",
      text:
        "Die Camp Dörfl App, wöchentliche Anpassungen und klare Führung sorgen dafür, dass der Plan auch in stressigen Wochen trägt."
    }
  ];

  const executiveFaq = [
    {
      question: "Wie viel Zeit kostet mich das Programm pro Woche?",
      answer:
        "Das Programm ist für volle Kalender gebaut. Training, Ernährung und Check-ins werden so geplant, dass sie sich in deinen Alltag einfügen, statt ihn zu sprengen."
    },
    {
      question: "Brauche ich Vorerfahrung im Training?",
      answer:
        "Nein. Wir starten mit einer ehrlichen Analyse deines Status und bauen den Plan exakt auf deine Ausgangslage, deine Ziele und deinen Beruf auf."
    },
    {
      question: "Warum nur wenige Plätze?",
      answer:
        "Executive Performance ist persönlich geführt. Damit Qualität, Erreichbarkeit und Anpassung hoch bleiben, gibt es bewusst nur eine begrenzte Zahl an Plätzen."
    }
  ];

  const content = `
    <section class="ff-hero ff-hero--coaching ff-hero--coaching-photo ff-hero--executive">
      <img class="ff-hero__img" src="/assets/images/dominik-gym-grey.webp" alt="Dominik Dörfl beim Krafttraining im Studio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <div class="premium-badge">
          <span>12 WOCHEN</span>
          <small>Premium-Coaching für Leistungsträger – nur wenige Plätze.</small>
        </div>
        <p class="ff-hero__eyebrow" data-reveal>Executive Performance</p>
        <h1 class="ff-hero__title" data-reveal>Executive.<br>Performance.<br><span>In 12 Wochen.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Das 12-Wochen-Premium-Programm für Führungskräfte, Unternehmer und Leistungsträger, die körperlich wieder klarer, fitter und belastbarer werden wollen.
        </p>
        <p class="ff-hero__support" data-reveal>
          Analyse, Ernährungsführung, Training und App-Steuerung - abgestimmt auf einen vollen Kalender, hohe Verantwortung und einen echten Premium-Anspruch.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("executive-performance")}"><span>Platz anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/personal-trainer-nürnberg/"><span>Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Eckdaten Executive Performance">
          <div><dt>12</dt><dd>Wochen Programm</dd></div>
          <div><dt>1:1</dt><dd>Persönliche Führung</dd></div>
          <div><dt>App</dt><dd>Steuerung & Check-ins</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Für wen",
          title: "Gebaut für Menschen mit echter Verantwortung.",
          text:
            "Executive Performance ist kein weiteres Fitnessangebot, sondern ein geführtes System für Leistungsträger, die ihren Körper wieder zu einem Vorteil machen wollen.",
          align: "center"
        })}
        ${featureGrid(audienceCards, "feature-grid--coaching-flow")}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Ablauf",
            title: "So läuft dein 12-Wochen-Programm."
          })}
          ${processList(executiveSteps)}
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-athlete-nutrition.webp" alt="Dominik Dörfl bei der Ernährungs- und Leistungsplanung"${imageLoadingAttributes()}>
        </div>
      </div>
    </section>

    <section class="section section--coaching-outcome">
      <div class="section-shell section-shell--wide">
        <div class="coaching-outcome-stage">
          ${sectionHeader({
            eyebrow: "Ergebnis",
            title: "Was nach 12 Wochen spürbar anders ist.",
            text:
              "Ziel ist nicht ein kurzes Strohfeuer, sondern ein Zustand, den du in deinem Alltag und in deiner Leistungsfähigkeit wirklich merkst.",
            align: "center"
          })}
          ${summaryRows(outcomeRows)}
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Warum Camp Dörfl",
          title: "Geführt von echter Leistungserfahrung.",
          text:
            "Hinter dem Programm steht keine Theorie, sondern gelebte Praxis aus Leistungssport, Coaching und Unternehmertum – als Ex-Profi-Athlet, zweifacher Deutscher Meister und Coach von Top-Athleten."
        })}
        <div class="inline-actions" data-reveal>
          <a class="button button--secondary-light" href="/ueber-dominik/"><span>Mehr über Dominik Dörfl</span><span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Was Führungskräfte vor dem Start wissen wollen."
        })}
        ${faq(executiveFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Executive Performance",
      title: "Sichere dir einen der wenigen Plätze.",
      text:
        "Wenn du beruflich viel leistest und körperlich wieder an deine echte Leistungsfähigkeit willst, ist eine kurze, ehrliche Anfrage der richtige Start.",
      primary: { label: "Platz anfragen", href: contactHref("executive-performance") },
      secondary: { label: "Camp Dörfl App ansehen", href: "/app/" }
    })}
  `;

  return layout({
    path: "/executive-performance/",
    title: "Executive Performance Coaching Nürnberg | Camp Dörfl",
    description:
      "Executive Performance von Camp Dörfl: 12-Wochen-Premium-Coaching in Nürnberg für Führungskräfte und Leistungsträger mit vollem Kalender – Analyse, Plan und App.",
    keywords: ["Executive Performance", "Performance Coaching Nürnberg", "Coaching für Führungskräfte", "Premium Coaching Nürnberg"],
    bodyClass: "page-premium page-executive",
    socialImage: "/assets/images/dominik-gym-grey-social.jpg",
    socialImageAlt: "Dominik Dörfl beim Krafttraining für Executive Performance Coaching",
    extraStructuredData: [
      serviceSchema({
        path: "/executive-performance/",
        name: "Executive Performance Coaching Nürnberg",
        serviceType: "Performance Coaching für Führungskräfte",
        description:
          "12-Wochen-Premium-Coaching für Führungskräfte und Leistungsträger mit Analyse, Plan und App."
      }),
      faqSchema("/executive-performance/", executiveFaq)
    ],
    content
  });
}

function expertAuthorBlock({ reviewed = "11. August 2026" } = {}) {
  return `
    <aside class="expert-author" data-reveal aria-label="Autor und redaktionelle Verantwortung">
      <img src="/assets/images/dominik-about-gym-portrait.jpg" alt="Dominik Dörfl, Personal Trainer und Performance Coach in Nürnberg"${imageLoadingAttributes()}>
      <div>
        <p class="eyebrow">Autor &amp; Praxisexperte</p>
        <h2>Dominik Dörfl</h2>
        <p>Personal Trainer, Bodybuilding- und Performance-Coach in Nürnberg. Deutscher Meister im Bodybuilding und Powerlifting, IFBB Pro und Coach von Athletinnen und Athleten mit nationalen und internationalen Platzierungen.</p>
        <p class="expert-author__meta">Fachlich geprüft und zuletzt aktualisiert: ${reviewed}</p>
        <div class="expert-author__links"><a href="/ueber-dominik/">Vollständiges Expertenprofil →</a><a href="/redaktionelle-richtlinien/">Quellen- und Redaktionsstandard →</a></div>
      </div>
    </aside>`;
}

function expertArticleSchema({ path, headline, description, image, datePublished = "2026-08-11", dateModified = "2026-08-11" }) {
  return {
    "@type": "Article",
    "@id": `${site.url}${path}#article`,
    headline,
    description,
    image: [absoluteUrl(image)],
    datePublished,
    dateModified,
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@id": `${site.url}${path}#webpage` }
  };
}

function expertKnowledgePage() {
  const content = `
    <section class="expert-hero expert-hero--hub" data-color-scheme="dark">
      <div class="section-shell section-shell--wide expert-hero__grid">
        <div data-reveal>
          <p class="eyebrow">Expertenwissen von Dominik Dörfl</p>
          <h1>Klare Antworten.<br><span>Aus Praxis und Quellen.</span></h1>
          <p class="expert-hero__lead">Fachwissen zu Personal Training, Bodybuilding, Körperanalyse und Performance – mit direkter Antwort, nachvollziehbarer Einordnung und belastbaren Originalquellen.</p>
        </div>
        <aside class="expert-hero__proof" data-reveal><strong>25+ Jahre</strong><span>Leistungssport-Erfahrung laut persönlichem Werdegang</span><strong>2× Deutscher Meister</strong><span>Bodybuilding und Powerlifting</span><strong>Nürnberg</strong><span>Persönliches Coaching vor Ort</span></aside>
      </div>
    </section>
    <section class="section"><div class="section-shell section-shell--wide">
      ${sectionHeader({ eyebrow: "Neu & grundlegend", title: "Drei Fragen, die vor einer Entscheidung wirklich zählen.", text: "Jeder Leitfaden trennt Messbares, praktische Erfahrung und individuelle Entscheidung sauber voneinander." })}
      <div class="expert-card-grid">
        <a class="expert-card" href="/personal-trainer-auswaehlen-nuernberg/" data-reveal><span>Personal Training</span><h2>Wie erkennt man einen guten Personal Trainer?</h2><p>Qualifikation, Diagnostik, Betreuung und transparente Erwartungen richtig prüfen.</p><b>Leitfaden lesen →</b></a>
        <a class="expert-card" href="/bodybuilding-wettkampfvorbereitung-dauer/" data-reveal><span>Contest Prep</span><h2>Wie lange dauert eine Wettkampfvorbereitung?</h2><p>Warum Ausgangslage und nachhaltige Abnahmerate wichtiger sind als ein fixes Datum.</p><b>Leitfaden lesen →</b></a>
        <a class="expert-card" href="/bia-inbody-koerperanalyse-vergleich/" data-reveal><span>Körperanalyse</span><h2>BIA, InBody oder 2D-Analyse?</h2><p>Was die Verfahren zeigen, wo ihre Grenzen liegen und wie Verlaufsdaten sinnvoll werden.</p><b>Leitfaden lesen →</b></a>
      </div>
    </div></section>
    <section class="section section--muted"><div class="section-shell section-shell--wide">
      ${sectionHeader({ eyebrow: "Transparenz", title: "So entstehen die Inhalte.", text: "Eigene Coaching-Erfahrung wird als Erfahrung gekennzeichnet. Wissenschaftliche Aussagen verlinken auf Primärliteratur, Fachgesellschaften oder offizielle Ergebnisquellen." })}
      <div class="expert-principles"><article><b>01</b><h3>Direkte Antwort zuerst</h3><p>Die Kernaussage steht am Anfang und bleibt auch ohne Fachsprache verständlich.</p></article><article><b>02</b><h3>Belege am Anspruch</h3><p>Je größer oder sensibler eine Aussage, desto stärker muss ihre Quelle sein.</p></article><article><b>03</b><h3>Aktualisierung sichtbar</h3><p>Veröffentlichungs- und Prüfdatum werden auf jeder Fachseite genannt.</p></article></div>
      <p class="expert-policy-link"><a href="/redaktionelle-richtlinien/">Vollständige redaktionelle Richtlinien ansehen →</a></p>
    </div></section>
    ${ctaSection({ eyebrow: "Persönliche Einordnung", title: "Du brauchst keine allgemeine Antwort, sondern eine für deinen Ausgangspunkt?", text: "Dann klären wir Ziel, Alltag und sinnvolle nächsten Schritte persönlich.", primary: { label: "Beratung anfragen", href: contactHref("premium-training") }, secondary: { label: "Über Dominik", href: "/ueber-dominik/" } })}`;

  return layout({ path: "/expertenwissen/", title: "Expertenwissen: Training, Bodybuilding & Analyse | Dominik Dörfl", description: "Fundierte Leitfäden von Dominik Dörfl zu Personal Training, Bodybuilding-Wettkampfvorbereitung, BIA, InBody und Körperanalyse.", keywords: ["Fitness Expertenwissen", "Personal Training Ratgeber", "Bodybuilding Coach Wissen", "Körperanalyse Ratgeber"], bodyClass: "page-premium page-expert-hub", pageType: "CollectionPage", pageName: "Expertenwissen", dateModified: "2026-08-11", socialImage: "/assets/images/dominik-about-gym-portrait.jpg", socialImageAlt: "Dominik Dörfl – Expertenwissen zu Training und Performance", content });
}

function choosePersonalTrainerGuidePage() {
  const path = "/personal-trainer-auswaehlen-nuernberg/";
  const guideFaq = [
    { question: "Woran erkennt man einen guten Personal Trainer?", answer: "An nachvollziehbarer Qualifikation, einer strukturierten Bestandsaufnahme, realistischen Zielen, verständlicher Planung, sauberer Kommunikation und daran, dass Grenzen erkannt und bei medizinischen Fragen an passende Fachpersonen verwiesen wird." },
    { question: "Sollte ein Personal Trainer Probetraining anbieten?", answer: "Ein Kennenlern- oder Starttermin ist sinnvoll, damit Ziel, Arbeitsweise, Kommunikation und organisatorischer Rahmen vor einer längerfristigen Zusammenarbeit geprüft werden können." },
    { question: "Ist der günstigste Personal Trainer die beste Wahl?", answer: "Der Stundenpreis allein sagt wenig aus. Entscheidend sind Betreuungsumfang, Vorbereitung, Analyse, Nachbereitung, Erreichbarkeit und die Qualität der laufenden Anpassung." }
  ];
  const description = "Sieben überprüfbare Kriterien, mit denen du einen qualifizierten Personal Trainer in Nürnberg auswählen und Angebote fair vergleichen kannst.";
  const content = `
    <article class="expert-article" data-color-scheme="light">
      <header class="expert-article__header" data-color-scheme="dark"><div class="section-shell section-shell--wide expert-article__hero-grid"><div><p class="eyebrow">Personal Trainer auswählen · Nürnberg</p><h1>Woran erkennt man einen guten Personal Trainer?</h1><p class="expert-article__dek">Sieben überprüfbare Kriterien für eine Entscheidung, bei der nicht nur Sympathie und Marketing zählen.</p><div class="expert-article__meta"><span>Von Dominik Dörfl</span><span>Veröffentlicht und geprüft am 11. August 2026</span><span>7 Min. Lesezeit</span></div></div><figure class="expert-article__hero-media"><img src="/assets/images/dominik-personal-coaching-client.webp" alt="Dominik Dörfl begleitet einen Kunden beim Personal Training"${imageLoadingAttributes({ eager: true })}></figure></div></header>
      <div class="section-shell section-shell--wide expert-article__layout" data-color-scheme="light"><div class="expert-article__body">
        <section class="answer-box" aria-labelledby="pt-direct-answer"><p class="eyebrow">Kurzantwort</p><h2 id="pt-direct-answer">Ein guter Personal Trainer verbindet Qualifikation mit einem nachvollziehbaren Prozess.</h2><p>Er fragt vor dem Training nach Ziel, Erfahrung, Beschwerden und Alltag, erklärt seinen Plan verständlich, dokumentiert Fortschritt und passt die Belastung laufend an. Referenzen müssen zur gewünschten Aufgabe passen. Bei gesundheitlichen Fragen erkennt er die Grenze seines Tätigkeitsfeldes und arbeitet gegebenenfalls mit ärztlichen oder therapeutischen Fachpersonen zusammen.</p></section>
        <h2>Die sieben Kriterien im Vergleich</h2>
        <ol class="expert-checklist"><li><h3>1. Qualifikation ist konkret benannt</h3><p>Frage nach Ausbildung, Zertifizierung, Fortbildung und praktischer Erfahrung. Ein Logo oder der Begriff „Coach“ allein belegt keine fachliche Tiefe. Die ACSM empfiehlt ausdrücklich, Qualifikation und Zertifizierung eines Trainers zu prüfen.</p></li><li><h3>2. Der Start beginnt mit Fragen, nicht mit Übungen</h3><p>Ziele, Trainingshistorie, verfügbare Zeit, Beschwerden und relevante Risiken gehören vor die erste intensive Einheit.</p></li><li><h3>3. Der Plan passt zu deinem Alltag</h3><p>Ein guter Plan berücksichtigt Arbeitszeiten, Reisen, Schlaf, verfügbare Geräte und realistische Trainingshäufigkeit.</p></li><li><h3>4. Fortschritt wird nachvollziehbar</h3><p>Je nach Ziel können Leistungswerte, Trainingsqualität, Umfänge, Gewicht oder standardisierte Körperanalysen sinnvoll sein. Nicht jede Kennzahl passt zu jedem Ziel.</p></li><li><h3>5. Kommunikation ist klar</h3><p>Du solltest verstehen, warum etwas trainiert oder verändert wird. Druck, Heilsversprechen und garantierte Ergebnisse sind Warnsignale.</p></li><li><h3>6. Referenzen passen zur Aufgabe</h3><p>Wettkampferfahrung kann für Contest Prep relevant sein; für Training bei Erkrankungen sind andere Kompetenzen und interdisziplinäre Zusammenarbeit entscheidend.</p></li><li><h3>7. Umfang und Preis sind transparent</h3><p>Vergleiche nicht nur die Präsenzstunde, sondern auch Planung, Check-ins, Analysen, Erreichbarkeit und Nachbereitung.</p></li></ol>
        <h2>So läuft die Auswahl in 20 Minuten</h2><div class="expert-table-wrap"><table class="expert-table"><thead><tr><th>Frage</th><th>Gutes Signal</th><th>Warnsignal</th></tr></thead><tbody><tr><td>Wie beginnt die Zusammenarbeit?</td><td>Anamnese, Zielklärung, Ausgangswerte</td><td>Sofortiger Standardplan</td></tr><tr><td>Wie wird angepasst?</td><td>Feste Check-ins und Kriterien</td><td>Nur nach Bauchgefühl</td></tr><tr><td>Was ist im Preis enthalten?</td><td>Konkreter Leistungsumfang</td><td>Unklare Zusatzkosten</td></tr><tr><td>Was passiert bei Beschwerden?</td><td>Abklärung und passende Weiterleitung</td><td>Diagnosen oder Heilversprechen</td></tr></tbody></table></div>
        <h2>Einordnung von Dominik Dörfl</h2><blockquote class="expert-quote">„Die wichtigste Trainerfrage lautet nicht: Wie hart kann ich dich trainieren? Sondern: Welche Struktur kannst du über Monate zuverlässig umsetzen und wie erkennen wir früh, dass sie angepasst werden muss?“</blockquote>
        <section class="source-panel"><h2>Quellen und weiterführende Originalseiten</h2><ol><li><a href="https://www.acsm.org/wp-content/uploads/2025/02/Investing-in-a-personal-trainer-handout.pdf" target="_blank" rel="noopener noreferrer">American College of Sports Medicine: Investing in a Personal Trainer</a></li><li><a href="/personal-training-kosten-nuernberg/">Camp Dörfl: Personal-Training-Preise und Leistungsumfang</a></li><li><a href="/erfolge-im-team/">Camp Dörfl: dokumentierte Erfolge im Team</a></li></ol></section>
        ${expertAuthorBlock()}
        <section><h2>Häufige Fragen</h2>${faq(guideFaq)}</section>
      </div><aside class="expert-article__rail"><span>Passender nächster Schritt</span><h2>Personal Training in Nürnberg</h2><p>Leistungsumfang, Vorgehen und persönliche Betreuung mit Dominik kennenlernen.</p><a class="button button--primary" href="/personal-trainer-nürnberg/"><span>Angebot ansehen</span><span aria-hidden="true">→</span></a></aside></div>
    </article>`;
  return layout({ path, title: "Guten Personal Trainer in Nürnberg finden: 7 Kriterien", description, keywords: ["guter Personal Trainer Nürnberg", "Personal Trainer auswählen", "Personal Trainer Qualifikation", "Personal Training Vergleich"], bodyClass: "page-premium page-expert-article", pageType: "Article", pageName: "Guten Personal Trainer auswählen", dateModified: "2026-08-11", socialImage: "/assets/images/dominik-personal-coaching-client.webp", socialImageAlt: "Dominik Dörfl begleitet einen Kunden beim Personal Training", extraStructuredData: [expertArticleSchema({ path, headline: "Woran erkennt man einen guten Personal Trainer?", description, image: "/assets/images/dominik-personal-coaching-client.webp" }), faqSchema(path, guideFaq)], content });
}

function contestPrepDurationGuidePage() {
  const path = "/bodybuilding-wettkampfvorbereitung-dauer/";
  const guideFaq = [
    { question: "Wie viele Wochen dauert eine Bodybuilding-Wettkampfvorbereitung?", answer: "Häufig werden 16 bis 24 Wochen geplant. Der sinnvolle Zeitraum hängt jedoch von Körperfett, Muskelmasse, Wettkampfklasse, Diäterfahrung, Gesundheit und einer realistischen wöchentlichen Abnahmerate ab." },
    { question: "Kann eine Contest Prep in zwölf Wochen funktionieren?", answer: "Bei bereits sehr guter Ausgangsform kann das möglich sein. Je weiter die Ausgangsform von der Bühnenform entfernt ist, desto höher wird bei einem kurzen Zeitfenster das Risiko unnötig aggressiver Maßnahmen." },
    { question: "Wann sollte der Wettkampf ausgewählt werden?", answer: "Erst wenn Ausgangslage, benötigte Gewichtsabnahme, Klasse und zeitlicher Puffer realistisch eingeordnet wurden. Der Kalender sollte zum Athleten passen, nicht umgekehrt." }
  ];
  const description = "Wie lange eine Bodybuilding-Wettkampfvorbereitung dauern sollte: Ausgangslage, Abnahmerate, Phasen und Entscheidungskriterien aus Coaching-Praxis und Forschung.";
  const content = `
    <article class="expert-article" data-color-scheme="light"><header class="expert-article__header" data-color-scheme="dark"><div class="section-shell section-shell--wide expert-article__hero-grid"><div><p class="eyebrow">Bodybuilding · Wettkampfvorbereitung</p><h1>Wie lange dauert eine gute Contest Prep?</h1><p class="expert-article__dek">Nicht der Kalender bestimmt die Vorbereitung, sondern der Abstand zwischen Ausgangslage und realistischer Bühnenform.</p><div class="expert-article__meta"><span>Von Dominik Dörfl</span><span>Veröffentlicht und geprüft am 11. August 2026</span><span>8 Min. Lesezeit</span></div></div><figure class="expert-article__hero-media"><img src="/assets/images/team-success-hero.jpg" alt="Dominik Dörfl in Bodybuilding-Wettkampfform"${imageLoadingAttributes({ eager: true })}></figure></div></header>
      <div class="section-shell section-shell--wide expert-article__layout" data-color-scheme="light"><div class="expert-article__body">
        <section class="answer-box"><p class="eyebrow">Kurzantwort</p><h2>Für viele Athletinnen und Athleten sind 16 bis 24 Wochen ein sinnvoller Planungsrahmen.</h2><p>Die tatsächliche Dauer ergibt sich aus Ausgangsform, Wettkampfklasse, Diäterfahrung und notwendigem Gewichtsverlust. Forschung zur Natural-Bodybuilding-Vorbereitung nennt ungefähr 0,5 bis 1 Prozent Körpergewichtsverlust pro Woche als Orientierungsbereich, um Muskelmasse möglichst zu erhalten. Je näher die Bühnenform rückt, desto individueller muss gesteuert werden.</p></section>
        <h2>Die Dauer wird rückwärts gerechnet</h2><p>Eine seriöse Planung beginnt nicht mit „noch 16 Wochen“, sondern mit vier Fragen: Wie viel Gewicht muss voraussichtlich verloren werden? Welche Klasse ist vorgesehen? Wie hat der Körper auf frühere Diäten reagiert? Welcher Puffer wird für Plateaus, Reisen oder gesundheitliche Veränderungen benötigt?</p>
        <div class="expert-formula"><span>Planungslogik</span><strong>notwendiger Gewichtsverlust ÷ realistische Wochenrate + Sicherheitspuffer</strong><p>Das Ergebnis ist eine erste Arbeitshypothese – keine Garantie für eine bestimmte Bühnenform.</p></div>
        <h2>Vier Phasen einer kontrollierten Vorbereitung</h2><div class="expert-principles"><article><b>01</b><h3>Ausgangslage</h3><p>Gesundheit, Training, Körperdaten, Klasse und Alltag einordnen.</p></article><article><b>02</b><h3>Hauptphase</h3><p>Moderates Defizit, Leistung erhalten, Entwicklung regelmäßig prüfen.</p></article><article><b>03</b><h3>Feinsteuerung</h3><p>Tempo und Belastung auf tatsächliche Form statt Wunschdatum abstimmen.</p></article><article><b>04</b><h3>Wettkampfwoche</h3><p>Keine ungetesteten Extreme. Präsentation und bekannte Routinen priorisieren.</p></article></div>
        <h2>Warum schneller nicht automatisch besser ist</h2><p>Aggressive Defizite können Trainingsleistung, Regeneration und den Erhalt fettfreier Masse erschweren. Die Übersichtsarbeit von Helms, Aragon und Fitschen empfiehlt, die Abnahmerate individuell zu kontrollieren. Dehydrierung und riskante Elektrolytmanipulationen werden ausdrücklich kritisch eingeordnet.</p>
        <blockquote class="expert-quote">„Eine gute Vorbereitung beginnt früh genug, damit wir nicht jede Abweichung mit mehr Hunger und mehr Cardio beantworten müssen. Zeit ist kein Luxus, sondern ein Steuerungsinstrument.“</blockquote>
        <h2>Praktische Entscheidungsmatrix</h2><div class="expert-table-wrap"><table class="expert-table"><thead><tr><th>Ausgangslage</th><th>Planungstendenz</th><th>Priorität</th></tr></thead><tbody><tr><td>Nahe an der Wettkampfform</td><td>Kürzer möglich</td><td>Form erhalten, Details steuern</td></tr><tr><td>Moderater Abstand</td><td>16–24 Wochen häufig sinnvoll</td><td>Leistung und Abnahmerate balancieren</td></tr><tr><td>Großer Abstand oder erste Prep</td><td>Mehr Zeit oder späterer Wettkampf</td><td>Gesundheit, Lernkurve und Puffer</td></tr></tbody></table></div>
        <section class="source-panel"><h2>Quellen</h2><ol><li><a href="https://pubmed.ncbi.nlm.nih.gov/24864135/" target="_blank" rel="noopener noreferrer">Helms, Aragon &amp; Fitschen: Evidence-based recommendations for natural bodybuilding contest preparation</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/25949233/" target="_blank" rel="noopener noreferrer">Robinson et al.: Nutrition and conditioning intervention – 14-week case study</a></li><li><a href="/bodybuilding-wettkaempfe-2026/">Aktueller Bodybuilding-Wettkampfkalender 2026</a></li></ol></section>
        ${expertAuthorBlock()}
        <section><h2>Häufige Fragen</h2>${faq(guideFaq)}</section>
      </div><aside class="expert-article__rail"><span>Contest Prep</span><h2>Individuelle Wettkampfvorbereitung</h2><p>Klasse, Ausgangsform und Zeitfenster persönlich einordnen.</p><a class="button button--primary" href="/bodybuilding-coaching-wettkampfvorbereitung/"><span>Coaching ansehen</span><span aria-hidden="true">→</span></a></aside></div></article>`;
  return layout({ path, title: "Contest Prep: Wie lange dauert eine Wettkampfvorbereitung?", description, keywords: ["Wettkampfvorbereitung Dauer", "Contest Prep Wochen", "Bodybuilding Wettkampfvorbereitung", "Bodybuilding Diät Dauer"], bodyClass: "page-premium page-expert-article", pageType: "Article", pageName: "Dauer einer Bodybuilding-Wettkampfvorbereitung", dateModified: "2026-08-11", socialImage: "/assets/images/team-success-hero.jpg", socialImageAlt: "Dominik Dörfl in Bodybuilding-Wettkampfform", extraStructuredData: [expertArticleSchema({ path, headline: "Wie lange dauert eine gute Bodybuilding-Wettkampfvorbereitung?", description, image: "/assets/images/team-success-hero.jpg" }), faqSchema(path, guideFaq)], content });
}

function biaComparisonGuidePage() {
  const path = "/bia-inbody-koerperanalyse-vergleich/";
  const guideFaq = [
    { question: "Ist InBody dasselbe wie BIA?", answer: "InBody ist eine Gerätemarke, die bioelektrische Impedanzanalyse verwendet. BIA bezeichnet das Messprinzip, nicht ein einzelnes Gerät." },
    { question: "Wie genau ist eine BIA-Messung?", answer: "BIA schätzt Körperzusammensetzung über elektrische Messwerte und mathematische Modelle. Einzelwerte sind von Gerät, Modell und Messbedingungen abhängig; standardisierte Verlaufsmessungen sind häufig aussagekräftiger als ein isolierter Messwert." },
    { question: "Was sollte vor einer InBody-Messung beachtet werden?", answer: "Messungen sollten möglichst unter vergleichbaren Bedingungen stattfinden, insbesondere bei Tageszeit, Flüssigkeitsstatus, Nahrungsaufnahme und vorheriger Belastung." }
  ];
  const description = "BIA, InBody und 2D-Körperanalyse verständlich verglichen: Messprinzip, Nutzen, Grenzen und Standardisierung für aussagekräftige Verlaufsdaten.";
  const content = `
    <article class="expert-article" data-color-scheme="light"><header class="expert-article__header" data-color-scheme="dark"><div class="section-shell section-shell--wide expert-article__hero-grid"><div><p class="eyebrow">Körperanalyse · BIA · InBody</p><h1>Was misst welches Verfahren – und was nicht?</h1><p class="expert-article__dek">Ein fairer Vergleich von bioelektrischer Impedanz, InBody-Systemen und optischer 2D-Körperanalyse.</p><div class="expert-article__meta"><span>Von Dominik Dörfl</span><span>Veröffentlicht und geprüft am 11. August 2026</span><span>7 Min. Lesezeit</span></div></div><figure class="expert-article__hero-media"><img src="/assets/images/dominik-coaching-bikeerg.webp" alt="Dominik Dörfl erklärt Ergebnisse einer Körperanalyse"${imageLoadingAttributes({ eager: true })}></figure></div></header>
      <div class="section-shell section-shell--wide expert-article__layout" data-color-scheme="light"><div class="expert-article__body">
        <section class="answer-box"><p class="eyebrow">Kurzantwort</p><h2>BIA und 2D-Analyse beantworten unterschiedliche Fragen.</h2><p>Eine BIA – etwa mit einem InBody-System – misst elektrische Impedanz und schätzt daraus Körperwasser, fettfreie Masse und Fettmasse. Eine 2D-Körperanalyse erfasst äußere Form, Umfänge und Haltung über standardisierte Aufnahmen. Beide Verfahren sind indirekt. Besonders wertvoll werden sie als Verlauf, wenn Gerät, Zeitpunkt und Vorbereitung vergleichbar bleiben.</p></section>
        <h2>Der direkte Vergleich</h2><div class="expert-table-wrap"><table class="expert-table"><thead><tr><th>Verfahren</th><th>Stärke</th><th>Wichtige Grenze</th></tr></thead><tbody><tr><td>BIA / InBody</td><td>Schnelle Schätzung von Körperwasser und Körperzusammensetzung</td><td>Hydration, Messprotokoll und Gerätemodell beeinflussen Ergebnisse</td></tr><tr><td>2D-Körperanalyse</td><td>Sichtbare Veränderungen, Umfänge und Proportionen dokumentieren</td><td>Keine direkte Messung von Fett- oder Muskelgewebe</td></tr><tr><td>Waage</td><td>Einfacher Gewichtsverlauf</td><td>Keine Aussage darüber, wodurch sich Gewicht verändert</td></tr><tr><td>DXA</td><td>Detailliertes klinisches Referenzverfahren</td><td>Aufwendiger, nicht für jedes regelmäßige Coaching-Check-in nötig</td></tr></tbody></table></div>
        <h2>Warum ein Einzelwert keine Diagnose ist</h2><p>BIA misst nicht direkt Fett oder Muskelmasse. Das Gerät erfasst elektrische Eigenschaften des Körpers und überführt diese mithilfe von Modellen in Schätzwerte. Forschung beschreibt relevante Unterschiede zwischen Geräten sowie Einflüsse durch Flüssigkeitsverteilung und Messbedingungen. Deshalb sollte ein Wert nie losgelöst von Verlauf, Training und Kontext interpretiert werden.</p>
        <h2>So wird ein Verlauf vergleichbarer</h2><ul class="expert-bullets"><li>möglichst dasselbe Gerät und Messprotokoll verwenden</li><li>ähnliche Tageszeit und ähnliche Nahrungs- und Flüssigkeitssituation wählen</li><li>intensive Belastung unmittelbar vor der Messung vermeiden</li><li>nicht nur Körperfettprozent, sondern mehrere relevante Werte betrachten</li><li>Messung mit Fotos, Umfängen, Leistungsdaten und subjektivem Befinden verbinden</li></ul>
        <blockquote class="expert-quote">„Die Analyse ist nicht das Ergebnis. Sie ist ein Navigationspunkt. Entscheidend ist, ob mehrere Daten über Zeit dieselbe Entwicklung zeigen und welche Handlung daraus folgt.“</blockquote>
        <section class="source-panel"><h2>Quellen</h2><ol><li><a href="https://www.ncbi.nlm.nih.gov/books/NBK233766/" target="_blank" rel="noopener noreferrer">National Academies / NCBI: Bioelectrical Impedance – Grundlagen und Grenzen</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/16215137/" target="_blank" rel="noopener noreferrer">Kyle et al.: Validity of bioelectrical impedance models</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7852023/" target="_blank" rel="noopener noreferrer">Estimation of body composition depends on the BIA device</a></li></ol></section>
        ${expertAuthorBlock()}
        <section><h2>Häufige Fragen</h2>${faq(guideFaq)}</section>
      </div><aside class="expert-article__rail"><span>Vor Ort in Nürnberg</span><h2>Körperanalyse mit persönlicher Auswertung</h2><p>InBody, 2D-Analyse und konkrete nächste Schritte zusammenführen.</p><a class="button button--primary" href="/koerperanalyse-nuernberg/"><span>Analyse ansehen</span><span aria-hidden="true">→</span></a></aside></div></article>`;
  return layout({ path, title: "BIA, InBody & 2D-Körperanalyse: Vergleich und Grenzen", description, keywords: ["BIA InBody Vergleich", "InBody Genauigkeit", "Körperanalyse Nürnberg", "2D Körperanalyse"], bodyClass: "page-premium page-expert-article", pageType: "Article", pageName: "BIA, InBody und 2D-Körperanalyse im Vergleich", dateModified: "2026-08-11", socialImage: "/assets/images/dominik-coaching-bikeerg.webp", socialImageAlt: "Dominik Dörfl erklärt Ergebnisse einer Körperanalyse", extraStructuredData: [expertArticleSchema({ path, headline: "BIA, InBody und 2D-Körperanalyse: Was misst welches Verfahren?", description, image: "/assets/images/dominik-coaching-bikeerg.webp" }), faqSchema(path, guideFaq)], content });
}

function editorialGuidelinesPage() {
  const content = `
    <section class="expert-hero expert-hero--policy" data-color-scheme="dark"><div class="section-shell section-shell--wide"><p class="eyebrow">Transparenz &amp; Qualität</p><h1>Redaktionelle<br><span>Richtlinien.</span></h1><p class="expert-hero__lead">So trennt Camp Dörfl persönliche Erfahrung, wissenschaftliche Evidenz, Kundenbeispiele und kommerzielle Inhalte.</p></div></section>
    <section class="section" data-color-scheme="light"><div class="section-shell section-shell--wide legal-stack">
      <article class="legal-card"><h2>1. Verantwortlicher Autor</h2><p>Fachinhalte zu Training, Bodybuilding, Wettkampfvorbereitung und Körperanalyse werden Dominik Dörfl als Autor zugeordnet. Das Autorenprofil nennt Arbeitsfelder und belegbare sportliche Stationen.</p></article>
      <article class="legal-card"><h2>2. Quellenstandard</h2><p>Bevorzugt werden Primärstudien, systematische Übersichten, Fachgesellschaften, Behörden, Verbände und offizielle Ergebnislisten. Quellen werden direkt an der betreffenden Fachseite verlinkt.</p></article>
      <article class="legal-card"><h2>3. Erfahrung und Evidenz</h2><p>Persönliche Coaching-Erfahrung wird als Einordnung oder Zitat gekennzeichnet. Sie ersetzt keine wissenschaftliche Evidenz und wird nicht als allgemeingültiger Beweis dargestellt.</p></article>
      <article class="legal-card"><h2>4. Aktualisierung und Korrekturen</h2><p>Fachseiten tragen ein sichtbares Prüfdatum. Wesentliche inhaltliche Änderungen aktualisieren zusätzlich die strukturierten Metadaten und die Sitemap. Hinweise auf sachliche Fehler können an <a href="mailto:${site.email}?subject=Redaktioneller%20Hinweis">${site.email}</a> gesendet werden.</p></article>
      <article class="legal-card"><h2>5. Gesundheitliche Grenzen</h2><p>Die Inhalte dienen der allgemeinen Information und ersetzen keine medizinische Diagnose oder Behandlung. Medikamente und medizinische Maßnahmen werden ausschließlich mit behandelnden Fachpersonen entschieden.</p></article>
      <article class="legal-card"><h2>6. KI-Unterstützung</h2><p>Digitale Werkzeuge können bei Struktur, Rechercheorganisation und Qualitätskontrolle unterstützen. Verantwortung, fachliche Einordnung und Freigabe bleiben bei Camp Dörfl. Quellen und Aussagen werden vor Veröffentlichung geprüft.</p></article>
      <article class="legal-card"><h2>7. Kommerzielle Transparenz</h2><p>Kooperationen, Partnerlinks und wirtschaftlich relevante Empfehlungen werden kenntlich gemacht. Details stehen unter <a href="/werbung-partnerlinks/">Partnerlinks &amp; Werbung</a>.</p></article>
    </div></section>
    ${ctaSection({ eyebrow: "Fachinhalte", title: "Direkt zu den aktuellen Leitfäden.", text: "Alle Fachseiten mit Autor, Prüfdatum und Quellen an einem Ort.", primary: { label: "Expertenwissen öffnen", href: "/expertenwissen/" }, secondary: { label: "Presse & Medien", href: "/presse-medien/" } })}`;
  return layout({ path: "/redaktionelle-richtlinien/", title: "Redaktionelle Richtlinien & Quellenstandard | Camp Dörfl", description: "Transparente Redaktions-, Quellen- und Korrekturstandards für Fachinhalte von Dominik Dörfl und Camp Dörfl.", keywords: ["Camp Dörfl Redaktion", "Quellenstandard", "Dominik Dörfl Autor"], bodyClass: "page-premium page-editorial-policy", pageType: "WebPage", pageName: "Redaktionelle Richtlinien", dateModified: "2026-08-11", content });
}

function ueberDominikPage() {
  const facts = dominikFacts;

  const principleRows = [
    {
      title: "Klarheit vor Lautstärke",
      text:
        "Echte Entwicklung entsteht aus ehrlichen Werten, klaren Systemen und konsequenter Führung – nicht aus Motivationssprüchen oder Trends."
    },
    {
      title: "Messen statt hoffen",
      text:
        "Vom Leistungssport bis ins Coaching gilt: Was man misst, kann man steuern. Deshalb steht hinter jedem Fortschritt ein nachvollziehbarer Status."
    },
    {
      title: "Alltagstauglich statt extrem",
      text:
        "Extreme Leistungen sind möglich – aber der eigentliche Anspruch ist, dass Struktur im normalen Alltag von echten Menschen hält."
    }
  ];

  const content = `
    <section class="ff-hero ff-hero--split ff-hero--photo ff-hero--about">
      <img class="ff-hero__img" src="/assets/images/dominik-about-training-hero.jpg" alt="Dominik Dörfl beim intensiven Ausdauertraining im Fitnessstudio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <p class="ff-hero__mobile-role" aria-hidden="true">Unternehmer · Athlet · Coach</p>
        <div class="ff-hero__inner">
          <div class="premium-badge">
            <span>ÜBER DOMINIK</span>
            <small>Unternehmer, Athlet, Coach und Gründer von Camp Dörfl.</small>
          </div>
          <p class="ff-hero__eyebrow" data-reveal>Die Person hinter Camp Dörfl</p>
          <h1 class="ff-hero__title" data-reveal>Dominik.<br class="ff-hero__break--desktop"> Dörfl.<br><span>Performance gelebt.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Ex-Profi-Athlet, zweifacher Deutscher Meister, Ironman-Finisher, Coach von Top-Athleten und Unternehmer aus Nürnberg. Camp Dörfl ist die Summe dieser Erfahrung.
          </p>
          <p class="ff-hero__support" data-reveal>
            Was hier vermittelt wird, ist nicht aus Büchern abgeleitet, sondern auf der Bühne, im Wettkampf und im Coaching-Alltag selbst durchlebt.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("premium-training")}"><span>Mit Dominik arbeiten</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/erfolge-im-team/"><span>Erfolge im Team</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Eckdaten zu Dominik Dörfl">
            <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
            <div><dt>IFBB</dt><dd>Pro Bodybuilding</dd></div>
            <div><dt>Ironman</dt><dd>70.3 Finisher</dd></div>
          </dl>
        </div>
        <div class="ff-hero__showcase ff-hero__showcase--photo" data-reveal>
          <figure class="ff-hero__photo-card">
            <img src="/assets/images/dominik-about-training-hero.jpg" alt="Dominik Dörfl beim Ausdauertraining im Fitnessstudio"${imageLoadingAttributes()}>
          </figure>
          <article class="ff-hero__aside">
            <span class="card-tag">Auf einen Blick</span>
            <h2>Mehr als eine Rolle.</h2>
            <ul class="premium-checklist">
              <li>Unternehmer und Gründer von Camp Dörfl</li>
              <li>Ex-Profi-Athlet auf Spitzenniveau</li>
              <li>Coach von Olympia- und Spitzenathleten</li>
              <li>Moderator und Gastgeber von Events</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Werdegang",
          title: "Ein Weg durch mehrere Leistungswelten.",
          text:
            "Vom Mannschaftssport über Titel im Kraftsport und extreme Ausdauerleistungen bis zu Coaching und Unternehmertum: Jede Station prägt, wie Camp Dörfl heute denkt."
        })}
        ${timelineList(timeline)}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Leistungsspur",
          title: "Erfahrung, die sich in Zahlen zeigt.",
          align: "center"
        })}
        ${achievementGrid(achievements)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell editorial-stage editorial-stage--about-profile">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Kurzprofil",
            title: "Dominik Dörfl in Stichpunkten."
          })}
          <ul class="premium-checklist premium-checklist--columns">
            ${facts.map((fact) => `<li>${fact}</li>`).join("")}
          </ul>
        </div>
        <div class="editorial-stage__media editorial-stage__media--duo" data-reveal>
          <figure>
            <img src="/assets/images/dominik-bodybuilding-desert.webp" alt="Dominik Dörfl als Bodybuilder bei einem Outdoor-Shooting"${imageLoadingAttributes()}>
          </figure>
          <figure>
            <img src="/assets/images/dominik-about-gym-portrait.jpg" alt="Dominik Dörfl in Sportkleidung im Fitnessstudio"${imageLoadingAttributes()}>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--dark" data-color-scheme="dark">
      <div class="section-shell section-shell--wide expert-profile-grid">
        <div data-reveal>
          <p class="eyebrow">Zitierfähiges Kurzprofil</p>
          <h2>Dominik Dörfl ist Personal Trainer, Bodybuilding- und Performance-Coach aus Nürnberg.</h2>
          <p>Er ist Gründer von Camp Dörfl, Deutscher Meister im Bodybuilding und Powerlifting, IFBB Pro und Ironman-70.3-Finisher. In seiner Arbeit verbindet er individuelles Training, Wettkampfvorbereitung, Körperanalyse, Sporternährung und alltagstaugliche Leistungssteuerung.</p>
          <p>Als Coach begleitet er ambitionierte Privatkunden sowie Athletinnen und Athleten. Darüber hinaus entwickelt er Firmenfitness-Formate, moderiert Sport- und Business-Veranstaltungen und veröffentlicht den Podcast „Erfolg bewusst steuern“.</p>
          <p class="expert-profile-grid__note">Diese Kurzbiografie darf mit Verlinkung auf diese Seite für redaktionelle Vorstellungen verwendet werden.</p>
        </div>
        <aside data-reveal>
          <span>Fachgebiete</span>
          <ul class="premium-checklist">
            <li>Personal Training und Krafttraining</li>
            <li>Bodybuilding und Wettkampfvorbereitung</li>
            <li>Körperanalyse und Fortschrittssteuerung</li>
            <li>Sporternährung und alltagstaugliche Umsetzung</li>
            <li>Firmenfitness und Gesundheitstage</li>
            <li>Ausdauer- und Hybrid-Performance</li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Externe Nachweise",
          title: "Originalquellen und unabhängige Profile.",
          text: "Die folgenden Seiten liegen außerhalb von campdoerfl.de und helfen dabei, Person, sportliche Ergebnisse und publizistische Arbeit eindeutig zuzuordnen."
        })}
        <div class="external-proof-grid">
          <a href="https://dbfv.de/wp-content/uploads/Ergebnisliste-DM-JunMas2018.pdf" target="_blank" rel="noopener noreferrer" data-reveal><span>Offizielle Ergebnisliste</span><h3>DBFV Deutsche Meisterschaft 2018</h3><p>Dominik Dörfl ist in der offiziellen Ergebnisliste als Erstplatzierter aufgeführt.</p><b>Originalquelle öffnen ↗</b></a>
          <a href="https://blv-bfk.de/90-2/" target="_blank" rel="noopener noreferrer" data-reveal><span>Landesverband</span><h3>BLV-BFK Vereins- und Studioverzeichnis</h3><p>Camp Dörfl wird mit Standort, Kontakt und Website im Nürnberger PLZ-Bereich geführt.</p><b>Verbandsseite öffnen ↗</b></a>
          <a href="https://podcasts.apple.com/us/podcast/erfolg-bewusst-steuern-der-camp-d%C3%B6rfl-podcast/id1549119123" target="_blank" rel="noopener noreferrer" data-reveal><span>Apple Podcasts</span><h3>Erfolg bewusst steuern</h3><p>Podcast von Dominik Dörfl zu Leistungssport, Unternehmertum und mentaler Umsetzung.</p><b>Podcast öffnen ↗</b></a>
          <a href="${site.linkedin}" target="_blank" rel="noopener noreferrer" data-reveal><span>Berufsprofil</span><h3>LinkedIn</h3><p>Öffentliches Profil mit beruflicher Einordnung, Standort und Camp-Dörfl-Zuordnung.</p><b>Profil öffnen ↗</b></a>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Haltung",
          title: "Woran Dominik Leistung misst.",
          text:
            "Über alle Sportarten und Rollen hinweg bleiben die Prinzipien gleich – und genau sie stecken im System von Camp Dörfl."
        })}
        ${summaryRows(principleRows)}
      </div>
    </section>

    <section class="section"><div class="section-shell section-shell--wide">
      ${sectionHeader({ eyebrow: "Fachbeiträge", title: "Wissen mit Autor, Prüfdatum und Quellen.", text: "Dominiks aktuelle Leitfäden beantworten konkrete Fragen zu Trainerwahl, Contest Prep und Körperanalyse." })}
      <div class="expert-card-grid">
        <a class="expert-card" href="/personal-trainer-auswaehlen-nuernberg/"><span>Personal Training</span><h3>Guten Personal Trainer erkennen</h3><b>Leitfaden lesen →</b></a>
        <a class="expert-card" href="/bodybuilding-wettkampfvorbereitung-dauer/"><span>Bodybuilding</span><h3>Dauer einer Contest Prep</h3><b>Leitfaden lesen →</b></a>
        <a class="expert-card" href="/bia-inbody-koerperanalyse-vergleich/"><span>Körperanalyse</span><h3>BIA und InBody einordnen</h3><b>Leitfaden lesen →</b></a>
      </div>
    </div></section>

    ${ctaSection({
      eyebrow: "Über Dominik",
      title: "Willst du mit Dominik arbeiten?",
      text:
        "Ob Premium Personal Training, Executive Performance oder die Camp Dörfl App – der sinnvollste erste Schritt ist eine klare Anfrage.",
      primary: { label: "Beratung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Camp Dörfl App ansehen", href: "/app/" }
    })}
  `;

  return layout({
    path: "/ueber-dominik/",
    title: "Über Dominik Dörfl | Camp Dörfl Nürnberg",
    description:
      "Über Dominik Dörfl: Unternehmer, Ex-Profi-Athlet, Deutscher Meister, Ironman-Finisher und Coach aus Nürnberg – die Person und Erfahrung hinter Camp Dörfl.",
    keywords: ["Dominik Dörfl", "Camp Dörfl Gründer", "Ex-Profi Athlet Nürnberg", "Coach und Moderator Nürnberg"],
    bodyClass: "page-premium page-about",
    pageType: "AboutPage",
    pageName: "Dominik Dörfl – Personal Trainer und Performance Coach",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/dominik-stage-suit-social.jpg",
    socialImageAlt: "Dominik Dörfl im Anzug auf der Bühne",
    content
  });
}

function impressumPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Impressum",
          text: "Angaben gemäß § 5 DDG. Stand: 17. Juni 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Anbieter</h2>
            <address>
              ${site.ownerName}<br>
              ${site.streetAddress}<br>
              ${site.postalCode} ${site.city}<br>
              ${site.country}
            </address>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Kontakt</h2>
            <p><span class="legal-label">E-Mail:</span> <a href="mailto:${site.email}">${site.email}</a></p>
            <p><span class="legal-label">Instagram:</span> ${socialIconLink(site.instagram, { className: "social-link--chip social-link--inline" })}</p>
            <p>Eine unmittelbare elektronische Kontaktaufnahme ist per E-Mail möglich. Das Kontaktformular dieser Website übermittelt eingegebene Daten über den Formular-Dienst FormSubmit an ${site.email}.</p>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Rechtliche Schnellnavigation</h2>
            <ul class="legal-list">
              <li><a href="/datenschutz/">Datenschutz</a></li>
              <li><a href="/datenschutzformular-app/">Datenschutzformular App</a></li>
              <li><a href="/cookies/">Cookies & lokale Speicherungen</a></li>
              <li><a href="/werbung-partnerlinks/">Partnerlinks & Werbung</a></li>
              <li><a href="/barrierefreiheit/">Barrierefreiheit</a></li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-stack">
        <article class="legal-card" data-reveal>
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            ${site.ownerName}<br>
            ${site.streetAddress}<br>
            ${site.postalCode} ${site.city}
          </p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Verbraucherstreitbeilegung</h2>
          <p>Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          <p class="legal-note">Hinweis: Die frühere EU-Online-Streitbeilegungsplattform wurde zum 20. Juli 2025 eingestellt.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Hinweis zu Werbung, Partnerlinks und Kooperationen</h2>
          <p>Auf dieser Website können Inhalte mit Markenbezug, Partnernennungen, Rabattcodes oder direkten Partnerlinks erscheinen. Hinweise zur Kennzeichnung und Transparenz finden Sie auf der Seite <a href="/werbung-partnerlinks/">Partnerlinks & Werbung</a>.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Urheberrecht</h2>
          <p>Die auf dieser Website veröffentlichten Texte, Bilder, Grafiken und sonstigen Inhalte unterliegen dem Urheberrecht, soweit nicht anders gekennzeichnet. Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Geltungsbereich des Impressums</h2>
          <p>Dieses Impressum gilt für die Website von Camp Dörfl unter ${site.domain} und für die dort dargestellten Angebote rund um Premium Personal Training, Firmenfitness, Events, Kooperationen und die Camp Dörfl App.</p>
          <p>Zusätzliche Profile auf externen Plattformen können eigene Anbieterinformationen, Nutzungsbedingungen und Datenschutzangaben enthalten.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Kommunikation und Anfragen</h2>
          <p>Für Fragen zu Inhalten, Kooperationen, rechtlichen Hinweisen oder einer Zusammenarbeit in Nürnberg ist die im Impressum genannte E-Mail-Adresse der direkte Kontaktweg.</p>
          <p>Bei geschäftlichen Anfragen bitte den betroffenen Bereich nennen, damit Premium Personal Training, Firmenfitness, Events oder App-Themen schnell richtig zugeordnet werden können.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>Redaktionelle Verantwortung</h2>
          <p>Die Inhalte der Website werden mit dem Anspruch gepflegt, Leistungen, Kontaktwege und rechtliche Hinweise verständlich und aktuell darzustellen. Änderungen an Angeboten, Partnern oder technischen Diensten können eine Anpassung einzelner Informationsseiten erforderlich machen.</p>
          <p>Falls Ihnen eine unklare Angabe, ein fehlerhafter Link oder ein missverständlicher Hinweis auffällt, können Sie sich direkt über die genannte Kontaktadresse melden.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/impressum/",
    title: "Impressum | Camp Dörfl Nürnberg",
    description: "Impressum von Camp Dörfl Nürnberg mit Anbieterkennzeichnung, Kontakt, Verantwortlichkeit und rechtlichen Hinweisen zur Website.",
    keywords: ["Impressum", "Camp Dörfl", "Dominik Dörfl"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function privacyPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Datenschutz",
          text: "Diese Datenschutzerklärung gilt für die Website ${site.domain}. Stand: 1. August 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Verantwortlicher</h2>
            <address>
              ${site.ownerName}<br>
              ${site.streetAddress}<br>
              ${site.postalCode} ${site.city}<br>
              ${site.country}
            </address>
            <p><span class="legal-label">E-Mail:</span> <a href="mailto:${site.email}">${site.email}</a></p>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Kurz zusammengefasst</h2>
            <ul class="legal-list">
              <li>Diese Website verwendet aktuell keine Analyse- oder Marketing-Tools, die ohne Einwilligung aktiviert werden.</li>
              <li>Die auf der Website verwendeten Schriftarten werden lokal bereitgestellt.</li>
              <li>Ihre Einwilligungsauswahl wird lokal im Browser unter <code>campdoerfl-consent</code> gespeichert.</li>
              <li>Erfolgsrelevante Interaktionen werden ohne Cookies oder dauerhafte Nutzerkennung anonymisiert gezählt.</li>
              <li>YouTube-Inhalte werden erst nach Ihrer Freigabe geladen und können danach im sichtbaren Bereich automatisch und stumm starten.</li>
              <li>Die PLZ-Umkreissuche im Triathlon- und Laufkalender sendet Ihre Eingabe erst nach aktivem Start der Suche an den Geokodierungsdienst Photon von komoot.</li>
              <li>Das Kontaktformular dieser Website übermittelt Ihre Angaben an den Formular-Dienst FormSubmit, der die Nachricht an ${site.email} weiterleitet.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h2>1. Bereitstellung der Website</h2>
          <p>Beim Aufruf der Website werden durch den technischen Betrieb unvermeidbar Verbindungsdaten verarbeitet. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene URL, Referrer, Browsertyp und Betriebssystem gehören.</p>
          <p>Die Verarbeitung erfolgt zur Auslieferung der Website, zur Gewährleistung von Stabilität und Sicherheit sowie zur Abwehr von Missbrauch.</p>
          <p><span class="legal-label">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p><span class="legal-label">Empfänger:</span> der für die Auslieferung der Website eingesetzte technische Hosting-Dienstleister.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>2. Kontakt per E-Mail und Kontaktformular</h2>
          <p>Wenn Sie mir direkt per E-Mail schreiben oder das Kontaktformular auf dieser Website nutzen, verarbeite ich die von Ihnen übermittelten Angaben zur Bearbeitung Ihrer Anfrage. Das können insbesondere Name, E-Mail-Adresse, Telefonnummer, Unternehmen, Thema und Nachricht sein.</p>
          <p>Beim Absenden des Formulars werden die eingegebenen Daten an den externen Formular-Dienst FormSubmit unter <code>formsubmit.co</code> übertragen und von dort an ${site.email} weitergeleitet. Dabei können zusätzlich technische Verbindungsdaten wie IP-Adresse, Zeitstempel und Browserinformationen verarbeitet werden.</p>
          <h2>Anonymisierte Erfolgsmessung</h2>
          <p>Zur Verbesserung der Website werden ausschließlich erfolgsrelevante Interaktionen wie Klicks auf Anfragewege, Formularbeginn und erfolgreicher oder fehlgeschlagener Versand gezählt. Gespeichert werden Ereignistyp, aufgerufener Seitenpfad, Zielkategorie, grobe Geräteklasse und die verweisende Domain. Es werden keine Cookies, keine dauerhafte Nutzerkennung und keine Formularinhalte gespeichert. Die Speicherung erfolgt als strukturierter Eintrag in Cloudflare Workers Logs und wird nach spätestens sieben Tagen automatisch gelöscht.</p>
          <p><span class="legal-label">Empfänger:</span> ich selbst sowie der eingesetzte Formular-Dienst FormSubmit / Devro LABS.</p>
          <p><span class="legal-label">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. b DSGVO, soweit es um vorvertragliche Kommunikation geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>3. Einwilligungs-Management und lokale Speicherung</h2>
          <p>Diese Website speichert Ihre Auswahl zu erforderlichen Funktionen und externen Medien lokal in Ihrem Browser, damit die Entscheidung nicht bei jedem Seitenaufruf erneut abgefragt werden muss.</p>
          <p>Aktuell wird dazu insbesondere der Eintrag <code>campdoerfl-consent</code> verwendet. Die Einzelheiten sind auf der Seite <a href="/cookies/">Cookies & lokale Speicherungen</a> beschrieben.</p>
          <p><span class="legal-label">Rechtsgrundlage:</span> § 25 Abs. 2 Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>4. YouTube-Videos</h2>
          <p>Auf mehreren Seiten dieser Website sind Videos von YouTube im erweiterten Datenschutzmodus über <code>youtube-nocookie.com</code> eingebunden. Diese Inhalte werden erst geladen, wenn Sie der Kategorie „Externe Medien“ zugestimmt haben.</p>
          <p>Nach Ihrer Freigabe kann im sichtbaren Bereich automatisch eine Verbindung zu YouTube beziehungsweise Google hergestellt werden. Dabei können insbesondere IP-Adresse, Geräte- und Browserinformationen sowie Nutzungsdaten verarbeitet werden. Auf die weitere Verarbeitung durch YouTube oder Google habe ich keinen Einfluss.</p>
          <p><span class="legal-label">Rechtsgrundlage:</span> § 25 Abs. 1 TDDDG sowie Art. 6 Abs. 1 lit. a DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>5. PLZ-Umkreissuche mit Photon</h2>
          <p>Im Triathlon- und Laufkalender können Sie eine Postleitzahl eingeben, um Veranstaltungen in einem ausgewählten Radius zu finden. Erst wenn Sie die Suche aktiv starten, wird die eingegebene Postleitzahl zusammen mit dem ausgewählten Land an die öffentliche Photon-Schnittstelle unter <code>photon.komoot.io</code> übertragen. Photon ist ein Open-Source-Geokodierungsdienst auf Basis von OpenStreetMap-Daten und wird von der komoot GmbH bereitgestellt.</p>
          <p>Bei der Verbindung verarbeitet der Anbieter technisch bedingt auch Verbindungsdaten wie Ihre IP-Adresse, Browserinformationen und den Zeitpunkt der Anfrage. Camp Dörfl speichert die eingegebene Postleitzahl nicht und erstellt daraus kein Nutzerprofil.</p>
          <p><span class="legal-label">Zweck:</span> Bereitstellung der von Ihnen ausgelösten Umkreissuche. <span class="legal-label">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p><a href="https://www.komoot.com/de-de/privacy" target="_blank" rel="noopener noreferrer">Datenschutzrichtlinie von komoot</a></p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>6. Externe Links</h2>
          <p>Diese Website verlinkt auf externe Angebote, insbesondere Instagram, YouTube und Partner-Websites. Wenn Sie einen solchen Link anklicken, verlassen Sie diese Website. Ab diesem Zeitpunkt gilt ausschließlich die Datenschutzerklärung des jeweiligen Anbieters.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>7. Speicherdauer</h2>
          <p>Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
          <p>Technische Verbindungsdaten werden nur im für Betrieb, Sicherheit und Fehleranalyse erforderlichen Umfang verarbeitet. Inhalte aus der Kontaktaufnahme speichere ich nur so lange, wie dies zur Bearbeitung Ihrer Anfrage oder zur Erfüllung gesetzlicher Pflichten nötig ist.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>8. Ihre Rechte</h2>
          <ul class="legal-list">
            <li>Recht auf Auskunft nach Art. 15 DSGVO</li>
            <li>Recht auf Berichtigung nach Art. 16 DSGVO</li>
            <li>Recht auf Löschung nach Art. 17 DSGVO</li>
            <li>Recht auf Einschränkung der Verarbeitung nach Art. 18 DSGVO</li>
            <li>Recht auf Datenübertragbarkeit nach Art. 20 DSGVO</li>
            <li>Recht auf Widerspruch nach Art. 21 DSGVO</li>
            <li>Recht auf Widerruf einer Einwilligung mit Wirkung für die Zukunft</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-shell legal-stack">
        <article class="legal-card" data-reveal>
          <h2>9. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Für private Anbieter in Bayern ist regelmäßig das Bayerische Landesamt für Datenschutzaufsicht (BayLDA) zuständig.</p>
          <p><a href="https://www.lda.bayern.de/de/index.html" target="_blank" rel="noopener noreferrer">www.lda.bayern.de</a></p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>10. Keine Pflicht zur Bereitstellung</h2>
          <p>Sie sind nicht verpflichtet, mir personenbezogene Daten bereitzustellen. Ohne bestimmte Angaben kann ich Ihre Anfrage jedoch gegebenenfalls nicht oder nicht vollständig bearbeiten.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>11. Aktueller Geltungsbereich</h2>
          <p>Diese Datenschutzerklärung wurde auf das aktuell erkennbare technische Setup dieser Website abgestimmt. Wenn künftig weitere Dienste, Tracking- oder Analyse-Tools eingebunden werden, muss diese Erklärung vor deren Einsatz entsprechend aktualisiert werden.</p>
          <p class="legal-note">Ergänzende Hinweise zur Einwilligungslogik finden Sie auf der Seite <a href="/cookies/">Cookies & lokale Speicherungen</a>.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/datenschutz/",
    title: "Datenschutzerklärung | Camp Dörfl Nürnberg",
    description:
      "Datenschutzerklärung von Camp Dörfl: Welche Daten auf der Website campdoerfl.de erhoben und verarbeitet werden und welche Rechte du als Nutzer hast.",
    keywords: ["Datenschutz", "Camp Dörfl", "DSGVO"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function appPrivacyPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Datenschutzformular App",
          text: "Datenschutzerklärung für Website, App und digitale Angebote von Camp Dörfl. Stand: 30. Juni 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Verantwortlicher</h2>
            <address>
              Camp Dörfl<br>
              ${site.ownerName}<br>
              ${site.streetAddress}<br>
              ${site.postalCode} ${site.city}<br>
              ${site.country}
            </address>
            <p><span class="legal-label">E-Mail:</span> <a href="mailto:${site.email}">${site.email}</a></p>
            <p><span class="legal-label">Telefon:</span> <a href="tel:+4915561562648">015561562648</a></p>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Geltungsbereich</h2>
            <p>Diese Datenschutzerklärung beschreibt die Verarbeitung personenbezogener Daten auf dieser Website, im Zusammenhang mit Coaching-Angeboten, Terminvereinbarungen, digitalen Member-Bereichen und der Camp-Dörfl-App.</p>
            <p>Personenbezogene Daten sind alle Informationen, mit denen eine Person direkt oder indirekt identifiziert werden kann.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website und im Zusammenhang mit den Angeboten von Camp Dörfl ist:</p>
          <address>
            Camp Dörfl<br>
            ${site.ownerName}<br>
            ${site.streetAddress}<br>
            ${site.postalCode} ${site.city}<br>
            ${site.country}
          </address>
          <p><span class="legal-label">E-Mail:</span> <a href="mailto:${site.email}">${site.email}</a></p>
          <p><span class="legal-label">Telefon:</span> <a href="tel:+4915561562648">015561562648</a></p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
          <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Website, zur Kommunikation mit Interessenten und Kunden, zur Durchführung unserer Coaching-Angebote, zur Terminvereinbarung, zur Vertragsabwicklung oder aufgrund gesetzlicher Pflichten erforderlich ist.</p>
          <p>Personenbezogene Daten sind alle Informationen, mit denen eine Person direkt oder indirekt identifiziert werden kann, zum Beispiel Name, E-Mail-Adresse, Telefonnummer, IP-Adresse, Trainingsdaten, Gesundheitsdaten oder Angaben aus Kontakt- und Anmeldeformularen.</p>
          <p>Die Verarbeitung erfolgt insbesondere auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO, wenn eine Einwilligung erteilt wurde, Art. 6 Abs. 1 lit. b DSGVO, wenn die Verarbeitung zur Durchführung vorvertraglicher Maßnahmen oder eines Vertrags erforderlich ist, Art. 6 Abs. 1 lit. c DSGVO, wenn gesetzliche Pflichten bestehen, und Art. 6 Abs. 1 lit. f DSGVO, wenn ein berechtigtes Interesse besteht.</p>
          <p>Soweit Gesundheitsdaten verarbeitet werden, erfolgt dies nur auf Grundlage einer ausdrücklichen Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO oder soweit dies für ausdrücklich gewünschte Coaching-Leistungen erforderlich und zulässig ist.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>3. Zugriff auf die Website und Server-Logfiles</h2>
          <p>Beim Besuch unserer Website werden technisch notwendige Daten verarbeitet, damit die Website sicher und stabil angezeigt werden kann. Dazu können gehören:</p>
          <ul class="legal-list">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>aufgerufene Seite</li>
            <li>Browsertyp und Browserversion</li>
            <li>Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>übertragene Datenmenge</li>
          </ul>
          <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren, stabilen und fehlerfreien Bereitstellung der Website.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>4. Kontaktaufnahme</h2>
          <p>Wenn du uns per E-Mail, Telefon, Kontaktformular oder über andere Kommunikationswege kontaktierst, verarbeiten wir die von dir übermittelten Daten, zum Beispiel Name, E-Mail-Adresse, Telefonnummer und Inhalt deiner Nachricht.</p>
          <p>Die Daten werden verarbeitet, um deine Anfrage zu beantworten, Termine zu koordinieren oder eine mögliche Zusammenarbeit vorzubereiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um vorvertragliche oder vertragliche Kommunikation geht, und Art. 6 Abs. 1 lit. f DSGVO bei allgemeinen Anfragen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>5. Terminbuchung und Coaching-Anfragen</h2>
          <p>Wenn du einen Termin buchst oder eine Coaching-Anfrage stellst, können je nach Formular folgende Daten verarbeitet werden:</p>
          <ul class="legal-list">
            <li>Name</li>
            <li>Kontaktdaten</li>
            <li>gewünschte Leistung</li>
            <li>Trainingsziel</li>
            <li>Ausgangssituation</li>
            <li>Terminwunsch</li>
            <li>freiwillige Angaben zu Fitness, Ernährung, Beschwerden oder Gesundheit</li>
          </ul>
          <p>Diese Daten verwenden wir zur Vorbereitung, Durchführung und Verwaltung des Coachings. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Freiwillige Angaben zu Gesundheit, Training, Körperdaten oder Beschwerden werden nur mit deiner Einwilligung verarbeitet, Art. 9 Abs. 2 lit. a DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>6. Verarbeitung von Gesundheits-, Trainings- und Fortschrittsdaten</h2>
          <p>Im Rahmen unserer Coaching-Angebote und digitalen Member-Bereiche können freiwillig Gesundheits-, Trainings-, Ernährungs- und Fortschrittsdaten verarbeitet werden. Dazu können gehören:</p>
          <ul class="legal-list">
            <li>Körperdaten wie Gewicht, Größe, Umfänge oder Fortschrittsbilder</li>
            <li>Trainingsdaten</li>
            <li>Ernährungsdaten</li>
            <li>Check-ins und Fortschrittsnotizen</li>
            <li>Schlaf-, Aktivitäts- oder Vitaldaten, sofern du diese freiwillig übermittelst</li>
            <li>hochgeladene Dokumente, zum Beispiel Blutbilder oder Laborwerte</li>
          </ul>
          <p>Diese Daten dienen ausschließlich dazu, das Coaching, die Trainingsplanung, die Ernährungsunterstützung und die individuelle Betreuung zu verbessern.</p>
          <p>Die Bereitstellung solcher Daten ist freiwillig. Du kannst eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Ohne bestimmte Daten können einzelne Coaching-Funktionen eventuell nur eingeschränkt genutzt werden.</p>
          <p>Camp Dörfl ersetzt keine ärztliche Diagnose, Behandlung oder medizinische Beratung. Bei gesundheitlichen Beschwerden oder medizinischen Fragen solltest du ärztlichen Rat einholen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>7. Member-Bereich, App und digitale Funktionen</h2>
          <p>Wenn du einen digitalen Member-Bereich oder die Camp-Dörfl-App nutzt, verarbeiten wir Daten, die für Registrierung, Login, Nutzung, Coaching-Funktionen, Fortschrittsverfolgung und Kommunikation erforderlich sind.</p>
          <p>Dazu können gehören:</p>
          <ul class="legal-list">
            <li>Accountdaten</li>
            <li>Login- und Sitzungsdaten</li>
            <li>Trainings- und Ernährungspläne</li>
            <li>Check-ins</li>
            <li>Chatnachrichten</li>
            <li>Uploads</li>
            <li>App-Nutzungsdaten</li>
            <li>freiwillig verbundene Gesundheitsdaten</li>
          </ul>
          <p>Die Verarbeitung erfolgt zur Bereitstellung der gebuchten digitalen Leistungen auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Gesundheitsdaten werden nur auf Grundlage deiner ausdrücklichen Einwilligung verarbeitet.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>8. KI-gestützte Unterstützung</h2>
          <p>Zur Verbesserung der Coaching-Unterstützung können KI-gestützte Funktionen eingesetzt werden, zum Beispiel zur strukturierten Auswertung von Check-ins, Fortschrittsdaten, Ernährungsangaben oder Chatnachrichten.</p>
          <p>Die KI dient als unterstützendes Werkzeug. Es findet keine ausschließlich automatisierte Entscheidung mit rechtlicher Wirkung oder ähnlich erheblicher Beeinträchtigung im Sinne von Art. 22 DSGVO statt.</p>
          <p>Soweit personenbezogene Daten an technische Dienstleister übermittelt werden, geschieht dies nur im erforderlichen Umfang und auf Grundlage geeigneter Datenschutzvereinbarungen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>9. Zahlungsabwicklung und Abonnements</h2>
          <p>Wenn kostenpflichtige Leistungen, Mitgliedschaften oder digitale Abonnements genutzt werden, können Zahlungs- und Vertragsdaten verarbeitet werden. Zahlungsdaten werden je nach Zahlungsart durch die jeweiligen Zahlungs- oder Plattformanbieter verarbeitet, zum Beispiel App Store, Zahlungsdienstleister oder Abonnement-Dienstleister.</p>
          <p>Wir erhalten in der Regel keine vollständigen Zahlungsdaten wie vollständige Kreditkartennummern, sondern nur Informationen, die für die Vertrags- und Leistungsverwaltung erforderlich sind.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>10. Cookies und ähnliche Technologien</h2>
          <p>Unsere Website kann technisch notwendige Cookies oder vergleichbare Technologien verwenden, damit grundlegende Funktionen bereitgestellt werden können.</p>
          <p>Soweit Analyse-, Marketing- oder Tracking-Technologien eingesetzt werden, geschieht dies nur auf Grundlage deiner Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Du kannst eine erteilte Einwilligung jederzeit widerrufen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>11. Externe Dienstleister und Auftragsverarbeitung</h2>
          <p>Für Betrieb, Hosting, Kommunikation, App-Funktionen, Datenbank, E-Mail-Versand, Zahlungsabwicklung oder technische Sicherheit können externe Dienstleister eingesetzt werden.</p>
          <p>Diese Dienstleister verarbeiten personenbezogene Daten nur im erforderlichen Umfang und, soweit gesetzlich erforderlich, auf Grundlage eines Vertrags zur Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
          <p>Eine Übermittlung in Länder außerhalb der EU oder des EWR erfolgt nur, wenn hierfür geeignete Garantien bestehen, zum Beispiel EU-Standardvertragsklauseln, ein Angemessenheitsbeschluss oder eine ausdrückliche Einwilligung.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>12. Speicherdauer</h2>
          <p>Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist.</p>
          <p>Daten aus Anfragen werden gelöscht, wenn die Anfrage abschließend bearbeitet ist, sofern keine gesetzlichen Aufbewahrungspflichten bestehen. Vertrags- und Rechnungsdaten werden entsprechend gesetzlicher Aufbewahrungspflichten gespeichert. Coaching-, Gesundheits- und Fortschrittsdaten werden gelöscht, wenn sie für die Betreuung nicht mehr erforderlich sind, du deine Einwilligung widerrufst oder eine Löschung verlangst, soweit keine gesetzlichen Pflichten entgegenstehen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>13. Datensicherheit</h2>
          <p>Wir treffen angemessene technische und organisatorische Maßnahmen, um personenbezogene Daten vor Verlust, Missbrauch, unbefugtem Zugriff, Veränderung oder Offenlegung zu schützen.</p>
          <p>Trotz sorgfältiger Sicherheitsmaßnahmen kann eine Datenübertragung im Internet nie vollständig risikofrei garantiert werden.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>14. Deine Rechte</h2>
          <p>Du hast im Rahmen der gesetzlichen Voraussetzungen folgende Rechte:</p>
          <ul class="legal-list">
            <li>Recht auf Auskunft gemäß Art. 15 DSGVO</li>
            <li>Recht auf Berichtigung gemäß Art. 16 DSGVO</li>
            <li>Recht auf Löschung gemäß Art. 17 DSGVO</li>
            <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</li>
            <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO</li>
            <li>Recht auf Widerspruch gemäß Art. 21 DSGVO</li>
            <li>Recht auf Widerruf einer Einwilligung gemäß Art. 7 Abs. 3 DSGVO</li>
            <li>Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde gemäß Art. 77 DSGVO</li>
          </ul>
          <p>Wenn du eines deiner Rechte ausüben möchtest, kannst du dich jederzeit an uns wenden: <a href="mailto:${site.email}">${site.email}</a></p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>15. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p>Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren. Für private Unternehmen in Bayern ist regelmäßig zuständig:</p>
          <address>
            Bayerisches Landesamt für Datenschutzaufsicht<br>
            Promenade 18<br>
            91522 Ansbach<br>
            Deutschland
          </address>
          <p><span class="legal-label">Website:</span> <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer">https://www.lda.bayern.de</a></p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>16. Änderungen dieser Datenschutzerklärung</h2>
          <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich rechtliche Anforderungen, technische Funktionen oder unsere Leistungen ändern. Es gilt die jeweils auf der Website veröffentlichte Fassung.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/datenschutzformular-app/",
    title: "Datenschutzformular App | Camp Dörfl",
    description:
      "Datenschutzformular App von Camp Dörfl: Hinweise zur Verarbeitung personenbezogener Daten bei Website, App, Member-Bereich, Coaching und digitalen Funktionen.",
    keywords: ["Datenschutzformular App", "Camp Dörfl App Datenschutz", "DSGVO", "Member-Bereich"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function cookiesPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Cookies & lokale Speicherungen",
          text: "Diese Seite beschreibt, welche Cookies, lokalen Speicherungen und externen Medien auf dieser Website aktuell eingesetzt werden. Stand: 17. Juni 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Aktueller Stand</h2>
            <ul class="legal-list">
              <li>Es werden aktuell keine Analyse-, Marketing- oder Remarketing-Cookies automatisch gesetzt.</li>
              <li>Für das Einwilligungs-Management nutzt die Website derzeit vor allem eine lokale Speicherung im Browser statt klassischer Tracking-Cookies.</li>
              <li>YouTube-Videos werden erst nach Ihrer Freigabe für externe Medien geladen und können danach im sichtbaren Bereich automatisch stumm starten.</li>
              <li>Die Einstellungen können jederzeit erneut geöffnet, geändert oder widerrufen werden.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Einwilligung verwalten</h2>
            <p>Sie können Ihre Auswahl jederzeit erneut aufrufen, ändern oder widerrufen.</p>
            <div class="legal-action-row">
              <button class="button button--secondary-light" type="button" data-open-consent><span>Cookie-Einstellungen öffnen</span><span aria-hidden="true">&rarr;</span></button>
            </div>
            <p class="legal-note">Rechtsgrundlagen: § 25 TDDDG sowie, soweit personenbezogene Daten verarbeitet werden, Art. 6 DSGVO.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h2>1. Einwilligungs-Speicherung im Browser</h2>
          <p>Diese Website speichert Ihre Einwilligungsentscheidung lokal in Ihrem Browser, damit die getroffene Auswahl bei weiteren Seitenaufrufen beachtet werden kann.</p>
          <ul class="legal-list">
            <li><span class="legal-label">Technischer Name:</span> <code>campdoerfl-consent</code></li>
            <li><span class="legal-label">Inhalt:</span> Auswahl zu externen Medien, Versionsstand und Zeitstempel der Speicherung</li>
            <li><span class="legal-label">Zweck:</span> Speicherung Ihrer Auswahl zu erforderlichen Funktionen und externen Medien</li>
            <li><span class="legal-label">Speicherdauer:</span> bis zur manuellen Löschung im Browser oder bis eine neue Consent-Version erforderlich wird</li>
          </ul>
          <p><span class="legal-label">Rechtsgrundlage:</span> § 25 Abs. 2 Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>2. Externe Medien</h2>
          <p>Auf mehreren Seiten dieser Website sind YouTube-Videos im erweiterten Datenschutzmodus eingebunden. Diese Inhalte werden erst nach Ihrer Freigabe für externe Medien geladen.</p>
          <p>Nach der Freigabe kann beim Erreichen des sichtbaren Bereichs automatisch eine Verbindung zu YouTube beziehungsweise Google hergestellt werden. Die Videos starten dabei stumm; den Ton können Sie bei Bedarf direkt im Player aktivieren.</p>
          <p><span class="legal-label">Rechtsgrundlage:</span> § 25 Abs. 1 TDDDG sowie Art. 6 Abs. 1 lit. a DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>3. Aktuell nicht im Einsatz</h2>
          <p>Zum Stand vom 17. Juni 2026 werden auf dieser Website aktuell keine einwilligungspflichtigen Analyse- oder Marketing-Tools wie Tracking-Pixel, Werbe-Cookies, Remarketing-Dienste oder Social-Media-Embeds automatisch aktiviert.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>4. Browser-Einstellungen und Widerruf</h2>
          <p>Sie können lokale Speicherungen jederzeit über Ihre Browser-Einstellungen löschen. Zusätzlich können Sie Ihre Auswahl direkt über den Link „Cookie-Einstellungen“ im Footer neu setzen.</p>
          <p>Wenn künftig weitere Dienste eingebunden werden, insbesondere Analyse-, Werbe- oder Social-Media-Plugins, müssen diese Seite, die Datenschutzerklärung und die Consent-Logik vor der Aktivierung entsprechend erweitert werden.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/cookies/",
    title: "Cookies & lokale Speicherungen | Camp Dörfl",
    description: "Cookie-Hinweise von Camp Dörfl: lokale Speicherungen, Consent-Einstellungen, externe Medien und Widerruf auf campdoerfl.de.",
    keywords: ["Cookies", "Cookie-Einstellungen", "lokale Speicherungen", "Camp Dörfl"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function partnerTransparencyPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Partnerlinks & Werbung",
          text: "Diese Seite erläutert, wie Camp Dörfl mit Werbung, Kooperationen, Markenhinweisen und direkten Partnerlinks umgeht. Stand: 17. Juni 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Kurz zusammengefasst</h2>
            <ul class="legal-list">
              <li>Auf dieser Website können Marken, Produkte, Logos, Kooperationen, Rabattcodes und Partnerlinks genannt oder verlinkt werden.</li>
              <li>Solche Inhalte werden auf den jeweiligen Seiten kenntlich gemacht oder sind aus dem Kontext als Kooperation, Werbung oder Partnerhinweis erkennbar.</li>
              <li>Einzelne Links können direkte Partnerlinks oder Referral-Links sein und damit wirtschaftlich relevant für Camp Dörfl sein.</li>
              <li>Fragen zur Kennzeichnung oder zu einer konkreten Kooperation können jederzeit per E-Mail gestellt werden.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Aktueller Stand auf dieser Website</h2>
            <ul class="legal-list">
              <li>Auf der Partner-Seite werden aktuell unter anderem XXL Nutrition und AEKE vorgestellt.</li>
              <li>Bei AEKE wird derzeit ein direkter Partnerlink mit Referral-Parameter genutzt.</li>
              <li>Bei XXL Nutrition wird derzeit unter anderem der Code <code>Dominik</code> genannt.</li>
              <li>Die Partner-Seite und dazugehörige Buttons werden technisch mit <code>rel="sponsored"</code> gekennzeichnet.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h2>1. Kennzeichnung von Werbung und Kooperationen</h2>
          <p>Wenn Camp Dörfl Marken, Produkte oder Unternehmen im Rahmen einer Kooperation vorstellt, geschieht dies als kommerzielle Kommunikation im Sinne der geltenden Informationspflichten. Solche Inhalte werden auf der jeweiligen Seite sprachlich, gestalterisch oder über den Kontext als Partnerinhalt erkennbar gemacht.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>2. Partnerlinks und Referral-Links</h2>
          <p>Einzelne externe Links können direkt zu Partner-Angeboten führen und technisch Parameter enthalten, die eine Zuordnung der Empfehlung ermöglichen, beispielsweise Referral- oder Tracking-Parameter wie <code>sca_ref</code>.</p>
          <p>Wenn Sie einem solchen Link folgen oder einen genannten Code verwenden, kann Camp Dörfl hierdurch wirtschaftlich begünstigt werden.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>3. Rabattcodes und Vorteile</h2>
          <p>Genannte Rabattcodes, Hinweise auf Aktionen oder Produktvorteile dienen der transparenten Kommunikation mit Interessierten. Ob und in welcher Höhe ein Vorteil für Sie entsteht, richtet sich ausschließlich nach dem aktuellen Angebot des jeweiligen Partners.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>4. Einordnung und Verantwortung</h2>
          <p>Kooperationen werden nur dann eingebunden, wenn sie aus Sicht von Camp Dörfl fachlich, inhaltlich und markenseitig zum eigenen Performance-System passen. Die Erwähnung einer Marke ersetzt jedoch keine eigene Prüfung durch Nutzerinnen und Nutzer.</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-shell legal-stack">
        <article class="legal-card" data-reveal>
          <h2>Fragen zur Transparenz</h2>
          <p>Wenn Sie wissen möchten, ob eine konkrete Erwähnung, Verlinkung oder Empfehlung auf dieser Website im Rahmen einer Kooperation erfolgt, schreiben Sie bitte an <a href="mailto:${site.email}">${site.email}</a>.</p>
          <p class="legal-note">Diese Hinweise gelten für den aktuellen Stand der Website und müssen aktualisiert werden, wenn weitere Partner, Affiliate-Modelle oder Werbeformate hinzukommen.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/werbung-partnerlinks/",
    title: "Partnerlinks & Werbung | Camp Dörfl",
    description: "Transparenz bei Camp Dörfl: Hinweise zu Partnerlinks, Rabattcodes, Kooperationen, Werbung, Markenempfehlungen und kommerziellen Inhalten.",
    keywords: ["Partnerlinks", "Werbung", "Kooperationen", "Camp Dörfl"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function accessibilityPage() {
  const content = `
    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Rechtliches",
          title: "Barrierefreiheit",
          text: "Diese Hinweise beschreiben den aktuellen Stand der Barrierefreiheit auf ${site.domain}. Stand: 17. Juni 2026.",
          headingLevel: 1
        })}
        <div class="legal-grid legal-grid--intro">
          <article class="legal-card" data-reveal>
            <h2>Aktueller Stand</h2>
            <ul class="legal-list">
              <li>Die Website ist responsiv aufgebaut und für aktuelle Desktop- und Mobilgeräte ausgelegt.</li>
              <li>Es gibt eine Skip-Navigation zum Hauptinhalt und grundsätzlich per Tastatur erreichbare Navigations- und Aktionsflächen.</li>
              <li>Inhaltlich relevante Bilder werden mit Alternativtexten versehen; dekorative Bilder werden, soweit sinnvoll, ausgeblendet.</li>
              <li>Ein vollständiges formales WCAG- oder BITV-Audit wurde bislang nicht durchgeführt.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h2>Kontakt bei Barrieren</h2>
            <p>Wenn Sie auf Barrieren stoßen oder Inhalte in einer anderen Form benötigen, schreiben Sie bitte an <a href="mailto:${site.email}">${site.email}</a>.</p>
            <p>Hinweise helfen dabei, die Website vor und nach der Veröffentlichung gezielt weiter zu verbessern.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h2>1. Bereits umgesetzte Maßnahmen</h2>
          <p>Die Website verwendet eine klare Seitenstruktur mit Hauptnavigation, Hauptinhalt und Footer. Wichtige Interaktionselemente wie Navigation, Kontaktbereich und Consent-Dialog sind grundsätzlich ohne Maus bedienbar.</p>
          <p>Kontraste, Skalierung und Layout wurden für aktuelle Standardansichten auf Mobilgeräten und Desktop-Bildschirmen ausgelegt.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>2. Externe Inhalte</h2>
          <p>Eingebettete YouTube-Inhalte stammen von einem Drittanbieter. Für deren technische und inhaltliche Barrierefreiheit ist auch der jeweilige Anbieter verantwortlich.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>3. Bekannte Grenzen</h2>
          <p>Die Website arbeitet bewusst mit großen Bildern, Bühnenmotiven und visuell starken Layouts. In Einzelfällen kann das für Nutzerinnen und Nutzer mit speziellen Anforderungen weniger komfortabel sein als ein rein funktionaler Aufbau.</p>
          <p>Auch bei automatisch nach Einwilligung geladenen Videos können zusätzliche Bedienhürden entstehen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>4. Laufende Verbesserung</h2>
          <p>Barrierefreiheit wird als laufende Aufgabe verstanden. Bei technischen oder inhaltlichen Änderungen sollten Navigation, Lesbarkeit, Kontraste und Alternativtexte jeweils mitgeprüft werden.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>5. Orientierung auf der Website</h2>
          <p>Die wichtigsten Bereiche sind über die Hauptnavigation, den Footer und interne Verlinkungen erreichbar. Dazu gehören Personal Training, Firmenfitness, Events, Partner, Kontakt sowie die rechtlichen Informationsseiten.</p>
          <p>Überschriften, Buttons und Formulare werden so aufgebaut, dass Nutzerinnen und Nutzer den jeweiligen Zweck möglichst schnell erfassen können.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>6. Bilder und Medien</h2>
          <p>Inhaltlich relevante Bilder erhalten beschreibende Alternativtexte. Bei Video-Inhalten wird vor dem Laden externer Medien eine Freigabe abgefragt, damit Nutzerinnen und Nutzer die Entscheidung bewusst treffen können.</p>
          <p>Wenn ein Inhalt nicht gut zugänglich ist, kann über die Kontaktadresse eine alternative Beschreibung oder ein direkter Hinweis angefordert werden.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/barrierefreiheit/",
    title: "Barrierefreiheit | Camp Dörfl Nürnberg",
    description:
      "Barrierefreiheit bei Camp Dörfl: Hinweise zur barrierearmen Nutzung der Website campdoerfl.de, zu umgesetzten Maßnahmen, bekannten Grenzen und Feedback.",
    keywords: ["Barrierefreiheit", "Accessibility", "Camp Dörfl"],
    robots: "noindex,follow,max-image-preview:large",
    bodyClass: "page-premium page-legal",
    content
  });
}

function partnerPage() {
  const renderPartnerBrandCard = ({
    name,
    label,
    image,
    alt,
    text,
    meta,
    href,
    linkLabel,
    featured,
    videoEmbedUrl,
    videoWatchUrl,
    videoImage,
    videoAlt,
    videoHeadline,
    videoActionLabel,
    videoEyebrow,
    videoNote
  }) => {
    if (featured && videoEmbedUrl && videoWatchUrl && videoImage && videoAlt) {
      return `
        <article class="partner-brand-card partner-brand-card--featured-video">
          <div class="partner-brand-card__media">
            ${deferredVideoEmbed({
              embedUrl: videoEmbedUrl,
              watchUrl: videoWatchUrl,
              title: `${name} bei Camp Dörfl`,
              image: videoImage,
              alt: videoAlt,
              headline: videoHeadline || `${name} live erleben.`,
              actionLabel: videoActionLabel || "Video laden",
              eyebrow: videoEyebrow || "YouTube",
              short: true
            })}
          </div>
          <div class="partner-brand-card__body">
            <span>${label}</span>
            <img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
            <h3>${name}</h3>
            <p>${text}</p>
            ${videoNote ? `<p class="partner-brand-card__note">${videoNote}</p>` : ""}
            <div class="partner-brand-card__footer">
              ${meta ? `<span class="partner-brand-card__meta">${meta}</span>` : ""}
              ${
                href
                  ? `<a class="partner-brand-card__link" href="${href}" target="_blank" rel="sponsored noopener noreferrer">${linkLabel || "Mehr"}</a>`
                  : ""
              }
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="partner-brand-card ${image ? "partner-brand-card--logo" : "partner-brand-card--text"}">
        <span>${label}</span>
        ${
          image
            ? `<img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
               <h3>${name}</h3>`
            : `<h3 class="partner-brand-card__text-logo">${name}</h3>`
        }
        <p>${text}</p>
        ${
          meta || href
            ? `<div class="partner-brand-card__footer">
                 ${meta ? `<span class="partner-brand-card__meta">${meta}</span>` : ""}
                 ${
                   href
                     ? `<a class="partner-brand-card__link" href="${href}" target="_blank" rel="sponsored noopener noreferrer">${linkLabel || "Mehr"}</a>`
                     : ""
                 }
               </div>`
            : ""
        }
      </article>
    `;
  };

  const content = `
    <section class="ff-hero ff-hero--split ff-hero--partner">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Partner</p>
          <h1 class="ff-hero__title" data-reveal>Partner<wbr>schaften.<br>Mit Wirkung.<br><span>Und Haltung.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Camp Dörfl verbindet Performance, Bühne, Unternehmen und Community zu einer glaubwürdigen Markenwelt.
          </p>
          <p class="ff-hero__support" data-reveal>
            Für Marken, Produkte und Kooperationen, die nah an echten Menschen, echter Leistung und sauberer Umsetzung stattfinden sollen.
          </p>
          <div class="ff-hero__actions partner-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("kooperation")}"><span>Kooperation anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/events/"><span>Events ansehen</span><span aria-hidden="true">&rarr;</span></a>
            <div class="partner-hero__logos" aria-label="Aktuelle Partner">
              <a class="partner-hero__logo" href="https://www.xxlnutrition.com/" target="_blank" rel="sponsored noopener noreferrer" aria-label="XXL Nutrition öffnen">
                <img src="/assets/images/partner-xxl-nutrition-logo.png" alt=""${imageLoadingAttributes()}>
              </a>
              <a class="partner-hero__logo partner-hero__logo--aeke" href="https://eu.aeke.com/products/buy-aeke-k1?sca_ref=11019964.wKUJzkQCK3" target="_blank" rel="sponsored noopener noreferrer" aria-label="AEKE öffnen">
                <img src="/assets/images/partner-aeke-logo.png" alt=""${imageLoadingAttributes()}>
              </a>
            </div>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Partner Schwerpunkte">
            <div><dt>Live</dt><dd>Events & Bühne</dd></div>
            <div><dt>Digital</dt><dd>App & Content</dd></div>
            <div><dt>Community</dt><dd>Training & Netzwerk</dd></div>
          </dl>
        </div>
        <div class="ff-hero__showcase ff-hero__showcase--partner" data-reveal>
          <figure class="partner-hero__visual partner-hero__visual--portrait">
            <img src="/assets/images/partner-hero-dominik-gym.webp" alt="Dominik Dörfl im Fitnessstudio als Ansprechpartner für Partnerschaften"${imageLoadingAttributes({ eager: true })}>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide premium-sponsor-stage">
        <div class="premium-sponsor-stage__intro" data-reveal>
          ${sectionHeader({
            eyebrow: "Partner im Performance System",
            title: "Premium Partner im Camp",
            text:
              "XXL Nutrition, AEKE, Trueformance und Clever Fit Nürnberg-Süd ergänzen das Camp Dörfl Performance System mit starken Produkten, Trainingslösungen und gemeinsamer Performance-Ausrichtung."
          })}
        </div>
        <div class="premium-sponsor-stage__grid" aria-label="Premium Sponsoren">
          <a class="premium-sponsor-card premium-sponsor-card--xxl" href="https://www.xxlnutrition.com/de" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-xxl-nutrition-logo.png" alt=""${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <strong>XXL Nutrition</strong>
              <span>Sporternährung und Supplements für Leistung, Regeneration und klare Ziele.</span>
            </span>
            <span class="premium-sponsor-card__action">Zur Website <b aria-hidden="true">→</b></span>
          </a>
          <a class="premium-sponsor-card premium-sponsor-card--aeke" href="https://www.aeke.com" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-aeke-logo.png" alt=""${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <strong>AEKE</strong>
              <span>Smarte Trainingshardware für präzise Bewegung und messbare Entwicklung.</span>
            </span>
            <span class="premium-sponsor-card__action">Zur Website <b aria-hidden="true">→</b></span>
          </a>
          <a class="premium-sponsor-card premium-sponsor-card--trueformance" href="https://www.trueformance.de" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-trueformance-logo.png" alt=""${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <span class="premium-sponsor-card__tier">Gold Partner</span>
              <strong>Trueformance</strong>
              <span>Gold Partner von Camp Dörfl für gemeinsame Performance- und Markenprojekte.</span>
            </span>
            <span class="premium-sponsor-card__action">Zur Website <b aria-hidden="true">→</b></span>
          </a>
          <a class="premium-sponsor-card premium-sponsor-card--clever-fit" href="https://www.clever-fit.com/de/fitnessstudio/nuernberg-sued/" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-clever-fit-nuernberg-sued.jpg" alt=""${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <strong>Clever Fit Nürnberg-Süd</strong>
              <span>Kraft-, Ausdauer- und Functional Training mit Trainingsbetreuung in Nürnberg-Süd.</span>
            </span>
            <span class="premium-sponsor-card__action">Studio ansehen <b aria-hidden="true">→</b></span>
          </a>
        </div>
        <div class="basis-partner-stage" data-reveal>
          <div class="basis-partner-stage__intro">
            <p class="eyebrow">Basis Partner</p>
            <h3>Verbunden in Bewegung.</h3>
            <p>Partner für digitale Aktivitäten, Routen und gemeinsame sportliche Herausforderungen.</p>
          </div>
          <a class="basis-partner-card basis-partner-card--strava" href="https://strava.app.link/ajkmFixCe5b" target="_blank" rel="sponsored noopener noreferrer">
            <span class="basis-partner-card__logo"><img src="/assets/images/partner-strava.png" alt=""${imageLoadingAttributes()}></span>
            <span class="basis-partner-card__copy"><small>Basis Partner</small><strong>Strava</strong><span>Aktivitäten aufzeichnen, Routen entdecken und sportliche Fortschritte teilen.</span></span>
            <span class="basis-partner-card__action" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell section-shell--wide coaching-start-stage partner-value-stage">
        ${sectionHeader({
          eyebrow: "Warum Partner",
          title: "Wieso Camp Dörfl für Partnerschaften funktioniert.",
          text:
            "Kooperationen wirken hier nicht aufgesetzt, sondern eingebettet in Training, Bühne, Unternehmen und Alltag."
        })}
        ${featureGrid(partnerValueCards, "feature-grid--partner")}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell section-shell--partner-activation">
        <div class="partner-activation-layout">
          <div class="partner-activation-layout__content">
            ${sectionHeader({
              eyebrow: "Kooperationsfelder",
              title: "So kann Zusammen<wbr>arbeit konkret aussehen.",
              text:
                "Je nach Marke, Ziel und Format kann die Zusammenarbeit live, digital oder in einer Verbindung aus beidem aufgebaut werden."
            })}
            ${summaryRows(partnerActivationRows)}
          </div>
          <aside class="partner-activation-video" data-reveal aria-label="Instagram Video zur Zusammenarbeit mit AEKE">
            <iframe
              src="https://www.instagram.com/p/DbdIzA1Iz-k/embed/"
              title="Instagram Video: AEKE im Einsatz bei Camp Dörfl"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Was Marken vorab wissen wollen.",
          text:
            "Die wichtigsten Fragen zu Kooperationen, Markenfit und gemeinsamer Umsetzung."
        })}
        ${faq(partnerFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Partner",
      title: "Wenn Ihre Marke zu Camp Dörfl passen soll, lassen Sie uns sprechen.",
      text:
        "Kooperationen funktionieren dann am besten, wenn Produkt, Haltung und Zielgruppe wirklich zusammenpassen.",
      primary: { label: "Kooperation anfragen", href: contactHref("kooperation") },
      secondary: { label: "Events ansehen", href: "/events/" }
    })}
  `;

  return layout({
    path: "/partner/",
    title: "Partner & Kooperationen | Camp Dörfl",
    description:
      "Partner und Kooperationen bei Camp Dörfl: glaubwürdige Markenpräsenz zwischen Performance, Events, Community, App und Unternehmen.",
    keywords: ["Camp Dörfl Partner", "Kooperationen", "Sponsoring", "Markenpartnerschaft Nürnberg"],
    bodyClass: "page-premium page-partner",
    socialImage: "/assets/images/partners-hero-banner.svg",
    socialImageAlt: "Partner und Marken von Camp Dörfl",
    extraStructuredData: [faqSchema("/partner/", partnerFaq)],
    content
  });
}

function contactPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--contact">
      <img class="ff-hero__img" src="/assets/images/dominik-gym-grey.webp" alt="Dominik Dörfl im Studio als Ansprechpartner für Kontakt und Beratung"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Kontakt für Personal Training, Firmenfitness, Events und App</p>
          <h1 class="ff-hero__title" data-reveal>Klar.<br>Persönlich.<br><span>Direkt.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Ob Premium Personal Training, Firmenfitness, Events, App oder Kooperation: hier startet der direkte Kontakt für alle Anfragearten auf der Seite.
          </p>
          <p class="ff-hero__support" data-reveal>
            Trag einfach deine Kontaktdaten und dein Anliegen ein. Die Nachricht wird direkt an dominik@campdoerfl.de gesendet.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="#kontaktformular"><span>Formular öffnen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="${site.instagram}" target="_blank" rel="noopener noreferrer"><span>${socialButtonLabel(site.instagram, "Instagram")}</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Kontaktwege">
            <div><dt>Direkt</dt><dd>Ohne Umwege</dd></div>
            <div><dt>NBG</dt><dd>Nürnberg</dd></div>
            <div><dt>1 Step</dt><dd>Anfrage starten</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Kontakt & Beratung",
          title: "Klar, persönlich und direkt zur richtigen Anfrage.",
          text:
            "Der Kontakt soll ohne Umwege funktionieren: kurz beschreiben, worum es geht, Bereich auswählen und absenden."
        })}
        <div class="summary-rows summary-rows--compact">
          <article class="summary-row" data-reveal>
            <h3>Für Privatpersonen</h3>
            <p>Wenn es um Premium Personal Training, Training ohne Bindung, Ernährung oder App-Zugang geht, hilft eine kurze Beschreibung von Ziel, Ausgangslage und gewünschter Begleitung.</p>
            <p><a href="/personal-trainer-nürnberg/">Personal Trainer Nürnberg: Leistungen und Erfolge ansehen <span aria-hidden="true">→</span></a></p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Für Unternehmen</h3>
            <p>Bei Firmenfitness, Gesundheitstagen oder Performance Checks sind Unternehmensgröße, Standort, Zeitraum und gewünschtes Format die wichtigsten Eckdaten.</p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Für Events und Partner</h3>
            <p>Für Moderation, Kooperationen oder Markenanfragen reicht zunächst ein Überblick über Anlass, Termin, Zielgruppe und gewünschte Rolle von Camp Dörfl.</p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Für schnelle Einordnung</h3>
            <p>Je klarer die Anfrage formuliert ist, desto schneller lässt sich einschätzen, ob ein persönliches Gespräch, ein konkretes Angebot oder ein anderer nächster Schritt sinnvoll ist. So bleibt die Beratung direkt, persönlich und effizient.</p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Was danach passiert</h3>
            <p>Nach der Anfrage wird geprüft, welcher Bereich fachlich passt und welche Informationen noch fehlen. Danach folgt eine Rückmeldung mit einer klaren Empfehlung, ob ein Kennenlernen, ein Telefonat, ein Angebot oder eine kurze Rückfrage der beste nächste Schritt ist.</p>
            <p>So bleibt der Austausch verbindlich, nachvollziehbar und passend zu deinem Anliegen, egal ob es um Training, Unternehmen, Bühne, App oder Kooperation geht.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--tight" id="kontaktformular">
      <div class="section-shell section-shell--wide">
        <div class="contact-form-stage">
          ${sectionHeader({
            eyebrow: "Anfrage",
            title: "Schreib mir direkt.",
            text:
              "Trag deine Daten und deine Nachricht ein. Der Versand läuft direkt aus der Website an dominik@campdoerfl.de.",
            align: "center"
          })}
          <div class="contact-simple-wrap" data-reveal>
            ${contactForm()}
          </div>
        </div>
      </div>
    </section>
  `;

  return layout({
    path: "/kontakt/",
    title: "Kontakt & Beratung | Camp Dörfl Nürnberg",
    description:
      "Kontakt zu Camp Dörfl Nürnberg für Premium Personal Training, Firmenfitness, Events, App-Zugang, Beratung und Kooperationen.",
    keywords: ["Camp Dörfl Kontakt", "Dominik Dörfl Kontakt", "Beratung Camp Dörfl", "Anfrage Camp Dörfl"],
    bodyClass: "page-premium page-contact",
    pageType: "ContactPage",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/dominik-gym-grey-social.jpg",
    socialImageAlt: "Dominik Dörfl als Ansprechpartner für Kontakt und Beratung",
    content
  });
}

function personalTrainingCostPage() {
  const priceCards = [
    {
      number: "01",
      tag: "Ohne Kartenbindung",
      title: "Einzelsession",
      price: "120 € / 150 €<small>inkl. 2D-Körperanalyse</small>",
      sessionPrice: "120 € oder 150 €",
      fit: "Technik-Check, Trainingsimpuls oder Standortbestimmung",
      text:
        "Für einen gezielten Trainingsimpuls, Technik-Feedback oder eine persönliche Standortbestimmung ohne Kartenbindung.",
      items: ["120 € ohne 2D-Körperanalyse", "150 € inklusive 2D-Körperanalyse"],
      cta: "Einzelsession anfragen"
    },
    {
      number: "02",
      tag: "Kontinuität",
      title: "5er-Karte",
      price: "500 €",
      sessionPrice: "100 € pro Session",
      fit: "Strukturierter Einstieg über mehrere aufbauende Termine",
      text:
        "Für mehrere aufeinander aufbauende Termine und mehr Verbindlichkeit über einen überschaubaren Zeitraum.",
      items: ["5 persönliche Sessions", "Entspricht 100 € pro Session"],
      cta: "5er-Karte anfragen"
    },
    {
      number: "03",
      tag: "Bester Kartenwert",
      title: "10er-Karte",
      price: "800 €",
      sessionPrice: "80 € pro Session",
      fit: "Regelmäßige 1:1 Trainingssteuerung mit bestem Kartenpreis",
      text:
        "Für regelmäßige persönliche Trainingssteuerung und eine längerfristige, verlässliche Zusammenarbeit.",
      items: ["10 persönliche Sessions", "Entspricht 80 € pro Session"],
      featured: true,
      cta: "10er-Karte anfragen"
    },
    {
      number: "04",
      tag: "Laufende Führung",
      title: "Premium Begleitung",
      price: "ab 200 €<small>monatlich</small>",
      sessionPrice: "ab 200 € monatlich",
      fit: "Training, Ernährung, Analyse, App und laufende Anpassung",
      text:
        "Für ein abgestimmtes System aus Training, Ernährung, Analyse, App und laufender Anpassung.",
      items: ["Persönliche laufende Begleitung", "Umfang passend zu Ziel und Alltag"],
      cta: "Premium Begleitung anfragen"
    }
  ];

  const costFactorCards = [
    {
      detail: "Betreuungstiefe",
      title: "Einzelstunde oder laufende Führung",
      text:
        "Eine einzelne Session hat eine andere Aufgabe als ein Setup mit regelmäßiger Anpassung, App-Struktur und persönlicher Begleitung über mehrere Wochen."
    },
    {
      detail: "Analyse",
      title: "Status vor Start",
      text:
        "Wenn Analyse, InBody, 2D-Technik oder eine saubere Trainings- und Ernährungsplanung dazugehören sollen, steigt auch die Tiefe der Betreuung."
    },
    {
      detail: "Frequenz",
      title: "Wie oft du Unterstützung brauchst",
      text:
        "Ob punktuelle Kontrolle, ein klarer Wochenrhythmus oder eine engere Führung bei hohem Anspruch: Der sinnvolle Rahmen hängt stark von deinem Kalender ab."
    },
    {
      detail: "Zielbild",
      title: "Alltag, Leistung oder Transformation",
      text:
        "Je nachdem, ob du mehr Energie, klare Routinen, sichtbare Veränderung oder sportliche Leistung willst, verändert sich auch das passende Format."
    }
  ];

  const pricingSteps = [
    "Ziel, Alltag und Ausgangslage ehrlich einordnen.",
    "Entscheiden, wie viel persönliche Führung wirklich nötig ist.",
    "Klären, ob Training allein reicht oder Analyse, Ernährung und App dazugehören sollen.",
    "Das Setup wählen, das Fortschritt möglich macht und nicht nur gut klingt."
  ];

  const pricingFaq = [
    {
      question: "Wie teuer ist ein Personal Trainer in Nürnberg?",
      answer:
        "Bei Camp Dörfl kostet eine einzelne Personal-Training-Session 120 Euro; inklusive 2D-Körperanalyse sind es 150 Euro. Mit der 5er-Karte liegt eine Session bei 100 Euro, mit der 10er-Karte bei 80 Euro. Die Premium Begleitung startet ab 200 Euro monatlich."
    },
    {
      question: "Was kostet Personal Training pro Stunde?",
      answer:
        "Eine Einzelsession kostet 120 Euro ohne oder 150 Euro inklusive 2D-Körperanalyse. Bei einer 5er-Karte reduziert sich der Preis auf 100 Euro pro Session, bei einer 10er-Karte auf 80 Euro pro Session."
    },
    {
      question: "Lohnt sich Personal Training?",
      answer:
        "Personal Training lohnt sich besonders, wenn du Fehler und Umwege vermeiden, Übungen sicher ausführen und dein Training konsequent an Ziel, Alltag und Ausgangslage anpassen möchtest. Entscheidend ist nicht nur die Stunde selbst, sondern wie gut du das Gelernte zwischen den Terminen umsetzen kannst."
    },
    {
      question: "Wie oft sollte man Personal Training buchen?",
      answer:
        "Das hängt von Erfahrung, Ziel und gewünschter Eigenständigkeit ab. Für einen Technik-Check kann ein Einzeltermin reichen. Für neue Routinen und kontinuierlichen Fortschritt sind mehrere aufeinander aufbauende Sessions oder eine laufende Begleitung meist sinnvoller."
    },
    {
      question: "Gibt es eine Probestunde ohne Kartenbindung?",
      answer:
        "Der flexible Einstieg ist eine einzelne Session ohne Kartenbindung. So kannst du einen konkreten Trainingsimpuls, Technik-Feedback oder eine persönliche Standortbestimmung buchen, bevor du dich für mehrere Termine entscheidest."
    },
    {
      question: "Wann lohnt sich die Premium Begleitung?",
      answer:
        "Vor allem dann, wenn du Training, Ernährung, Analyse, App und laufende Anpassung als zusammenhängendes System brauchst. Der konkrete Umfang wird passend zu Ziel, Alltag und gewünschter Betreuungstiefe vereinbart."
    }
  ];

  const pricingMarkup = priceCards
    .map(
      (card) => `
        <article class="pt-price-card${card.featured ? " pt-price-card--featured" : ""}" data-reveal>
          <div class="pt-price-card__top">
            <span class="pt-price-card__number">${card.number}</span>
            <span class="pt-price-card__tag">${card.tag}</span>
          </div>
          <h3>${card.title}</h3>
          <p class="pt-price-card__price">${card.price}</p>
          <p class="pt-price-card__fit">Ideal für: ${card.fit}</p>
          <p class="pt-price-card__text">${card.text}</p>
          <ul>${card.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          <a class="pt-price-card__link" href="${contactHref("premium-training")}">${card.cta}<span aria-hidden="true">&rarr;</span></a>
        </article>`
    )
    .join("");

  const offerCatalogSchema = {
    "@type": "OfferCatalog",
    "@id": `${site.url}/personal-training-kosten-nuernberg/#angebote`,
    name: "Personal Training Preise Nürnberg",
    itemListElement: [
      { name: "Einzelsession Personal Training", price: "120", description: "Einzelsession ohne 2D-Körperanalyse" },
      { name: "Einzelsession mit 2D-Körperanalyse", price: "150", description: "Einzelsession inklusive 2D-Körperanalyse" },
      { name: "5er-Karte Personal Training", price: "500", description: "Fünf persönliche Sessions" },
      { name: "10er-Karte Personal Training", price: "800", description: "Zehn persönliche Sessions" },
      { name: "Premium Begleitung", price: "200", description: "Laufende persönliche Begleitung ab 200 Euro monatlich" }
    ].map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: "EUR",
      description: offer.description,
      url: `${site.url}/personal-training-kosten-nuernberg/#preise`,
      itemOffered: { "@type": "Service", name: offer.name }
    }))
  };

  const content = `
    <section class="ff-hero ff-hero--coaching ff-hero--coaching-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/premium-training-hero-wide.webp" srcset="/assets/images/premium-training-hero-wide-960.webp 960w, /assets/images/premium-training-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl beim Personal Training mit einem Kunden im Studio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Personal Trainer Nürnberg · Preise transparent</p>
        <h1 class="ff-hero__title" data-reveal>Personal Training Kosten <br><span>in Nürnberg.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Einzelsession ab 120 Euro, 5er-Karte für 500 Euro oder 10er-Karte für 800 Euro. Hier siehst du auf einen Blick, welches Modell zu deinem Ziel und deinem Alltag passt.
        </p>
        <p class="ff-hero__support" data-reveal>
          Transparent vergleichen, passend entscheiden und direkt mit Dominik klären, welcher Einstieg wirklich sinnvoll ist.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("premium-training")}"><span>Preiseinschätzung anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/personal-trainer-nürnberg/"><span>Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Wichtige Preisfaktoren bei Personal Training in Nürnberg">
          <div><dt>ab 80 €</dt><dd>pro Session mit 10er-Karte</dd></div>
          <div><dt>120 €</dt><dd>Einzelsession</dd></div>
          <div><dt>150 €</dt><dd>inklusive 2D-Analyse</dd></div>
        </dl>
      </div>
    </section>

    <section class="section pt-pricing-section" id="preise">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Preise auf einen Blick",
          title: "Vier klare Wege. Kein Preisrätsel.",
          text:
            "Vom flexiblen Einzeltermin bis zur laufenden Betreuung: Du siehst sofort, was enthalten ist, für wen das Modell gedacht ist und welcher Preis pro Session entsteht.",
          align: "center"
        })}
        <div class="pt-price-grid">${pricingMarkup}</div>
        <div class="pt-price-assurance" data-reveal>
          <div><strong>Noch unsicher?</strong><span>Schreib kurz dein Ziel und deine Ausgangslage. Du bekommst eine ehrliche Empfehlung – auch wenn dafür zunächst nur eine Einzelsession sinnvoll ist.</span></div>
          <a class="button button--primary" href="${contactHref("premium-training")}"><span>Passendes Modell anfragen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <p class="pricing-overview__note">Der genaue Leistungsumfang der Premium Begleitung richtet sich nach dem individuell vereinbarten Betreuungsrahmen.</p>
      </div>
    </section>

    <section class="section section--tight pt-comparison-section" aria-labelledby="pt-comparison-title">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Direkter Vergleich",
          title: "Welches Personal-Training-Modell passt zu dir?",
          text: "Diese Übersicht hilft dir, nicht nur nach dem Preis, sondern nach dem gewünschten Ergebnis zu entscheiden."
        }).replace("<h2", '<h2 id="pt-comparison-title"')}
        <div class="pt-comparison" role="region" aria-label="Vergleich der Personal-Training-Preise" tabindex="0" data-reveal>
          <table>
            <thead><tr><th>Modell</th><th>Am besten für</th><th>Umfang</th><th>Preis</th><th>Je Session</th></tr></thead>
            <tbody>
              <tr><th>Einzelsession</th><td>Check, Technik, erster Impuls</td><td>1 Termin</td><td>120 € / 150 € inkl. 2D</td><td>120 € / 150 €</td></tr>
              <tr><th>5er-Karte</th><td>Strukturierter Einstieg</td><td>5 Sessions</td><td>500 €</td><td>100 €</td></tr>
              <tr class="is-recommended"><th>10er-Karte <span>Empfehlung</span></th><td>Regelmäßige 1:1 Führung</td><td>10 Sessions</td><td>800 €</td><td>80 €</td></tr>
              <tr><th>Premium Begleitung</th><td>Ganzheitliche laufende Steuerung</td><td>Individuell</td><td>ab 200 € / Monat</td><td>nach Umfang</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section--tight pt-value-section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Preisfaktoren",
          title: "Wovon der Preis wirklich abhängt.",
          text:
            "Die sinnvollste Frage ist meist nicht nur, was eine Stunde kostet, sondern welches Format realen Fortschritt bei dir überhaupt möglich macht.",
          align: "center"
        })}
        ${featureGrid(costFactorCards, "feature-grid--coaching-flow")}
      </div>
    </section>

    <section class="pt-pricing-proof" aria-labelledby="pt-pricing-proof-title">
      <div class="section-shell section-shell--wide pt-pricing-proof__grid">
        <div class="pt-pricing-proof__copy" data-reveal>
          <p class="eyebrow">Was hinter dem Preis steht</p>
          <h2 id="pt-pricing-proof-title">Erfahrung, die du nicht erst nach der Buchung beurteilen musst.</h2>
          <p>Personal Training ist Vertrauenssache. Deshalb kannst du Erfahrung, dokumentierte Coaching-Erfolge und Kundenstimmen vor deiner Entscheidung nachvollziehen.</p>
          <div class="pt-pricing-proof__links">
            <a href="/erfolge-im-team/">Alle Coaching-Erfolge <span aria-hidden="true">&rarr;</span></a>
            <a href="/personal-trainer-nürnberg/">Personal Trainer Nürnberg <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
        <dl class="pt-pricing-proof__facts" data-reveal>
          <div><dt>10+</dt><dd>Jahre Coaching-Erfahrung</dd></div>
          <div><dt>13</dt><dd>Deutsche Meistertitel im betreuten Team</dd></div>
          <div><dt>${coachSuccessStats.placements}</dt><dd>dokumentierte Wettkampfplatzierungen</dd></div>
          <div><dt>5,0</dt><dd>Sterne aus 34 Google-Bewertungen</dd></div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="section-shell editorial-stage editorial-stage--reverse">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Einordnung",
            title: "In vier Schritten zur passenden Betreuung."
          })}
          ${processList(pricingSteps)}
          <div class="pt-setup-links">
            <a href="/koerperanalyse-nuernberg/">Körperanalyse Nürnberg ansehen <span aria-hidden="true">&rarr;</span></a>
            <a href="/personal-trainer-nürnberg/">Alle Leistungen im Personal Training <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-personal-coaching-client.webp" alt="Dominik Dörfl bei der persönlichen Trainingsbetreuung eines Kunden in Nürnberg"${imageLoadingAttributes()}>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Häufige Fragen zu Personal-Training-Kosten in Nürnberg.",
          text:
            "Gerade vor der ersten Anfrage sind diese Punkte meistens wichtiger als eine isolierte Zahl ohne Kontext."
        })}
        ${faq(pricingFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Personal Training Kosten Nürnberg",
      title: "Hol dir eine klare Preiseinschätzung.",
      text:
        "Wenn du kurz beschreibst, wie dein Alltag aussieht und welche Begleitung du suchst, lässt sich schnell einordnen, welches Setup zu dir passt.",
      primary: { label: "Preiseinschätzung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Premium Personal Training", href: "/personal-trainer-nürnberg/" }
    })}
  `;

  return layout({
    path: "/personal-training-kosten-nuernberg/",
    title: "Personal Trainer Nürnberg: Preise & Kosten | Camp Dörfl",
    description:
      "Personal Trainer Nürnberg: 10er-Karte 80 € je Session, Einzeltraining ab 120 € und Premium-Begleitung ab 200 € monatlich. Alle Modelle im Vergleich.",
    keywords: [
      "Personal Training Kosten Nürnberg",
      "Was kostet Personal Training in Nürnberg",
      "Personal Trainer Preise Nürnberg",
      "Premium Personal Training Nürnberg"
    ],
    bodyClass: "page-premium page-coaching page-guide-pricing",
    pageName: "Personal Training Kosten Nürnberg",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/premium-training-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl beim Personal Training mit einem Kunden in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/personal-training-kosten-nuernberg/",
        name: "Personal Training Kosten Nürnberg",
        serviceType: "Beratung zu Personal Training und Premium Coaching",
        description:
          "Einordnung zu Preisfaktoren, Formaten und sinnvollen Einstiegen für Personal Training in Nürnberg."
      }),
      offerCatalogSchema,
      faqSchema("/personal-training-kosten-nuernberg/", pricingFaq)
    ],
    content
  });
}

function gesundheitstagNuernbergPage() {
  const healthDayFitCards = [
    {
      detail: "Employer Branding",
      title: "Wenn Gesundheit sichtbar gemacht werden soll",
      text:
        "Ein Gesundheitstag funktioniert gut, wenn Unternehmen Gesundheitsbewusstsein nicht nur intern erwähnen, sondern real und hochwertig erlebbar machen wollen."
    },
    {
      detail: "Mitarbeiterbindung",
      title: "Wenn Beteiligung wichtiger ist als Pflichtprogramm",
      text:
        "Das Format wirkt besonders stark, wenn Mitarbeitende nicht nur zuhören, sondern ihre eigene Ausgangslage verstehen und konkrete Impulse mitnehmen."
    },
    {
      detail: "Praxis statt Vortrag",
      title: "Wenn Analyse und Beratung zusammengehören sollen",
      text:
        "Gesundheitstage werden relevanter, wenn Messung, Einordnung und Alltagsempfehlung ineinandergreifen statt lose nebeneinander zu stehen."
    },
    {
      detail: "Region Nürnberg",
      title: "Wenn ein lokales Format professionell wirken soll",
      text:
        "Gerade im Raum Nürnberg sind vor Ort gut organisierte Formate mit klarer Kommunikation oft der stärkste Einstieg in Firmenfitness."
    }
  ];

  const budgetRows = [
    {
      title: "Teilnehmerzahl",
      text:
        "Ob ein kompaktes Format für ein kleines Team oder ein größerer Gesundheitstag für viele Mitarbeitende geplant wird, verändert Personalbedarf, Ablauf und Zeitfenster."
    },
    {
      title: "Tiefe der Analyse",
      text:
        "Je nachdem, ob vor allem Aktivierung gewünscht ist oder 2D-Technik, InBody und individuelle Beratung dazugehören sollen, verändert sich der Aufwand deutlich."
    },
    {
      title: "Ort und Rahmen",
      text:
        "Raumsituation, Strom, Datenschutz, Bewegungsfläche und interne Kommunikation wirken sich darauf aus, wie effizient und hochwertig das Format umgesetzt werden kann."
    }
  ];

  const healthDayFaq = [
    {
      question: "Für welche Unternehmen ist ein Gesundheitstag in Nürnberg sinnvoll?",
      answer:
        "Für Unternehmen, die Gesundheit professionell sichtbar machen, Mitarbeitende aktiv einbinden und ein gut kommunizierbares internes Format schaffen wollen."
    },
    {
      question: "Wie viele Mitarbeitende können an einem Gesundheitstag teilnehmen?",
      answer:
        "Das hängt vom Zeitfenster und von der Tiefe der Analyse ab. Genau deshalb wird vorab geklärt, ob ein kompaktes oder größeres Setup sinnvoller ist."
    },
    {
      question: "Brauchen wir dafür viel interne Organisation?",
      answer:
        "Nicht zwingend. Wenn Ziele, Teilnehmerzahl und Rahmen sauber vorab geklärt sind, lässt sich das Format intern meist sehr klar und effizient aufsetzen."
    },
    {
      question: "Wie bekomme ich eine erste Einschätzung für Ablauf und Budget?",
      answer:
        "Am besten über eine kurze Anfrage mit Standort, Teamgröße, Zeitraum und gewünschter Zielrichtung. Dann lässt sich schnell einschätzen, welches Format zu Ihrem Unternehmen passt."
    }
  ];

  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--firmenfitness ff-hero--firmenfitness-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/firmenfitness-hero-wide.webp" srcset="/assets/images/firmenfitness-hero-wide-960.webp 960w, /assets/images/firmenfitness-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl im Gesundheitstag- und Firmenfitness-Kontext bei Analyse und Beratung"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Ratgeber · Gesundheitstag Nürnberg</p>
        <h1 class="ff-hero__title" data-reveal>Gesundheitstag <br><span>in Nürnberg.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Ein guter Gesundheitstag ist mehr als ein loses Firmen-Event: Er verbindet Analyse, persönliche Einordnung und konkrete Alltagsempfehlungen zu einem Format, das Mitarbeitende wirklich mitnimmt.
        </p>
        <p class="ff-hero__support" data-reveal>
          Camp Dörfl entwickelt Gesundheitstage und Firmenfitness in Nürnberg so, dass sie intern gut kommunizierbar, professionell umsetzbar und für Mitarbeitende direkt verständlich sind.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("firmenfitness")}"><span>Gesundheitstag anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/firmenfitness/"><span>Firmenfitness ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Wichtige Bausteine für Gesundheitstage in Nürnberg">
          <div><dt>2D</dt><dd>Analyse & Startpunkt</dd></div>
          <div><dt>InBody</dt><dd>Messbar erklärt</dd></div>
          <div><dt>Beratung</dt><dd>direkt im Alltag</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Einsatz",
          title: "Wann ein Gesundheitstag besonders sinnvoll ist.",
          text:
            "Die stärksten Formate entstehen dort, wo Gesundheit nicht abstrakt bleiben soll, sondern für Mitarbeitende und Unternehmen konkret werden muss.",
          align: "center"
        })}
        ${featureGrid(healthDayFitCards, "feature-grid--coaching-flow")}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Bausteine",
          title: "Was in einem guten Gesundheitstag steckt.",
          text:
            "Analyse, Einordnung und konkrete Empfehlungen bauen logisch aufeinander auf und machen das Format intern leichter vermittelbar."
        })}
        ${corporateModuleShowcase(corporateModuleCards)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Planung",
            title: "So läuft die Vorbereitung ab."
          })}
          ${processList(corporateSteps)}
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-coaching-bikeerg.webp" alt="Dominik Dörfl bei einer Firmenfitness- und Gesundheitstag-Beratung"${imageLoadingAttributes()}>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Aufwand & Budget",
          title: "Wovon Umfang und Aufwand abhängen.",
          text:
            "Vor einer Preisfrage lohnt sich zuerst die saubere Einordnung von Teamgröße, Zielbild und gewünschter Tiefe des Formats."
        })}
        ${summaryRows(budgetRows)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Häufige Fragen zu Gesundheitstagen in Nürnberg.",
          text:
            "Diese Punkte sind für Unternehmen meist entscheidend, bevor aus einer Idee ein konkreter Termin wird."
        })}
        ${faq(healthDayFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Gesundheitstag Nürnberg",
      title: "Lassen Sie Ihren Gesundheitstag sauber einordnen.",
      text:
        "Mit ein paar Eckdaten zu Standort, Teamgröße und gewünschter Wirkung lässt sich schnell einschätzen, welches Format für Ihr Unternehmen sinnvoll ist.",
      primary: { label: "Gesundheitstag anfragen", href: contactHref("firmenfitness") },
      secondary: { label: "Firmenfitness Nürnberg", href: "/firmenfitness/" }
    })}
  `;

  return layout({
    path: "/gesundheitstag-nuernberg/",
    title: "Gesundheitstag in Nürnberg für Unternehmen | Camp Dörfl",
    description:
      "Gesundheitstag in Nürnberg für Unternehmen: Camp Dörfl zeigt, wie Analyse, Beratung, InBody und Firmenfitness zu einem professionellen Format zusammenkommen.",
    keywords: [
      "Gesundheitstag Nürnberg",
      "Gesundheitstag Unternehmen Nürnberg",
      "Firmenfitness Nürnberg",
      "Betriebliche Gesundheit Nürnberg"
    ],
    bodyClass: "page-premium page-firmenfitness page-guide-corporate",
    socialImage: "/assets/images/firmenfitness-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl bei Analyse und Beratung für einen Gesundheitstag in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/gesundheitstag-nuernberg/",
        name: "Gesundheitstag in Nürnberg",
        serviceType: "Gesundheitstage und Firmenfitness für Unternehmen",
        description:
          "Planung und Umsetzung von Gesundheitstagen mit Analyse, InBody und individueller Beratung für Unternehmen in Nürnberg."
      }),
      faqSchema("/gesundheitstag-nuernberg/", healthDayFaq)
    ],
    content
  });
}

function koerperanalyseNuernbergPage() {
  const analysisBenefits = [
    {
      detail: "Ausgangslage",
      title: "Verstehen, wo du wirklich stehst",
      text:
        "Die Messung schafft eine belastbare Standortbestimmung. So werden Veränderungen nicht nur am Gewicht, sondern differenzierter und nachvollziehbarer eingeordnet."
    },
    {
      detail: "Körperzusammensetzung",
      title: "Muskelmasse und Körperfett einordnen",
      text:
        "Die InBody BIA-Messung liefert Werte zur Körperzusammensetzung, die anschließend persönlich und verständlich mit Blick auf dein Ziel besprochen werden."
    },
    {
      detail: "Entwicklung",
      title: "Fortschritt sichtbar machen",
      text:
        "Die 2D-Körperanalyse ergänzt die Zahlen um eine visuelle Perspektive. Wiederholte Messungen zeigen, wie sich Form und Proportionen entwickeln."
    },
    {
      detail: "Nächster Schritt",
      title: "Aus Daten klare Prioritäten ableiten",
      text:
        "Du gehst nicht mit einem unkommentierten Ausdruck nach Hause, sondern mit einer verständlichen Einordnung und konkreten Ansatzpunkten für Training, Ernährung und Alltag."
    }
  ];

  const analysisSteps = [
    {
      step: "01",
      title: "Ziel und Ausgangslage klären",
      text:
        "Vor der Messung besprechen wir kurz, was du verändern möchtest und welche Fragen die Körperanalyse für dich beantworten soll."
    },
    {
      step: "02",
      title: "2D-Analyse und InBody BIA-Messung",
      text:
        "Die beiden Verfahren ergänzen sich: Die 2D-Analyse macht körperliche Entwicklung sichtbar, InBody betrachtet die Körperzusammensetzung."
    },
    {
      step: "03",
      title: "Ergebnisse persönlich einordnen",
      text:
        "Wir besprechen die relevanten Werte verständlich und setzen sie in Beziehung zu deinem Ziel, deinem Training und deinem Alltag."
    },
    {
      step: "04",
      title: "Konkreten Ansatz festlegen",
      text:
        "Du erhältst klare nächste Schritte. Auf Wunsch wird die Analyse zum Startpunkt für Personal Training oder eine längerfristige Begleitung."
    }
  ];

  const measurementRows = [
    {
      title: "2D-Körperanalyse",
      text:
        "Sie dokumentiert die körperliche Ausgangslage visuell und macht Veränderungen von Form und Proportionen bei Folgemessungen besser vergleichbar."
    },
    {
      title: "InBody BIA-Messung",
      text:
        "Die Bioelektrische Impedanzanalyse – kurz BIA – dient zur Einordnung der Körperzusammensetzung, etwa von Muskelmasse, Körperfettanteil und Körperwasser."
    },
    {
      title: "Persönliche Auswertung",
      text:
        "Erst die fachliche Einordnung macht aus Messwerten eine sinnvolle Entscheidungsgrundlage. Deshalb werden Ergebnisse verständlich erklärt und nicht isoliert bewertet."
    }
  ];

  const analysisFaq = [
    {
      question: "Was ist eine InBody BIA-Messung?",
      answer:
        "BIA steht für Bioelektrische Impedanzanalyse. InBody nutzt dieses Messprinzip, um die Körperzusammensetzung zu erfassen und Werte wie Muskelmasse, Körperfettanteil und Körperwasser einzuordnen."
    },
    {
      question: "Was ist der Unterschied zwischen 2D-Körperanalyse und InBody?",
      answer:
        "Die 2D-Körperanalyse dokumentiert Form und sichtbare körperliche Entwicklung. Die InBody BIA-Messung betrachtet die Körperzusammensetzung. Zusammen entsteht ein umfassenderer Blick auf die Ausgangslage."
    },
    {
      question: "Kann ich die Körperanalyse auch ohne Personal Training buchen?",
      answer:
        "Ja. Die Körperanalyse in Nürnberg wird auch für Privatpersonen als eigener Einstieg angeboten. Auf Wunsch kann daraus anschließend Personal Training oder eine längerfristige Begleitung entstehen."
    },
    {
      question: "Für wen ist eine Körperanalyse sinnvoll?",
      answer:
        "Für Menschen, die Fett reduzieren, Muskulatur aufbauen, ihre körperliche Entwicklung objektiver verfolgen oder vor dem Start in Training und Ernährungsumstellung eine klare Ausgangslage schaffen möchten."
    },
    {
      question: "Wie bereite ich mich auf eine BIA-Messung vor?",
      answer:
        "Für gut vergleichbare Werte solltest du Messungen möglichst unter ähnlichen Bedingungen durchführen. Konkrete Hinweise zu Essen, Trinken, Training und Tageszeit erhältst du vor deinem Termin."
    },
    {
      question: "Ersetzt die Körperanalyse eine medizinische Untersuchung?",
      answer:
        "Nein. Die Messung dient der Fitness- und Fortschrittseinordnung und ersetzt keine ärztliche Diagnose oder medizinische Untersuchung."
    }
  ];

  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--firmenfitness ff-hero--firmenfitness-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/firmenfitness-hero-wide.webp" srcset="/assets/images/firmenfitness-hero-wide-960.webp 960w, /assets/images/firmenfitness-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl bei einer Körperanalyse und persönlichen Auswertung in Nürnberg"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>2D-Körperanalyse · InBody · BIA-Messung</p>
        <h1 class="ff-hero__title" data-reveal>Körperanalyse <br><span>in Nürnberg.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Verstehe deine Ausgangslage mit 2D-Körperanalyse und InBody BIA-Messung – persönlich ausgewertet und mit klaren Ansatzpunkten für Training, Ernährung und deinen Alltag.
        </p>
        <p class="ff-hero__support" data-reveal>
          Die Analyse ist auch unabhängig von Firmenfitness für Privatpersonen buchbar und eignet sich als Standortbestimmung oder messbarer Startpunkt für deine Veränderung.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("koerperanalyse")}"><span>Körperanalyse anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/personal-trainer-nürnberg/"><span>Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Bestandteile der Körperanalyse in Nürnberg">
          <div><dt>2D</dt><dd>Form sichtbar machen</dd></div>
          <div><dt>InBody</dt><dd>BIA-Messung</dd></div>
          <div><dt>1:1</dt><dd>persönliche Auswertung</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Dein Startpunkt",
          title: "Mehr Klarheit als eine Zahl auf der Waage.",
          text:
            "Körpergewicht allein zeigt nicht, wie sich Muskelmasse, Körperfett und körperliche Form entwickeln. Die kombinierte Analyse macht deine Ausgangslage differenzierter sichtbar.",
          align: "center"
        })}
        ${featureGrid(analysisBenefits, "feature-grid--coaching-flow")}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Zwei Perspektiven",
            title: "2D-Analyse und BIA sinnvoll kombiniert.",
            text:
              "Beide Verfahren beantworten unterschiedliche Fragen. Zusammen liefern sie eine verständliche Grundlage, um Fortschritt gezielter zu planen und später besser zu vergleichen."
          })}
          ${summaryRows(measurementRows)}
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-coaching-bikeerg.webp" alt="Persönliche Auswertung einer InBody BIA-Messung bei Camp Dörfl in Nürnberg"${imageLoadingAttributes()}>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Ablauf",
          title: "So läuft deine Körperanalyse ab.",
          text:
            "Von der ersten Frage bis zum nächsten sinnvollen Schritt bleibt die Messung persönlich, verständlich und auf dein Ziel ausgerichtet."
        })}
        <div class="analysis-sequence" aria-label="Ablauf der Körperanalyse in vier Schritten">
          ${stepGrid(analysisSteps)}
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell editorial-stage editorial-stage--reverse">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Für Privatpersonen",
            title: "Messung einzeln oder als Start ins Training.",
            text:
              "Du kannst die Körperanalyse als eigenständigen Termin nutzen. Wenn du danach weiterarbeiten möchtest, werden die Ergebnisse auf Wunsch zur Grundlage für Personal Training, Ernährungsstruktur und Fortschrittskontrolle."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Eigenständige Standortbestimmung</h3>
              <p>Ideal, wenn du deinen aktuellen Stand kennen und die wichtigsten Werte professionell einordnen lassen möchtest.</p>
            </article>
            <article class="summary-row">
              <h3>Messbarer Coaching-Start</h3>
              <p>Ideal, wenn Training und Ernährung von Anfang an auf einer klar dokumentierten Ausgangslage aufbauen sollen.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/rQ9YocgKVSc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=rQ9YocgKVSc",
            title: "Camp Dörfl Körperanalyse und Beratung",
            image: "/assets/images/dominik-athlete-nutrition.webp",
            alt: "Dominik Dörfl im Ernährungs- und Gesundheitskontext",
            headline: "Körperanalyse. Klar eingeordnet.",
            actionLabel: "Video laden",
            short: true
          })}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Häufige Fragen zur Körperanalyse in Nürnberg.",
          text:
            "Das Wichtigste zu InBody, BIA-Messung, 2D-Analyse, Vorbereitung und Buchung für Privatpersonen."
        })}
        ${faq(analysisFaq)}
        <p class="expert-policy-link" data-reveal><a href="/bia-inbody-koerperanalyse-vergleich/">Fachleitfaden: BIA, InBody und 2D-Körperanalyse vergleichen →</a></p>
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Körperanalyse Nürnberg",
      title: "Mach deinen Fortschritt messbar.",
      text:
        "Starte mit einer klaren Standortbestimmung aus 2D-Körperanalyse, InBody BIA-Messung und persönlicher Auswertung.",
      primary: { label: "Körperanalyse anfragen", href: contactHref("koerperanalyse") },
      secondary: { label: "Firmenfitness ansehen", href: "/firmenfitness/" }
    })}
  `;

  return layout({
    path: "/koerperanalyse-nuernberg/",
    title: "Körperanalyse Nürnberg | InBody & BIA-Messung | Camp Dörfl",
    description:
      "Körperanalyse in Nürnberg für Privatpersonen: 2D-Körperanalyse, InBody BIA-Messung und persönliche Auswertung für Training, Ernährung und Fortschritt.",
    keywords: [
      "Körperanalyse Nürnberg",
      "BIA Messung Nürnberg",
      "InBody Nürnberg",
      "Körperfettmessung Nürnberg",
      "2D Körperanalyse Nürnberg",
      "Körperzusammensetzung messen Nürnberg"
    ],
    bodyClass: "page-premium page-firmenfitness page-guide-corporate page-body-analysis",
    socialImage: "/assets/images/firmenfitness-hero-wide-social.jpg",
    socialImageAlt: "Körperanalyse mit InBody BIA-Messung und persönlicher Auswertung in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/koerperanalyse-nuernberg/",
        name: "Körperanalyse Nürnberg – Camp Dörfl",
        serviceType: "2D-Körperanalyse und InBody BIA-Messung",
        description:
          "Körperanalyse für Privatpersonen in Nürnberg mit 2D-Analyse, InBody BIA-Messung und persönlicher Auswertung."
      }),
      faqSchema("/koerperanalyse-nuernberg/", analysisFaq),
      videoObjectSchema({
        path: "/koerperanalyse-nuernberg/",
        id: "koerperanalyse-video",
        name: "Camp Dörfl Körperanalyse und Beratung",
        description:
          "Kurzer Videoeinblick in die persönliche Einordnung von Körperanalyse, Ernährung und Gesundheit bei Camp Dörfl.",
        thumbnailUrl: "/assets/images/dominik-athlete-nutrition-social.jpg",
        uploadDate: "2026-06-16T13:32:09-07:00",
        embedUrl: "https://www.youtube-nocookie.com/embed/rQ9YocgKVSc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=rQ9YocgKVSc"
      })
    ],
    content
  });
}

function bodybuildingCompetitionCard(event) {
  return `
    <article class="bbcal-event${event.past ? " bbcal-event--past" : ""}" data-bodybuilding-event>
      <time class="bbcal-event__date" datetime="${event.date}">${event.label}</time>
      <div class="bbcal-event__body">
        <span class="bbcal-event__type">${event.type}</span>
        <h3>${event.name}</h3>
        <p><span aria-hidden="true">⌖</span>${event.location}</p>
      </div>
      <div class="bbcal-event__meta">
        <span class="bbcal-weeks-out" data-weeks-out data-event-date="${event.date}" aria-label="Vorbereitungszeit wird berechnet"><strong>–</strong><small>Weeks out</small></span>
        <span class="bbcal-event__status">${event.past ? "Ausgetragen" : "Bestätigt"}</span>
      </div>
    </article>
  `;
}

function appTrafficPromo({ eyebrow, text, ref }) {
  return `
    <section class="section app-traffic-promo" id="camp-doerfl-app" aria-label="Camp Dörfl App">
      <div class="section-shell section-shell--wide">
        <article class="app-traffic-promo__card" data-reveal>
          <figure class="app-traffic-promo__media">
            <img src="/assets/images/home-app-banner-coaching.webp" srcset="/assets/images/home-app-banner-coaching-480.webp 480w, /assets/images/home-app-banner-coaching-768.webp 768w, /assets/images/home-app-banner-coaching.webp 1200w" sizes="(max-width: 760px) 92vw, 48vw" alt="Dominik Dörfl zeigt auf seinem Smartphone die Camp Dörfl App im Training"${imageLoadingAttributes()}>
            <figcaption><span>Camp Dörfl App</span><strong>Training. Ernährung. Fortschritt.</strong></figcaption>
          </figure>
          <div class="app-traffic-promo__content">
            <p class="eyebrow">${eyebrow}</p>
            <h2>Plane dein Training.<br><span>Mit der Camp Dörfl App.</span></h2>
            <p>${text}</p>
            <ul aria-label="Funktionen der Camp Dörfl App">
              <li><span aria-hidden="true">01</span><strong>Individueller Trainingsplan</strong></li>
              <li><span aria-hidden="true">02</span><strong>Ernährung im Blick</strong></li>
              <li><span aria-hidden="true">03</span><strong>Fortschritt &amp; Check-ins</strong></li>
            </ul>
            <a class="app-traffic-promo__action" href="/app/?ref=${ref}">
              <span><small>Jetzt 7 Tage kostenlos testen</small><strong>Camp Dörfl App entdecken</strong></span>
              <b aria-hidden="true">→</b>
            </a>
          </div>
        </article>
      </div>
    </section>
  `;
}

function bodybuildingCoachingPage() {
  const coachingFaq = [
    { question: "Ist das Bodybuilding Coaching auch für meinen ersten Wettkampf geeignet?", answer: "Ja. Gerade beim ersten Start schafft eine frühe Einordnung von Verband, Klasse, Ausgangsform und realistischem Zeitfenster Sicherheit. Training, Ernährung, Check-ins, Posing und Peak Week werden zu einem nachvollziehbaren Gesamtplan." },
    { question: "Kann ich zu Dominik wechseln, obwohl meine Vorbereitung bereits läuft?", answer: "Ja, sofern noch Kapazität besteht und ein Wechsel fachlich sinnvoll ist. Im ersten Check werden aktueller Plan, Form, Zeit bis zur Show, bisheriger Verlauf und offene Probleme ehrlich bewertet." },
    { question: "Funktioniert die Wettkampfvorbereitung komplett online?", answer: "Ja. Das Online Coaching ist deutschlandweit und international möglich. Fortschrittsbilder, Trainingsdaten, Körperwerte, Ernährungsumsetzung und regelmäßige Check-ins bilden die Grundlage für laufende Anpassungen." },
    { question: "Wo findet das Bodybuilding Coaching vor Ort statt?", answer: "Die persönliche Betreuung findet in Nürnberg statt. Formchecks, Training, Posing und Körperanalyse können vor Ort mit der digitalen Begleitung verbunden werden." },
    { question: "Wie früh sollte eine Wettkampfvorbereitung beginnen?", answer: "Das hängt von Ausgangsform, Muskelmasse, Klasse, Wettkampferfahrung und Show-Termin ab. Eine gute Vorbereitung beginnt dann, wenn das Ziel mit vertretbarem Tempo und genügend Reserven erreichbar ist." },
    { question: "Ist das Coaching nur für Profi-Athleten?", answer: "Nein. Entscheidend sind Ernsthaftigkeit, Verlässlichkeit und die Bereitschaft, Feedback umzusetzen. Dominik begleitet ambitionierte Newcomer ebenso wie erfahrene Athleten." }
  ];

  const content = `
    <section class="bbc-hero">
      <img class="bbc-hero__image" src="/assets/images/dominik-stage-suit.webp" alt="Bodybuilding Coach Dominik Dörfl in Wettkampfform auf der Bühne"${imageLoadingAttributes({ eager: true })}>
      <div class="bbc-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell section-shell--wide bbc-hero__inner">
        <div class="bbc-hero__copy">
          <p class="eyebrow" data-reveal>In Nürnberg &amp; online</p>
          <h1 data-reveal>Bodybuilding Coaching.<br><span>Wettkampfvorbereitung mit System.</span></h1>
          <p class="bbc-hero__lead" data-reveal>Für deinen ersten Start, dein nächstes Level oder einen sauberen Coach-Wechsel: Training, Ernährung, Formchecks, Posing und Peak Week werden zu einer Vorbereitung, in der jede Phase ein klares Ziel hat.</p>
          <div class="bbc-hero__actions" data-reveal><a class="button button--primary" href="#anfrage"><span>Coaching unverbindlich anfragen</span><span aria-hidden="true">→</span></a><a class="button button--secondary-light" href="#coaching"><span>Ablauf ansehen</span><span aria-hidden="true">↓</span></a></div>
          <p class="bbc-hero__micro" data-reveal>Persönliche Antwort von Dominik · begrenzte Athletenplätze</p>
        </div>
        <dl class="bbc-hero__proof" data-reveal><div><dt>IFBB</dt><dd>Pro Bodybuilding</dd></div><div><dt>2×</dt><dd>Deutscher Meister</dd></div><div><dt>Top</dt><dd>Coach von Olympia-Athleten &amp; Meistern</dd></div></dl>
      </div>
    </section>

    <section class="section bbc-audience"><div class="section-shell section-shell--wide">
      <div class="bbc-section-head" data-reveal><div><p class="eyebrow">Dein Ausgangspunkt</p><h2>Du musst noch nicht fertig sein.<br>Du musst bereit sein, <span>klar zu arbeiten.</span></h2></div><p>Eine gute Vorbereitung beginnt mit einer ehrlichen Standortbestimmung – nicht mit einem Standardplan oder dem Versprechen, dass jede Show die richtige ist.</p></div>
      <div class="bbc-audience__grid">
        <article data-reveal><span>01</span><small>Erster Wettkampf</small><h3>Du willst auf die Bühne – aber richtig.</h3><p>Du brauchst Klarheit bei Verband, Klasse, Zeitplan und den Details zwischen guter Studioform und echter Bühnenform.</p><ul><li>Ausgangsform realistisch einschätzen</li><li>Passende Klasse und Show auswählen</li><li>Vorbereitung ohne blindes Trial-and-Error</li></ul></article>
        <article data-reveal><span>02</span><small>Aktiver Athlet &amp; Coach-Wechsel</small><h3>Du trainierst bereits – aber dir fehlt die Führung.</h3><p>Pläne kommen zu spät, Anpassungen sind nicht nachvollziehbar oder du drehst dich trotz Disziplin im Kreis. Dann braucht es zuerst einen sauberen Audit.</p><ul><li>Bestehende Planung und Entwicklung prüfen</li><li>Probleme ohne Schuldzuweisung benennen</li><li>Mit Ruhe und Daten neu ausrichten</li></ul></article>
      </div>
    </div></section>

    <section class="section section--dark bbc-authority"><div class="section-shell section-shell--wide bbc-authority__grid">
      <figure data-reveal><img src="/assets/images/dominik-bodybuilding-desert.webp" alt="Dominik Dörfl als erfolgreicher Bodybuilder in Wettkampfform"${imageLoadingAttributes()}></figure>
      <div class="bbc-authority__copy" data-reveal><p class="eyebrow">Athlet. Coach. Nicht nur Theorie.</p><h2>Ich kenne die Vorbereitung<br><span>von beiden Seiten.</span></h2><p class="bbc-authority__lead">Ich war selbst Profi-Athlet auf europäischem Spitzenlevel, bin IFBB Pro und Deutscher Meister im Bodybuilding. Heute verbinde ich diese eigene Bühnenerfahrung mit der Verantwortung als Coach.</p>
        <div class="bbc-authority__facts"><article><strong>Eigene Erfolge</strong><p>IFBB Pro Bodybuilding und zweifacher Deutscher Meister in Bodybuilding und Powerlifting.</p></article><article><strong>Erfolge als Coach</strong><p>Begleitung von Olympia-Athleten, deutschen Meistern, Vize-Weltmeistern und internationalen Top-Platzierungen.</p></article><article><strong>Praxis in Nürnberg</strong><p>Persönliches Training, Formchecks und Analysen vor Ort – verbunden mit digitaler Steuerung.</p></article></div>
        <a class="bbc-text-link" href="/erfolge-im-team/"><span>Erfolge im Team ansehen</span><span aria-hidden="true">→</span></a>
      </div>
    </div></section>

    <section class="section bbc-system" id="coaching"><div class="section-shell section-shell--wide">
      <div class="bbc-section-head" data-reveal><div><p class="eyebrow">Wettkampfvorbereitung</p><h2>Eine Form ist kein Zufall.<br><span>Sie ist gesteuerte Entwicklung.</span></h2></div><p>Dein Plan wird anhand deiner Reaktion, Umsetzung und Entwicklung laufend gesteuert.</p></div>
      <ol class="bbc-system__steps"><li data-reveal><span>01</span><div><small>Analyse</small><h3>Ausgangslage &amp; Ziel</h3><p>Form, Historie, Alltag, Verband, Klasse und Show-Termin werden gemeinsam eingeordnet.</p></div></li><li data-reveal><span>02</span><div><small>Aufbau</small><h3>Training &amp; Ernährung</h3><p>Individuelle Planung für Leistung, Muskelerhalt, Regeneration und einen realistischen Diätverlauf.</p></div></li><li data-reveal><span>03</span><div><small>Steuerung</small><h3>Check-ins &amp; Anpassungen</h3><p>Bilder, Körperwerte, Performance, Schlaf, Hunger und Umsetzung ergeben das Gesamtbild.</p></div></li><li data-reveal><span>04</span><div><small>Bühne</small><h3>Posing, Peak Week &amp; Show Day</h3><p>Du wirst so vorbereitet, dass du deine Form auf der Bühne auch zeigen kannst.</p></div></li></ol>
    </div></section>

    <section class="section section--muted bbc-formats"><div class="section-shell section-shell--wide">
      <div class="bbc-section-head" data-reveal><div><p class="eyebrow">Zwei Wege. Ein Anspruch.</p><h2>Bodybuilding Coach in Nürnberg.<br><span>Oder vollständig online.</span></h2></div><p>Die Qualität der Steuerung bleibt gleich. Der Unterschied liegt in der persönlichen Arbeit vor Ort.</p></div>
      <div class="bbc-formats__grid"><article data-reveal><small>Vor Ort</small><h3>Coaching in Nürnberg</h3><p>Für Athleten aus Nürnberg, Fürth, Erlangen und der Region.</p><ul><li>Persönliche Formchecks</li><li>Training und Technikarbeit</li><li>Posing und Präsentation</li><li>Körperanalyse nach Bedarf</li></ul><a href="#anfrage">Vor-Ort-Coaching anfragen →</a></article><article data-reveal><small>Deutschlandweit &amp; international</small><h3>Online Bodybuilding Coaching</h3><p>Für Athleten, die ortsunabhängig und trotzdem eng geführt arbeiten wollen.</p><ul><li>Trainings- und Ernährungsplanung</li><li>Regelmäßige digitale Check-ins</li><li>Video-Feedback für Form und Posing</li><li>Anpassungen bis zum Wettkampf</li></ul><a href="#anfrage">Online Coaching anfragen →</a></article></div>
    </div></section>

    <section class="section bbc-flow"><div class="section-shell section-shell--wide">
      <div class="bbc-section-head" data-reveal><div><p class="eyebrow">Vom Ziel zur Show</p><h2>Erst den Rahmen klären.<br><span>Dann die Vorbereitung planen.</span></h2></div><p>Zwei Guides helfen dir, Show und Division einzuordnen. Im Coaching werden daraus Termin und Strategie.</p></div>
      <div class="bbc-flow__grid"><a href="/bodybuilding-wettkaempfe-2026/" data-reveal><span>01 · Termin finden</span><h3>Bodybuilding Wettkämpfe 2026</h3><p>Deutsche und internationale Shows der wichtigsten Verbände.</p><b>Wettkampfkalender öffnen →</b></a><a href="/bodybuilding-klassen-gewichtslimits/" data-reveal><span>02 · Klasse verstehen</span><h3>Bodybuilding Klassen &amp; Gewichtslimits</h3><p>Divisionen, Kriterien und Größen-Gewichts-Limits vergleichen.</p><b>Klassen-Guide öffnen →</b></a><a href="/bodybuilding-wettkampfvorbereitung-dauer/" data-reveal><span>03 · Timeline planen</span><h3>Wie lange dauert eine Contest Prep?</h3><p>Vorbereitungsdauer anhand von Ausgangslage und realistischer Abnahmerate planen.</p><b>Dauer einordnen →</b></a></div>
    </div></section>

    <section class="section section--dark bbc-fit"><div class="section-shell section-shell--wide bbc-fit__grid"><div data-reveal><p class="eyebrow">Passt das Coaching zu dir?</p><h2>Ambition ist wichtig.<br><span>Coachability entscheidet.</span></h2></div><div data-reveal><ul><li>Du willst deinen ersten Start fundiert vorbereiten.</li><li>Du bist aktiv und suchst klarere Betreuung.</li><li>Du kannst ehrlich kommunizieren und Feedback umsetzen.</li><li>Du willst Entscheidungen verstehen.</li><li>Du suchst professionelle Führung statt Abkürzungen.</li></ul><p>Ein kurzfristiger Crash-Plan ohne verbindliche Check-ins passt nicht zu dieser Zusammenarbeit.</p></div></div></section>

    <section class="section bbc-faq"><div class="section-shell">${sectionHeader({ eyebrow: "Häufige Fragen", title: "Was Athleten vor der Anfrage wissen wollen.", text: "Antworten zu Einstieg, Wechsel, Online Coaching und Vorbereitungsdauer." })}${faq(coachingFaq)}</div></section>

    <section class="section bbc-inquiry" id="anfrage"><div class="section-shell section-shell--wide bbc-inquiry__grid">
      <div class="bbc-inquiry__copy" data-reveal><p class="eyebrow">Coaching anfragen</p><h2>Erzähl mir, wo du stehst.<br><span>Ich sage dir ehrlich, ob ich helfen kann.</span></h2><p>Je konkreter deine Angaben, desto besser kann ich deine Ausgangslage einschätzen. Die Anfrage landet direkt bei mir.</p><div><strong>Nach deiner Anfrage</strong><ol><li><span>01</span>Ich prüfe Ziel, Status und Zeitrahmen.</li><li><span>02</span>Du bekommst eine persönliche Rückmeldung.</li><li><span>03</span>Wenn es passt, klären wir den Start.</li></ol></div></div>
      <form class="contact-form bbc-inquiry__form" data-contact-simple-form action="https://formsubmit.co/${site.email}" data-contact-endpoint="https://formsubmit.co/ajax/${site.email}" method="POST" data-reveal>
        <input class="contact-form__trap" type="text" name="_honey" tabindex="-1" autocomplete="off"><input type="hidden" name="_subject" value="Neue Anfrage: Bodybuilding Coaching"><input type="hidden" name="_template" value="table"><input type="hidden" name="topic" value="Bodybuilding Coaching & Wettkampfvorbereitung">
        <div class="bbc-form-grid"><label><span>Name *</span><input name="name" autocomplete="name" required></label><label><span>E-Mail *</span><input name="email" type="email" autocomplete="email" required></label><label><span>Telefon</span><input name="phone" autocomplete="tel"></label><label><span>Betreuung *</span><select name="format" required><option value="">Bitte auswählen</option><option>Vor Ort in Nürnberg</option><option>Online Coaching</option><option>Noch offen</option></select></label><label><span>Dein Status *</span><select name="athlete_status" required><option value="">Bitte auswählen</option><option>Erster Wettkampf geplant</option><option>Aktiver Wettkampfathlet</option><option>Coach-Wechsel</option><option>Aufbau ohne festen Wettkampf</option></select></label><label><span>Geplanter Wettkampf</span><input name="competition" placeholder="Show / Monat / noch offen"></label></div>
        <label class="bbc-inquiry__message"><span>Wo stehst du und was willst du erreichen? *</span><textarea name="message" rows="7" required placeholder="Erfahrung, aktuelle Form, Ziel und bisherige Vorbereitung."></textarea></label><p class="bbc-inquiry__privacy">Mit dem Absenden akzeptierst du die Verarbeitung zur Bearbeitung gemäß <a href="/datenschutz/">Datenschutz</a>.</p><button class="button button--primary" type="submit"><span>Coaching unverbindlich anfragen</span><span aria-hidden="true">→</span></button><p class="contact-form__status" data-contact-status aria-live="polite"></p>
      </form>
    </div></section>
  `;

  return layout({
    path: "/bodybuilding-coaching-wettkampfvorbereitung/",
    title: "Bodybuilding Coach Nürnberg & Online | Wettkampfvorbereitung",
    description: "Bodybuilding Coaching und Wettkampfvorbereitung mit IFBB Pro Dominik Dörfl: vor Ort in Nürnberg oder online. Für Newcomer, aktive Athleten und Coach-Wechsel.",
    keywords: ["Bodybuilding Coach Nürnberg", "Bodybuilding Coaching online", "Wettkampfvorbereitung Bodybuilding", "Contest Prep Coach", "Online Bodybuilding Coach"],
    bodyClass: "page-premium page-bodybuilding-coaching",
    pageName: "Bodybuilding Coaching und Wettkampfvorbereitung",
    pageType: "ServicePage",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/dominik-stage-suit-social.jpg",
    socialImageAlt: "Bodybuilding Coach Dominik Dörfl auf der Wettkampfbühne",
    extraStructuredData: [serviceSchema({ path: "/bodybuilding-coaching-wettkampfvorbereitung/", name: "Bodybuilding Coaching und Wettkampfvorbereitung", serviceType: "Bodybuilding Coaching, Contest Prep und Wettkampfvorbereitung", description: "Individuelle Wettkampfvorbereitung für Newcomer und erfahrene Athleten vor Ort in Nürnberg sowie online.", areaServed: [{ "@type": "City", name: "Nürnberg" }, { "@type": "Country", name: "Deutschland" }] }), faqSchema("/bodybuilding-coaching-wettkampfvorbereitung/", coachingFaq)],
    content
  });
}

function bodybuildingCalendarPage() {
  const allEvents = bodybuildingCalendarSources.flatMap((source) =>
    source.events.map((event) => ({ ...event, source }))
  );
  const upcomingEvents = allEvents
    .filter((event) => !event.past)
    .sort((a, b) => a.date.localeCompare(b.date));
  const pastEvents = allEvents.filter((event) => event.past);
  const nextEvents = upcomingEvents.slice(0, 4);
  const sourceLinkFor = (source) => `
        <a class="bbcal-source-link${source.scope === "international" ? " bbcal-source-link--international" : ""}" href="#${source.id}">
          <span>${source.number}</span>
          <strong>${source.name}</strong>
          <small>${source.events.filter((event) => !event.past).length} kommende Termine</small>
          <b aria-hidden="true">↓</b>
        </a>
      `;
  const nationalSourceNavigation = bodybuildingCalendarSources
    .filter((source) => source.scope !== "international")
    .map(sourceLinkFor)
    .join("");
  const internationalSourceNavigation = bodybuildingCalendarSources
    .filter((source) => source.scope === "international")
    .map(sourceLinkFor)
    .join("");
  const calendarSectionFor = (source) => {
      const upcoming = source.events.filter((event) => !event.past);
      const completed = source.events.filter((event) => event.past);
      const featuredUpcoming = source.scope === "international" ? upcoming.slice(0, 4) : upcoming;
      const additionalUpcoming = source.scope === "international" ? upcoming.slice(4) : [];

      return `
        <section class="bbcal-federation${source.scope === "international" ? " bbcal-federation--international" : ""}" id="${source.id}" data-reveal>
          <header class="bbcal-federation__header">
            <span class="bbcal-federation__number">${source.number}</span>
            <div>
              ${source.scope === "international" ? '<span class="bbcal-system-tag">International 2026</span>' : ""}
              <p class="eyebrow">${source.descriptor}</p>
              <h2>${source.name}</h2>
              <p>${source.note}</p>
            </div>
            <a href="${source.sourceUrl}" target="_blank" rel="noopener noreferrer">
              <span>Offizielle Quelle</span><span aria-hidden="true">↗</span>
            </a>
          </header>
          <div class="bbcal-event-list">
            ${featuredUpcoming.map(bodybuildingCompetitionCard).join("")}
          </div>
          ${
            additionalUpcoming.length
              ? `<details class="bbcal-more-events">
                  <summary><span>Alle ${upcoming.length} Termine</span><strong>Weitere ${additionalUpcoming.length} öffnen <b aria-hidden="true">↓</b></strong></summary>
                  <div class="bbcal-event-list bbcal-event-list--more">
                    ${additionalUpcoming.map(bodybuildingCompetitionCard).join("")}
                  </div>
                </details>`
              : ""
          }
          ${
            completed.length
              ? `<details class="bbcal-archive">
                  <summary><span>Bereits ausgetragen in 2026</span><strong>${completed.length} Termine</strong></summary>
                  <div class="bbcal-event-list bbcal-event-list--archive">
                    ${completed.map(bodybuildingCompetitionCard).join("")}
                  </div>
                </details>`
              : ""
          }
        </section>
      `;
    };
  const nationalCalendarSections = bodybuildingCalendarSources
    .filter((source) => source.scope !== "international")
    .map(calendarSectionFor)
    .join("");
  const internationalCalendarSections = bodybuildingCalendarSources
    .filter((source) => source.scope === "international")
    .map(calendarSectionFor)
    .join("");
  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${site.url}/bodybuilding-wettkaempfe-2026/#wettkampfkalender`,
    name: "Bodybuilding Wettkämpfe 2026 in Deutschland und international",
    numberOfItems: allEvents.length,
    itemListElement: allEvents
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SportsEvent",
          name: `${event.name} – ${event.source.name}`,
          startDate: event.date,
          ...(event.endDate ? { endDate: event.endDate } : {}),
          eventStatus: event.past
            ? "https://schema.org/EventCompleted"
            : "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: event.location
          },
          organizer: {
            "@type": "Organization",
            name: event.source.name,
            url: event.source.sourceUrl
          }
        }
      }))
  };

  const content = `
    <section class="bbcal-hero">
      <img class="bbcal-hero__image" src="/assets/images/dominik-bodybuilding-desert.webp" alt="Dominik Dörfl als Bodybuilder auf der Wettkampfbühne"${imageLoadingAttributes({ eager: true })}>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>Deutschland · IFBB Pro League · NPC Worldwide · IFBB</p>
          <h1 data-reveal>Bodybuilding<br>Wettkämpfe <span>2026.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Deutsche Verbandstermine, internationale Profi-Shows der IFBB Pro League, NPC Worldwide Pro Qualifier und offizielle IFBB-Meisterschaften – getrennt nach System und direkt mit den Originalquellen verknüpft.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#termine"><span>Alle Termine ansehen</span><span aria-hidden="true">↓</span></a>
            <span class="bbcal-hero__updated">International erweitert am 10. August 2026</span>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>${bodybuildingCalendarSources.length}</dt><dd>offizielle Kalender</dd></div>
          <div><dt>${upcomingEvents.length}</dt><dd>kommende Shows</dd></div>
          <div><dt>${pastEvents.length}</dt><dd>bereits ausgetragen</dd></div>
        </dl>
      </div>
    </section>

    <section class="section bbcal-intro" id="termine">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head" data-reveal>
          <div>
            <p class="eyebrow">Ein Kalender. Neun offizielle Quellen.</p>
            <h2>Die Bühne kennt<br><span>keine Grenzen.</span></h2>
          </div>
          <div class="bbcal-intro__copy">
            <p>Die Übersicht trennt nationale Verbände, IFBB Professional League, NPC Worldwide und IFBB International klar voneinander. So bleibt sichtbar, ob es um eine deutsche Meisterschaft, eine Profi-Show, einen Pro Qualifier oder einen internationalen IFBB-Wettkampf geht.</p>
            <p><strong>Wichtig:</strong> Terminänderungen, Klassen, Lizenzen, Qualifikationen und Anmeldeschlüsse immer zusätzlich beim jeweiligen Veranstalter prüfen.</p>
          </div>
        </div>
        <nav class="bbcal-source-navigation" aria-label="Direkt zu einem Kalender" data-reveal>
          <div class="bbcal-source-group">
            <p><span>01</span> Deutschland</p>
            <div class="bbcal-source-grid">${nationalSourceNavigation}</div>
          </div>
          <div class="bbcal-source-group bbcal-source-group--international">
            <p><span>02</span> Profi &amp; international</p>
            <div class="bbcal-source-grid bbcal-source-grid--international">${internationalSourceNavigation}</div>
          </div>
        </nav>
      </div>
    </section>

    <section class="section section--muted bbcal-next">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Als Nächstes</p>
          <h2>Die nächsten bestätigten Shows.</h2>
        </div>
        <div class="bbcal-next-grid">
          ${nextEvents
            .map(
              (event, index) => `
                <a href="#${event.source.id}" class="bbcal-next-card" data-reveal>
                  <span class="bbcal-next-card__index">0${index + 1}</span>
                  <span class="bbcal-weeks-out bbcal-weeks-out--next" data-weeks-out data-event-date="${event.date}" aria-label="Vorbereitungszeit wird berechnet"><strong>–</strong><small>Weeks out</small></span>
                  <time datetime="${event.date}">${event.label}</time>
                  <h3>${event.name}</h3>
                  <p>${event.source.name} · ${event.location}</p>
                  <span class="bbcal-next-card__arrow" aria-hidden="true">→</span>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section bbcal-directory">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Wettkampfkalender 2026</p>
          <h2>Deutsche Termine nach Verband.</h2>
          <p>Bestätigte Termine der sechs deutschen Verbandskalender und Ergebnisarchive.</p>
          <p class="bbcal-weeks-note"><span aria-hidden="true">↻</span><strong>Weeks Out aktualisiert sich täglich:</strong> So siehst du sofort, wie viel Vorbereitungszeit bis zur jeweiligen Show bleibt.</p>
        </div>
        <div class="bbcal-federations">
          ${nationalCalendarSections}
        </div>
        <div class="bbcal-section-heading bbcal-section-heading--international" data-reveal>
          <p class="eyebrow">Profi & international</p>
          <h2>IFBB Pro League, NPC Worldwide und IFBB International.</h2>
          <p>Die wichtigsten kommenden internationalen Termine, pro Veranstaltung einmal aufgeführt. Divisionen, Regionals und kurzfristige Änderungen stehen vollständig in den jeweils verlinkten offiziellen Live-Kalendern.</p>
        </div>
        <div class="bbcal-federations bbcal-federations--international">
          ${internationalCalendarSections}
        </div>
      </div>
    </section>

    <section class="section section--muted bbcal-method">
      <div class="section-shell bbcal-method__grid">
        <div data-reveal>
          <p class="eyebrow">Redaktioneller Stand</p>
          <h2>Unabhängig gesammelt.<br>Offiziell gegengeprüft.</h2>
        </div>
        <div class="bbcal-method__copy" data-reveal>
          <p>Die deutschen Termine wurden am <strong>1. August 2026</strong> geprüft. Die internationalen Kalender von IFBB Professional League, NPC Worldwide und IFBB wurden am <strong>10. August 2026</strong> ergänzt. Bereits ausgetragene deutsche Shows bleiben sichtbar, damit die Seite das komplette Wettkampfjahr abbildet.</p>
          <p>Camp Dörfl ist nicht Veranstalter dieser Wettkämpfe. Maßgeblich sind ausschließlich die Angaben des jeweiligen Verbandes. Fehlt ein Termin oder wurde etwas verschoben, genügt ein kurzer Hinweis.</p>
          <a class="button button--secondary-light" href="${contactHref()}"><span>Änderung melden</span><span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section class="section bbcal-search-guide">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Klassen und Systeme verstehen",
          title: "Frauenklassen, Natural Bodybuilding und Verbände im Überblick.",
          text:
            "Die Kalendertermine führen zu unterschiedlichen Regelwerken. Vor der Anmeldung lohnt sich deshalb ein genauer Blick auf Klasse, Startberechtigung, Qualifikation und Anti-Doping-Vorgaben."
        })}
        ${featureGrid(
          [
            {
              detail: "Frauenklassen",
              title: "Bikini, Wellness, Figure und Physique",
              text: "Nicht jede Klasse wird bei jedem Verband gleich benannt oder bewertet. Die jeweilige Ausschreibung entscheidet über Voraussetzungen und Einteilung."
            },
            {
              detail: "Natural Bodybuilding",
              title: "GNBF und Anti-Doping-Regelwerk",
              text: "Natural-Wettkämpfe arbeiten mit eigenen Teilnahme- und Kontrollvorgaben. Fristen und Nachweise müssen direkt beim Verband geprüft werden."
            },
            {
              detail: "IFBB Pro · NPC Worldwide · IFBB",
              title: "Drei internationale Systeme, klar getrennt",
              text: "Profi-Show, Pro Qualifier und internationaler IFBB-Cup sind nicht dasselbe. Die Kalenderblöcke zeigen den jeweiligen Weg und führen zur offiziellen Quelle."
            },
            {
              detail: "Meisterschaften 2026",
              title: "Deutschland, Europa und Welt",
              text: "Der Kalender bündelt regionale Shows, Deutsche Meisterschaften sowie ausgewählte Europa-, Welt- und Universe-Termine."
            }
          ],
          "feature-grid--calendar-guide"
        )}
        <div class="bbcal-guide-action" data-reveal>
          <a class="button button--secondary" href="/bodybuilding-klassen-gewichtslimits/"><span>Bodybuilding-Klassen &amp; Gewichtslimits</span><span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Wettkampftermin zur Vorbereitung",
      text: "Der Show-Termin steht. Jetzt braucht deine Vorbereitung Struktur: Plane Training, Ernährung und regelmäßige Check-ins bis zu deinem Wettkampftag in einem klaren System.",
      ref: "bodybuilding-kalender"
    })}

    <section class="section bbcal-faq">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Fragen zum Wettkampfjahr",
          title: "Was Athleten vor der Anmeldung wissen sollten.",
          text: "Die Übersicht ersetzt keine Ausschreibung – sie bringt dich schneller zur richtigen offiziellen Stelle."
        })}
        ${faq(bodybuildingCalendarFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Wettkampfvorbereitung",
      title: "Eine Bühne ist nur der Termin. Die Form entsteht davor.",
      text:
        "Wenn Training, Ernährung, Posing und Peak Week sauber zusammenlaufen sollen, beginnt die Vorbereitung mit einem klaren System.",
      primary: { label: "Bodybuilding Coaching ansehen", href: "/bodybuilding-coaching-wettkampfvorbereitung/" },
      secondary: { label: "Vorbereitung direkt anfragen", href: contactHref("bodybuilding-coaching") }
    })}
  `;

  return layout({
    path: "/bodybuilding-wettkaempfe-2026/",
    title: "Bodybuilding Wettkämpfe 2026: IFBB Pro, NPC &amp; Termine",
    description:
      "Bodybuilding Wettkämpfe 2026: deutsche Termine, IFBB Pro League Profi-Shows, internationale NPC Worldwide Pro Qualifier und offizieller IFBB-Kalender.",
    keywords: [
      "Bodybuilding Wettkämpfe 2026",
      "Bodybuilding Termine 2026",
      "Bodybuilding Meisterschaften 2026",
      "NPC Germany Termine 2026",
      "DBFV Termine 2026",
      "GNBF Wettkampf 2026",
      "NAC Germany Termine 2026",
      "PCA Germany 2026",
      "IFBB Pro League Termine 2026",
      "NPC Worldwide Wettkämpfe 2026",
      "IFBB Wettkämpfe 2026 international"
    ],
    bodyClass: "page-premium page-bodybuilding-calendar",
    pageName: "Bodybuilding Wettkämpfe 2026",
    pageType: "CollectionPage",
    dateModified: "2026-08-10",
    socialImage: "/assets/images/dominik-bodybuilding-desert.webp",
    socialImageAlt: "Bodybuilding Wettkämpfe 2026 – verbandsübergreifender Kalender",
    extraStructuredData: [
      itemListSchema,
      faqSchema("/bodybuilding-wettkaempfe-2026/", bodybuildingCalendarFaq)
    ],
    content
  });
}

function bodybuildingClassesPage() {
  const classFaq = [
    {
      question: "Ist Classic Physique bei jedem Verband gleich?",
      answer: "Nein. DBFV, NAC Germany und NPC Worldwide nutzen unterschiedliche Formeln beziehungsweise Größentabellen. Auch Posinghose, Pflichtposen und Klassenaufteilung unterscheiden sich. Maßgeblich bleibt immer die aktuelle Ausschreibung der konkreten Meisterschaft."
    },
    {
      question: "Gibt es in Bikini, Wellness oder Figure ein Gewichtslimit?",
      answer: "Bei den hier verglichenen Verbänden werden diese Frauenklassen in der Regel offen oder nach Körpergröße eingeteilt, nicht über ein maximales Körpergewicht. Entscheidend sind Körperentwicklung, Proportionen, Präsentation und die verbandsspezifischen Bewertungskriterien."
    },
    {
      question: "Was ist der Unterschied zwischen Gewichtsklasse und Gewichtslimit?",
      answer: "Eine Gewichtsklasse ordnet Athleten nach dem tatsächlichen Waagegewicht ein, etwa bis 80 Kilogramm. Ein Gewichtslimit setzt dagegen ein Maximalgewicht in Relation zur Körpergröße. Wer darunter bleibt, kann starten; das Limit ist kein Zielgewicht."
    },
    {
      question: "Kann ich bei mehreren Verbänden in derselben Saison starten?",
      answer: "Das hängt von Mitgliedschaft, Qualifikation, Newcomer-Status und den Regeln des jeweiligen Veranstalters ab. Besonders Doppelstarts und verbandsübergreifender Newcomer-Status sollten vor der Anmeldung direkt geprüft werden."
    },
    {
      question: "Welche Klasse passt zu meinem aktuellen Körperbau?",
      answer: "Das Gewicht allein reicht nicht. Relevant sind Muskelmasse, Proportionen, Unterkörperentwicklung, Härte, Posing und Bühnenpräsentation. Die Übersicht liefert eine Vorauswahl; die endgültige Entscheidung sollte mit aktuellem Formcheck und der konkreten Ausschreibung fallen."
    }
  ];

  const npcClassicRows = [
    ["bis 162,6 cm", "75,7 kg"], ["bis 165,1 cm", "78,0 kg"],
    ["bis 167,6 cm", "80,3 kg"], ["bis 170,2 cm", "82,6 kg"],
    ["bis 172,7 cm", "84,8 kg"], ["bis 175,3 cm", "88,0 kg"],
    ["bis 177,8 cm", "91,6 kg"], ["bis 180,3 cm", "94,8 kg"],
    ["bis 182,9 cm", "98,4 kg"], ["bis 185,4 cm", "101,6 kg"],
    ["bis 188,0 cm", "105,2 kg"], ["bis 190,5 cm", "108,4 kg"],
    ["bis 193,0 cm", "111,6 kg"], ["bis 195,6 cm", "114,8 kg"],
    ["bis 198,1 cm", "117,9 kg"], ["bis 200,7 cm", "121,1 kg"],
    ["über 200,7 cm", "124,3 kg"]
  ];

  const limitRows = (rows) => rows.map(([height, limit]) => `<tr><td>${height}</td><td><strong>${limit}</strong></td></tr>`).join("");

  const content = `
    <section class="bbcal-hero bbclass-hero">
      <img class="bbcal-hero__image" src="/assets/images/dominik-stage-suit.webp" alt="Dominik Dörfl in Wettkampfform auf der Bodybuilding-Bühne"${imageLoadingAttributes({ eager: true })}>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>DBFV · NAC Germany · NPC Worldwide</p>
          <h1 data-reveal>Bodybuilding-<br>Klassen &amp; <span>Limits.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Welcher Verband? Welche Klasse? Welches Maximalgewicht? Diese Übersicht bringt Männer- und Frauenklassen, Bewertungskriterien und die wichtigsten Größen-Gewichts-Limits in ein verständliches System.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#klassencheck"><span>Klasse prüfen</span><span aria-hidden="true">↓</span></a>
            <a class="button button--secondary-light" href="#verbaende"><span>Verbände vergleichen</span><span aria-hidden="true">→</span></a>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>03</dt><dd>Regelwerke im Vergleich</dd></div>
          <div><dt>11</dt><dd>zentrale Divisionen erklärt</dd></div>
          <div><dt>01</dt><dd>interaktiver Limit-Check</dd></div>
        </dl>
      </div>
    </section>

    <section class="section bbcal-intro bbclass-intro">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head" data-reveal>
          <div>
            <p class="eyebrow">Das Wichtigste zuerst</p>
            <h2>Gleicher Name.<br><span>Andere Regeln.</span></h2>
          </div>
          <div class="bbcal-intro__copy">
            <p><strong>Classic Physique ist nicht überall dieselbe Klasse.</strong> Beim NPC Worldwide gelten feste Größenstufen mit Pfund-/Kilogramm-Limits, der DBFV arbeitet mit eigenen Zuschlägen zur Körpergröße und NAC Germany mit einer weiteren Formel.</p>
            <p>Auch „Bikini“, „Figure/Figur“ oder „Men’s Physique“ unterscheiden sich in Muskulatur, Härte, Posing und Kleidung. Deshalb beginnt die Klassenwahl immer mit dem Verband – nicht nur mit dem Namen.</p>
          </div>
        </div>
        <div class="bbclass-principles" data-reveal>
          <article><span>01</span><strong>Gewichtsklasse</strong><p>Die Waage ordnet dich einer Klasse zu – etwa bis 80 kg oder über 100 kg.</p></article>
          <article><span>02</span><strong>Gewichtslimit</strong><p>Deine Größe bestimmt das maximal erlaubte Gewicht. Darunter ist erlaubt, darüber nicht.</p></article>
          <article><span>03</span><strong>Größenklasse</strong><p>Du startest nach Körpergröße. Das Bühnengewicht ist kein Einteilungskriterium.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--muted bbclass-check" id="klassencheck">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Schnelle Vorauswahl für Männer</p>
          <h2>Dein Größen- &amp; Gewichtscheck.</h2>
          <p>Wähle Verband und Klasse. Der Check berechnet das offizielle Maximalgewicht für Männer/Open und zeigt, ob dein eingegebenes Bühnengewicht innerhalb des Limits liegt.</p>
        </div>
        <form class="bbclass-calculator" data-class-calculator data-reveal>
          <div class="bbclass-calculator__fields">
            <label><span>Verband</span><select name="federation"><option value="dbfv">DBFV e.V.</option><option value="nac">NAC Germany</option><option value="npc">NPC Worldwide</option></select></label>
            <label><span>Klasse</span><select name="division"><option value="classic-physique">Classic Physique</option><option value="classic-bodybuilding">Classic Bodybuilding</option><option value="mens-physique">Men’s Physique</option><option value="bodybuilding">Bodybuilding</option></select></label>
            <label><span>Körpergröße</span><span class="bbclass-input"><input name="height" type="number" min="150" max="210" step="0.1" value="180" inputmode="decimal"><b>cm</b></span></label>
            <label><span>Bühnengewicht</span><span class="bbclass-input"><input name="weight" type="number" min="45" max="180" step="0.1" value="90" inputmode="decimal"><b>kg</b></span></label>
          </div>
          <output class="bbclass-calculator__result" data-class-result aria-live="polite">
            <span>Dein Ergebnis</span><strong>Limit wird berechnet</strong><p>Die offizielle Ausschreibung bleibt maßgeblich.</p>
          </output>
        </form>
      </div>
    </section>

    <section class="section bbclass-directory" id="verbaende">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Verbandsvergleich</p>
          <h2>Drei Systeme. Klar getrennt.</h2>
          <p>Die Klassenanzahl einer konkreten Show kann wegen Teilnehmerzahl, Altersgruppe oder Ausschreibung abweichen. Die folgenden Übersichten zeigen das Grundsystem für Open-Athleten.</p>
        </div>

        <div class="bbclass-federations">
          <article class="bbclass-federation" id="dbfv" data-reveal>
            <header><span class="bbclass-federation__number">01</span><div><p class="eyebrow">Deutschland · IFBB Germany</p><h2>DBFV e.V.</h2><p>Viele Divisionen werden nach Gewicht oder Größe unterteilt. Classic Bodybuilding und Classic Physique haben unterschiedliche größenabhängige Limits.</p></div><a href="https://www.dbfv.de/wettkampfregeln/" target="_blank" rel="noopener noreferrer">Regelwerk <span aria-hidden="true">↗</span></a></header>
            <div class="bbclass-federation__body">
              <div class="bbclass-classlist"><h3>Angebotene Klassen</h3><div class="bbclass-sex-grid"><div><b>Frauen</b><ul><li>Bikini Fitness</li><li>Fit Model</li><li>Wellness Fitness</li><li>Fitness Figur</li><li>Frauen Physique</li></ul></div><div><b>Männer</b><ul><li>Bodybuilding</li><li>Classic Bodybuilding</li><li>Classic Physique</li><li>Men’s Physique</li><li>Muscular Physique</li></ul></div></div><p class="bbclass-note">Zusätzlich: Jugend, Junioren, Masters, Newcomer, Paare, Fit Pairs und Handicapped – je nach Veranstaltung.</p></div>
              <div class="bbclass-limit-card"><h3>Open Bodybuilding</h3><p><strong>Gewichtsklassen:</strong> bis 70 · 80 · 90 · 100 kg, danach über 100 kg.</p><h3>Classic-Limits</h3><table><thead><tr><th>Größe</th><th>Classic BB / Classic Physique</th></tr></thead><tbody>${limitRows([["bis 168 cm", "Größe −100 / +4 kg"],["bis 171 cm", "+2 / +6 kg"],["bis 175 cm", "+4 / +8 kg"],["bis 180 cm", "+7 / +11 kg"],["bis 188 cm", "+9 / +13 kg"],["bis 196 cm", "+11 / +15 kg"],["über 196 cm", "+13 / +17 kg"]])}</tbody></table></div>
            </div>
          </article>

          <article class="bbclass-federation" id="nac" data-reveal>
            <header><span class="bbclass-federation__number">02</span><div><p class="eyebrow">Deutschland · NAC International</p><h2>NAC Germany</h2><p>Das System ist kompakter: Bodybuilding wird nach Körpergröße, Classic Physique und Men’s Physique werden über Formeln begrenzt.</p></div><a href="https://www.nac-germany.de/klassen-regeln.html" target="_blank" rel="noopener noreferrer">Regelwerk <span aria-hidden="true">↗</span></a></header>
            <div class="bbclass-federation__body">
              <div class="bbclass-classlist"><h3>Angebotene Klassen</h3><div class="bbclass-sex-grid"><div><b>Frauen</b><ul><li>Bikini Shape</li><li>Bikini Wellness</li><li>Figur</li><li>Frauen Physique</li><li>Mixed Couples</li></ul></div><div><b>Männer</b><ul><li>Bodybuilding</li><li>Classic Physique</li><li>Men’s Physique</li><li>Junioren</li><li>Masters +40 / +50 / +60</li></ul></div></div><p class="bbclass-note">Bodybuilding: Body II bis einschließlich 175 cm, Body I über 175 cm; kein Gewichtslimit.</p></div>
              <div class="bbclass-formulas"><article><span>Men’s Physique</span><strong>Größe − 100 + 2 kg</strong><p>Beispiel 180 cm: maximal 82 kg.</p></article><article><span>Classic Physique</span><strong>Größe − 100 + Toleranz</strong><p>+4 kg bis 170 cm · +6 kg von 171–179 cm · +8 kg ab 180 cm · +10 kg über 189 cm.</p></article><p class="bbclass-note"><strong>Hinweis zur Grenze:</strong> Das NAC-Regelwerk formuliert „über 1,80 m“ und „über 1,89 m“. Bei exakt 180 beziehungsweise 189 cm vorab beim Veranstalter bestätigen.</p></div>
            </div>
          </article>

          <article class="bbclass-federation" id="npc" data-reveal>
            <header><span class="bbclass-federation__number">03</span><div><p class="eyebrow">International · IFBB Pro League Weg</p><h2>NPC Worldwide</h2><p>Die Divisionen werden veranstaltungsabhängig in unterschiedlich viele Größenklassen aufgeteilt. Classic Physique nutzt eine feste Inch-/Pfund-Tabelle.</p></div><a href="https://www.ifbbpro.com/npc-worldwide/rules/" target="_blank" rel="noopener noreferrer">Regelwerk <span aria-hidden="true">↗</span></a></header>
            <div class="bbclass-federation__body bbclass-federation__body--npc">
              <div class="bbclass-classlist"><h3>Angebotene Klassen</h3><div class="bbclass-sex-grid"><div><b>Frauen</b><ul><li>Bikini</li><li>Wellness</li><li>Figure</li><li>Physique</li><li>Fitness</li><li>Fit Model</li><li>Women’s Bodybuilding</li></ul></div><div><b>Männer</b><ul><li>Bodybuilding</li><li>Classic Physique</li><li>Men’s Physique</li><li>Wheelchair Bodybuilding</li></ul></div></div><p class="bbclass-note">Mögliche Kategorien: True Novice, Novice, Junior, Masters und Open. Welche davon angeboten werden, steht in der Show-Ausschreibung.</p></div>
              <details class="bbclass-npc-table"><summary><span>Classic Physique: alle Größenlimits</span><strong>Tabelle öffnen <b aria-hidden="true">↓</b></strong></summary><div class="bbclass-table-wrap"><table><thead><tr><th>Körpergröße</th><th>Maximalgewicht</th></tr></thead><tbody>${limitRows(npcClassicRows)}</tbody></table></div><p>Die offizielle Tabelle rechnet in Zoll und Pfund; Kilogrammwerte sind die veröffentlichten Umrechnungen.</p></details>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted bbclass-division-guide">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Frauenklassen verstehen</p><h2>Welche Entwicklung wird gesucht?</h2><p>Von Model-Look bis Physique: Nicht „besser“ oder „schlechter“, sondern ein anderes Verhältnis aus Muskulatur, Kondition, Proportion und Präsentation.</p></div>
        <div class="bbclass-spectrum" data-reveal><span>Weniger Muskelmasse</span><i aria-hidden="true"></i><span>Mehr Muskelmasse &amp; Definition</span></div>
        <div class="bbclass-guide-grid">
          <article data-reveal><span>01</span><h3>Fit Model</h3><p>Der weichste, modelorientierte Look. Balance, Form und Präsentation stehen im Vordergrund; weniger Muskulatur als in Bikini.</p><b>High Heels · Front-/Rückenansicht</b></article>
          <article data-reveal><span>02</span><h3>Bikini / Bikini Shape</h3><p>Athletisch-feminin mit klarer Silhouette, guter Gluteus-Form und starker Bühnenpräsentation – ohne extreme Härte oder Muskelteilung.</p><b>High Heels · Präsentation zentral</b></article>
          <article data-reveal><span>03</span><h3>Wellness</h3><p>Deutlich stärkerer Unterkörper mit ausgeprägten Oberschenkeln und Gluteus. Der Oberkörper bleibt im Verhältnis weniger dominant.</p><b>High Heels · Unterkörperfokus</b></article>
          <article data-reveal><span>04</span><h3>Figure / Fitness Figur</h3><p>Mehr Schulter-, Rücken- und Beinmuskulatur, stärkere Athletik und Symmetrie. Härter als Bikini/Wellness, aber ohne extreme Striations.</p><b>High Heels · Vierteldrehungen</b></article>
          <article data-reveal><span>05</span><h3>Women’s Physique</h3><p>Ausgeprägte Muskulatur, sichtbare Definition und Pflichtposen. Proportion, Muskelqualität und Bühnenroutine werden stärker gewichtet.</p><b>Barfuß · Pflichtposen &amp; Kür</b></article>
          <article data-reveal><span>06</span><h3>Women’s Bodybuilding</h3><p>Die höchste Stufe der Muskelmasse und Kondition. Vor allem im NPC-System angeboten; nicht jede Show schreibt die Division aus.</p><b>Barfuß · maximale Muskelentwicklung</b></article>
        </div>
      </div>
    </section>

    <section class="section bbclass-division-guide bbclass-men">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Männerklassen verstehen</p><h2>Silhouette, Klassik oder maximale Masse?</h2></div>
        <div class="bbclass-guide-grid bbclass-guide-grid--men">
          <article data-reveal><span>01</span><h3>Men’s Physique</h3><p>V-Form, schmale Taille, runde Schultern und ästhetischer Oberkörper. Boardshorts verdecken die Oberschenkel; klassische Bodybuilding-Masse ist nicht das Ziel.</p><b>Boardshorts · Front-/Rückenansicht</b></article>
          <article data-reveal><span>02</span><h3>Classic Physique</h3><p>Klassische Linien, Vakuum, Proportionen und ästhetische Posen – mit mehr zulässiger Masse als Classic Bodybuilding bei DBFV und meist deutlich mehr als Men’s Physique.</p><b>Größen-Gewichts-Limit · Classic Posing</b></article>
          <article data-reveal><span>03</span><h3>Classic Bodybuilding</h3><p>DBFV-spezifische Classic-Klasse mit engerem Gewichtslimit als Classic Physique. Gesamtentwicklung und Bodybuilding-Pflichtposen bleiben zentral.</p><b>Engeres Limit · Pflichtposen</b></article>
          <article data-reveal><span>04</span><h3>Bodybuilding</h3><p>Maximale vollständige Muskelentwicklung, Symmetrie, Härte und Kondition. Je nach Verband Einteilung über Gewicht, Größe oder offene Klassen.</p><b>Kein Größen-Gewichts-Cap · Pflichtposen</b></article>
        </div>
      </div>
    </section>

    <section class="section section--muted bbcal-method bbclass-method">
      <div class="section-shell bbcal-method__grid">
        <div data-reveal><p class="eyebrow">So triffst du die Entscheidung</p><h2>Vier Checks vor<br>der Anmeldung.</h2></div>
        <div class="bbcal-method__copy" data-reveal><ol class="bbclass-steps"><li><span>01</span><p><strong>Verband und konkrete Show wählen.</strong> Nicht jede Division läuft bei jeder Meisterschaft.</p></li><li><span>02</span><p><strong>Größe korrekt messen.</strong> Schon wenige Millimeter können beim NPC die nächste Stufe bedeuten.</p></li><li><span>03</span><p><strong>Look ehrlich vergleichen.</strong> Muskelverteilung, Härte und Posing sind wichtiger als der Klassenname.</p></li><li><span>04</span><p><strong>Ausschreibung final prüfen.</strong> Altersklassen, Qualifikation, Lizenz, Doppelstarts und Check-in-Regeln können abweichen.</p></li></ol><a class="button button--secondary-light" href="/bodybuilding-wettkaempfe-2026/"><span>Wettkämpfe 2026 ansehen</span><span aria-hidden="true">→</span></a></div>
      </div>
    </section>

    <section class="section bbcal-faq">
      <div class="section-shell">${sectionHeader({ eyebrow: "Häufige Fragen", title: "Was vor der Klassenwahl wichtig ist.", text: "Die Regeln geben den Rahmen. Der passende Look entscheidet, ob du in der Klasse wirklich konkurrenzfähig bist." })}${faq(classFaq)}</div>
    </section>

    ${ctaSection({
      eyebrow: "Wettkampfvorbereitung",
      title: "Die richtige Klasse ist der Start. Die richtige Form ist der Weg.",
      text: "Gemeinsam ordnen wir Verband, Klasse, Zeitplan, Training, Ernährung und Posing so ein, dass deine Vorbereitung ein klares Ziel bekommt.",
      primary: { label: "Klasse & Vorbereitung anfragen", href: contactHref("bodybuilding-coaching") },
      secondary: { label: "Bodybuilding Coaching ansehen", href: "/bodybuilding-coaching-wettkampfvorbereitung/" }
    })}
  `;

  return layout({
    path: "/bodybuilding-klassen-gewichtslimits/",
    title: "Bodybuilding-Klassen &amp; Gewichtslimits: NPC, DBFV, NAC",
    description: "Bodybuilding-Klassen und Gewichtslimits im Vergleich: NPC Worldwide, DBFV e.V. und NAC Germany. Frauen- und Männerklassen, Anforderungen und Limit-Check.",
    keywords: ["Bodybuilding Klassen", "Bodybuilding Gewichtslimits", "NPC Classic Physique Gewichtslimit", "DBFV Klassen", "NAC Germany Klassen", "Bikini Wellness Figure Unterschied", "Classic Physique Gewicht Größe"],
    bodyClass: "page-premium page-bodybuilding-calendar page-bodybuilding-classes",
    pageName: "Bodybuilding-Klassen und Gewichtslimits",
    pageType: "Article",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/dominik-stage-suit-social.jpg",
    socialImageAlt: "Bodybuilding-Klassen und Gewichtslimits im Verbandsvergleich",
    extraStructuredData: [faqSchema("/bodybuilding-klassen-gewichtslimits/", classFaq)],
    content
  });
}

function boxingCompetitionCard(event) {
  const status = event.past ? "Ausgetragen" : event.status || "Bestätigt";
  return `
    <article class="bbcal-event${event.past ? " bbcal-event--past" : ""}">
      <time class="bbcal-event__date" datetime="${event.date}">${event.label}</time>
      <div class="bbcal-event__body">
        <span class="bbcal-event__type">${event.type}</span>
        <h3>${event.name}</h3>
        <p><span aria-hidden="true">⌖</span>${event.location}</p>
      </div>
      <span class="bbcal-event__status${event.status ? " bbcal-event__status--live" : ""}">${status}</span>
    </article>
  `;
}

function boxingCalendarPage() {
  const allEntries = boxingCalendarSources.flatMap((source) =>
    source.events.map((event) => ({ ...event, source }))
  );
  const uniqueEvents = [];
  const seenEvents = new Set();
  allEntries
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((event) => {
      const fighters = event.name
        .toLowerCase()
        .split(" vs. ")
        .sort()
        .join(" vs. ");
      const key = `${event.date}|${fighters}`;
      if (!seenEvents.has(key)) {
        seenEvents.add(key);
        uniqueEvents.push(event);
      }
    });
  const upcomingEvents = uniqueEvents.filter((event) => !event.past);
  const pastEvents = uniqueEvents.filter((event) => event.past);
  const nextEvents = upcomingEvents.slice(0, 4);

  const navigationFor = (division) => boxingCalendarSources
    .filter((source) => source.division === division)
    .map(
      (source) => `
        <a class="bbcal-source-link" href="#${source.id}">
          <span>${source.number}</span>
          <strong>${source.shortName || source.name}</strong>
          <small>${source.events.filter((event) => !event.past).length
            ? `${source.events.filter((event) => !event.past).length} kommende Termine`
            : source.events.length
              ? "2026-Ergebnisse"
              : "Offiziellen Kalender öffnen"}</small>
          <b aria-hidden="true">↓</b>
        </a>
      `
    )
    .join("");

  const sectionFor = (source) => {
    const upcoming = source.events.filter((event) => !event.past);
    const completed = source.events.filter((event) => event.past);
    return `
      <section class="bbcal-federation" id="${source.id}" data-reveal>
        <header class="bbcal-federation__header">
          <span class="bbcal-federation__number">${source.number}</span>
          <div>
            <p class="eyebrow">${source.descriptor}</p>
            <h2>${source.name}</h2>
            <p>${source.note}</p>
          </div>
          <a href="${source.sourceUrl}" target="_blank" rel="noopener noreferrer">
            <span>Offizielle Quelle</span><span aria-hidden="true">↗</span>
          </a>
        </header>
        ${
          upcoming.length
            ? `<div class="bbcal-event-list">${upcoming.map(boxingCompetitionCard).join("")}</div>`
            : `<div class="boxcal-empty"><strong>${source.emptyTitle || "Noch kein weiterer Termin veröffentlicht."}</strong><span>${source.emptyText || `Neue ${source.shortName || source.name}-Ansetzungen ergänzen wir, sobald sie offiziell bestätigt sind.`}</span></div>`
        }
        ${
          completed.length
            ? `<details class="bbcal-archive">
                <summary><span>Bereits ausgetragen in 2026</span><strong>${completed.length} Termine</strong></summary>
                <div class="bbcal-event-list bbcal-event-list--archive">
                  ${completed.map(boxingCompetitionCard).join("")}
                </div>
              </details>`
            : ""
        }
      </section>
    `;
  };

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${site.url}/boxen-wettkaempfe-2026/#boxkalender`,
    name: "Boxen Wettkämpfe 2026 – Profi und Amateur",
    numberOfItems: uniqueEvents.length,
    itemListElement: uniqueEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: `${event.name} – ${event.source.name}`,
        startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: event.past
          ? "https://schema.org/EventCompleted"
          : "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: event.location },
        organizer: {
          "@type": "Organization",
          name: event.source.name,
          url: event.source.sourceUrl
        }
      }
    }))
  };

  const professionalSections = boxingCalendarSources
    .filter((source) => source.division === "profi")
    .map(sectionFor)
    .join("");
  const amateurSections = boxingCalendarSources
    .filter((source) => source.division === "amateur")
    .map(sectionFor)
    .join("");

  const content = `
    <section class="bbcal-hero boxcal-hero">
      <img class="bbcal-hero__image" src="/assets/images/boxing-calendar-hero.png" alt="Leerer Boxring mit Boxhandschuhen vor einem großen Kampf"${imageLoadingAttributes({ eager: true })}>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>Unabhängiger Kalender · Profi & Amateur</p>
          <h1 data-reveal>Boxen<br>Wettkämpfe <span>2026.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Die wichtigsten Titelkämpfe von WBA, WBC, WBF, WBO und IBF, deutsche BDB-Termine, internationale Turniere und Deutsche Meisterschaften – sauber getrennt nach Profi- und Amateurboxen.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#termine"><span>Alle Termine ansehen</span><span aria-hidden="true">↓</span></a>
            <span class="bbcal-hero__updated">IBF und BDB ergänzt am 11. August 2026</span>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>${boxingCalendarSources.length}</dt><dd>Organisationen</dd></div>
          <div><dt>${upcomingEvents.length}</dt><dd>kommende Events</dd></div>
          <div><dt>2</dt><dd>Wettkampfsysteme</dd></div>
        </dl>
      </div>
    </section>

    <section class="section bbcal-intro" id="termine">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head" data-reveal>
          <div>
            <p class="eyebrow">Ein Sport. Zwei Systeme.</p>
            <h2>Vom Verein bis<br><span>zum World Title.</span></h2>
          </div>
          <div class="bbcal-intro__copy">
            <p>Profiboxen lebt von einzelnen Fight Cards und Titelorganisationen. Amateurboxen folgt Turnierstrukturen, Altersklassen und nationalen wie internationalen Meisterschaften.</p>
            <p><strong>Wichtig:</strong> Vereinigungs-Kämpfe können bei mehreren Profi-Organisationen erscheinen. Kampfansetzungen, Austragungsorte und Übertragungen immer direkt an der offiziellen Quelle prüfen.</p>
          </div>
        </div>
        <div class="boxcal-source-groups" data-reveal>
          <section aria-labelledby="boxcal-profi-nav">
            <div class="boxcal-source-groups__title"><span>01</span><h3 id="boxcal-profi-nav">Profiboxen</h3></div>
            <nav class="bbcal-source-grid boxcal-source-grid--profi" aria-label="Profi-Organisationen">${navigationFor("profi")}</nav>
          </section>
          <section aria-labelledby="boxcal-amateur-nav">
            <div class="boxcal-source-groups__title"><span>02</span><h3 id="boxcal-amateur-nav">Amateurboxen</h3></div>
            <nav class="bbcal-source-grid boxcal-source-grid--amateur" aria-label="Amateur-Organisationen">${navigationFor("amateur")}</nav>
          </section>
        </div>
      </div>
    </section>

    <section class="section section--muted bbcal-next">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Als Nächstes</p>
          <h2>Die nächsten bestätigten Kampftermine.</h2>
        </div>
        <div class="bbcal-next-grid">
          ${nextEvents.map((event, index) => `
            <a href="#${event.source.id}" class="bbcal-next-card" data-reveal>
              <span class="bbcal-next-card__index">0${index + 1}</span>
              <time datetime="${event.date}">${event.label}</time>
              <h3>${event.name}</h3>
              <p>${event.source.shortName || event.source.name} · ${event.location}</p>
              <span class="bbcal-next-card__arrow" aria-hidden="true">→</span>
            </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section bbcal-directory" id="boxkalender">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Boxkalender 2026</p>
          <h2>Profi. Titel. Fight Cards.</h2>
          <p>Ausgewählte offiziell bestätigte Titelkämpfe der fünf internationalen Profi-Organisationen sowie der deutsche BDB-Kalender. Die Pläne werden im Profiboxen fortlaufend ergänzt.</p>
        </div>
        <div class="boxcal-division boxcal-division--profi">
          <div class="boxcal-division__marker" data-reveal><span>Professional</span><strong>01</strong></div>
          <div class="bbcal-federations">${professionalSections}</div>
        </div>

        <div class="bbcal-section-heading boxcal-amateur-heading" data-reveal>
          <p class="eyebrow">Olympisches Boxen</p>
          <h2>Amateur. Turniere. Meisterschaften.</h2>
          <p>Internationale World-Boxing-Events und die Deutschen Meisterschaften des DBV – nach Altersklassen und Zeitraum geordnet.</p>
        </div>
        <div class="boxcal-division boxcal-division--amateur">
          <div class="boxcal-division__marker" data-reveal><span>Amateur</span><strong>02</strong></div>
          <div class="bbcal-federations">${amateurSections}</div>
        </div>
      </div>
    </section>

    <section class="section section--muted bbcal-method">
      <div class="section-shell bbcal-method__grid">
        <div data-reveal>
          <p class="eyebrow">Redaktioneller Stand</p>
          <h2>Sauber getrennt.<br>Offiziell gegengeprüft.</h2>
        </div>
        <div class="bbcal-method__copy" data-reveal>
          <p>Die Übersicht wurde am <strong>11. August 2026</strong> mit den offiziellen Kalendern, Kampfplänen und Ergebnisdiensten der acht Organisationen abgeglichen. Mehrtägige Amateurturniere werden als ein Event gezählt.</p>
          <p>Camp Dörfl ist weder Veranstalter noch Ticketanbieter. Da sich Profikämpfe kurzfristig verändern können, sind ausschließlich die jeweils verlinkten Originalquellen verbindlich.</p>
          <a class="button button--secondary-light" href="${contactHref()}"><span>Änderung melden</span><span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Kampftermin zur Vorbereitung",
      text: "Baue Kraft, Kondition, Ernährung und Regeneration passend zu deinem Kampftermin auf – mit einem Trainingsplan, der deine Vorbereitung Woche für Woche klar führt.",
      ref: "boxen-kalender"
    })}

    <section class="section bbcal-faq">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Fragen zum Boxjahr",
          title: "Profi oder Amateur: Was vor dem Termin zählt.",
          text: "Der Kalender schafft Orientierung. Ausschreibung, Startberechtigung, Tickets und Übertragung bleiben Sache der jeweiligen Organisation."
        })}
        ${faq(boxingCalendarFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Performance für den Ring",
      title: "Der Termin steht. Die Leistungsfähigkeit entsteht davor.",
      text:
        "Kraft, Kondition, Körperkomposition und Regeneration brauchen eine Struktur, die zum Boxtraining und zum echten Alltag passt.",
      primary: { label: "Performance anfragen", href: contactHref("premium-training") },
      secondary: { label: "Personal Training ansehen", href: "/personal-trainer-nürnberg/" }
    })}
  `;

  return layout({
    path: "/boxen-wettkaempfe-2026/",
    title: "Boxen Wettkämpfe 2026: Profi & Amateur Termine | Camp Dörfl",
    description:
      "Boxen Wettkämpfe 2026: Profi-Titelkämpfe von WBA, WBC, WBF, WBO und IBF, deutsche BDB-Termine sowie Amateurboxen von World Boxing und DBV.",
    keywords: [
      "Boxen Wettkämpfe 2026",
      "Boxen Termine 2026",
      "Boxkämpfe 2026",
      "Profiboxen 2026",
      "Amateurboxen 2026",
      "Deutsche Meisterschaft Boxen 2026",
      "World Boxing Kalender 2026",
      "WBA WBC WBO IBF Kämpfe 2026",
      "IBF Boxen Termine 2026",
      "BDB Boxen Termine 2026"
    ],
    bodyClass: "page-premium page-bodybuilding-calendar page-boxing-calendar",
    pageName: "Boxen Wettkämpfe 2026",
    pageType: "CollectionPage",
    socialImage: "/assets/images/boxing-calendar-hero.png",
    socialImageAlt: "Boxen Wettkämpfe 2026 – Profi und Amateur im Überblick",
    extraStructuredData: [
      itemListSchema,
      faqSchema("/boxen-wettkaempfe-2026/", boxingCalendarFaq)
    ],
    content
  });
}

const calendarDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Berlin"
});
const calendarMonthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
  timeZone: "Europe/Berlin"
});

function calendarDateLabel(event) {
  const start = calendarDateFormatter.format(new Date(`${event.date}T12:00:00Z`));
  if (!event.endDate || event.endDate === event.date) return start;
  const end = calendarDateFormatter.format(new Date(`${event.endDate}T12:00:00Z`));
  return `${start} – ${end}`;
}

const triathlonCalendarFaq = [
  {
    question: "Wie funktioniert die Suche nach Postleitzahl und Radius?",
    answer:
      "Die eingegebene Postleitzahl wird in einen ungefähren Mittelpunkt umgewandelt. Anschließend berechnet die Seite die Luftlinien-Entfernung zu den hinterlegten Veranstaltungsorten und zeigt nur Treffer im gewählten Radius."
  },
  {
    question: "Sind wirklich alle deutschen Triathlons 2026 enthalten?",
    answer:
      "Die Deutschland-Liste übernimmt alle 351 reinen Triathlon-Veranstaltungen, die im offiziellen DTU-Veranstaltungskalender für 2026 mit Ortskoordinaten geführt werden. Duathlon, Swim & Run und Aquathlon sind bewusst nicht enthalten."
  },
  {
    question: "Wie vollständig ist der internationale Kalender?",
    answer:
      "Für Österreich, Schweiz, Spanien, Italien, Luxemburg, Belgien, die Niederlande und Frankreich bündelt die Seite bestätigte überregionale Rennen aus offiziellen Verbands-, IRONMAN-, Challenge-Family- und Europe-Triathlon-Kalendern. Lokale Vereinsrennen können je Land zusätzlich existieren."
  },
  {
    question: "Sind Anmeldung und Termin verbindlich?",
    answer:
      "Nein. Ausschreibung, Startplätze, Strecken, Altersklassen und mögliche Terminänderungen müssen immer beim verlinkten Veranstalter oder Verband geprüft werden."
  }
];

function triathlonEventCard(event) {
  const past = event.date < "2026-08-01";
  const location = [event.city, event.region].filter(Boolean).join(" · ");
  return `
    <article class="sportcal-event${past ? " sportcal-event--past" : ""}"
      data-tri-event data-country="${event.country}" data-lat="${event.latitude}" data-lon="${event.longitude}"
      data-date="${event.date}" data-name="${event.name.replaceAll('"', "&quot;")}">
      <div class="sportcal-event__date">
        <time datetime="${event.date}">${calendarDateLabel(event)}</time>
        <span>${event.countryName}</span>
      </div>
      <div class="sportcal-event__body">
        <span class="sportcal-event__type">${event.type}</span>
        <h3>${event.name}</h3>
        <p><span aria-hidden="true">⌖</span>${location}</p>
      </div>
      <div class="sportcal-event__meta">
        <span class="sportcal-event__distance" data-event-distance hidden></span>
        <span class="sportcal-event__status">${past ? "Ausgetragen" : "Bestätigt"}</span>
        <a href="${event.url}" target="_blank" rel="noopener noreferrer" aria-label="Offizielle Quelle für ${event.name}">Quelle ↗</a>
      </div>
    </article>
  `;
}

function triathlonCalendarPage() {
  const allEvents = [...dtuTriathlonEvents2026, ...internationalTriathlonEvents2026]
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const upcomingEvents = allEvents.filter((event) => event.date >= "2026-08-01");
  const pastEvents = allEvents.filter((event) => event.date < "2026-08-01");
  const internationalCount = allEvents.filter((event) => event.country !== "DE").length;
  const calendarGroupsFor = (eventList, archive = false) => {
    const grouped = new Map();
    eventList.forEach((event) => {
      const monthKey = event.date.slice(0, 7);
      if (!grouped.has(monthKey)) grouped.set(monthKey, []);
      grouped.get(monthKey).push(event);
    });
    return [...grouped.entries()].map(([month, events]) => `
      <section class="sportcal-month" data-tri-month${archive ? " data-calendar-archive-group" : ""}>
        <div class="sportcal-month__heading">
          <h3>${calendarMonthFormatter.format(new Date(`${month}-15T12:00:00Z`))}</h3>
          <span data-tri-month-count>${events.length} Termine</span>
        </div>
        <div class="sportcal-event-list">
          ${events.map(triathlonEventCard).join("")}
        </div>
      </section>
    `).join("");
  };
  const calendarGroups = calendarGroupsFor(upcomingEvents);
  const pastCalendarGroups = calendarGroupsFor(pastEvents, true);

  const sourceLinks = [
    ["Deutsche Triathlon Union", "351 deutsche Veranstaltungen", "https://www.triathlondeutschland.de/termine/veranstaltungskalender?select_date=2026&sport=48"],
    ["IRONMAN Europe", "Lang- und Mitteldistanzen", "https://www.ironman.com/races"],
    ["Challenge Family", "Europäische Rennserie", "https://www.challenge-family.com/challenge-family/race/europe/"],
    ["Europe Triathlon", "Cups & Meisterschaften", "https://europe.triathlon.org/"],
    ["Triathlon Austria", "Österreichischer Kalender", "https://www.triathlon-austria.at/de/service-termine"]
  ].map(([name, description, url], index) => `
    <a class="bbcal-source-link" href="${url}" target="_blank" rel="noopener noreferrer">
      <span>0${index + 1}</span><strong>${name}</strong><small>${description}</small><b aria-hidden="true">↗</b>
    </a>
  `).join("");

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${site.url}/triathlon-kalender-2026/#triathlonkalender`,
    name: "Triathlon Kalender 2026 – Deutschland und Europa",
    numberOfItems: allEvents.length,
    itemListElement: allEvents.slice(0, 120).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: event.name,
        startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: event.date < "2026-08-01" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: event.city,
          address: { "@type": "PostalAddress", addressCountry: event.country }
        },
        organizer: { "@type": "Organization", name: event.source, url: event.url }
      }
    }))
  };

  const content = `
    <section class="bbcal-hero trical-hero">
      <img class="bbcal-hero__image" src="/assets/images/home-hero-ironman-interview.webp" alt="Triathlet Dominik Dörfl im Zielbereich eines Langdistanz-Triathlons"${imageLoadingAttributes({ eager: true })}>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>Deutschland komplett · Europa ergänzt</p>
          <h1 data-reveal>Triathlon<br>Kalender <span>2026.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Finde deinen nächsten Start nach Postleitzahl, Radius und Land – oder entdecke den gesamten Kalender mit ${allEvents.length} bekannten Rennen.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#triathlon-suche"><span>Rennen in meiner Nähe</span><span aria-hidden="true">↓</span></a>
            <span class="bbcal-hero__updated">Geprüft am 1. August 2026</span>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>${dtuTriathlonEvents2026.length}</dt><dd>DTU-Termine</dd></div>
          <div><dt>9</dt><dd>Länder</dd></div>
          <div><dt>${upcomingEvents.length}</dt><dd>ab August</dd></div>
        </dl>
      </div>
    </section>

    <section class="section trical-search-section" id="triathlon-suche" data-tri-calendar data-total-events="${allEvents.length}">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head trical-intro" data-reveal>
          <div>
            <p class="eyebrow">Dein persönlicher Rennfinder</p>
            <h2>Wo willst du<br><span>an der Startlinie stehen?</span></h2>
          </div>
          <div class="bbcal-intro__copy">
            <p>Land auswählen genügt. Für eine echte Umgebungssuche zusätzlich Postleitzahl und Radius eingeben – der Kalender zeigt danach nur passende Treffer.</p>
            <p><strong>Ohne Filter</strong> bleibt der vollständige Kalender mit Deutschland, Österreich, Schweiz, Spanien, Italien, Luxemburg, Belgien, Niederlande und Frankreich sichtbar.</p>
          </div>
        </div>

        <form class="trical-filter" data-tri-filter novalidate>
          <label>
            <span>Eigene Postleitzahl</span>
            <input type="text" inputmode="numeric" autocomplete="postal-code" maxlength="10" placeholder="z. B. 90427" data-tri-postcode>
          </label>
          <label>
            <span>Suchradius</span>
            <select data-tri-radius>
              <option value="20">20 km</option><option value="50" selected>50 km</option><option value="100">100 km</option><option value="300">300 km</option>
            </select>
          </label>
          <label>
            <span>Land</span>
            <select data-tri-country>
              <option value="" selected>Alle Länder</option><option value="DE">Deutschland</option><option value="AT">Österreich</option><option value="CH">Schweiz</option><option value="ES">Spanien</option><option value="IT">Italien</option><option value="LU">Luxemburg</option><option value="BE">Belgien</option><option value="NL">Niederlande</option><option value="FR">Frankreich</option>
            </select>
          </label>
          <button class="button button--primary trical-filter__submit" type="submit"><span>Passende Rennen finden</span><span aria-hidden="true">→</span></button>
          <button class="trical-filter__reset" type="button" data-tri-reset>Gesamten Kalender anzeigen</button>
          <p class="trical-filter__privacy">Die PLZ wird nur für diese Suche an den OpenStreetMap-basierten Geodienst Photon übertragen.</p>
        </form>

        <div class="trical-results-head" aria-live="polite">
          <div><strong data-tri-result-count>${allEvents.length}</strong><span data-tri-result-label> Termine im gesamten Kalender</span></div>
          <p data-tri-status>Alle Länder und Entfernungen werden angezeigt.</p>
        </div>
        <div class="trical-no-results" data-tri-empty hidden>
          <strong>In diesem Radius wurde kein Rennen gefunden.</strong>
          <span>Erweitere den Radius, wähle ein anderes Land oder öffne den gesamten Kalender.</span>
        </div>
        <div class="sportcal-calendar" id="triathlonkalender">
          ${calendarGroups}
          ${pastEvents.length ? `<details class="calendar-past-archive" data-calendar-past-archive>
            <summary><span><small>Archiv 2026</small><strong>Vergangene Triathlon-Termine</strong></span><b>${pastEvents.length} Rennen anzeigen</b></summary>
            <div class="calendar-past-archive__content" data-calendar-archive-content>
              <template data-calendar-archive-template>${pastCalendarGroups}</template>
            </div>
          </details>` : ""}
        </div>
      </div>
    </section>

    <section class="section section--muted trical-sources">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal>
          <p class="eyebrow">Offiziell gegengeprüft</p>
          <h2>Die Quellen hinter dem Kalender.</h2>
          <p>Deutschland basiert vollständig auf dem DTU-Kalender. Die ${internationalCount} internationalen Einträge bündeln bestätigte überregionale Rennen der führenden europäischen Serien und Verbände.</p>
        </div>
        <nav class="bbcal-source-grid trical-source-grid" aria-label="Offizielle Triathlon-Quellen">${sourceLinks}</nav>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Renntermin zum Trainingsplan",
      text: "Verbinde Schwimmen, Radfahren, Laufen, Krafttraining und Regeneration in einem Wochenplan, der sich an deinem Zielrennen und deinem Alltag orientiert.",
      ref: "triathlon-kalender"
    })}

    <section class="section bbcal-faq"><div class="section-shell">
      ${sectionHeader({ eyebrow: "Fragen zum Rennkalender", title: "Schneller zum passenden Start.", text: "Was die Suche kann – und was du vor der Anmeldung direkt beim Veranstalter prüfen solltest." })}
      ${faq(triathlonCalendarFaq)}
    </div></section>

    ${ctaSection({
      eyebrow: "Triathlon Coaching",
      title: "Der Wettkampf steht. Jetzt braucht die Vorbereitung ein System.",
      text: "Training, Kraft, Ernährung und Renntaktik werden dann stark, wenn sie nicht nebeneinander laufen, sondern zusammenarbeiten.",
      primary: { label: "Vorbereitung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Personal Training ansehen", href: "/personal-trainer-nürnberg/" }
    })}
  `;

  return layout({
    path: "/triathlon-kalender-2026/",
    title: "Triathlon Kalender 2026 nach PLZ & Radius | Camp Dörfl",
    description: `Triathlon Kalender 2026 mit ${allEvents.length} Rennen: alle 351 DTU-Triathlons in Deutschland plus bestätigte Termine in acht europäischen Ländern. Suche nach PLZ, Radius und Land.`,
    keywords: ["Triathlon Kalender 2026", "Triathlon Termine 2026", "Triathlon in meiner Nähe", "Triathlon Deutschland 2026", "Ironman Termine 2026", "Triathlon Österreich 2026"],
    bodyClass: "page-premium page-bodybuilding-calendar page-triathlon-calendar",
    pageName: "Triathlon Kalender 2026",
    pageType: "CollectionPage",
    socialImage: "/assets/images/home-hero-ironman-interview.webp",
    socialImageAlt: "Triathlon Kalender 2026 mit Suche nach Postleitzahl und Radius",
    extraStructuredData: [itemListSchema, faqSchema("/triathlon-kalender-2026/", triathlonCalendarFaq)],
    content
  });
}

const runningCategoryMeta = Object.freeze({
  half: { label: "Halbmarathon", short: "21,1 km", number: "01" },
  marathon: { label: "Marathon", short: "42,195 km", number: "02" },
  mammut: { label: "Mammutmarsch", short: "30–100 km", number: "03" },
  mega: { label: "Megamarsch", short: "25–100 km", number: "04" },
  ultra: { label: "Ultra Running", short: "Jenseits des Marathons", number: "05" }
});

const runningCalendarFaq = [
  {
    question: "Wie funktioniert die Suche nach Postleitzahl und Radius?",
    answer: "Die eingegebene Postleitzahl wird in einen ungefähren Mittelpunkt umgewandelt. Danach berechnet die Seite die Luftlinien-Entfernung zu allen hinterlegten Veranstaltungsorten und zeigt nur Läufe im ausgewählten Radius."
  },
  {
    question: "Welche Läufe sind im Laufkalender 2026 enthalten?",
    answer: "Die Übersicht bündelt die deutschen Halbmarathon- und Marathon-Termine des offiziellen DLV-Laufkalenders, die deutschen Ultra-Laufveranstaltungen der DUV sowie die offiziellen Saisonkalender von Mammutmarsch und Megamarsch."
  },
  {
    question: "Kann ich gezielt nach einer Distanz oder einem Ort suchen?",
    answer: "Ja. Neben Postleitzahl und Radius kannst du eine der fünf Kategorien auswählen und den Kalender zusätzlich nach Eventname, Ort oder Postleitzahl durchsuchen. Alle Filter lassen sich miteinander kombinieren."
  },
  {
    question: "Sind Termine und Anmeldung verbindlich?",
    answer: "Nein. Der Kalender dient der verbandsübergreifenden Orientierung. Terminänderungen, Strecken, Startplätze und Teilnahmebedingungen müssen immer über die direkt verlinkte offizielle Quelle geprüft werden."
  }
];

function runningEventCard(event) {
  const past = event.date < "2026-08-01";
  const searchValue = [event.name, event.city, event.postalCode, event.distance, event.source]
    .filter(Boolean).join(" ").replaceAll('"', "&quot;");
  return `
    <article class="sportcal-event${past ? " sportcal-event--past" : ""}"
      data-run-event data-category="${event.category}" data-lat="${event.latitude}" data-lon="${event.longitude}"
      data-date="${event.date}" data-search="${searchValue}">
      <div class="sportcal-event__date">
        <time datetime="${event.date}">${calendarDateLabel(event)}</time>
        <span>${event.distance || runningCategoryMeta[event.category].short}</span>
      </div>
      <div class="sportcal-event__body">
        <span class="sportcal-event__type">${event.type}</span>
        <h3>${event.name}</h3>
        <p><span aria-hidden="true">⌖</span>${event.postalCode ? `${event.postalCode} ` : ""}${event.city}</p>
      </div>
      <div class="sportcal-event__meta">
        <span class="sportcal-event__distance" data-run-distance hidden></span>
        <span class="sportcal-event__status">${past ? "Ausgetragen" : "Bestätigt"}</span>
        <a href="${event.url}" target="_blank" rel="noopener noreferrer" aria-label="Offizielle Quelle für ${event.name}">Quelle ↗</a>
      </div>
    </article>`;
}

function runningCalendarPage() {
  const categoryOrder = ["half", "marathon", "mammut", "mega", "ultra"];
  const events = [...runningEvents2026].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const categoryCounts = Object.fromEntries(categoryOrder.map((category) => [category, events.filter((event) => event.category === category).length]));
  const upcomingEvents = events.filter((event) => event.date >= "2026-08-01");
  const pastEvents = events.filter((event) => event.date < "2026-08-01");
  const upcomingCount = upcomingEvents.length;

  const categoryNavigation = categoryOrder.map((category) => {
    const meta = runningCategoryMeta[category];
    return `<a class="runcal-category-card" href="#lauf-${category}" data-reveal>
      <span>${meta.number}</span><small>${meta.short}</small><strong>${meta.label}</strong><b>${categoryCounts[category]} Termine</b><i aria-hidden="true">↓</i>
    </a>`;
  }).join("");

  const calendarGroups = categoryOrder.map((category) => {
    const meta = runningCategoryMeta[category];
    const categoryEvents = upcomingEvents.filter((event) => event.category === category);
    if (!categoryEvents.length) return "";
    return `<section class="sportcal-month runcal-group" id="lauf-${category}" data-run-group data-category="${category}">
      <div class="sportcal-month__heading">
        <div><small>${meta.number} · ${meta.short}</small><h3>${meta.label}</h3></div>
        <span data-run-group-count>${categoryEvents.length} Termine</span>
      </div>
      <div class="sportcal-event-list">${categoryEvents.map(runningEventCard).join("")}</div>
    </section>`;
  }).join("");
  const pastCalendarGroups = categoryOrder.map((category) => {
    const meta = runningCategoryMeta[category];
    const categoryEvents = pastEvents.filter((event) => event.category === category);
    if (!categoryEvents.length) return "";
    return `<section class="sportcal-month runcal-group" id="lauf-archiv-${category}" data-run-group data-category="${category}" data-calendar-archive-group>
      <div class="sportcal-month__heading">
        <div><small>${meta.number} · ${meta.short}</small><h3>${meta.label}</h3></div>
        <span data-run-group-count>${categoryEvents.length} Termine</span>
      </div>
      <div class="sportcal-event-list">${categoryEvents.map(runningEventCard).join("")}</div>
    </section>`;
  }).join("");

  const sources = [
    ["DLV-Laufkalender", "Halbmarathon & Marathon", "https://www.laufen.de/index.php/laufkalender"],
    ["DUV Ultramarathon", "Deutscher Ultra-Kalender", "https://statistik.d-u-v.org/calendar.php?year=2026&country=GER&Language=DE"],
    ["Mammutmarsch", "Offizielle Saison 2026", "https://mammutmarsch.de/produkt-kategorie/event/"],
    ["Megamarsch", "Offizielle Saison 2026", "https://www.megamarsch.de/"]
  ].map(([name, description, url], index) => `<a class="bbcal-source-link" href="${url}" target="_blank" rel="noopener noreferrer">
    <span>0${index + 1}</span><strong>${name}</strong><small>${description}</small><b aria-hidden="true">↗</b>
  </a>`).join("");

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${site.url}/laufkalender-2026/#laufkalender`,
    name: "Laufkalender 2026 – Halbmarathon, Marathon, Märsche und Ultra Running",
    numberOfItems: events.length,
    itemListElement: events.slice(0, 150).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: event.name,
        startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: event.date < "2026-08-01" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: event.city,
          address: { "@type": "PostalAddress", postalCode: event.postalCode || undefined, addressCountry: "DE" }
        },
        organizer: { "@type": "Organization", name: event.source, url: event.url }
      }
    }))
  };

  const content = `
    <section class="bbcal-hero trical-hero runcal-hero">
      <img class="bbcal-hero__image" src="/assets/images/home-hero-stadium-wide.webp" alt="Läufer und Moderator Dominik Dörfl im Stadion nach dem Zieleinlauf"${imageLoadingAttributes({ eager: true })}>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>Deutschland · fünf Laufwelten · eine Suche</p>
          <h1 data-reveal>Laufkalender<br><span>2026.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Halbmarathon, Marathon, Mammutmarsch, Megamarsch und Ultra Running – verbandsübergreifend gebündelt und individuell nach deiner Region filterbar.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#lauf-suche"><span>Läufe in meiner Nähe</span><span aria-hidden="true">↓</span></a>
            <span class="bbcal-hero__updated">Geprüft am 1. August 2026</span>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>${events.length}</dt><dd>Termine</dd></div><div><dt>5</dt><dd>Kategorien</dd></div><div><dt>${upcomingCount}</dt><dd>ab August</dd></div>
        </dl>
      </div>
    </section>

    <section class="section runcal-entry-section">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head trical-intro" data-reveal>
          <div><p class="eyebrow">Dein Kalender. Deine Distanz.</p><h2>Fünf Wege<br><span>an die Startlinie.</span></h2></div>
          <div class="bbcal-intro__copy"><p>Vom schnellen Halbmarathon bis zum Ultra-Abenteuer: Wähle zuerst deine Kategorie oder nutze direkt die persönliche Umkreissuche.</p><p><strong>Alle Bereiche bleiben unabhängig.</strong> Damit findest du auch Events außerhalb eines einzelnen Verbandes oder Veranstalters.</p></div>
        </div>
        <nav class="runcal-category-grid" aria-label="Laufkategorien">${categoryNavigation}</nav>
      </div>
    </section>

    <section class="section trical-search-section runcal-search-section" id="lauf-suche" data-run-calendar data-total-events="${events.length}">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-intro__head trical-intro" data-reveal>
          <div><p class="eyebrow">Individuelle Suche</p><h2>Welcher Lauf<br><span>passt zu dir?</span></h2></div>
          <div class="bbcal-intro__copy"><p>Postleitzahl und Radius zeigen dir Läufe in deiner Nähe. Kategorie sowie Event- oder Ortsname grenzen die Liste noch genauer ein.</p><p><strong>Ohne Filter</strong> siehst du den vollständigen deutschen Kalender – sauber nach den fünf Laufwelten sortiert.</p></div>
        </div>

        <form class="trical-filter runcal-filter" data-run-filter novalidate>
          <label><span>Eigene Postleitzahl</span><input type="text" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="z. B. 90427" data-run-postcode></label>
          <label><span>Suchradius</span><select data-run-radius><option value="20">20 km</option><option value="50" selected>50 km</option><option value="100">100 km</option><option value="300">300 km</option></select></label>
          <label><span>Kategorie</span><select data-run-category><option value="" selected>Alle Laufwelten</option><option value="half">Halbmarathon</option><option value="marathon">Marathon</option><option value="mammut">Mammutmarsch</option><option value="mega">Megamarsch</option><option value="ultra">Ultra Running</option></select></label>
          <label><span>Event oder Ort</span><input type="search" autocomplete="off" placeholder="z. B. Berlin oder Trail" data-run-query></label>
          <button class="button button--primary trical-filter__submit" type="submit"><span>Passende Läufe finden</span><span aria-hidden="true">→</span></button>
          <button class="trical-filter__reset" type="button" data-run-reset>Gesamten Kalender anzeigen</button>
          <p class="trical-filter__privacy">Die PLZ wird nur bei einer Umkreissuche an den OpenStreetMap-basierten Geodienst Photon übertragen.</p>
        </form>

        <div class="trical-results-head" aria-live="polite">
          <div><strong data-run-result-count>${events.length}</strong><span data-run-result-label> Termine im gesamten Kalender</span></div>
          <p data-run-status>Alle Kategorien und Entfernungen werden angezeigt.</p>
        </div>
        <div class="trical-no-results" data-run-empty hidden><strong>Für diese Auswahl wurde kein Lauf gefunden.</strong><span>Erweitere den Radius, wähle eine andere Kategorie oder setze die Suche zurück.</span></div>
        <div class="sportcal-calendar runcal-calendar" id="laufkalender">
          ${calendarGroups}
          ${pastEvents.length ? `<details class="calendar-past-archive" data-calendar-past-archive>
            <summary><span><small>Archiv 2026</small><strong>Vergangene Lauf-Termine</strong></span><b>${pastEvents.length} Läufe anzeigen</b></summary>
            <div class="calendar-past-archive__content" data-calendar-archive-content>
              <template data-calendar-archive-template>${pastCalendarGroups}</template>
            </div>
          </details>` : ""}
        </div>
      </div>
    </section>

    <section class="section section--muted trical-sources">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Verbandsübergreifend geprüft</p><h2>Vier offizielle Kalender. Eine Übersicht.</h2><p>DLV, DUV, Mammutmarsch und Megamarsch bilden die Grundlage. Anmeldung, Änderungen und Teilnahmebedingungen bleiben über jede Veranstaltung direkt erreichbar.</p></div>
        <nav class="bbcal-source-grid trical-source-grid runcal-source-grid" aria-label="Offizielle Laufkalender-Quellen">${sources}</nav>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Laufziel zum Wochenplan",
      text: "Plane Lauftraining, ergänzende Kraft, Ernährung und Erholung passend zu deiner Distanz – vom ersten Halbmarathon bis zum nächsten Ultra-Abenteuer.",
      ref: "laufkalender"
    })}

    <section class="section bbcal-faq"><div class="section-shell">
      ${sectionHeader({ eyebrow: "Fragen zum Laufkalender", title: "Schneller zum passenden Event.", text: "Was die individuelle Suche kann – und was du vor der Anmeldung prüfen solltest." })}
      ${faq(runningCalendarFaq)}
    </div></section>

    ${ctaSection({
      eyebrow: "Ausdauer & Performance",
      title: "Das Ziel steht. Jetzt braucht die Vorbereitung Struktur.",
      text: "Kraft, Lauftraining, Ernährung und Regeneration werden dann stark, wenn sie als ein System zusammenarbeiten.",
      primary: { label: "Vorbereitung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Personal Training ansehen", href: "/personal-trainer-nürnberg/" }
    })}
  `;

  return layout({
    path: "/laufkalender-2026/",
    title: "Laufkalender 2026: Läufe nach PLZ & Radius | Camp Dörfl",
    description: `Laufkalender 2026 mit ${events.length} deutschen Terminen: Halbmarathon, Marathon, Mammutmarsch, Megamarsch und Ultra Running. Suche nach PLZ, Radius, Ort und Kategorie.`,
    keywords: ["Laufkalender 2026", "Läufe 2026 Deutschland", "Halbmarathon 2026", "Marathon 2026", "Mammutmarsch 2026", "Megamarsch 2026", "Ultralauf 2026", "Lauf in meiner Nähe"],
    bodyClass: "page-premium page-bodybuilding-calendar page-triathlon-calendar page-running-calendar",
    pageName: "Laufkalender 2026",
    pageType: "CollectionPage",
    socialImage: "/assets/images/home-hero-stadium-wide.webp",
    socialImageAlt: "Laufkalender 2026 mit Suche nach Postleitzahl, Radius und Kategorie",
    extraStructuredData: [itemListSchema, faqSchema("/laufkalender-2026/", runningCalendarFaq)],
    content
  });
}

const golfCalendarFaq = [
  { question: "Welche Golfturniere sind für normale Clubspieler zugänglich?", answer: "Das hängt von Ausschreibung, Handicap-Index, Clubmitgliedschaft und Meldefrist ab. Der zentrale DGV-Turnierkalender bündelt Club-, Landesverbands- und DGV-Turniere und führt zur jeweiligen Anmeldung." },
  { question: "Wo finde ich Turniere meines Landesgolfverbandes?", answer: "Die Seite verlinkt alle zwölf Landesgolfverbände. Viele regionale Meisterschaften und offene Turniere erscheinen zusätzlich im zentralen Turnierkalender auf Golf.de." },
  { question: "Was enthält das Profi-Portal?", answer: "Das Profi-Portal bündelt Deutschland-Stopps internationaler Touren, die Pro Golf Tour sowie Turniere und Pro Days der PGA of Germany. Teilnahmebedingungen stehen jeweils beim Veranstalter." },
  { question: "Sind Termine und Startberechtigungen verbindlich?", answer: "Nein. Diese Übersicht dient der Orientierung. Ausschreibung, Startberechtigung, Nenngeld, Meldeschluss und mögliche Änderungen sind ausschließlich an der offiziellen Quelle verbindlich." }
];

function golfEventCard(event) {
  const past = event.date < "2026-08-01";
  return `
    <a class="golfcal-event${past ? " golfcal-event--past" : ""}" href="${event.url}" target="_blank" rel="noopener noreferrer">
      <time datetime="${event.date}">${calendarDateLabel(event)}</time>
      <span class="golfcal-event__type">${event.type}</span>
      <h3>${event.name}</h3>
      <p><span aria-hidden="true">⌖</span>${event.location}</p>
      <span class="golfcal-event__link">Details & Quelle <b aria-hidden="true">↗</b></span>
    </a>`;
}

function golfCalendarPage() {
  const amateurEvents = golfEvents2026.filter((event) => event.portal === "Amateur" && event.date >= "2026-08-01");
  const amateurPastEvents = golfEvents2026.filter((event) => event.portal === "Amateur" && event.date < "2026-08-01");
  const professionalEvents = golfEvents2026.filter((event) => event.portal === "Profi" && event.date >= "2026-08-01");
  const professionalPastEvents = golfEvents2026.filter((event) => event.portal === "Profi" && event.date < "2026-08-01");
  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${site.url}/golfturniere-2026/#turnierkalender`,
    name: "Golfturniere 2026 in Deutschland – Amateur und Profi",
    numberOfItems: golfEvents2026.length,
    itemListElement: golfEvents2026.map((event, index) => ({
      "@type": "ListItem", position: index + 1, item: {
        "@type": "SportsEvent", name: event.name, startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: event.date < "2026-08-01" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: event.location }, url: event.url
      }
    }))
  };

  const content = `
    <section class="bbcal-hero golfcal-hero">
      <div class="golfcal-hero__graphic"><img src="/assets/images/golfturniere-hero.png" alt="Golfplatz in den Bergen mit Clubhaus, See und Grün im Abendlicht"${imageLoadingAttributes({ eager: true })}></div>
      <div class="bbcal-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell bbcal-hero__inner">
        <div class="bbcal-hero__copy">
          <p class="eyebrow" data-reveal>Offene Turniere · Verbände · Profi-Portal</p>
          <h1 data-reveal>Golfturniere<br><span>2026.</span></h1>
          <p class="bbcal-hero__lead" data-reveal>Ein zentraler Einstieg in deutsche Amateur-, Verbands- und Profi-Turniere – mit allen zwölf Landesgolfverbänden und direkten offiziellen Quellen.</p>
          <div class="bbcal-hero__actions" data-reveal>
            <a class="button button--primary" href="#turnierkalender"><span>Turniere ansehen</span><span aria-hidden="true">↓</span></a>
            <span class="bbcal-hero__updated">Geprüft am 1. August 2026</span>
          </div>
        </div>
        <dl class="bbcal-hero__facts" data-reveal>
          <div><dt>12</dt><dd>Landesverbände</dd></div><div><dt>2</dt><dd>Portale</dd></div><div><dt>${golfEvents2026.length}</dt><dd>Leittermine</dd></div>
        </dl>
      </div>
    </section>

    <section class="section golfcal-intro" id="turnierkalender">
      <div class="section-shell section-shell--wide">
        <div class="golfcal-intro-layout">
          <div class="golfcal-intro-visual" data-reveal>
            <figure class="golfcal-intro-image">
              <img src="/assets/images/golfturniere-schlaeger.jpg" alt="Detailaufnahme hochwertiger Golfschläger in einer Golftasche"${imageLoadingAttributes()}>
              <figcaption><span>Equipment & Präzision</span><strong>Bereit für die nächste Runde.</strong></figcaption>
            </figure>
            <figure class="golfcal-intro-person">
              <img src="/assets/images/golfturniere-dominik.jpg" alt="Dominik Dörfl auf dem Golfplatz"${imageLoadingAttributes()}>
              <figcaption>Performance auf dem Platz</figcaption>
            </figure>
          </div>
          <div class="golfcal-intro-content">
            <div class="bbcal-intro__head" data-reveal>
              <div><p class="eyebrow">Ein Sport. Zwei Einstiege.</p><h2>Vom offenen Turnier<br><span>bis zur Tour.</span></h2></div>
              <div class="bbcal-intro__copy"><p>Für Clubspieler führen DGV, Landesverbände und Clubs zu Ausschreibungen und Anmeldung. Profis finden Deutschland-Stopps internationaler Touren, Pro Golf Tour und PGA-of-Germany-Termine in einem eigenen Bereich.</p><p><strong>Wichtig:</strong> Ob ein Turnier offen ist, entscheidet immer die Ausschreibung – insbesondere Handicap, Altersklasse, Clubstatus und Meldeschluss.</p></div>
            </div>
            <div class="golfcal-portals" data-reveal>
              <a href="#amateur"><span>01</span><small>Für Club- & Leistungsspieler</small><strong>Amateur & Verband</strong><b aria-hidden="true">↓</b></a>
              <a href="#profis"><span>02</span><small>Touren & PGA of Germany</small><strong>Profi-Portal</strong><b aria-hidden="true">↓</b></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted golfcal-events" id="amateur">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Amateur & Verband</p><h2>Deutsche Meisterschaften und offene Wege.</h2><p>Ausgewählte DGV-Leittermine. Weitere Club- und Landesverbandsturniere findest du über den offiziellen Gesamtkalender und die zwölf Regionalverbände.</p></div>
        <div class="golfcal-official-link"><div><span>Offizieller Gesamtkalender</span><strong>DGV, Landesverbände und Clubs</strong><p>Mit Region, Altersklasse, Turnierart und direkter Anmeldung.</p></div><a class="button button--primary" href="https://www.golf.de/sport/turnierkalender.html" target="_blank" rel="noopener noreferrer"><span>Golf.de Kalender öffnen</span><span aria-hidden="true">↗</span></a></div>
        <div class="golfcal-event-grid">${amateurEvents.map(golfEventCard).join("")}</div>
        ${amateurPastEvents.length ? `<details class="calendar-past-archive calendar-past-archive--golf">
          <summary><span><small>Archiv 2026</small><strong>Vergangene Amateur-Turniere</strong></span><b>${amateurPastEvents.length} Turniere anzeigen</b></summary>
          <div class="calendar-past-archive__content"><div class="golfcal-event-grid">${amateurPastEvents.map(golfEventCard).join("")}</div></div>
        </details>` : ""}
      </div>
    </section>

    <section class="section golfcal-associations">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Alle regionalen Verbände</p><h2>Zwölf Landesgolfverbände.<br>Ein direkter Zugang.</h2><p>Regionalmeisterschaften, Mannschaftswettbewerbe, Jugendserien und offene Turniere werden je Landesverband veröffentlicht.</p></div>
        <div class="golfcal-association-grid">
          ${golfAssociations.map((association) => `<a href="${association.url}" target="_blank" rel="noopener noreferrer"><span>${association.number}</span><small>${association.area}</small><strong>${association.name}</strong><b aria-hidden="true">↗</b></a>`).join("")}
        </div>
        <p class="golfcal-association-note">Verbandsübersicht gegengeprüft über den <a href="https://serviceportal.dgv-intranet.de/verband/partner-verbaende/landesgolfverbaende.cfm" target="_blank" rel="noopener noreferrer">Deutschen Golf Verband ↗</a></p>
      </div>
    </section>

    <section class="section section--dark golfcal-pro" id="profis">
      <div class="section-shell section-shell--wide">
        <div class="bbcal-section-heading" data-reveal><p class="eyebrow">Profi-Portal Deutschland</p><h2>Tourgolf, Pro Golf Tour<br>und PGA-Termine.</h2><p>Die wichtigsten bestätigten Deutschland-Stopps und berufsbezogenen Turniere für Professionals.</p></div>
        <div class="golfcal-event-grid golfcal-event-grid--pro">${professionalEvents.map(golfEventCard).join("")}</div>
        ${professionalPastEvents.length ? `<details class="calendar-past-archive calendar-past-archive--dark">
          <summary><span><small>Archiv 2026</small><strong>Vergangene Profi-Turniere</strong></span><b>${professionalPastEvents.length} Turniere anzeigen</b></summary>
          <div class="calendar-past-archive__content"><div class="golfcal-event-grid golfcal-event-grid--pro">${professionalPastEvents.map(golfEventCard).join("")}</div></div>
        </details>` : ""}
        <div class="golfcal-pro-links">
          <a href="https://www.pga.de/turnierkalender/articles/turnierkalender?year=2026" target="_blank" rel="noopener noreferrer"><span>PGA of Germany</span><strong>Turnierkalender 2026</strong><b>↗</b></a>
          <a href="https://www.progolftour.de/" target="_blank" rel="noopener noreferrer"><span>Development Tour</span><strong>Pro Golf Tour</strong><b>↗</b></a>
          <a href="https://www.golf.de/news/artikel/tour-termine-2026-major-highlights-und-deutschland-stopps-im-ueberblick.html" target="_blank" rel="noopener noreferrer"><span>Tourübersicht</span><strong>Deutschland-Stopps 2026</strong><b>↗</b></a>
        </div>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Turnier zur Athletikplanung",
      text: "Ergänze dein Spiel durch planbare Athletik, Mobilität, Ernährung und Regeneration – damit Leistung und Konzentration auch auf den letzten Löchern stabil bleiben.",
      ref: "golfturniere-kalender"
    })}

    <section class="section bbcal-faq"><div class="section-shell">
      ${sectionHeader({ eyebrow: "Fragen zum Turnierjahr", title: "Vom Kalender zur Startzeit.", text: "Die wichtigsten Unterschiede zwischen offenem Turnier, Verbandsmeisterschaft und Profi-Event." })}
      ${faq(golfCalendarFaq)}
    </div></section>

    <section class="section golfcal-performance-cta">
      <div class="section-shell section-shell--wide golfcal-performance-cta__inner">
        <figure data-reveal><img src="/assets/images/golfturniere-creators-cup.jpg" alt="Dominik Dörfl beim Creators Golf Cup auf dem Grün"${imageLoadingAttributes()}></figure>
        <div class="golfcal-performance-cta__copy" data-reveal>
          <p class="eyebrow">Performance für Golfer</p>
          <h2>Mehr Stabilität.<br>Mehr Kontrolle.<br><span>Mehr Länge, die bleibt.</span></h2>
          <p>Athletik, Beweglichkeit und Belastbarkeit schaffen die Basis, damit Technik auch unter Druck abrufbar bleibt.</p>
          <div class="golfcal-performance-cta__actions">
            <a class="button button--primary" href="${contactHref("premium-training")}"><span>Golf-Performance anfragen</span><span aria-hidden="true">→</span></a>
            <a class="button button--secondary" href="/personal-trainer-nürnberg/"><span>Personal Training ansehen</span><span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  `;

  return layout({
    path: "/golfturniere-2026/",
    title: "Golfturniere 2026: Amateur & Profi | Camp Dörfl",
    description: "Golfturniere 2026 in Deutschland: DGV-Meisterschaften, alle zwölf Landesgolfverbände, offene Turnierwege und ein eigenes Profi-Portal mit Tour- und PGA-Terminen.",
    keywords: ["Golfturniere 2026", "Golf Turnierkalender 2026", "offene Golfturniere Deutschland", "DGV Turniere 2026", "Golf Profi Turniere Deutschland 2026"],
    bodyClass: "page-premium page-bodybuilding-calendar page-golf-calendar",
    pageName: "Golfturniere 2026",
    pageType: "CollectionPage",
    socialImage: "/assets/images/golfturniere-hero.png",
    socialImageAlt: "Golfturniere 2026 – Amateur, Verbände und Profi-Portal",
    extraStructuredData: [itemListSchema, faqSchema("/golfturniere-2026/", golfCalendarFaq)],
    content
  });
}

function sportSpotFinderPage() {
  const sportSpotConfig = JSON.stringify({ categories: sportSpotCategories }).replace(/</g, "\\u003c");
  const popularCategories = sportSpotCategories.filter((category) => popularSportSpotCategoryIds.includes(category.id));
  const additionalCategories = sportSpotCategories.filter((category) => !popularSportSpotCategoryIds.includes(category.id));
  const orderedCategories = [...popularCategories, ...additionalCategories];
  const categoryButton = (category) => {
    const popular = popularSportSpotCategoryIds.includes(category.id);
    return `
    <button class="spot-category${popular ? " spot-category--popular" : " spot-category--additional"}" type="button" data-spot-category="${category.id}"${popular ? "" : " data-spot-category-additional hidden"} aria-pressed="false">
      <span class="spot-category__icon" aria-hidden="true">${category.icon}</span>
      <span>${category.label}</span>
      ${popular ? '<small>Beliebt</small>' : ""}
    </button>
  `;
  };

  const content = `
    <section class="spot-hero">
      <div class="section-shell section-shell--wide spot-hero__inner">
        <div class="spot-hero__copy" data-reveal>
          <p class="eyebrow">Sport in deiner Nähe</p>
          <h1>Finde deinen nächsten <span>Sport Spot.</span></h1>
          <p>Von Fitnessstudio bis Outdoor Court: Suche Sportstätten in ganz Deutschland nach Ort, Entfernung und Sportart.</p>
          <div class="spot-hero__proof" aria-label="Vorteile der Sportsuche">
            <span>20 Sportkategorien</span><span>Deutschlandweit</span><span>Karte & Liste</span>
          </div>
        </div>
        <form class="spot-search" id="sportspot-suche" data-spot-search aria-label="Sport Spot Suche">
          <div class="spot-search__heading">
            <span>01</span>
            <div><small>Dein Suchgebiet</small><strong>Wo möchtest du trainieren?</strong></div>
          </div>
          <label class="spot-field spot-field--place">
            <span>PLZ oder Ort</span>
            <input type="search" name="place" placeholder="z. B. 90427 oder Nürnberg" autocomplete="postal-code" required minlength="2">
          </label>
          <label class="spot-field spot-field--sport">
            <span>Sportart</span>
            <select name="sport" aria-label="Sportart auswählen" required>
              <option value="" selected disabled>Sportart auswählen</option>
              <optgroup label="Beliebte Sportarten">
                ${popularCategories.map((category) => `<option value="${category.id}">${category.label}</option>`).join("")}
              </optgroup>
              <optgroup label="Weitere Sportarten">
                ${additionalCategories.map((category) => `<option value="${category.id}">${category.label}</option>`).join("")}
              </optgroup>
            </select>
          </label>
          <label class="spot-field">
            <span>Umkreis</span>
            <select name="radius" aria-label="Suchradius">
              <option value="25">25 km</option>
              <option value="50" selected>50 km</option>
              <option value="100">100 km</option>
              <option value="200">200 km</option>
            </select>
          </label>
          <button class="button button--primary spot-search__submit" type="submit"><span>Sport Spots finden</span><span aria-hidden="true">→</span></button>
          <p class="spot-search__note">Die Suche nutzt frei zugängliche Kartendaten. Angaben bitte vor dem Besuch beim Anbieter prüfen.</p>
        </form>
      </div>
    </section>

    <section class="section spot-categories" id="sportart">
      <div class="section-shell section-shell--wide">
        <div class="spot-section-head" data-reveal>
          <div><p class="eyebrow">Was suchst du?</p><h2>Wähle deine Sportart.</h2></div>
          <p>Starte mit den beliebtesten Kategorien oder öffne die gesamte Auswahl. Du kannst jederzeit wechseln.</p>
        </div>
        <div class="spot-category-grid" id="sportarten-auswahl" data-spot-category-grid>
          ${orderedCategories.map(categoryButton).join("")}
        </div>
        <button class="spot-category-toggle" type="button" data-spot-category-toggle aria-controls="sportarten-auswahl" aria-expanded="false"><span>Weitere ${additionalCategories.length} Sportarten anzeigen</span><span aria-hidden="true">↓</span></button>
      </div>
    </section>

    <section class="section section--muted spot-discovery" id="ergebnisse">
      <div class="section-shell section-shell--wide">
        <div class="spot-results-head" data-reveal>
          <div><p class="eyebrow">Sport in meiner Nähe entdecken</p><h2>Deine Umgebung. Deine Möglichkeiten.</h2></div>
          <div class="spot-results-count" aria-live="polite"><strong data-spot-count>–</strong><span data-spot-count-label>Sport Spots</span></div>
        </div>

        <div class="spot-results-layout">
          <div class="spot-map" data-spot-map aria-label="Kartenansicht der Sportstätten">
            <div class="spot-map__tiles" data-spot-map-tiles aria-hidden="true"></div>
            <div class="spot-map__grid" aria-hidden="true"></div>
            <div class="spot-map__pins" data-spot-map-pins></div>
            <div class="spot-map__empty" data-spot-map-empty>
              <span>DE</span><strong>Deine Karte startet hier.</strong><p>Ort eingeben, Sportart wählen und passende Spots entdecken.</p>
            </div>
            <div class="spot-map__badge"><span aria-hidden="true">◎</span><span data-spot-map-label>Deutschland</span></div>
            <div class="spot-map__attribution" data-spot-attribution hidden>Kartendaten © OpenStreetMap-Mitwirkende</div>
          </div>

          <div class="spot-results-panel">
            <div class="spot-results-status" data-spot-status role="status">
              <span class="spot-results-status__mark" aria-hidden="true">01</span>
              <div><strong>Bereit für deine Suche</strong><p>Gib oben eine Postleitzahl oder einen Ort ein. Die passenden Sportstätten erscheinen hier und auf der Karte.</p></div>
            </div>
            <div class="spot-result-list" data-spot-results></div>
            <div class="spot-results-actions" data-spot-results-actions hidden>
              <button class="spot-load-more" type="button" data-spot-load-more>Weitere Spots anzeigen</button>
              <a href="#sportspot-suche">Suche ändern ↑</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section spot-nearby">
      <div class="section-shell section-shell--wide">
        <div class="spot-section-head" data-reveal>
          <div><p class="eyebrow">Direkt loslegen</p><h2>Sportmöglichkeiten, die zu deinem Alltag passen.</h2></div>
          <p>Entdecke Orte für eine spontane Einheit draußen oder finde das passende Trainingsangebot mit Ausstattung und Betreuung.</p>
        </div>
        <div class="spot-nearby-grid">
          <button class="spot-nearby-card spot-nearby-card--outdoor" type="button" data-spot-shortcut="outdoor">
            <span class="spot-nearby-card__number">01</span><small>Draußen trainieren</small><strong>Outdoor Training Möglichkeiten</strong><p>Fitnessparks, Calisthenics-Anlagen und frei zugängliche Trainingsflächen in deiner Umgebung.</p><span class="spot-nearby-card__action">Outdoor Spots entdecken →</span>
          </button>
          <button class="spot-nearby-card spot-nearby-card--gym" type="button" data-spot-shortcut="fitness">
            <span class="spot-nearby-card__number">02</span><small>Training mit Ausstattung</small><strong>Gyms und ähnliche Angebote</strong><p>Fitnessstudios, Sportzentren und Functional-Training-Spots passend zu deinem Suchgebiet.</p><span class="spot-nearby-card__action">Gyms entdecken →</span>
          </button>
        </div>
      </div>
    </section>

    ${appTrafficPromo({
      eyebrow: "Vom Sport Spot zum Trainingsplan",
      text: "Der passende Ort ist gefunden. Jetzt planst du Einheiten, Ernährung und Fortschritt in einem System – damit aus einzelnen Workouts eine klare Entwicklung wird.",
      ref: "sport-spot-finder"
    })}

    <section class="spot-how">
      <div class="section-shell section-shell--wide">
        <div><p class="eyebrow">So einfach geht's</p><h2>Drei Angaben. Ein passender Spot.</h2></div>
        <ol><li><span>01</span><strong>Ort festlegen</strong><p>PLZ oder Stadt und gewünschten Umkreis eingeben.</p></li><li><span>02</span><strong>Sportart wählen</strong><p>Eine von 20 großen Kategorien auswählen.</p></li><li><span>03</span><strong>Spot entdecken</strong><p>Ergebnisse auf Karte und in der übersichtlichen Liste vergleichen.</p></li></ol>
      </div>
    </section>
    <script id="sportspot-config" type="application/json">${sportSpotConfig}</script>
  `;

  return layout({
    path: "/sport-spot-finden/",
    title: "Sport Spot finden: Sportstätten in deiner Nähe | Camp Dörfl",
    description: "Finde Fitnessstudios, Schwimmbäder, Padel-, Tennis- und Fußballplätze sowie viele weitere Sportstätten nach Ort, Umkreis und Sportart auf der Karte.",
    keywords: ["Sportstätte in der Nähe", "Fitnessstudio finden", "Sportplatz finden", "Sport in meiner Nähe", "Padel Platz in der Nähe", "Outdoor Training in der Nähe"],
    bodyClass: "page-premium page-sport-spots",
    pageName: "Sport Spot finden",
    pageType: "SearchResultsPage",
    socialImageAlt: "Sport Spot finden – Sportstätten in deiner Nähe",
    content
  });
}

function pressMediaPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--photo ff-hero--about">
      <img class="ff-hero__img" src="/assets/images/dominik-about-training-hero.jpg" alt="Dominik Dörfl beim Ausdauertraining im Fitnessstudio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Presse, Medien &amp; Redaktion</p>
          <h1 class="ff-hero__title" data-reveal>Fakten. Bilder.<br><span>Direkte Quellen.</span></h1>
          <p class="ff-hero__lead" data-reveal>Verlässliche Informationen zu Dominik Dörfl und Camp Dörfl für Interviews, Porträts, Veranstaltungsberichte und redaktionelle Verlinkungen.</p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="mailto:${site.email}?subject=Presseanfrage%20Camp%20D%C3%B6rfl"><span>Presseanfrage senden</span><span aria-hidden="true">→</span></a>
            <a class="button button--secondary-light" href="#medienmaterial"><span>Material &amp; Links</span><span aria-hidden="true">↓</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Eckdaten">
            <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
            <div><dt>IFBB</dt><dd>Pro Bodybuilding</dd></div>
            <div><dt>Nürnberg</dt><dd>Standort</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section" id="medienmaterial"><div class="section-shell section-shell--wide">
      ${sectionHeader({
        eyebrow: "Redaktionell nutzbar",
        title: "Die wichtigsten Fakten auf einen Blick.",
        text: "Bitte Aussagen im jeweiligen Kontext prüfen. Für aktuelle Zahlen, Interviewtermine oder Freigaben genügt eine direkte Anfrage."
      })}
      ${featureGrid([
        { detail: "Person", title: "Dominik Dörfl", text: "Gründer von Camp Dörfl, Personal Trainer, Coach, Moderator, IFBB Pro Bodybuilder, zweifacher Deutscher Meister und Ironman-70.3-Finisher." },
        { detail: "Unternehmen", title: "Camp Dörfl", text: "Performance-System aus Personal Training, Firmenfitness, Event-Moderation, digitaler App und sportlicher Community mit Sitz in Nürnberg." },
        { detail: "Expertise", title: "Training & Performance", text: "Themenfelder sind individuelles Training, Körperanalyse, Ernährung, Wettkampfvorbereitung, Firmenfitness und langfristige Leistungsfähigkeit." },
        { detail: "Interview", title: "Mögliche Themen", text: "Coaching im Leistungssport, alltagstaugliche Performance, Firmenfitness, Bodybuilding, Ausdauer, Moderation sowie die Verbindung von analoger und digitaler Betreuung." }
      ])}
    </div></section>

    <section class="section section--muted"><div class="section-shell section-shell--wide">
      ${sectionHeader({ eyebrow: "Zitierfähige Ziele", title: "Bitte direkt auf die passende Originalseite verlinken.", text: "Thematisch genaue Links helfen Leserinnen, Lesern und Suchmaschinen besser als ein pauschaler Verweis auf die Startseite." })}
      <div class="bbc-flow__grid">
        <a href="/ueber-dominik/" data-reveal><span>01 · Person</span><h3>Über Dominik Dörfl</h3><p>Werdegang, sportliche Stationen und Arbeitsweise.</p><b>Profil öffnen →</b></a>
        <a href="/erfolge-im-team/" data-reveal><span>02 · Nachweise</span><h3>Erfolge im Team</h3><p>Dokumentierte Resultate aus Coaching und Leistungssport.</p><b>Erfolge öffnen →</b></a>
        <a href="/personal-trainer-nürnberg/" data-reveal><span>03 · Angebot</span><h3>Personal Trainer Nürnberg</h3><p>Leistungsumfang, Zielgruppen und regionale Betreuung.</p><b>Leistungsseite öffnen →</b></a>
      </div>
    </div></section>

    <section class="section"><div class="section-shell section-shell--wide">
      ${sectionHeader({ eyebrow: "Medienmaterial", title: "Logo und Ansprechpartner.", text: "Das Logo darf im Rahmen einer redaktionellen Berichterstattung unverändert verwendet werden. Für werbliche Nutzung oder Kooperationen bitte vorher anfragen." })}
      <div class="bbc-flow__grid">
        <a href="/assets/images/camp-doerfl-logo.png" download data-reveal><span>PNG · Original</span><h3>Camp-Dörfl-Logo</h3><p>Quadratische Originaldatei für redaktionelle Beiträge.</p><b>Logo herunterladen ↓</b></a>
        <a href="/assets/media/camp-doerfl-kurzprofil.txt" download data-reveal><span>TXT · Redaktion</span><h3>Kurzprofil &amp; Fachgebiete</h3><p>Zitierfähige Kurzbiografie, kanonische Links und Kontaktdaten in einer Datei.</p><b>Kurzprofil herunterladen ↓</b></a>
        <a href="mailto:${site.email}?subject=Bildmaterial%20Camp%20D%C3%B6rfl" data-reveal><span>Fotos</span><h3>Hochauflösendes Bildmaterial</h3><p>Motiv, Format und geplante Veröffentlichung kurz angeben.</p><b>Bildmaterial anfragen →</b></a>
        <a href="mailto:${site.email}?subject=Interviewanfrage%20Dominik%20D%C3%B6rfl" data-reveal><span>Kontakt</span><h3>Interview mit Dominik</h3><p>${site.email} · persönliche Abstimmung ohne Presseverteiler.</p><b>Interview anfragen →</b></a>
      </div>
    </div></section>

    ${ctaSection({
      eyebrow: "Pressekontakt",
      title: "Du brauchst eine schnelle, belastbare Einordnung?",
      text: "Sende Thema, Medium, gewünschtes Format und Deadline. So lässt sich die Anfrage direkt passend beantworten.",
      primary: { label: "Presseanfrage per E-Mail", href: `mailto:${site.email}?subject=Presseanfrage%20Camp%20D%C3%B6rfl` },
      secondary: { label: "Über Dominik", href: "/ueber-dominik/" }
    })}
  `;

  return layout({
    path: "/presse-medien/",
    title: "Presse & Medien | Dominik Dörfl und Camp Dörfl",
    description: "Pressebereich von Camp Dörfl: verlässliche Fakten, zitierfähige Originalseiten, Logo, Bildmaterial und direkter Kontakt zu Dominik Dörfl in Nürnberg.",
    bodyClass: "page-premium page-press-media",
    pageName: "Presse und Medien",
    pageType: "CollectionPage",
    dateModified: "2026-08-11",
    socialImage: "/assets/images/dominik-about-training-hero.jpg",
    socialImageAlt: "Dominik Dörfl – Presse und Medien",
    content
  });
}

export const pages = [
  { route: "/", render: homePage, lastModified: "2026-08-11" },
  { route: "/app/", render: appPage },
  { route: "/personal-training-kosten-nuernberg/", render: personalTrainingCostPage, lastModified: "2026-08-11" },
  { route: "/personal-trainer-nürnberg/", render: personalCoachingPage, lastModified: "2026-08-11" },
  { route: "/gesundheitstag-nuernberg/", render: gesundheitstagNuernbergPage },
  { route: "/koerperanalyse-nuernberg/", render: koerperanalyseNuernbergPage },
  { route: "/firmenfitness/", render: firmenfitnessPage, lastModified: "2026-08-11" },
  { route: "/events/", render: eventsPage },
  { route: "/partner/", render: partnerPage },
  { route: "/bodybuilding-coaching-wettkampfvorbereitung/", render: bodybuildingCoachingPage, lastModified: "2026-08-11" },
  { route: "/bodybuilding-wettkaempfe-2026/", render: bodybuildingCalendarPage, lastModified: "2026-08-10" },
  { route: "/bodybuilding-klassen-gewichtslimits/", render: bodybuildingClassesPage, lastModified: "2026-08-11" },
  { route: "/boxen-wettkaempfe-2026/", render: boxingCalendarPage },
  { route: "/triathlon-kalender-2026/", render: triathlonCalendarPage },
  { route: "/laufkalender-2026/", render: runningCalendarPage },
  { route: "/golfturniere-2026/", render: golfCalendarPage },
  { route: "/sport-spot-finden/", render: sportSpotFinderPage },
  { route: "/executive-performance/", render: executivePerformancePage },
  { route: "/erfolge-im-team/", render: teamSuccessPage },
  { route: "/erfolge-im-team/guenter-preis/", render: guenterPreisStoryPage },
  { route: "/ueber-dominik/", render: ueberDominikPage },
  { route: "/presse-medien/", render: pressMediaPage, lastModified: "2026-08-11" },
  { route: "/expertenwissen/", render: expertKnowledgePage, lastModified: "2026-08-11" },
  { route: "/personal-trainer-auswaehlen-nuernberg/", render: choosePersonalTrainerGuidePage, lastModified: "2026-08-11" },
  { route: "/bodybuilding-wettkampfvorbereitung-dauer/", render: contestPrepDurationGuidePage, lastModified: "2026-08-11" },
  { route: "/bia-inbody-koerperanalyse-vergleich/", render: biaComparisonGuidePage, lastModified: "2026-08-11" },
  { route: "/redaktionelle-richtlinien/", render: editorialGuidelinesPage, lastModified: "2026-08-11" },
  { route: "/impressum/", render: impressumPage, includeInSitemap: false },
  { route: "/cookies/", render: cookiesPage, includeInSitemap: false },
  { route: "/datenschutz/", render: privacyPage, includeInSitemap: false },
  { route: "/datenschutzformular-app/", render: appPrivacyPage, includeInSitemap: false },
  { route: "/werbung-partnerlinks/", render: partnerTransparencyPage, includeInSitemap: false },
  { route: "/barrierefreiheit/", render: accessibilityPage, includeInSitemap: false },
  { route: "/kontakt/", render: contactPage, lastModified: "2026-08-11" }
];
