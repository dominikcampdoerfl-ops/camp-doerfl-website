import { MEMBER_API_ORIGIN } from "./member-area.mjs";

export const securityHeaders = Object.freeze({
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  // `connect-src` enthält das App-Backend, weil das Member-Login-Fenster der
  // Website direkt dort anmeldet (siehe src/member-area.mjs).
  "Content-Security-Policy": `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://formsubmit.co; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://formsubmit.co https://translate.googleapis.com https://photon.komoot.io https://overpass-api.de ${MEMBER_API_ORIGIN}; frame-src https:; media-src 'self' https:; upgrade-insecure-requests`
});
