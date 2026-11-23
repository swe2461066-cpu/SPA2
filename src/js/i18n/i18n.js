import { translations } from "./translations.js";

// 2.9 Хэл солих (MN/EN).
// Миний: номд хэлийг хувьсагчид хадгалж, хуудас сэргээхэд монгол руу буцдаг байсан.
// Энд сонгосон хэлийг localStorage-д хадгалж, солиход "lang-change" event цацна —
// app.js түүнийг сонсоод navbar, footer, тухайн хуудсыг дахин зурна.

const KEY = "tetgeleg_lang";
const SUPPORTED = ["mn", "en"];

let lang = readSaved();
document.documentElement.lang = lang;

function readSaved() {
  try {
    const saved = localStorage.getItem(KEY);
    return SUPPORTED.includes(saved) ? saved : "mn";
  } catch {
    return "mn";
  }
}

export const getLang = () => lang;

export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === lang) return;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* хадгалах боломжгүй бол зөвхөн энэ удаад солигдоно */
  }
  document.documentElement.lang = next;
  window.dispatchEvent(new CustomEvent("lang-change", { detail: next }));
}

// Интерфэйсийн бичвэр: t("sch.count", { count: 5 }) → "5 тэтгэлэг олдлоо"
// Англи орчуулга байхгүй бол монголоор, тэр нь ч байхгүй бол түлхүүрийг өөрийг нь буцаана.
export function t(key, vars = {}) {
  const text = translations[lang]?.[key] ?? translations.mn[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

// Өгөгдлийн { mn, en } утгаас одоогийн хэлнийхийг авна. Энгийн текст бол өөрчлөхгүй.
export function loc(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value[lang] ?? value.mn;
  return value;
}
