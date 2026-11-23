// 2.8 Дээжийн зураг — номын generate-images-json.mjs-ийн тэтгэлгийн хувилбар.
// Номд img/foods/<код>/ хавтас доторх файлуудыг уншиж images.json үүсгэдэг.
// Миний: энд зургийг төсөлд хадгалахгүй, Unsplash (үнэгүй лиценз)-ийн зургийн id-аас
//   tools/imageSources.json → src/data/images.json  { тэтгэлгийн id: [{ thumb, full }] }
// болгож үүсгэнэ. Зураг бүрийг сүлжээгээр шалгаж, ажиллахгүй id-г алгасаад хэвлэнэ.
// Ажиллуулах: npm run generate:images
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const sources = JSON.parse(readFileSync(new URL("tools/imageSources.json", root), "utf8"));
const data = JSON.parse(readFileSync(new URL("src/data/scholarships.json", root), "utf8"));
const ids = new Set(data.regions.flatMap((r) => r.scholarships.map((s) => s.id)));

const url = (photo, w, h) =>
  `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=70`;

async function exists(photo) {
  try {
    const res = await fetch(url(photo, 40, 40), { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

const out = {};
const broken = [];
for (const [id, photos] of Object.entries(sources)) {
  if (!ids.has(id)) console.warn(`Анхаар: "${id}" гэсэн тэтгэлэг scholarships.json-д алга`);
  const ok = [];
  for (const p of photos) (await exists(p)) ? ok.push(p) : broken.push(`${id}: ${p}`);
  out[id] = ok.map((p) => ({ thumb: url(p, 640, 400), full: url(p, 1600) }));
}
ids.forEach((id) => out[id] || console.warn(`Анхаар: "${id}" тэтгэлэгт зураг байхгүй`));

writeFileSync(new URL("src/data/images.json", root), JSON.stringify(out, null, 2) + "\n");
const total = Object.values(out).reduce((n, list) => n + list.length, 0);
console.log(`images.json: ${Object.keys(out).length} тэтгэлэг, ${total} зураг`);
if (broken.length) console.log("Ажиллахгүй зураг:\n  " + broken.join("\n  "));
