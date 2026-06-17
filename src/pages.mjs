import {
  achievements,
  appFunctionRows,
  corporateSteps,
  landingProofCards,
  site
} from "./data.mjs";
import {
  achievementGrid,
  contactHref,
  contactForm,
  ctaSection,
  devicePreviewGallery,
  faq,
  featureGrid,
  layout,
  processList,
  proofMosaic,
  sectionHeader,
  socialButtonLabel,
  socialIconLink,
  socialIconLinks,
  summaryRows,
  transformationGrid
} from "./components.mjs";

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
        <img src="${image}" alt="${alt}">
        <span class="premium-video-launch__scrim" aria-hidden="true"></span>
        <span class="premium-video-launch__content">
          <span class="premium-video-launch__eyebrow">${eyebrow}</span>
          <strong>${headline}</strong>
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
        <img src="${item.image}" alt="${item.alt}" style="object-position: ${item.imagePosition || "center center"};">
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
          <img src="/assets/images/dominik-gym-grey.jpg" alt="Dominik Dörfl in einer professionellen Coaching-Szene" />
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
    question: "Ist die Camp Dörfl App nur eine Trainings-App?",
    answer:
      "Nein. Die App ist als Performance-System gedacht: Training, Ernährung, Check-ins, Scans, GPS, Community und Fortschritt werden zusammengeführt."
  },
  {
    question: "Kann ich die App ohne Coaching nutzen?",
    answer:
      "Ja. Die App kann eigenständig genutzt werden und wird gleichzeitig zum stärksten Hebel, wenn sie mit Coaching kombiniert wird."
  },
  {
    question: "Gibt es in der Camp Dörfl App Trainings- und Ernährungspläne?",
    answer:
      "Ja. Genau dafür ist sie gebaut: Trainingsplanung, Ernährungsstruktur und tägliche Umsetzung laufen in einer Oberfläche zusammen, statt über mehrere Tools verteilt zu sein."
  },
  {
    question: "Wie starte ich mit der Camp Dörfl App?",
    answer:
      "Der Einstieg beginnt mit einer kurzen Anfrage. Danach wird geklärt, ob reiner App-Zugang oder die Kombination mit Coaching sinnvoller ist und wie dein Setup aufgebaut wird."
  },
  {
    question: "Was kostet der Zugang zur Camp Dörfl App?",
    answer:
      "Das hängt davon ab, ob du die App eigenständig nutzen oder mit Coaching kombinieren willst. Im Erstkontakt wird geklärt, welches Modell zu deinem Ziel, deinem Alltag und deiner gewünschten Begleitung passt."
  },
  {
    question: "Welche Funktionen sind für den Alltag besonders relevant?",
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
    image: "/assets/images/app-screen-member-area.jpg",
    alt: "Camp Dörfl App Vorschau mit Member Area und Planansicht"
  },
  {
    detail: "Tracking",
    title: "Ernährung und Eingaben schnell und hochwertig erfassen.",
    text:
      "Foto-Scan, Barcode, Speisekarte und Sprachtracking holen Dokumentation aus dem Chaos und direkt in den Alltag.",
    image: "/assets/images/app-screen-tracking-tools.jpg",
    alt: "Camp Dörfl App Vorschau mit Tracker-Werkzeugen und Sprachtracking"
  },
  {
    detail: "Performance Club",
    title: "Community, GPS und Club-Formate in einer App.",
    text:
      "Running Club, Cycling Club, Routen und Vergleiche verbinden digitale Struktur mit echter Bewegung und Motivation.",
    image: "/assets/images/app-screen-club.jpg",
    alt: "Camp Dörfl App Vorschau mit Performance Club für Running und Cycling"
  }
];

const coachingFaq = [
  {
    question: "Für wen ist das Premium Personal Training gedacht?",
    answer:
      "Für Menschen mit Anspruch, die in Nürnberg persönliches Training, klare Ernährungsführung und sichtbare Fortschritte in einem hochwertigen Rahmen wollen."
  },
  {
    question: "Was kostet Personal Training oder Premium Personal Training?",
    answer:
      "Der passende Rahmen hängt davon ab, ob du einzelne Personal Trainings, eine 5er- oder 10er-Karte oder die volle Premium-Begleitung suchst. In einer kurzen Beratung wird sauber eingeordnet, welches Setup zu Ziel, Kalender und Betreuungsintensität passt."
  },
  {
    question: "Wie läuft der Start ins Premium Personal Training ab?",
    answer:
      "Zu Beginn wird deine Ausgangslage klar erfasst, inklusive 2D-Körperanalyse und InBody. Danach folgen Trainings- und Ernährungsplanung, App-Zugang und die laufende Steuerung im Alltag."
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
    titleHtml: "PRÄSENZ. ENERGIE. <span>EVENTS.</span>",
    text:
      "INTERVIEWS, OPENINGS UND BÜHNENFÜHRUNG MIT KLARER WIRKUNG.",
    image: "/assets/images/dominik-stage-suit.jpg",
    alt: "Dominik Dörfl als Moderator bei einem Firmenevent",
    theme: "accent",
    href: "/events/",
    buttonLabel: "EVENTS ANSEHEN"
  },
  {
    detail: "02 / CORPORATE HEALTH",
    titleHtml: "GESUNDHEIT. ANALYSE. <span>WIRKUNG.</span>",
    text:
      "2D-SCAN, INBODY UND BERATUNG FÜR STARKE GESUNDHEITSTAGE.",
    image: "/assets/images/dominik-coaching-bikeerg.jpg",
    alt: "Firmenfitness mit InBody Messung und persönlicher Beratung",
    theme: "light",
    href: "/firmenfitness/",
    buttonLabel: "FIRMENFITNESS ANSEHEN"
  },
  {
    detail: "03 / PREMIUM COACHING",
    titleHtml: "ANALYSE. FÜHRUNG. <span>RESULTAT.</span>",
    text:
      "TRAINING UND ERNÄHRUNG IN PERSÖNLICHER PREMIUM-BEGLEITUNG.",
    image: "/assets/images/dominik-personal-coaching-client.webp",
    alt: "Dominik Dörfl mit einem Klienten im Personal Training im Studio",
    theme: "coaching",
    href: "/personal-coaching/",
    buttonLabel: "TRAINING ANSEHEN"
  },
  {
    detail: "04 / DIGITAL SYSTEM",
    titleHtml: "TRACKING. STRUKTUR. <span>FORTSCHRITT.</span>",
    text:
      "MEMBER AREA, CLUBS UND PERFORMANCE IN EINER APP.",
    image: "/assets/images/home-app-preview.png",
    alt: "Camp Dörfl App Visual mit Dashboard, Food Truth Score, Scan-Funktionen und Clubs",
    theme: "app",
    href: "/app/",
    buttonLabel: "APP ANSEHEN"
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
    image: "/assets/images/dominik-coaching-bikeerg.jpg",
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
    image: "/assets/images/dominik-athlete-nutrition.jpg",
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
    image: "/assets/images/dominik-athlete-bike-yellow.jpg",
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
    image: "/assets/images/event-opening-moderation.jpg",
    alt: "Dominik Dörfl bei einer Eröffnung auf der Bühne",
    imagePosition: "center 34%"
  },
  {
    number: "02",
    detail: "Sportevent",
    title: "Energie glaubwürdig transportieren",
    text: "Sportliche Praxis macht die Moderation nahbar, dynamisch und glaubwürdig, ohne dass Inszenierung aufgesetzt wirkt.",
    note: "Für Bühnen, auf denen Dynamik spürbar sein soll und trotzdem alles kontrolliert bleibt.",
    image: "/assets/images/event-stage-interview.jpg",
    alt: "Dominik Dörfl moderiert ein Sportevent im Live-Moment",
    imagePosition: "64% 42%"
  },
  {
    number: "03",
    detail: "Gala und Panel",
    title: "Gespräche sauber führen",
    text: "Für Panels, Galas und Interviews, bei denen Timing, Ton und Gesprächsführung professionell getragen werden müssen.",
    note: "Besonders stark, wenn Gäste sichtbar werden sollen und der Ablauf elegant zusammenhalten muss.",
    image: "/assets/images/event-panel-talk.jpg",
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
    videoImage: "/assets/images/dominik-athlete-nutrition.jpg",
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
    videoImage: "/assets/images/dominik-gym-grey.jpg",
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
      <img class="ff-hero__img" src="/assets/images/home-hero-stadium-wide.png" alt="Dominik Dörfl als Ironman-Finisher im Stadion">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Performance System · Nürnberg</p>
        <h1 class="ff-hero__title" data-reveal>Gesundheit.<br>Leistung.<br><span>Präsenz.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Das Performance System aus Premium Personal Training, Firmenfitness, Events und App —
          für Menschen und Unternehmen, die mehr wollen.
        </p>
        <div class="ff-hero__actions" data-reveal>
          <a class="button button--primary" href="${contactHref()}"><span>Beratung anfragen</span><span aria-hidden="true">&rarr;</span></a>
          <a class="button button--ghost" href="#einstiege"><span>Vier Einstiege ansehen</span><span aria-hidden="true">&rarr;</span></a>
        </div>
        <dl class="ff-hero__facts" data-reveal aria-label="Camp Dörfl in Zahlen">
          <div><dt>2×</dt><dd>Deutscher Meister</dd></div>
          <div><dt>Profi Athlet</dt><dd>Fitness</dd></div>
          <div><dt>Ironman</dt><dd>Finisher</dd></div>
          <div><dt>Fitness Trainer</dt><dd>ausgebildet & zertifiziert</dd></div>
        </dl>
      </div>
    </section>

    <section class="ed-section ed-section--hero-sync" id="einstiege">
      <div class="section-shell">
        <div class="ed-section__stage">
          <div class="ed-section__head" data-reveal>
            <p class="eyebrow">Vier Einstiege</p>
            <h2 class="ed-section__title">Ein System.<br><span>Vier Wege hinein.</span></h2>
            <p class="ed-section__lead">
              Ob persönlich geführt, digital oder im Unternehmen: du startest dort, wo es gerade am meisten bewegt.
            </p>
          </div>
          <div class="ed-entry-grid" aria-label="Vier Einstiege ins Performance System">
            ${homeEntryCards
              .map(
                ({ titleHtml, text, image, alt, href, buttonLabel, theme }) => `
                  <a class="ed-entry ed-entry--${theme}" href="${href}" data-reveal>
                  <div class="ed-entry__media">
                    <img src="${image}" alt="${alt}">
                  </div>
                  <div class="ed-entry__body">
                    <h3>${titleHtml}</h3>
                    <p>${text}</p>
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
    title: "Camp Dörfl | Premium Personal Training, Firmenfitness, Events & App in Nürnberg",
    description:
      "Camp Dörfl ist das Performance System aus Premium Personal Training, Firmenfitness, Events und App in Nürnberg.",
    keywords: [
      "Personal Trainer Nürnberg",
      "Premium Personal Training Nürnberg",
      "Firmenfitness",
      "Moderator in Nürnberg",
      "Camp Dörfl Performance System"
    ],
    content
  });
}

function appPage() {
  const content = `
    <section class="ff-hero ff-hero--app ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/home-app-preview.png" alt="" aria-hidden="true">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Camp Dörfl App</p>
          <h1 class="ff-hero__title" data-reveal>Eine App.<br>Zwei Welten.<br><span>Ein System.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Member Bereich, Trainings- und Ernährungsplanung, Scan-Funktionen, Clubs, GPS-Routen und Fortschritt greifen hier in einer klaren Oberfläche zusammen.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="${contactHref("app")}"><span>App-Zugang anfragen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="#app-vorschau"><span>App ansehen</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Leistungsbausteine der Camp Dörfl App">
            <div><dt>Kostenlos</dt><dd>downloaden</dd></div>
            <div><dt>Ernährungspläne</dt><dd>individuell</dd></div>
            <div><dt>Trainingspläne</dt><dd>fürs eigene Ziel</dd></div>
            <div><dt>Live Scan</dt><dd>und Truth Score</dd></div>
            <div><dt>Sprachtracking</dt><dd>und Speisekarten Scan</dd></div>
            <div><dt>Performance Club</dt><dd>mit Running & Cycling Club</dd></div>
            <div><dt>GPS Routen</dt><dd>planen, ausführen und tracken</dd></div>
            <div><dt>Longevity</dt><dd>und Erholung</dd></div>
          </dl>
      </div>
    </section>

    <section class="section section--tight">
      <div id="app-vorschau" class="section-shell section-shell--wide app-preview-stage">
        ${sectionHeader({
          eyebrow: "App-Vorschau",
          title: "So wirkt die Camp Dörfl App im echten Einsatz.",
          text:
            "Keine austauschbare Fitness-App, sondern eine hochwertige Oberfläche für Struktur, Tracking, Community und klare nächste Schritte."
        })}
        ${devicePreviewGallery(appPreviewCards)}
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide app-function-stage">
        ${sectionHeader({
          eyebrow: "Kernfunktionen",
          title: "Was du konkret bekommst.",
          text:
            "Die wichtigsten Funktionen noch einmal kompakt und klar herausgearbeitet."
        })}
        ${summaryRows(appFunctionRows)}
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        ${sectionHeader({
          eyebrow: "FAQ",
          title: "Kurz geklärt.",
          text:
            "Die Camp Dörfl App ist das digitale Zentrum des Systems und bewusst größer gedacht als eine normale Trainings-App."
        })}
        ${faq(appFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Camp Dörfl App",
      title: "Hol dir den digitalen Zugang zu mehr Struktur.",
      text:
        "Wenn du Training, Ernährung, GPS, Clubs und Fortschritt in einer klaren Oberfläche zusammenführen willst, ist das dein nächster Schritt.",
      primary: { label: "App-Zugang anfragen", href: contactHref("app") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/app/",
    title: "Camp Dörfl App | Digitales Performance-System",
    description:
      "Die Camp Dörfl App verbindet Member Bereich, Ernährungs- und Trainingsplanung, Scans, GPS-Routen, Clubs und Score System.",
    keywords: ["Camp Dörfl App", "Performance App", "Fitness App Nürnberg", "Camp Score"],
    bodyClass: "page-premium page-app",
    content
  });
}

function personalCoachingPage() {
  const content = `
    <section class="ff-hero ff-hero--coaching ff-hero--coaching-photo">
      <img class="ff-hero__img" src="/assets/images/premium-training-hero-wide.png" alt="Dominik Dörfl mit Personal-Training-Kunde im Studio">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
        <p class="ff-hero__eyebrow" data-reveal>Personal Trainer Nürnberg</p>
        <h1 class="ff-hero__title" data-reveal>Premium.<br>Personal.<br><span>Training.</span></h1>
        <p class="ff-hero__lead" data-reveal>
          Der private Einstieg in das Performance System: Personal Training ohne Bindung oder Premium Personal Training mit Analyse, Planung, App und laufender Steuerung.
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
            eyebrow: "Praxisblick",
            title: "So sieht Premium Personal Training im echten Einsatz aus.",
            text:
              "Das Video zeigt die persönliche Zusammenarbeit so, wie sie gedacht ist: nah dran, hochwertig geführt und mit klarem Anspruch an Training, Ernährung und Alltag."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Persönlich statt anonym</h3>
              <p>Der Mensch steht im Mittelpunkt, nicht ein starrer Standardplan oder eine unpersönliche Massenlösung.</p>
            </article>
            <article class="summary-row">
              <h3>Struktur mit echter Umsetzung</h3>
              <p>Analyse, Training, Ernährung und laufende Führung greifen ineinander, damit Fortschritt im Alltag wirklich tragfähig wird.</p>
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
              title: "So kannst du ins Premium Personal Training <span>starten.</span>",
              text:
                "Du kannst über Einzelstunden, Premium Coaching oder die Camp Dörfl App in das System einsteigen."
            })}
          </div>
          <figure class="coaching-start-stage__photo" data-reveal>
            <img src="/assets/images/dominik-bike-road-yellow.jpg" alt="Dominik Doerfl mit Rennrad im gelb-weissen Trikot">
          </figure>
        </div>
        ${featureGrid(coachingIncludedCards, "feature-grid--coaching-start")}
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell section-shell--wide">
        ${sectionHeader({
          eyebrow: "Premium Personal Training",
          title: "Analyse, Planung, App und regelmäßige Anpassung.",
          text:
            "Zum Start entsteht ein messbarer Status. Danach werden Training und Ernährung individuell geplant, wöchentlich angepasst und alle vier Wochen überprüft.",
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
              title: "Eine zusätzliche Referenz aus dem <span>echten Coaching-Alltag.</span>",
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
      title: "Beratung anfragen.",
      text:
        "Wenn du wissen willst, ob das Training zu deiner Ausgangslage, deinem Kalender und deinem Anspruch passt, ist das der nächste richtige Schritt.",
      primary: { label: "Beratung anfragen", href: contactHref("premium-training") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/personal-coaching/",
    title: "Personal Trainer Nürnberg & Premium Personal Training Nürnberg | Camp Dörfl",
    description:
      "Personal Trainer Nürnberg und Premium Personal Training Nürnberg von Camp Dörfl: Training, Ernährung, Analysen, persönliche Führung und messbare Entwicklung.",
    keywords: ["Personal Trainer Nürnberg", "Premium Personal Training Nürnberg", "Personal Training Nürnberg"],
    bodyClass: "page-premium page-coaching",
    content
  });
}

function firmenfitnessPage() {
  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--firmenfitness ff-hero--firmenfitness-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/firmenfitness-hero-wide.png" alt="" aria-hidden="true">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Firmenfitness</p>
          <h1 class="ff-hero__title" data-reveal>Firmenfitness.<br>Mit Analyse.<br><span>Und Beratung.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Mitarbeitende werden präzise ausgewertet und anschließend verständlich beraten. Ernährung, Bewegung und Routinen werden passend zum Berufsmodell übersetzt.
          </p>
          <p class="ff-hero__support" data-reveal>
            Die Kombination aus 2D-Technik, InBody und professioneller Einordnung macht das Format einfach, greifbar und stark verkaufbar.
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
            image: "/assets/images/dominik-bike-blue.jpg",
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
          <h2>Gesundheitstage und Firmenfitness professionell umgesetzt.</h2>
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
                    <img src="${image}" alt="${alt}">
                  </span>
                  <span class="corporate-reference-card__divider" aria-hidden="true"></span>
                  <span class="corporate-reference-card__body">
                    <strong>${name}</strong>
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
            eyebrow: "Praxisblick",
            title: "So wirkt Firmenfitness im echten Einsatz.",
            text:
              "Analyse, Beratung und persönliche Präsenz kommt hier zusammen. Genau so wird aus einem Gesundheitstag ein hochwertiges Format mit echter Wirkung, die auch nach der Veranstaltung noch etwas bewegt."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Direkt verständlich</h3>
              <p>Die Leistung wird nicht abstrakt erklärt, sondern für Mitarbeitende und Unternehmen sofort greifbar gemacht.</p>
            </article>
            <article class="summary-row">
              <h3>Professionell präsentierbar</h3>
              <p>Ideal für Gesundheitstage, interne Formate und Firmenveranstaltungen, die hochwertig auftreten sollen.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/rQ9YocgKVSc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=rQ9YocgKVSc",
            title: "Camp Dörfl Firmenfitness",
            image: "/assets/images/dominik-athlete-nutrition.jpg",
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
          title: "Drei klare Bausteine für starke Firmenfitness.",
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
          title: "Was Unternehmen dadurch gewinnen.",
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
          eyebrow: "FAQ",
          title: "Kurz geklärt.",
          text:
            "Die häufigsten Fragen zu Firmenfitness, Gesundheitstagen und dem Ablauf im Unternehmen."
        })}
        ${faq(corporateFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Firmenfitness",
      title: "Wenn Sie Firmenfitness hochwertig aufsetzen wollen, lassen Sie uns sprechen.",
      text:
        "Camp Dörfl entwickelt Formate für Unternehmen, die Gesundheit, Performance und Teamkultur professionell verbinden wollen.",
      primary: { label: "Firmenfitness anfragen", href: contactHref("firmenfitness") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/firmenfitness/",
    title: "Firmenfitness | Camp Dörfl",
    description:
      "Firmenfitness von Camp Dörfl: Gesundheitstage, Performance Checks, Vorträge und Aktivierungen für moderne Unternehmen.",
    keywords: ["Firmenfitness", "Firmenfitness Nürnberg", "Betriebliche Gesundheit", "Gesundheitstag Unternehmen"],
    bodyClass: "page-premium page-firmenfitness",
    content
  });
}

function eventsPage() {
  const content = `
    <section class="ff-hero ff-hero--photo ff-hero--events ff-hero--events-photo ff-hero--text-only">
      <img class="ff-hero__img" src="/assets/images/events-hero-wide.png" alt="" aria-hidden="true">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Moderator in Nürnberg</p>
          <h1 class="ff-hero__title" data-reveal>Moderation.<br>Mit Energie.<br><span>Und Präsenz.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Interviews, Eröffnungen, Panels und Events mit klarer Führung, Energie und professioneller Präsenz.
          </p>
          <p class="ff-hero__support" data-reveal>
            Für Firmen, Sport, Gala und öffentliche Formate.
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
            image: "/assets/images/events-hero-wide.png",
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
            eyebrow: "Praxisblick",
            title: "So wirken Events im echten Einsatz.",
            text:
              "Präsenz, Timing und sichere Führung kommen hier zusammen. Genau so wird aus einer Moderation ein hochwertiges Format mit echter Wirkung, die im Raum sofort spürbar ist."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>Direkt spürbar</h3>
              <p>Publikum, Gäste und Veranstalter merken sofort, wenn Energie, Sprache und Präsenz professionell getragen werden.</p>
            </article>
            <article class="summary-row">
              <h3>Sauber führbar</h3>
              <p>Ideal für Eröffnungen, Interviews und Bühnenmomente, die nahbar wirken und trotzdem komplett kontrolliert bleiben.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/oTRIacnkFPc?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://www.youtube.com/watch?v=oTRIacnkFPc",
            title: "Camp Dörfl Events",
            image: "/assets/images/dominik-moderator-mic.jpg",
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
              <p>Fragen, Übergänge und Reaktionen bleiben klar, nahbar und souverän, ohne künstlich oder überladen zu wirken.</p>
            </article>
            <article class="summary-row">
              <h3>Stark für Gäste und Publikum</h3>
              <p>Ideal für Bühneninterviews, Talk-Momente und Einbindungen, bei denen Präsenz, Sicherheit und Vertrauen direkt sichtbar werden sollen.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video editorial-stage__media--short" data-reveal>
          ${deferredVideoEmbed({
            embedUrl: "https://www.youtube-nocookie.com/embed/yhV7cyw2Pgg?autoplay=1&rel=0&modestbranding=1&playsinline=1",
            watchUrl: "https://youtu.be/yhV7cyw2Pgg",
            title: "Camp Dörfl Interview Beispiel",
            image: "/assets/images/event-stage-interview.jpg",
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
                    <img src="${image}" alt="${alt}">
                  </span>
                  <span class="event-reference-card__divider" aria-hidden="true"></span>
                  <span class="event-reference-card__body">
                    <strong>${name}</strong>
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
          title: "Formate mit Anspruch.",
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
            <img src="/assets/images/event-rule-award.avif" alt="Dominik Dörfl bei einer Ehrung im Gespräch mit einem Preisträger auf der Bühne">
            <figcaption>
              <p>Interviews und Übergaben, die Protokoll und Live-Moment gleichzeitig tragen.</p>
            </figcaption>
          </figure>
          <figure class="event-rule-stage__card event-rule-stage__card--stage">
            <img src="/assets/images/event-rule-stage.avif" alt="Dominik Dörfl moderiert auf einer Wettkampfbühne mit Mikrofon vor einem Verbands-Backdrop">
            <figcaption>
              <p>Klare Ansagen, saubere Calls und Führung mit Autorität ohne unnötige Härte.</p>
            </figcaption>
          </figure>
          <figure class="event-rule-stage__card event-rule-stage__card--podium">
            <img src="/assets/images/event-rule-podium.avif" alt="Dominik Dörfl mit Mikrofon und Unterlagen an einem Rednerpult bei einem offiziellen Ablauf">
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
          <div class="event-fun-stage__signal" data-reveal>
            <span>Locker geführt</span>
            <h3>Leicht, nahbar und trotzdem professionell: Entertainment-Formate, die Stimmung machen und Menschen wirklich ins Geschehen ziehen.</h3>
          </div>
        </div>
        <div class="event-fun-stage__gallery" data-reveal aria-label="Formate mit Spaß-Faktor bei Camp Dörfl Events">
          <figure class="event-fun-stage__card event-fun-stage__card--lead">
            <img src="/assets/images/event-fun-segmueller-poster.jpg" alt="Dominik Dörfl beim Segmüller Bayern-Wochenende neben einem Veranstaltungsaufsteller">
            <figcaption>
              <span>Segmüller</span>
              <h3>Bayern-Wochenende mit Challenge-Charakter.</h3>
            </figcaption>
          </figure>
          <figure class="event-fun-stage__card event-fun-stage__card--stemmen">
            <img src="/assets/images/event-fun-segmueller-stemmen.jpg" alt="Dominik Dörfl mit zwei Maßkrügen vor einem Maßkrugstemmen-Stand">
            <figcaption>
              <span>Mitmachformat</span>
              <h3>Publikumsmomente mit Energie und Augenzwinkern.</h3>
            </figcaption>
          </figure>
          <figure class="event-fun-stage__card event-fun-stage__card--hosting">
            <img src="/assets/images/event-fun-segmueller-hosting.jpg" alt="Dominik Dörfl moderiert ein Maßkrugstemmen mit einem Kind auf der Bühne">
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
          title: "Kurz geklärt.",
          text:
            "Die wichtigsten Fragen zu Moderation, Eventformaten und dem professionellen Ablauf auf der Bühne."
        })}
        ${faq(eventFaq)}
      </div>
    </section>

    ${ctaSection({
      eyebrow: "Events",
      title: "Wenn Sie einen Moderator in Nürnberg mit echter Performance-Präsenz suchen, melden Sie sich.",
      text:
        "Camp Dörfl moderiert Sport-, Fitness- und Business-Events mit Energie, Klarheit und einer Handschrift, die hängen bleibt.",
      primary: { label: "Event anfragen", href: contactHref("events") },
      secondary: { label: "Zur Startseite", href: "/" }
    })}
  `;

  return layout({
    path: "/events/",
    title: "Moderator in Nürnberg & Events | Camp Dörfl",
    description:
      "Moderator in Nürnberg für Sport-, Fitness- und Business-Events: Moderation, Hosting und Performance-Impulse von Camp Dörfl.",
    keywords: ["Moderator in Nürnberg", "Events Nürnberg", "Event Moderator Nürnberg", "Fitness Event Moderator"],
    bodyClass: "page-premium page-events",
    content
  });
}

function teamSuccessPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--photo ff-hero--team">
      <img class="ff-hero__img" src="/assets/images/dominik-moderator-mic.jpg" alt="" aria-hidden="true">
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
            <img src="/assets/images/dominik-moderator-mic.jpg" alt="Dominik Dörfl mit Mikrofon als Moderator">
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

    <section class="section section--tight">
      <div class="section-shell">
        ${achievementGrid(achievements)}
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
          <img src="/assets/images/dominik-coaching-bikeerg.jpg" alt="Dominik Dörfl bei der Arbeit mit einem Klienten">
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
    title: "Erfolge im Team | Camp Dörfl",
    description:
      "Erfolge im Team bei Camp Dörfl: Erfahrung aus Leistungssport, Coaching, Community, Bühne und Unternehmertum.",
    keywords: ["Erfolge im Team", "Dominik Dörfl", "Performance Coaching Nürnberg"],
    bodyClass: "page-premium page-team",
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
            <h3>Anbieter</h3>
            <address>
              ${site.ownerName}<br>
              ${site.streetAddress}<br>
              ${site.postalCode} ${site.city}<br>
              ${site.country}
            </address>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Kontakt</h3>
            <p><strong>E-Mail:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
            <p><strong>Instagram:</strong> ${socialIconLink(site.instagram, { className: "social-link--chip social-link--inline" })}</p>
            <p>Eine unmittelbare elektronische Kontaktaufnahme ist per E-Mail möglich. Das Kontaktformular dieser Website übermittelt eingegebene Daten über den Formular-Dienst FormSubmit an ${site.email}.</p>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Rechtliche Schnellnavigation</h3>
            <ul class="legal-list">
              <li><a href="/datenschutz/">Datenschutz</a></li>
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
          <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
          <p>
            ${site.ownerName}<br>
            ${site.streetAddress}<br>
            ${site.postalCode} ${site.city}
          </p>
        </article>
        <article class="legal-card" data-reveal>
          <h3>Verbraucherstreitbeilegung</h3>
          <p>Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          <p class="legal-note">Hinweis: Die frühere EU-Online-Streitbeilegungsplattform wurde zum 20. Juli 2025 eingestellt.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h3>Hinweis zu Werbung, Partnerlinks und Kooperationen</h3>
          <p>Auf dieser Website können Inhalte mit Markenbezug, Partnernennungen, Rabattcodes oder direkten Partnerlinks erscheinen. Hinweise zur Kennzeichnung und Transparenz finden Sie auf der Seite <a href="/werbung-partnerlinks/">Partnerlinks & Werbung</a>.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h3>Urheberrecht</h3>
          <p>Die auf dieser Website veröffentlichten Texte, Bilder, Grafiken und sonstigen Inhalte unterliegen dem Urheberrecht, soweit nicht anders gekennzeichnet. Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf der vorherigen Zustimmung.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/impressum/",
    title: "Impressum | Camp Dörfl",
    description: "Impressum von Camp Dörfl mit den Pflichtangaben nach dem Digitale-Dienste-Gesetz.",
    keywords: ["Impressum", "Camp Dörfl", "Dominik Dörfl"],
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
            <h3>Verantwortlicher</h3>
            <address>
              ${site.ownerName}<br>
              ${site.streetAddress}<br>
              ${site.postalCode} ${site.city}<br>
              ${site.country}
            </address>
            <p><strong>E-Mail:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Kurz zusammengefasst</h3>
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
          <h3>1. Bereitstellung der Website</h3>
          <p>Beim Aufruf der Website werden durch den technischen Betrieb unvermeidbar Verbindungsdaten verarbeitet. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene URL, Referrer, Browsertyp und Betriebssystem gehören.</p>
          <p>Die Verarbeitung erfolgt zur Auslieferung der Website, zur Gewährleistung von Stabilität und Sicherheit sowie zur Abwehr von Missbrauch.</p>
          <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p><strong>Empfänger:</strong> der für die Auslieferung der Website eingesetzte technische Hosting-Dienstleister.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>2. Kontakt per E-Mail und Kontaktformular</h3>
          <p>Wenn Sie mir direkt per E-Mail schreiben oder das Kontaktformular auf dieser Website nutzen, verarbeite ich die von Ihnen übermittelten Angaben zur Bearbeitung Ihrer Anfrage. Das können insbesondere Name, E-Mail-Adresse, Telefonnummer, Unternehmen, Thema und Nachricht sein.</p>
          <p>Beim Absenden des Formulars werden die eingegebenen Daten an den externen Formular-Dienst FormSubmit unter <code>formsubmit.co</code> übertragen und von dort an ${site.email} weitergeleitet. Dabei können zusätzlich technische Verbindungsdaten wie IP-Adresse, Zeitstempel und Browserinformationen verarbeitet werden.</p>
          <p><strong>Empfänger:</strong> ich selbst sowie der eingesetzte Formular-Dienst FormSubmit / Devro LABS.</p>
          <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO, soweit es um vorvertragliche Kommunikation geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>3. Einwilligungs-Management und lokale Speicherung</h3>
          <p>Diese Website speichert Ihre Auswahl zu erforderlichen Funktionen und externen Medien lokal in Ihrem Browser, damit die Entscheidung nicht bei jedem Seitenaufruf erneut abgefragt werden muss.</p>
          <p>Aktuell wird dazu insbesondere der Eintrag <code>campdoerfl-consent</code> verwendet. Die Einzelheiten sind auf der Seite <a href="/cookies/">Cookies & lokale Speicherungen</a> beschrieben.</p>
          <p><strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>4. YouTube-Videos</h3>
          <p>Auf mehreren Seiten dieser Website sind Videos von YouTube im erweiterten Datenschutzmodus über <code>youtube-nocookie.com</code> eingebunden. Diese Inhalte werden erst geladen, wenn Sie der Kategorie „Externe Medien“ zugestimmt haben.</p>
          <p>Nach Ihrer Freigabe kann im sichtbaren Bereich automatisch eine Verbindung zu YouTube beziehungsweise Google hergestellt werden. Dabei können insbesondere IP-Adresse, Geräte- und Browserinformationen sowie Nutzungsdaten verarbeitet werden. Auf die weitere Verarbeitung durch YouTube oder Google habe ich keinen Einfluss.</p>
          <p><strong>Rechtsgrundlage:</strong> § 25 Abs. 1 TDDDG sowie Art. 6 Abs. 1 lit. a DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>5. Externe Links</h3>
          <p>Diese Website verlinkt auf externe Angebote, insbesondere Instagram, YouTube und Partner-Websites. Wenn Sie einen solchen Link anklicken, verlassen Sie diese Website. Ab diesem Zeitpunkt gilt ausschließlich die Datenschutzerklärung des jeweiligen Anbieters.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>6. Speicherdauer</h3>
          <p>Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
          <p>Technische Verbindungsdaten werden nur im für Betrieb, Sicherheit und Fehleranalyse erforderlichen Umfang verarbeitet. Inhalte aus der Kontaktaufnahme speichere ich nur so lange, wie dies zur Bearbeitung Ihrer Anfrage oder zur Erfüllung gesetzlicher Pflichten nötig ist.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>7. Ihre Rechte</h3>
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
          <h3>8. Beschwerderecht bei einer Aufsichtsbehörde</h3>
          <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. Für private Anbieter in Bayern ist regelmäßig das Bayerische Landesamt für Datenschutzaufsicht (BayLDA) zuständig.</p>
          <p><a href="https://www.lda.bayern.de/de/index.html" rel="noopener noreferrer">www.lda.bayern.de</a></p>
        </article>
        <article class="legal-card" data-reveal>
          <h3>9. Keine Pflicht zur Bereitstellung</h3>
          <p>Sie sind nicht verpflichtet, mir personenbezogene Daten bereitzustellen. Ohne bestimmte Angaben kann ich Ihre Anfrage jedoch gegebenenfalls nicht oder nicht vollständig bearbeiten.</p>
        </article>
        <article class="legal-card" data-reveal>
          <h3>10. Aktueller Geltungsbereich</h3>
          <p>Diese Datenschutzerklärung wurde auf das aktuell erkennbare technische Setup dieser Website abgestimmt. Wenn künftig weitere Dienste, Tracking- oder Analyse-Tools eingebunden werden, muss diese Erklärung vor deren Einsatz entsprechend aktualisiert werden.</p>
          <p class="legal-note">Ergänzende Hinweise zur Einwilligungslogik finden Sie auf der Seite <a href="/cookies/">Cookies & lokale Speicherungen</a>.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/datenschutz/",
    title: "Datenschutz | Camp Dörfl",
    description: "Datenschutzerklärung von Camp Dörfl für die Website campdoerfl.de.",
    keywords: ["Datenschutz", "Camp Dörfl", "DSGVO"],
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
            <h3>Aktueller Stand</h3>
            <ul class="legal-list">
              <li>Es werden aktuell keine Analyse-, Marketing- oder Remarketing-Cookies automatisch gesetzt.</li>
              <li>Für das Einwilligungs-Management nutzt die Website derzeit vor allem eine lokale Speicherung im Browser statt klassischer Tracking-Cookies.</li>
              <li>YouTube-Videos werden erst nach Ihrer Freigabe für externe Medien geladen und können danach im sichtbaren Bereich automatisch stumm starten.</li>
              <li>Die Einstellungen können jederzeit erneut geöffnet, geändert oder widerrufen werden.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Einwilligung verwalten</h3>
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
          <h3>1. Einwilligungs-Speicherung im Browser</h3>
          <p>Diese Website speichert Ihre Einwilligungsentscheidung lokal in Ihrem Browser, damit die getroffene Auswahl bei weiteren Seitenaufrufen beachtet werden kann.</p>
          <ul class="legal-list">
            <li><strong>Technischer Name:</strong> <code>campdoerfl-consent</code></li>
            <li><strong>Inhalt:</strong> Auswahl zu externen Medien, Versionsstand und Zeitstempel der Speicherung</li>
            <li><strong>Zweck:</strong> Speicherung Ihrer Auswahl zu erforderlichen Funktionen und externen Medien</li>
            <li><strong>Speicherdauer:</strong> bis zur manuellen Löschung im Browser oder bis eine neue Consent-Version erforderlich wird</li>
          </ul>
          <p><strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>2. Externe Medien</h3>
          <p>Auf mehreren Seiten dieser Website sind YouTube-Videos im erweiterten Datenschutzmodus eingebunden. Diese Inhalte werden erst nach Ihrer Freigabe für externe Medien geladen.</p>
          <p>Nach der Freigabe kann beim Erreichen des sichtbaren Bereichs automatisch eine Verbindung zu YouTube beziehungsweise Google hergestellt werden. Die Videos starten dabei stumm; den Ton können Sie bei Bedarf direkt im Player aktivieren.</p>
          <p><strong>Rechtsgrundlage:</strong> § 25 Abs. 1 TDDDG sowie Art. 6 Abs. 1 lit. a DSGVO.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>3. Aktuell nicht im Einsatz</h3>
          <p>Zum Stand vom 17. Juni 2026 werden auf dieser Website aktuell keine einwilligungspflichtigen Analyse- oder Marketing-Tools wie Tracking-Pixel, Werbe-Cookies, Remarketing-Dienste oder Social-Media-Embeds automatisch aktiviert.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>4. Browser-Einstellungen und Widerruf</h3>
          <p>Sie können lokale Speicherungen jederzeit über Ihre Browser-Einstellungen löschen. Zusätzlich können Sie Ihre Auswahl direkt über den Link „Cookie-Einstellungen“ im Footer neu setzen.</p>
          <p>Wenn künftig weitere Dienste eingebunden werden, insbesondere Analyse-, Werbe- oder Social-Media-Plugins, müssen diese Seite, die Datenschutzerklärung und die Consent-Logik vor der Aktivierung entsprechend erweitert werden.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/cookies/",
    title: "Cookies & lokale Speicherungen | Camp Dörfl",
    description: "Cookie-, Einwilligungs- und Speicherungsinformationen von Camp Dörfl für die Website campdoerfl.de.",
    keywords: ["Cookies", "Cookie-Einstellungen", "lokale Speicherungen", "Camp Dörfl"],
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
            <h3>Kurz zusammengefasst</h3>
            <ul class="legal-list">
              <li>Auf dieser Website können Marken, Produkte, Logos, Kooperationen, Rabattcodes und Partnerlinks genannt oder verlinkt werden.</li>
              <li>Solche Inhalte werden auf den jeweiligen Seiten kenntlich gemacht oder sind aus dem Kontext als Kooperation, Werbung oder Partnerhinweis erkennbar.</li>
              <li>Einzelne Links können direkte Partnerlinks oder Referral-Links sein und damit wirtschaftlich relevant für Camp Dörfl sein.</li>
              <li>Fragen zur Kennzeichnung oder zu einer konkreten Kooperation können jederzeit per E-Mail gestellt werden.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Aktueller Stand auf dieser Website</h3>
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
          <h3>1. Kennzeichnung von Werbung und Kooperationen</h3>
          <p>Wenn Camp Dörfl Marken, Produkte oder Unternehmen im Rahmen einer Kooperation vorstellt, geschieht dies als kommerzielle Kommunikation im Sinne der geltenden Informationspflichten. Solche Inhalte werden auf der jeweiligen Seite sprachlich, gestalterisch oder über den Kontext als Partnerinhalt erkennbar gemacht.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>2. Partnerlinks und Referral-Links</h3>
          <p>Einzelne externe Links können direkt zu Partner-Angeboten führen und technisch Parameter enthalten, die eine Zuordnung der Empfehlung ermöglichen, beispielsweise Referral- oder Tracking-Parameter wie <code>sca_ref</code>.</p>
          <p>Wenn Sie einem solchen Link folgen oder einen genannten Code verwenden, kann Camp Dörfl hierdurch wirtschaftlich begünstigt werden.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>3. Rabattcodes und Vorteile</h3>
          <p>Genannte Rabattcodes, Hinweise auf Aktionen oder Produktvorteile dienen der transparenten Kommunikation mit Interessierten. Ob und in welcher Höhe ein Vorteil für Sie entsteht, richtet sich ausschließlich nach dem aktuellen Angebot des jeweiligen Partners.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>4. Einordnung und Verantwortung</h3>
          <p>Kooperationen werden nur dann eingebunden, wenn sie aus Sicht von Camp Dörfl fachlich, inhaltlich und markenseitig zum eigenen Performance-System passen. Die Erwähnung einer Marke ersetzt jedoch keine eigene Prüfung durch Nutzerinnen und Nutzer.</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-shell legal-stack">
        <article class="legal-card" data-reveal>
          <h3>Fragen zur Transparenz</h3>
          <p>Wenn Sie wissen möchten, ob eine konkrete Erwähnung, Verlinkung oder Empfehlung auf dieser Website im Rahmen einer Kooperation erfolgt, schreiben Sie bitte an <a href="mailto:${site.email}">${site.email}</a>.</p>
          <p class="legal-note">Diese Hinweise gelten für den aktuellen Stand der Website und müssen aktualisiert werden, wenn weitere Partner, Affiliate-Modelle oder Werbeformate hinzukommen.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/werbung-partnerlinks/",
    title: "Partnerlinks & Werbung | Camp Dörfl",
    description: "Transparenzhinweise von Camp Dörfl zu Partnerlinks, Rabattcodes, Kooperationen und Werbung.",
    keywords: ["Partnerlinks", "Werbung", "Kooperationen", "Camp Dörfl"],
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
            <h3>Aktueller Stand</h3>
            <ul class="legal-list">
              <li>Die Website ist responsiv aufgebaut und für aktuelle Desktop- und Mobilgeräte ausgelegt.</li>
              <li>Es gibt eine Skip-Navigation zum Hauptinhalt und grundsätzlich per Tastatur erreichbare Navigations- und Aktionsflächen.</li>
              <li>Inhaltlich relevante Bilder werden mit Alternativtexten versehen; dekorative Bilder werden, soweit sinnvoll, ausgeblendet.</li>
              <li>Ein vollständiges formales WCAG- oder BITV-Audit wurde bislang nicht durchgeführt.</li>
            </ul>
          </article>
          <article class="legal-card" data-reveal>
            <h3>Kontakt bei Barrieren</h3>
            <p>Wenn Sie auf Barrieren stoßen oder Inhalte in einer anderen Form benötigen, schreiben Sie bitte an <a href="mailto:${site.email}">${site.email}</a>.</p>
            <p>Hinweise helfen dabei, die Website vor und nach der Veröffentlichung gezielt weiter zu verbessern.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell legal-grid">
        <article class="legal-card" data-reveal>
          <h3>1. Bereits umgesetzte Maßnahmen</h3>
          <p>Die Website verwendet eine klare Seitenstruktur mit Hauptnavigation, Hauptinhalt und Footer. Wichtige Interaktionselemente wie Navigation, Kontaktbereich und Consent-Dialog sind grundsätzlich ohne Maus bedienbar.</p>
          <p>Kontraste, Skalierung und Layout wurden für aktuelle Standardansichten auf Mobilgeräten und Desktop-Bildschirmen ausgelegt.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>2. Externe Inhalte</h3>
          <p>Eingebettete YouTube-Inhalte stammen von einem Drittanbieter. Für deren technische und inhaltliche Barrierefreiheit ist auch der jeweilige Anbieter verantwortlich.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>3. Bekannte Grenzen</h3>
          <p>Die Website arbeitet bewusst mit großen Bildern, Bühnenmotiven und visuell starken Layouts. In Einzelfällen kann das für Nutzerinnen und Nutzer mit speziellen Anforderungen weniger komfortabel sein als ein rein funktionaler Aufbau.</p>
          <p>Auch bei automatisch nach Einwilligung geladenen Videos können zusätzliche Bedienhürden entstehen.</p>
        </article>

        <article class="legal-card" data-reveal>
          <h3>4. Laufende Verbesserung</h3>
          <p>Barrierefreiheit wird als laufende Aufgabe verstanden. Bei technischen oder inhaltlichen Änderungen sollten Navigation, Lesbarkeit, Kontraste und Alternativtexte jeweils mitgeprüft werden.</p>
        </article>
      </div>
    </section>
  `;

  return layout({
    path: "/barrierefreiheit/",
    title: "Barrierefreiheit | Camp Dörfl",
    description: "Hinweise zur Barrierefreiheit der Website von Camp Dörfl.",
    keywords: ["Barrierefreiheit", "Accessibility", "Camp Dörfl"],
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
            <img src="${image}" alt="${alt}">
            <h3>${name}</h3>
            <p>${text}</p>
            ${videoNote ? `<p class="partner-brand-card__note">${videoNote}</p>` : ""}
            <div class="partner-brand-card__footer">
              ${meta ? `<strong class="partner-brand-card__meta">${meta}</strong>` : ""}
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
            ? `<img src="${image}" alt="${alt}">
               <h3>${name}</h3>`
            : `<h3 class="partner-brand-card__text-logo">${name}</h3>`
        }
        <p>${text}</p>
        ${
          meta || href
            ? `<div class="partner-brand-card__footer">
                 ${meta ? `<strong class="partner-brand-card__meta">${meta}</strong>` : ""}
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
                <img src="/assets/images/partner-xxl-nutrition-logo.png" alt="XXL Nutrition">
              </a>
              <a class="partner-hero__logo partner-hero__logo--aeke" href="https://eu.aeke.com/products/buy-aeke-k1?sca_ref=11019964.wKUJzkQCK3" target="_blank" rel="sponsored noopener noreferrer" aria-label="AEKE öffnen">
                <img src="/assets/images/partner-aeke-logo.png" alt="AEKE">
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
            <img src="/assets/images/partners-hero-banner.svg" alt="">
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-shell section-shell--wide editorial-stage editorial-stage--partner-videos">
        <div class="editorial-stage__copy" data-reveal>
          ${sectionHeader({
            eyebrow: "AEKE & XXL Nutrition",
            title: "So sieht die Partnerschaft im echten Einsatz aus.",
            text:
              "Die beiden Shorts zeigen, wie AEKE und XXL Nutrition nicht nur als Marken auftauchen, sondern direkt im Performance-Kontext sichtbar werden: smartes Training auf der einen Seite, konkrete Sporternaehrung auf der anderen."
          })}
          <div class="summary-rows summary-rows--compact">
            <article class="summary-row">
              <h3>AEKE im Trainingskontext</h3>
              <p>Das System wird dort sichtbar, wo smarte Hardware, Bewegung und gefuehrtes Training wirklich zusammenkommen.</p>
            </article>
            <article class="summary-row">
              <h3>XXL Nutrition mit direktem Mehrwert</h3>
              <p>Die Partnerschaft wird ueber konkrete Empfehlung und den Rabattcode Dominik sofort greifbar statt nur erzaehlt.</p>
            </article>
          </div>
        </div>
        <div class="editorial-stage__media editorial-stage__media--video partner-video-stage" data-reveal>
          <div class="partner-video-stage__grid" aria-label="Partner-Videos von AEKE und XXL Nutrition">
            ${partnerBrandCards
              .filter(({ videoEmbedUrl, videoWatchUrl }) => videoEmbedUrl && videoWatchUrl)
              .map(
                ({
                  name,
                  href,
                  videoEmbedUrl,
                  videoWatchUrl,
                  videoImage,
                  videoAlt,
                  videoHeadline,
                  videoActionLabel,
                  videoEyebrow,
                  videoButtonLabel
                }) => `
                  <article class="partner-video-card">
                    ${deferredVideoEmbed({
                      embedUrl: videoEmbedUrl,
                      watchUrl: videoWatchUrl,
                      title: `${name} bei Camp Dörfl`,
                      image: videoImage,
                      alt: videoAlt,
                      headline: videoHeadline || `${name} im Einsatz.`,
                      actionLabel: videoActionLabel || "Short laden",
                      eyebrow: videoEyebrow || name,
                      short: true
                    })}
                    ${
                      href
                        ? `<a class="partner-video-card__button" href="${href}" target="_blank" rel="sponsored noopener noreferrer">${videoButtonLabel || name}</a>`
                        : ""
                    }
                  </article>
                `
              )
              .join("")}
          </div>
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
          title: "Kurz geklärt.",
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
    content
  });
}

function contactPage() {
  const content = `
    <section class="ff-hero ff-hero--split ff-hero--contact">
      <img class="ff-hero__img" src="/assets/images/dominik-gym-grey.jpg" alt="" aria-hidden="true">
      <div class="ff-hero__scrim" aria-hidden="true"></div>
      <div class="section-shell ff-hero__shell">
        <div class="ff-hero__inner">
          <p class="ff-hero__eyebrow" data-reveal>Kontakt</p>
          <h1 class="ff-hero__title" data-reveal>Klar.<br>Persönlich.<br><span>Direkt.</span></h1>
          <p class="ff-hero__lead" data-reveal>
            Ob Premium Personal Training, Firmenfitness, Events, App oder Kooperation: hier startet der direkte Kontakt für alle Anfragearten auf der Seite.
          </p>
          <p class="ff-hero__support" data-reveal>
            Trag einfach deine Kontaktdaten und dein Anliegen ein. Die Nachricht wird direkt an dominik@campdoerfl.de gesendet.
          </p>
          <div class="ff-hero__actions" data-reveal>
            <a class="button button--primary" href="#kontaktformular"><span>Formular öffnen</span><span aria-hidden="true">&rarr;</span></a>
            <a class="button button--secondary-light" href="${site.instagram}" rel="noreferrer"><span>${socialButtonLabel(site.instagram, "Instagram")}</span><span aria-hidden="true">&rarr;</span></a>
          </div>
          <dl class="ff-hero__facts" data-reveal aria-label="Kontaktwege">
            <div><dt>Direkt</dt><dd>Ohne Umwege</dd></div>
            <div><dt>NBG</dt><dd>Nürnberg</dd></div>
            <div><dt>1 Step</dt><dd>Anfrage starten</dd></div>
          </dl>
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
    title: "Kontakt | Camp Dörfl",
    description:
      "Kontakt zu Camp Dörfl für Premium Personal Training, Firmenfitness, Events, Camp Dörfl App und Kooperationen in Nürnberg.",
    keywords: ["Camp Dörfl Kontakt", "Performance Beratung Nürnberg", "Premium Personal Training Nürnberg", "Firmenfitness Nürnberg", "Moderator Nürnberg"],
    bodyClass: "page-premium page-contact",
    content
  });
}

export const pages = [
  { route: "/", render: homePage },
  { route: "/app/", render: appPage },
  { route: "/personal-coaching/", render: personalCoachingPage },
  { route: "/firmenfitness/", render: firmenfitnessPage },
  { route: "/events/", render: eventsPage },
  { route: "/partner/", render: partnerPage },
  { route: "/executive-performance/", render: personalCoachingPage },
  { route: "/erfolge-im-team/", render: teamSuccessPage },
  { route: "/ueber-dominik/", render: teamSuccessPage },
  { route: "/impressum/", render: impressumPage },
  { route: "/cookies/", render: cookiesPage },
  { route: "/datenschutz/", render: privacyPage },
  { route: "/werbung-partnerlinks/", render: partnerTransparencyPage },
  { route: "/barrierefreiheit/", render: accessibilityPage },
  { route: "/kontakt/", render: contactPage }
];
