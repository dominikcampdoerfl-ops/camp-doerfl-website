/*
  CAMP DÖRFL — ONLINE COACHING ÖSTERREICH
  Eigenes Skript, ohne Bibliothek. Alles, was sich bewegt, läuft über transform
  und opacity in einer einzigen rAF-Schleife; gelesen wird nur einmal je Bild.
*/
(function () {
  "use strict";

  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wurzel = document.documentElement;

  /* ---------------------------------------------------------------- Kopf */
  const kopf = document.querySelector("[data-kopf]");
  const burger = document.querySelector("[data-burger]");
  const schublade = document.querySelector("[data-schublade]");

  const dahinter = document.querySelectorAll("main, footer");

  function schubladeSetzen(offen) {
    if (!schublade || !burger) return;
    schublade.classList.toggle("ist-offen", offen);
    document.body.classList.toggle("ist-offen", offen);
    document.body.classList.toggle("ist-gesperrt", offen);
    burger.setAttribute("aria-expanded", String(offen));
    schublade.setAttribute("aria-hidden", String(!offen));

    // Alles hinter der Schublade wird stillgelegt: Die Tabulatortaste läuft
    // sonst durch die ganze Seite, die niemand sieht.
    for (const bereich of dahinter) bereich.inert = offen;

    if (offen) {
      // Kurz warten: Solange die visibility noch auf hidden steht, nimmt kein
      // Element den Fokus an — focus() liefe dann still ins Leere.
      setTimeout(() => {
        const erstes = schublade.querySelector("a, button");
        if (erstes) erstes.focus({ preventScroll: true });
      }, 120);
    }
  }

  if (burger && schublade) {
    burger.addEventListener("click", () => {
      schubladeSetzen(!schublade.classList.contains("ist-offen"));
    });

    schublade.addEventListener("click", (ereignis) => {
      if (ereignis.target.closest("a")) schubladeSetzen(false);
    });

    document.addEventListener("keydown", (ereignis) => {
      if (ereignis.key === "Escape" && schublade.classList.contains("ist-offen")) {
        schubladeSetzen(false);
        burger.focus({ preventScroll: true });
      }
    });

    // Wird das Fenster breit genug für die normale Navigation, muss die
    // Schublade zu sein — sonst bleibt der Body gesperrt.
    const breit = window.matchMedia("(min-width: 1025px)");
    const beiBreite = () => {
      if (breit.matches) schubladeSetzen(false);
    };
    breit.addEventListener("change", beiBreite);
  }

  /* --------------------------------------------------- Held: Kamerafahrt */
  const held = document.querySelector("[data-held]");
  const heldBuehne = held ? held.querySelector("[data-held-buehne]") : null;

  let heldZiel = 0;
  let heldWert = 0;
  let heldHub = 1;

  function heldVermessen() {
    if (!held || !heldBuehne) return;
    heldHub = Math.max(1, held.offsetHeight - heldBuehne.offsetHeight);
  }

  /* ------------------------------------------------------------ Parallax */
  const parallaxFelder = Array.from(document.querySelectorAll("[data-parallax]"));
  const parallaxStand = new Map();

  function parallaxVermessen() {
    parallaxStand.clear();
    for (const feld of parallaxFelder) {
      const kasten = feld.getBoundingClientRect();
      parallaxStand.set(feld, {
        oben: kasten.top + window.scrollY,
        hoehe: kasten.height
      });
    }
  }

  /* -------------------------------------------------------- Ablauf-Linie */
  const strecke = document.querySelector("[data-strecke]");
  const schritte = Array.from(document.querySelectorAll("[data-schritt]"));

  /* ---------------------------------------------------- Eine rAF-Schleife */
  let laeuft = false;

  function bild() {
    const y = window.scrollY;

    if (kopf) kopf.classList.toggle("ist-gescrollt", y > 12);

    if (held && heldBuehne) {
      heldZiel = Math.min(1, Math.max(0, (y - held.offsetTop) / heldHub));
      // Der Scrub wird geglättet: Die Kamera zieht nach, statt am Rad zu kleben.
      heldWert += (heldZiel - heldWert) * 0.14;
      if (Math.abs(heldZiel - heldWert) < 0.0005) heldWert = heldZiel;
      heldBuehne.style.setProperty("--fortschritt", heldWert.toFixed(4));
      heldBuehne.style.setProperty("--bild-zoom", (1 + 0.035 * heldWert).toFixed(4));
    }

    for (const feld of parallaxFelder) {
      const stand = parallaxStand.get(feld);
      if (!stand) continue;
      const mitte = stand.oben + stand.hoehe / 2 - (y + window.innerHeight / 2);
      const sichtbar = Math.abs(mitte) < window.innerHeight + stand.hoehe;
      if (!sichtbar) continue;
      const versatz = Math.max(-46, Math.min(46, (mitte / window.innerHeight) * -38));
      feld.style.setProperty("--parallax", versatz.toFixed(2) + "px");
    }

    if (strecke) {
      const kasten = strecke.getBoundingClientRect();
      const hoehe = window.innerHeight;
      // Über eine halbe Bildhöhe hinweg füllen, nicht über die Höhe der
      // Strecke selbst — die ist nur rund 180 px hoch und wäre sofort voll.
      const anteil = (hoehe * 0.86 - kasten.top) / Math.max(1, kasten.height + hoehe * 0.5);
      const fuellung = Math.min(1, Math.max(0, anteil));
      strecke.style.setProperty("--fuellung", fuellung.toFixed(3));
      schritte.forEach((schritt, index) => {
        schritt.classList.toggle("ist-erreicht", fuellung >= index / Math.max(1, schritte.length - 1) - 0.02);
      });
    }

    const weiterLaufen = held && Math.abs(heldZiel - heldWert) > 0.0005;
    if (weiterLaufen) {
      requestAnimationFrame(bild);
    } else {
      laeuft = false;
    }
  }

  function anstossen() {
    if (laeuft) return;
    laeuft = true;
    requestAnimationFrame(bild);
  }

  window.addEventListener("scroll", anstossen, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      heldVermessen();
      parallaxVermessen();
      anstossen();
    },
    { passive: true }
  );

  heldVermessen();
  parallaxVermessen();
  anstossen();
  window.addEventListener("load", () => {
    heldVermessen();
    parallaxVermessen();
    anstossen();
  });

  /* ------------------------------------------------------- Held: Auftritt */
  const auftritt = document.querySelector("[data-auftritt]");
  if (auftritt) {
    // Ein Bild abwarten, damit der Übergang wirklich läuft und nicht
    // schon im ersten Layout fertig ist.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => auftritt.classList.add("ist-aufgetreten"));
    });
  }

  /* ----------------------------------------------------------- Auftauchen */
  const auftauchend = document.querySelectorAll("[data-auftauchen]");

  if (ruhig.matches || !("IntersectionObserver" in window)) {
    auftauchend.forEach((element) => element.classList.add("ist-sichtbar"));
  } else {
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          eintrag.target.classList.add("ist-sichtbar");
          beobachter.unobserve(eintrag.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );
    auftauchend.forEach((element) => beobachter.observe(element));
  }

  /* --------------------------------------------------------- Navigation */
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const abschnitte = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (abschnitte.length && "IntersectionObserver" in window) {
    const spion = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          const id = "#" + eintrag.target.id;
          navLinks.forEach((link) => link.classList.toggle("ist-aktiv", link.getAttribute("href") === id));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    abschnitte.forEach((abschnitt) => spion.observe(abschnitt));
  }

  /* ------------------------------------------------------------- Stimmen */
  const stimmenFeld = document.querySelector("[data-stimmen]");

  if (stimmenFeld) {
    const stimmen = JSON.parse(stimmenFeld.getAttribute("data-stimmen"));
    const bau = stimmenFeld.querySelector("[data-stimme]");
    const zitat = bau.querySelector("blockquote");
    const name = bau.querySelector("[data-stimme-name]");
    const zaehler = stimmenFeld.querySelector("[data-zaehler]");
    let index = 0;

    const zweistellig = (zahl) => String(zahl).padStart(2, "0");

    function zeigen(neu) {
      index = (neu + stimmen.length) % stimmen.length;
      const wechsel = () => {
        zitat.textContent = "„" + stimmen[index].text + "“";
        name.textContent = stimmen[index].name;
        zaehler.textContent = zweistellig(index + 1) + " / " + zweistellig(stimmen.length);
        bau.classList.remove("ist-wechselnd");
      };

      if (ruhig.matches) {
        wechsel();
        return;
      }

      bau.classList.add("ist-wechselnd");
      setTimeout(wechsel, 260);
    }

    stimmenFeld.querySelector("[data-zurueck]").addEventListener("click", () => zeigen(index - 1));
    stimmenFeld.querySelector("[data-vor]").addEventListener("click", () => zeigen(index + 1));

    stimmenFeld.addEventListener("keydown", (ereignis) => {
      if (ereignis.key === "ArrowLeft") zeigen(index - 1);
      if (ereignis.key === "ArrowRight") zeigen(index + 1);
    });
  }

  /* ------------------------------------------------------------ Formular */
  const formular = document.querySelector("[data-formular]");

  if (formular) {
    const meldung = formular.querySelector("[data-meldung]");
    const knopf = formular.querySelector("button[type=submit]");
    const knopfText = knopf ? knopf.querySelector("[data-knopf-text]") : null;
    const urText = knopfText ? knopfText.textContent : "";

    formular.addEventListener("submit", async (ereignis) => {
      const ziel = formular.getAttribute("data-endpunkt");
      if (!ziel) return; // ohne Endpunkt: normaler POST als Rückfall

      ereignis.preventDefault();

      if (!formular.reportValidity()) return;

      meldung.textContent = "";
      meldung.removeAttribute("data-zustand");
      if (knopf) knopf.disabled = true;
      if (knopfText) knopfText.textContent = "Wird gesendet";

      try {
        const antwort = await fetch(ziel, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(formular)
        });

        if (!antwort.ok) throw new Error("Antwort " + antwort.status);

        formular.reset();
        meldung.setAttribute("data-zustand", "gut");
        meldung.textContent = "Danke — deine Anfrage ist angekommen. Du bekommst persönlich Antwort von Dominik.";
      } catch (fehler) {
        meldung.setAttribute("data-zustand", "fehler");
        meldung.innerHTML =
          'Das Senden hat gerade nicht geklappt. Schreib mir direkt an <a href="mailto:dominik@campdoerfl.de">dominik@campdoerfl.de</a>.';
      } finally {
        if (knopf) knopf.disabled = false;
        if (knopfText) knopfText.textContent = urText;
      }
    });
  }

  /* ------------------------------------------------ Jahr in der Fußzeile */
  const jahr = document.querySelector("[data-jahr]");
  if (jahr) jahr.textContent = String(new Date().getFullYear());

  wurzel.classList.add("hat-js");
})();
