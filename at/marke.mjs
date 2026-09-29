/**
 * Camp Dörfl Österreich — alle Inhalte der Seite an einer Stelle.
 *
 * Grundregel dieser Datei: Hier steht nur, was nachweisbar stimmt. Zahlen,
 * Titel und Zitate stammen aus dem bestehenden Bestand von campdoerfl.de
 * (src/data.mjs, src/pages.mjs) und wurden nicht neu erfunden. Wo eine Angabe
 * fehlt, fehlt sie auch auf der Seite — statt sie zu ergänzen.
 */

export const marke = {
  name: "Camp Dörfl",
  inhaber: "Dominik Dörfl",
  domain: "campdoerfl.at",
  url: "https://campdoerfl.at",
  land: "Österreich",
  sprache: "de-AT",
  email: "dominik@campdoerfl.de",
  telefon: "+4915561562648",
  telefonAnzeige: "+49 155 61562648",
  instagram: "https://www.instagram.com/dominik.doerfl/",
  linkedin: "https://de.linkedin.com/in/dominik-dörfl-328445211",
  // Rechtstexte liegen bis auf Weiteres auf der bestehenden Hauptdomain.
  // Siehe at/README.md → offene Punkte.
  impressum: "https://www.campdoerfl.de/impressum/",
  datenschutz: "https://www.campdoerfl.de/datenschutz/",
  hauptseite: "https://www.campdoerfl.de/",
  appStore: "https://apps.apple.com/de/app/camp-d%C3%B6rfl/id6767655689",
  googleBewertungen: "https://share.google/wUJdg1MGgXUMY8q5n",
  formularEndpunkt: "https://formsubmit.co/ajax/dominik@campdoerfl.de",
  formularZiel: "https://formsubmit.co/dominik@campdoerfl.de",
  // "Fitness Online Coaching Österreich" enthält als eine Zeichenkette gleich
  // drei Suchbegriffe: "Fitness Online Coaching", "Online Coaching" und
  // "Online Coaching Österreich". Deshalb steht es so und nicht als Aufzählung.
  titel: "Fitness Online Coaching Österreich | Camp Dörfl",
  beschreibung:
    "Fitness Coaching online für ganz Österreich: Trainingsplan, Ernährung und persönliche Betreuung von Dominik Dörfl — dein Personal Trainer, digital."
};

/**
 * Die Begriffe, auf die diese Seite ausgerichtet ist.
 *
 * Sie stehen hier nicht, um irgendwo als Meta-Keywords ausgegeben zu werden —
 * die liest keine Suchmaschine mehr. Sie sind der Prüfmaßstab: at/pruefen.mjs
 * stellt fest, dass jeder Begriff im Text tatsächlich vorkommt, und dass keiner
 * so oft vorkommt, dass es nach Aufzählung klingt statt nach Sprache.
 */
export const suchbegriffe = [
  "Online Coaching",
  "Fitness Online Coaching",
  "Fitness Coaching",
  "Personal Trainer"
];

/**
 * Sprachfassungen.
 *
 * campdoerfl.at und campdoerfl.ch sind zwei fast gleiche deutschsprachige
 * Seiten. Ohne hreflang halten Suchmaschinen sie für Dubletten und suchen sich
 * selbst eine aus — dann rankt in Österreich womöglich die Schweizer Fassung
 * mit Franken-Preisen. Die Angabe muss auf beiden Seiten stehen und dieselbe
 * Liste nennen, sonst wertet Google sie nicht.
 *
 * Kein x-default: Der ist für eine allgemeine Ausweichfassung gedacht
 * (Sprachwahl oder internationale Startseite). Beide Seiten sind auf ein
 * bestimmtes Land gemünzt — keine ist die Ausweichfassung der anderen.
 */
export const sprachfassungen = [
  { hreflang: "de-AT", url: `${marke.url}/` },
  { hreflang: "de-CH", url: "https://campdoerfl.ch/" }
];

export const navigation = [
  { label: "Online Coaching", href: "#system" },
  { label: "Ablauf", href: "#ablauf" },
  { label: "Über mich", href: "#dominik" },
  { label: "Erfahrungen", href: "#erfahrungen" },
  { label: "Preise", href: "#preise" },
  { label: "FAQ", href: "#faq" }
];

/**
 * Eigenständige Unterseiten (at/seiten/). Sie stehen hier, damit der Fuß der
 * Startseite auf sie verweist: Eine Seite, die nur in der Sitemap steht und von
 * nirgends verlinkt ist, gilt Suchmaschinen als verwaist und rankt schlechter.
 */
export const unterseiten = [
  { titel: "Bodybuilding Wettkämpfe 2026", href: "/bodybuilding-wettkaempfe-2026/" }
];

export const bilder = {
  hero: {
    // Dieselbe Aufnahme wie dominik-ironman-run-home.webp, aber in voller
    // Auflösung (2666 × 4000 statt 1263 × 1600) — das Heldenbild wird auf
    // großen Schirmen sonst unscharf hochgerechnet.
    datei: "original/dominik-ironman-run-nuernberg.jpg",
    alt: "Dominik Dörfl läuft auf der Laufstrecke des Ironman 70.3 aus einem dunklen Torbogen ins Licht"
  },
  training: {
    datei: "dominik-about-training-hero.webp",
    alt: "Dominik Dörfl beim Ausdauertraining auf dem Stairmaster"
  },
  ernaehrung: {
    datei: "dominik-athlete-nutrition.webp",
    alt: "Dominik Dörfl sitzt nach dem Training auf einer Bank und öffnet einen Proteinriegel"
  },
  coaching: {
    datei: "original/dominik-coaching-bikeerg.webp",
    alt: "Dominik Dörfl betreut einen Sportler an einem Ergometer und erklärt die nächste Belastung"
  },
  portrait: {
    datei: "dominik-about-gym-portrait.webp",
    alt: "Porträt von Dominik Dörfl im Trainingsbereich"
  },
  rad: {
    datei: "dominik-bike-blue.webp",
    alt: "Dominik Dörfl mit seinem Zeitfahrrad auf einer Landstraße"
  },
  fitWerden: {
    datei: "original/dominik-personal-coaching-client.webp",
    alt: "Dominik Dörfl gemeinsam mit einem betreuten Sportler nach dem Training"
  },
  performance: {
    datei: "dominik-ironman-medal.jpg",
    alt: "Dominik Dörfl im Stadion mit der Finisher-Medaille des Ironman 70.3"
  },
  athletik: {
    datei: "original/dominik-bike-road-yellow.webp",
    alt: "Dominik Dörfl im Renntrikot neben seinem Zeitfahrrad auf einer Landstraße"
  },
  abschluss: {
    datei: "dominik-strasse-der-mitte-lauf.webp",
    alt: "Dominik Dörfl läuft allein auf einer geraden, offenen Landstraße"
  },
  logo: { datei: "camp-doerfl-logo.png", alt: "Camp Dörfl #Member Logo" },
  logoKlein: { datei: "camp-doerfl-logo-96.webp", alt: "Camp Dörfl #Member Logo" }
};

export const appAnsichten = [
  {
    datei: "at/app-plan.jpg",
    alt: "Camp Dörfl App: Startseite mit Tagesbilanz und den vier Bereichen Ernährung, Training, Check-in und Coach-Chat",
    label: "Plan"
  },
  {
    datei: "at/app-ernaehrung.jpg",
    alt: "Camp Dörfl App: Ernährungstagebuch mit Tagesbilanz, Kalorien und Nährwerten",
    label: "Ernährung"
  },
  {
    datei: "at/app-training.jpg",
    alt: "Camp Dörfl App: Trainingsplan mit Übungen, Sätzen und Wiederholungsbereichen",
    label: "Training"
  },
  {
    datei: "at/app-fortschritt.jpg",
    alt: "Camp Dörfl App: Fortschritt mit Gewicht, Trainingswoche, Updates und Schlaf",
    label: "Fortschritt"
  },
  {
    datei: "at/app-longevity.jpg",
    alt: "Camp Dörfl App: Longevity mit Apple Health, Blutdruck, Erholung, Blutbildern und Medikamenten",
    label: "Longevity"
  }
];

export const systempunkte = [
  { nummer: "01", titel: "Individuell", text: "Statt Standard." },
  { nummer: "02", titel: "Ganzheitlich", text: "Training. Ernährung. Entwicklung." },
  { nummer: "03", titel: "Persönlich", text: "Direkte Begleitung." },
  { nummer: "04", titel: "Flexibel", text: "Überall in Österreich." }
];

export const saeulen = [
  {
    id: "training",
    titel: "Training",
    zeilen: ["Individuell geplant.", "Effektiv umgesetzt.", "In deinen Alltag integriert."],
    bild: bilder.training
  },
  {
    id: "ernaehrung",
    titel: "Ernährung",
    zeilen: ["Strategisch.", "Alltagstauglich.", "Ohne unnötigen Verzicht."],
    bild: bilder.ernaehrung
  },
  {
    id: "coaching",
    titel: "Coaching",
    zeilen: ["Analyse.", "Feedback.", "Anpassung.", "Entwicklung."],
    bild: bilder.coaching
  }
];

export const appLeistungen = [
  "Individuelle Pläne",
  "Ernährung",
  "Check-ins & Analyse",
  "Fortschritt",
  "Direkter Kontakt"
];

/**
 * Nur belegte Angaben. Quelle: src/data.mjs (achievements, milestones) der
 * bestehenden Website.
 */
export const leistungsdaten = [
  { wert: "2×", label: "Deutscher Meister", zusatz: "Bodybuilding und Powerlifting" },
  { wert: "IFBB", label: "Pro", zusatz: "Profistatus im Bodybuilding" },
  { wert: "Ironman 70.3", label: "Finisher", zusatz: "Mitteldistanz-Triathlon" },
  { wert: "8.848 hm", label: "an einem Tag", zusatz: "zu Fuß hoch und runter in 15 Stunden" }
];

export const ablauf = [
  { nummer: "01", titel: "Ziel definieren", text: "Wir klären, worauf es wirklich hinauslaufen soll." },
  { nummer: "02", titel: "Analyse", text: "Ausgangslage, Alltag, Training, Ernährung." },
  { nummer: "03", titel: "Dein System", text: "Plan, Ernährungsrahmen und App-Zugang." },
  { nummer: "04", titel: "Weiterentwickeln", text: "Check-ins, Feedback, laufende Anpassung." }
];

/**
 * Echte Google-Bewertungen. Wortlaut, Namen und Gesamtwertung sind aus dem
 * bestehenden Bestand auf campdoerfl.de übernommen (src/pages.mjs).
 * Es sind Bewertungen des Coachings insgesamt, nicht speziell aus Österreich —
 * die Seite behauptet das auch nirgends.
 */
export const bewertungen = {
  schnitt: "5,0",
  anzahl: 34,
  quelle: "Google",
  link: marke.googleBewertungen,
  stimmen: [
    { text: "Sehr motivierend und professionell und vor allem zu 100 Prozent zuverlässig.", name: "Markus S." },
    { text: "Die Trainings- und Ernährungspläne sind perfekt auf die persönlichen Bedürfnisse und Ziele abgestimmt.", name: "Leon S." },
    { text: "Seine ehrliche, motivierende und zielstrebige Art bringt mich Tag für Tag meinem Ziel näher.", name: "Meik T." },
    { text: "Super Beratung, jederzeit erreichbar und für jede Frage eine kompetente Antwort.", name: "Deniz I." },
    { text: "Top Service, super empathisch auf mich eingegangen. Ich bin sehr zufrieden!", name: "Stefan S." },
    { text: "Sehr professionelle Betreuung. Sehr gute Beratung.", name: "Michael T." }
  ]
};

/**
 * Erfolge der betreuten Athletinnen und Athleten.
 *
 * Die Zahlen sind nicht geschätzt: Sie stammen aus der auf
 * campdoerfl.de/erfolge-im-team/ veröffentlichten Liste der dokumentierten
 * Wettkampfplatzierungen (129 Platzierungen, davon 49 Siege und 99
 * Podiumsplätze, aus sieben Wettkampfjahren). Ändert sich dort etwas, gehört
 * es hier nachgezogen — die Fußnote nennt den Stand.
 *
 * Wichtig für die Ehrlichkeit der Seite: Das sind Erfolge aus dem Coaching
 * insgesamt, nicht aus Österreich. Der Text sagt das auch.
 */
export const erfolge = {
  stand: "2026",
  zeitraum: "2019 und 2021 bis 2026",
  quelle: "https://www.campdoerfl.de/erfolge-im-team/",
  zahlen: [
    { wert: "129", label: "Platzierungen" },
    { wert: "49", label: "Siege" },
    { wert: "99", label: "Podiumsplätze" },
    { wert: "7", label: "Wettkampfjahre" }
  ]
};

/**
 * Eine betreute Person mit Namen und Gesicht — veröffentlicht mit ihrer
 * Geschichte auf campdoerfl.de/erfolge-im-team/guenter-preis/.
 *
 * Der gesundheitliche Teil bleibt hier bewusst knapp und trägt denselben
 * Hinweis wie die Hauptseite: Es ist ein Einzelfall und keine ärztliche
 * Beratung. Die ganze Geschichte steht dort, nicht hier.
 */
export const guenter = {
  name: "Günter Preis",
  bild: {
    datei: "guenter-preis-coach-stage.webp",
    alt: "Dominik Dörfl mit Günter Preis nach einem Wettkampf, Günter trägt eine Medaille"
  },
  titel: "Vizeweltmeister mit 63.",
  text:
    "2021 standen wir zufällig gemeinsam in der Anmeldeschlange eines Wettkampfs. Als Günter sich später meldete, ging es zuerst nicht um die Bühne: Er lebte mit Typ-2-Diabetes und einer hohen Medikamenteneinnahme. Also haben wir die gesundheitliche Basis vor das sportliche Ziel gestellt — und daraus wurden drei gemeinsame Saisons.",
  daten: [
    { wert: "Vizeweltmeister", label: "mit 63 Jahren" },
    { wert: "Bronze", label: "bei Deutschen Meisterschaften" },
    { wert: "3 Saisons", label: "gemeinsam seit 2021" }
  ],
  hinweis:
    "Günters Verlauf ist ein Einzelfall und lässt sich nicht übertragen. Coaching ersetzt keine ärztliche Beratung; Diagnostik und Medikamente gehören in ärztliche Hand.",
  link: "https://www.campdoerfl.de/erfolge-im-team/guenter-preis/"
};

/**
 * Vorher-Nachher-Aufnahmen betreuter Personen, übernommen aus dem Bestand von
 * campdoerfl.de — dieselben vier wie auf der Schweizer Seite.
 *
 * Eine Ausnahme: transformation-front-progress liegt als -anonym-Fassung ein,
 * oben beschnitten — in der Vorlage sind Mund und Kinn zu sehen.
 */
export const transformationen = [
  {
    detail: "Bühnenform",
    titel: "Vom Startpunkt bis auf die Wettkampfbühne.",
    text:
      "Konsequente Führung, klare Struktur und saubere Umsetzung — bis in eine vollständig veränderte Form.",
    datei: "original/transformation-stage-win.webp",
    alt: "Vorher-Nachher-Vergleich einer betreuten Person: links die Ausgangsform, rechts die Wettkampfform mit Pokal"
  },
  {
    detail: "Natural Shape",
    titel: "Entwicklung mit Leistungsanspruch.",
    text:
      "Nicht nur weniger Körperfett, sondern eine Entwicklung, die Disziplin und langfristige Steuerung sichtbar macht.",
    datei: "original/transformation-stage-shape.webp",
    alt: "Vorher-Nachher-Vergleich einer betreuten Person bis zu einer definierten Wettkampfform"
  },
  {
    detail: "Alltag",
    titel: "Spürbar leichter im echten Leben.",
    text:
      "Auch ohne Bühnenziel wird Entwicklung deutlich, sobald Training, Ernährung und Alltag zusammenlaufen.",
    datei: "transformation-front-progress-anonym.webp",
    alt: "Vorher-Nachher-Vergleich einer betreuten Person von vorne, ohne Kopf im Bild"
  },
  {
    detail: "Seitenprofil",
    titel: "Veränderung, die auch seitlich sichtbar wird.",
    text:
      "Im Profilvergleich werden Bauchumfang, Haltung und Körperspannung besonders deutlich.",
    datei: "original/transformation-side-progress.webp",
    alt: "Vorher-Nachher-Vergleich einer betreuten Person im Seitenprofil"
  }
];

export const zielgruppen = [
  {
    titel: "Wieder fit werden",
    zeilen: ["Struktur aufbauen.", "Körper verändern."],
    bild: bilder.fitWerden
  },
  {
    titel: "Performance",
    zeilen: ["Kraft.", "Ausdauer.", "Leistungsfähigkeit."],
    bild: bilder.performance
  },
  {
    titel: "Athletik",
    zeilen: ["Ambitionierte Ziele.", "Strukturiertes Coaching."],
    bild: bilder.athletik
  }
];

export const staedte = ["Wien", "Graz", "Linz", "Salzburg", "Innsbruck"];

export const leistungen = [
  "Individuelle Trainingsplanung",
  "Ernährungsstrategie",
  "Camp Dörfl App",
  "Regelmäßige Check-ins",
  "Persönliches Feedback",
  "Laufende Anpassungen",
  "Direkter Kontakt"
];

/**
 * Ein Angebot, drei Laufzeiten. Der Monatswert ist gerechnet, nicht gesetzt:
 * 390 / 3 = 130, 720 / 6 = 120.
 */
export const laufzeiten = [
  { dauer: "1 Monat", monate: 1, preis: 150 },
  { dauer: "3 Monate", monate: 3, preis: 390 },
  { dauer: "6 Monate", monate: 6, preis: 720 },
  { dauer: "1 Jahr", monate: 12, preis: 1200 }
];

export const anliegen = [
  "Wieder fit werden",
  "Muskelaufbau",
  "Körperfett reduzieren",
  "Ausdauer & Wettkampf",
  "Hybrid Performance",
  "Noch unklar"
];

export const faq = [
  {
    frage: "Wie läuft Online Coaching in Österreich konkret ab?",
    antwort:
      "Am Anfang steht ein Gespräch über Ziel, Alltag und Ausgangslage. Danach bekommst du Trainingsplan, Ernährungsrahmen und den Zugang zur Camp Dörfl App. Ab da läuft die Zusammenarbeit über regelmäßige Check-ins: Du dokumentierst, ich schaue drauf, wir passen an."
  },
  {
    frage: "Brauche ich ein bestimmtes Studio oder eigene Geräte?",
    antwort:
      "Nein. Der Plan wird auf das gebaut, was dir tatsächlich zur Verfügung steht — Fitnessstudio, Heimtraining oder eine Mischung. Was du nicht hast, taucht im Plan auch nicht auf."
  },
  {
    frage: "Ist das Coaching auch für Einsteiger geeignet?",
    antwort:
      "Ja. Übungsauswahl, Umfang und Tempo richten sich nach deiner Ausgangslage. Vorerfahrung ist keine Voraussetzung, sondern das Ergebnis der ersten Wochen."
  },
  {
    frage: "Funktioniert Fitness Online Coaching wirklich?",
    antwort:
      "Es funktioniert, wenn zwei Dinge stimmen: Der Plan passt zu deinem Alltag, und du meldest zurück, was tatsächlich passiert ist. Genau dafür sind die Check-ins da. Was online nicht geht, ist die Hand an der Hantel — dafür ist die Betreuung nicht auf einen Termin pro Woche begrenzt, sondern läuft durchgehend mit."
  },
  {
    frage: "Ist das ein Personal Trainer für Österreich — gibt es Termine vor Ort?",
    antwort:
      "Der Sache nach ja, dem Format nach nein. Du bekommst dieselbe Arbeit, die ein Personal Trainer leistet — Planung, Korrektur, Anpassung, Verantwortung —, nur nicht neben dir im Studio, sondern über Plan, Check-ins und direkten Kontakt. Termine vor Ort gibt es nicht: Camp Dörfl hat keine Standorte in Österreich. Der Vorteil daran ist, dass es egal ist, ob du in Wien wohnst oder in einem Ort ohne Studio."
  },
  {
    frage: "Was unterscheidet Fitness Coaching von einem Trainingsplan?",
    antwort:
      "Ein Plan ist ein Dokument, Coaching ist eine Zusammenarbeit. Der Plan ist der Anfang; danach wird gemessen, eingeordnet und nachjustiert. Wer nur einen Plan braucht, braucht kein Coaching — wer schon mehrere Pläne angefangen und keinen zu Ende gebracht hat, meistens schon."
  },
  {
    frage: "Wie viel Zeit muss ich einplanen?",
    antwort:
      "Das entscheidet dein Alltag mit, nicht der Plan. Trainingsumfang und Frequenz werden auf die Zeit gelegt, die realistisch da ist — ein Plan, den du nicht durchhältst, bringt niemandem etwas."
  },
  {
    frage: "Was kostet das Coaching?",
    antwort:
      "150 € für einen Monat, 390 € für drei Monate, 720 € für sechs Monate und 1.200 € für ein Jahr. Der Leistungsumfang ist in allen vier Laufzeiten derselbe — du entscheidest nur, wie lange wir zusammenarbeiten. Je länger die Laufzeit, desto günstiger der Monat: von 150 € auf 100 €."
  }
];
