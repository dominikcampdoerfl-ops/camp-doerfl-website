// ============================================================
// Regeln vor dem Woerterbuch
//
// Ein grosser Teil der Seite besteht nicht aus Prosa, sondern aus Schablonen:
// "Offizielle Quelle fuer <Veranstaltung>" kommt 1.042 mal vor, immer mit
// einem anderen Eigennamen dahinter. Solche Faelle als Einzeleintraege zu
// pflegen waere sinnlos. Hier stehen deshalb Regeln, die den uebersetzbaren
// Rahmen erkennen und den Eigennamen unangetastet durchreichen.
//
// Alles Sprachspezifische (Monatsnamen, Laender, Satzschablonen, Zahlformat)
// kommt aus dem Vokabular der jeweiligen Sprache in sprachen.mjs. Diese Datei
// kennt nur die Muster, nicht die Zielsprache.
//
// Reihenfolge zaehlt: Die erste passende Regel gewinnt. Greift keine, uebernimmt
// das Woerterbuch.
// ============================================================

// Woran ein Wettkampfname erkannt wird. Absichtlich eng gehalten: Waere der
// Marker breit (etwa "Bodybuilding"), wuerde die Regel auch Fliesstext annehmen
// und unveraendert zurueckgeben — deutscher Text ginge dann als uebersetzt
// durch. Lieber ein paar Namen von Hand im Woerterbuch.
const WETTKAMPF_MARKER = /(meisterschaft|Cup|Classic|Grand Prix|Universe|Pokal|Pro Card|Muscle Fest)/i;

// Was nach der Ersetzung nicht mehr uebrig bleiben darf. Steht davon noch etwas
// im Text, wird der Ausdruck als Fehlstelle gemeldet statt halb uebersetzt
// durchgereicht.
const DEUTSCHE_RESTE = /(Meisterschaft|Junioren|\bbis\b|\büber\b|\bund\b|\bmit\b|Ü\d|Gesamtsieg|Figur\b)/;

export function erstelleRegeln(uebersetzeTeil, vokabular) {
  const v = vokabular;
  const monatsMuster = Object.keys(v.monate).join("|");
  const monatsListe = Object.values(v.monate);

  // "26. Juni 2026"
  const datum = (text) => {
    const treffer = text.match(new RegExp(`^(\\d{1,2})\\.\\s*(${monatsMuster})\\s+(\\d{4})$`));
    if (!treffer) return null;
    return v.datum(Number(treffer[1]), v.monate[treffer[2]], treffer[3]);
  };

  // "5.–8. November 2026"
  const datumsSpanneKurz = (text) => {
    const treffer = text.match(
      new RegExp(`^(\\d{1,2})\\.\\s*[–-]\\s*(\\d{1,2})\\.\\s*(${monatsMuster})\\s+(\\d{4})$`)
    );
    if (!treffer) return null;
    return v.datumSpanneKurz(Number(treffer[1]), Number(treffer[2]), v.monate[treffer[3]], treffer[4]);
  };

  const wettkampfName = (text) => {
    if (!WETTKAMPF_MARKER.test(text)) return null;
    let neu = text;
    for (const [de, ziel] of v.wettkampf) neu = neu.split(de).join(ziel);
    if (DEUTSCHE_RESTE.test(neu)) return null;
    // Auch ein unveraenderter Name ist ein gueltiges Ergebnis: "FIBO Cup Mens
    // Physique" enthaelt schlicht kein Deutsch. Wuerde hier null zurueckgegeben,
    // landete der Name als vermeintliche Fehlstelle im Bericht.
    return neu;
  };

  // uebersetzeTeil loest einen Teilausdruck ueber Woerterbuch + Regeln auf und
  // gibt bei einer Fehlstelle null zurueck.
  //
  // WICHTIG: Ein unaufloesbarer Teil darf nicht stillschweigend deutsch
  // durchgereicht werden. Sonst meldet der Build eine Seite als fertig, obwohl
  // in einem zusammengesetzten Ausdruck noch Deutsch steht — genau so blieb der
  // Titel "Personal Trainer Nuernberg | 1:1 Coaching · Dominik Doerfl"
  // unbemerkt deutsch. Regeln, die Teile zusammensetzen, geben deshalb null
  // zurueck, sobald ein Teil fehlt.
  const durchreichen = (wert) => uebersetzeTeil(wert);
  const alleAufgeloest = (teile) => teile.every((teil) => teil !== null);

  return [
    // Preise zuerst: "1.158 €" ist im Deutschen tausendeinhundert, in den
    // Zielsprachen muss daraus "€1,158" werden. Diese Regeln stehen vor der
    // allgemeinen Massregel, sonst wuerde die den Betrag durchwinken.
    {
      name: "preis",
      pruefe: (t) => /^([\d.,]+)\s*(?:&nbsp;|\s)*€$/.test(t),
      wende: (t) => v.preis(v.zahl(t.match(/^([\d.,]+)/)[1]))
    },
    {
      name: "preis-ab",
      pruefe: (t) => /^ab\s+([\d.,]+)\s*(?:&nbsp;|\s)*€$/.test(t),
      wende: (t) => v.preisAb(v.zahl(t.match(/^ab\s+([\d.,]+)/)[1]))
    },
    {
      name: "preis-euro-wort",
      pruefe: (t) => /^([\d.,]+)\s+Euro$/.test(t),
      wende: (t) => v.preis(v.zahl(t.match(/^([\d.,]+)/)[1]))
    },

    // Reine Zahlen, Masse und Zeitangaben bleiben, wie sie sind.
    { name: "mass", pruefe: (t) => /^[\d.,]+\s*(?:km|m|kg|h|min|cm|%|EUR)?$/i.test(t), wende: (t) => t },

    // Datumsangaben und Spannen.
    { name: "datum", pruefe: (t) => datum(t) !== null, wende: (t) => datum(t) },
    { name: "datum-kurz", pruefe: (t) => datumsSpanneKurz(t) !== null, wende: (t) => datumsSpanneKurz(t) },
    {
      name: "datum-spanne",
      pruefe: (t) => /\s[–-]\s/.test(t) && datum(t.split(/\s[–-]\s/)[0]) !== null,
      wende: (t) => {
        const teile = t.split(/\s[–-]\s/).map((teil) => datum(teil.trim()) ?? teil.trim());
        return v.datumSpanne(teile[0], teile[1]);
      }
    },

    // Bundeslaender, Laender, Wochentage, Monate als Einzelwort.
    { name: "region", pruefe: (t) => v.regionen[t] !== undefined, wende: (t) => v.regionen[t] },
    { name: "wochentag", pruefe: (t) => v.wochentage[t] !== undefined, wende: (t) => v.wochentage[t] },
    { name: "monat", pruefe: (t) => v.monate[t] !== undefined, wende: (t) => v.monate[t] },
    { name: "monat-kurz", pruefe: (t) => v.monateKurz[t] !== undefined, wende: (t) => v.monateKurz[t] },

    // "Offizielle Quelle für <Veranstaltung>"
    {
      name: "quelle",
      pruefe: (t) => {
        const treffer = t.match(/^Offizielle Quelle für\s+(.+)$/);
        return treffer !== null && durchreichen(treffer[1]) !== null;
      },
      wende: (t) => v.quelle(durchreichen(t.match(/^Offizielle Quelle für\s+(.+)$/)[1]))
    },

    // "Magdeburg · Sachsen-Anhalt" — beide Seiten einzeln aufloesen.
    {
      name: "trennpunkt",
      pruefe: (t) => t.includes(" · ") && alleAufgeloest(t.split(" · ").map(durchreichen)),
      wende: (t) => t.split(" · ").map(durchreichen).join(" · ")
    },

    // Bewusst eng: Frueher reichte "vier Ziffern, Leerzeichen, irgendwas", und
    // damit rutschte auch "2021 eingefuehrt: kraeftigere Beine ..." als
    // vermeintliche Postleitzahl unveraendert durch. Jetzt muss danach ein
    // Ortsname stehen — grossgeschrieben, kurz, ohne Satzzeichen.
    {
      name: "plz-ort",
      pruefe: (t) => /^\d{4,5}\s+\p{Lu}[\p{L}\d.\-/ ]{1,40}(\([^)]{1,30}\))?$/u.test(t) && !/[:;!?]/.test(t),
      wende: (t) => t
    },

    // Wettkampfnamen: Verbandsteil uebersetzen, Eigennamen stehen lassen.
    { name: "wettkampf", pruefe: (t) => wettkampfName(t) !== null, wende: (t) => wettkampfName(t) },

    // "10 Platzierungen · 3 Siege · 7 Podiumsplätze"
    {
      name: "bilanz",
      pruefe: (t) => /^(\d+) Platzierungen · (\d+) Siege · (\d+) Podiumsplätze$/.test(t),
      wende: (t) => {
        const [, a, b, c] = t.match(/^(\d+) Platzierungen · (\d+) Siege · (\d+) Podiumsplätze$/);
        return v.bilanz(a, b, c);
      }
    },

    // "01 von 06: Wieder fit werden" — Zaehler im Karussell.
    {
      name: "zaehler",
      pruefe: (t) => {
        const treffer = t.match(/^(\d+) von (\d+): (.+)$/);
        return treffer !== null && durchreichen(treffer[3]) !== null;
      },
      wende: (t) => {
        const [, a, b, rest] = t.match(/^(\d+) von (\d+): (.+)$/);
        return v.zaehler(a, b, durchreichen(rest));
      }
    },

    // "5 von 5 Sternen"
    {
      name: "sterne",
      pruefe: (t) => /^(\d+) von (\d+) Sternen$/.test(t),
      wende: (t) => {
        const [, a, b] = t.match(/^(\d+) von (\d+) Sternen$/);
        return v.sterne(a, b);
      }
    },

    // "Körperanalyse Nürnberg anzeigen" — Beschriftungen der Karussell-Punkte.
    {
      name: "anzeigen",
      pruefe: (t) => {
        const treffer = t.match(/^(.+)\sanzeigen$/);
        return treffer !== null && durchreichen(treffer[1]) !== null;
      },
      wende: (t) => v.anzeigen(durchreichen(t.match(/^(.+)\sanzeigen$/)[1]))
    },

    // "Camp Dörfl App 2.3 · Stand 01.09.2026" — Versionshinweis der Member Area.
    // Als Regel, damit er nicht bei jedem App-Release neu uebersetzt werden muss.
    {
      name: "app-stand",
      pruefe: (t) =>
        /^Camp Dörfl App\s+(\S+)\s*(?:&middot;|·)\s*Stand\s+(\d{2})\.(\d{2})\.(\d{4})$/.test(t),
      wende: (t) => {
        const [, version, tag, monat, jahr] = t.match(
          /^Camp Dörfl App\s+(\S+)\s*(?:&middot;|·)\s*Stand\s+(\d{2})\.(\d{2})\.(\d{4})$/
        );
        return v.appStand(version, Number(tag), monatsListe[Number(monat) - 1], jahr);
      }
    },

    // "Stand 01.09.2026" und blosse Datumsangaben in Ziffern.
    {
      name: "stand",
      pruefe: (t) => /^Stand\s+(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(t),
      wende: (t) => {
        const [, tag, monat, jahr] = t.match(/^Stand\s+(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        return v.stand(Number(tag), monatsListe[Number(monat) - 1], jahr);
      }
    },
    {
      name: "ziffern-datum",
      pruefe: (t) => /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(t),
      wende: (t) => {
        const [, tag, monat, jahr] = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        return v.datum(Number(tag), monatsListe[Number(monat) - 1], jahr);
      }
    }
  ];
}
