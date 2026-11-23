// 2.9 Хэл солих — номын convertNutritionsEnMn.js-ийн тэтгэлгийн хувилбар.
// src/data/scholarships.json (монгол) + tools/dictionary-en.json (монгол → англи толь)
//   → src/data/scholarshipsEnMn.json (текст талбар бүр { mn, en } хэлбэртэй).
// Ажиллуулах: npm run convert:enmn
// Миний: орчуулга олдоогүй утгыг жагсааж хэвлэнэ. Кирилл үсэггүй утга ("Chevening", "KAIST")
// өөрчлөлтгүй хоёр хэлэнд адилхан үлдэнэ.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const data = JSON.parse(readFileSync(new URL("src/data/scholarships.json", root), "utf8"));
const dict = JSON.parse(readFileSync(new URL("tools/dictionary-en.json", root), "utf8"));

// Илүү/дутуу зай, мөр шилжилтийг нэг зай болгож харьцуулна
const normalize = (s) => String(s).replace(/\s+/g, " ").trim();
const dictN = new Map(Object.entries(dict).map(([mn, en]) => [normalize(mn), en]));
const missing = new Set();

function tr(value) {
  const mn = normalize(value);
  if (!/[А-Яа-яЁёӨөҮү]/.test(mn)) return { mn, en: mn };
  const en = dictN.get(mn);
  if (!en) missing.add(mn);
  return { mn, en: en ?? mn };
}

const out = {
  regions: data.regions.map((r) => ({
    ...r,
    name: tr(r.name),
    scholarships: r.scholarships.map((s) => ({
      ...s,
      name: tr(s.name),
      country: tr(s.country),
      provider: tr(s.provider),
      deadline: tr(s.deadline),
      text: tr(s.text),
      requirements: { ...s.requirements, note: tr(s.requirements.note) },
      universities: s.universities.map(tr),
    })),
  })),
};

writeFileSync(new URL("src/data/scholarshipsEnMn.json", root), JSON.stringify(out, null, 2) + "\n");
const count = out.regions.reduce((n, r) => n + r.scholarships.length, 0);
console.log(`scholarshipsEnMn.json: ${out.regions.length} бүс, ${count} тэтгэлэг`);
if (missing.size) {
  console.log(`Орчуулга олдоогүй ${missing.size} утга:`);
  missing.forEach((m) => console.log("  -", m));
  process.exitCode = 1;
} else {
  console.log("Бүх утга орчуулагдсан.");
}
