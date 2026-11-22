import { REGIONS } from "../data/scholarships.js";
import { REQUIREMENTS, SEARCH_KEYWORDS } from "../data/requirements.js";

// Миний: тэтгэлгийг сургууль, улс, хот, нэрээр хайх.
// Хайлтын үг бүр (зайгаар тусгаарласан) тэтгэлгийн мэдээллийн аль нэг хэсэгт байх ёстой.

const norm = (t) => String(t || "").toLowerCase().trim();

// Ерөнхий үгс — сургуулийг тодруулахад тооцохгүй ("их сургууль" бүх сургуульд байдаг)
const GENERIC = new Set(["их", "сургууль", "сургуулиуд", "university", "of", "the", "улс"]);

// Монгол үгийн нөхцөл ("Токиод", "Солонгост", "Германы") таниулахын тулд
// үг олдохгүй бол төгсгөлөөс нь 1–3 үсэг хасаж дахин шалгана (4-өөс доошгүй үсэгтэй үлдэнэ).
function contains(text, word) {
  if (text.includes(word)) return true;
  for (let cut = 1; cut <= 3 && word.length - cut >= 4; cut++) {
    if (text.includes(word.slice(0, -cut))) return true;
  }
  return false;
}

// Нэг тэтгэлгийг хайлтын үгтэй харьцуулна.
// Буцаах: null (таарахгүй) эсвэл { universities: [хайлтад таарсан сургуулиуд] }
export function matchScholarship(s, region, query) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  const unis = REQUIREMENTS[s.name]?.universities || [];
  if (!words.length) return { universities: [] };

  const haystack = norm([s.name, s.country, s.provider, region.name, SEARCH_KEYWORDS[s.name], ...unis].join(" "));
  if (!words.every((w) => contains(haystack, w))) return null;

  // Аль сургууль таарсныг тодруулна: эхлээд бүх үгтэй таарсныг, үгүй бол ерөнхий бус аль нэг үгтэй таарсныг
  const specific = words.filter((w) => !GENERIC.has(w));
  const all = unis.filter((u) => words.every((w) => contains(norm(u), w)));
  const any = unis.filter((u) => specific.some((w) => contains(norm(u), w)));
  return { universities: all.length ? all : any };
}

// Хайлтын санал болгох жагсаалт: бүх улс + бүх сургууль (давхардалгүй)
export function searchSuggestions() {
  const list = REGIONS.flatMap((r) =>
    r.scholarships.flatMap((s) => [s.country, ...(REQUIREMENTS[s.name]?.universities || [])])
  );
  return [...new Set(list)].sort((a, b) => a.localeCompare(b, "mn"));
}
