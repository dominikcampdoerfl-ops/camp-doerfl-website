# at/oeffentlich/

Alles hier landet unverändert in der Wurzel von `dist-at/` — also unter
`https://campdoerfl.at/<dateiname>`. Gedacht für Dateien, die genau so
ausgeliefert werden müssen, wie ein Dienst sie erwartet: Bestätigungsdateien,
`.well-known`-Einträge und Ähnliches.

Kein Umbenennen, kein Nachbearbeiten, keine Kennung im Dateinamen — der Name
ist Teil der Prüfung.

## Was aktuell hier liegt

- `google1ee7b5fc9d10d60f.html` — Bestätigung der Google Search Console.
  Dieselbe Kennung liegt auf campdoerfl.de unter `public/`: Google bindet die
  HTML-Bestätigung an das Konto, nicht an die einzelne Domain.
  **Nicht löschen** — die Search Console prüft sie regelmäßig nach, und mit ihr
  fällt der Zugriff auf die Property weg. `at/pruefen.mjs` und
  `at/live-pruefen.mjs` wachen darüber.

Diese Datei selbst (`LIESMICH.md`) wird nicht mit ausgeliefert.
