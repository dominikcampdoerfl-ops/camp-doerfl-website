/**
 * Die Seite. Eine Route, eine H1, elf Abschnitte in der Reihenfolge der
 * Geschichte: Emotion → Haltung → Methode → Produkt → Vertrauen → Prozess →
 * Belege → Identifikation → Angebot → Handlung.
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
  transformationen,
  guenter,
  zielgruppen,
  staedte,
  leistungen,
  laufzeiten,
  anliegen,
  faq
} from "./marke.mjs";

const schuetzen = (wert = "") =>
  String(wert).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/* Sehr reduzierter Umriss Österreichs — Dekoration, keine Landkarte.
   Der Pfad entsteht aus einem groben Grenzverlauf (Längen- und Breitengrade),
   flächentreu auf die mittlere Breite projiziert. Bewusst ohne Flagge, ohne
   Farbe, ohne Ortsmarken. */
const oesterreichUmriss = `
  <svg class="oesterreich__umriss" viewBox="0 0 200 103" fill="none" aria-hidden="true" focusable="false">
    <path d="M2.4 57.1 L14.9 63.7 L24.1 56.7 L36.4 58.3 L41.7 63 L55.6 55.2 L70 50.9 L85.2 55.2 L89.6 50.5 L87 41.6 L92.3 45.5 L93.6 39.6 L84.7 35.4 L91.5 28.8 L102.5 17.9 L112.2 9.7 L113 16.3 L118.7 16.3 L126.1 17.1 L135.5 16.3 L142.9 0.4 L147.6 3.1 L163 6.6 L172.2 10.5 L184 8.6 L194.5 11.7 L192.1 22.2 L200 39.3 L198.2 50.9 L192.4 52.1 L180.6 52.5 L186.9 61 L180.6 77.3 L172.2 83.6 L169.6 90.2 L159.9 91 L143.4 92.9 L132.1 102.6 L109.6 97.2 L100.7 96 L74.7 91 L72.1 83.2 L68.7 75 L58.2 79.7 L41.2 81.2 L24.1 83.6 L24.6 93.3 L14.9 84.3 L24.4 78.5 L1.8 76.2 L0 68Z"
      stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>
`;

const pfeil = '<span class="knopf__pfeil" aria-hidden="true">&rarr;</span>';

/* Kleine österreichische Flagge in der Kopfzeile. Bewusst klein und ohne
   Schlagschatten — sie markiert den Markt, sie ist kein Gestaltungselement. */
const flagge = `
  <svg class="flagge" viewBox="0 0 24 16" role="img" aria-label="Österreich" focusable="false">
    <rect width="24" height="16" rx="2" fill="#ED2939"/>
    <rect y="5.334" width="24" height="5.332" fill="#fff"/>
    <rect x="0.5" y="0.5" width="23" height="15" rx="1.5" fill="none" stroke="rgba(0,0,0,0.28)"/>
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
  const breitVoll = [720, 1080, 1440, 1920];
  const breitFeld = [480, 720, 960, 1280];
  const breitTelefon = [320, 480, 640];

  // Einzelbilder und Gruppen getrennt anfordern. Vorher hing alles an einer
  // Positionsliste mit ...spread darin — beim Einfügen der Vorher-Nachher-
  // Bilder verrutschte dadurch alles dahinter, und im Kopf stand statt des
  // Logos ein Foto. Benannte Gruppen können das nicht.
  const [heldBild, portraitBild, guenterBild, radBild, abschlussBild, logoBild] = await Promise.all([
    // Die Vorlage ist 2666 × 4000 und zeigt viel Tunneldecke. Der Ausschnitt
    // rahmt den Läufer so, wie ihn die Heldenfläche braucht (Verhältnis 0,79).
    werk.ableiten(bilder.hero.datei, [640, 900, 1280, 1600, 2000], {
      zuschnitt: { links: 0, oben: 500, breite: 2666, hoehe: 3379 }
    }),
    werk.ableiten(bilder.portrait.datei, breitFeld),
    werk.ableiten(guenter.bild.datei, breitFeld),
    werk.ableiten(bilder.rad.datei, breitVoll),
    werk.ableiten(bilder.abschluss.datei, breitVoll),
    werk.ableiten(bilder.logo.datei, [96, 192])
  ]);

  const [saeulenBilder, appBilder, zielBilder, wandelBilder] = await Promise.all([
    Promise.all(saeulen.map((saeule) => werk.ableiten(saeule.bild.datei, breitFeld))),
    Promise.all(appAnsichten.map((ansicht) => werk.ableiten(ansicht.datei, breitTelefon))),
    Promise.all(zielgruppen.map((gruppe) => werk.ableiten(gruppe.bild.datei, breitFeld))),
    Promise.all(transformationen.map((fall) => werk.ableiten(fall.datei, breitFeld)))
  ]);

  const teilbild = await werk.sozialbild(bilder.abschluss.datei, "campdoerfl-at-online-coaching");
  const symbol = await werk.symbole(bilder.logo.datei);

  /* --- Strukturierte Daten. Nur belegte Angaben, keine Bewertungen. ------- */
  const organisation = {
    "@type": "Organization",
    "@id": `${marke.url}/#organisation`,
    name: marke.name,
    url: `${marke.url}/`,
    logo: `${marke.url}${symbol.png192}`,
    email: marke.email,
    telephone: marke.telefon,
    founder: { "@id": `${marke.url}/#dominik` },
    sameAs: [marke.instagram, marke.linkedin, marke.hauptseite]
  };

  const person = {
    "@type": "Person",
    "@id": `${marke.url}/#dominik`,
    name: marke.inhaber,
    jobTitle: "Personal Trainer und Coach",
    knowsAbout: [
      "Fitness Coaching",
      "Online Coaching",
      "Personal Training",
      "Trainingsplanung",
      "Sporternährung",
      "Hybrid Performance"
    ],
    url: `${marke.url}/`,
    worksFor: { "@id": `${marke.url}/#organisation` },
    sameAs: [marke.instagram, marke.linkedin]
  };

  const dienst = {
    "@type": "Service",
    "@id": `${marke.url}/#coaching`,
    name: "Fitness Online Coaching Österreich",
    alternateName: ["Online Coaching Österreich", "Fitness Coaching Österreich", "Personal Trainer online"],
    serviceType: "Fitness Coaching online: Training, Ernährung und Performance",
    provider: { "@id": `${marke.url}/#organisation` },
    areaServed: { "@type": "Country", name: "Österreich" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${marke.url}/#start`,
      availableLanguage: { "@type": "Language", name: "Deutsch", alternateName: "de" }
    },
    description:
      "Individuell geplantes Training, ein Ernährungsrahmen für den Alltag, regelmäßige Check-ins und persönliches Feedback — begleitet über die Camp Dörfl App, österreichweit verfügbar.",
    // Nur die tatsächlichen Preise. Keine Angabe zur Umsatzsteuer, solange nicht
    // feststeht, ob es Brutto- oder Nettopreise sind (siehe at/README.md).
    offers: laufzeiten.map((eintrag) => ({
      "@type": "Offer",
      name: `Online Coaching — ${eintrag.dauer}`,
      price: String(eintrag.preis),
      priceCurrency: "EUR",
      category: "Online Coaching",
      url: `${marke.url}/#start`
    }))
  };

  const webseite = {
    "@type": "WebSite",
    "@id": `${marke.url}/#website`,
    url: `${marke.url}/`,
    name: `${marke.name} — Online Coaching Österreich`,
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
          ${bildMarkup(logoBild, {
            alt: "",
            sizes: "40px",
            laden: "eager"
          })}
          <span class="kopf__wortmarke">Camp Dörfl<span>Online Coaching</span></span>
        </a>
        <nav class="kopf__nav" aria-label="Hauptnavigation">${navMarkup}</nav>
        <div class="kopf__rechts">
          <a class="knopf knopf--gold" href="#start">Coaching starten ${pfeil}</a>
          <span class="kopf__land">${flagge}<span aria-hidden="true">AT</span></span>
          <button class="kopf__burger" type="button" data-burger aria-expanded="false" aria-controls="schublade" aria-label="Menü öffnen und schließen">
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
        <p class="schublade__meta">${flagge}<span>Österreichweit · Persönlich · Digital</span></p>
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
                <span class="marke-zeile">Online Coaching · Österreich</span>
                <span class="maske"><span>Mehr aus</span></span>
                <span class="maske"><span><span class="gold">dir</span> rausholen.</span></span>
              </h1>
              <p class="held__unterzeile">Training. Ernährung. Coaching. Ein System.</p>
              <div class="held__aktionen">
                <a class="knopf knopf--gold" href="#start">Coaching starten ${pfeil}</a>
                <a class="held__runter" href="#system">So funktioniert es <span aria-hidden="true">&darr;</span></a>
              </div>
            </div>
            <p class="held__leiste">
              <strong>Österreichweit</strong>
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
            Kein Rätselraten. Keine Lösung von der Stange. Training, Ernährung und Coaching
            werden an deinen Alltag und deine Ziele angepasst.
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
        <div class="saeulen__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Die Methode</p>
            <h2 class="anzeige anzeige--2" id="saeulen-titel">
              Training.<br>Ernährung.<br>Coaching.
            </h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Fitness Coaching heißt hier nicht Trainingsplan plus Ernährungsplan. Die drei Bereiche
            werden aufeinander abgestimmt — und laufend nachjustiert, wenn sich etwas ändert.
          </p>
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
            Plan, Ernährung, Training, Fortschritt und Gesundheitsdaten liegen an einer Stelle —
            auf dem Handy und im Browser.
          </p>
        </div>
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

      <div class="schacht">
        <ul class="app__leistungen" data-auftauchen>
          ${appLeistungen.map((punkt) => `<li>${punkt}</li>`).join("")}
        </ul>
        <div class="app__abschluss" data-auftauchen>
          <p class="app__schluss">Alles an einem Ort.</p>
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
            <p class="dominik__sub">Ich lebe Performance nicht nur im Training.</p>
            <p class="dominik__text">
              Ich bin Dominik Dörfl – Athlet, Coach und Unternehmer. Seit vielen Jahren beschäftige
              ich mich mit Training, Ernährung und Leistungsfähigkeit. Das Coaching basiert nicht
              auf Theorie allein, sondern auf Erfahrung, Struktur und täglicher Praxis.
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

  /* --- Rad-Band ----------------------------------------------------------- */
  const band = `
    <section class="band" aria-labelledby="band-titel">
      <div class="band__schacht">
        <div class="band__text" data-auftauchen>
          <p class="marke-zeile">Hybrid Performance</p>
          <h2 class="anzeige anzeige--2" id="band-titel">Nicht nur<br>Krafttraining.</h2>
          <p class="band__zeile">
            Kraft, Ausdauer und Wettkampf greifen ineinander. Genau daraus entsteht die Planung,
            die du bekommst — egal, ob dein Ziel im Studio oder auf der Straße liegt.
          </p>
        </div>
        <div class="band__rahmen" data-parallax data-auftauchen data-verzug="1">
          ${bildMarkup(radBild, {
            alt: bilder.rad.alt,
            sizes: "(max-width: 1024px) 92vw, 46vw"
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

  /* --- Erfolge im Team ------------------------------------------------------
     Die Bewertungen sagen, wie die Zusammenarbeit war. Dieser Abschnitt sagt,
     was dabei herauskam — mit Zahlen, die nachprüfbar sind, und einer Person,
     die dazu mit Namen und Gesicht steht. */
  const erfolgeAbschnitt = `
    <section class="flaeche dunkel erfolge" id="erfolge" aria-labelledby="erfolge-titel">
      <div class="schacht">
        <div class="erfolge__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Erfolge im Team</p>
            <h2 class="anzeige anzeige--2" id="erfolge-titel">Nicht nur<br>meine Titel.</h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Der größere Teil steht auf anderen Bühnen: Platzierungen von Athletinnen und Athleten,
            die mit Camp-Dörfl-Coaching angetreten sind.
          </p>
        </div>

        <dl class="erfolge__zahlen" data-auftauchen>
          ${erfolge.zahlen
            .map(
              (eintrag) => `
                <div>
                  <dt>${eintrag.wert}</dt>
                  <dd>${eintrag.label}</dd>
                </div>
              `
            )
            .join("")}
        </dl>

        <p class="erfolge__fuss" data-auftauchen>
          Stand: ${erfolge.stand}. Dokumentierte Wettkampfplatzierungen aus den Jahren
          ${erfolge.zeitraum} — nicht auf Österreich beschränkt.
          <a class="erfolge__quelle" href="${erfolge.quelle}" target="_blank" rel="noopener noreferrer">Vollständige Liste ansehen</a>
        </p>

        <article class="portraet" data-auftauchen>
          <div class="portraet__bild">
            ${bildMarkup(guenterBild, {
              alt: guenter.bild.alt,
              sizes: "(max-width: 1024px) 92vw, 42vw"
            })}
          </div>

          <div class="portraet__text">
            <p class="portraet__name">${guenter.name}</p>
            <h3 class="anzeige anzeige--3">${guenter.titel}</h3>
            <p class="portraet__lauf">${guenter.text}</p>

            <dl class="portraet__daten">
              ${guenter.daten
                .map((eintrag) => `<div><dt>${eintrag.wert}</dt><dd>${eintrag.label}</dd></div>`)
                .join("")}
            </dl>

            <a class="textlink" href="${guenter.link}" target="_blank" rel="noopener noreferrer">
              Die ganze Geschichte <span aria-hidden="true">&rarr;</span>
            </a>
            <p class="portraet__hinweis">${guenter.hinweis}</p>
          </div>
        </article>

        <div class="wandel__raster">
          ${transformationen
            .map(
              (fall, index) => `
                <figure class="wandel__fall" data-auftauchen data-verzug="${Math.min(3, index)}">
                  <div class="wandel__bild">
                    ${bildMarkup(wandelBilder[index], {
                      alt: fall.alt,
                      sizes: "(max-width: 860px) 100vw, 48vw"
                    })}
                  </div>
                  <figcaption>
                    <p class="wandel__detail">${fall.detail}</p>
                    <h3>${fall.titel}</h3>
                    <p class="wandel__text">${fall.text}</p>
                  </figcaption>
                </figure>
              `
            )
            .join("")}
        </div>

        <p class="wandel__fuss" data-auftauchen>
          Aufnahmen betreuter Personen aus dem Bestand von Camp Dörfl, nicht auf Österreich
          beschränkt. Jede Entwicklung hängt an Ausgangslage, Alltag und Umsetzung — diese
          Beispiele sind kein Versprechen für ein Ergebnis.
        </p>
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

  /* --- Österreich-Leiste -------------------------------------------------- */
  const oesterreich = `
    <aside class="oesterreich" aria-labelledby="oesterreich-titel">
      <div class="oesterreich__schacht">
        ${oesterreichUmriss}
        <div class="oesterreich__text">
          <h2 class="oesterreich__titel" id="oesterreich-titel">Personal Trainer für ganz Österreich</h2>
          <p class="oesterreich__staedte">${staedte.join(" · ")} · Überall online</p>
        </div>
        <p class="oesterreich__hinweis">
          Einen guten Personal Trainer findest du in Wien oder Graz — abseits der Städte oft nicht.
          Camp Dörfl hat keine Standorte in Österreich: Die Betreuung läuft online und ist dafür
          im ganzen Land dieselbe.
        </p>
      </div>
    </aside>
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

  /* --- Angebot + Formular ------------------------------------------------- */
  const preisReihe = laufzeiten
    .map(
      (eintrag, index) => `
        <li class="preise__eintrag${index === laufzeiten.length - 1 ? " preise__eintrag--anker" : ""}">
          <span class="preise__dauer">${eintrag.dauer}</span>
          <span class="preise__preis">${eintrag.preis}&nbsp;&euro;</span>
          <span class="preise__monat">${
            eintrag.monate > 1
              ? `${Math.round(eintrag.preis / eintrag.monate)}&nbsp;&euro; pro Monat`
              : "monatlich"
          }</span>
        </li>
      `
    )
    .join("");

  const angebot = `
    <section class="flaeche dunkel angebot" id="start" aria-labelledby="angebot-titel">
      <div class="schacht">
        <div class="angebot__kopf">
          <div data-auftauchen>
            <p class="marke-zeile">Das Angebot</p>
            <h2 class="anzeige anzeige--2" id="angebot-titel">Online Coaching<br>Österreich.</h2>
          </div>
          <p class="lauftext" data-auftauchen data-verzug="1">
            Ein Coaching, kein Baukasten. Alle Bestandteile sind in jeder Laufzeit dabei —
            du entscheidest nur, wie lange wir zusammenarbeiten.
          </p>
        </div>

        <div class="preise" id="preise" data-auftauchen>
          <p class="preise__titel">Laufzeit wählen</p>
          <ol class="preise__reihe">${preisReihe}</ol>
          <p class="preise__fuss">
            In jeder Laufzeit ist der volle Leistungsumfang enthalten. Keine automatische
            Verlängerung.
          </p>
        </div>

        <div class="angebot__raster">
          <div data-auftauchen>
            <p class="angebot__zwischen">Immer enthalten</p>
            <ul class="angebot__leistungen">
              ${leistungen.map((punkt) => `<li>${punkt}</li>`).join("")}
            </ul>
            <p class="angebot__notiz">Persönliche Rückmeldung von Dominik.</p>
          </div>

          <div data-auftauchen data-verzug="1">
            <form
              class="formular"
              data-formular
              data-endpunkt="${marke.formularEndpunkt}"
              action="${marke.formularZiel}"
              method="POST"
            >
              <h3>Erzähl mir von deinem Ziel.</h3>
              <p class="formular__hinweis">
                Du bekommst eine persönliche Antwort — keine automatische Mailstrecke.
              </p>

              <input class="formular__falle" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
              <input type="hidden" name="_subject" value="Camp Dörfl Österreich — Coaching-Anfrage">
              <input type="hidden" name="_template" value="table">
              <input type="hidden" name="_captcha" value="false">
              <input type="hidden" name="Herkunft" value="campdoerfl.at">

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
                  <select name="Laufzeit">
                    ${laufzeiten
                      .map((eintrag) => `<option>${eintrag.dauer} — ${eintrag.preis} €</option>`)
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

  /* --- Abschluss ---------------------------------------------------------- */
  const abschluss = `
    <section class="abschluss" aria-labelledby="abschluss-titel">
      <div class="abschluss__bild" data-parallax>
        ${bildMarkup(abschlussBild, {
          alt: bilder.abschluss.alt,
          sizes: "100vw"
        })}
      </div>
      <div class="abschluss__inhalt" data-auftauchen>
        ${bildMarkup(logoBild, {
          alt: bilder.logo.alt,
          sizes: "68px",
          klasse: "abschluss__logo"
        })}
        <h2 class="anzeige anzeige--2" id="abschluss-titel">Dein Ziel<br>wartet nicht.</h2>
        <p class="abschluss__zeilen">
          Online Coaching. Persönlich. Strukturiert. Auf dein Ziel ausgerichtet.
        </p>
        <a class="knopf knopf--gold" href="#start">Jetzt Coaching starten ${pfeil}</a>
        ${oesterreichUmriss}
      </div>
    </section>
  `;

  /* --- Fuß ---------------------------------------------------------------- */
  const fuss = `
    <footer class="fuss">
      <div class="schacht">
        <div class="fuss__raster">
          <p class="fuss__marke">Camp Dörfl<span>Österreich</span></p>
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
          <span>Online Coaching — österreichweit verfügbar</span>
        </div>
      </div>
    </footer>
  `;

  /* --- Kopfdaten ---------------------------------------------------------- */
  const hreflang = sprachfassungen
    .map((fassung) => `<link rel="alternate" hreflang="${fassung.hreflang}" href="${fassung.url}">`)
    .join("\n    ");

  return `<!doctype html>
<html lang="de-AT">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${marke.titel}</title>
    <meta name="description" content="${marke.beschreibung}">
    <link rel="canonical" href="${marke.url}/">
    ${hreflang}
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="theme-color" content="#08090a">
    <meta name="author" content="${marke.inhaber}">

    <meta property="og:type" content="website">
    <meta property="og:locale" content="de_AT">
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
         WebP und zeigt sonst nur eine graue Weltkugel. -->
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
      ${band}
      ${ablaufAbschnitt}
      ${stimmen}
      ${erfolgeAbschnitt}
      ${fuerWen}
      ${oesterreich}
      ${faqAbschnitt}
      ${angebot}
      ${abschluss}
    </main>
    ${fuss}
    <script src="/assets/__ASSET_VERSION__/main.js" defer></script>
  </body>
</html>
`;
}
