/* Sammelt das Wochenangebot von XXL Nutrition — läuft in der Browser-Konsole.
 *
 * Einfügen auf https://xxlnutrition.com/de/angebot/wochenangebot, während
 * `npm run xxl` läuft. Das Skript liest die Angebotskacheln, holt die
 * Produktbilder und legt alles als eine Datei im Download-Ordner ab; das
 * wartende `npm run xxl` nimmt sie von dort.
 *
 * Warum der Umweg über eine Datei: Der Shop verbietet seinen Seiten per
 * Content-Security-Policy jede Verbindung nach außen — ein direkter Aufruf an
 * ein lokales Skript ist damit ausgeschlossen. Ein Download ist davon nicht
 * betroffen und funktioniert in jedem Browser gleich.
 *
 * Wird von scripts/xxl-wochenangebot.mjs in die Zwischenablage gelegt.
 */
(async () => {
  const DATEI = "xxl-wochenangebot.json";
  const KANTE = 640;
  const QUALITAET = 0.86;

  const cent = (text) => {
    const treffer = (text || "").replace(/ /g, " ").match(/(\d+(?:\.\d+)*),(\d{2})/);
    return treffer ? Number(treffer[1].replace(/\./g, "")) * 100 + Number(treffer[2]) : null;
  };

  // Next.js liefert die Bilder über einen eigenen Umformer aus; die Vorlage in
  // voller Auflösung steckt als Adresse im Parameter "url".
  const originalBild = (img) => {
    const quelle = img.getAttribute("src") || img.getAttribute("srcset") || "";
    const treffer = quelle.match(/url=([^&\s]+)/);
    return treffer ? decodeURIComponent(treffer[1]) : "";
  };

  const slug = (name) => name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Die unteren Kacheln bauen sich erst auf, wenn sie in Sichtweite kommen.
  const hoehe = document.body.scrollHeight;
  for (let y = 0; y < hoehe; y += 700) {
    window.scrollTo(0, y);
    await new Promise((fertig) => setTimeout(fertig, 90));
  }
  window.scrollTo(0, 0);
  await new Promise((fertig) => setTimeout(fertig, 800));

  const gesehen = new Set();
  const kacheln = [];

  for (const kachel of document.querySelectorAll(".product-item")) {
    const link = kachel.querySelector('a[href^="/de/"]');
    if (!link) continue;

    const pfad = link.getAttribute("href");
    if (gesehen.has(pfad)) continue;
    gesehen.add(pfad);

    // Kacheln ohne Preisblock sind gerade nicht bestellbar; sie fallen hier
    // heraus statt später als Lücke aufzufallen.
    const preisblock = kachel.querySelector(".product-price-container");
    if (!preisblock) continue;

    const preisCent = cent(preisblock.querySelector(".product-price-to")?.textContent);
    const uvpCent = cent(preisblock.querySelector(".product-price-from")?.textContent);
    if (!preisCent || !uvpCent || uvpCent <= preisCent) continue;

    const bild = [...kachel.querySelectorAll("img")]
      .map((img) => ({ alt: img.getAttribute("alt") || "", url: originalBild(img) }))
      .find((eintrag) => eintrag.url.includes("/product/file/get/"));
    if (!bild) continue;

    // Die zwei Stichpunkte stehen zwischen Produktnamen und Preiszeile.
    const zeilen = kachel.innerText.split("\n").map((zeile) => zeile.trim()).filter(Boolean);
    const namensZeile = zeilen.indexOf(bild.alt);
    const merkmale = namensZeile === -1
      ? []
      : zeilen.slice(namensZeile + 1).filter((zeile) => !/€|^Inhalt:/.test(zeile)).slice(0, 2);

    kacheln.push({
      name: bild.alt,
      slug: slug(bild.alt),
      pfad,
      bildUrl: bild.url,
      uvpCent,
      preisCent,
      ab: /^Ab/.test(preisblock.textContent.trim()),
      merkmale
    });
  }

  if (kacheln.length === 0) {
    console.error("Kein Angebot gefunden — die Seitenstruktur hat sich vermutlich geändert.");
    return;
  }

  const produkte = [];

  for (const [nummer, kachel] of kacheln.entries()) {
    const roh = await (await fetch(kachel.bildUrl)).blob();
    const vorlage = await createImageBitmap(roh);
    const faktor = Math.min(1, KANTE / Math.max(vorlage.width, vorlage.height));
    const breite = Math.round(vorlage.width * faktor);
    const hoehe = Math.round(vorlage.height * faktor);

    const flaeche = new OffscreenCanvas(breite, hoehe);
    flaeche.getContext("2d").drawImage(vorlage, 0, 0, breite, hoehe);
    const bild = await flaeche.convertToBlob({ type: "image/webp", quality: QUALITAET });
    const bytes = new Uint8Array(await bild.arrayBuffer());

    let roher = "";
    for (const byte of bytes) roher += String.fromCharCode(byte);

    const { bildUrl, ...rest } = kachel;
    produkte.push({ ...rest, breite, hoehe, b64: btoa(roher) });
    console.log(`${nummer + 1}/${kacheln.length} ${kachel.name}`);
  }

  const paket = JSON.stringify({ stand: new Date().toISOString().slice(0, 10), produkte });
  const verweis = document.createElement("a");
  verweis.href = URL.createObjectURL(new Blob([paket], { type: "application/json" }));
  verweis.download = DATEI;
  document.body.appendChild(verweis);
  verweis.click();
  verweis.remove();

  console.log(`${produkte.length} Angebote gesammelt — ${DATEI} liegt im Download-Ordner.`);
})();
