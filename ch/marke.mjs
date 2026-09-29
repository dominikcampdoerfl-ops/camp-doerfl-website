/**
 * Camp Dörfl Schweiz — sämtliche Inhalte der Seite an einer Stelle.
 *
 * Zwei Grundregeln dieser Datei:
 *
 * 1. Hier steht nur, was nachweisbar stimmt. Zahlen, Titel und Zitate stammen
 *    aus dem bestehenden Bestand von campdoerfl.de (src/data.mjs, src/pages.mjs)
 *    und wurden nicht erfunden. Wo eine Angabe fehlt, fehlt sie auch auf der
 *    Seite — statt sie zu ergänzen. Insbesondere: keine erfundenen Schweizer
 *    Kundinnen und Kunden, keine erfundenen Orte, keine Standorte.
 *
 * 2. Schweizer Hochdeutsch. Kein „ß“, an keiner Stelle — statt dessen „ss“
 *    (regelmässig, gross, fliesst, Strasse). ch/pruefen.mjs lässt den Build
 *    scheitern, sobald ein „ß“ auftaucht.
 */

export const marke = {
  name: "Camp Dörfl",
  inhaber: "Dominik Dörfl",
  domain: "campdoerfl.ch",
  url: "https://campdoerfl.ch",
  land: "Schweiz",
  sprache: "de-CH",
  email: "dominik@campdoerfl.de",
  telefon: "+4915561562648",
  telefonAnzeige: "+49 155 61562648",
  instagram: "https://www.instagram.com/dominik.doerfl/",
  linkedin: "https://de.linkedin.com/in/dominik-dörfl-328445211",
  // Rechtstexte liegen bis auf Weiteres auf der bestehenden Hauptdomain.
  // Siehe ch/README.md → offene Punkte.
  impressum: "https://www.campdoerfl.de/impressum/",
  datenschutz: "https://www.campdoerfl.de/datenschutz/",
  hauptseite: "https://www.campdoerfl.de/",
  appStore: "https://apps.apple.com/de/app/camp-d%C3%B6rfl/id6767655689",
  googleBewertungen: "https://share.google/wUJdg1MGgXUMY8q5n",
  formularEndpunkt: "https://formsubmit.co/ajax/dominik@campdoerfl.de",
  formularZiel: "https://formsubmit.co/dominik@campdoerfl.de",
  titel: "Online Coaching Schweiz | Camp Dörfl",
  beschreibung:
    "Individuelles Online Coaching in der Schweiz für Training, Ernährung und Performance. Persönlich begleitet von Dominik Dörfl."
};

/**
 * Sprachfassungen.
 *
 * Die Gruppe ist seit dem 09.09.2026 geschlossen: Diese Seite nennt die
 * österreichische, und at/marke.mjs nennt diese hier. hreflang wirkt nur
 * beidseitig — fehlt eine Richtung, wertet Google die Angabe nicht aus.
 *
 * Ohne die Angabe halten Suchmaschinen die beiden fast gleichen
 * deutschsprachigen Seiten für Dubletten und suchen sich selbst eine aus. Dann
 * rankt in der Schweiz womöglich die österreichische Fassung mit Euro-Preisen.
 *
 * Kein x-default: Der ist für eine allgemeine Ausweichfassung gedacht. Beide
 * Seiten sind auf ein bestimmtes Land gemünzt — keine ist die Ausweichfassung
 * der anderen.
 */
export const sprachfassungen = [
  { hreflang: "de-CH", url: `${marke.url}/` },
  { hreflang: "de-AT", url: "https://campdoerfl.at/" }
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
 * Eigenständige Unterseiten (ch/seiten/). Sie stehen hier, damit der Fuss der
 * Startseite auf sie verweist: Eine Seite, die nur in der Sitemap steht und von
 * nirgends verlinkt ist, gilt Suchmaschinen als verwaist und rankt schlechter.
 */
export const unterseiten = [
  { titel: "Bodybuilding Wettkämpfe 2026", href: "/bodybuilding-wettkaempfe-2026/" }
];

export const bilder = {
  hero: {
    // Dieselbe Aufnahme wie dominik-ironman-run-home.webp, aber in voller
    // Auflösung (2666 × 4000 statt 1263 × 1600) — auf grossen Schirmen würde
    // die kleine Fassung sonst unscharf hochgerechnet.
    datei: "original/dominik-ironman-run-nuernberg.jpg",
    alt: "Dominik Dörfl läuft auf der Laufstrecke des Ironman 70.3 aus einem dunklen Torbogen ins Licht"
  },
  training: {
    datei: "dominik-about-training-hero.webp",
    alt: "Dominik Dörfl beim Ausdauertraining auf dem Stairmaster"
  },
  ernaehrung: {
    datei: "original/dominik-athlete-nutrition.webp",
    alt: "Dominik Dörfl sitzt nach dem Training auf einer Bank und öffnet einen Proteinriegel"
  },
  coaching: {
    datei: "original/dominik-coaching-bikeerg.webp",
    alt: "Dominik Dörfl betreut einen Sportler am Ergometer und erklärt die nächste Belastung"
  },
  portrait: {
    datei: "dominik-about-gym-portrait.webp",
    alt: "Porträt von Dominik Dörfl im Trainingsbereich"
  },
  rad: {
    datei: "original/dominik-bike-road-yellow.webp",
    alt: "Dominik Dörfl im Renntrikot neben seinem Zeitfahrrad auf einer offenen Landstrasse"
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
    datei: "original/dominik-bodybuilding-desert.webp",
    alt: "Dominik Dörfl in Wettkampfform bei einer Aufnahme im Freien"
  },
  abschluss: {
    datei: "dominik-strasse-der-mitte-lauf.webp",
    alt: "Dominik Dörfl läuft allein auf einer geraden, offenen Landstrasse"
  },
  logo: { datei: "camp-doerfl-logo.png", alt: "Camp Dörfl #Member Logo" }
};

/**
 * Drei Ansichten statt fünf: Training, Ernährung, Fortschritt. Gross genug,
 * dass man auf dem Bildschirm etwas erkennt, statt fünf Briefmarken zu zeigen.
 * Die Dateien liegen unter assets/images/ch/ — die Schweizer Seite greift auf
 * kein Verzeichnis der österreichischen zu.
 */
export const appAnsichten = [
  {
    datei: "ch/app-plan.jpg",
    alt: "Camp Dörfl App: Startseite mit Tagesbilanz und den vier Bereichen Ernährung, Training, Check-in und Coach-Chat",
    label: "Plan"
  },
  {
    datei: "ch/app-ernaehrung.jpg",
    alt: "Camp Dörfl App: Ernährungstagebuch mit Tagesbilanz, Kalorien und Nährwerten",
    label: "Ernährung"
  },
  {
    datei: "ch/app-training.jpg",
    alt: "Camp Dörfl App: Trainingsplan mit Übungen, Sätzen und Wiederholungsbereichen",
    label: "Training"
  },
  {
    datei: "ch/app-fortschritt.jpg",
    alt: "Camp Dörfl App: Fortschritt mit Gewicht, Trainingswoche, Updates und Schlaf",
    label: "Fortschritt"
  },
  {
    datei: "ch/app-longevity.jpg",
    alt: "Camp Dörfl App: Longevity mit Apple Health, Blutdruck, Erholung, Blutbildern und Medikamenten",
    label: "Longevity"
  }
];

export const systempunkte = [
  { nummer: "01", titel: "Individuell", text: "Auf dich abgestimmt." },
  { nummer: "02", titel: "Ganzheitlich", text: "Training. Ernährung. Entwicklung." },
  { nummer: "03", titel: "Persönlich", text: "Direkte Begleitung." },
  { nummer: "04", titel: "Flexibel", text: "Überall in der Schweiz." }
];

export const saeulen = [
  {
    id: "training",
    titel: "Training",
    zeilen: ["Individuell geplant.", "Effektiv umgesetzt.", "Auf dein Ziel abgestimmt."],
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
  "Ernährungsstrategie",
  "Check-ins & Analyse",
  "Direkter Kontakt",
  "Fortschritt auf einen Blick"
];

/**
 * Nur belegte Angaben. Quelle: src/data.mjs (achievements, dominikFacts) der
 * bestehenden Website. Die vier Einträge zusammen sind der Beleg für „Hybrid“:
 * Kraft und Ausdauer stehen beide im eigenen Wettkampfverlauf.
 */
export const leistungsdaten = [
  { wert: "2×", label: "Deutscher Meister", zusatz: "Bodybuilding und Powerlifting" },
  { wert: "Ironman 70.3", label: "Finisher", zusatz: "Mitteldistanz-Triathlon" },
  { wert: "8.848 hm", label: "an einem Tag", zusatz: "zu Fuss hoch und runter in 15 Stunden" },
  { wert: "270 km", label: "in 24 Stunden", zusatz: "Radtour am Stück" }
];

export const ablauf = [
  { nummer: "01", titel: "Ziel definieren", text: "Worauf soll es hinauslaufen?" },
  { nummer: "02", titel: "Analyse", text: "Ausgangslage, Alltag, Voraussetzungen." },
  { nummer: "03", titel: "Dein System", text: "Plan, Ernährungsrahmen, App." },
  { nummer: "04", titel: "Weiterentwickeln", text: "Check-in, Feedback, Anpassung." }
];

/**
 * Echte Google-Bewertungen. Wortlaut, Namen und Gesamtwertung sind aus dem
 * bestehenden Bestand auf campdoerfl.de übernommen (src/pages.mjs).
 *
 * Bewusst ohne Ortsangabe: Für keine dieser Stimmen ist ein Ort hinterlegt.
 * „Zürich“ oder „Bern“ dazuzuschreiben wäre erfunden — deshalb steht überall
 * nur die Quelle. Sobald echte Schweizer Rückmeldungen samt Ort vorliegen,
 * kommen sie hier dazu (Feld `ort`, siehe ch/README.md).
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
 * Erfolge im Team.
 *
 * Die Zahlen sind aus dem dokumentierten Wettkampfbestand von campdoerfl.de
 * (src/pages.mjs → `coachSuccessYears`) ausgezählt, Stand 08.09.2026:
 * 129 Platzierungen in den Jahren 2019 und 2021–2026, davon 49 erste Plätze
 * und 99 Podestplätze; sechs davon erste Plätze bei einer Deutschen
 * Meisterschaft. Sie sind hier abgeschrieben, nicht gerechnet — die Liste liegt
 * auf der deutschen Seite, und diese hier greift nicht darauf zu.
 * Ändert sich die Liste, gehören die Werte nachgeführt (siehe ch/README.md).
 *
 * Es sind Ergebnisse des Coachings insgesamt, nicht der Schweiz allein. Die
 * Seite sagt das ausdrücklich.
 */
export const erfolge = {
  stand: "08.09.2026",
  quelle: "https://www.campdoerfl.de/erfolge-im-team/",
  zahlen: [
    { wert: "129", label: "Platzierungen", zusatz: "auf Wettkampfbühnen seit 2019" },
    { wert: "49", label: "erste Plätze", zusatz: "davon sechsmal Deutscher Meister" },
    { wert: "99", label: "Podestplätze", zusatz: "Top 3 im Wettkampf" },
    { wert: "IFBB", label: "Pro Card", zusatz: "Mr Universe Liechtenstein 2026" }
  ],
  /* Echte Schweizer Ergebnisse aus demselben Bestand — der einzige Grund, warum
     dieser Abschnitt auf der Schweizer Seite überhaupt etwas Schweizerisches
     behaupten darf. */
  schweiz: [
    "1. Platz Schweizer Meisterschaft, Bodybuilding bis 80 kg (2021)",
    "1. Platz Swiss Cup, Bodybuilding bis 80 kg (2021)",
    "3. Platz Mr Universe Switzerland, Classic Bodybuilding (2025)"
  ],
  /* Die vier Aufnahmen stammen aus dem Bestand von campdoerfl.de.
     Eine Ausnahme: transformation-front-progress liegt als -anonym-Fassung
     ein, oben beschnitten — in der Vorlage sind Mund und Kinn zu sehen. */
  transformationen: [
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
  ]
};

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

/**
 * Keine Standorte, keine Niederlassungen — Orte, an denen betreute Menschen
 * leben können. Die Seite sagt das an drei Stellen ausdrücklich.
 */
export const staedte = [
  ["Zürich", "Bern", "Basel"],
  ["Luzern", "St. Gallen", "Winterthur"],
  ["Lausanne", "Genf"]
];

export const leistungen = [
  "Individuelle Trainingsplanung",
  "Individuelle Ernährungsstrategie",
  "Camp Dörfl App",
  "Regelmässige Check-ins",
  "Persönliches Feedback",
  "Laufende Anpassungen",
  "Analyse deiner Entwicklung",
  "Direkter Kontakt"
];

/**
 * Währung. Steht an genau einer Stelle, damit Preisflächen, Formular, FAQ und
 * strukturierte Daten nicht auseinanderlaufen können.
 *
 * Die Schweizer Seite rechnet in Franken. Die Beträge sind **keine Umrechnung**
 * der Euro-Preise von campdoerfl.at, sondern eine eigene Festlegung für den
 * Schweizer Markt.
 */
export const waehrung = {
  code: "CHF",
  /** Fürs Markup — geschütztes Leerzeichen, damit Zahl und Kürzel zusammenbleiben. */
  markup: (wert) => `${wert}&nbsp;CHF`,
  /** Für Fliesstext, FAQ und strukturierte Daten, wo kein HTML-Entity stehen darf. */
  klartext: (wert) => `${wert} CHF`
};

/**
 * Ein Angebot, mehrere Laufzeiten. Der Leistungsumfang ist in allen gleich
 * derselbe; unterschiedlich ist allein die Dauer der Begleitung.
 *
 * `kennzeichnung` ist die Auszeichnung an der Laufzeit, `hervorgehoben`
 * markiert die eine Fläche, die eine feine Goldlinie bekommt.
 */
/**
 * Zahlwort für die **Anzahl der Laufzeiten** („vier Möglichkeiten“). Nicht zu
 * verwechseln mit `zahlwort` weiter unten, das Monatszahlen ausschreibt.
 * Beides stand früher fest im Text und war nach dem Hinzufügen der
 * Jahreslaufzeit falsch.
 */
export function anzahlwort(anzahl, grossgeschrieben = false) {
  const woerter = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs"];
  const wort = woerter[anzahl] ?? String(anzahl);
  return grossgeschrieben ? wort[0].toUpperCase() + wort.slice(1) : wort;
}

export const laufzeiten = [
  {
    dauer: "1 Monat",
    monate: 1,
    preis: 159,
    kennzeichnung: "",
    hervorgehoben: false,
    text: "Ideal zum Kennenlernen.",
    knopf: "1 Monat starten"
  },
  {
    dauer: "3 Monate",
    monate: 3,
    preis: 399,
    kennzeichnung: "Beliebt",
    hervorgehoben: true,
    text: "Mehr Zeit für Struktur, Anpassung und sichtbare Entwicklung.",
    knopf: "3 Monate starten"
  },
  {
    dauer: "6 Monate",
    monate: 6,
    preis: 749,
    kennzeichnung: "",
    hervorgehoben: false,
    text: "Für langfristige Entwicklung und nachhaltige Routinen.",
    knopf: "6 Monate starten"
  },
  /*
   * Der Jahrespreis ist gesetzt, nicht abgeleitet — und zwar auf 1260 statt
   * auf eine Zahl mit 9 am Ende wie bei den drei kürzeren Laufzeiten.
   *
   * Grund: 1260 / 12 sind genau 105 Franken. Diese Seite rechnet den
   * Monatswert vor (siehe monatswert() weiter unten) und stellt dort
   * ausdrücklich „rund“ davor, wenn es nicht glatt aufgeht — damit die
   * Nebenrechnung keinen niedrigeren Gesamtpreis behauptet als den, der
   * verlangt wird. Bei der längsten Laufzeit, deren ganzes Argument der
   * Monatspreis ist, soll diese Einschränkung nicht nötig sein.
   * 1259 wären 104.92 und hätten „rund“ gebraucht.
   *
   * Das Verhältnis entspricht der österreichischen Seite: dort fällt der
   * Monat von 150 auf 100 Euro (−33 %), hier von 159 auf 105 Franken (−34 %).
   */
  {
    dauer: "1 Jahr",
    monate: 12,
    preis: 1260,
    kennzeichnung: "Bester Monatspreis",
    hervorgehoben: false,
    text: "Ein Jahr durchgehende Begleitung — Zeit für mehrere Aufbau- und Diätphasen.",
    knopf: "1 Jahr starten"
  }
];

/**
 * Monatswert einer Laufzeit — gerechnet, nicht gepflegt.
 *
 * 159/1 und 399/3 gehen glatt auf, 749/6 nicht: 124.83…. Ein rundes
 * „125 CHF pro Monat“ würde einen Gesamtpreis von 750 CHF behaupten, also
 * einen Franken mehr, als tatsächlich verlangt wird. Deshalb steht in diesem
 * Fall „rund“ davor. Auf einer Seite, deren Preisargument Transparenz ist,
 * darf die Nebenrechnung nicht schöner sein als der Preis.
 */
export function monatswert({ preis, monate }) {
  const genau = preis / monate;
  const gerundet = Math.round(genau);
  return { genau, gerundet, gerundetNoetig: Math.abs(genau - gerundet) > 0.005 };
}

/** „159 CHF“, „133 CHF“, „rund 125 CHF“ — für Fliesstext und FAQ. */
export function monatswertKlartext(eintrag) {
  const { gerundet, gerundetNoetig } = monatswert(eintrag);
  return `${gerundetNoetig ? "rund " : ""}${waehrung.klartext(gerundet)}`;
}

/* Zahlwörter für die FAQ-Antworten. Die beiden Preisantworten werden unten aus
   `laufzeiten` gebaut, statt die Beträge ein zweites Mal hinzuschreiben — eine
   Preisänderung kann sie so nicht mehr stehen lassen. */
const zahlwort = { 1: "einen", 3: "drei", 6: "sechs", 12: "zwölf" };
const monatswort = (monate) => `${zahlwort[monate] ?? monate} ${monate === 1 ? "Monat" : "Monate"}`;

const preisAufzaehlung = laufzeiten
  .map((eintrag) => `${waehrung.klartext(eintrag.preis)} für ${monatswort(eintrag.monate)}`)
  .join(", ");

/** „159 CHF im Monat, 133 CHF pro Monat bei drei, rund 125 CHF pro Monat bei sechs“.
    Wird sowohl im Preisbereich als auch in der FAQ benutzt — damit beide Stellen
    wortgleich sind und nicht auseinanderlaufen können. */
export const monatsAufzaehlung = laufzeiten
  .map((eintrag, index) =>
    index === 0
      ? `${monatswertKlartext(eintrag)} im Monat`
      : `${monatswertKlartext(eintrag)} pro Monat bei ${zahlwort[eintrag.monate] ?? eintrag.monate}`
  )
  .join(", ");

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
    frage: "Für wen ist das Online Coaching geeignet?",
    antwort:
      "Für alle, die ihr Training nicht mehr dem Zufall überlassen wollen — vom Wiedereinstieg bis zum Wettkampfziel. Entscheidend ist nicht der Ausgangspunkt, sondern dass du bereit bist, regelmässig umzusetzen und dich rückmelden zu lassen."
  },
  {
    frage: "Muss ich bereits Trainingserfahrung haben?",
    antwort:
      "Nein. Übungsauswahl, Umfang und Tempo richten sich nach deiner Ausgangslage. Wer neu anfängt, bekommt weniger Komplexität und mehr Technikarbeit; wer seit Jahren trainiert, bekommt die Feinsteuerung. Vorerfahrung ist keine Voraussetzung, sondern das Ergebnis der ersten Wochen."
  },
  {
    frage: "Funktioniert das Coaching überall in der Schweiz?",
    antwort:
      "Ja. Das Online Coaching läuft unabhängig vom Wohnort — in Zürich genauso wie in einem Bergtal. Gebraucht werden ein Smartphone oder ein Browser und die Trainingsmöglichkeit, die du tatsächlich vor Ort hast. Camp Dörfl unterhält keine Standorte in der Schweiz; die Begleitung ist zu 100 % online."
  },
  {
    frage: "Wie läuft die Betreuung ab?",
    antwort:
      "Am Anfang steht ein Gespräch über Ziel, Alltag und Ausgangslage. Danach bekommst du Trainingsplan, Ernährungsstrategie und den Zugang zur Camp Dörfl App. Ab da läuft die Zusammenarbeit in Schleifen: Du dokumentierst, ich schaue drauf, wir passen an."
  },
  {
    frage: "Wie oft wird mein Plan angepasst?",
    antwort:
      "Immer dann, wenn die Daten es hergeben — nicht nach einem starren Kalender. Grundlage sind deine regelmässigen Check-ins: Gewicht, Trainingsleistung, Erholung und deine Rückmeldung dazu, wie sich die Woche angefühlt hat. Ändert sich etwas im Alltag, ändert sich der Plan mit."
  },
  {
    frage: "Ist die Camp Dörfl App enthalten?",
    antwort:
      "Ja, in jeder Laufzeit. Trainingsplan, Ernährungstagebuch, Check-ins und der direkte Kontakt liegen dort an einer Stelle — auf dem Handy und im Browser. Zusatzkosten entstehen dafür keine."
  },
  {
    frage: "Was ist der Unterschied zwischen den Laufzeiten?",
    antwort:
      `Nur die Dauer. Der Leistungsumfang ist in allen ${anzahlwort(laufzeiten.length)} Laufzeiten identisch — es gibt keine Funktion, die erst ab einer längeren Laufzeit dazukommt. Längere Laufzeiten geben mehr Zeit für Anpassung und senken den Monatswert: ${monatsAufzaehlung} Monaten.`
  },
  {
    frage: "Was kostet das Coaching?",
    antwort:
      `${preisAufzaehlung}. Abgerechnet wird in Schweizer Franken. Es gibt keine automatische Verlängerung und keine Zusatzpakete.`
  }
];
