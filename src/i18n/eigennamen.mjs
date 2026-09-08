// ============================================================
// Eigennamen aus den Datenmodulen
//
// Veranstaltungen, Orte, Regionen und Quellen sind Eigennamen. "Bienwald-
// Marathon", "Fraenkischer Herbstlauf" oder "Braunschweig" werden nicht
// uebersetzt, sie heissen auch auf Englisch so. Die Liste entsteht beim Build
// direkt aus den Daten, damit sie nie veraltet: Kommt ein Termin dazu, ist sein
// Name automatisch als unveraendert bekannt und taucht nicht als Fehlstelle auf.
//
// Felder, die sehr wohl uebersetzt werden (Landername, Wettkampfart), stehen
// nicht hier, sondern als normale Eintraege im Woerterbuch.
// ============================================================

const EIGENNAMEN_FELDER = new Set([
  "name",
  "city",
  "region",
  "source",
  "venue",
  "champion",
  "athlete",
  "organisation",
  "organizer",
  "location",
  "area"
]);

const DATENMODULE = [
  "../running-events-2026.mjs",
  "../triathlon-events-2026.mjs",
  "../sports-calendar-data.mjs",
  "../bodybuilding-champions.mjs",
  "../data.mjs"
];

export async function sammleEigennamen() {
  const namen = new Set();

  const gehe = (wert) => {
    if (Array.isArray(wert)) {
      wert.forEach(gehe);
      return;
    }
    if (wert && typeof wert === "object") {
      for (const [schluessel, inhalt] of Object.entries(wert)) {
        if (typeof inhalt === "string") {
          if (EIGENNAMEN_FELDER.has(schluessel)) {
            const sauber = inhalt.replace(/\s+/g, " ").trim();
            if (sauber) namen.add(sauber);
          }
        } else {
          gehe(inhalt);
        }
      }
    }
  };

  // Die Wettkampfkalender fuer Bodybuilding, Boxen und MMA stehen als Listen in
  // pages.mjs. Von dort werden gezielt nur diese drei geholt — ein Rundumscan
  // waere falsch, weil dieselbe Datei auch FAQ-Eintraege mit dem Feld "name"
  // fuehrt, und das sind Fragen, keine Eigennamen.
  try {
    const seiten = await import("../pages.mjs");
    for (const liste of [
      seiten.bodybuildingCalendarSources,
      seiten.boxingCalendarSources,
      seiten.mmaCalendarSources
    ]) {
      if (!Array.isArray(liste)) continue;
      for (const quelle of liste) {
        if (quelle?.name) namen.add(String(quelle.name).replace(/\s+/g, " ").trim());
        for (const termin of quelle?.events ?? []) {
          for (const feld of ["name", "location"]) {
            const wert = termin?.[feld];
            if (typeof wert === "string" && wert.trim()) namen.add(wert.replace(/\s+/g, " ").trim());
          }
        }
      }
    }
  } catch {
    // Ohne die Kalenderquellen fehlen nur deren Eigennamen.
  }

  for (const pfad of DATENMODULE) {
    try {
      const modul = await import(pfad);
      for (const wert of Object.values(modul)) gehe(wert);
    } catch {
      // Fehlt ein Modul, fehlen nur seine Eigennamen — der Build laeuft weiter.
    }
  }

  return namen;
}
