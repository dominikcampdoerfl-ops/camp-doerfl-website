// Sieger von Mr. Olympia und Arnold Classic — Datengrundlage der beiden
// Siegerlisten-Seiten.
//
// QUELLENLAGE: Jede Zeile ist belegt, nichts ist ergänzt oder geschätzt.
// Gegengeprüft wurden die Jahre ab 2019 mit der gepflegten Datei
// lib/bodybuildingSceneKnowledge.ts im App-Repo; die fünf 2025er Titel stimmen
// dort und in den externen Quellen überein.
//
// WARTUNG: Nach jedem Mr. Olympia (September/Oktober) und jedem Arnold Classic
// (Februar/März) die jeweils neue Zeile ergänzen und CHAMPIONS_STAND neu setzen.
//
// SCHREIBWEISE: `jahr` ist entweder eine Zahl oder [von, bis] für eine Serie
// aufeinanderfolgender Titel. Die Seite rechnet das in einzelne Jahre um.

export const CHAMPIONS_STAND = "2026-08-28";

// Klassen, für die noch keine belegte Jahresliste vorliegt. Sie werden auf der
// Seite offen benannt, statt sie stillschweigend wegzulassen.
export const arnoldOffeneKlassen = [
  "Men’s 212",
  "Men’s Physique",
  "Figure International",
  "Bikini International",
  "Fitness International",
  "Wellness International"
];

export const olympiaKlassen = [
  {
    id: "mens-open",
    name: "Men’s Open",
    kurz: "Men’s Open",
    seit: 1965,
    text: "Die Königsklasse und der eigentliche Mr.-Olympia-Titel: keine Gewichtsgrenze, bewertet wird die komplette Erscheinung aus Masse, Definition und Proportion.",
    sieger: [
      { jahr: [1965, 1966], name: "Larry Scott" },
      { jahr: [1967, 1969], name: "Sergio Oliva" },
      { jahr: [1970, 1975], name: "Arnold Schwarzenegger" },
      { jahr: 1976, name: "Franco Columbu" },
      { jahr: [1977, 1979], name: "Frank Zane" },
      { jahr: 1980, name: "Arnold Schwarzenegger" },
      { jahr: 1981, name: "Franco Columbu" },
      { jahr: 1982, name: "Chris Dickerson" },
      { jahr: 1983, name: "Samir Bannout" },
      { jahr: [1984, 1991], name: "Lee Haney" },
      { jahr: [1992, 1997], name: "Dorian Yates" },
      { jahr: [1998, 2005], name: "Ronnie Coleman" },
      { jahr: [2006, 2007], name: "Jay Cutler" },
      { jahr: 2008, name: "Dexter Jackson" },
      { jahr: [2009, 2010], name: "Jay Cutler" },
      { jahr: [2011, 2017], name: "Phil Heath" },
      { jahr: 2018, name: "Shawn Rhoden" },
      { jahr: 2019, name: "Brandon Curry" },
      { jahr: [2020, 2021], name: "Mamdouh „Big Ramy“ Elssbiay" },
      { jahr: 2022, name: "Hadi Choopan" },
      { jahr: 2023, name: "Derek Lunsford" },
      { jahr: 2024, name: "Samson Dauda" },
      { jahr: 2025, name: "Derek Lunsford" }
    ]
  },
  {
    id: "212",
    name: "Men’s 212",
    kurz: "212",
    seit: 2008,
    text: "Für Athleten bis 212 Pfund (96,2 kg). 2008 bis 2011 lief die Klasse als „202 Showdown“ mit einer Grenze von 202 Pfund.",
    sieger: [
      { jahr: 2008, name: "David Henry" },
      { jahr: [2009, 2011], name: "Kevin English" },
      { jahr: [2012, 2018], name: "James „Flex“ Lewis" },
      { jahr: 2019, name: "Kamal Elgargni" },
      { jahr: 2020, name: "Shaun Clarida" },
      { jahr: 2021, name: "Derek Lunsford" },
      { jahr: 2022, name: "Shaun Clarida" },
      { jahr: [2023, 2025], name: "Keone Pearson" }
    ]
  },
  {
    id: "classic-physique",
    name: "Classic Physique",
    kurz: "Classic Physique",
    seit: 2016,
    text: "Die Antwort auf den Ruf nach der goldenen Ära: Gewichtslimit nach Körpergröße, bewertet werden Linie und Taille statt maximaler Masse.",
    sieger: [
      { jahr: 2016, name: "Danny Hester" },
      { jahr: [2017, 2018], name: "Breon Ansley" },
      { jahr: [2019, 2024], name: "Chris Bumstead" },
      { jahr: 2025, name: "Ramon Rocha Queiroz" }
    ]
  },
  {
    id: "mens-physique",
    name: "Men’s Physique",
    kurz: "Men’s Physique",
    seit: 2013,
    text: "Gewertet wird in Boardshorts, ohne Beinbewertung. Im Vordergrund stehen Oberkörper, Schulterbreite und Gesamteindruck.",
    sieger: [
      { jahr: 2013, name: "Mark Anthony Wingson" },
      { jahr: [2014, 2017], name: "Jeremy Buendia" },
      { jahr: 2018, name: "Brandon Hendrickson" },
      { jahr: 2019, name: "Raymont Edmonds" },
      { jahr: [2020, 2021], name: "Brandon Hendrickson" },
      { jahr: 2022, name: "Erin Banks" },
      { jahr: [2023, 2025], name: "Ryan Terry" }
    ]
  },
  {
    id: "ms-olympia",
    name: "Ms. Olympia",
    kurz: "Ms. Olympia",
    seit: 1980,
    text: "Frauen-Bodybuilding, seit 1980. Zwischen 2015 und 2019 wurde der Titel nicht ausgetragen und kehrte 2020 zurück.",
    sieger: [
      { jahr: 1980, name: "Rachel McLish" },
      { jahr: 1981, name: "Kike Elomaa" },
      { jahr: 1982, name: "Rachel McLish" },
      { jahr: 1983, name: "Carla Dunlap" },
      { jahr: [1984, 1989], name: "Cory Everson" },
      { jahr: [1990, 1995], name: "Lenda Murray" },
      { jahr: [1996, 1999], name: "Kim Chizevsky" },
      { jahr: 2000, name: "Valentina Chepiga und Andrulla Blanchette", hinweis: "In diesem Jahr wurde in Gewichtsklassen gewertet, ohne Gesamtsiegerin." },
      { jahr: 2001, name: "Juliette Bergmann" },
      { jahr: [2002, 2003], name: "Lenda Murray" },
      { jahr: 2004, name: "Iris Kyle" },
      { jahr: 2005, name: "Yaxeni Oriquen" },
      { jahr: [2006, 2014], name: "Iris Kyle" },
      { jahr: [2020, 2025], name: "Andrea Shaw" }
    ],
    luecke: { von: 2015, bis: 2019, grund: "Der Titel wurde in diesen Jahren nicht ausgetragen." }
  },
  {
    id: "fitness",
    name: "Fitness Olympia",
    kurz: "Fitness",
    seit: 1995,
    text: "Zwei Runden: eine Kür mit Kraft-, Beweglichkeits- und Turnelementen und eine Bewertung der Erscheinung.",
    sieger: [
      { jahr: 1995, name: "Mia Finnegan" },
      { jahr: 1996, name: "Saryn Muldrow" },
      { jahr: 1997, name: "Carol Semple-Marzetta" },
      { jahr: 1998, name: "Monica Brant" },
      { jahr: 1999, name: "Mary Yockey" },
      { jahr: [2000, 2003], name: "Susan Curry" },
      { jahr: 2004, name: "Adela Garcia" },
      { jahr: 2005, name: "Jen Hendershott" },
      { jahr: [2006, 2007], name: "Adela Garcia" },
      { jahr: 2008, name: "Jen Hendershott" },
      { jahr: [2009, 2013], name: "Adela Garcia" },
      { jahr: [2014, 2017], name: "Oksana Grishina" },
      { jahr: [2018, 2019], name: "Whitney Jones" },
      { jahr: 2020, name: "Missy Truscott" },
      { jahr: 2021, name: "Whitney Jones" },
      { jahr: 2022, name: "Missy Truscott" },
      { jahr: 2023, name: "Oksana Grishina" },
      { jahr: 2024, name: "Missy Truscott" },
      { jahr: 2025, name: "Michelle Fredua-Mensah" }
    ]
  },
  {
    id: "figure",
    name: "Figure Olympia",
    kurz: "Figure",
    seit: 2003,
    text: "Athletische Linie mit betonter V-Form, weniger Masse als im Frauen-Bodybuilding und mehr als in der Bikini-Klasse.",
    sieger: [
      { jahr: [2003, 2005], name: "Davana Medina" },
      { jahr: [2006, 2007], name: "Jenny Lynn" },
      { jahr: 2008, name: "Jennifer Gates" },
      { jahr: 2009, name: "Nicole Wilkins" },
      { jahr: 2010, name: "Erin Stern" },
      { jahr: 2011, name: "Nicole Wilkins" },
      { jahr: 2012, name: "Erin Stern" },
      { jahr: [2013, 2014], name: "Nicole Wilkins" },
      { jahr: [2015, 2016], name: "Latorya Watts" },
      { jahr: [2017, 2024], name: "Cydney Gillon" },
      { jahr: 2025, name: "Rhea Gayle" }
    ]
  },
  {
    id: "bikini",
    name: "Bikini Olympia",
    kurz: "Bikini",
    seit: 2010,
    text: "Die jüngste und größte Frauenklasse: Bewertet werden Gesamtbild, Proportion und Bühnenpräsenz, nicht die Muskelmasse.",
    sieger: [
      { jahr: 2010, name: "Sonia Gonzales" },
      { jahr: 2011, name: "Nicole Nagrani" },
      { jahr: 2012, name: "Nathalia Melo" },
      { jahr: [2013, 2015], name: "Ashley Kaltwasser" },
      { jahr: 2016, name: "Courtney King" },
      { jahr: [2017, 2018], name: "Angelica Teixeira" },
      { jahr: 2019, name: "Elisa Pecini" },
      { jahr: 2020, name: "Janet Layug" },
      { jahr: 2021, name: "Jennifer Dorie" },
      { jahr: 2022, name: "Maureen Blanquisco" },
      { jahr: 2023, name: "Jennifer Dorie" },
      { jahr: 2024, name: "Lauralie Chapados" },
      { jahr: 2025, name: "Maureen Blanquisco" }
    ]
  },
  {
    id: "womens-physique",
    name: "Women’s Physique",
    kurz: "Women’s Physique",
    seit: 2013,
    text: "Zwischen Figure und Frauen-Bodybuilding: mehr Muskel als in der Figure-Klasse, gewertet mit Pflichtposen.",
    sieger: [
      { jahr: 2013, name: "Dana Linn Bailey" },
      { jahr: [2014, 2017], name: "Juliana Malacarne" },
      { jahr: [2018, 2019], name: "Shanique Grant" },
      { jahr: [2020, 2021], name: "Sarah Villegas" },
      { jahr: 2022, name: "Natalia Abraham Coelho" },
      { jahr: [2023, 2024], name: "Sarah Villegas" },
      { jahr: 2025, name: "Natalia Abraham Coelho" }
    ]
  },
  {
    id: "wellness",
    name: "Wellness Olympia",
    kurz: "Wellness",
    seit: 2021,
    text: "2021 eingeführt: kräftigere Beine und Gesäßmuskulatur im Verhältnis zum Oberkörper, ursprünglich aus Brasilien kommend.",
    sieger: [
      { jahr: [2021, 2023], name: "Francielle Mattos" },
      { jahr: 2024, name: "Isabelle Nunes" },
      { jahr: 2025, name: "Eduarda Bezerra" }
    ]
  }
];

export const arnoldKlassen = [
  {
    id: "mens-open",
    name: "Men’s Open",
    kurz: "Men’s Open",
    seit: 1989,
    text: "Der Hauptwettbewerb des Arnold Sports Festival in Columbus, Ohio — seit 1989 die zweitwichtigste Bühne im Profi-Bodybuilding nach dem Mr. Olympia.",
    sieger: [
      { jahr: 1989, name: "Rich Gaspari" },
      { jahr: 1990, name: "Mike Ashley" },
      { jahr: 1991, name: "Shawn Ray" },
      { jahr: 1992, name: "Vince Taylor" },
      { jahr: 1993, name: "Flex Wheeler" },
      { jahr: 1994, name: "Kevin Levrone" },
      { jahr: 1995, name: "Mike Francois" },
      { jahr: 1996, name: "Kevin Levrone" },
      { jahr: [1997, 1998], name: "Flex Wheeler" },
      { jahr: 1999, name: "Nasser El Sonbaty" },
      { jahr: 2000, name: "Flex Wheeler" },
      { jahr: 2001, name: "Ronnie Coleman" },
      { jahr: [2002, 2004], name: "Jay Cutler" },
      { jahr: [2005, 2006], name: "Dexter Jackson" },
      { jahr: 2007, name: "Victor Martinez" },
      { jahr: 2008, name: "Dexter Jackson" },
      { jahr: [2009, 2010], name: "Kai Greene" },
      { jahr: [2011, 2012], name: "Branch Warren" },
      { jahr: 2013, name: "Dexter Jackson" },
      { jahr: 2014, name: "Dennis Wolf" },
      { jahr: 2015, name: "Dexter Jackson" },
      { jahr: 2016, name: "Kai Greene" },
      { jahr: 2017, name: "Cedric McMillan" },
      { jahr: 2018, name: "William Bonac" },
      { jahr: 2019, name: "Brandon Curry" },
      { jahr: 2020, name: "William Bonac" },
      { jahr: 2021, name: "Nick Walker" },
      { jahr: 2022, name: "Brandon Curry" },
      { jahr: 2023, name: "Samson Dauda" },
      { jahr: 2024, name: "Hadi Choopan" },
      { jahr: 2025, name: "Derek Lunsford" },
      { jahr: 2026, name: "Andrew Jacked" }
    ]
  },
  {
    id: "classic-physique",
    name: "Classic Physique",
    kurz: "Classic Physique",
    seit: 2018,
    text: "Seit 2018 am Arnold ausgetragen, mit denselben Größen-Gewichts-Grenzen wie beim Mr. Olympia.",
    sieger: [
      { jahr: 2018, name: "Breon Ansley" },
      { jahr: 2019, name: "George Peterson" },
      { jahr: 2020, name: "Alex Cambronero" },
      { jahr: [2021, 2022], name: "Terrence Ruffin" },
      { jahr: 2023, name: "Ramon Rocha Queiroz" },
      { jahr: 2024, name: "Wesley Vissers" },
      { jahr: 2025, name: "Mike Sommerfeld" },
      { jahr: 2026, name: "Wesley Vissers" }
    ]
  },
  {
    id: "ms-international",
    name: "Ms. International",
    kurz: "Ms. International",
    seit: 1986,
    text: "Das Frauen-Bodybuilding des Arnold Classic. Nach 2013 wurde der Wettbewerb eingestellt; an seine Stelle trat 2014 die 212-Klasse.",
    sieger: [
      { jahr: 1986, name: "Erika Geissler" },
      { jahr: 1988, name: "Cathey Palyo" },
      { jahr: 1989, name: "Tonya Knight" },
      { jahr: 1990, name: "Laura Creavalle" },
      { jahr: 1991, name: "Tonya Knight" },
      { jahr: 1992, name: "Anja Schreiner" },
      { jahr: 1993, name: "Kim Chizevsky" },
      { jahr: [1994, 1995], name: "Laura Creavalle" },
      { jahr: 1996, name: "Kim Chizevsky" },
      { jahr: 1997, name: "Yolanda Hughes" },
      { jahr: 1998, name: "Lesa Lewis" },
      { jahr: [1999, 2001], name: "Ondrea Gates" },
      { jahr: [2002, 2003], name: "Yaxeni Oriquen" },
      { jahr: 2004, name: "Iris Kyle" },
      { jahr: 2005, name: "Yaxeni Oriquen" },
      { jahr: [2006, 2007], name: "Iris Kyle" },
      { jahr: 2008, name: "Yaxeni Oriquen" },
      { jahr: [2009, 2011], name: "Iris Kyle" },
      { jahr: 2012, name: "Yaxeni Oriquen" },
      { jahr: 2013, name: "Iris Kyle" }
    ]
  }
];

// Reihen aus den Serien aufklappen: aus { jahr: [1970, 1975] } werden sechs
// Einträge. Neueste zuerst, damit die Tabelle mit dem aktuellen Titel beginnt.
export function siegerReihen(klassen) {
  const reihen = [];

  for (const klasse of klassen) {
    for (const eintrag of klasse.sieger) {
      const [von, bis] = Array.isArray(eintrag.jahr) ? eintrag.jahr : [eintrag.jahr, eintrag.jahr];
      for (let jahr = von; jahr <= bis; jahr += 1) {
        reihen.push({
          jahr,
          klasseId: klasse.id,
          klasse: klasse.name,
          name: eintrag.name,
          hinweis: eintrag.hinweis || ""
        });
      }
    }
  }

  return reihen.sort((a, b) => b.jahr - a.jahr || a.klasse.localeCompare(b.klasse, "de"));
}

// Wer hat wie oft gewonnen — für die Rekordliste unter der Tabelle.
export function titelRangliste(klassen, klasseId) {
  const zaehler = new Map();

  for (const reihe of siegerReihen(klassen)) {
    if (klasseId && reihe.klasseId !== klasseId) continue;
    zaehler.set(reihe.name, (zaehler.get(reihe.name) || 0) + 1);
  }

  return [...zaehler.entries()]
    .map(([name, titel]) => ({ name, titel }))
    .sort((a, b) => b.titel - a.titel || a.name.localeCompare(b.name, "de"));
}
