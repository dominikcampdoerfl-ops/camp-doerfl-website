/*
  CINEMATIC HERO — der Auftakt der Startseite als zusammenhängende Kamerafahrt.

  Prototyp mit zwei Szenen: 01 RUNNING geht in 02 STRENGTH über. Die Bühne wird
  von ScrollTrigger gepinnt, die Scrollposition treibt eine Timeline. Choreografie
  und Pinning stehen in src/hero-cinema.js, die Darstellung in src/styles.css.

  Hier entsteht ausschließlich das Markup — serverseitig, damit die erste Szene
  schon im ausgelieferten HTML steht und das LCP-Bild ohne Umweg über JavaScript
  gefunden wird. Ohne JavaScript oder ohne GSAP bleibt Szene 01 bildschirmfüllend
  stehen und Szene 02 vollständig abgeschnitten: kein Fehler, nur ein ruhiges Bild.

  Der Namensraum .cine ist bewusst neu. Der alte Hero (.ff-hero) bringt eigene
  Einblendanimationen, eine Parallax-Schleife und !important-Regeln mit — auf
  denselben Klassen würden beide Systeme gegeneinander laufen.
*/

import { imageLoadingAttributes } from "./components.mjs";

const BILDPFAD = "/assets/images/cinematic-hero/source";

// Die Master sind 1536×864 (16:9). Die Maße stehen im Markup, damit der Browser
// den Platz kennt, bevor das Bild eintrifft.
const BREITE = 1536;
const HOEHE = 864;

const szenen = [
  {
    id: "running",
    datei: "01-running.jpg",
    alt: "Dominik Dörfl beim Lauftraining auf der Stadionbahn",
    // Szene 01 ist das erste sichtbare Bild und damit der LCP-Kandidat.
    zuerst: true
  },
  {
    id: "strength",
    datei: "02-strength.jpg",
    alt: "Dominik Dörfl beim Bankdrücken im Stadion",
    zuerst: false
  }
];

export function cinematicHero() {
  const szenenMarkup = szenen
    .map(
      ({ id, datei, alt, zuerst }) => `
      <div class="cine__scene cine__scene--${id}" data-cine-scene="${id}">
        <div class="cine__media">
          <img src="${BILDPFAD}/${datei}" width="${BREITE}" height="${HOEHE}" alt="${alt}"${imageLoadingAttributes({ eager: zuerst })}>
        </div>
      </div>`
    )
    .join("");

  return `
    <section class="cine" data-cine>
      <div class="cine__stage" data-cine-stage>${szenenMarkup}
        <div class="cine__veil" data-cine-veil aria-hidden="true"></div>
      </div>
    </section>
  `;
}
