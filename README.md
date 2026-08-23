# Camp Dörfl Website

Moderne statische Website für Camp Dörfl mit klaren Routes, wiederverwendbaren Komponenten, variablem Designsystem und professionellen deutschen Texten.

## Stack

- Statische Website ohne Baukastensystem
- Build per Node-Skript in `dist/`
- Kontaktformular aktuell ueber FormSubmit
- Ziel-Setup fuer den Livebetrieb: Cloudflare Workers + eigene Domain

## Befehle

```bash
npm run build
npm run dev
npm run preview
npm run cf:deploy
npm run cf:deploy:dry-run
```

`npm run build` erzeugt die fertige Website in `dist/`.  
`npm run dev` startet einen lokalen Watch-Server mit automatischem Rebuild.  
`npm run preview` startet den statischen Vorschau-Server fuer den zuletzt gebauten Stand.
`npm run cf:deploy` baut den aktuellen Stand und deployed ihn als Cloudflare Worker.
`npm run cf:deploy:dry-run` prueft den Cloudflare-Deploy lokal gegen den Build-Artefaktstand.

## Lesbarkeit prüfen

```bash
npm run kontrast
npm run kontrast -- /impressum/ /app/
```

Öffnet jede gebaute Seite im installierten Chrome und misst für jeden sichtbaren
Text den echten Kontrast zu der Fläche, die tatsächlich hinter ihm liegt. Unter
3:1 gilt der Text als unlesbar und der Lauf schlägt fehl.

Warum ein echter Browser: Die Farbe eines Textes entsteht erst aus der Kaskade
über zwei große CSS-Dateien mit Spezifitäten, `!important`-Schichten und
Variablen. Genau daran sind weiße Überschriften auf weißen Karten
vorbeigerutscht — jede Regel für sich war plausibel, erst das Zusammenspiel
ergab unsichtbaren Text. Der Prüfer fand auf Anhieb 21 solcher Stellen auf fünf
Seiten, darunter Überschriften mit einem Kontrast von 1,02:1.

Nicht geprüft wird Text über Fotos und Farbverläufen: Dort ist die
Hintergrundfarbe nicht eindeutig bestimmbar, und der Prüfer meldet lieber nichts
als etwas Falsches. Diese Stellen bleiben Sache des Auges.

Der Lauf braucht Chrome (Pfad notfalls über `CHROME_PATH`) und startet den
Vorschau-Server selbst. Er gehört vor jedes Deploy, das an Farben, Flächen oder
Komponenten gerührt hat.

## Bilder

```bash
npm run images:pruefen
npm run images
```

`images:pruefen` zeigt nur an, was zu tun wäre. `npm run images` macht zwei Dinge:

1. **Umwandeln.** Neue PNG- und JPEG-Bilder, die im Quelltext referenziert sind,
   werden nach WebP gewandelt (lange Kante höchstens 1800 px, Qualität 80) und
   die Verweise in `src/` nachgezogen. Bereits vorhandene WebP-Dateien, die zu
   groß sind, werden nachträglich gestrafft; ihre Vorlage in Originalauflösung
   wandert nach `assets/images/original/`.
2. **Maße eintragen.** In jedes `<img>` mit festem Dateinamen kommen `width` und
   `height` der echten Pixelmaße. Zusammen mit `img { height: auto }` reserviert
   der Browser den Platz, bevor das Bild da ist — sonst springt das Layout.

Bewusst nicht angefasst werden die `*-social.*`-Bilder (das og:image; WhatsApp
und LinkedIn zeigen WebP-Vorschauen unzuverlässig) und `camp-doerfl-logo.png`
(strukturierte Daten, Apple-Touch-Icon, Pressedownload).

Beide Schritte lassen sich gefahrlos wiederholen: Was schon gewandelt oder
eingetragen ist, wird übersprungen. Nach jedem Schwung neuer Bilder einmal
laufen lassen — die Originale bleiben als Vorlage erhalten und werden nicht
mit ausgeliefert, weil der Build nur referenzierte Dateien nach `dist/` kopiert.

## Member Area — die App im Browser

Unter `/member/` läuft der komplette Web-Export der Camp Dörfl App. Über die
Schaltfläche **Member** in der Navigation öffnet sich das Login-Fenster; nach der
Anmeldung übernimmt die App die Sitzung und startet direkt im Member- bzw.
Coach-Bereich. Es sind dieselben Zugangsdaten, dasselbe Backend und dieselben
Daten wie auf dem Handy.

Der Export liegt im Ordner `member-app/` und ist bewusst **nicht im Git** — er
entsteht bei jedem App-Release neu und ist rund 70 MB groß. `npm run build`
kopiert ihn nach `dist/member/`. Fehlt der Ordner, baut die Website weiterhin
durch und meldet den fehlenden Stand in der Konsole.

Nach jedem App-Release im App-Repo (`~/Desktop/camp-doerfl-test`):

```bash
npm run export:web
```

Danach hier deployen:

```bash
npm run cf:deploy
```

Technische Details stehen gesammelt in [`src/member-area.mjs`](./src/member-area.mjs):
Pfadauflösung, eigene Sicherheitsrichtlinie für `/member/` und die Backend-Adresse,
die auch das Login-Fenster der Marketingseiten benutzt.

## Routes

- `/`
- `/app/`
- `/personal-trainer-nürnberg/`
- `/firmenfitness/`
- `/events/`
- `/partner/`
- `/executive-performance/`
- `/erfolge-im-team/`
- `/ueber-dominik/`
- `/kontakt/`
- `/impressum/`
- `/datenschutz/`
- `/datenschutzformular-app/`
- `/cookies/`
- `/werbung-partnerlinks/`
- `/barrierefreiheit/`

## Deployment

Empfohlener Workflow:

1. Einmalig bei Cloudflare CLI anmelden: `npx wrangler login`
2. Aktuellen Stand deployen: `npm run cf:deploy`
3. Die oeffentliche `workers.dev`-URL pruefen.
4. Danach im Cloudflare-Dashboard unter `Workers & Pages -> camp-doerfl-site -> Settings -> Domains & Routes` die gewuenschte Domain verbinden.
5. Falls auf derselben Subdomain noch ein alter DNS-Eintrag oder eine andere Site haengt, diesen vorher bereinigen.

Hinweis: Cloudflare Workers akzeptiert pro statischem Asset maximal 25 MiB. Uebergrosse Dateien werden beim Build bewusst nicht in den Deploy-Output uebernommen.

Die komplette Jimdo-zu-Cloudflare-Migrationsanleitung liegt in [docs/jimdo-cloudflare-migration.md](docs/jimdo-cloudflare-migration.md).

## Security

Der Build erzeugt `/.well-known/security.txt`, erzwingt im Cloudflare-Worker HTTPS fuer die Produktivdomain und setzt zentrale Security-Header.

Die begleitende Cloudflare- und DNS-Checkliste liegt in [docs/cloudflare-security-hardening.md](docs/cloudflare-security-hardening.md).

## Qualitaetssicherung

Eine vorbereitete GitHub-Action prueft bei Pushes und Pull Requests automatisch den Build:

- `.github/workflows/build.yml`

## Akzentfarbe ändern

Die zentrale Farbwelt liegt in `src/styles.css` in den CSS-Variablen `--accent`, `--accent-strong`, `--accent-green`, `--accent-gold` und `--accent-warm`.
