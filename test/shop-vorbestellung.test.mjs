import assert from "node:assert/strict";
import test from "node:test";

import { shopProducts, shopShipping, shopSizes, shopVouchers, site } from "../src/data.mjs";
import { pages } from "../src/pages.mjs";

const seite = (route) => pages.find((eintrag) => eintrag.route === route)?.render() || "";
const shop = seite("/shop/");
const preis = (wert) => `${wert.toFixed(2).replace(".", ",")} €`;

test("der Shop ist eine eigene Seite und kein Rest der alten Jimdo-Adresse", () => {
  assert.ok(pages.some((eintrag) => eintrag.route === "/shop/"), "Route /shop/ fehlt");
  assert.ok(shop.length > 0, "Die Shop-Seite rendert nichts");
});

test("jeder Artikel steht mit Farbe, Preis und allen Größen auf der Seite", () => {
  assert.equal(shopProducts.length, 13);

  for (const artikel of shopProducts) {
    assert.ok(shop.includes(`${artikel.name} ${artikel.variant}`), `${artikel.id}: Name fehlt`);
    assert.ok(shop.includes(preis(artikel.price)), `${artikel.id}: Preis fehlt`);
    assert.ok(shop.includes(artikel.image), `${artikel.id}: Bild fehlt`);
    assert.ok(shop.includes(`data-id="${artikel.id}"`), `${artikel.id}: Kennung für die Auswahl fehlt`);
  }

  // Vier Shirts zu 20 €, ein Sweatshirt zu 49 €, zwei Jacken zu 45 €.
  const jeKategorie = (kategorie) => shopProducts.filter((artikel) => artikel.category === kategorie);
  for (const [kategorie, anzahl, preise] of [
    ["Shirt", 8, [20, 30]],
    ["Sweatshirt", 1, [49]],
    ["Jacke", 2, [45]],
    ["Sonstiges", 2, [20]]
  ]) {
    assert.equal(jeKategorie(kategorie).length, anzahl, `${kategorie}: falsche Anzahl`);
    assert.ok(
      jeKategorie(kategorie).every((artikel) => preise.includes(artikel.price)),
      `${kategorie}: unerwarteter Preis`
    );
  }

  // Der einzige Oversized-Schnitt kostet mehr als die übrigen Shirts.
  const oversized = jeKategorie("Shirt").filter((artikel) => artikel.variant.startsWith("Oversized"));
  assert.equal(oversized.length, 3);
  assert.ok(oversized.every((artikel) => artikel.price === 30), "Oversized kostet 30 €");
  assert.equal(jeKategorie("Shirt").filter((artikel) => artikel.price === 20).length, 5);

  // Zwei Gruppen im Katalog: die Shirts allein, alles andere in einer Reihe.
  assert.ok(shop.includes(">Shirts</h3>"), "Gruppe Shirts fehlt");
  assert.ok(shop.includes(">Sweatshirts, Jacken &amp; Sonstiges</h3>"), "Gemeinsame Gruppe fehlt");

  for (const groesse of shopSizes) {
    assert.ok(shop.includes(`<option value="${groesse}">${groesse}</option>`), `Größe ${groesse} fehlt`);
  }
});

test("beide Versandsätze stehen auf der Seite und an den Artikeln", () => {
  assert.ok(shop.includes(preis(shopShipping.price)), "Versandpreis für Kleidung fehlt");
  assert.ok(shop.includes(preis(shopShipping.voucherPrice)), "Versandpreis für Gutscheine fehlt");
  assert.ok(shopShipping.voucherPrice < shopShipping.price, "Gutscheine sollten günstiger versendet werden");
});

test("der Shop kassiert nicht, sondern schickt eine Vorbestellung per E-Mail", () => {
  assert.ok(shop.includes(`https://formsubmit.co/ajax/${site.email}`), "Das Formular kennt sein Ziel nicht");
  assert.match(shop, /Kaufvertrag kommt erst mit meiner ausdrücklichen Bestätigung zustande/);
  // Kein Bezahlweg auf der Seite — der Text darf „Warenkorb“ erklären, die
  // Seite darf keinen anbieten.
  assert.doesNotMatch(shop, /paypal|stripe|klarna|checkout/i);

  // Adresse und Auswahl gehören zusammen in dieselbe E-Mail.
  for (const feld of ["name", "email", "strasse", "plz", "ort"]) {
    assert.ok(shop.includes(`name="${feld}"`), `Feld ${feld} fehlt im Formular`);
  }
  for (const feld of ["Zwischensumme", "Versand", "Gesamt"]) {
    assert.ok(shop.includes(`name="${feld}"`), `Summenfeld ${feld} fehlt im Formular`);
  }
});

test("der Shop ist von jeder Seite aus erreichbar", () => {
  for (const route of ["/", "/app/", "/kontakt/"]) {
    assert.match(seite(route), /href="\/shop\/"/, `${route} verlinkt den Shop nicht`);
  }
});

test("jeder Gutschein steht mit Betrag und Leistung auf der Seite", () => {
  assert.equal(shopVouchers.length, 6);

  for (const gutschein of shopVouchers) {
    assert.ok(shop.includes(gutschein.title), `${gutschein.id}: Bezeichnung fehlt`);
    assert.ok(shop.includes(preis(gutschein.price)), `${gutschein.id}: Betrag fehlt`);
    assert.ok(shop.includes(`data-id="${gutschein.id}"`), `${gutschein.id}: Kennung fehlt`);
  }

  // Die Beträge sind die Preise der Leistungsseiten, nicht eigene Zahlen.
  const erwartet = new Map([
    ["gutschein-koerperanalyse", 59],
    ["gutschein-personal-training", 120],
    ["gutschein-personal-training-analyse", 150],
    ["gutschein-online-coaching", 360],
    ["gutschein-5er-karte", 500],
    ["gutschein-10er-karte", 800]
  ]);
  for (const gutschein of shopVouchers) {
    assert.equal(gutschein.price, erwartet.get(gutschein.id), `${gutschein.id}: Betrag weicht ab`);
  }
});

test("jeder Artikel trägt seinen eigenen Versandsatz", () => {
  // Die Zusammenfassung im Browser liest den Satz von der Karte. Fehlt er,
  // rechnet sie mit null.
  for (const artikel of shopProducts) {
    assert.ok(
      new RegExp(`data-id="${artikel.id}"[\\s\\S]{0,240}data-shipping="${shopShipping.price}"`).test(shop),
      `${artikel.id}: Versandsatz für Kleidung fehlt`
    );
  }
  for (const gutschein of shopVouchers) {
    assert.ok(
      new RegExp(`data-id="${gutschein.id}"[\\s\\S]{0,240}data-shipping="${shopShipping.voucherPrice}"`).test(shop),
      `${gutschein.id}: Versandsatz für Gutscheine fehlt`
    );
  }
});

test("die Produktbilder lassen sich groß ansehen", () => {
  // Jede Karte trägt einen Auslöser, dazu die Kacheln im Einstieg — dort
  // stehen nur die tragbaren Teile, Buddy hat sein eigenes Motiv.
  const tragbar = shopProducts.filter((artikel) => artikel.category !== "Sonstiges");
  const kacheln = Math.min(tragbar.length, 8);
  const ausloeser = shop.match(/data-shop-zoom/g) || [];
  assert.equal(ausloeser.length, shopProducts.length + kacheln);

  // Gerade Anzahl, sonst bleibt im Raster ein Feld leer.
  assert.equal(kacheln % 2, 0, "Die Zahl der Kacheln im Einstieg muss gerade sein");
  assert.ok(shop.includes("data-shop-lightbox"), "Die Großansicht fehlt");

  for (const artikel of shopProducts) {
    assert.ok(shop.includes(`groß ansehen"`), "Beschriftung der Schaltfläche fehlt");
    assert.ok(shop.includes(`data-src="${artikel.image}"`), `${artikel.id}: Bildquelle fehlt`);
  }
});

test("was hinzugefügt wurde, lässt sich auf derselben Karte wieder entfernen", () => {
  // Je Artikel eine Anzeige — sonst müsste man bis zur Übersicht scrollen,
  // um eine Größe wieder loszuwerden.
  const anzeigen = shop.match(/data-shop-card-state/g) || [];
  assert.equal(anzeigen.length, shopProducts.length + shopVouchers.length);

  const reihen = shop.match(/data-shop-card-rows/g) || [];
  assert.equal(reihen.length, shopProducts.length + shopVouchers.length);

  for (const eintrag of [...shopProducts, ...shopVouchers]) {
    assert.ok(
      new RegExp(`data-id="${eintrag.id}"[\\s\\S]*?data-shop-card-state`).test(shop),
      `${eintrag.id}: Anzeige zum Entfernen fehlt auf der Karte`
    );
  }
});

test("die Karten heißen so, wie sie verkauft werden", () => {
  assert.ok(shop.includes("5er Karte Personal Training"));
  assert.ok(shop.includes("10er Karte Personal Training"));
  assert.doesNotMatch(shop, /<h4[^>]*>5er Karte<\/h4>/);
  assert.doesNotMatch(shop, /<h4[^>]*>10er Karte<\/h4>/);
});

test("Buddy hat keine Größe, alle anderen Teile schon", () => {
  const ohneGroesse = shopProducts.filter((artikel) => artikel.ohneGroesse);
  assert.deepEqual(ohneGroesse.map((artikel) => artikel.id), ["buddy", "bag"]);

  // Wo nichts zu wählen ist, steht trotzdem eine Zeile — sonst läge der Preis
  // nicht auf einer Linie mit den Nachbarkarten.
  const feste = shop.match(/shop-field__fest/g) || [];
  assert.equal(feste.length, ohneGroesse.length);

  // Ein Auswahlfeld je Teil mit Größen — für Buddy und die Gutscheine keines.
  const felder = shop.match(/data-shop-size/g) || [];
  assert.equal(felder.length, shopProducts.length - ohneGroesse.length);
});

/* Die Produktdaten für die Suche.
 *
 * Google bemängelte im August 2026 auf /shop/ ein fehlendes "image" bei allen
 * sechs Gutscheinen — ohne Bild fällt ein Produkt aus den Rich Results heraus.
 * Der Test hält beide Pflichtangaben für jeden Artikel fest. */
function produktListe() {
  const bloecke = shop.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];

  for (const block of bloecke) {
    const daten = JSON.parse(block.replace(/<\/?script[^>]*>/g, ""));
    const liste = (daten["@graph"] || [daten]).find((knoten) => knoten["@type"] === "ItemList" && knoten.name?.includes("Kollektion"));
    if (liste) return liste.itemListElement.map((eintrag) => eintrag.item);
  }

  return [];
}

test("jeder Artikel trägt ein Bild und einen Versandsatz in den Produktdaten", () => {
  const artikel = produktListe();

  assert.equal(artikel.length, shopProducts.length + shopVouchers.length, "die Produktliste ist unvollständig");

  for (const eintrag of artikel) {
    assert.ok(eintrag.image, `${eintrag.name}: image fehlt`);
    assert.match(eintrag.image, new RegExp(`^${site.url}/assets/images/`), `${eintrag.name}: image ist keine vollständige Adresse`);
    assert.ok(eintrag.offers.shippingDetails, `${eintrag.name}: shippingDetails fehlt`);
    assert.equal(eintrag.offers.shippingDetails.shippingDestination.addressCountry, "DE");
  }
});

test("der ausgezeichnete Versandsatz ist derselbe, der auf der Seite steht", () => {
  for (const eintrag of produktListe()) {
    const gutschein = eintrag.category === "Gutschein";
    const erwartet = (gutschein ? shopShipping.voucherPrice : shopShipping.price).toFixed(2);
    assert.equal(eintrag.offers.shippingDetails.shippingRate.value, erwartet, `${eintrag.name}: falscher Versandsatz`);
  }
});

test("jedes Gutscheinbild liegt wirklich im Repo", async () => {
  const { existsSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const wurzel = fileURLToPath(new URL("..", import.meta.url));

  for (const gutschein of shopVouchers) {
    assert.ok(gutschein.image, `${gutschein.id}: kein Bild hinterlegt`);
    assert.ok(existsSync(wurzel + gutschein.image.slice(1)), `${gutschein.id}: ${gutschein.image} fehlt`);
  }
});
