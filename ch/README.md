# campdoerfl.ch — Online Coaching Schweiz

Eine eigenständige Seite unter eigener Domain. Sie liegt im selben Repository wie
campdoerfl.de und campdoerfl.at, teilt sich mit beiden aber nur die Dateien unter
`assets/` (Schriften und Fotos, ausschliesslich lesend). Alles andere ist getrennt:
eigener Build, eigenes Stylesheet, eigenes Skript, eigener Worker, eigenes
Ausgabeverzeichnis.

Sie ist **keine Übersetzung der österreichischen Seite**. Aufbau, Texte, Preisteil
und Bildauswahl sind für den Schweizer Markt eigenständig gemacht.

## Unterseiten (ch/seiten/)

Alles in `ch/seiten/` wird zu einer eigenen Route:

    bodybuilding-wettkaempfe-2026.html  →  /bodybuilding-wettkaempfe-2026/

Diese Seiten bringen Markup, CSS und JavaScript selbst mit. Der Build lässt den
Inhalt in Ruhe und ergänzt nur: byte-identische `data:font` gegen
`assets/fonts/` tauschen, `data:image` nach `/assets/ch/` auslagern, CSP-Hashes
für jeden eingebetteten `<style>`- und `<script>`-Block sammeln (ohne die
blockiert die eigene Richtlinie das eigene Markup — und zwar erst live), Route
in die Sitemap eintragen.

Adressform ist die **mit** Schrägstrich am Ende; der Worker leitet `/x` auf
`/x/` um. `npm run ch:test` prüft pro Unterseite Titel, Beschreibung, genau eine
H1, Canonical, `lang="de-CH"`, keine übrigen `data:`-Ressourcen, alle
verwiesenen Dateien und den Verweis aus dem Fuss der Startseite.

### Der Wettkampfkalender ist abgeleitet, nicht handgeschrieben

`ch/seiten/bodybuilding-wettkaempfe-2026.html` entsteht aus der
österreichischen Fassung über `scripts/ch-wettkampfkalender.mjs`. Dort stehen
die Schweizer Verbände und Termine; das Skript tauscht Land, Sprache, Domain,
Zeitzone (`Europe/Zurich`), die Landmarke im Kopf und die Schreibweise ohne ß.

**Wer einen Termin ändert, ändert ihn im Skript und lässt es neu laufen** —
Änderungen direkt in der HTML-Datei sind beim nächsten Lauf weg. Recherchestand
und Quellen: `ch/seiten/AUS-AT-ABGELEITET.md`.

## Befehle

```bash
npm run ch:build      # baut nach dist-ch/
npm run ch:dev        # baut bei jeder Änderung neu, Vorschau auf :4190
npm run ch:preview    # nur ausliefern, was gebaut ist
npm run ch:test       # baut und prüft (HTML, Bilder, Kontrast, Konsole, Breiten)
npm run ch:deploy     # baut und veröffentlicht als Cloudflare Worker
npm run ch:live       # prüft den veröffentlichten Stand unter campdoerfl.ch
```

`ch:dev` ist der Arbeitsmodus, `ch:test` gehört vor jedes Deploy, `ch:live` danach.

## Warum die beiden anderen Seiten davon nichts merken

| | campdoerfl.de | campdoerfl.at | campdoerfl.ch |
|---|---|---|---|
| Quelle | `src/` | `at/` | `ch/` |
| Ausgabe | `dist/` | `dist-at/` | `dist-ch/` |
| Worker | `wrangler.toml` | `wrangler.at.toml` | `wrangler.ch.toml` |
| Stylesheet | `src/styles.css` | `at/styles.css` | `ch/styles.css` |
| Skript | `src/main.js` | `at/main.js` | `ch/main.js` |
| Vorschau | :4173 | :4180 | :4190 |

`ch/build.mjs` liest weder aus `src/` noch aus `at/`; `ch/pruefen.mjs` stellt das
bei jedem Lauf fest und prüft zusätzlich, dass kein CH-Build in `dist/` oder
`dist-at/` gelandet ist.

An bestehenden Dateien wurden nur ergänzt: `package.json` (sieben neue Skripte),
`.gitignore` (`dist-ch/`, `.ch-bilder/`) und `.claude/launch.json` (ein
Vorschau-Eintrag). Keine Zeile in `src/` oder `at/` wurde angefasst.

## Aufbau

| Datei | Inhalt |
|---|---|
| `marke.mjs` | Sämtliche Texte, Zahlen, Bildzuordnungen, Bewertungen, FAQ |
| `seite.mjs` | Das Markup der einen Seite, Kopfdaten, strukturierte Daten |
| `styles.css` | Designsystem und Layout |
| `main.js` | Kopfzeile, Schublade, Held-Scroll, Auftauchen, Stimmen, Preisknöpfe, Formular |
| `bilder.mjs` | AVIF/WebP in mehreren Breiten aus `assets/images/` |
| `build.mjs` | Baut `dist-ch/` samt Worker, Sitemap, robots.txt |
| `server.mjs` | Vorschau auf `:4190`, mit den Kopfzeilen des Workers |
| `dev.mjs` | Watch-Betrieb |
| `pruefen.mjs` | Prüfungen (siehe unten) |
| `oeffentlich/` | Dateien, die 1:1 in der Wurzel landen (siehe unten) |

Inhalt und Form sind getrennt: Wer einen Text ändert, fasst nur `marke.mjs` an.

## Schweizer Hochdeutsch

Auf dieser Seite gibt es **kein „ß“**. Überall steht `ss`: regelmässig, gross,
fliesst, Strasse, ausserhalb. `ch/pruefen.mjs` bricht ab, sobald im gebauten HTML
ein „ß“ auftaucht, und meldet zusätzlich die üblichen Verdächtigen
(`regelmäßig`, `größ…`, `Straße`, `außer`, `heiß`, `maßgeschneidert`).

Keine Dialektwörter. Professionelles Schweizer Hochdeutsch.

## Die Schweiz auf dieser Seite

Sie ist Sachinformation, kein Dekor:

- **Die Flagge markiert den Markt, sie schmückt nicht.** Sie steht genau
  zweimal: in der Kopfzeile neben `CH` und in der Schublade. 16 px, kein
  Schlagschatten. `ch/pruefen.mjs` lässt höchstens zwei Vorkommen durch.
- **Quadratisch.** Die Schweizer Flagge ist kein Rechteck. Die Kreuzarme sind je
  ein Sechstel länger als breit (Armbreite 6, Armlänge 7), das Kreuz misst damit
  20 × 20 in einem Feld von 32 × 32. Der Prüflauf verlangt den viewBox
  `0 0 32 32`.
- **Schweizer Rot höchstens zweimal aus dem Stylesheet.** Zurzeit genau ein
  Einsatz von `var(--rot)`: die Haarlinie vor „100 % online. Persönlich
  begleitet.“ Das Rot der Flagge steckt im SVG und zählt nicht mit. Der Prüflauf
  zählt nach.
- **Kein Klischee.** Matterhorn, Edelweiss, Schokolade, Uhrwerk und
  Alpenpanorama sind im Prüflauf gesperrt.
- **Der Umriss** im Schweiz-Abschnitt und im Abschluss ist aus einem groben
  Grenzverlauf gerechnet (Längen-/Breitengrade, flächentreu auf 46,82°
  projiziert) — Dekoration, keine Landkarte, ohne Ortsmarken.
- **Keine Standorte.** Zürich, Bern, Basel, Luzern, St. Gallen, Winterthur,
  Lausanne und Genf sind Orte, an denen betreute Menschen leben. Die Seite sagt
  das ausdrücklich; die strukturierten Daten führen `Service` mit
  `areaServed: Schweiz` und bewusst **kein** `LocalBusiness` und keine Adresse.
  Der Prüflauf lässt beides nicht durch.

## Erfolge im Team

Unter den Google-Bewertungen steht ein eigener Abschnitt (`#erfolge`, heller
Grund) mit drei Bestandteilen:

1. **Vier Kennzahlen** — 129 Platzierungen seit 2019, 49 erste Plätze,
   99 Podestplätze, eine IFBB Pro Card. Sie sind aus dem Wettkampfbestand auf
   campdoerfl.de (`src/pages.mjs` → `coachSuccessYears`) **ausgezählt und in
   `ch/marke.mjs` abgeschrieben**, Stand 08.09.2026. Die Schweizer Seite greift
   nicht auf `src/` zu, deshalb rechnet sie die Werte nicht selbst nach — ändert
   sich die Liste drüben, gehören sie hier nachgeführt.
2. **Drei Schweizer Ergebnisse** — 1. Platz Schweizer Meisterschaft und
   1. Platz Swiss Cup (beide Bodybuilding bis 80 kg, 2021) sowie 3. Platz
   Mr Universe Switzerland (2025). Sie stammen aus demselben Bestand und sind
   der einzige Grund, warum dieser Abschnitt auf der Schweizer Seite überhaupt
   etwas Schweizerisches behaupten darf.
3. **Vier Vorher-Nachher-Aufnahmen** aus `assets/images/original/
   transformation-*.webp`. Querformat 4:3 — anders als der Rest der Seite, die
   Rahmen sind deshalb ebenfalls 4:3 und schneiden nichts weg.

Der Prüflauf hält den Abschnitt ehrlich: Die Kennzahlen müssen zueinander passen
(Siege ≤ Podestplätze ≤ Platzierungen), jedes Schweizer Ergebnis braucht eine
Jahreszahl, jede Aufnahme einen alt-Text, der sie als Vorher-Nachher-Vergleich
benennt, und im ganzen Abschnitt darf keine der Schweizer Städte stehen — für
keine dieser Personen ist ein Wohnort belegt. Ebenso gesperrt sind „garantiert“
und Formulierungen wie „sicher X kg“ oder „in nur X Wochen“. Die beiden
Pflichthinweise („nicht auf die Schweiz allein“, „Ergebnisse sind individuell“)
werden erzwungen.

## Preise

**159 CHF (1 Monat), 399 CHF (3 Monate), 749 CHF (6 Monate)** stehen in
`ch/marke.mjs` unter `laufzeiten`. Sie sind eine **eigene Festlegung für den
Schweizer Markt, keine Umrechnung** der Euro-Preise von campdoerfl.at — die
beiden Seiten haben ab hier getrennte Preislisten.

Die Währung steht an genau einer Stelle (`waehrung` in `ch/marke.mjs`).
Preisflächen, Formular, FAQ und strukturierte Daten holen sie von dort.

**Der Monatswert ist gerechnet, nicht gepflegt** — und 749 geht nicht durch
sechs auf:

| Laufzeit | Preis | Rechnung | Anzeige |
|---|---|---|---|
| 1 Monat | 159 CHF | 159 / 1 = 159 | `159 CHF pro Monat` |
| 3 Monate | 399 CHF | 399 / 3 = 133 | `133 CHF pro Monat` |
| 6 Monate | 749 CHF | 749 / 6 = 124.83 | `rund 125 CHF pro Monat` |

Ohne das „rund“ würde die Seite 6 × 125 = 750 CHF behaupten, also einen Franken
mehr, als tatsächlich verlangt wird. `monatswert()` erkennt das selbst, und
`ch/pruefen.mjs` prüft beide Richtungen: „rund“ muss stehen, wo die Division
nicht aufgeht — und darf nicht stehen, wo sie aufgeht.

Die beiden Preisantworten in der FAQ und die Monatsstaffel im Preisbereich
werden aus `laufzeiten` **gebaut**, nicht abgeschrieben. Eine Preisänderung an
einer Stelle genügt also; `npm run ch:test` prüft danach, dass Seite, FAQ,
Knopfbeschriftungen und strukturierte Daten dieselben Beträge tragen und
wortgleich formulieren.

**Kein Euro auf dieser Seite.** Der Prüflauf meldet jeden `€`, `&euro;` und jedes
`EUR` im gebauten HTML — ein übriggebliebener Betrag wäre entweder ein
vergessener Rest oder eine zweite Währung auf derselben Seite.

**Camp Dörfl wirbt nicht über den Preis.** „billig“, „günstig“, „Discount“,
„Schnäppchen“, „Rabatt“, „sparen“ und „Angebotspreis“ sind im Prüflauf gesperrt.
Ausgenommen ist allein die vorgegebene Auszeichnung **„Bester Monatspreis“** an
der längsten Laufzeit — sie beschreibt eine Tatsache (rund 125 CHF ist der
niedrigste Monatswert), keine Rabattaktion.

## Bilder

Nur Originalaufnahmen von Dominik. Keine KI-Person, kein Stockmaterial, kein
Eingriff an Gesicht oder Körper — die cinematische Anmutung entsteht
ausschliesslich über Tonwert, Wärme und Sättigung im CSS-Filter.

Die drei App-Ansichten liegen unter `assets/images/ch/` (`app-training.jpg`,
`app-ernaehrung.jpg`, `app-fortschritt.jpg`), auf ein gemeinsames Verhältnis von
1320 × 1995 beschnitten. Sie sind Kopien — die Schweizer Seite greift auf kein
Verzeichnis der österreichischen zu; der Prüflauf verbietet `/assets/at/` im
Markup. Ein Austausch: neue Datei unter demselben Namen ablegen,
`npm run ch:build` kümmert sich um Formate und Cache-Kennung.

`ch/bilder.mjs` erzeugt AVIF- und WebP-Fassungen in mehreren Breiten. Der
Dateiname trägt eine Kennung aus Bildinhalt und Zuschnittwerten — ein
ausgetauschtes Foto bekommt dadurch automatisch eine neue Adresse und läuft nicht
in die Jahres-Cache-Regel für `/assets/`. Ergebnisse liegen zusätzlich in
`.ch-bilder/` (nicht im Repo); der erste Build rechnet rund fünfzehn Sekunden,
jeder weitere kopiert nur.

**Kein Querformat für Hochformat-Fotos.** Die Vorlagen sind hochformatig
(0,66–0,78). In einem 4:3-Rahmen schneidet `object-fit: cover` die Köpfe ab.
Alle diese Flächen stehen auf 3:4 bzw. 4:5, der Ausschnitt sitzt mit
`object-position: 50% 12%` bewusst oben. `ch/pruefen.mjs` misst das bei 1920,
1440, 1280, 768, 430 und 390 px nach: Schneidet ein Rahmen mehr als 8 % oben vom
Motiv ab, schlägt der Lauf fehl.

## Symbole für Tab und Suchergebnis

`ch/bilder.mjs` erzeugt aus dem Logo PNG-Symbole (48/96/180/192 px) und eine
`/favicon.ico` mit 16/32/48 px. **Kein WebP.** Google unterstützt für Favicons
nur ICO, PNG, JPEG, SVG, GIF und BMP — mit einem reinen WebP-Symbol bleibt im
Suchergebnis die graue Weltkugel stehen. Der Prüflauf lässt ein WebP-Symbol
nicht durch und verlangt `/favicon.ico` im Kopf und im Build.

Der Rand um das Logo wird vor dem Verkleinern weggeschnitten: Bei 16 px zählt
jedes Pixel, und ein zentriertes Motiv mit Luft drumherum wird zum Punkt.

## `ch/oeffentlich/`

Was dort liegt, landet beim Build **unverändert** in der Wurzel — also unter
`https://campdoerfl.ch/<dateiname>`. Gedacht für Bestätigungsdateien, deren
Inhalt Byte für Byte stimmen muss (Google Search Console, Bing Webmaster Tools).
`LIESMICH.md` und alles mit führendem Punkt wird nicht kopiert. Der Prüflauf
stellt fest, dass jede Datei ankommt und dabei unverändert bleibt.

## Animation

Vier Momente, mehr nicht:

1. **Held** — gepinnt, langsame Kamerafahrt (`scale` 1,000 → 1,035), Verdunklung
   und Textabgang beim Scrollen. Kicker, Headline (Maskenaufzug), Subheadline,
   CTA erscheinen gestaffelt.
2. **Auftauchen** — Abschnitte blenden beim Eintritt ein, gestaffelt über
   `data-verzug`.
3. **Ablauf** — die Linie füllt sich mit dem Scrollen, die Ziffern wechseln vom
   Umriss zur Füllung.
4. **Parallax** — Radbild und Abschlussbild bewegen sich minimal gegen den Scroll.

Alles läuft über `transform` und `opacity` in **einer** rAF-Schleife. Kein
Typewriter, kein Bounce, kein Glow, keine Partikel. Bei
`prefers-reduced-motion: reduce` steht alles still und ist trotzdem vollständig
sichtbar — der Prüflauf misst das nach.

## Was `npm run ch:test` prüft

Statisch: kein „ß“, genau eine H1 und ihr Inhalt, Titel, Description, Canonical
(nicht auf .de/.at), hreflang, OpenGraph, Reihenfolge der Überschriftenebenen,
`alt`/`width`/`height`/`sizes` an jedem Bild, Existenz jeder referenzierten Datei,
Symbole ohne WebP samt `/favicon.ico`, Dateien aus `ch/oeffentlich/` unverändert,
strukturierte Daten (vorhandene Typen, kein `LocalBusiness`, keine erfundenen
Bewertungen, FAQ deckungsgleich mit dem Markup), alle drei Preise samt
Monatswert, Knopfbeschriftung und Auszeichnung, Vollständigkeit von „Immer
enthalten“, Kennzahlen und Belege im Erfolgs-Abschnitt, keine Preiswerbung, keine erfundenen Ortsangaben bei den Stimmen,
kein Schweiz-Kitsch, Flagge quadratisch und höchstens zweimal, Rot höchstens
zweimal, jeder Anker mit Ziel,
Formular-Rückfall ohne JavaScript, CSP ohne `unsafe-inline` mit Hash für jedes
eingebettete Skript, Sitemap, robots.txt, Trennung von `src/` und `at/`.

Im echten Browser: ob nach dem Scrollen noch etwas unsichtbar bleibt, der
Kontrast jedes Textes auf seinem tatsächlichen Untergrund, waagerechter Überlauf
und Kopfbeschnitt bei 1920/1440/1280/768/430/390 px, Knopfhöhe ≥ 44 px, ob die
Preisknöpfe die Laufzeit ins Formular tragen, der ruhige Modus
(`prefers-reduced-motion`) und Fehler in der Konsole. Ohne Chrome entfällt nur
dieser zweite Teil.

## Deploy

```bash
npm run ch:test && npm run ch:deploy && npm run ch:live
```

Die Domain hängt als Custom Domain in `wrangler.ch.toml` am Worker
`camp-doerfl-ch`; DNS-Eintrag und Zertifikat legt Cloudflare beim Deploy selbst
an, im Dashboard ist nichts zu tun. `www.campdoerfl.ch` zeigt ebenfalls auf den
Worker, der von dort auf die Hauptadresse umleitet.

**Zwei Dinge, die beim ersten Deploy der .at-Seite aufgefallen sind und hier
genauso gelten:**

1. `html_handling = "none"` und `not_found_handling = "none"` in
   `wrangler.ch.toml` sind nicht optional. Ohne sie beantwortet Cloudflares
   Asset-Server die Anfrage nach `/index.html` selbst mit einer 307 auf `/` —
   und weil der Worker genau diese Datei für `/` holt, reicht er die Umleitung
   weiter. Ergebnis wäre eine Endlosschleife auf der Startseite.
2. Der Worker ist zusätzlich unter `camp-doerfl-ch.<konto>.workers.dev`
   erreichbar. Dort setzt er `X-Robots-Tag: noindex, nofollow`, damit dieselbe
   Seite nicht zweimal im Index landet. Zum Testen bleibt die Adresse nutzbar.

`npm run ch:live` prüft danach die echten Routen, die Kopfzeilen, den
Zwischenspeicher — und ob das ausgelieferte HTML wirklich dem Stand in `dist-ch/`
entspricht. Es löst dafür absichtlich über 1.1.1.1 auf, weil ein frisch
angelegter DNS-Eintrag sonst am Negativ-Cache des eigenen Rechners hängt.

## hreflang: erst schliessen, wenn die Seite steht

Die Seite verweist derzeit **nur auf sich selbst** (`de-CH` und `x-default`) —
genau wie campdoerfl.at das heute tut. Zwei Gründe:

1. hreflang wirkt nur beidseitig. Nennt diese Seite die österreichische, ohne
   dass die österreichische diese hier nennt, wertet Google die Angabe nicht aus.
2. campdoerfl.at beansprucht heute `x-default` für sich. Zwei `x-default` in
   einer Gruppe widersprechen einander.

**Sobald campdoerfl.ch erreichbar ist**, wird die Gruppe in einem Zug auf beiden
Seiten geschlossen:

- in `ch/marke.mjs` → `sprachfassungen` die vorbereiteten Zeilen einkommentieren
  (`de-AT` → campdoerfl.at, optional `de-DE`) und festlegen, welche Fassung
  `x-default` trägt,
- in `at/marke.mjs` → `sprachfassungen` **dieselbe** Liste eintragen, dort mit
  `de-AT` als Selbstverweis,
- in beiden `build.mjs` die `xhtml:link`-Zeilen der Sitemap mitziehen,
- danach **beide** Seiten neu ausliefern (`npm run at:deploy`, `npm run ch:deploy`).

Ohne Schritt zwei und vier bleibt die Verknüpfung wirkungslos. Der Prüflauf
verhindert deshalb, dass die CH-Seite einseitig auf eine andere Domain zeigt.

## Offene Punkte

- **Mehrwertsteuer.** Auf der Seite stehen nur die Beträge. Ob 159/399/749 CHF
  Brutto- oder Nettopreise sind, ist hier nicht hinterlegt — nach der
  schweizerischen Preisbekanntgabeverordnung (PBV) muss gegenüber
  Konsumentinnen und Konsumenten der tatsächlich zu zahlende Preis inklusive MWST
  ausgewiesen sein. Sobald das feststeht, gehört ein Zusatz wie „inkl. MWST“ an
  `preise__fuss` in `ch/seite.mjs`; die strukturierten Daten lassen die
  Steuerangabe bis dahin bewusst weg.
- **Zahlungsabwicklung.** Die Seite nennt Frankenbeträge. Ob auch in Franken
  abgerechnet und eingezogen wird, ist hier nicht hinterlegt — das gehört mit dem
  Zahlungsweg zusammen geprüft, bevor die erste Anfrage aus der Schweiz kommt.
- **Rechtstexte.** Impressum und Datenschutz verweisen auf campdoerfl.de. Für
  eine eigene .ch-Domain gehört beides geprüft (DSG/revDSG, Impressumspflicht
  nach UWG Art. 3 Abs. 1 lit. s).
- **AGB.** Es gibt keine — deshalb steht auch kein Link darauf im Fuss, obwohl
  die Vorgabe einen vorsah. Sobald AGB existieren, kommt der Link zu den beiden
  anderen im Fuss dazu.
- **YouTube.** Im Bestand ist kein Kanal hinterlegt, nur einzelne eingebettete
  Videos auf campdoerfl.de. Der Fuss führt deshalb Instagram, LinkedIn und den
  App Store. Sobald ein Kanal existiert, gehört er in `marke.mjs`.
- **Schweizer Kundenstimmen.** Die sechs Zitate sind echte Google-Bewertungen aus
  dem bestehenden Bestand — ohne Ortsangabe, weil für keine ein Ort belegt ist.
  „Zürich“ oder „Bern“ dazuzuschreiben wäre erfunden; der Prüflauf verhindert es.
  Sobald echte Rückmeldungen aus der Schweiz samt Ort vorliegen, kommen sie in
  `bewertungen.stimmen` mit einem Feld `ort` dazu.
- **Kennzahlen der Erfolge.** 129 / 49 / 99 sind der ausgezählte Stand vom
  08.09.2026 aus `src/pages.mjs`. Kommt drüben ein Wettkampfjahr dazu, gehören
  sie in `ch/marke.mjs` → `erfolge.zahlen` nachgeführt. Kein Prüflauf merkt das,
  weil diese Seite die Liste bewusst nicht liest.
- **Google-Wertung.** 5,0 aus 34 Bewertungen ist der Stand aus dem bestehenden
  Bestand (`src/pages.mjs`). Der Wert verändert sich mit der Zeit — vor dem
  ersten Deploy gegen das echte Google-Profil abgleichen.
- **Formular.** Der Weg über FormSubmit ist derselbe wie auf campdoerfl.de.
  Einmal von <https://campdoerfl.ch/#start> aus absenden und prüfen, ob die Mail
  ankommt — das ist der einzige Punkt, den kein Prüflauf abdecken kann, ohne eine
  echte Anfrage auszulösen.
