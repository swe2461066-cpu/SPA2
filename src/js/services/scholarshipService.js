import { CONFIG, fetchData } from "../config.js";
import { getLang, loc } from "../i18n/i18n.js";

// 2.6 Service давхарга — номын nutritionService.js-ийн тэтгэлгийн хувилбар.
// Хуудсууд өгөгдлийг шууд import хийхгүй, энэ service-ээр дамжуулж авна.
//   loadScholarships() — JSON-ийг нэг удаа татаж, санах ойд хадгална (дахин fetch хийхгүй)
//   getRegions()       — одоогийн хэл дээрх бүс, тэтгэлгүүд
// Миний: JSON-д текст бүр { mn, en } хэлбэртэй. Хэл солигдох бүрд нэг удаа хөрвүүлж cache-лана.

let raw = null;
let cache = { lang: null, regions: [] };

export async function loadScholarships() {
  raw ??= await fetchData(CONFIG.data.scholarships);
  return raw;
}

export function getRegions() {
  if (!raw) return [];
  if (cache.lang !== getLang()) cache = { lang: getLang(), regions: raw.regions.map(localizeRegion) };
  return cache.regions;
}

// Бүх тэтгэлэг, бүсийнх нь мэдээлэлтэй
export function getAllScholarships() {
  return getRegions().flatMap((region) => region.scholarships.map((s) => ({ ...s, region })));
}

export function getScholarship(id) {
  return getAllScholarships().find((s) => s.id === id) || null;
}

const both = (v) => (v && typeof v === "object" ? `${v.mn} ${v.en}` : v || "");

function localizeRegion(r) {
  return {
    id: r.id,
    icon: r.icon,
    color: r.color,
    name: loc(r.name),
    scholarships: r.scholarships.map((s) => ({
      id: s.id,
      name: loc(s.name),
      country: loc(s.country),
      provider: loc(s.provider),
      deadline: loc(s.deadline),
      text: loc(s.text),
      url: s.url,
      levels: s.levels,
      coverage: s.coverage,
      fields: s.fields,
      mapIds: s.mapIds,
      requirements: { ...s.requirements, note: loc(s.requirements.note) },
      universities: s.universities.map(loc),
      // Хайлтад хоёр хэлний нэрийг хоёуланг нь ашиглана ("Japan", "Япон" хоёулаа олдоно)
      uniPairs: s.universities.map((u) => ({ label: loc(u), text: both(u).toLowerCase() })),
      searchText: [s.name, s.country, s.provider, r.name, ...s.universities].map(both).concat(s.keywords).join(" ").toLowerCase(),
    })),
  };
}
