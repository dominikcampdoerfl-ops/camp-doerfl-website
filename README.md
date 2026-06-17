# Camp Dörfl Website

Moderne statische Website für Camp Dörfl mit klaren Routes, wiederverwendbaren Komponenten, variablem Designsystem und professionellen deutschen Texten.

## Stack

- Statische Website ohne Baukastensystem
- Build per Node-Skript in `dist/`
- Kontaktformular aktuell ueber FormSubmit
- Ziel-Setup fuer den Livebetrieb: GitHub + Cloudflare Pages + unabhaengiger Domain-Registrar

## Befehle

```bash
npm run build
npm run dev
npm run preview
```

`npm run build` erzeugt die fertige Website in `dist/`.  
`npm run dev` startet einen lokalen Watch-Server mit automatischem Rebuild.  
`npm run preview` startet den statischen Vorschau-Server fuer den zuletzt gebauten Stand.

## Routes

- `/`
- `/app/`
- `/personal-coaching/`
- `/firmenfitness/`
- `/events/`
- `/partner/`
- `/executive-performance/`
- `/erfolge-im-team/`
- `/ueber-dominik/`
- `/kontakt/`
- `/impressum/`
- `/datenschutz/`
- `/cookies/`
- `/werbung-partnerlinks/`
- `/barrierefreiheit/`

## Deployment

Empfohlener Workflow:

1. Repository nach GitHub spiegeln.
2. Cloudflare Pages mit dem GitHub-Repository verbinden.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Domain spaeter ueber `www.campdoerfl.de` anbinden.

Die komplette Jimdo-zu-Cloudflare-Migrationsanleitung liegt in [docs/jimdo-cloudflare-migration.md](docs/jimdo-cloudflare-migration.md).

## Qualitaetssicherung

Eine vorbereitete GitHub-Action prueft bei Pushes und Pull Requests automatisch den Build:

- `.github/workflows/build.yml`

## Akzentfarbe ändern

Die zentrale Farbwelt liegt in `src/styles.css` in den CSS-Variablen `--accent`, `--accent-strong`, `--accent-green`, `--accent-gold` und `--accent-warm`.
