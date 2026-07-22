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
  processList,
  proofMosaic,
  sectionHeader,
  socialButtonLabel,
  socialIconLink,
  socialIconLinks,
  summaryRows,
  timelineList,
  transformationGrid
} from "./components.mjs";

function serviceSchema({ path, name, serviceType, description }) {
  return {
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name,
    serviceType,
    description,
    provider: { "@id": `${site.url}/#business` },
    areaServed: [
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

function videoObjectSchema({ path, id, name, description, thumbnailUrl, embedUrl, watchUrl }) {
  return {
    "@type": "VideoObject",
    "@id": `${site.url}${path}#${id}`,
    name,
    description,
    thumbnailUrl: [absoluteUrl(thumbnailUrl)],
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
      "Der passende Rahmen hängt davon ab, ob du einzelne Personal Trainings, eine 5er- oder 10er-Karte oder die volle Premium-Begleitung suchst. In einer kurzen Beratung wird sauber eingeordnet, welches Setup zu Ziel, Kalender und Betreuungsintensität passt."
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
    question: "Wie läuft ein Gesundheitstag mit Camp Dörfl ab?",
    answer:
      "Zuerst werden Mitarbeitende über 2D-Technik und InBody ausgewertet. Danach folgt die direkte, verständliche Beratung mit klaren Empfehlungen für Alltag, Ernährung und Routinen."
  },
  {
    question: "Für wie viele Mitarbeitende kann Firmenfitness geplant werden?",
    answer:
      "Sowohl kleinere Teams als auch größere Gesundheitstage sind möglich. Die Organisation wird so geplant, dass Teilnehmerzahl, Taktung und Beratungsqualität zusammenpassen."
  },
  {
    question: "Kann die Beratung an das Berufsmodell angepasst werden?",
    answer:
      "Ja. Genau das ist ein zentraler Punkt des Formats: Empfehlungen werden an Schichtmodell, Büroalltag, körperliche Arbeit oder Führungsverantwortung angepasst."
  },
  {
    question: "Wie viel Abstimmung braucht das intern im Unternehmen?",
    answer:
      "So wenig wie möglich und so viel wie nötig. Camp Dörfl hilft dabei, Organisation, Kommunikation und Durchführung klar zu strukturieren, damit das Format intern leicht organisierbar bleibt."
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
      "Technik, Struktur und direkter Trainingsreiz — als Einzeltermin oder 5er-/10er-Karte, ganz ohne Bindung."
  },
  {
    detail: "Premium Coaching",
    title: "Premium Betreuung",
    text:
      "Eng geführtes System aus gemeinsamen Trainings, 2D-Analyse, Fortschrittskontrolle sowie Trainings- und Ernährungsplanung."
  },
  {
    detail: "Digitaler Zugang",
    title: "Camp Dörfl App",
    text:
      "Der digitale Einstieg in individuelle Betreuung über Planung, Struktur und klare Fortschrittslogik."
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
    titleHtml: "<span>MODERATOR</span> &amp; GASTGEBER",
    text:
      "INTERVIEWS, OPENINGS UND BÜHNENFÜHRUNG MIT KLARER WIRKUNG.",
    image: "/assets/images/dominik-stage-suit.webp",
    alt: "Dominik Dörfl als Moderator bei einem Firmenevent",
    theme: "accent",
    href: "/events/",
    buttonLabel: "EVENT PLANEN"
  },
  {
    detail: "02 / CORPORATE HEALTH",
    titleHtml: "GESUNDHEITSTAGE, <span>DIE ETWAS BEWEGEN.</span>",
    text:
      "2D-SCAN, INBODY UND BERATUNG FÜR STARKE GESUNDHEITSTAGE.",
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    alt: "Firmenfitness mit InBody Messung und persönlicher Beratung",
    theme: "light",
    href: "/firmenfitness/",
    buttonLabel: "GESUNDHEITSTAG PLANEN"
  },
  {
    detail: "03 / PREMIUM COACHING",
    titleHtml: "PERSONAL TRAINING <span>VOM PROFI.</span>",
    text:
      "TRAINING UND ERNÄHRUNG IN PERSÖNLICHER PREMIUM-BEGLEITUNG.",
    image: "/assets/images/dominik-personal-coaching-client.webp",
    alt: "Dominik Dörfl mit einem Klienten im Personal Training im Studio",
    theme: "coaching",
    href: "/personal-coaching/",
    buttonLabel: "TRAINIERE MIT MIR"
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
    detail: "Analyse",
    title: "2D-Technik und InBody als starker Startpunkt",
    text:
      "Mitarbeitende bekommen eine präzise Standortbestimmung. Körperdaten werden sichtbar, verständlich und professionell eingeordnet.",
    points: ["sichtbarer Startpunkt", "saubere Datengrundlage", "professionell erklärt"],
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    alt: "Dominik Doerfl im Firmenfitness-Kontext bei Analyse und Einordnung",
    imagePosition: "center 36%"
  },
  {
    number: "02",
    detail: "Beratung",
    title: "Individuelle Einordnung vom Profi",
    text:
      "Nach der Messung folgt die Beratung: Ernährung, Bewegung und Routinen werden passend zum Arbeitsmodell erklärt.",
    points: ["alltagstaugliche Empfehlungen", "Ernaehrung & Routinen", "zum Berufsmodell passend"],
    image: "/assets/images/dominik-athlete-nutrition.webp",
    alt: "Dominik Doerfl im Kontext von Ernaehrung und Beratung",
    imagePosition: "center 24%"
  },
  {
    number: "03",
    detail: "Umsetzung",
    title: "Einfaches Format, starke Wirkung",
    text:
      "Das Angebot ist leicht in Unternehmen integrierbar und hat sich bereits mehrfach in kurzer Zeit erfolgreich verkauft.",
    points: ["leicht intern organisierbar", "direkt nutzbar im Team"],
    image: "/assets/images/dominik-athlete-bike-yellow.webp",
    alt: "Dominik Doerfl in einer aktiven Performance-Szene",
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
        <source media="(max-width: 900px)" srcset="/assets/images/home-hero-stadium-mobile.webp">
        <img class="ff-hero__img" src="/assets/images/home-hero-stadium-wide.webp" srcset="/assets/images/home-hero-stadium-wide-960.webp 960w, /assets/images/home-hero-stadium-wide.webp 1717w" sizes="100vw" alt="Dominik Dörfl mit einem Wegbegleiter als Ironman-Finisher im Stadion"${imageLoadingAttributes({ eager: true })}>
      </picture>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Personal Training · Firmenfitness · Events · Nürnberg</p>
        <h1 class="ff-hero__title" data-reveal>Gesundheit.<br>Leistung.<br><span>Präsenz.</span></h1>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref()}"><span>Beratung anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--ghost" href="#einstiege"><span>Vier Einstiege ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Camp Dörfl in Zahlen">
          <div><dt>Moderator</dt><dd>knapp 100 Events</dd></div>
          <div><dt>Firmenfitness</dt><dd>für gesunde Unternehmen</dd></div>
          <div><dt>Fitness Trainer</dt><dd>ausgebildet & zertifiziert</dd></div>
          <div><dt>Profi Athlet</dt><dd>Fitness &amp; Bodybuilding</dd></div>
          <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
          <div><dt>Ironman</dt><dd>Finisher</dd></div>
        </dl>
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
                ({ titleHtml, image, alt, href, buttonLabel, theme }) => `
                  <a class="ed-entry ed-entry--${theme}" href="${href}" data-reveal>
                  <div class="ed-entry__media">
                    <img src="${image}" alt="${alt}"${imageLoadingAttributes()}>
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
          <a class="ed-app-banner" href="/app/" data-reveal>
            <div class="ed-app-banner__media">
              <img src="/assets/images/home-app-banner-coaching.webp" alt="Dominik Dörfl zeigt die Camp Dörfl App im Training"${imageLoadingAttributes()}>
            </div>
            <div class="ed-app-banner__content">
              <h3>Deine Fitness.<br><span>Komplett begleitet.</span></h3>
              <p class="ed-app-banner__offer">Jetzt 7 Tage kostenlos testen!</p>
              <span class="ed-app-banner__cta">Zur Camp Dörfl App <span aria-hidden="true">&rarr;</span></span>
            </div>
          </a>
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
                <blockquote>„Einfach perfekt.“</blockquote>
                <figcaption>ron D. <span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Sehr professionelle Betreuung. Sehr gute Beratung.“</blockquote>
                <figcaption>Michael T. <span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Super Beratung, jederzeit erreichbar und für jede Frage eine kompetente Antwort.“</blockquote>
                <figcaption>Deniz I. <span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Top Service, super empathisch auf mich eingegangen. Ich bin sehr zufrieden!“</blockquote>
                <figcaption>Stefan S. <span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Die Trainings- und Ernährungspläne sind perfekt auf die persönlichen Bedürfnisse und Ziele abgestimmt.“</blockquote>
                <figcaption>Leon S. <span>Google Bewertung</span></figcaption>
              </figure>
              <figure class="ed-google-review" data-reveal>
                <div class="ed-google-review__stars" aria-label="5 von 5 Sternen">★★★★★</div>
                <blockquote>„Best Coach ever.“</blockquote>
                <figcaption>Günter P. <span>Google Bewertung</span></figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Nächster Schritt",
      title: "Starte mit dem Bereich, der gerade zu dir passt.",
      text:
        "Eine kurze Anfrage reicht. Danach klären wir, ob Premium Personal Training, Firmenfitness, Events oder die App der richtige Einstieg ist.",
      primary: { label: "Anfrage starten", href: contactHref() }
    })}
  `;

  return layout({
    path: "/",
    bodyClass: "page-premium page-home-reboot",
    title: "Camp Dörfl | Performance & Personal Training Nürnberg",
    description:
      "Camp Dörfl in Nürnberg bündelt Premium Personal Training, Firmenfitness, Event-Moderation und App-Struktur in einem klaren Performance-System.",
    pageName: "Camp Dörfl",
    socialImage: "/assets/images/home-hero-stadium-wide-social.jpg",
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
          <a class="button button--secondary-light" href="/app/"><span>App dazu ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Leistungsbausteine im Premium Personal Training">
          <div><dt>1:1</dt><dd>Persönliche Führung</dd></div>
          <div><dt>2D</dt><dd>Analyse & InBody</dd></div>
          <div><dt>App</dt><dd>Check-ins & Steuerung</dd></div>
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

    <section class="section section--muted">
      <div class="section-shell section-shell--wide">
          ${sectionHeader({
            eyebrow: "Dein Personal Trainer Nürnberg",
            title: "Was dein Personal Training wirklich voranbringt.",
            text:
              "Zum Start erfassen wir deinen Status messbar. Darauf bauen individueller Trainings- und Ernährungsplan, regelmäßige Anpassungen und eine Überprüfung alle vier Wochen auf.",
          align: "center"
        })}
        ${featureGrid(coachingAudienceCards, "feature-grid--coaching-flow")}
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
                <h3>Präsenz statt Show</h3>
                <p>Man sieht sofort, wie eng Training, Ausstrahlung und persönliche Begleitung hier zusammengehören.</p>
              </article>
              <article class="summary-row">
                <h3>Kurzer Clip, klares Gefühl</h3>
                <p>Gerade im kompakten Format wird sichtbar, wie direkt, hochwertig und nahbar das Coaching aufgebaut ist.</p>
              </article>
            </div>
          </div>
          <div class="coaching-reference-stage__media editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
            ${deferredVideoEmbed({
              embedUrl: "https://www.youtube-nocookie.com/embed/bP7DKqZu5xc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
              watchUrl: "https://youtube.com/shorts/bP7DKqZu5xc?si=VaGdauquMqCuWNyE",
              title: "Camp Dörfl Premium Personal Training",
              image: "/assets/images/premium-training-short-reference.jpg",
              alt: "YouTube Short als Referenz fuer Camp Doerfl Premium Personal Training",
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
            <p><a href="/personal-training-kosten-nuernberg/">Hier erklären wir, wann Einzelsessions, Karten oder eine Premium Begleitung in Nürnberg sinnvoll sind.</a></p>
          </article>
        </div>
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
    path: "/personal-coaching/",
    title: "Personal Trainer Nürnberg | 1:1 Coaching & Ernährung | Camp Dörfl",
    description:
      "Personal Trainer Nürnberg: 1:1 Coaching mit Training, 2D-Körperanalyse, InBody, Ernährungsplan und persönlicher App-Begleitung bei Camp Dörfl.",
    keywords: ["Personal Trainer Nürnberg", "Personal Training Nürnberg", "Premium Personal Training Nürnberg", "1:1 Personal Training Nürnberg", "Ernährungscoaching Nürnberg"],
    bodyClass: "page-premium page-coaching",
    socialImage: "/assets/images/premium-training-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl beim Personal Training mit einem Kunden in Nürnberg",
    extraStructuredData: [
      serviceSchema({
        path: "/personal-coaching/",
        name: "Personal Trainer Nürnberg – Camp Dörfl",
        serviceType: "Personal Training in Nürnberg",
        description:
          "Persönlich geführtes Personal Training in Nürnberg mit Analyse, Ernährungsplanung, App und laufender Anpassung."
      }),
      faqSchema("/personal-coaching/", coachingFaq),
      videoObjectSchema({
        path: "/personal-coaching/",
        id: "premium-training-video",
        name: "Camp Dörfl Premium Personal Training",
        description:
          "Video-Einblick in das Premium Personal Training von Camp Dörfl mit persönlicher Führung, Training und alltagstauglicher Struktur.",
        thumbnailUrl: "/assets/images/dominik-personal-coaching-client.webp",
        embedUrl: "https://www.youtube-nocookie.com/embed/KTvHOvTNJ8w?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://www.youtube.com/watch?v=KTvHOvTNJ8w"
      }),
      videoObjectSchema({
        path: "/personal-coaching/",
        id: "premium-training-short",
        name: "Camp Dörfl Premium Personal Training Short",
        description:
          "Kurzer Videoeinblick in die direkte 1:1 Zusammenarbeit im Premium Personal Training von Camp Dörfl.",
        thumbnailUrl: "/assets/images/premium-training-short-reference.jpg",
        embedUrl: "https://www.youtube-nocookie.com/embed/bP7DKqZu5xc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://youtube.com/shorts/bP7DKqZu5xc?si=VaGdauquMqCuWNyE"
      })
    ],
    content
  });
}

function firmenfitnessPage() {
  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--firmenfitness ff-hero--firmenfitness-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/firmenfitness-hero-wide.webp" srcset="/assets/images/firmenfitness-hero-wide-960.webp 960w, /assets/images/firmenfitness-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl im Firmenfitness-Kontext mit Analyse und Beratung für Unternehmen"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Gesundheitstage · Performance Checks</p>
          <h1 class="ff-hero__title" data-reveal>Firmenfitness <br><span>in Nürnberg.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Firmenfitness in Nürnberg mit 2D-Analyse, InBody, individueller Beratung und Formaten, die für Mitarbeitende verständlich und für Unternehmen leicht organisierbar bleiben.
          </p>
          <p class="ff-hero__support" data-reveal>
            Gesundheitstage, Performance Checks und Vorträge werden so aufgebaut, dass sie professionell wirken, verständlich bleiben und organisatorisch sauber laufen.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("firmenfitness")}"><span>Firmenfitness anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="/events/"><span>Events ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="premium-proof-pills ff-hero__pills" data-reveal>
            <span>Gesundheitstage</span>
            <span>Performance Checks</span>
            <span>Vorträge</span>
            <span>Team-Aktivierung</span>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Firmenfitness-Module">
            <div><dt>2-D</dt><dd>Körperanalyse</dd></div>
            <div><dt>Beratung</dt><dd>vom Profi</dd></div>
            <div><dt>vor Ort</dt><dd>im Unternehmen</dd></div>
          </dl>
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
          <h2>Firmenfitness in Nürnberg: Gesundheitstage professionell umgesetzt.</h2>
          <p>
            Von Unternehmen bis Bildungseinrichtung: Analyse, InBody und individuelle Beratung kommen dort zum Einsatz, wo Gesundheit hochwertig, verständlich und wirksam vermittelt werden soll.
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
            title: "Gesundheitstage, die intern verständlich und hochwertig wirken.",
            text:
              "Camp Dörfl übersetzt Gesundheitsdaten, Aktivierung und Beratung so, dass Mitarbeitende ihren Status verstehen und Unternehmen ein professionell kommunizierbares Format bekommen."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Gesundheit wird konkret</h3>
              <p>Mitarbeitende sehen nicht nur Zahlen, sondern verstehen direkt, was Analyse, InBody und Beratung für ihren Alltag bedeuten.</p>
            </article>
            <article class="summary-row">
              <h3>Format mit Außenwirkung</h3>
              <p>Für Unternehmen entsteht ein Gesundheitstag, der hochwertig wirkt, intern leichter vermittelbar ist und organisatorisch realistisch bleibt.</p>
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
          eyebrow: "Leistung im Unternehmen",
          title: "Wie Camp Dörfl Firmenfitness strukturiert.",
          text:
            "Analyse, Einordnung und konkrete Empfehlungen bauen logisch aufeinander auf und machen das Format intern leicht vermittelbar.",
          align: "left"
        })}
        ${corporateModuleShowcase(corporateModuleCards)}
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

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Gesundheitstag",
          title: "Wie läuft ein Gesundheitstag in Nürnberg ab?",
          text:
            "Wenn Sie Firmenfitness intern planen und zuerst Aufwand, Ablauf und Bausteine verstehen wollen, hilft diese Seite vor der Anfrage."
        })}
        <div class="summary-rows summary-rows--compact">
          <article class="summary-row" data-reveal>
            <h3>Planung vor Angebot</h3>
            <p>Teilnehmerzahl, Zeitfenster, Zielbild und gewünschte Tiefe entscheiden darüber, wie ein Gesundheitstag sinnvoll aufgebaut wird.</p>
          </article>
          <article class="summary-row" data-reveal>
            <h3>Mehr Orientierung für Unternehmen</h3>
            <p><a href="/gesundheitstag-nuernberg/">Hier zeigen wir, wie ein Gesundheitstag in Nürnberg aufgebaut sein kann und welche Bausteine sich bewährt haben.</a></p>
          </article>
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
        "Camp Dörfl entwickelt Formate für Unternehmen, die Gesundheit, Performance und Teamkultur professionell verbinden wollen.",
      primary: { label: "Firmenfitness anfragen", href: contactHref("firmenfitness") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/firmenfitness/",
    title: "Firmenfitness Nürnberg | Gesundheitstage & BGM | Camp Dörfl",
    description:
      "Firmenfitness in Nürnberg mit Gesundheitstagen, 2D-Analyse, InBody und individueller Beratung für Unternehmen von Camp Dörfl.",
    keywords: ["Firmenfitness Nürnberg", "Gesundheitstag Nürnberg", "BGM Nürnberg", "Betriebliche Gesundheitsförderung Nürnberg"],
    bodyClass: "page-premium page-firmenfitness",
    socialImage: "/assets/images/firmenfitness-hero-wide-social.jpg",
    socialImageAlt: "Dominik Dörfl bei einer Firmenfitness-Analyse und Beratung",
    extraStructuredData: [
      serviceSchema({
        path: "/firmenfitness/",
        name: "Firmenfitness Nürnberg – Camp Dörfl",
        serviceType: "Firmenfitness und Gesundheitstage",
        description:
          "Gesundheitstage, Performance Checks, Analysen und Beratung für Unternehmen in Nürnberg und der Region."
      }),
      faqSchema("/firmenfitness/", corporateFaq),
      videoObjectSchema({
        path: "/firmenfitness/",
        id: "firmenfitness-video",
        name: "Camp Dörfl Firmenfitness Querformat",
        description:
          "Video-Einblick in Firmenfitness und Gesundheitstage von Camp Dörfl mit Aktivierung, Analyse und verständlicher Beratung.",
        thumbnailUrl: "/assets/images/dominik-bike-blue-social.jpg",
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
            alt: "Vorschaubild fuer das Event-Video von Camp Doerfl",
            headline: "Events live erleben.",
            actionLabel: "Video laden"
          })}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell editorial-stage">
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
            alt: "Dominik Dörfl fuehrt ein Interview auf einer Event-Buehne",
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
        embedUrl: "https://www.youtube-nocookie.com/embed/yhV7cyw2Pgg?autoplay=1&rel=0&modestbranding=1&playsinline=1",
        watchUrl: "https://youtu.be/yhV7cyw2Pgg"
      })
    ],
    content
  });
}

function teamSuccessPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--photo ff-hero--team">
      <img class="ff-hero__img" src="/assets/images/dominik-moderator-mic.webp" alt="Dominik Dörfl mit Mikrofon bei einer Moderation auf der Bühne"${imageLoadingAttributes({ eager: true })}>
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
            <a class="button button--secondary-light" href="/personal-coaching/"><span>Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Erfolge bei Camp Dörfl">
            <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
            <div><dt>Profi</dt><dd>Athletik & Bühne</dd></div>
            <div><dt>System</dt><dd>App bis Alltag</dd></div>
          </dl>
        </div>
        <div class="ff-hero__showcase ff-hero__showcase--photo" data-reveal>
          <figure class="ff-hero__photo-card">
            <img src="/assets/images/dominik-moderator-mic.webp" alt="Dominik Dörfl mit Mikrofon als Moderator"${imageLoadingAttributes()}>
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
    socialImage: "/assets/images/dominik-moderator-mic-social.jpg",
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
          <a class="button button--secondary-light" href="/personal-coaching/"><span>Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
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
      <img class="ff-hero__img" src="/assets/images/dominik-stage-suit.webp" alt="Dominik Dörfl im Anzug auf der Bühne als Moderator und Performance Coach"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <div class="premium-badge">
            <span>ÜBER DOMINIK</span>
            <small>Unternehmer, Athlet, Coach und Gründer von Camp Dörfl.</small>
          </div>
          <p class="ff-hero__eyebrow" data-reveal>Die Person hinter Camp Dörfl</p>
          <h1 class="ff-hero__title" data-reveal>Dominik.<br>Dörfl.<br><span>Performance gelebt.</span></h1>
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
            <img src="/assets/images/dominik-stage-suit.webp" alt="Dominik Dörfl im Anzug auf der Bühne"${imageLoadingAttributes()}>
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
      <div class="section-shell editorial-stage">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Kurzprofil",
            title: "Dominik Dörfl in Stichpunkten."
          })}
          <ul class="premium-checklist premium-checklist--columns">
            ${facts.map((fact) => `<li>${fact}</li>`).join("")}
          </ul>
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-bodybuilding-desert.webp" alt="Dominik Dörfl als Bodybuilder"${imageLoadingAttributes()}>
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
          text: "Diese Datenschutzerklärung gilt für die Website ${site.domain}. Stand: 17. Juni 2026.",
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
              <li>YouTube-Inhalte werden erst nach Ihrer Freigabe geladen und können danach im sichtbaren Bereich automatisch und stumm starten.</li>
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
          <h2>5. Externe Links</h2>
          <p>Diese Website verlinkt auf externe Angebote, insbesondere Instagram, YouTube und Partner-Websites. Wenn Sie einen solchen Link anklicken, verlassen Sie diese Website. Ab diesem Zeitpunkt gilt ausschließlich die Datenschutzerklärung des jeweiligen Anbieters.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>6. Speicherdauer</h2>
          <p>Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
          <p>Technische Verbindungsdaten werden nur im für Betrieb, Sicherheit und Fehleranalyse erforderlichen Umfang verarbeitet. Inhalte aus der Kontaktaufnahme speichere ich nur so lange, wie dies zur Bearbeitung Ihrer Anfrage oder zur Erfüllung gesetzlicher Pflichten nötig ist.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h2>7. Ihre Rechte</h2>
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
          <h2>8. Beschwerderecht bei einer Aufsichtsbehörde</h2>
          <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Für private Anbieter in Bayern ist regelmäßig das Bayerische Landesamt für Datenschutzaufsicht (BayLDA) zuständig.</p>
          <p><a href="https://www.lda.bayern.de/de/index.html" target="_blank" rel="noopener noreferrer">www.lda.bayern.de</a></p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>9. Keine Pflicht zur Bereitstellung</h2>
          <p>Sie sind nicht verpflichtet, mir personenbezogene Daten bereitzustellen. Ohne bestimmte Angaben kann ich Ihre Anfrage jedoch gegebenenfalls nicht oder nicht vollständig bearbeiten.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h2>10. Aktueller Geltungsbereich</h2>
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
                <img src="/assets/images/partner-xxl-nutrition-logo.png" alt="XXL Nutrition"${imageLoadingAttributes()}>
              </a>
              <a class="partner-hero__logo partner-hero__logo--aeke" href="https://eu.aeke.com/products/buy-aeke-k1?sca_ref=11019964.wKUJzkQCK3" target="_blank" rel="sponsored noopener noreferrer" aria-label="AEKE öffnen">
                <img src="/assets/images/partner-aeke-logo.png" alt="AEKE"${imageLoadingAttributes()}>
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
          <figure class="partner-hero__visual" aria-hidden="true">
            <img src="/assets/images/partners-hero-banner.svg" alt="Partner und Marken von Camp Dörfl"${imageLoadingAttributes()}>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide premium-sponsor-stage">
        <div class="premium-sponsor-stage__intro" data-reveal>
          ${sectionHeader({
            eyebrow: "Partner im Performance System",
            title: "Premium Sponsoren im Camp.",
            text:
              "XXL Nutrition und AEKE ergänzen das Camp Dörfl Performance System mit Produkten, die im Training, in der Regeneration und im Alltag echten Mehrwert schaffen."
          })}
        </div>
        <div class="premium-sponsor-stage__grid" aria-label="Premium Sponsoren">
          <a class="premium-sponsor-card premium-sponsor-card--xxl" href="https://www.xxlnutrition.com/de" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-xxl-nutrition-logo.png" alt="XXL Nutrition"${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <strong>XXL Nutrition</strong>
              <span>Sporternährung und Supplements für Leistung, Regeneration und klare Ziele.</span>
            </span>
            <span class="premium-sponsor-card__action">Zur Website <b aria-hidden="true">→</b></span>
          </a>
          <a class="premium-sponsor-card premium-sponsor-card--aeke" href="https://www.aeke.com" target="_blank" rel="sponsored noopener noreferrer" data-reveal>
            <span class="premium-sponsor-card__logo">
              <img src="/assets/images/partner-aeke-logo.png" alt="AEKE"${imageLoadingAttributes()}>
            </span>
            <span class="premium-sponsor-card__copy">
              <strong>AEKE</strong>
              <span>Smarte Trainingshardware für präzise Bewegung und messbare Entwicklung.</span>
            </span>
            <span class="premium-sponsor-card__action">Zur Website <b aria-hidden="true">→</b></span>
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
        ${sectionHeader({
          eyebrow: "Kooperationsfelder",
          title: "So kann Zusammen<wbr>arbeit konkret aussehen.",
          text:
            "Je nach Marke, Ziel und Format kann die Zusammenarbeit live, digital oder in einer Verbindung aus beidem aufgebaut werden."
        })}
        ${summaryRows(partnerActivationRows)}
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
    socialImage: "/assets/images/dominik-gym-grey-social.jpg",
    socialImageAlt: "Dominik Dörfl als Ansprechpartner für Kontakt und Beratung",
    content
  });
}

function personalTrainingCostPage() {
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

  const formatRows = [
    {
      title: "Einzelsessions",
      text:
        "Sinnvoll, wenn du vor allem Technik, Übungsauswahl oder einen konkreten Trainingsimpuls brauchst und bereits viel Eigenstruktur mitbringst."
    },
    {
      title: "5er- oder 10er-Karten",
      text:
        "Gut für Menschen, die über mehrere Termine Stabilität aufbauen wollen, ohne direkt in ein umfassendes Premium-Setup zu gehen."
    },
    {
      title: "Premium Begleitung",
      text:
        "Die stärkste Lösung, wenn Training, Ernährung, Analyse, App und laufende Anpassung zusammenarbeiten sollen und Fortschritt sauber geführt werden muss."
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
      question: "Warum steht hier kein fixer Preis für Personal Training in Nürnberg?",
      answer:
        "Weil ein fairer Preis vom sinnvollen Setup abhängt: Einzelsession, Karte oder Premium Begleitung haben unterschiedliche Aufgaben und erzeugen einen sehr unterschiedlichen Betreuungsaufwand."
    },
    {
      question: "Ist günstiger immer die bessere Einstiegsoption?",
      answer:
        "Nicht unbedingt. Wenn dir vor allem Struktur, Kontrolle und Verbindlichkeit fehlen, kann ein vermeintlich kleiner Einstieg am Ende weniger wirksam sein als ein klar geführtes Premium-Setup."
    },
    {
      question: "Wann lohnt sich Premium Personal Training statt einzelner Sessions?",
      answer:
        "Vor allem dann, wenn du Training, Ernährung, Analyse und laufende Anpassung als zusammenhängendes System brauchst und der Alltag nicht viel Raum für Fehler lässt."
    },
    {
      question: "Wie bekomme ich eine konkrete Preiseinschätzung?",
      answer:
        "Am schnellsten über eine kurze Anfrage. Dann lässt sich sauber einordnen, ob Einzelsessions, Karten oder Premium Begleitung für deine Ziele und deinen Kalender sinnvoll sind."
    }
  ];

  const content = `
    <section class="ff-hero ff-hero--coaching ff-hero--coaching-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/premium-training-hero-wide.webp" srcset="/assets/images/premium-training-hero-wide-960.webp 960w, /assets/images/premium-training-hero-wide.webp 1774w" sizes="100vw" alt="Dominik Dörfl beim Personal Training mit einem Kunden im Studio"${imageLoadingAttributes({ eager: true })}>
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Ratgeber · Personal Training Kosten</p>
        <h1 class="ff-hero__title" data-reveal>Was kostet Personal Training <br><span>in Nürnberg?</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Die Kosten hängen nicht nur von der Dauer einer Session ab, sondern vor allem von Betreuungstiefe, Analyse, Trainingsfrequenz und dem Setup, das wirklich zu deinem Alltag passt.
        </p>
        <p class="ff-hero__support" data-reveal>
          Camp Dörfl arbeitet deshalb nicht mit einem künstlichen Einheitsmodell, sondern mit Einzelsessions, Karten und Premium Begleitung je nach Ziel, Anspruch und Verantwortung.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref("premium-training")}"><span>Preiseinschätzung anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--secondary-light" href="/personal-coaching/"><span>Personal Training ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Wichtige Preisfaktoren bei Personal Training in Nürnberg">
          <div><dt>1:1</dt><dd>Persönliche Führung</dd></div>
          <div><dt>Analyse</dt><dd>vor dem Start</dd></div>
          <div><dt>App</dt><dd>optional integriert</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--tight">
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

    <section class="section section--muted">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "Modelle",
          title: "Welche Formate in Nürnberg typischerweise Sinn ergeben.",
          text:
            "Nicht jede Ausgangslage braucht dieselbe Tiefe. Deshalb lohnt sich die Einordnung vor dem Preisvergleich."
        })}
        ${summaryRows(formatRows)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell editorial-stage editorial-stage--reverse">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "Einordnung",
            title: "So findest du das passende Setup."
          })}
          ${processList(pricingSteps)}
        </div>
        <div class="editorial-stage__media" data-reveal>
          <img src="/assets/images/dominik-bike-road-yellow.webp" alt="Dominik Dörfl mit Rennrad als Symbol für individuell passende Trainingssteuerung"${imageLoadingAttributes()}>
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
      secondary: { label: "Premium Personal Training", href: "/personal-coaching/" }
    })}
  `;

  return layout({
    path: "/personal-training-kosten-nuernberg/",
    title: "Was kostet Personal Training in Nürnberg? | Camp Dörfl",
    description:
      "Was kostet Personal Training in Nürnberg? Camp Dörfl zeigt, welche Faktoren den Preis bestimmen und wann Einzelsessions, Karten oder Premium Begleitung sinnvoll sind.",
    keywords: [
      "Personal Training Kosten Nürnberg",
      "Was kostet Personal Training in Nürnberg",
      "Personal Trainer Preise Nürnberg",
      "Premium Personal Training Nürnberg"
    ],
    bodyClass: "page-premium page-coaching page-guide-pricing",
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

export const pages = [
  { route: "/", render: homePage },
  { route: "/app/", render: appPage },
  { route: "/personal-training-kosten-nuernberg/", render: personalTrainingCostPage },
  { route: "/personal-coaching/", render: personalCoachingPage },
  { route: "/gesundheitstag-nuernberg/", render: gesundheitstagNuernbergPage },
  { route: "/firmenfitness/", render: firmenfitnessPage },
  { route: "/events/", render: eventsPage },
  { route: "/partner/", render: partnerPage },
  { route: "/executive-performance/", render: executivePerformancePage },
  { route: "/erfolge-im-team/", render: teamSuccessPage },
  { route: "/ueber-dominik/", render: ueberDominikPage },
  { route: "/impressum/", render: impressumPage, includeInSitemap: false },
  { route: "/cookies/", render: cookiesPage, includeInSitemap: false },
  { route: "/datenschutz/", render: privacyPage, includeInSitemap: false },
  { route: "/datenschutzformular-app/", render: appPrivacyPage, includeInSitemap: false },
  { route: "/werbung-partnerlinks/", render: partnerTransparencyPage, includeInSitemap: false },
  { route: "/barrierefreiheit/", render: accessibilityPage, includeInSitemap: false },
  { route: "/kontakt/", render: contactPage }
];
