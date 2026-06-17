# Jimdo zu GitHub + Cloudflare Pages

Stand: 17. Juni 2026

## Zielbild

Camp Doerfl soll kuenftig ohne Jimdo-Baukastensystem laufen:

- Codeverwaltung in GitHub
- Hosting ueber Cloudflare Pages
- Domain bei einem unabhaengigen Registrar
- DNS-Verwaltung ueber Cloudflare
- Mail weiterhin getrennt und unveraendert weiterfuehren

Dieses Repository ist bereits fuer statisches Hosting geeignet:

- Build Command: `npm run build`
- Output Directory: `dist`
- Kanonische Ziel-URL im Projekt: `https://www.campdoerfl.de`

## Warum dieses Setup

- kein Baukasten-Lock-in
- Git-basierter sauberer Workflow
- guenstige bis kostenlose Auslieferung fuer statische Seiten
- Vorschau-Deployments und Rollbacks moeglich
- langfristig besser wartbar als Jimdo

## Aktueller DNS-Snapshot

Die folgenden Werte wurden am 17. Juni 2026 geprueft und dienen als Arbeitsgrundlage fuer den Umzug.

### Nameserver

- `ns13.jimdo.com`
- `ns14.jimdo.com`

### Website-Ziele

- `campdoerfl.de` A `162.159.129.70`
- `campdoerfl.de` A `162.159.128.70`
- `www.campdoerfl.de` A `162.159.129.70`
- `www.campdoerfl.de` A `162.159.128.70`

### Mail

- MX `1 aspmx.l.google.com`
- MX `2 alt1.aspmx.l.google.com`
- MX `3 alt2.aspmx.l.google.com`

### Wichtige Beobachtungen

- Am Zonen-Apex wurde bei der Momentaufnahme kein TXT-Record zurueckgegeben.
- Fuer `_dmarc.campdoerfl.de` wurde bei der Momentaufnahme kein TXT-Record gefunden.
- Fuer `google._domainkey.campdoerfl.de` wurde bei der Momentaufnahme kein TXT-Record gefunden.
- Vor dem finalen DNS-Umzug muss die gesamte aktuelle Zone in Jimdo oder beim kuenftigen Registrar manuell gegengeprueft werden, damit keine versteckten Verifizierungs-, DKIM- oder Drittanbieter-Eintraege verloren gehen.

## Empfohlener Migrationsweg

### Phase 1: Code und Hosting vorbereiten

1. Dieses Projekt in ein GitHub-Repository pushen.
2. In Cloudflare ein Konto und eine Zone fuer `campdoerfl.de` vorbereiten.
3. In Cloudflare Pages ein neues Projekt anlegen.
4. GitHub-Repository verbinden.
5. Build Command auf `npm run build` setzen.
6. Output Directory auf `dist` setzen.
7. Zunaechst nur die Pages-Vorschau testen, noch ohne Produktivdomain.

### Phase 2: Domain aus Jimdo loesen

1. Bei Jimdo oder dem derzeitigen Registrar die `AuthInfo` fuer `campdoerfl.de` anfordern.
2. Domain zu einem unabhaengigen Registrar transferieren.
3. Nach erfolgreichem Transfer die Domain nicht mehr ueber Jimdo verwalten.

Hinweis:

- Fuer `.de`-Domains erfolgt der Providerwechsel per `AuthInfo`.
- Laut DENIC teilst du die `AuthInfo` dem neuen Provider mit, der den Wechsel ausloest.

## Phase 3: DNS nach Cloudflare umziehen

1. Domain-Zone in Cloudflare anlegen.
2. Alle benoetigten DNS-Records vor dem Nameserver-Wechsel in Cloudflare nachbauen.
3. Mail-Records exakt uebernehmen.
4. Nameserver beim Registrar auf die von Cloudflare angezeigten Ziel-Nameserver umstellen.
5. Warten, bis die Zone aktiv ist.

## Unbedingt vor dem Umschalten pruefen

- Mail-MX weiterhin vorhanden
- vorhandene SPF-, DKIM- und DMARC-Eintraege uebernommen
- externe Verifizierungs-Eintraege fuer Google oder andere Dienste uebernommen
- `www` und Root-Domain sauber auf das neue Hosting ausgerichtet

## Empfohlene Live-Domain-Strategie

- Produktive Hauptadresse: `https://www.campdoerfl.de`
- Root-Domain `https://campdoerfl.de` per Redirect auf `https://www.campdoerfl.de`

Das passt bereits zur jetzigen Projektkonfiguration.

## Cloudflare Pages in diesem Projekt

### Build-Werte

- Build Command: `npm run build`
- Build Output: `dist`

### Keine Serverpflicht

Die Seite ist statisch. Aktuell gibt es keinen eigenen Backend-Zwang.

Ausnahme:

- Das Kontaktformular nutzt derzeit `FormSubmit` als externen Dienst.
- Langfristig kann das spaeter auf eine eigene Cloudflare-Function umgestellt werden, ist fuer den Relaunch aber nicht noetig.

## GitHub-Workflow

Vorbereitet:

- `.github/workflows/build.yml`

Dieser Workflow prueft den Build bei Pushes und Pull Requests.

## Launch-Checkliste

1. GitHub-Repository erstellt
2. Cloudflare Pages verbunden
3. Preview-Deploy erfolgreich
4. Domaintransfer mit `AuthInfo` abgeschlossen
5. DNS-Zone in Cloudflare vollstaendig uebernommen
6. `www.campdoerfl.de` erfolgreich mit Pages verbunden
7. Root-Domain redirectet sauber auf `www`
8. SSL aktiv
9. Kontaktformular getestet
10. Impressum, Datenschutz, Cookies, Barrierefreiheit live geprueft
11. Jimdo erst danach kuendigen

## Offene manuelle Aufgaben

- GitHub-Repository anlegen oder vorhandenes Ziel-Repository festlegen
- Cloudflare-Konto und Zone einrichten
- neuen Registrar festlegen
- AuthInfo bei Jimdo anfordern
- bestehende DNS-Zone vor dem Transfer vollstaendig exportieren oder manuell dokumentieren

## Sinnvolle naechste Ausfuehrung in Codex

1. GitHub-Ziel definieren
2. Repository pushen
3. Cloudflare Pages Projekt verbinden
4. DNS-Migrationswerte auf Basis des echten Cloudflare-Projekts final eintragen
