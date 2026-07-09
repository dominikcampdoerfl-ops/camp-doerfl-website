# Cloudflare Security Hardening

Stand: 5. Juli 2026

Diese Notizen beziehen sich auf den Cloudflare-Security-Insights-Export vom 5. Juli 2026.

## Im Code behoben

- Der Worker leitet `http://campdoerfl.de`, `http://www.campdoerfl.de` und `https://campdoerfl.de` per `301` auf `https://www.campdoerfl.de` weiter.
- Alle Worker-Antworten erhalten diese Sicherheitsheader:
  - `Strict-Transport-Security: max-age=31536000`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(), usb=()`
- Der Build erzeugt `/.well-known/security.txt` und `/security.txt` mit `dominik@campdoerfl.de` als Kontaktadresse.

## In Cloudflare setzen

Diese Punkte liegen im Cloudflare-Account und koennen nicht dauerhaft im Website-Code gesetzt werden:

1. SSL/TLS -> Overview:
   - Encryption mode: `Full (strict)`
   - Vorher pruefen, dass `campdoerfl.de` und `www.campdoerfl.de` als Custom Domains/Routes auf das aktuelle Worker-Projekt zeigen.
2. SSL/TLS -> Edge Certificates:
   - `Always Use HTTPS`: `On`
   - `HTTP Strict Transport Security (HSTS)`: aktivieren.
   - Empfehlung fuer den Start: 12 Monate, ohne `Include subdomains` und ohne `Preload`, bis alle Subdomains sicher HTTPS ausliefern.
3. Security -> Bots:
   - `Bot Fight Mode` aktivieren, wenn keine legitimen Automationen dadurch blockiert werden.
4. Security -> AI Labyrinth:
   - Aktivieren, wenn unerwuenschte KI-Crawler aktiv abgewehrt werden sollen.

## DNS-E-Mail-Sicherheit

Cloudflare meldet fehlende oder fehlerhafte SPF- und DMARC-Records. Diese Records gehoeren in die DNS-Zone, nicht in den Website-Code.

Wichtig: Es darf pro Host nur einen SPF-TXT-Record geben. Wenn bereits ein SPF-Record existiert, nicht einen zweiten anlegen, sondern den bestehenden zusammenfuehren.

Wenn Google Workspace der einzige erlaubte Mail-Absender fuer `campdoerfl.de` ist:

```txt
Name: campdoerfl.de
Type: TXT
Value: v=spf1 include:_spf.google.com ~all
```

DMARC fuer den Einstieg mit Monitoring:

```txt
Name: _dmarc.campdoerfl.de
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dominik@campdoerfl.de; adkim=s; aspf=s; pct=100
```

Nach einigen Wochen ohne legitime Fehlversender kann `p=none` auf `p=quarantine` und spaeter auf `p=reject` verschaerft werden.

DKIM kann nicht geraten werden: Den `google._domainkey`-TXT-Wert in Google Admin erzeugen und exakt in Cloudflare DNS uebernehmen.
