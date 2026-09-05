/*
  CINEMATIC HERO — Choreografie des Auftakts

  Klassisches Browser-Skript, kein Modul: Es läuft nach gsap.min.js und
  ScrollTrigger.min.js und greift auf window.gsap und window.ScrollTrigger zu.
  Alles steckt in einer IIFE, nach außen entsteht keine einzige Variable.

  Gebaut wird eine einzige gescrubbte Timeline. Sie tut drei Dinge gleichzeitig:
  Szene 01 fährt langsam weiter heran, Szene 02 wird über eine Maske von rechts
  freigelegt und fährt dabei auf ihre Ruhegröße zurück, und ein schmaler
  Schattenstreifen läuft über die Naht, damit die Maskenkante nicht als Kante
  gelesen wird. Kein Kreuzblenden, keine Diashow.

  Die Master sind nur 1536 px breit. Deshalb bleibt jede Vergrößerung unter
  1,06: darüber wird das Hochskalieren auf großen Bildschirmen sichtbar.

  Bewusst NICHT enthalten: ScrollSmoother, normalizeScroll, ein eigener
  Scroll-Listener oder eine eigene requestAnimationFrame-Schleife. Der native
  Scroll des Browsers bleibt unangetastet, das Takten übernimmt ScrollTrigger.
*/

(function () {
  "use strict";

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  // Ohne die Bibliothek passiert schlicht nichts: Szene 01 steht dann
  // bildschirmfüllend da, Szene 02 bleibt über CSS abgeschnitten.
  if (!gsap || !ScrollTrigger) return;

  var wurzel = document.querySelector("[data-cine]");
  if (!wurzel) return;

  var buehne = wurzel.querySelector("[data-cine-stage]");
  var running = wurzel.querySelector('[data-cine-scene="running"]');
  var strength = wurzel.querySelector('[data-cine-scene="strength"]');
  var schleier = wurzel.querySelector("[data-cine-veil]");

  if (!buehne || !running || !strength) return;

  // Skaliert wird das Bild, maskiert die Szene. Getrennt, weil clip-path im
  // Koordinatensystem des Elements liegt: Läge beides auf demselben Element,
  // würde die Maskenkante mitskalieren und der Übergang liefe schief.
  var runningBild = running.querySelector("img");
  var strengthBild = strength.querySelector("img");

  if (!runningBild || !strengthBild) return;

  // Die UMD-Fassung registriert sich selbst, sobald sie nach GSAP lädt. Der
  // Aufruf schadet nicht und macht die Abhängigkeit im Code sichtbar.
  gsap.registerPlugin(ScrollTrigger);

  // Auf dem Handy ändert die ein- und ausfahrende Adressleiste die Fensterhöhe.
  // Ohne diese Zeile rechnet ScrollTrigger mittendrin neu und die Bühne springt.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Lage der Übergangsphase innerhalb der Timeline (0 bis 1). Danach bleibt
  // bewusst ein Stück ohne Bewegung: Die Fahrt kommt zur Ruhe, bevor die Bühne
  // die Seite wieder freigibt.
  var UEBERGANG_START = 0.34;
  var UEBERGANG_DAUER = 0.48;
  var UEBERGANG_ENDE = UEBERGANG_START + UEBERGANG_DAUER;

  function choreografie(w) {
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: wurzel,
        start: "top top",
        // Die Strecke hängt an der echten Bühnenhöhe, nicht an einer festen
        // Pixelzahl: Sonst stimmt sie auf keinem zweiten Bildschirm.
        end: function () {
          return "+=" + Math.round(buehne.getBoundingClientRect().height * w.weg);
        },
        pin: buehne,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Ein leerer Platzhalter von 0 bis 1 legt die Gesamtdauer fest. Ohne ihn
    // endete die Timeline mit ihrem letzten Tween, alle Positionen verschöben
    // sich auf der Scrollstrecke nach hinten — und die Ruhe am Schluss fiele weg.
    tl.to({}, { duration: 1 }, 0);

    // Szene 01 fährt heran und wandert eine Spur nach links — die Kamera bleibt
    // in Bewegung, während die nächste Einstellung schon freigelegt wird.
    tl.fromTo(
      runningBild,
      { scale: w.runVon, xPercent: 0 },
      { scale: w.runBis, xPercent: w.runX, duration: 0.62 },
      0
    );

    // Szene 02 wird von rechts freigelegt. Die Maske liegt als Zahl in einer
    // CSS-Variablen: So steht der Ausgangszustand schon im Stylesheet und es
    // gibt keinen Sprung, bevor das Skript läuft.
    tl.fromTo(
      strength,
      { "--cine-reveal": "100%" },
      { "--cine-reveal": "0%", duration: UEBERGANG_DAUER },
      UEBERGANG_START
    );

    // Gleichzeitig kommt Szene 02 auf ihre Ruhegröße zurück. Das ist der Teil,
    // der aus dem Aufdecken eine Kamerabewegung macht.
    tl.fromTo(
      strengthBild,
      { scale: w.strVon },
      { scale: 1, duration: UEBERGANG_DAUER },
      UEBERGANG_START
    );

    // Der Schleier läuft exakt auf der Maskenkante mit — sonst liegt er am
    // falschen Ende der Bühne und die Kante bleibt als Kante sichtbar.
    // Die Kante wandert von 100 % auf 0 % der Bühnenbreite; die Mitte des
    // Streifens liegt bei xPercent · Streifenbreite + halbe Streifenbreite.
    // Aus 42 % Breite folgen die beiden Endwerte unten.
    if (schleier && w.schleier) {
      var vonX = (100 - w.schleierBreite / 2) / (w.schleierBreite / 100);
      var bisX = (0 - w.schleierBreite / 2) / (w.schleierBreite / 100);

      tl.fromTo(
        schleier,
        { xPercent: vonX, opacity: 0 },
        { xPercent: bisX, duration: UEBERGANG_DAUER },
        UEBERGANG_START
      );
      tl.to(schleier, { opacity: 1, duration: UEBERGANG_DAUER * 0.15 }, UEBERGANG_START);
      tl.to(
        schleier,
        { opacity: 0, duration: UEBERGANG_DAUER * 0.22 },
        UEBERGANG_START + UEBERGANG_DAUER * 0.78
      );
    }

    // Ist Szene 02 vollständig da, wird Szene 01 aus dem Weg genommen. Sichtbar
    // ist sie ohnehin nicht mehr — so fängt sie aber auch keine Klicks ab.
    tl.set(running, { autoAlpha: 0 }, UEBERGANG_ENDE + 0.04);
  }

  // Zwei Zweige, beide nur ohne reduzierte Bewegung. Wer sie reduziert haben
  // will, bekommt gar keine Timeline und gar kein Pinning: Szene 01 steht dann
  // still, und der Seiteninhalt folgt direkt darunter (siehe styles.css).
  var mm = gsap.matchMedia();

  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", function () {
    choreografie({
      weg: 1.6,
      runVon: 1.01,
      runBis: 1.055,
      runX: -1,
      strVon: 1.045,
      schleier: true,
      // muss zur Breite von .cine__veil im Stylesheet passen
      schleierBreite: 42
    });
  });

  mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
    choreografie({
      weg: 1.2,
      runVon: 1.005,
      runBis: 1.025,
      runX: -0.5,
      strVon: 1.02,
      schleier: true,
      schleierBreite: 62
    });
  });

  // Die Grenzen des Pins stehen erst fest, wenn die Bilder ihre Fläche
  // tatsächlich einnehmen. Zweimal nachmessen: nach dem Laden der Seite und
  // sobald beide Bilder dekodiert sind.
  function nachmessen() {
    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    nachmessen();
  } else {
    window.addEventListener("load", nachmessen, { once: true });
  }

  var dekodiert = [runningBild, strengthBild].map(function (bild) {
    if (typeof bild.decode !== "function") return Promise.resolve();
    return bild.decode();
  });

  // allSettled statt all: Ein Bild, das nicht dekodiert, darf das Nachmessen
  // des anderen nicht verhindern.
  Promise.allSettled(dekodiert).then(nachmessen);
})();
