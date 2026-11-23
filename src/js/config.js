// 2.6 Тохиргоо — өгөгдлийн файлуудын зам нэг газар.
// Номд nutritions.json-ийн замыг service бүрт бичсэн байсныг энд төвлөрүүлэв.
// index.html-ээс харьцангуй зам тул GitHub Pages (/SPA2/) дээр ч ажиллана.
export const CONFIG = {
  data: {
    scholarships: "./data/scholarshipsEnMn.json", // tools/convertScholarshipsEnMn.mjs үүсгэнэ
    images: "./data/images.json", // tools/generate-images-json.mjs үүсгэнэ
    costs: "./data/costs.json",
    guides: "./data/guides.json",
    txt: "./data/txt.json",
    worldMap: "./img/world.svg", // tools/buildWorldMap.mjs үүсгэнэ
  },
  currency: "USD",
};

// Бүх service-д нийтлэг JSON/текст татах функц. Алдаа гарвал ойлгомжтой мессежтэй шиднэ.
export async function fetchData(path, as = "json") {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return as === "text" ? res.text() : res.json();
}
