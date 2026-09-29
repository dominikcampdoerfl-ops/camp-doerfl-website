# ch/oeffentlich/

Was hier liegt, landet beim Build **unverändert** in der Wurzel von
campdoerfl.ch — also unter `https://campdoerfl.ch/<dateiname>`.

Gedacht ist das Verzeichnis für Bestätigungsdateien, deren Inhalt Byte für Byte
stimmen muss:

- Google Search Console (`google<kennung>.html`)
- Bing Webmaster Tools (`BingSiteAuth.xml`)
- Vergleichbares für andere Dienste

Diese Datei selbst und alles, was mit einem Punkt beginnt, wird nicht kopiert.

`npm run ch:test` prüft, dass jede Datei von hier im Build ankommt und der
Inhalt dabei unverändert bleibt.
