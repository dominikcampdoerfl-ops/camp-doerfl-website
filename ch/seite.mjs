/**
 * Die Seite. Eine Route, eine H1, in der Reihenfolge der Geschichte:
 * Emotion → Haltung → Methode → Produkt → Vertrauen → Leistung → Prozess →
 * Belege → Identifikation → Fragen → Angebot → Handlung → Schweiz → Abschluss.
 */

import { bildMarkup } from "./bilder.mjs";
import {
  marke,
  sprachfassungen,
  navigation,
  unterseiten,
  bilder,
  appAnsichten,
  appLeistungen,
  systempunkte,
  saeulen,
  leistungsdaten,
  ablauf,
  bewertungen,
  erfolge,
  zielgruppen,
  staedte,
  leistungen,
  laufzeiten,
  anzahlwort,
  waehrung,
  monatswert,
  monatsAufzaehlung,
  anliegen,
  faq
} from "./marke.mjs";

const schuetzen = (wert = "") =>
  String(wert).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/* Sehr reduzierter Umriss der Schweiz — Dekoration, keine Landkarte.
   Der Pfad entsteht aus einem groben Grenzverlauf (Längen- und Breitengrade),
   flächentreu auf die mittlere Breite (46,82°) projiziert. Bewusst ohne
   Flagge, ohne Füllung, ohne Ortsmarken. */
const schweizUmriss = (klasse = "schweiz__umriss") => `
  <svg class="${klasse}" viewBox="0 0 200 128.4" fill="none" aria-hidden="true" focusable="false">
    <path d="M8.4 107.1 L0 108.4 L4.4 101.3 L7.5 96.8 L6.2 90.3 L13.7 79.4 L21.2 67.7 L20.8 56.8 L33.6 47.7 L43.7 33.6 L45.9 28.4 L54.3 23.9 L60.9 24.5 L64.5 20 L68.4 19.4 L72 14.2 L76.4 15.5 L87.4 16.1 L100.7 12.3 L107.7 15.5 L115.2 13.5 L117.4 0 L125.4 5.8 L121.9 8.4 L128.5 10.3 L142.2 9.7 L158.5 17.4 L162.9 23.2 L160.7 33.6 L155.4 48.4 L160.7 56.1 L182.8 61.9 L198.2 61.3 L200 76.8 L183.2 77.4 L185 82.6 L179.7 85.8 L166 93.6 L146.6 84.5 L137.3 93.6 L132 92.9 L131.6 109 L135.1 121.9 L133.3 128.4 L128 116.8 L124.9 110.3 L118.3 109 L110.4 101.3 L109.5 87.1 L94 100 L84.3 116.1 L75.1 118.7 L47.7 121.9 L37.1 113.6 L41.5 109 L36.2 94.2 L39.7 89 L37.1 88.4 L21.2 92.3 L12.4 96.8 L15.9 101.3 L10.6 103.9Z"
      stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>
`;

const pfeil = '<span class="knopf__pfeil" aria-hidden="true">&rarr;</span>';

/* Länderkennzeichnung: Kürzel und Flagge, klein und ohne Schlagschatten — sie
   markiert den Markt, sie ist kein Gestaltungselement. Sie steht genau zweimal
   auf der Seite: in der Kopfzeile und in der Schublade.

   Die Schweizer Flagge ist quadratisch, nicht rechteckig. Die Kreuzarme sind
   je ein Sechstel länger als breit (Armbreite 6, Armlänge 7): Das Kreuz misst
   damit 20 × 20 in einem Feld von 32 × 32 und sitzt mittig. */
const flagge = (beschriftet = true) => `
  <svg class="flagge" viewBox="0 0 32 32" ${
    beschriftet ? 'role="img" aria-label="Schweiz"' : 'aria-hidden="true"'
  } focusable="false">
    <rect width="32" height="32" rx="3" fill="#d52b1e"/>
    <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7V6Z" fill="#fff"/>
    <rect x="0.5" y="0.5" width="31" height="31" rx="2.5" fill="none" stroke="rgba(255,255,255,0.16)"/>
  </svg>
`;

/* Das Google-Logo kennzeichnet die Quelle der Bewertungen. */
const googleZeichen = `
  <svg class="google-zeichen" viewBox="0 0 48 48" role="img" aria-label="Google" focusable="false">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
`;

export async function seite({ werk }) {
  /* --- Bilder ableiten. Breiten richten sich nach der echten Darstellung. -- */
  const breitFeld = [480, 720, 960, 1280];
  const breitTelefon = [320, 480, 640, 760];
  // Die Vorher-Nachher-Aufnahmen sind querformatig (4:3) und stehen zu zweit
  // nebeneinander — sie brauchen mehr Breite als die Hochformat-Flächen.
  const breitBreit = [480, 720, 960, 1280, 1600];

  const [heldBild, portraitBild, radBild, abschlussBild, logoBild, ...rest] = await Promise.all([
    // Die Vorlage ist 2666 × 4000 und zeigt viel Tunneldecke. Der Ausschnitt
    // rahmt den Läufer so, wie ihn die Heldenfläche braucht (Verhältnis 0,78).
    werk.ableiten(bilder.hero.datei, [640, 900, 1280, 1600, 2000], {
      zuschnitt: { links: 0, oben: 520, breite: 2666, hoehe: 3400 }
    }),
    werk.ableiten(bilder.portrait.datei, breitFeld),
    werk.ableiten(bilder.rad.datei, breitFeld),
    werk.ableiten(bilder.abschluss.datei, [720, 1080, 1440, 1920]),
    werk.ableiten(bilder.logo.datei, [96, 192]),
    ...saeulen.map((saeule) => werk.ableiten(saeule.bild.datei, breitFeld)),
    ...appAnsichten.map((ansicht) => werk.ableiten(ansicht.datei, breitTelefon)),
    ...zielgruppen.map((gruppe) => werk.ableiten(gruppe.bild.datei, breitFeld)),
    ...erfolge.transformationen.map((fall) => werk.ableiten(fall.datei, breitBreit))
  ]);

  const saeulenBilder = rest.slice(0, saeulen.length);
  const appBilder = rest.slice(saeulen.length, saeulen.length + appAnsichten.length);
  const zielBilder = rest.slice(
    saeulen.length + appAnsichten.length,
    saeulen.length + appAnsichten.length + zielgruppen.length
  );
  const erfolgsBilder = rest.slice(saeulen.length + appAnsichten.length + zielgruppen.length);

  const teilbild = await werk.sozialbild(bilder.abschluss.datei, "campdoerfl-ch-online-coaching");
  const symbol = await werk.symbole(bilder.logo.datei);

  /* --- Strukturierte Daten. Nur belegte Angaben, keine Bewertungen. ------- */
  const organisation = {
    "@type": "Organization",
    "@id": `${marke.url}/#organisation`,
    name: marke.name,
    url: `${marke.url}/`,
    logo: `${marke.url}${logoBild.fallback}`,
    email: marke.email,
    telephone: marke.telefon,
    founder: { "@id": `${marke.url}/#dominik` },
    sameAs: [marke.instagram, marke.linkedin, marke.hauptseite]
  };

  const person = {
    "@type": "Person",
    "@id": `${marke.url}/#dominik`,
    name: marke.inhaber,
    jobTitle: "Coach",
    url: `${marke.url}/`,
    worksFor: { "@id": `${marke.url}/#organisation` },
    sameAs: [marke.instagram, marke.linkedin]
  };

  const dienst = {
    "@type": "Service",
    "@id": `${marke.url}/#coaching`,
    name: "Online Coaching Schweiz",
    serviceType: "Online Coaching für Training, Ernährung und Performance",
    provider: { "@id": `${marke.url}/#organisation` },
    // Ein Liefergebiet, keine Niederlassung. Bewusst kein LocalBusiness und
    // keine Adresse: Camp Dörfl hat keine Standorte in der Schweiz.
    areaServed: { "@type": "Country", name: "Schweiz" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${marke.url}/#start`,
      availableLanguage: { "@type": "Language", name: "Deutsch", alternateName: "de" }
    },
    description:
      "Individuell geplantes Training, eine Ernährungsstrategie für den Alltag, regelmässige Check-ins und persönliches Feedback — begleitet über die Camp Dörfl App, in der ganzen Schweiz verfügbar.",
    // Die tatsächlichen Preise in Schweizer Franken — eine eigene Festlegung
    // für den Schweizer Markt, keine Umrechnung. Keine Angabe zur Mehrwertsteuer,
    // solange nicht feststeht, ob es Brutto- oder Nettopreise sind
    // (siehe ch/README.md).
    offers: laufzeiten.map((eintrag) => ({
      "@type": "Offer",
      name: `Online Coaching — ${eintrag.dauer}`,
      price: String(eintrag.preis),
      priceCurrency: waehrung.code,
      category: "Online Coaching",
      url: `${marke.url}/#preise`
    }))
  };

  const webseite = {
    "@type": "WebSite",
    "@id": `${marke.url}/#website`,
    url: `${marke.url}/`,
    name: `${marke.name} — Online Coaching Schweiz`,
    inLanguage: marke.sprache,
    publisher: { "@id": `${marke.url}/#organisation` }
  };

  const fragenAntworten = {
    "@type": "FAQPage",
    "@id": `${marke.url}/#faq`,
    mainEntity: faq.map((eintrag) => ({
      "@type": "Question",
      name: eintrag.frage,
      acceptedAnswer: { "@type": "Answer", text: eintrag.antwort }
    }))
  };

  const strukturierteDaten = {
    "@context": "https://schema.org",
    "@graph": [webseite, organisation, person, dienst, fragenAntworten]
  };

  /* --- Kopf --------------------------------------------------------------- */
  const navMarkup = navigation
    .map((punkt) => `<a href="${punkt.href}" data-nav-link>${punkt.label}</a>`)
    .join("");

  const kopf = `
    <header class="kopf" data-kopf>
      <div class="kopf__schacht">
        <a class="kopf__marke" href="#oben" aria-label="Camp Dörfl — zum Seitenanfang">
          ${bildMarkup(logoBild, { alt: "", sizes: "40px", laden: "eager" })}
          <span class="kopf__wortmarke">Camp Dörfl<span>Online Coaching</span></span>
        </a>
        <nav class="kopf__nav" aria-label="Hauptnavigation">${navMarkup}</nav>
        <div class="kopf__rechts">
          <a class="knopf knopf--gold" href="#start">Coaching starten ${pfeil}</a>
          <span class="kopf__land">${flagge()}<span aria-hidden="true">CH</span></span>
          <button class="kopf__burger" type="button" data-burger aria-expanded="false" aria-controls="schublade" aria-label="Menü öffnen und schliessen">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="schublade" id="schublade" data-schublade aria-hidden="true">
      <nav class="schublade__nav" aria-label="Navigation">
        ${navigation.map((punkt) => `<a href="${punkt.href}">${punkt.label}</a>`).join("")}
      </nav>
      <div class="schublade__fuss">
        <a class="knopf knopf--gold" href="#start">Coaching starten ${pfeil}</a>
        <p class="schublade__meta">${flagge(false)}<span>Schweizweit · Persönlich · Digital</span></p>
      </div>
    </div>
  `;

  /* --- Held --------------------------------------------------------------- */
  const held = `
    <!-- Ohne aria-label: Die H1 darin benennt den Bereich bereits. -->
    <section class="held" id="oben" data-held>
      <div class="held__buehne" data-held-buehne>
        <div class="held__bild">
          ${bildMarkup(heldBild, {
            alt: bilder.hero.alt,
            sizes: "100vw",
            laden: "eager",
            fetchpriority: "high"
          })}
        </div>
        <div class="held__schleier" aria-hidden="true"></div>
        <div class="held__vignette" aria-hidden="true"></div>
        <div class="held__dunkeln" aria-hidden="true"></div>

        <div class="held__inhalt" data-auftritt>
          <div class="held__raster">
            <div class="held__text">
              <h1>
                <span class="marke-zeile">Online Coaching · Schweiz</span>
                <span class="maske"><span>Mehr aus</span></span>
                <span class="maske"><span class="gold">dir rausholen.</span></span>
              </h1>
              <p class="held__unterzeile">Training. Ernährung. Coaching. Ein System.</p>
              <p class="held__zusatz">Persönliches Online Coaching für deine Ziele — schweizweit.</p>
              <div class="held__aktionen">
                <a class="knopf knopf--gold" href="#start">Coaching starten ${pfeil}</a>
                <a class="held__runter" href="#system">So funktioniert es <span aria-hidden="true">&darr;</span></a>
              </div>
            </div>
            <p class="held__leiste">
              <strong>Schweizweit</strong>
              <span>Persönlich · Flexibel · Digital</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  /* --- Das System --------------------------------------------------------- */
  const system = `
    <section class="flaeche hell system" id="system" aria-labelledby="system-titel">
      <div class="schacht">
        <div class="system__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Die Haltung</p>
            <h2 class="anzeige anzeige--2" id="system-titel">
              Du brauchst<br>keine Standardpläne.<br>Du brauchst<br><span class="gold">ein System.</span>
            </h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Kein Rätselraten. Keine Lösung von der Stange. Training, Ernährung und Coaching werden
            auf dein Ziel, deinen Alltag und deine Voraussetzungen abgestimmt.
          </p>
        </div>

        <div class="system__liste">
          ${systempunkte
            .map(
              (punkt, index) => `
                <div class="system__punkt" data-auftauchen data-verzug="${Math.min(3, index)}">
                  <span class="system__nummer" aria-hidden="true">${punkt.nummer}</span>
                  <h3 class="system__titel">${punkt.titel}</h3>
                  <p class="system__text">${punkt.text}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  /* --- Die drei Säulen ---------------------------------------------------- */
  const saeulenAbschnitt = `
    <section class="flaeche dunkel saeulen" id="methode" aria-labelledby="saeulen-titel">
      <div class="schacht">
        <div data-auftauchen>
          <p class="marke-zeile">Die Methode</p>
          <h2 class="anzeige anzeige--2" id="saeulen-titel">
            Training.<br>Ernährung.<br>Coaching.
          </h2>
        </div>

        <div class="saeulen__reihe">
          ${saeulen
            .map(
              (saeule, index) => `
                <article class="saeule" data-auftauchen data-verzug="${index}">
                  <div class="saeule__bild">
                    ${bildMarkup(saeulenBilder[index], {
                      alt: saeule.bild.alt,
                      sizes: "(max-width: 860px) 100vw, 32vw"
                    })}
                  </div>
                  <div class="saeule__inhalt">
                    <h3>${saeule.titel}</h3>
                    <p class="saeule__zeilen">${saeule.zeilen.map((zeile) => `<span>${zeile}</span>`).join("")}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  /* --- App ---------------------------------------------------------------- */
  const app = `
    <section class="flaeche hell app" id="app" aria-labelledby="app-titel">
      <div class="schacht">
        <div class="app__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Das Werkzeug</p>
            <h2 class="anzeige anzeige--2" id="app-titel">
              Dein Coaching.<br>In einer App.
            </h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Alles an einem Ort. Immer dabei. Plan, Ernährung und Entwicklung liegen dort, wo du
            ohnehin hinschaust — auf dem Handy und im Browser.
          </p>
        </div>

        <div class="app__reihe" data-auftauchen>
          ${appAnsichten
            .map(
              (ansicht, index) => `
                <figure class="app__geraet">
                  <div class="app__rahmen">
                    ${bildMarkup(appBilder[index], {
                      alt: ansicht.alt,
                      sizes: "(max-width: 1100px) 62vw, 19vw"
                    })}
                  </div>
                  <figcaption>${ansicht.label}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>

        <ul class="app__leistungen" data-auftauchen>
          ${appLeistungen.map((punkt) => `<li>${punkt}</li>`).join("")}
        </ul>
        <div class="app__abschluss" data-auftauchen>
          <p class="app__schluss">In jeder Laufzeit enthalten.</p>
          <a class="textlink" href="#start">Coaching starten <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
    </section>
  `;

  /* --- Über Dominik ------------------------------------------------------- */
  const dominik = `
    <section class="flaeche dunkel dominik" id="dominik" aria-labelledby="dominik-titel">
      <div class="schacht">
        <div class="dominik__raster">
          <div class="dominik__bild" data-auftauchen>
            ${bildMarkup(portraitBild, {
              alt: bilder.portrait.alt,
              sizes: "(max-width: 1024px) 80vw, 42vw"
            })}
          </div>

          <div data-auftauchen data-verzug="1">
            <p class="marke-zeile">Wer dahintersteht</p>
            <h2 class="anzeige anzeige--2" id="dominik-titel">Praxis<br>statt Theorie.</h2>
            <p class="dominik__sub">Kraft und Ausdauer stehen beide im eigenen Wettkampfverlauf.</p>
            <p class="dominik__text">
              Ich bin Dominik Dörfl — Athlet, Coach und Unternehmer. Seit vielen Jahren lebe ich
              Training, Ernährung und Performance selbst. Diese Erfahrung fliesst direkt in dein
              Coaching ein.
            </p>

            <dl class="dominik__daten">
              ${leistungsdaten
                .map(
                  (eintrag) => `
                    <div>
                      <dt>${eintrag.wert}</dt>
                      <dd>${eintrag.label}<span>${eintrag.zusatz}</span></dd>
                    </div>
                  `
                )
                .join("")}
            </dl>
          </div>
        </div>
      </div>
    </section>
  `;

  /* --- Leistungsband (Zeitfahrrad) ---------------------------------------- */
  const leistung = `
    <section class="leistung" aria-labelledby="leistung-titel">
      <div class="leistung__schacht">
        <div class="leistung__text" data-auftauchen>
          <p class="marke-zeile">Hybrid Performance</p>
          <h2 class="anzeige anzeige--2" id="leistung-titel">Nicht nur<br>Krafttraining.</h2>
          <p class="leistung__zeile">
            Kraft, Ausdauer und Wettkampf greifen ineinander. Genau daraus entsteht die Planung,
            die du bekommst — ob dein Ziel im Studio liegt, auf der Strasse oder am Berg.
          </p>
          <p class="leistung__gross">
            <span>Stärker.</span><span>Ausdauernder.</span><span>Leistungsfähiger.</span>
          </p>
        </div>
        <div class="leistung__rahmen" data-parallax data-auftauchen data-verzug="1">
          ${bildMarkup(radBild, {
            alt: bilder.rad.alt,
            sizes: "(max-width: 1024px) 92vw, 44vw"
          })}
        </div>
      </div>
    </section>
  `;

  /* --- Ablauf ------------------------------------------------------------- */
  const ablaufAbschnitt = `
    <section class="flaeche hell ablauf" id="ablauf" aria-labelledby="ablauf-titel">
      <div class="schacht">
        <div class="ablauf__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Der Weg</p>
            <h2 class="anzeige anzeige--2" id="ablauf-titel">So funktioniert es.</h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Vier Schritte bis zum eigenen System. Danach läuft die Zusammenarbeit in Schleifen:
            messen, einordnen, anpassen.
          </p>
        </div>

        <div class="ablauf__strecke" data-strecke>
          <div class="ablauf__schiene" aria-hidden="true">
            <span class="ablauf__fuellung"></span>
          </div>
          <ol class="ablauf__schritte">
            ${ablauf
              .map(
                (schritt) => `
                  <li class="ablauf__schritt" data-schritt>
                    <span class="ablauf__marke" aria-hidden="true"></span>
                    <span class="ablauf__ziffer" aria-hidden="true">${schritt.nummer}</span>
                    <h3>${schritt.titel}</h3>
                    <p>${schritt.text}</p>
                  </li>
                `
              )
              .join("")}
          </ol>
        </div>
      </div>
    </section>
  `;

  /* --- Stimmen ------------------------------------------------------------ */
  const stimmenDaten = schuetzen(JSON.stringify(bewertungen.stimmen));
  const erste = bewertungen.stimmen[0];

  const stimmen = `
    <section class="flaeche dunkel stimmen" id="erfahrungen" aria-labelledby="stimmen-titel">
      <div class="schacht">
        <div class="stimmen__raster">
          <div class="stimmen__wertung" data-auftauchen>
            <p class="stimmen__quelle-zeile">${googleZeichen}<span>Google Bewertungen</span></p>
            <p class="stimmen__schnitt">${bewertungen.schnitt}<span> / 5</span></p>
            <p class="stimmen__sterne" aria-hidden="true">★★★★★</p>
            <p class="stimmen__quelle">
              ${bewertungen.anzahl} Bewertungen von Menschen, die mit Camp Dörfl trainiert und
              gearbeitet haben.
            </p>
            <a class="textlink" href="${bewertungen.link}" target="_blank" rel="noopener noreferrer">
              Alle Bewertungen <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div data-stimmen="${stimmenDaten}" data-auftauchen data-verzug="1">
            <p class="marke-zeile">Erfahrungen</p>
            <h2 class="anzeige anzeige--2" id="stimmen-titel">
              Das sagen<br>meine Kunden.
            </h2>

            <figure class="stimme" data-stimme aria-live="polite">
              <blockquote>„${erste.text}“</blockquote>
              <figcaption><span data-stimme-name>${erste.name}</span> <span>· Google-Bewertung</span></figcaption>
            </figure>

            <div class="stimmen__steuerung">
              <button class="stimmen__knopf" type="button" data-zurueck aria-label="Vorherige Bewertung">
                <span aria-hidden="true">&larr;</span>
              </button>
              <button class="stimmen__knopf" type="button" data-vor aria-label="Nächste Bewertung">
                <span aria-hidden="true">&rarr;</span>
              </button>
              <span class="stimmen__zaehler" data-zaehler>01 / ${String(bewertungen.stimmen.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;


  /* --- Erfolge im Team ---------------------------------------------------- */
  const erfolgeAbschnitt = `
    <section class="flaeche hell erfolge" id="erfolge" aria-labelledby="erfolge-titel">
      <div class="schacht">
        <div class="erfolge__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Erfolge im Team</p>
            <h2 class="anzeige anzeige--2" id="erfolge-titel">
              Nicht nur<br>Worte.<br><span class="gold">Ergebnisse.</span>
            </h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Camp Dörfl begleitet nicht nur durch den Alltag, sondern bis auf die Wettkampfbühne.
            Die Platzierungen sind über die Jahre dokumentiert und einzeln nachlesbar.
          </p>
        </div>

        <dl class="erfolge__zahlen" data-auftauchen>
          ${erfolge.zahlen
            .map(
              (eintrag) => `
                <div>
                  <dt>${eintrag.wert}</dt>
                  <dd>${eintrag.label}<span>${eintrag.zusatz}</span></dd>
                </div>
              `
            )
            .join("")}
        </dl>

        <div class="erfolge__schweiz" data-auftauchen>
          <p class="erfolge__schweiz-titel">Darunter aus der Schweiz</p>
          <ul class="erfolge__schweiz-liste">
            ${erfolge.schweiz.map((eintrag) => `<li>${eintrag}</li>`).join("")}
          </ul>
        </div>

        <div class="erfolge__raster">
          ${erfolge.transformationen
            .map(
              (fall, index) => `
                <figure class="erfolge__fall" data-auftauchen data-verzug="${Math.min(3, index)}">
                  <div class="erfolge__bild">
                    ${bildMarkup(erfolgsBilder[index], {
                      alt: fall.alt,
                      sizes: "(max-width: 860px) 100vw, 48vw"
                    })}
                  </div>
                  <figcaption>
                    <p class="erfolge__detail">${fall.detail}</p>
                    <h3>${fall.titel}</h3>
                    <p class="erfolge__text">${fall.text}</p>
                  </figcaption>
                </figure>
              `
            )
            .join("")}
        </div>

        <div class="erfolge__fuss" data-auftauchen>
          <p>
            Die Zahlen stammen aus dem dokumentierten Wettkampfbestand von Camp Dörfl und beziehen
            sich auf das Coaching insgesamt, nicht auf die Schweiz allein. Die Aufnahmen zeigen
            betreute Personen ohne erkennbares Gesicht. Ergebnisse sind individuell und lassen sich
            nicht versprechen.
          </p>
          <a class="textlink" href="${erfolge.quelle}" target="_blank" rel="noopener noreferrer">
            Alle Erfolge im Team <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  `;

  /* --- Für wen ------------------------------------------------------------ */
  const fuerWen = `
    <section class="flaeche dunkel dunkel--gehoben fuerwen" id="fuerwen" aria-labelledby="fuerwen-titel">
      <div class="schacht">
        <div data-auftauchen>
          <p class="marke-zeile">Für wen</p>
          <h2 class="anzeige anzeige--2" id="fuerwen-titel">
            Für Menschen,<br>die mehr wollen.
          </h2>
        </div>

        <div class="fuerwen__reihe">
          ${zielgruppen
            .map(
              (gruppe, index) => `
                <figure class="fuerwen__feld" data-auftauchen data-verzug="${index}">
                  ${bildMarkup(zielBilder[index], {
                    alt: gruppe.bild.alt,
                    sizes: "(max-width: 860px) 100vw, 32vw"
                  })}
                  <figcaption>
                    <h3>${gruppe.titel}</h3>
                    <p>${gruppe.zeilen.map((zeile) => `<span>${zeile}</span>`).join("<br>")}</p>
                  </figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  /* --- FAQ ---------------------------------------------------------------- */
  const faqAbschnitt = `
    <section class="flaeche hell faq" id="faq" aria-labelledby="faq-titel">
      <div class="schacht">
        <div class="faq__raster">
          <div data-auftauchen>
            <p class="marke-zeile">Häufige Fragen</p>
            <h2 class="anzeige anzeige--2" id="faq-titel">Bevor du<br>fragst.</h2>
          </div>

          <div class="faq__liste" data-auftauchen data-verzug="1">
            ${faq
              .map(
                (eintrag) => `
                  <details>
                    <summary>${eintrag.frage}<span class="faq__zeichen" aria-hidden="true"></span></summary>
                    <p>${eintrag.antwort}</p>
                  </details>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;

  /* --- Preise ------------------------------------------------------------- */
  const preisFelder = laufzeiten
    .map(
      (eintrag, index) => `
        <li class="preise__feld${eintrag.hervorgehoben ? " preise__feld--hervor" : ""}" data-auftauchen data-verzug="${index}">
          <p class="preise__kennzeichnung">${eintrag.kennzeichnung}</p>
          <h3 class="preise__dauer">${eintrag.dauer}</h3>
          <p class="preise__preis">${waehrung.markup(eintrag.preis)}</p>
          <p class="preise__monat">${
            monatswert(eintrag).gerundetNoetig ? "rund " : ""
          }${waehrung.markup(monatswert(eintrag).gerundet)} pro Monat</p>
          <p class="preise__text">${eintrag.text}</p>
          <a
            class="knopf ${eintrag.hervorgehoben ? "knopf--gold" : "knopf--linie"}"
            href="#start"
            data-laufzeit="${eintrag.dauer}"
          >${eintrag.knopf} ${pfeil}</a>
        </li>
      `
    )
    .join("");

  const preise = `
    <section class="flaeche dunkel preise" id="preise" aria-labelledby="preise-titel">
      <div class="schacht">
        <div class="preise__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Das Angebot</p>
            <h2 class="anzeige anzeige--2" id="preise-titel">Dein Coaching.<br>Deine Laufzeit.</h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Ein System. ${anzahlwort(laufzeiten.length, true)} Möglichkeiten. Die Leistungen sind in allen ${anzahlwort(laufzeiten.length)} Laufzeiten dieselben —
            unterschiedlich ist allein die Dauer der gemeinsamen Betreuung.
          </p>
        </div>

        <ol class="preise__reihe">${preisFelder}</ol>

        <div class="preise__fuss">
          <p>
            Je länger die Laufzeit, desto niedriger der Monatswert: ${monatsAufzaehlung} Monaten.
            Keine automatische Verlängerung.
          </p>
          <p>Alle Beträge in Schweizer Franken.</p>
        </div>

        <div class="enthalten">
          <div data-auftauchen>
            <p class="marke-zeile">Immer enthalten</p>
            <p class="enthalten__notiz">
              Keine Stufen, keine Zusatzpakete: Was hier steht, gehört zu jeder der ${anzahlwort(laufzeiten.length)} Laufzeiten.
            </p>
          </div>
          <ul class="enthalten__liste" data-auftauchen data-verzug="1">
            ${leistungen.map((punkt) => `<li>${punkt}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
  `;

  /* --- Start: Formular ---------------------------------------------------- */
  const start = `
    <section class="flaeche dunkel dunkel--gehoben start" id="start" aria-labelledby="start-titel">
      <div class="schacht">
        <div class="start__raster">
          <div data-auftauchen>
            <p class="marke-zeile">Der erste Schritt</p>
            <h2 class="anzeige anzeige--2" id="start-titel">Erzähl mir<br>von deinem Ziel.</h2>
            <ul class="start__punkte">
              <li>Du schreibst, worum es geht.</li>
              <li>Du bekommst eine persönliche Antwort von Dominik.</li>
              <li>Passt es, starten wir mit der Analyse.</li>
            </ul>
          </div>

          <div data-auftauchen data-verzug="1">
            <form
              class="formular"
              data-formular
              data-endpunkt="${marke.formularEndpunkt}"
              action="${marke.formularZiel}"
              method="POST"
            >
              <h3>Anfrage für dein Coaching</h3>
              <p class="formular__hinweis">
                Du bekommst eine persönliche Antwort — keine automatische Mailstrecke.
              </p>

              <input class="formular__falle" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
              <input type="hidden" name="_subject" value="Camp Dörfl Schweiz — Coaching-Anfrage">
              <input type="hidden" name="_template" value="table">
              <input type="hidden" name="_captcha" value="false">
              <input type="hidden" name="Herkunft" value="campdoerfl.ch">

              <div class="formular__felder">
                <label class="feld">
                  <span>Name</span>
                  <input name="Name" autocomplete="name" required>
                </label>
                <label class="feld">
                  <span>E-Mail</span>
                  <input name="E-Mail" type="email" autocomplete="email" required>
                </label>
                <label class="feld">
                  <span>Telefon (optional)</span>
                  <input name="Telefon" type="tel" autocomplete="tel">
                </label>
                <label class="feld">
                  <span>Dein Ziel</span>
                  <select name="Ziel">
                    ${anliegen.map((punkt) => `<option>${punkt}</option>`).join("")}
                  </select>
                </label>
                <label class="feld feld--breit">
                  <span>Laufzeit</span>
                  <select name="Laufzeit" data-laufzeit-feld>
                    ${laufzeiten
                      .map(
                        (eintrag) =>
                          `<option>${eintrag.dauer} — ${waehrung.klartext(eintrag.preis)}</option>`
                      )
                      .join("")}
                    <option>Noch unentschieden</option>
                  </select>
                </label>
                <label class="feld feld--breit">
                  <span>Worum geht es?</span>
                  <textarea name="Nachricht" rows="4" placeholder="Ausgangslage, Alltag, Zeitrahmen — was ich wissen sollte." required></textarea>
                </label>

                <label class="einwilligung">
                  <input type="checkbox" name="Einwilligung" value="ja" required>
                  <span>
                    Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet
                    werden. Details in der
                    <a href="${marke.datenschutz}" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.
                  </span>
                </label>
              </div>

              <button class="knopf knopf--gold" type="submit">
                <span data-knopf-text>Coaching starten</span> ${pfeil}
              </button>
              <p class="formular__meldung" data-meldung role="status"></p>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  /* --- Schweiz ------------------------------------------------------------ */
  const schweiz = `
    <section class="schweiz" id="schweiz" aria-labelledby="schweiz-titel">
      <div class="schweiz__schacht">
        <div data-auftauchen>${schweizUmriss()}</div>
        <div data-auftauchen data-verzug="1">
          <p class="marke-zeile">Verfügbarkeit</p>
          <h2 class="anzeige anzeige--2" id="schweiz-titel">Dein Coaching.<br>Überall in der Schweiz.</h2>
          <p class="schweiz__staedte">
            ${staedte.map((zeile) => `<span>${zeile.join(" · ")}</span>`).join("")}
            <span class="schweiz__zwischen">Und überall dazwischen.</span>
          </p>
          <p class="schweiz__zusatz">100 % online. Persönlich begleitet.</p>
          <p class="schweiz__hinweis">
            Das sind keine Standorte: Camp Dörfl unterhält in der Schweiz keine Niederlassung und
            keine Trainingsfläche. Genannt sind Orte, an denen betreute Menschen leben — das
            Coaching selbst läuft vollständig online.
          </p>
        </div>
      </div>
    </section>
  `;

  /* --- Abschluss ---------------------------------------------------------- */
  const abschluss = `
    <section class="abschluss" aria-labelledby="abschluss-titel">
      <div class="abschluss__bild" data-parallax>
        ${bildMarkup(abschlussBild, { alt: bilder.abschluss.alt, sizes: "100vw" })}
      </div>
      <div class="abschluss__inhalt" data-auftauchen>
        ${bildMarkup(logoBild, { alt: bilder.logo.alt, sizes: "68px", klasse: "abschluss__logo" })}
        <h2 class="anzeige anzeige--2" id="abschluss-titel">Dein Ziel<br>wartet nicht.</h2>
        <p class="abschluss__zeilen">
          Online Coaching. Persönlich. Strukturiert. Auf dein Ziel ausgerichtet.
        </p>
        <a class="knopf knopf--gold" href="#start">Jetzt Coaching starten ${pfeil}</a>
        <p class="abschluss__laufzeiten">1 · 3 · 6 Monate</p>
        ${schweizUmriss()}
      </div>
    </section>
  `;

  /* --- Fuss --------------------------------------------------------------- */
  const fuss = `
    <footer class="fuss">
      <div class="schacht">
        <div class="fuss__raster">
          <div>
            <p class="fuss__marke">Camp Dörfl<span>Schweiz</span></p>
            <address class="fuss__adresse">campdoerfl.ch</address>
          </div>
          <nav class="fuss__links" aria-label="Weitere Seiten">
            ${unterseiten.map((seite) => `<a href="${seite.href}">${seite.titel}</a>`).join("")}
          </nav>
          <nav class="fuss__links" aria-label="Rechtliches">
            <a href="${marke.impressum}">Impressum</a>
            <a href="${marke.datenschutz}">Datenschutz</a>
          </nav>
          <nav class="fuss__links" aria-label="Soziale Netzwerke">
            <a href="${marke.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="${marke.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="${marke.appStore}" target="_blank" rel="noopener noreferrer">App Store</a>
          </nav>
        </div>
        <div class="fuss__unten">
          <span>&copy; <span data-jahr>2026</span> ${marke.inhaber} · Camp Dörfl</span>
          <span>Online Coaching — schweizweit verfügbar</span>
        </div>
      </div>
    </footer>
  `;

  /* --- Kopfdaten ---------------------------------------------------------- */
  const hreflang = sprachfassungen
    .map((fassung) => `<link rel="alternate" hreflang="${fassung.hreflang}" href="${fassung.url}">`)
    .join("\n    ");

  return `<!doctype html>
<html lang="de-CH">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${marke.titel}</title>
    <meta name="description" content="${marke.beschreibung}">
    <link rel="canonical" href="${marke.url}/">
    ${hreflang}
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="theme-color" content="#080a0b">
    <meta name="author" content="${marke.inhaber}">

    <meta property="og:type" content="website">
    <meta property="og:locale" content="de_CH">
    <meta property="og:site_name" content="${marke.name}">
    <meta property="og:title" content="${marke.titel}">
    <meta property="og:description" content="${marke.beschreibung}">
    <meta property="og:url" content="${marke.url}/">
    <meta property="og:image" content="${marke.url}${teilbild.pfad}">
    <meta property="og:image:width" content="${teilbild.breite}">
    <meta property="og:image:height" content="${teilbild.hoehe}">
    <meta property="og:image:alt" content="${bilder.abschluss.alt}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${marke.titel}">
    <meta name="twitter:description" content="${marke.beschreibung}">
    <meta name="twitter:image" content="${marke.url}${teilbild.pfad}">

    <!-- PNG und ICO müssen dabei sein: Google unterstützt für Favicons kein
         WebP. Mit einem reinen WebP-Symbol bleibt im Suchergebnis die graue
         Weltkugel stehen. -->
    <link rel="icon" href="${symbol.ico}" sizes="16x16 32x32 48x48">
    <link rel="icon" type="image/png" sizes="48x48" href="${symbol.png48}">
    <link rel="icon" type="image/png" sizes="96x96" href="${symbol.png96}">
    <link rel="icon" type="image/png" sizes="192x192" href="${symbol.png192}">
    <link rel="apple-touch-icon" sizes="180x180" href="${symbol.png180}">

    <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-800.woff2?__FONT_VERSION__" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/roboto-condensed-700.woff2?__FONT_VERSION__" crossorigin>
    <link rel="stylesheet" href="/assets/__ASSET_VERSION__/styles.css">

    <!-- Setzt die Kennung, bevor gezeichnet wird. Erst damit versteckt das CSS
         die Auftritts-Elemente. Ohne JavaScript bleibt die Seite vollständig
         sichtbar, statt in leeren Flächen zu enden. -->
    <script>document.documentElement.classList.add("hat-js")</script>
    <script type="application/ld+json">${JSON.stringify(strukturierteDaten)}</script>
  </head>
  <body>
    <a class="springen" href="#inhalt">Zum Inhalt springen</a>
    ${kopf}
    <main id="inhalt">
      ${held}
      ${system}
      ${saeulenAbschnitt}
      ${app}
      ${dominik}
      ${leistung}
      ${ablaufAbschnitt}
      ${stimmen}
      ${erfolgeAbschnitt}
      ${fuerWen}
      ${faqAbschnitt}
      ${preise}
      ${start}
      ${schweiz}
      ${abschluss}
    </main>
    ${fuss}
    <script src="/assets/__ASSET_VERSION__/main.js" defer></script>
  </body>
</html>
`;
}
