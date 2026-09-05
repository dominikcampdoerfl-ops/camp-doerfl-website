/*
  ANATOMIE DER LEISTUNG — scrollgesteuerte Bildsequenz für die Startseite.

  Aufbau: eine hohe Scrollstrecke (.anat__track), in der die Bühne (.anat__stage)
  klebt. Der Scrollfortschritt steuert, welches Kapitel sichtbar ist, wie weit
  sein Bild herangefahren wird und wie die Texttafel ein- und ausgleitet. Die
  Choreografie steht in main.js, die Darstellung in styles.css.

  Reihenfolge und Anzahl der Kapitel sind frei: Das CSS rechnet die
  Scrollstrecke aus --anat-kapitel, das JS liest die Kapitel aus dem DOM.
  Ein Kapitel mehr oder weniger braucht keine weitere Änderung.
*/

import { imageLoadingAttributes } from "./components.mjs";

/**
 * Die Kapitel der Sequenz.
 *
 * `seite` bestimmt, ob die Texttafel links oder rechts der Bildsäule steht —
 * abwechselnd, damit das Auge beim Scrollen wandert statt zu kleben.
 * `fokus` verschiebt den Bildausschnitt (object-position), wo die Person nicht
 * mittig im Bild steht.
 */
const kapitel = [
  {
    nummer: "01",
    kicker: "Das Fundament",
    titel: "Kraft, die trägt",
    text:
      "Jede Belastbarkeit beginnt an der Hantel — nicht als Selbstzweck, sondern als Basis für alles, was danach kommt.",
    spec: "Grundlage · Kraft und Stabilität",
    bild: "dominik-about-gym-portrait",
    aufhellen: 0.04,
    breite: 1200,
    hoehe: 1800,
    alt: "Dominik Dörfl beim Krafttraining im Studio",
    seite: "links",
    fokus: "50% 40%"
  },
  {
    nummer: "02",
    kicker: "Die Ausdauer",
    titel: "Ein Motor, der hält",
    text:
      "Wer über die Langdistanz kommt, weiß, wie sich Belastung über Stunden anfühlt — und wie man sie einteilt.",
    spec: "Ausdauer · Ironman 70.3 Finisher",
    bild: "dominik-ironman-run-nuernberg",
    aufhellen: 0.2,
    breite: 1200,
    hoehe: 1800,
    alt: "Dominik Dörfl auf der Laufstrecke eines Ironman 70.3",
    seite: "rechts",
    fokus: "50% 35%"
  },
  {
    nummer: "03",
    kicker: "Der Treibstoff",
    titel: "Ernährung ohne Dogma",
    text:
      "Was im Alltag nicht funktioniert, funktioniert gar nicht. Geplant wird deshalb, was zu deiner Woche passt.",
    spec: "Ernährung · alltagstauglich geplant",
    bild: "dominik-athlete-nutrition",
    aufhellen: 0,
    breite: 1351,
    hoehe: 1800,
    alt: "Dominik Dörfl bei der Ernährung zwischen zwei Trainingseinheiten",
    seite: "links",
    fokus: "50% 45%"
  },
  {
    nummer: "04",
    kicker: "Die Form",
    titel: "Bühnenreife Präzision",
    text:
      "Auf der Wettkampfbühne zählt jedes Detail. Diese Genauigkeit steckt in jedem Plan, der hier entsteht.",
    spec: "Wettkampf · 2× Deutscher Meister",
    bild: "dominik-bodybuilding-desert",
    aufhellen: -0.09,
    breite: 1409,
    hoehe: 1800,
    alt: "Dominik Dörfl in Wettkampfform als Bodybuilder",
    seite: "rechts",
    fokus: "50% 40%"
  },
  {
    nummer: "05",
    kicker: "Die Begleitung",
    titel: "Niemand geht allein",
    text:
      "Personal Training in Nürnberg heißt: ein Coach, der deinen Plan kennt und dich durch die Wochen begleitet.",
    spec: "Coaching · persönlich in Nürnberg",
    bild: "dominik-personal-coaching-client",
    aufhellen: 0.06,
    breite: 1200,
    hoehe: 1800,
    alt: "Dominik Dörfl beim Personal Training mit einem Klienten",
    seite: "links",
    fokus: "50% 40%"
  },
  {
    nummer: "06",
    kicker: "Die Präsenz",
    titel: "Und dann die Bühne",
    text:
      "Was im Training entsteht, wirkt auch davor: auf Events, in Unternehmen, vor Publikum.",
    spec: "Bühne · knapp 100 moderierte Events",
    bild: "dominik-stage-suit",
    aufhellen: 0.12,
    breite: 1350,
    hoehe: 1800,
    alt: "Dominik Dörfl als Moderator auf der Bühne",
    seite: "rechts",
    fokus: "50% 35%"
  }
];

function bildEbene({ bild, breite, hoehe, fokus, seite, aufhellen = 0 }, index) {
  // Nur das erste Bild lädt sofort — die übrigen erst, wenn der Browser Luft
  // hat. Die Sequenz startet damit ohne Wartezeit und kostet trotzdem kein
  // Ladebudget auf der Startseite.
  const laden = index === 0 ? imageLoadingAttributes({ eager: true }) : imageLoadingAttributes();
  // Das Bild weicht auf die Seite aus, auf der die Texttafel nicht steht.
  const stellung = seite === "rechts" ? " anat__ebene--links" : "";
  const stil = [`object-position:${fokus}`, aufhellen ? `--anat-aufhellen:${aufhellen}` : ""]
    .filter(Boolean)
    .join(";");

  return `
    <figure class="anat__ebene${stellung}" data-anat-ebene="${index}" aria-hidden="true">
      <img
        class="anat__bild"
        src="/assets/images/${bild}.webp"
        width="${breite}"
        height="${hoehe}"
        style="${stil}"
        alt=""${laden}>
    </figure>
  `;
}

function textTafel({ nummer, kicker, titel, text, spec, seite, alt }, index) {
  return `
    <article class="anat__tafel anat__tafel--${seite}" data-anat-tafel="${index}">
      <p class="anat__nummer" aria-hidden="true">${nummer}</p>
      <p class="anat__kicker">${kicker}</p>
      <h3 class="anat__titel">${titel}</h3>
      <p class="anat__text">${text}</p>
      <p class="anat__spec">${spec}</p>
      <p class="anat__bildtext">${alt}</p>
    </article>
  `;
}

/**
 * @param {object} optionen
 * @param {string} optionen.ctaHref Ziel der Schaltfläche im Abschlusskapitel.
 */
export function anatomieDerLeistung({ ctaHref }) {
  return `
    <section class="anat" id="anatomie-der-leistung" data-color-scheme="dark" data-anat aria-labelledby="anat-titel">
      <div class="anat__track" style="--anat-kapitel:${kapitel.length}">
        <div class="anat__stage">
          <div class="anat__ebenen">
            ${kapitel.map(bildEbene).join("")}
          </div>

          <div class="anat__auftakt" data-anat-auftakt>
            <p class="anat__auftakt-eyebrow">Camp Dörfl · Performance System</p>
            <h2 class="anat__auftakt-titel" id="anat-titel">
              Die Anatomie<br><em>der Leistung</em>
            </h2>
            <p class="anat__auftakt-hinweis" aria-hidden="true">Scrollen</p>
          </div>

          ${kapitel.map(textTafel).join("")}

          <div class="anat__schluss" data-anat-schluss>
            <p class="anat__kicker">Dein Kapitel</p>
            <p class="anat__schluss-titel">Sechs Bausteine.<br><em>Ein System.</em></p>
            <ul class="anat__bausteine">
              ${kapitel.map(({ kicker }) => `<li>${kicker.replace(/^(Das|Die|Der) /, "")}</li>`).join("")}
            </ul>
            <a class="anat__schluss-cta" href="${ctaHref}">
              <span>Beratung anfragen</span><span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div class="anat__hud" aria-hidden="true">
            <span class="anat__hud-nummer" data-anat-hud-nummer>00</span>
            <span class="anat__hud-schiene"><span class="anat__hud-fuellung" data-anat-hud-fuellung></span></span>
            <span class="anat__hud-gesamt">${String(kapitel.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

export const anatomieKapitel = kapitel;
