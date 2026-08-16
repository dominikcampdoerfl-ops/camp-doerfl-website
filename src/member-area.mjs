// Member Area — die Camp Dörfl App im Browser.
//
// Unter /member/ liegt der Web-Export der nativen App (Expo). Er wird im
// App-Repo mit `npm run export:web` erzeugt, landet hier im Ordner `member-app/`
// (nicht im Git, siehe .gitignore) und wird vom Build nach `dist/member/`
// kopiert. Der Login passiert im Login-Fenster der Website; die Sitzung wird
// über den localStorage an die App übergeben.
//
// Diese Datei ist die gemeinsame Wahrheit für Build, Cloudflare-Worker und
// lokalen Vorschau-Server. Die Pfadauflösung wird als Funktionsquelltext in den
// Worker eingebettet, damit es sie nur einmal gibt.

export const MEMBER_BASE_PATH = "/member";
export const MEMBER_SOURCE_DIR = "member-app";
export const MEMBER_BUILD_MANIFEST = "member-build.json";

// Backend der App. Das Login-Fenster der Website spricht direkt mit ihm, deshalb
// steht es auch in der connect-src der normalen Seiten.
export const MEMBER_API_ORIGIN = "https://camp-doerfl-backend.onrender.com";

// Eigene Sicherheitsrichtlinie für /member/: Der Expo-Build braucht Blob-Worker,
// `new Function` für Animationen und Verbindungen zu Backend, Karten- und
// Wearable-Diensten. Die strenge Richtlinie der Marketingseiten würde die App
// stillschweigend zerlegen — deshalb gilt sie nur dort und diese nur hier.
// Skripte bleiben trotzdem auf die eigene Domain begrenzt.
export const memberSecurityHeaders = Object.freeze({
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(self), geolocation=(self), microphone=(self), payment=(), usb=()",
  // Die Member Area ist ein privater Bereich und gehört nicht in den Index.
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "connect-src 'self' blob: data: https:",
    "frame-src 'self' https:",
    "upgrade-insecure-requests"
  ].join("; ")
});

// Selbstständig gehalten wie die beiden Funktionen darunter: der Quelltext wird
// wörtlich in den Cloudflare-Worker geschrieben und darf nichts von außen
// referenzieren — deshalb steht "/member" hier ausgeschrieben statt als Konstante.
export function isMemberAreaPath(pathname) {
  return pathname === "/member" || pathname.startsWith("/member/");
}

// Reihenfolge, in der eine Anfrage an /member/... aufgelöst wird.
export function memberAssetCandidates(pathname) {
  if (pathname !== "/member" && !pathname.startsWith("/member/")) {
    return [];
  }

  const trimmed = pathname.replace(/\/+$/, "") || "/member";

  if (trimmed === "/member") {
    return ["/member/index.html"];
  }

  const lastSegment = trimmed.slice(trimmed.lastIndexOf("/") + 1);

  // Echte Dateien (JS-Bundle, Bilder, Schriften) dürfen nicht auf eine HTML-Seite
  // zurückfallen — sonst liefert ein fehlendes Bundle stillschweigend Markup aus.
  if (lastSegment.includes(".")) {
    return [trimmed];
  }

  // Expo exportiert jede Route als eigene HTML-Datei. Was dort fehlt (z. B. eine
  // erst zur Laufzeit gebaute Route), übernimmt der Router im index.html.
  return [trimmed, `${trimmed}.html`, "/member/index.html"];
}

// Gehashte Dateinamen dürfen dauerhaft im Cache liegen, HTML nie.
export function memberCacheControl(pathname) {
  if (pathname.startsWith("/member/_expo/") || pathname.startsWith("/member/assets/")) {
    return "public, max-age=31536000, immutable";
  }

  return "public, max-age=0, must-revalidate";
}
