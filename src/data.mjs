/**
 * Prozentkodiert Umlaute in einem Pfad. Seit dem Umzug der Hauptseite auf
 * `/personal-trainer-nuernberg/` trägt keine Route mehr einen Umlaut — die
 * Funktion bleibt das Netz für künftige Routen: Eine rohe Umlaut-Adresse
 * beantwortet der Worker nur über eine Umleitung, die kodierte direkt mit 200.
 * Sie gilt überall dort, wo eine absolute Adresse entsteht: Canonical,
 * og:url, Breadcrumb und beide Sitemaps.
 */
export function encodePath(path = "/") {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export const site = {
  name: "Camp Dörfl",
  ownerName: "Dominik Dörfl",
  domain: "campdoerfl.de",
  url: "https://www.campdoerfl.de",
  email: "dominik@campdoerfl.de",
  phone: "+4915561562648",
  phoneDisplay: "0155 61562648",
  instagram: "https://www.instagram.com/dominik.doerfl/",
  facebook: "https://www.facebook.com/dominik.dorfl/?locale=de_DE",
  linkedin: "https://de.linkedin.com/in/dominik-dörfl-328445211",
  spotify: "https://open.spotify.com/show/4J0iYTYCdGDuhwkLsXxNo8",
  location: "Nürnberg",
  streetAddress: "Kraftshofer Hauptstraße 154",
  postalCode: "90427",
  city: "Nürnberg",
  country: "Deutschland",
  description:
    "Camp Dörfl ist das Performance System aus Premium Personal Training, Firmenfitness, Events und App in Nürnberg.",
  keywords: [
    "Camp Dörfl",
    "Dominik Dörfl",
    "Personal Trainer Nürnberg",
    "Performance Coaching Nürnberg",
    "Personal Training Nürnberg",
    "Premium Personal Training Nürnberg",
    "Moderator in Nürnberg",
    "Firmenfitness",
    "Firmenfitness Nürnberg",
    "Executive Fitness Coaching Nürnberg",
    "Performance App",
    "Fitness App Nürnberg",
    "Camp Dörfl App",
    "Ernährungsberatung Nürnberg",
    "2D Körperanalyse Nürnberg",
    "Performance Coach Nürnberg"
  ]
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/moderator-nuernberg/" },
  { label: "Firmenfitness", href: "/firmenfitness/" },
  { label: "Fit werden", href: "/fit-werden/" },
  { label: "Personal Trainer Nürnberg", href: "/personal-trainer-nuernberg/" },
  { label: "Partner", href: "/partner/" },
  { label: "Camp Dörfl App", href: "/app/" },
  { label: "Shop", href: "/shop/" },
  { label: "Kontakt", href: "/kontakt/" }
];

// Alle Seiten nach Anliegen sortiert. Diese Gliederung gilt gleichermaßen für
// das Menü und die Fußzeile, damit Besucher überall dieselbe Ordnung vorfinden
// und nicht in einer langen Liste suchen müssen.
export const navCategories = [
  {
    title: "Training & Coaching",
    items: [
      { label: "Personal Trainer Nürnberg", href: "/personal-trainer-nuernberg/" },
      { label: "Fit werden in 12 Wochen", href: "/fit-werden/" },
      { label: "Körperanalyse Nürnberg", href: "/koerperanalyse-nuernberg/" },
      { label: "Bodybuilding Coaching", href: "/bodybuilding-coaching-wettkampfvorbereitung/" },
      { label: "Personal Training Kosten", href: "/personal-training-kosten-nuernberg/" }
    ]
  },
  {
    title: "Für Unternehmen",
    items: [
      { label: "Firmenfitness", href: "/firmenfitness/" },
      { label: "Gesundheitstag Nürnberg", href: "/gesundheitstag-nuernberg/" },
      { label: "Executive Performance", href: "/executive-performance/" },
      { label: "Events & Moderation", href: "/moderator-nuernberg/" },
      { label: "Keynote Speaker Nürnberg", href: "/keynote-speaker-nuernberg/" }
    ]
  },
  {
    title: "App & Member",
    items: [
      { label: "Camp Dörfl App", href: "/app/" },
      { label: "Member Area", href: "/member/", isMember: true }
    ]
  },
  {
    title: "Camp Dörfl",
    items: [
      { label: "Startseite", href: "/" },
      { label: "Über Dominik", href: "/ueber-dominik/" },
      { label: "Erfolge im Team", href: "/erfolge-im-team/" },
      { label: "Shop & Kollektion", href: "/shop/" },
      { label: "Partner", href: "/partner/" },
      { label: "XXL Nutrition Rabattcode", href: "/xxl-nutrition-rabattcode/" },
      { label: "Presse & Medien", href: "/presse-medien/" },
      { label: "Kontakt", href: "/kontakt/" }
    ]
  },
  {
    title: "Wissen & Leitfäden",
    items: [
      { label: "Expertenwissen", href: "/expertenwissen/" },
      { label: "Personal Trainer auswählen", href: "/personal-trainer-auswaehlen-nuernberg/" },
      { label: "Bodybuilding Klassen & Gewichtslimits", href: "/bodybuilding-klassen-gewichtslimits/" },
      { label: "Dauer der Wettkampfvorbereitung", href: "/bodybuilding-wettkampfvorbereitung-dauer/" },
      { label: "BIA & InBody Vergleich", href: "/bia-inbody-koerperanalyse-vergleich/" },
      { label: "Redaktionelle Richtlinien", href: "/redaktionelle-richtlinien/" }
    ]
  },
  {
    title: "Termine & Kalender",
    items: [
      { label: "Bodybuilding Wettkämpfe 2026", href: "/bodybuilding-wettkaempfe-2026/" },
      { label: "Mr. Olympia Sieger", href: "/mr-olympia-sieger/" },
      { label: "Arnold Classic Sieger", href: "/arnold-classic-sieger/" },
      { label: "Boxen Wettkämpfe 2026", href: "/boxen-wettkaempfe-2026/" },
      { label: "MMA Wettkämpfe 2026", href: "/mma-wettkaempfe-2026/" },
      { label: "Triathlon Kalender 2026", href: "/triathlon-kalender-2026/" },
      { label: "Laufkalender 2026", href: "/laufkalender-2026/" },
      { label: "Golfturniere 2026", href: "/golfturniere-2026/" },
      { label: "Sport Spot finden", href: "/sport-spot-finden/" }
    ]
  }
];

export const appFeatures = [
  {
    title: "Training",
    text:
      "Individuelle Pläne, abgeschlossene Einheiten, Fortschritt pro Woche und klare Umsetzung für Studio, Reisen und volle Kalender.",
    detail: "Kraft · Ausdauer · Hyrox · Alltag"
  },
  {
    title: "Ernährung",
    text:
      "Strategie, Ernährungstagebuch, Barcode-Scanner, Zieltreue und geplanter AI-Speisekarten-Scanner für Entscheidungen im echten Leben.",
    detail: "Tagebuch · Scanner · Nutrition Score"
  },
  {
    title: "Check-ins",
    text:
      "Gewicht, Umfänge, Ernährungseinhaltung und automatische Fortschrittsbilder-Vergleiche machen Entwicklung sichtbar.",
    detail: "Fotos · Werte · Feedback"
  },
  {
    title: "Health & Longevity",
    text:
      "Schlaf, VO2max, Blutbild und Vitalwerte werden perspektivisch zu einem Health-Bereich für langfristige Leistungsfähigkeit.",
    detail: "Schlaf · VO2max · Vitalwerte"
  },
  {
    title: "Camp Score",
    text:
      "Ein eigener Performance Score bündelt Training, Ernährung, Routinen und Fortschritt zu einem einfachen Orientierungspunkt.",
    detail: "Punkte · Routinen · Fortschritt"
  },
  {
    title: "GPS & Challenges",
    text:
      "Strecken planen, laufen, fahren, teilen und automatisch Pace sowie Leistung berechnen lassen. Für Einzelziele und Community-Challenges.",
    detail: "GPS · Routen · Community"
  },
  {
    title: "Community",
    text:
      "Clubs, Gruppen, Puzzle-Gym-Anbindung und Challenges verbinden digitale Struktur mit echter sozialer Energie.",
    detail: "Clubs · Events · Hub"
  },
  {
    title: "Wearables",
    text:
      "Polar und Apple Watch Werte sind als Integrationen angelegt, damit Performance nicht isoliert betrachtet wird.",
    detail: "Polar · Apple Watch · Daten"
  }
];

export const homeFlow = [
  {
    step: "01",
    title: "Standort verstehen",
    text:
      "Du siehst auf einen Blick, wo du bei Training, Ernährung, Health und Alltag gerade wirklich stehst."
  },
  {
    step: "02",
    title: "System aufsetzen",
    text:
      "Aus Ziel, Kalender und Verantwortung entsteht ein realistisches System statt eines Plans für perfekte Wochen."
  },
  {
    step: "03",
    title: "Fortschritt steuern",
    text:
      "Check-ins, Score, Daten und Community sorgen dafür, dass Fortschritt sichtbar und anpassbar bleibt."
  }
];

export const homeFunctionPillars = [
  {
    title: "Training & Planung",
    detail: "Struktur",
    text:
      "Individuelle Trainingsplanung für Studio, Reisen und volle Wochen. Nicht als starres PDF, sondern als laufendes System.",
    items: ["Trainingsplanung", "Wochenüberblick", "Abgeschlossene Einheiten", "Anpassung bei Zeitmangel"]
  },
  {
    title: "Ernährung & Umsetzung",
    detail: "Compliance",
    text:
      "Ernährung wird nicht nur geplant, sondern im Alltag messbar gemacht. Genau dort, wo Entscheidungen passieren.",
    items: ["Ernährungsplanung", "Tagebuch", "Barcode-Scanner", "Nutrition Score"]
  },
  {
    title: "Health & Fortschritt",
    detail: "Messbar",
    text:
      "Körperdaten, Schlaf, Routinen und Fortschrittsbilder werden zu klaren Signalen statt zu losem Tracking.",
    items: ["Check-ins", "Fortschrittsbilder", "Gewicht und Umfänge", "Camp Score"]
  },
  {
    title: "Community & Performance",
    detail: "Verbindung",
    text:
      "Digitale Struktur trifft auf echte soziale Energie durch Challenges, GPS-Funktionen, Clubs und Puzzle Gym.",
    items: ["GPS und Routen", "Challenges", "Community-Gruppen", "Puzzle-Gym-Anbindung"]
  }
];

export const appFunctionRows = [
  {
    icon: "training",
    label: "Dein Plan",
    title: "Training nach deinem Ziel"
  },
  {
    icon: "nutrition",
    label: "Smart Nutrition",
    title: "Ernährung, die zu dir passt"
  },
  {
    icon: "tools",
    label: "Scan & Track",
    title: "Tools für deinen Alltag"
  },
  {
    icon: "club",
    label: "Run · Ride · Connect",
    title: "Performance Club"
  },
  {
    icon: "progress",
    label: "Check · Adapt · Grow",
    title: "Fortschritt & Coach"
  },
  {
    icon: "ai",
    label: "KI × Expertise",
    title: "Camp Dörfl Methode"
  }
];

export const landingStats = [
  { value: "01", label: "Premium Personal Training" },
  { value: "02", label: "Firmenfitness" },
  { value: "03", label: "Events" },
  { value: "04", label: "Camp Dörfl App" }
];

export const landingPrograms = [
  {
    image: "/assets/images/dominik-personal-coaching-client.webp",
    alt: "Dominik Dörfl begleitet einen Kunden beim Personal Training im Fitnessstudio",
    imagePosition: "center 14%",
    tag: "01",
    icon: "trainer",
    title: "Premium Personal Training",
    meta: "Training, Ernährung und persönliche Führung",
    text:
      "Für Privatpersonen: flexibel mit Personal Training oder als Premium Personal Training mit Analyse, Planung, App und laufender Steuerung.",
    highlights: ["Personal Training ohne Bindung", "Premium Training mit Analyse", "Training und Ernährung aus einer Hand"],
    cta: "Premium Personal Training ansehen",
    href: "/personal-trainer-nuernberg/"
  },
  {
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    alt: "Dominik Dörfl erklärt einem Teilnehmer die Ergebnisse einer Körperanalyse",
    imagePosition: "center 20%",
    tag: "02",
    icon: "corporate",
    title: "Firmenfitness",
    meta: "InBody, 2D-Technik und Beratung vom Profi",
    text:
      "Mitarbeitende werden präzise analysiert und danach verständlich beraten. Ernährung und Routinen werden passend zum Berufsalltag übersetzt.",
    highlights: ["2D-Körperanalyse und InBody", "Individuelle Mitarbeiterberatung", "Einfach verkaufbares Firmenformat"],
    cta: "Firmenfitness ansehen",
    href: "/firmenfitness/"
  },
  {
    image: "/assets/images/dominik-moderator-segmueller.webp",
    alt: "Dominik Dörfl moderiert eine Veranstaltung bei Segmüller",
    imagePosition: "center 12%",
    tag: "03",
    icon: "events",
    title: "Events",
    meta: "Moderation für Firmen, Sport und Gala",
    text:
      "Professionelle Moderation für Firmenveranstaltungen, Sportevents, Galas und Podiumsdiskussionen mit sicherer Bühnenpräsenz.",
    highlights: ["Firmenveranstaltung", "Sportevent und Gala", "Podiumsdiskussion"],
    cta: "Events entdecken",
    href: "/moderator-nuernberg/"
  },
  {
    image: "/assets/images/app-screen-all-tools.webp",
    alt: "Bildschirmansicht der Camp Dörfl App mit Trainings- und Ernährungsfunktionen",
    imagePosition: "center 18%",
    tag: "04",
    icon: "app",
    title: "Camp Dörfl App",
    meta: "Digitaler Zugang zum Performance System",
    text:
      "Der digitale Ort für Training, Ernährung, Check-ins, Fortschritt und Community. Besonders stark in Kombination mit Coaching.",
    highlights: ["Planung und Check-ins", "Fortschritt und Score", "Community und Routen"],
    cta: "App entdecken",
    href: "/app/"
  }
];

export const landingProofCards = [
  {
    title: "2x Deutscher Meister",
    text: "Leistung auf höchstem Niveau in Bodybuilding und Powerlifting, nicht nur Theorie.",
    image: "/assets/images/dominik-bodybuilding-desert.webp",
    alt: "Dominik Dörfl in Bodybuilding-Wettkampfform bei einem Fotoshooting in einer Felslandschaft"
  },
  {
    title: "Coaching in der Praxis",
    text: "Arbeit mit Athleten und ambitionierten Menschen, die echte Führung und Struktur brauchen.",
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    alt: "Dominik Dörfl begleitet einen Klienten beim Training auf dem Bike-Ergometer"
  },
  {
    title: "Ausdauer und Härte",
    text: "Ironman 70.3, Marathon, Triathlon und extreme Herausforderungen als gelebte Leistungsfähigkeit.",
    image: "/assets/images/dominik-athlete-bike-yellow.webp",
    alt: "Dominik Dörfl im gelben Radtrikot neben seinem Zeitfahrrad nach einer Ausdauereinheit"
  },
  {
    title: "Unternehmerische Perspektive",
    text: "Ein System entwickelt für Menschen mit Verantwortung, nicht für perfekte Laborbedingungen.",
    image: "/assets/images/dominik-moderator-mic.webp",
    alt: "Dominik Dörfl im Anzug mit Mikrofon während einer Veranstaltung"
  }
];

export const landingHowItWorks = [
  {
    step: "01",
    title: "App oder Premium Personal Training wählen",
    text:
      "Du entscheidest dich für den digitalen Zugang oder für das exklusive Premium Personal Training in Nürnberg."
  },
  {
    step: "02",
    title: "Analyse und Plan erhalten",
    text:
      "Training, Ernährung, Alltag und Ziel werden in ein System übersetzt, das zu deinem Leben passt."
  },
  {
    step: "03",
    title: "Fortschritt sichtbar machen",
    text:
      "Über App, Vergleiche, Analysen und persönliche Führung bleibt Entwicklung klar und messbar."
  }
];

export const landingStartCards = [
  {
    tag: "App Zugang",
    title: "Digital starten",
    price: "Zugang anfragen",
    text: "Für Menschen, die Training, Ernährung, Clubs, GPS und Score digital in den Alltag integrieren wollen."
  },
  {
    tag: "Exclusive Training",
    title: "Persönlich geführt",
    price: "Nur wenige Plätze",
    text: "Für Menschen mit Verantwortung, die in Nürnberg ein eng geführtes System mit Personal Trainings und Analysen wollen."
  },
  {
    tag: "Beratung",
    title: "Beratung anfragen",
    price: "Nürnberg",
    text: "Für alle, die zuerst klären wollen, welcher Einstieg sinnvoll ist und wie Camp Dörfl zu ihrem Leben passt."
  }
];

export const achievements = [
  { value: "Ex Profi Athlet", label: "auf europäischem Spitzenlevel" },
  { value: "2x Deutscher Meister", label: "Bodybuilding und Powerlifting" },
  { value: "Ironman 70.3", label: "Finisher" },
  { value: "8848 hm", label: "zu Fuß hoch und runter in 15 Stunden" },
  { value: "270 km", label: "Radtour innerhalb von 24 Stunden" },
  { value: "Top-Athleten", label: "Coaching von Olympia-Athleten, Meistern und internationalen Platzierungen" }
];

export const dominikFacts = [
  "Unternehmer, Athlet, Coach, Moderator und Gründer von Camp Dörfl",
  "Deutscher Meister im Bodybuilding und Powerlifting",
  "IFBB Pro Bodybuilding",
  "Marathon-, Halbmarathon-, Triathlon- und Ironman-70.3-Finisher",
  "270 km Radtour in 24 Stunden und 8848 Höhenmeter in 15 Stunden",
  "Ehemaliger Fußballer auf Auswahl-Niveau",
  "Coach von Top-Athleten, Olympia-Athleten, deutschen Meistern, Vize-Weltmeistern und internationalen Top-Platzierungen",
  "Moderator und Gastgeber hochwertiger Sport-, Fitness- und Business-Events",
  "Partner von XXL Nutrition und AEKE",
  "Inhaber clever fit Nürnberg Süd seit November 2024",
  "Entwickler der Camp Dörfl App"
];

export const timeline = [
  {
    title: "Fußball und frühe Leistungsumgebung",
    text:
      "Dominik kommt aus dem Mannschaftssport. Auswahl-Niveau, klare Rollen, Drucksituationen und Training als fester Teil des Alltags prägen seinen Blick auf Leistung."
  },
  {
    title: "Bodybuilding und Powerlifting",
    text:
      "Aus Struktur wird Spezialisierung: Deutscher Meister im Bodybuilding, Deutscher Meister im Powerlifting und später IFBB Pro. Der Körper wird zum messbaren System."
  },
  {
    title: "Ausdauer und extreme Umsetzung",
    text:
      "Marathon, Halbmarathon, Triathlon, Ironman 70.3, 270 km Rad in 24 Stunden und 8848 Höhenmeter in 15 Stunden zeigen: Performance endet nicht an einer Sportart."
  },
  {
    title: "Coaching und Athletenentwicklung",
    text:
      "Dominik coacht Top-Athleten, Olympia-Athleten, deutsche Meister, Vize-Weltmeister und internationale Platzierungen. Der Anspruch bleibt: klare Systeme statt Zufall."
  },
  {
    title: "Unternehmertum und Community",
    text:
      "Mit clever fit Nürnberg Süd und Camp Dörfl verbindet er physische Orte, digitale Begleitung und Community zu einem skalierbaren Performance-Ökosystem."
  }
];

export const executiveSteps = [
  "Start mit 2D-Körperanalyse und InBody-Messung",
  "Zielgespräch für Körper, Alltag, Kalender und Prioritäten",
  "Individuelle Ernährungs- und Trainingsplanung",
  "Voller Zugang zur Camp Dörfl App",
  "Wöchentliche Updates der Planung",
  "InBody-Messung alle vier Wochen",
  "Ein Personal Training pro Monat mit optionalen Zusatzterminen"
];

export const corporateSteps = [
  "Vorgespräch mit Ziel, Standort und Teamgröße",
  "2D-Körperanalyse und InBody-Messung für Mitarbeitende",
  "Individuelle Auswertung mit verständlichen Kennzahlen",
  "Professionelle Beratung zu Ernährung, Bewegung und Routinen",
  "Empfehlungen passend zum Berufsmodell und Arbeitsalltag",
  "Optionale Follow-ups, Challenges oder App-Anbindung"
];

export const sponsors = ["XXL Nutrition", "AEKE", "Puzzle Gym", "Trueformance", "clever fit Nürnberg Süd", "Strava"];

export const contactTopicConfigs = [
  {
    value: "Personal Trainer / Premium Personal Training",
    slug: "premium-training",
    cardTag: "1:1 Coaching",
    cardTitle: "Premium Personal Training",
    cardText: "Für persönliche Führung rund um Training, Ernährung, Routinen und sichtbaren Fortschritt.",
    guideTitle: "Persönlicher Einstieg mit klarer Richtung.",
    guideText:
      "Beschreibe Zielbild, Ausgangslage und was im Alltag realistisch ist. So wird schnell sichtbar, ob ein 1:1 Einstieg, Hybrid-Modell oder zuerst ein Orientierungsgespräch sinnvoll ist.",
    guidePoints: ["Zielbild und aktueller Stand", "Realistische Wochenstruktur", "Gewünschte Form der Begleitung"],
    messageLabel: "Was soll sich durch die Zusammenarbeit konkret verändern?",
    messagePlaceholder: "Beschreibe kurz dein Ziel, deinen aktuellen Stand und warum du gerade jetzt starten willst.",
    fields: [
      {
        type: "text",
        name: "training_focus",
        label: "Worum geht es dir vor allem?",
        placeholder: "z. B. Körperfett reduzieren, Muskulatur aufbauen oder Leistung zurückholen"
      },
      {
        type: "select",
        name: "coaching_entry",
        label: "Wie möchtest du einsteigen?",
        options: ["Noch offen", "1:1 vor Ort in Nürnberg", "Hybrid aus App und Coaching", "Erstgespräch zur Einordnung"]
      },
      {
        type: "text",
        name: "weekly_reality",
        label: "Was ist pro Woche realistisch?",
        placeholder: "z. B. drei Einheiten, klare Ernährung und feste Routinen"
      }
    ]
  },
  {
    value: "Firmenfitness",
    slug: "firmenfitness",
    cardTag: "Unternehmen",
    cardTitle: "Firmenfitness",
    cardText: "Für deutschlandweite Gesundheitstage, Ernährungsvorträge und Team-Aktivierungen mit Substanz.",
    guideTitle: "Klare Firmenanfrage statt losem Gesundheitsprogramm.",
    guideText:
      "Hilfreich sind Zielgruppe, gewünschtes Format und der Rahmen im Unternehmen. So kann schnell eingeordnet werden, was intern wirklich Sinn macht und sauber umsetzbar ist.",
    guidePoints: ["Zielgruppe und Berufsfeld", "Gewünschtes Format", "Ort, Größe und Timing"],
    messageLabel: "Was soll das Format im Unternehmen konkret bewirken?",
    messagePlaceholder: "Beschreibe kurz Anlass, Zielgruppe und was Mitarbeitende oder das Unternehmen aus dem Format mitnehmen sollen.",
    fields: [
      {
        type: "select",
        name: "company_size",
        label: "Wie viele Personen sollen erreicht werden?",
        options: ["Noch offen", "Bis 25 Personen", "25 bis 100 Personen", "100 bis 300 Personen", "Mehr als 300 Personen"]
      },
      {
        type: "select",
        name: "corporate_format",
        label: "Welches Format ist interessant?",
        options: ["Noch offen", "Gesundheitstag mit InBody und Beratung", "Ernährungsvortrag passend zum Berufsfeld", "Bewegungsimpuls und Team-Aktivierung", "Kombination aus mehreren Angeboten"]
      },
      {
        type: "text",
        name: "corporate_location",
        label: "Wo soll es stattfinden?",
        placeholder: "z. B. direkt im Unternehmen in Hamburg, Berlin, Nürnberg oder bundesweit an mehreren Standorten"
      },
      {
        type: "text",
        name: "corporate_timing",
        label: "Wann soll das Format stattfinden?",
        placeholder: "z. B. Oktober 2026, Q1 2027 oder noch offen"
      }
    ]
  },
  {
    value: "Events / Moderation",
    slug: "events",
    cardTag: "Bühne",
    cardTitle: "Events und Moderation",
    cardText: "Für Moderation, Hosting und Event-Präsenz mit Timing, Ruhe und professioneller Wirkung.",
    guideTitle: "Event-Anfragen mit klarem Ablaufgefühl.",
    guideText:
      "Am hilfreichsten sind Format, Publikum und Timing. Damit lässt sich schnell einschätzen, welche Rolle Camp Dörfl auf der Bühne oder im Ablauf übernehmen kann.",
    guidePoints: ["Art des Events", "Publikum und Größenordnung", "Termin oder Zeitraum"],
    messageLabel: "Worum geht es beim Event und welche Rolle soll Camp Dörfl übernehmen?",
    messagePlaceholder: "Beschreibe kurz das Event, das Publikum und welche Art von Moderation, Hosting oder Präsenz gesucht wird.",
    fields: [
      {
        type: "text",
        name: "event_type",
        label: "Was für ein Event ist es?",
        placeholder: "z. B. Messe, Opening, Panel, Gala, Fitness- oder Business-Event"
      },
      {
        type: "select",
        name: "audience_size",
        label: "Wie groß ist das Publikum?",
        options: ["Noch offen", "Bis 50 Personen", "50 bis 200 Personen", "200 bis 500 Personen", "Mehr als 500 Personen"]
      },
      {
        type: "text",
        name: "event_timing",
        label: "Wann findet es statt?",
        placeholder: "z. B. 12. September 2026 oder Q1 2027"
      }
    ]
  },
  {
    value: "Camp Dörfl App",
    slug: "app",
    cardTag: "Digital",
    cardTitle: "Camp Dörfl App",
    cardText: "Für Menschen und Teams, die Training, Ernährung, Fortschritt und Community strukturiert bündeln wollen.",
    guideTitle: "Digitaler Einstieg mit klarer Nutzungsidee.",
    guideText:
      "Je klarer wird, ob es um Training, Ernährung, Community oder die Kombination mit Coaching geht, desto passender kann der Einstieg in die App oder ins System gewählt werden.",
    guidePoints: ["Was die App lösen soll", "Allein oder mit Begleitung", "Aktuelle Alltags-Herausforderung"],
    messageLabel: "Was soll die App für dich oder euer Team konkret einfacher machen?",
    messagePlaceholder: "Beschreibe kurz, ob es vor allem um Training, Ernährung, Struktur, Community oder die Kombination daraus geht.",
    fields: [
      {
        type: "select",
        name: "app_focus",
        label: "Wofür möchtest du die App vor allem nutzen?",
        options: ["Noch offen", "Training strukturieren", "Ernährung im Alltag führen", "Fortschritt sichtbar machen", "Alles zusammen"]
      },
      {
        type: "select",
        name: "app_entry",
        label: "Wie willst du starten?",
        options: ["Noch offen", "Nur mit App-Zugang", "App plus persönliche Begleitung", "App als Team- oder Community-Thema"]
      },
      {
        type: "text",
        name: "app_challenge",
        label: "Was bremst dich aktuell am meisten?",
        placeholder: "z. B. fehlende Struktur, inkonstante Ernährung oder zu wenig Überblick"
      }
    ]
  },
  {
    value: "Erfolge im Team",
    slug: "erfolge-im-team",
    cardTag: "Einstieg",
    cardTitle: "Erfolge im Team",
    cardText: "Für Menschen, die ins Camp-Dörfl-System, in die Community oder in einen klaren nächsten Schritt hineinfinden wollen.",
    guideTitle: "Gemeinsamer Einstieg statt losem Interesse.",
    guideText:
      "Wenn du kurz beschreibst, wo du gerade stehst und wonach du suchst, lässt sich besser einordnen, welcher Bereich im Camp-Dörfl-System gerade wirklich zu dir passt.",
    guidePoints: ["Aktuelle Rolle oder Situation", "Was dich anspricht", "Welcher nächste Schritt gesucht wird"],
    messageLabel: "Was suchst du im Camp-Dörfl-System oder im gemeinsamen Einstieg?",
    messagePlaceholder: "Beschreibe kurz, wo du gerade stehst und welcher nächste Schritt für dich interessant wäre.",
    fields: [
      {
        type: "text",
        name: "team_role",
        label: "Wo stehst du gerade?",
        placeholder: "z. B. Wiedereinstieg, ambitionierter Alltag, sportliches Ziel oder Community-Interesse"
      },
      {
        type: "select",
        name: "team_interest",
        label: "Was interessiert dich besonders?",
        options: ["Noch offen", "Persönliche Entwicklung", "Training und App", "Community und Gruppen", "Orientierung für den besten Einstieg"]
      },
      {
        type: "text",
        name: "team_next_step",
        label: "Welcher nächste Schritt wäre für dich hilfreich?",
        placeholder: "z. B. Gespräch, App-Zugang, Training oder Einordnung"
      }
    ]
  },
  {
    value: "Kooperation / Sponsoring",
    slug: "kooperation",
    cardTag: "Partner",
    cardTitle: "Kooperation und Sponsoring",
    cardText: "Für Marken, Produkte, Orte und Partnerschaften, die glaubwürdig zu Camp Dörfl passen sollen.",
    guideTitle: "Kooperationsanfragen mit Substanz.",
    guideText:
      "Hilfreich sind Marke, Produkt oder Ort sowie die Idee hinter der Zusammenarbeit. So wird schneller klar, ob eine Partnerschaft wirklich passt und welcher Rahmen sinnvoll wäre.",
    guidePoints: ["Marke, Produkt oder Ort", "Art der Zusammenarbeit", "Warum der Fit zu Camp Dörfl da ist"],
    messageLabel: "Warum passt die Zusammenarbeit aus deiner Sicht zu Camp Dörfl?",
    messagePlaceholder: "Beschreibe kurz Marke, Produkt oder Idee und warum die Zusammenarbeit glaubwürdig und sinnvoll wäre.",
    fields: [
      {
        type: "url",
        name: "brand_link",
        label: "Link zur Marke, zum Produkt oder Projekt",
        placeholder: "https://..."
      },
      {
        type: "select",
        name: "collaboration_type",
        label: "Welche Art Zusammenarbeit ist interessant?",
        options: ["Noch offen", "Content oder Social", "Event-Partnerschaft", "Produkt- oder Markenkooperation", "Location oder Community-Aktivierung", "Sponsoring"]
      },
      {
        type: "text",
        name: "brand_fit",
        label: "Wo siehst du den besten Fit?",
        placeholder: "z. B. Community, Unternehmen, Event, App oder Performance-Umfeld"
      }
    ]
  },
  {
    value: "Sonstiges",
    slug: "sonstiges",
    cardTag: "Offen",
    cardTitle: "Allgemeine Anfrage",
    cardText: "Für Themen, die nicht in eine klare Kategorie fallen, aber persönlich besprochen werden sollen.",
    guideTitle: "Offene Anfrage mit klarem Kern.",
    guideText:
      "Wenn du kurz Anlass, Ziel und gewünschten nächsten Schritt beschreibst, lässt sich trotzdem schnell die richtige Richtung finden.",
    guidePoints: ["Anlass der Anfrage", "Worum es konkret geht", "Welcher nächste Schritt hilfreich wäre"],
    messageLabel: "Worum geht es in deiner Anfrage?",
    messagePlaceholder: "Beschreibe kurz dein Anliegen, den Hintergrund und wie Camp Dörfl dir weiterhelfen kann.",
    fields: [
      {
        type: "text",
        name: "request_context",
        label: "Was ist der Anlass?",
        placeholder: "z. B. Empfehlung, spontane Idee oder konkretes Vorhaben"
      },
      {
        type: "text",
        name: "request_goal",
        label: "Was wäre ein gutes Ergebnis?",
        placeholder: "z. B. Klarheit, passendes Angebot oder direkter Austausch"
      },
      {
        type: "text",
        name: "request_next_step",
        label: "Welcher nächste Schritt wäre hilfreich?",
        placeholder: "z. B. kurzes Gespräch, Mail-Antwort oder Einordnung"
      }
    ]
  }
];

export const contactTopics = contactTopicConfigs.map((topic) => topic.value);

// ---------------------------------------------------------------------------
// Shop — Vorbestellung statt Kasse
//
// Der Shop verkauft nicht selbst: Jede Auswahl endet als E-Mail bei Dominik,
// verbindlich wird sie erst mit seiner Bestätigung. Preise, Größen und Versand
// stehen deshalb genau einmal hier. Die Seite, die Zusammenfassung im Browser
// (src/main.js) und die E-Mail rechnen mit denselben Zahlen — ändert sich ein
// Preis, reicht diese Datei.
// ---------------------------------------------------------------------------

export const shopSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const shopShipping = Object.freeze({
  price: 4.9,
  voucherPrice: 2.9,
  label: "Versand innerhalb Deutschlands",
  note: "Pauschale pro Bestellung, unabhängig von der Stückzahl."
});

export const shopProducts = [
  {
    id: "shirt-creme",
    name: "Camp Dörfl Shirt",
    variant: "Creme",
    category: "Shirt",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#d5c39f",
    image: "/assets/images/shop/camp-doerfl-shirt-creme.webp",
    alt: "Camp Dörfl Shirt in Creme mit goldenem #MEMBER Emblem auf der Brust",
    text: "Warmer Sandton mit goldenem Emblem — der Ton, mit dem die Kollektion angefangen hat."
  },
  {
    id: "shirt-off-white",
    name: "Camp Dörfl Shirt",
    variant: "Off White",
    category: "Shirt",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#e7e0d1",
    image: "/assets/images/shop/camp-doerfl-shirt-off-white.webp",
    alt: "Camp Dörfl Shirt in Off White mit goldenem #MEMBER Emblem auf der Brust",
    text: "Heller, ruhiger Grundton mit goldenem Emblem. Fällt im Alltag nicht auf, im Studio schon."
  },
  {
    id: "shirt-black",
    name: "Camp Dörfl Shirt",
    variant: "Black",
    category: "Shirt",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#16151a",
    image: "/assets/images/shop/camp-doerfl-shirt-black.webp",
    alt: "Camp Dörfl Shirt in Schwarz mit goldenem #MEMBER Emblem auf der Brust",
    text: "Schwarz auf Gold — der stärkste Kontrast der Kollektion und die sicherste Wahl."
  },
  {
    id: "shirt-wine",
    name: "Camp Dörfl Shirt",
    variant: "Wine",
    category: "Shirt",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#6d1f39",
    image: "/assets/images/shop/camp-doerfl-shirt-wine.webp",
    alt: "Camp Dörfl Shirt in Wine mit goldenem #MEMBER Emblem auf der Brust",
    text: "Tiefes Bordeaux mit Gold. Die Farbe, nach der auf der Trainingsfläche am häufigsten gefragt wird."
  },
  {
    id: "shirt-aprikose",
    name: "Camp Dörfl Shirt",
    variant: "Aprikose",
    category: "Shirt",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#e6938c",
    image: "/assets/images/shop/camp-doerfl-shirt-aprikose.webp",
    alt: "Camp Dörfl Shirt in Aprikose mit goldenem #MEMBER Emblem auf der Brust",
    text: "Warmes Altrosa mit goldenem Emblem — der hellste Ton der Kollektion und der auffälligste."
  },
  {
    id: "shirt-oversized-sand",
    name: "Camp Dörfl Shirt",
    variant: "Oversized Sand",
    category: "Shirt",
    price: 30,
    print: "Goldenes Emblem",
    swatch: "#c9bba8",
    image: "/assets/images/shop/camp-doerfl-shirt-oversized-sand.webp",
    alt: "Camp Dörfl Shirt in Sand, oversized geschnitten, mit goldenem #MEMBER Emblem",
    text: "Oversized geschnitten, 220 g/m² schwerer Stoff aus 100 % Baumwolle. Lockere Schulter, fällt gerade."
  },
  {
    id: "shirt-oversized-schwarz",
    name: "Camp Dörfl Shirt",
    variant: "Oversized Schwarz",
    category: "Shirt",
    price: 30,
    print: "Goldenes Emblem",
    swatch: "#121316",
    image: "/assets/images/shop/camp-doerfl-shirt-oversized-schwarz.webp",
    alt: "Camp Dörfl Shirt in Schwarz, oversized geschnitten, mit goldenem #MEMBER Emblem",
    text: "Derselbe Schnitt in Schwarz: 220 g/m² schwerer Stoff aus 100 % Baumwolle, lockere Schulter."
  },
  {
    id: "shirt-oversized-marineblau",
    name: "Camp Dörfl Shirt",
    variant: "Oversized Marineblau",
    category: "Shirt",
    price: 30,
    print: "Goldenes Emblem",
    swatch: "#141c2d",
    image: "/assets/images/shop/camp-doerfl-shirt-oversized-marineblau.webp",
    alt: "Camp Dörfl Shirt in Marineblau, oversized geschnitten, mit goldenem #MEMBER Emblem",
    text: "Derselbe Schnitt in tiefem Marineblau: 220 g/m² aus 100 % Baumwolle, lockere Schulter."
  },
  {
    id: "sweatshirt-grey",
    name: "Camp Dörfl Sweatshirt",
    variant: "Grey",
    category: "Sweatshirt",
    price: 49,
    print: "Goldenes Emblem",
    swatch: "#c4c2bf",
    image: "/assets/images/shop/camp-doerfl-sweatshirt-grey.webp",
    alt: "Camp Dörfl Sweatshirt in Grau mit Kapuze und goldenem #MEMBER Emblem",
    text: "Kapuzenpullover ohne Reißverschluss, Kängurutasche, goldenes Emblem auf hellem Grau."
  },
  {
    id: "jacke-creme",
    name: "Camp Dörfl Jacke",
    variant: "Creme",
    category: "Jacke",
    price: 45,
    print: "Goldenes Emblem",
    swatch: "#d5c39f",
    image: "/assets/images/shop/camp-doerfl-jacke-creme.webp",
    alt: "Camp Dörfl Kapuzenjacke in Creme mit goldenem #MEMBER Emblem",
    text: "Kapuzenjacke mit durchgehendem Reißverschluss und zwei Taschen, goldenes Emblem."
  },
  {
    id: "jacke-black",
    name: "Camp Dörfl Jacke",
    variant: "Black",
    category: "Jacke",
    price: 45,
    print: "Goldenes Emblem",
    swatch: "#16151a",
    image: "/assets/images/shop/camp-doerfl-jacke-black.webp",
    alt: "Camp Dörfl Kapuzenjacke in Schwarz mit goldenem #MEMBER Emblem",
    text: "Dieselbe Jacke in Schwarz, Emblem in Gold. Über dem Shirt oder allein auf dem Weg ins Studio."
  },
  {
    id: "buddy",
    name: "Buddy Dörfl",
    variant: "20 cm",
    category: "Sonstiges",
    price: 20,
    print: "Shirt mit #MEMBER Emblem",
    swatch: "#a98361",
    ohneGroesse: true,
    image: "/assets/images/shop/camp-doerfl-buddy-haende.webp",
    alt: "Buddy Dörfl, Teddybär im weißen Camp Dörfl Shirt, auf zwei Händen gehalten",
    text: "Im Sitzen 20 cm hoch, im eigenen #MEMBER Shirt. Dein Begleiter für jeden Tag."
  },
  {
    id: "bag",
    name: "Camp Dörfl Bag",
    variant: "Black",
    category: "Sonstiges",
    price: 20,
    print: "Goldenes Emblem",
    swatch: "#1f1f1f",
    ohneGroesse: true,
    image: "/assets/images/shop/camp-doerfl-bag.webp",
    alt: "Camp Dörfl Bag, schwarzer Turnbeutel mit goldenem #MEMBER Emblem auf dem Rücken getragen",
    text: "Wasserabweisendes Material, 11 Liter Fassungsvermögen, 33 × 45 cm. Für Schuhe, Handtuch und alles, was mit ins Studio muss."
  }
];

// ---------------------------------------------------------------------------
// Gutscheine
//
// Die Beträge sind keine eigene Preisliste, sondern die Preise von
// /personal-training-kosten-nuernberg/ und /koerperanalyse-nuernberg/ in
// Gutscheinform. Ändert sich dort etwas, gehört es hier nachgezogen.
//
// Gutscheine werden nicht versendet: `versand: false` nimmt sie aus der
// Versandpauschale heraus, die für Kleidung gilt.
// ---------------------------------------------------------------------------

// "image" ist für die Produktdaten der Suche verpflichtend. Gezeigt wird, was
// der Gutschein einlöst — die Karten im Shop bleiben bewusst ohne Foto.
export const shopVouchers = [
  {
    id: "gutschein-koerperanalyse",
    image: "/assets/images/dominik-coaching-bikeerg.webp",
    title: "Körperanalyse inkl. professioneller Beratung",
    kurz: "Körperanalyse mit Beratung",
    price: 59,
    detail: "1 Termin",
    text:
      "InBody-Messung mit persönlicher Auswertung im Gespräch: was die Werte bedeuten und welcher Schritt als Nächstes sinnvoll ist."
  },
  {
    id: "gutschein-personal-training",
    image: "/assets/images/dominik-personal-coaching-client.webp",
    title: "Personal Training",
    kurz: "Personal Training",
    price: 120,
    detail: "1 Einheit",
    text: "Eine Einheit Personal Training — Check, Technik und ein erster Impuls für den Weg dahinter."
  },
  {
    id: "gutschein-personal-training-analyse",
    image: "/assets/images/dominik-personal-coaching-client.webp",
    title: "Personal Training inkl. Körperanalyse",
    kurz: "Personal Training mit Analyse",
    price: 150,
    detail: "1 Einheit + Analyse",
    text: "Dieselbe Einheit, davor die 2D-Körperanalyse als Standortbestimmung."
  },
  {
    id: "gutschein-online-coaching",
    image: "/assets/images/home-app-banner-coaching.webp",
    title: "3 Monate Online Coaching",
    kurz: "Online Coaching, 3 Monate",
    price: 360,
    detail: "3 Monate",
    text: "Ortsunabhängige Betreuung über drei Monate, die Camp Dörfl App inbegriffen."
  },
  {
    id: "gutschein-5er-karte",
    image: "/assets/images/premium-training-hero-wide.webp",
    title: "5er Karte Personal Training",
    kurz: "5er Karte Personal Training",
    price: 500,
    detail: "5 Einheiten",
    text: "Fünf Einheiten inklusive einer InBody-Körperanalyse — 100 € je Einheit."
  },
  {
    id: "gutschein-10er-karte",
    image: "/assets/images/premium-training-hero-wide.webp",
    title: "10er Karte Personal Training",
    kurz: "10er Karte Personal Training",
    price: 800,
    detail: "10 Einheiten",
    text: "Zehn Einheiten inklusive zwei InBody-Körperanalysen — 80 € je Einheit."
  }
];
