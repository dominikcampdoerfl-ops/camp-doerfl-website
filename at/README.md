# campdoerfl.at — Online Coaching Österreich

Eine eigenständige Seite unter eigener Domain. Sie liegt im selben Repository wie
campdoerfl.de, teilt sich mit ihr aber nur die Dateien unter `assets/`
(Schriften und Fotos, ausschließlich lesend). Alles andere ist getrennt: eigener
Build, eigenes Stylesheet, eigenes Skript, eigener Worker, eigenes
Ausgabeverzeichnis.

## Befehle

```bash
npm run at:build      # baut nach dist-at/
npm run at:dev        # baut bei jeder Änderung neu, Vorschau auf :4180
npm run at:preview    # nur ausliefern, was gebaut ist
npm run at:test       # baut und prüft (HTML, Bilder, Kontrast, Konsole)
npm run at:deploy     # baut und veröffentlicht als Cloudflare Worker
npm run at:live       # prüft den veröffentlichten Stand unter campdoerfl.at
```

`at:dev` ist der Arbeitsmodus, `at:test` gehört vor jedes Deploy, `at:live`
danach.

## Warum die deutsche Seite davon nichts merkt

| | campdoerfl.de | campdoerfl.at |
|---|---|---|
| Quelle | `src/` | `at/` |
| Ausgabe | `dist/` | `dist-at/` |
| Worker | `wrangler.toml` | `wrangler.at.toml` |
| Stylesheet | `src/styles.css` + `mobile-overrides.css` | `at/styles.css` |
| Skript | `src/main.js` | `at/main.js` |

`src/build.mjs` kopiert nur Dateien nach `dist/`, die im eigenen Ergebnis
vorkommen — ein neues Verzeichnis daneben kann dort nicht landen. Umgekehrt
liest `at/build.mjs` nichts aus `src/`; `at/pruefen.mjs` stellt das bei jedem
Lauf fest.

An bestehenden Dateien wurden nur ergänzt: `package.json` (sechs neue Skripte),
`.gitignore` (`dist-at/`, `.at-bilder/`) und `.claude/launch.json` (ein
Vorschau-Eintrag).

## Aufbau

| Datei | Inhalt |
|---|---|
| `marke.mjs` | Sämtliche Texte, Zahlen, Bildzuordnungen, Bewertungen, FAQ |
| `seite.mjs` | Das Markup der einen Seite, Kopfdaten, strukturierte Daten |
| `styles.css` | Designsystem und Layout |
| `main.js` | Kopfzeile, Schublade, Held-Scroll, Auftauchen, Stimmen, Formular |
| `bilder.mjs` | AVIF/WebP in mehreren Breiten aus `assets/images/` |
| `build.mjs` | Baut `dist-at/` samt Worker, Sitemap, robots.txt |
| `server.mjs` | Vorschau auf `:4180`, mit den Kopfzeilen des Workers |
| `dev.mjs` | Watch-Betrieb |
| `pruefen.mjs` | Prüfungen (siehe unten) |
| `oeffentlich/` | Dateien, die unverändert in der Wurzel landen (siehe `LIESMICH.md`) |

Inhalt und Form sind getrennt: Wer einen Text ändert, fasst nur `marke.mjs` an.

## Bilder

Die fünf App-Ansichten liegen unter `assets/images/at/` (`app-plan.jpg`,
`app-ernaehrung.jpg`, `app-training.jpg`, `app-fortschritt.jpg`,
`app-longevity.jpg`). Sie sind auf ein gemeinsames Verhältnis von 1320 × 1995
beschnitten — oben bündig, unten gekürzt. Nur so steht die Reihe auf einer
Linie. Ein Austausch: neue Datei unter demselben Namen ablegen, `npm run at:build`
kümmert sich um Zuschnitt, Formate und die Cache-Kennung.


`at/bilder.mjs` erzeugt aus den vorhandenen Originalen AVIF- und WebP-Fassungen
in mehreren Breiten. Der Dateiname trägt eine Kennung aus dem Bildinhalt und den
Zuschnittwerten — ein ausgetauschtes Foto bekommt dadurch automatisch eine neue
Adresse und läuft nicht in die Jahres-Cache-Regel für `/assets/`.

Ergebnisse liegen zusätzlich in `.at-bilder/` (nicht im Repo). Der erste Build
rechnet rund zehn Sekunden, jeder weitere kopiert nur.

**Kein Querformat für Hochformat-Fotos.** Untereinander (bis 860 px) standen
die Säulen, die Zielgruppen und das Radbild anfangs in 4:3- bzw. 3:2-Rahmen.
Die Vorlagen sind aber hochformatig (0,67–0,75) — `object-fit: cover` hat ihnen
dort die Köpfe abgeschnitten. Alle diese Flächen stehen jetzt auf 4:5, und der
Ausschnitt sitzt mit `object-position: 50% 12%` bewusst oben: Was wegfällt,
fällt unten weg, wo ohnehin die Beschriftung darüberliegt.

`at/pruefen.mjs` misst das seither bei 390, 768 und 1440 px nach: Schneidet
ein Rahmen mehr als 8 % oben vom Motiv ab, schlägt der Lauf fehl.

Hochgerechnet wird nie: Breiten über der Vorlage fallen weg, dafür kommt die
Originalbreite dazu. Wo eine hoch aufgelöste Fassung unter
`assets/images/original/` liegt, wird sie als Quelle benutzt.

## Was `npm run at:test` prüft

Statisch: genau eine H1 und ihr Inhalt, Titel, Description, Canonical, hreflang,
OpenGraph, Reihenfolge der Überschriftenebenen, `alt`/`width`/`height`/`sizes`
an jedem Bild, Existenz jeder referenzierten Datei, strukturierte Daten
(vorhandene Typen, keine erfundenen Bewertungen, FAQ deckungsgleich mit dem
Markup), Formular-Rückfall ohne JavaScript, CSP ohne `unsafe-inline` mit Hash
für jedes eingebettete Skript, Sitemap, robots.txt, Trennung von `src/`.

Im echten Browser: ob nach dem Scrollen noch etwas unsichtbar bleibt, der
Kontrast jedes Textes auf seinem tatsächlichen Untergrund, der ruhige Modus
(`prefers-reduced-motion`) und Fehler in der Konsole. Ohne Chrome entfällt nur
dieser zweite Teil.

## Deploy

Seit dem 08.09.2026 ist die Seite live: <https://campdoerfl.at/>.

```bash
npm run at:test && npm run at:deploy && npm run at:live
```

Die Domain hängt als Custom Domain in `wrangler.at.toml` am Worker
`camp-doerfl-at`; DNS-Eintrag und Zertifikat legt Cloudflare beim Deploy selbst
an, im Dashboard ist nichts zu tun. `www.campdoerfl.at` zeigt ebenfalls auf den
Worker, der von dort auf die Hauptadresse umleitet.

**Zwei Dinge, die beim ersten Deploy aufgefallen sind:**

1. `html_handling = "none"` und `not_found_handling = "none"` in
   `wrangler.at.toml` sind nicht optional. Ohne sie beantwortet Cloudflares
   Asset-Server die Anfrage nach `/index.html` selbst mit einer 307 auf `/` —
   und weil der Worker genau diese Datei für `/` holt, reicht er die Umleitung
   weiter. Die Startseite lief dadurch in eine Endlosschleife. Umleitungen und
   die 404-Seite gehören ausschließlich in den Worker.
2. Der Worker ist zusätzlich unter `camp-doerfl-at.dominik-campdoerfl.workers.dev`
   erreichbar. Dort setzt er `X-Robots-Tag: noindex, nofollow`, damit dieselbe
   Seite nicht zweimal im Index landet. Zum Testen bleibt die Adresse nutzbar.

`npm run at:live` prüft danach die echten Routen, die Kopfzeilen, den
Zwischenspeicher — und ob das ausgelieferte HTML wirklich dem Stand in
`dist-at/` entspricht. Es löst dafür absichtlich über 1.1.1.1 auf, weil ein
frisch angelegter DNS-Eintrag sonst am Negativ-Cache des eigenen Rechners
hängt.

## Dateien, die genau so ausgeliefert werden müssen

Alles in `at/oeffentlich/` kopiert der Build unverändert in die Wurzel von
`dist-at/`, also nach `https://campdoerfl.at/<dateiname>`. Kein Umbenennen,
keine Kennung im Dateinamen — der Name ist Teil der Prüfung des jeweiligen
Dienstes.

Aktuell liegt dort die Bestätigungsdatei der **Google Search Console**
(`google1ee7b5fc9d10d60f.html`). Dieselbe Kennung liegt auf campdoerfl.de unter
`public/`: Google bindet die HTML-Bestätigung an das Konto, nicht an die
einzelne Domain. Search Console prüft die Datei regelmäßig nach — verschwindet
sie, ist der Zugriff auf die Property weg. `npm run at:test` vergleicht Vorlage
und Build zeichengenau, `npm run at:live` zusätzlich das, was live ankommt.

## Unterseiten (at/seiten/)

Die AT-Seite ist nicht mehr nur eine Seite. Alles in `at/seiten/` wird zu einer
eigenen Route:

    bodybuilding-wettkaempfe-2026.html  →  /bodybuilding-wettkaempfe-2026/

Diese Seiten bringen Markup, CSS und JavaScript vollständig selbst mit — anders
als die Startseite, die aus `marke.mjs` entsteht. Der Build lässt ihren Inhalt
in Ruhe und ergänzt nur vier Dinge, jedes davon mechanisch und nachprüfbar:

1. **Eingebettete Schriften austauschen.** `data:font`-Angaben werden gegen die
   Dateien unter `assets/fonts/` getauscht — aber nur, wenn sie **byte-identisch**
   sind. Ist sie es nicht, bleibt die Schrift eingebettet und der Build sagt es.
   Das sparte bei der ersten Seite rund 200 KB pro Aufruf und hält `font-src` in
   der Richtlinie auf `'self'`.
2. **Eingebettete Bilder auslagern.** Aus `data:image` werden Dateien unter
   `/assets/at/` mit Inhaltskennung, ein Jahr lang cachebar.
3. **CSP-Hashes.** Jeder eingebettete `<style>`- und `<script>`-Block wird
   gehasht und eingetragen. **Ohne das blockiert die eigene CSP das eigene
   Markup** — und zwar erst live, nicht in der Vorschau, weil der Vorschau-Server
   die Kopfzeilen erst seit `server/kopfzeilen.json` mitsetzt.
4. **Sitemap.** Die Route kommt hinein, sofern die Seite nicht auf `noindex` steht.

Die Seite selbst muss mitbringen: `<title>`, `<meta name="description">`, genau
eine `<h1>`, `lang="de-AT"` und ein `<link rel="canonical">` auf die eigene
Adresse **mit** Schrägstrich am Ende. `npm run at:test` prüft das alles, dazu:
keine übrig gebliebenen `data:`-Ressourcen, jede verwiesene Datei existiert, und
die Startseite verweist auf die Seite (`unterseiten` in `marke.mjs` → Fuß).
Eine Seite, die nur in der Sitemap steht, gilt als verwaist.

**Adressform:** Seit den Unterseiten ist die Form **mit** Schrägstrich am Ende
die kanonische — wie auf campdoerfl.de. Der Worker leitet `/x` auf `/x/` um und
`/x/index.html` ebenfalls. Vorher warf er Schrägstriche weg; das war für eine
einzige Seite richtig und hätte jede Unterseite unerreichbar gemacht.

## Suchbegriffe

Die Seite ist auf vier Begriffe ausgerichtet. Sie stehen als Liste in
`at/marke.mjs` → `suchbegriffe` — nicht, um irgendwo als Meta-Keywords
ausgegeben zu werden (die liest keine Suchmaschine mehr), sondern als
Prüfmaßstab.

| Begriff | Wo er greift |
|---|---|
| Online Coaching | H1, Titel, Nav, H2 im Angebot, FAQ |
| Fitness Online Coaching | Titel, FAQ „Funktioniert Fitness Online Coaching wirklich?", `Service.name` |
| Fitness Coaching | Meta-Beschreibung, Vorspann der Säulen, FAQ, `knowsAbout` |
| Personal Trainer | Meta-Beschreibung, H2 im Österreich-Band, zwei FAQ-Antworten, `Person.jobTitle` |

**„Personal Trainer Österreich" wird ehrlich beantwortet, nicht vorgetäuscht.**
Wer so sucht, meint meistens jemanden vor Ort. Die Seite sagt an zwei Stellen
klar, dass es keine Standorte in Österreich gibt, und macht daraus das Argument:
Abseits von Wien und Graz findet man ohnehin keinen. Eine Seite, die
Vor-Ort-Termine andeutet, holt Besucher, die sofort wieder abspringen — das
schadet der Position mehr, als der Begriff einbringt.

`npm run at:test` misst zweierlei: Jeder Begriff muss vorkommen, und keiner darf
mehr als 3 % des Textes ausmachen. Beide Richtungen sind gegengetestet — ein
fehlender Begriff und ein übertrieben oft wiederholter lassen den Lauf
fehlschlagen. Titel (max. 60 Zeichen) und Beschreibung (120–158 Zeichen) werden
gegen `marke.titel` und `marke.beschreibung` geprüft, nicht gegen eine hier
festgenagelte Zeichenkette.

## hreflang: Österreich und Schweiz

campdoerfl.at und campdoerfl.ch sind zwei fast gleiche deutschsprachige Seiten.
Ohne hreflang hält Google sie für Dubletten und sucht sich selbst eine aus —
dann rankt in Österreich womöglich die Schweizer Fassung mit Franken-Preisen.

Seit dem 09.09.2026 ist die Gruppe geschlossen: `at/marke.mjs` nennt de-AT und
de-CH, `ch/marke.mjs` nennt dieselben zwei. **Beide Richtungen müssen
veröffentlicht sein** — nennt nur eine Seite die andere, wertet Google die
Angabe nicht aus. Eine Änderung an der Gruppe heißt deshalb immer: beide
deployen.

Kein x-default. Der ist für eine allgemeine Ausweichfassung gedacht; beide
Seiten sind auf ein Land gemünzt, keine ist die Ausweichfassung der anderen.

`ch/pruefen.mjs` schlägt die Gegenseite im selben Repository nach: Nennt die
Schweizer Seite die österreichische, ohne genannt zu werden, schlägt der Lauf
fehl. Auch das ist gegengetestet.

## Google Search Console

Die Bestätigungsdatei liegt in `at/oeffentlich/` (siehe oben). Zwei Dinge sind
dabei leicht zu übersehen:

**Symbole müssen PNG oder ICO sein.** Google unterstützt für Favicons nur ICO,
PNG, JPEG, SVG, GIF und BMP — kein WebP. Solange die Seite nur ein WebP-Symbol
anbot, stand in der Search Console und im Suchergebnis die graue Weltkugel statt
des Logos. Der Build erzeugt deshalb aus `camp-doerfl-logo.png` ein echtes
`/favicon.ico` (16/32/48) und PNGs in 48/96/180/192 px; der Rand um das Logo
fällt dabei weg, weil bei 16 px jeder Bildpunkt zählt. Auch das `logo` in den
strukturierten Daten zeigt auf das PNG. `npm run at:test` lässt eine reine
WebP-Lösung nicht mehr durch.

**Cloudflare schreibt in die robots.txt.** Was live ausgeliefert wird, ist
nicht das, was der Build erzeugt: Cloudflare stellt einen eigenen, verwalteten
Block voran („Managed robots.txt" / AI Crawl Control) und sperrt darin mehrere
KI-Crawler aus — unter anderem GPTBot, ClaudeBot und Google-Extended.
`Content-Signal: search=yes` erlaubt die Suchindexierung ausdrücklich, und
`Google-Extended` betrifft nur KI-Training, nicht die Google-Suche. Die
Indexierung ist davon also nicht berührt.

Weil dieser Block ohne Zutun umspringen kann, wertet `npm run at:live` die
**ausgelieferte** robots.txt aus: Sperrt eine für Googlebot geltende Gruppe die
ganze Seite, fehlt der Sitemap-Verweis oder steht das Content-Signal nicht auf
`search=yes`, schlägt der Lauf fehl.

Umschalten lässt sich der Block im Cloudflare-Dashboard unter der Domain →
AI Crawl Control. Wer in KI-Antworten (ChatGPT, Perplexity) auftauchen möchte,
muss ihn dort lockern — das ist eine Entscheidung, kein Fehler.

**Die Property muss zur kanonischen Adresse passen.** Diese Seite
kanonisiert auf den Apex `https://campdoerfl.at/`; `www` leitet mit 301 dorthin
um. Eine URL-Präfix-Property auf `https://www.campdoerfl.at/` sammelt deshalb so
gut wie keine Daten. Richtig ist entweder die Präfix-Property
`https://campdoerfl.at/` oder — besser — eine **Domain-Property** `campdoerfl.at`
per DNS-TXT, die Apex, www und beide Protokolle abdeckt.

Achtung: Bei campdoerfl.de ist es umgekehrt, dort ist `www` die kanonische
Adresse (`site.url` in `src/data.mjs`). Die beiden Domains lassen sich hier
nicht analog behandeln.

## Erfolge im Team

Der Abschnitt `#erfolge` übernimmt echte Belege von campdoerfl.de — nichts
davon ist für diese Seite erfunden:

- die Gesamtbilanz der betreuten Athletinnen und Athleten (129 Platzierungen,
  49 Siege, 99 Podiumsplätze, 7 Wettkampfjahre) aus
  `/erfolge-im-team/`
- die Geschichte von **Günter Preis** (`/erfolge-im-team/guenter-preis/`) mit
  Foto, drei belegten Eckdaten und Verweis auf die vollständige Fassung

Zwei Dinge sind dabei bewusst gesetzt:

1. **Herkunft der Zahlen wird genannt.** Die Fußnote sagt „nicht auf Österreich
   beschränkt" — es sind Erfolge aus dem Coaching insgesamt. Alles andere wäre
   eine Behauptung, die die Seite nicht halten kann.
2. **Der gesundheitliche Teil bleibt knapp und trägt denselben Hinweis wie die
   Hauptseite**: Einzelfall, keine ärztliche Beratung, Diagnostik und
   Medikamente in ärztlicher Hand. Die ausführliche Fassung steht auf
   campdoerfl.de, nicht hier.

Die Liste dort wächst jede Saison. `npm run at:test` liest deshalb die Summen
aus `dist/erfolge-im-team/index.html` und hält sie gegen `erfolge.zahlen` in
`at/marke.mjs` — laufen sie auseinander, schlägt der Lauf fehl. Dafür muss im
Repo einmal `npm run build` (die .de-Seite) gelaufen sein; fehlt der Build,
weist der Lauf darauf hin, statt stillschweigend durchzugehen.
`npm run at:live` prüft zusätzlich, dass beide Verweise nach campdoerfl.de
erreichbar sind.

## Preise

150 € (1 Monat), 390 € (3 Monate), 720 € (6 Monate) stehen in `at/marke.mjs`
unter `laufzeiten`. Der Monatswert daneben ist gerechnet, nicht gepflegt.
Ein Prüflauf hält Seite, FAQ-Antwort und strukturierte Daten zusammen — eine
Preisänderung an einer Stelle genügt also, aber `npm run at:test` muss danach
laufen.

## Offene Punkte

- **Umsatzsteuer bei den Preisen.** Auf der Seite stehen nur die Beträge. Ob
  150/390/720 € Brutto- oder Nettopreise sind, ist hier nicht hinterlegt —
  gegenüber Verbrauchern in Österreich muss der Gesamtpreis inklusive
  Umsatzsteuer ausgewiesen sein (PAngG). Sobald das feststeht, gehört ein Zusatz
  wie „inkl. USt." an `preise__fuss` in `at/seite.mjs`. Auch die strukturierten
  Daten lassen die Steuerangabe bis dahin bewusst weg.
- **Rechtstexte.** Impressum und Datenschutz verweisen auf campdoerfl.de. Für
  eine eigene .at-Domain gehört beides geprüft (Offenlegung nach § 25 MedienG,
  ECG). Adressen stehen in `at/marke.mjs`.
- **AGB.** Es gibt keine — deshalb steht auch kein Link darauf im Fuß.
- **YouTube.** Im Bestand ist kein Kanal hinterlegt; der Fuß führt Instagram,
  LinkedIn und den App Store.
- **Formular.** Der Weg über FormSubmit ist derselbe wie auf campdoerfl.de.
  Einmal von <https://campdoerfl.at/#start> aus absenden und prüfen, ob die Mail
  ankommt — das ist der einzige Punkt, den kein Prüflauf abdecken kann, ohne
  eine echte Anfrage auszulösen.
- **Weitere Länder.** `sprachfassungen` in `at/marke.mjs` ist auf `de-DE` und
  `de-CH` vorbereitet. Eintragen erst, wenn dort wirklich eine eigenständige
  Fassung dieser Seite steht — sonst zeigt hreflang ins Leere.
