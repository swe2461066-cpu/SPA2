import { REGIONS } from "../data/scholarships.js";
import { REQUIREMENTS } from "../data/requirements.js";

// Миний: тэнцэх эсэх тооцоолуурын логик (DOM-гүй цэвэр функцууд).

const num = (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v));

// Голч дүнг 100 онооны хэмжүүр рүү хөрвүүлнэ. Хэмжүүр сонгоогүй бол 4.5-аас бага утгыг 4.0 гэж үзнэ.
export function gpaTo100(gpa, scale) {
  const g = num(gpa);
  if (g == null) return null;
  const is4 = scale === "4.0" || (!scale && g <= 4.5);
  return is4 ? Math.round((g / 4) * 1000) / 10 : g;
}

// Профайлаас тооцоолуурт хэрэгтэй утгуудыг авна.
// IELTS/TOPIK тусдаа талбар хоосон бол "Сертификат + Нийт оноо"-оос авч үзнэ.
export function scoresFromProfile(user) {
  const p = user?.profile || {};
  const lang = p.language || {};
  const ielts = num(lang.ielts) ?? (lang.certificate === "IELTS" ? num(lang.overall) : null);
  const topikOverall = lang.certificate === "TOPIK" ? num(lang.overall) : null;
  const topik = num(lang.topik) ?? (topikOverall != null && topikOverall <= 6 ? topikOverall : null);
  return {
    gpa: p.academic?.gpa ?? "",
    gpaScale: p.academic?.gpaScale ?? "",
    ielts: ielts ?? "",
    topik: topik ?? "",
    degree: p.preferences?.degree ?? "",
    field: p.preferences?.field ?? "",
  };
}

// Нэг тэтгэлгийг хэрэглэгчийн оноотой харьцуулна.
// status: match (тэнцэнэ) | close (бага зэрэг дутуу) | unknown (оноо оруулаагүй) | no (тэнцэхгүй)
export function checkScholarship(req, input) {
  const gpa = gpaTo100(input.gpa, input.gpaScale);
  const ielts = num(input.ielts);
  const topik = num(input.topik);
  const checks = [];

  // 1. Голч дүн (5 оноо хүртэл дутуу бол "ойрхон")
  if (gpa == null) checks.push({ label: `Голч дүн ≥ ${req.gpa}%`, state: "unknown", have: "оруулаагүй" });
  else checks.push({ label: `Голч дүн ≥ ${req.gpa}%`, state: gpa >= req.gpa ? "ok" : gpa >= req.gpa - 5 ? "close" : "no", have: `${gpa}%` });

  // 2. Хэлний оноо: IELTS эсвэл TOPIK — аль нэгийг хангахад болно
  if (req.ielts == null && req.topik == null) {
    checks.push({ label: "Хэлний оноо шаардахгүй", state: "ok", have: "" });
  } else {
    const opts = [];
    if (req.ielts != null && ielts != null) opts.push(ielts >= req.ielts ? "ok" : ielts >= req.ielts - 0.5 ? "close" : "no");
    if (req.topik != null && topik != null) opts.push(topik >= req.topik ? "ok" : topik >= req.topik - 1 ? "close" : "no");
    const need = [req.ielts != null && `IELTS ${req.ielts.toFixed(1)}`, req.topik != null && `TOPIK ${req.topik}`].filter(Boolean).join(" эсвэл ");
    const have = [ielts != null && req.ielts != null && `IELTS ${ielts}`, topik != null && req.topik != null && `TOPIK ${topik}`].filter(Boolean).join(", ");
    const state = !opts.length ? "unknown" : opts.includes("ok") ? "ok" : opts.includes("close") ? "close" : "no";
    checks.push({ label: `${need}+`, state, have: have || "оруулаагүй" });
  }

  const states = checks.map((c) => c.state);
  const status = states.includes("no") ? "no" : states.includes("close") ? "close" : states.includes("unknown") ? "unknown" : "match";
  return { status, checks };
}

const ORDER = { match: 0, close: 1, unknown: 2, no: 3 };

// Бүх тэтгэлгийг шалгаж, тэнцэх магадлалаар эрэмбэлнэ.
// onlyMine = true бол сонгосон түвшин, мэргэжилд хамаарахгүй тэтгэлгийг хасна.
export function evaluateAll(input, onlyMine = true) {
  return REGIONS.flatMap((region) =>
    region.scholarships.map((s) => ({ ...s, region, req: REQUIREMENTS[s.name] }))
  )
    .filter((s) => s.req)
    .filter((s) => !onlyMine || !input.degree || s.levels.includes(input.degree))
    .filter((s) => !onlyMine || !input.field || s.fields === "all" || s.fields.includes(input.field))
    .map((s) => ({ ...s, ...checkScholarship(s.req, input) }))
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);
}
