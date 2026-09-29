# at/seiten/

Eigenständige Unterseiten der AT-Website. Jede Datei hier wird zu einer Route:

    bodybuilding-wettkaempfe-2026.html  →  /bodybuilding-wettkaempfe-2026/

Anders als `at/seite.mjs` (die Startseite, aus `marke.mjs` erzeugt) bringen
diese Seiten ihr Markup, ihr CSS und ihr JavaScript vollständig selbst mit. Sie
werden beim Build **nicht umgeschrieben**, nur ergänzt:

1. **Bilder ausgelagert.** `data:`-Bilder wandern als echte Dateien nach
   `/assets/at/` und bekommen eine Kennung aus dem Inhalt. Das nimmt der
   HTML-Datei ihr Gewicht und macht die Bilder ein Jahr lang cachebar.
2. **CSP-Hashes.** Jeder eingebettete `<style>`- und `<script>`-Block wird
   gehasht und in die Sicherheitsrichtlinie eingetragen. Ohne das blockiert die
   CSP der AT-Seite das eigene Markup — die Seite käme ohne Gestaltung an.
3. **Sitemap.** Die Route wird eingetragen, sofern die Seite nicht auf
   `noindex` steht.

Was die Datei selbst mitbringen muss: `<title>`, `<meta name="description">`,
ein `<link rel="canonical">` auf die eigene Adresse **mit** Schrägstrich am
Ende, und genau eine `<h1>`. `at/pruefen.mjs` prüft das.
