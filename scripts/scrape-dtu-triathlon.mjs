import { writeFile } from "node:fs/promises";

const outputPath = new URL("../src/triathlon-events-2026.mjs", import.meta.url);
const baseUrl = "https://www.triathlondeutschland.de";
const calendarUrl = `${baseUrl}/termine/veranstaltungskalender`;

function decodeHtml(value = "") {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&ndash;", "–")
    .replaceAll("&mdash;", "—")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attribute(tag, name) {
  return decodeHtml(tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "");
}

function parsePage(html) {
  return [...html.matchAll(/<article\b[^>]*class="competition--overview-item"[^>]*>[\s\S]*?<\/article>/g)]
    .map(([article]) => {
      const openingTag = article.match(/^<article\b[^>]*>/)?.[0] || "";
      const popup = attribute(openingTag, "data-popupcontent");
      const location = popup.match(/<br\s*\/>\s*([^<]+)<\/p>/)?.[1]?.trim() || "Deutschland";
      const [city, ...regionParts] = location.split(",").map((part) => part.trim());
      const path = popup.match(/href="([^"]+)"/)?.[1] || "";
      const startDate = article.match(/property="startDate"\s+content="([^"]+)"/)?.[1];
      const endDate = article.match(/property="endDate"\s+content="([^"]+)"/)?.[1];
      const latitude = Number(attribute(openingTag, "data-lat"));
      const longitude = Number(attribute(openingTag, "data-lon"));

      if (!startDate || !city || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

      return {
        date: startDate,
        ...(endDate && endDate !== startDate ? { endDate } : {}),
        name: attribute(openingTag, "data-name").trim(),
        city,
        region: regionParts.join(", "),
        country: "DE",
        countryName: "Deutschland",
        latitude,
        longitude,
        type: "Triathlon · DTU genehmigt",
        source: "Deutsche Triathlon Union",
        url: path.startsWith("http") ? path : `${baseUrl}${path}`
      };
    })
    .filter(Boolean);
}

const events = [];
for (let page = 0; page < 30; page += 1) {
  const url = new URL(calendarUrl);
  url.searchParams.set("select_date", "2026");
  url.searchParams.set("sport", "48");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: { "user-agent": "Camp-Doerfl-Calendar/1.0 (+https://www.campdoerfl.de/)" }
  });
  if (!response.ok) throw new Error(`DTU page ${page} failed with ${response.status}`);
  const pageEvents = parsePage(await response.text());
  if (!pageEvents.length) break;
  events.push(...pageEvents);
  if (pageEvents.length < 20) break;
}

const uniqueEvents = [...new Map(events.map((event) => [event.url, event])).values()]
  .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name, "de"));

const output = `/**
 * Generated from the official Deutsche Triathlon Union calendar.
 * Source: ${calendarUrl}?select_date=2026&sport=48
 * Generated: ${new Date().toISOString()}
 */
export const dtuTriathlonEvents2026 = Object.freeze(${JSON.stringify(uniqueEvents, null, 2)});
`;

await writeFile(outputPath, output, "utf8");
console.log(`Saved ${uniqueEvents.length} DTU triathlon events to ${outputPath.pathname}`);
