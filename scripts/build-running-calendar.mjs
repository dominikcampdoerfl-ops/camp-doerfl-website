import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const temporaryRoot = "/private/tmp";

const sourceFiles = {
  half: path.join(temporaryRoot, "camp-running-half.json"),
  marathon: path.join(temporaryRoot, "camp-running-marathon.json"),
  ultra: path.join(temporaryRoot, "camp-running-ultra.html"),
  postcodes: path.join(temporaryRoot, "camp-running-geo", "zipcodes.de.json")
};

const decodeHtml = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#039;|&apos;/gi, "'")
  .replace(/&auml;/gi, "ä")
  .replace(/&ouml;/gi, "ö")
  .replace(/&uuml;/gi, "ü")
  .replace(/&Auml;/g, "Ä")
  .replace(/&Ouml;/g, "Ö")
  .replace(/&Uuml;/g, "Ü")
  .replace(/&szlig;/gi, "ß")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/\s+/g, " ")
  .trim();

const normalise = (value = "") => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/ß/g, "ss")
  .toLowerCase()
  .replace(/\([^)]*\)/g, " ")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const isoDate = (day, month, year) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const parseSingleDate = (value) => {
  const match = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  return match ? isoDate(match[1], match[2], match[3]) : null;
};

const parseDuvDate = (value) => {
  const allFullDates = [...value.matchAll(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g)];
  if (allFullDates.length >= 2) {
    return {
      date: isoDate(allFullDates[0][1], allFullDates[0][2], allFullDates[0][3]),
      endDate: isoDate(allFullDates.at(-1)[1], allFullDates.at(-1)[2], allFullDates.at(-1)[3])
    };
  }
  const shortRange = value.match(/^(\d{1,2})\.-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (shortRange) {
    return {
      date: isoDate(shortRange[1], shortRange[3], shortRange[4]),
      endDate: isoDate(shortRange[2], shortRange[3], shortRange[4])
    };
  }
  const date = parseSingleDate(value);
  return { date, endDate: null };
};

const roundCoordinate = (value) => Number(Number(value).toFixed(5));

const postcodeEntries = JSON.parse(await fs.readFile(sourceFiles.postcodes, "utf8"));
const byPostcode = new Map();
const byPlace = new Map();

const addCoordinate = (map, key, entry) => {
  if (!key || !Number.isFinite(Number(entry.latitude)) || !Number.isFinite(Number(entry.longitude))) return;
  const values = map.get(key) || [];
  values.push({ latitude: Number(entry.latitude), longitude: Number(entry.longitude), place: entry.place, state: entry.state });
  map.set(key, values);
};

postcodeEntries.forEach((entry) => {
  addCoordinate(byPostcode, entry.zipcode, entry);
  addCoordinate(byPlace, normalise(entry.place), entry);
});

const averageCoordinate = (entries) => {
  if (!entries?.length) return null;
  return {
    latitude: roundCoordinate(entries.reduce((sum, entry) => sum + entry.latitude, 0) / entries.length),
    longitude: roundCoordinate(entries.reduce((sum, entry) => sum + entry.longitude, 0) / entries.length)
  };
};

const coordinateForPostcode = (postcode) => averageCoordinate(byPostcode.get(postcode));

const placeAliases = new Map(Object.entries({
  "bad belzig": "belzig",
  "breitenauer see lowenstein": "löwenstein",
  "dreilinden": "kleinmachnow",
  "durnhart rain": "rain",
  "gaussig": "doberschau-gaußig",
  "lohningen": "löningen",
  "marialinden": "overath",
  "marienfeld": "harsewinkel",
  "neubrucke nahe": "hoppstädten-weiersbach",
  "spandau": "berlin",
  "st ingbert": "sankt ingbert",
  "sulz muhlheim": "sulz am neckar",
  "sylt": "westerland",
  "unterirarding pentling": "pentling",
  "weesenstein": "müglitztal",
  "wendhausen": "schellerten"
}));

const coordinateForPlace = (rawPlace) => {
  const cleaned = rawPlace
    .replace(/\s*\(GER\)\s*$/i, "")
    .replace(/\s*\([^)]*(?:NRW|BY|BW|HE|NI|RP|SL|SN|ST|SH|TH|BB|MV|BE|HB|HH)[^)]*\)\s*$/i, "")
    .trim();
  const candidates = [
    cleaned,
    cleaned.split(/\s*[-–/]\s*/)[0],
    cleaned.replace(/^(Bad|Sankt|St\.)\s+/i, "$1 "),
    cleaned.split(",")[0],
    placeAliases.get(normalise(cleaned))
  ].map(normalise).filter(Boolean);

  for (const candidate of candidates) {
    const exact = averageCoordinate(byPlace.get(candidate));
    if (exact) return { ...exact, city: cleaned };
  }

  for (const candidate of candidates.filter((value) => value.length >= 5)) {
    const matches = [];
    for (const [place, coordinates] of byPlace) {
      if (place.startsWith(`${candidate} `) || candidate.startsWith(`${place} `)) matches.push(...coordinates);
    }
    const approximate = averageCoordinate(matches);
    if (approximate) return { ...approximate, city: cleaned };
  }

  return null;
};

const extract = (block, className) => decodeHtml(block.match(new RegExp(`<[^>]+class=["'][^"']*${className}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`))?.[1] || "");

const parseDlvEvents = (fileContent, category, type) => {
  const payload = JSON.parse(fileContent);
  const events = [];
  const anchorPattern = /<a\s+href="([^"]+)"[^>]*class="teaser event"[^>]*>([\s\S]*?)<\/a>/g;
  for (const match of payload.events.matchAll(anchorPattern)) {
    const [, url, block] = match;
    const date = parseSingleDate(extract(block, "date"));
    const name = extract(block, "headline");
    const location = extract(block, "location");
    const locationMatch = location.match(/^(\d{5})\s+(.+)$/);
    if (!date || !name || !locationMatch) continue;
    const [, postalCode, city] = locationMatch;
    const coordinates = coordinateForPostcode(postalCode) || coordinateForPlace(city);
    if (!coordinates) continue;
    events.push({
      id: `dlv-${category}-${date}-${normalise(name).replaceAll(" ", "-")}`,
      category,
      type,
      name,
      date,
      endDate: null,
      city,
      postalCode,
      distance: category === "half" ? "21,0975 km" : "42,195 km",
      ...coordinates,
      source: "DLV-Laufkalender",
      url: new URL(url, "https://www.laufen.de/").href
    });
  }
  return events;
};

const halfPayload = await fs.readFile(sourceFiles.half, "utf8");
const marathonPayload = await fs.readFile(sourceFiles.marathon, "utf8");
const dlvEvents = [
  ...parseDlvEvents(halfPayload, "half", "Halbmarathon"),
  ...parseDlvEvents(marathonPayload, "marathon", "Marathon")
];

const duvHtml = await fs.readFile(sourceFiles.ultra, "utf8");
const ultraEvents = [];
const unresolvedUltra = [];
const rowPattern = /<tr class='(?:odd|even)'>([\s\S]*?)<\/tr>/g;
for (const rowMatch of duvHtml.matchAll(rowPattern)) {
  const row = rowMatch[1];
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) => decodeHtml(match[1]));
  const href = row.match(/href='([^']*eventdetail\.php\?event=\d+)'/)?.[1];
  if (cells.length < 4 || !href) continue;
  const [rawDate, name, distance, rawCity] = cells;
  if (/marsch|wander|walking|walk\b|hike|trekking/i.test(name)) continue;
  const { date, endDate } = parseDuvDate(rawDate);
  if (!date || !date.startsWith("2026-")) continue;
  const city = rawCity.replace(/\s*\(GER\)\s*$/i, "").trim();
  const coordinates = coordinateForPlace(city);
  if (!coordinates) {
    unresolvedUltra.push(city);
    continue;
  }
  ultraEvents.push({
    id: `duv-ultra-${date}-${normalise(name).replaceAll(" ", "-")}`,
    category: "ultra",
    type: "Ultra Running",
    name,
    date,
    endDate,
    city,
    postalCode: "",
    distance,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    source: "DUV Ultramarathon-Statistik",
    url: new URL(href, "https://statistik.d-u-v.org/").href
  });
}

const mammutEvents = [
  ["2026-03-07", "Mammutmarsch Leipzig", "Leipzig", "30 / 42 / 55 km"],
  ["2026-03-14", "Mammutmarsch München", "München", "30 / 55 km"],
  ["2026-03-28", "Mammutmarsch Hamburg", "Hamburg", "30 / 50 km"],
  ["2026-04-25", "Mammutmarsch Ruhrgebiet", "Duisburg", "30 / 42 / 55 km"],
  ["2026-05-09", "Mammutmarsch Nürnberg", "Nürnberg", "30 / 42 / 55 km"],
  ["2026-05-16", "Mammutmarsch Berlin", "Berlin", "75 / 100 km"],
  ["2026-06-06", "Mammutmarsch Dresden", "Dresden", "30 / 50 km"],
  ["2026-06-13", "Nachtmammut Berlin", "Berlin", "30 / 50 km"],
  ["2026-06-27", "Mammutmarsch Mannheim", "Mannheim", "30 / 42 / 60 km"],
  ["2026-07-03", "Nachtmammut Hamburg", "Hamburg", "30 / 42 km"],
  ["2026-07-18", "Mammutmarsch Essen", "Essen", "75 / 100 km"],
  ["2026-08-01", "Mammutmarsch München", "München", "75 / 100 km"],
  ["2026-08-29", "Nachtmammut Ruhrgebiet", "Duisburg", "30 / 42 km"],
  ["2026-09-05", "Mammutmarsch Bremen", "Bremen", "30 / 55 km"],
  ["2026-09-12", "Mammutmarsch Stuttgart", "Stuttgart", "30 / 42 / 60 km"],
  ["2026-09-26", "Mammutmarsch Hannover", "Hannover", "30 / 42 / 55 km"],
  ["2026-10-10", "Mammutmarsch Dortmund", "Dortmund", "30 / 42 / 55 km"],
  ["2026-10-17", "Mammutmarsch Wiesbaden", "Wiesbaden", "30 / 42 / 55 km"],
  ["2026-10-24", "Mammutmarsch München", "München", "30 / 50 km"],
  ["2026-11-07", "Mammutmarsch Berlin", "Berlin", "30 / 42 / 55 km"]
].map(([date, name, city, distance]) => ({
  id: `mammut-${date}-${normalise(name).replaceAll(" ", "-")}`,
  category: "mammut", type: "Mammutmarsch", name, date, endDate: null, city, postalCode: "", distance,
  ...coordinateForPlace(city), source: "Mammutmarsch", url: "https://mammutmarsch.de/produkt-kategorie/event/"
}));

const megaEvents = [
  ["2026-03-07", "Megamarsch Dresden", "Dresden", "25 / 50 km"],
  ["2026-03-21", "Megamarsch Mönchengladbach", "Mönchengladbach", "25 / 50 km"],
  ["2026-04-11", "Megamarsch Hamburg", "Hamburg", "100 km"],
  ["2026-04-25", "Megamarsch Ostsee", "Scharbeutz", "50 km"],
  ["2026-05-02", "Megamarsch Hannover", "Hannover", "25 / 50 km"],
  ["2026-05-16", "Megamarsch München", "München", "100 km"],
  ["2026-05-23", "Megamarsch Bremen", "Bremen", "50 km"],
  ["2026-06-13", "Megamarsch Weserbergland bei Nacht", "Rinteln", "50 km"],
  ["2026-06-13", "Megamarsch Weserbergland", "Rinteln", "100 km"],
  ["2026-07-04", "Megamarsch Düsseldorf", "Düsseldorf", "25 / 50 km"],
  ["2026-07-11", "Megamarsch Erfurt", "Erfurt", "50 km"],
  ["2026-07-25", "Megamarsch Ruhrgebiet bei Nacht", "Gelsenkirchen", "50 km"],
  ["2026-08-08", "Megamarsch Hamburg bei Nacht", "Hamburg", "50 km"],
  ["2026-08-29", "Megamarsch Berlin bei Nacht", "Berlin", "50 km"],
  ["2026-09-05", "Megamarsch Stuttgart", "Stuttgart", "100 km"],
  ["2026-09-19", "Megamarsch Köln", "Köln", "100 km"],
  ["2026-09-26", "Megamarsch Freiburg", "Freiburg im Breisgau", "25 / 50 km"],
  ["2026-10-10", "Megamarsch Frankfurt", "Frankfurt am Main", "100 km"],
  ["2026-10-17", "Megamarsch Rügen", "Binz", "100 km"],
  ["2026-11-07", "Megamarsch Nürnberg", "Nürnberg", "50 km"]
].map(([date, name, city, distance]) => ({
  id: `mega-${date}-${normalise(name).replaceAll(" ", "-")}`,
  category: "mega", type: "Megamarsch", name, date, endDate: null, city, postalCode: "", distance,
  ...coordinateForPlace(city), source: "Megamarsch", url: "https://www.megamarsch.de/"
}));

const events = [...dlvEvents, ...mammutEvents, ...megaEvents, ...ultraEvents]
  .filter((event) => Number.isFinite(event.latitude) && Number.isFinite(event.longitude))
  .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

const output = `// Generated from the official DLV, DUV, Mammutmarsch and Megamarsch 2026 calendars.\n` +
  `// Generated: 2026-08-01. Source refresh script: scripts/build-running-calendar.mjs\n` +
  `export const runningEvents2026 = Object.freeze(${JSON.stringify(events, null, 2)});\n`;

await fs.writeFile(path.join(projectRoot, "src", "running-events-2026.mjs"), output);

const counts = Object.groupBy(events, (event) => event.category);
console.log(JSON.stringify({
  total: events.length,
  categories: Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, value.length])),
  unresolvedUltra: [...new Set(unresolvedUltra)].sort(),
  unresolvedUltraCount: unresolvedUltra.length
}, null, 2));
