/**
 * transform.mjs – TAHAP 1 Data transformation
 *
 * Reads:  "static template/wc-product-export-9-10-2026.json"
 * Writes: src/data/products.json, products-index.json,
 *         variants.json, categories.json, brands.json
 *
 * Run:    node scripts/transform.mjs
 * Safe to re-run (overwrites output).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_JSON = path.join(ROOT, "src", "data", "wc-data-export.json");
const OUT_DIR = path.join(ROOT, "src", "data");

// --- helpers ----------------------------------------------------------------

function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/, "");
}

function parsePrice(str) {
  if (!str || !str.trim()) return null;
  const n = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : Math.round(n);
}

function parseStock(str) {
  if (!str || !str.trim()) return null;
  const n = parseInt(str, 10);
  return isNaN(n) ? null : n;
}

function randomStock() {
  return Math.floor(Math.random() * 51);
}

function randomInRange(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
}

function dummyPrice(catNames = []) {
  const s = catNames.join(" ").toLowerCase();
  if (s.includes("server") || s.includes("storage")) return randomInRange(5_000_000, 25_000_000);
  if (s.includes("interactive display")) return randomInRange(8_000_000, 40_000_000);
  if (s.includes("cctv") || s.includes("surveillance")) return randomInRange(1_500_000, 8_000_000);
  if (s.includes("network")) return randomInRange(2_000_000, 15_000_000);
  if (s.includes("video conference")) return randomInRange(3_000_000, 20_000_000);
  if (s.includes("headset") || s.includes("webcam")) return randomInRange(500_000, 5_000_000);
  if (s.includes("phone")) return randomInRange(1_000_000, 6_000_000);
  return randomInRange(300_000, 5_000_000);
}

const MAX_PRICE = 100_000_000;

function cleanHtml(html = "") {
  if (!html) return "";
  return html
    .replace(/\s+data-[a-z][^=]*="[^"]*"/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/<a\b[^>]*href="[^"]*accommerce\.id[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .trim();
}

function parseImages(str, sku) {
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(sku || "product")}/800/800`;
  if (!str || !str.trim()) return [fallback];
  const urls = str.split("|").map(u => u.trim()).filter(Boolean);
  const unique = [...new Set(urls)];
  return unique.length > 0 ? unique : [fallback];
}

function buildAttributes(row) {
  const attrs = [];
  for (let i = 1; i <= 3; i++) {
    const name = row[`Nama atribut ${i}`];
    const value = row[`Nilai Atribut ${i}`];
    if (name && name.trim() && value && value.trim()) {
      attrs.push({ name: name.trim(), value: value.trim() });
    }
  }
  return attrs;
}

// --- load data --------------------------------------------------------------

console.log("?? Reading source JSON …");
const raw = JSON.parse(fs.readFileSync(SRC_JSON, "utf-8"));
console.log(`   ${raw.length} rows total`);

const published = raw.filter(r => r["Telah Terbit"] === "1");
console.log(`   ${published.length} published rows`);

const simpleRows = published.filter(r => ["simple", "simple, virtual"].includes(r["Tipe"]));
const variableRows = published.filter(r => r["Tipe"] === "variable");
const variationRows = published.filter(r => r["Tipe"].startsWith("variation"));
console.log(`   ${simpleRows.length} simple, ${variableRows.length} variable, ${variationRows.length} variations`);

// --- brands -----------------------------------------------------------------

const brandMap = new Map();
let brandId = 1;

const BRAND_DOMAINS = {
  'logitech': 'logitech.com',
  'yealink': 'yealink.com',
  'poly': 'poly.com',
  'kandao': 'kandaovr.com',
  'jabra': 'jabra.com',
  'maxhub': 'maxhub.com',
  'aver': 'aver.com',
  'samsung': 'samsung.com',
  'tp-link': 'tp-link.com',
  'ice-board': 'iceboard.co.id',
  'targus': 'targus.com',
  'asus': 'asus.com',
  'philips': 'philips.com',
  'dell': 'dell.com',
  'microsoft': 'microsoft.com',
  'yamaha': 'yamaha.com',
  'lg': 'lg.com',
  'epson': 'epson.com'
};

function getBrandId(name) {
  if (!name || !name.trim()) return null;
  const n = name.trim();
  const s = slugify(n);
  if (!brandMap.has(s)) {
    const domain = BRAND_DOMAINS[s] || (s + '.com');
    const logoUrl = "https://logo.clearbit.com/" + domain;
    brandMap.set(s, { id: brandId++, name: n, slug: s, logo: logoUrl, product_count: 0 });
  }
  return brandMap.get(s).id;
}

for (const row of published) {
  const catStr = row["Kategori"] || "";
  for (const seg of catStr.split(",").map(c => c.trim()).filter(Boolean)) {
    const parts = seg.split(" > ").map(p => p.trim());
    if (parts[0] === "Brand" && parts[1]) getBrandId(parts[1]);
  }
  if (row["Brand"] && row["Brand"].trim()) getBrandId(row["Brand"].trim());
}

// --- categories -------------------------------------------------------------

const catPathMap = new Map();
let catId = 1;

function getCategoryId(fullPath) {
  if (!fullPath || !fullPath.trim()) return null;
  const s = slugify(fullPath);
  if (!catPathMap.has(s)) {
    const parts = fullPath.split(" > ").map(p => p.trim());
    const name = parts[parts.length - 1];
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join(" > ") : null;
    const parentId = parentPath ? getCategoryId(parentPath) : null;
    catPathMap.set(s, {
      id: catId++,
      name,
      slug: slugify(name),
      full_path: fullPath,
      parent_id: parentId,
      is_addon: parts[0] === "Lainnya" && parts[1] === "Asuransi",
      is_brand_group: parts[0] === "Brand",
      product_count: 0,
    });
  }
  return catPathMap.get(s).id;
}

for (const row of published) {
  if (row["Tipe"].startsWith("variation")) continue;
  const catStr = row["Kategori"] || "";
  for (const seg of catStr.split(",").map(c => c.trim()).filter(Boolean)) {
    let pathSoFar = "";
    for (const part of seg.split(" > ").map(p => p.trim())) {
      pathSoFar = pathSoFar ? `${pathSoFar} > ${part}` : part;
      getCategoryId(pathSoFar);
    }
  }
}

// --- lookup maps -------------------------------------------------------------

const productById = new Map();
const productBySku = new Map();
for (const row of raw) {
  if (row["ID"]) productById.set(row["ID"], row);
  if (row["SKU"]) productBySku.set(row["SKU"], row);
}

// --- products ----------------------------------------------------------------

let nextProductId = 1;
const productSourceIdMap = new Map();
const products = [];

for (const row of [...simpleRows, ...variableRows]) {
  const catStr = row["Kategori"] || "";
  const catSegments = catStr.split(",").map(c => c.trim()).filter(Boolean);
  const nonAddonSegs = catSegments.filter(seg => {
    const p = seg.split(" > ").map(x => x.trim());
    return !(p[0] === "Lainnya" && p[1] === "Asuransi");
  });
  const catNames = catSegments.map(seg => seg.split(" > ").pop()).filter(Boolean);

  let regularPrice = parsePrice(row["Harga normal"]);
  let salePrice = parsePrice(row["Harga obral"]);
  let isDummyPrice = false;
  let isPriceOutlier = false;

  if (regularPrice === null) { regularPrice = dummyPrice(catNames); isDummyPrice = true; }
  else if (regularPrice > MAX_PRICE) { regularPrice = dummyPrice(catNames); isPriceOutlier = true; }
  if (salePrice !== null && salePrice > MAX_PRICE) { salePrice = Math.round(regularPrice * 0.85); isPriceOutlier = true; }

  let stock = parseStock(row["Stok"]);
  if (stock === null) stock = randomStock();

  const images = parseImages(row["Gambar-gambar"], row["SKU"] || row["ID"]);

  let brandIdVal = row["Brand"] && row["Brand"].trim() ? getBrandId(row["Brand"].trim()) : null;
  if (!brandIdVal) {
    for (const seg of catSegments) {
      const parts = seg.split(" > ").map(p => p.trim());
      if (parts[0] === "Brand" && parts[1]) { brandIdVal = getBrandId(parts[1]); break; }
    }
  }

  const categoryIds = [];
  for (const seg of nonAddonSegs) {
    const s = slugify(seg);
    if (catPathMap.has(s)) categoryIds.push(catPathMap.get(s).id);
  }

  const productId = nextProductId++;
  productSourceIdMap.set(row["ID"], productId);

  products.push({
    id: productId,
    source_id: row["ID"],
    sku: row["SKU"] || "",
    name: row["Nama"] || "",
    slug: slugify(row["Nama"] || row["SKU"] || String(productId)),
    type: row["Tipe"] === "variable" ? "variable" : "simple",
    is_featured: row["Apakah diunggulkan?"] === "1",
    short_description: cleanHtml(row["Deskripsi singkat"]),
    description: cleanHtml(row["Deskripsi"]),
    regular_price: regularPrice,
    sale_price: salePrice,
    is_dummy_price: isDummyPrice,
    is_price_outlier: isPriceOutlier,
    stock,
    images,
    category_ids: [...new Set(categoryIds)],
    brand_id: brandIdVal,
    is_addon: nonAddonSegs.length === 0,
    attributes: buildAttributes(row),
  });
}

// --- variants ----------------------------------------------------------------

const variants = [];
let variantId = 1;

for (const row of variationRows) {
  const induk = row["Induk"] || "";
  let parentSourceId = null;

  if (induk.startsWith("id:")) {
    parentSourceId = induk.replace("id:", "").trim();
  } else if (induk) {
    const parentRow = productBySku.get(induk);
    if (parentRow) parentSourceId = parentRow["ID"];
  }

  const productId = parentSourceId ? productSourceIdMap.get(parentSourceId) : null;

  let regularPrice = parsePrice(row["Harga normal"]);
  let salePrice = parsePrice(row["Harga obral"]);
  let isDummyPrice = false;
  let isPriceOutlier = false;

  if (regularPrice === null) { regularPrice = dummyPrice([]); isDummyPrice = true; }
  else if (regularPrice > MAX_PRICE) { regularPrice = dummyPrice([]); isPriceOutlier = true; }
  if (salePrice !== null && salePrice > MAX_PRICE) { salePrice = Math.round(regularPrice * 0.85); isPriceOutlier = true; }

  let stock = parseStock(row["Stok"]);
  if (stock === null) stock = randomStock();

  const images = parseImages(row["Gambar-gambar"], row["SKU"] || row["ID"]);

  variants.push({
    id: variantId++,
    product_id: productId,
    source_id: row["ID"],
    sku: row["SKU"] || "",
    name: row["Nama"] || "",
    regular_price: regularPrice,
    sale_price: salePrice,
    is_dummy_price: isDummyPrice,
    is_price_outlier: isPriceOutlier,
    stock,
    images,
    attributes: buildAttributes(row),
  });
}

// --- product count per category & brand -------------------------------------

for (const product of products) {
  if (product.is_addon) continue;
  for (const cid of [...new Set(product.category_ids)]) {
    const cat = [...catPathMap.values()].find(c => c.id === cid);
    if (cat) cat.product_count++;
  }
  if (product.brand_id) {
    const brand = [...brandMap.values()].find(b => b.id === product.brand_id);
    if (brand) brand.product_count++;
  }
}

// --- deduplicate slugs -------------------------------------------------------

const slugCount = new Map();
for (const p of products) {
  const base = p.slug;
  const n = (slugCount.get(base) || 0) + 1;
  slugCount.set(base, n);
  if (n > 1) p.slug = `${base}-${n}`;
}

// --- write files -------------------------------------------------------------

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const productsIndex = products.map(p => ({
  id: p.id, sku: p.sku, name: p.name, slug: p.slug,
  type: p.type, is_featured: p.is_featured,
  regular_price: p.regular_price, sale_price: p.sale_price,
  is_dummy_price: p.is_dummy_price, stock: p.stock,
  images: p.images.slice(0, 1),
  category_ids: p.category_ids, brand_id: p.brand_id,
  is_addon: p.is_addon, attributes: p.attributes,
}));

fs.writeFileSync(path.join(OUT_DIR, "products.json"), JSON.stringify(products));
fs.writeFileSync(path.join(OUT_DIR, "products-index.json"), JSON.stringify(productsIndex));
fs.writeFileSync(path.join(OUT_DIR, "variants.json"), JSON.stringify(variants));
fs.writeFileSync(path.join(OUT_DIR, "categories.json"), JSON.stringify([...catPathMap.values()]));
fs.writeFileSync(path.join(OUT_DIR, "brands.json"), JSON.stringify([...brandMap.values()]));

// --- summary ------------------------------------------------------------------

console.log("\n? Transformation complete:");
console.log(`   products.json       ? ${products.length} products`);
console.log(`   products-index.json ? lightweight index`);
console.log(`   variants.json       ? ${variants.length} variants`);
console.log(`   categories.json     ? ${[...catPathMap.values()].length} categories`);
console.log(`   brands.json         ? ${[...brandMap.values()].length} brands`);
console.log(`   Dummy prices:       ${products.filter(p => p.is_dummy_price).length}`);
console.log(`   Outlier prices:     ${products.filter(p => p.is_price_outlier).length}`);
console.log(`   Add-on only:        ${products.filter(p => p.is_addon).length}`);
console.log(`   Fallback images:    ${products.filter(p => p.images[0].includes("picsum")).length}`);
console.log(`   Unlinked variants:  ${variants.filter(v => !v.product_id).length}`);
