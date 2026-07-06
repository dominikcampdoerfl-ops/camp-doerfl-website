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
