// Миний: тэтгэлгийг сургууль, улс, хот, нэрээр хайх.
// Хайлтын үг бүр (зайгаар тусгаарласан) тэтгэлгийн мэдээллийн аль нэг хэсэгт байх ёстой.
// 5-р ажлаас: монгол, англи нэрийн аль алинаар нь хайна (service-ийн searchText).

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
export function matchScholarship(s, query) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return { universities: [] };
  if (!words.every((w) => contains(s.searchText, w))) return null;

  // Аль сургууль таарсныг тодруулна: эхлээд бүх үгтэй таарсныг, үгүй бол ерөнхий бус аль нэг үгтэй таарсныг
  const specific = words.filter((w) => !GENERIC.has(w));
  const all = s.uniPairs.filter((u) => words.every((w) => contains(u.text, w)));
  const any = s.uniPairs.filter((u) => specific.some((w) => contains(u.text, w)));
  return { universities: (all.length ? all : any).map((u) => u.label) };
}

