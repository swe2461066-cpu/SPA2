import { REGIONS } from "../data/scholarships.js";
import { getUser } from "../fn/auth.js";

// Миний: нүүр хуудсыг сургуулийн вэбсайтын загвараар (Wix "school" template-ийн бүтэц) хийв:
//   hero (зураг + өнгөт хайрцаг) → төвд гарчигтай хэсэг → зураг/хар хөх ээлжилсэн 2 мөр →
//   онцлох тэтгэлгийн картууд → улсуудын зургийн сүлжээ → мэдээ захиалах форм.
// Зургууд: Unsplash (үнэгүй лиценз), шууд холбоосоор ачаална.
const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const HERO_IMG = img("1541339907198-e08756dedf3f", 1920);

// Онцлох 3 тэтгэлэг: нэрээр нь өгөгдлөөс хайж, мэдээллийг автоматаар авна
const FEATURED = [
  { name: "MEXT тэтгэлэг", photo: "1545569341-9eb8b30979d9" },
  { name: "Chevening", photo: "1513635269975-59663e0ac1ad" },
  { name: "Fulbright", photo: "1496588152823-86ff7695e68f" },
];

// Улсуудын зургийн сүлжээ (4 x 2). Дарахад тухайн бүсийн тэтгэлгүүд рүү шилжинэ.
const COUNTRIES = [
  { name: "Япон", region: "asia", photo: "1513407030348-c983a97b98d8" },
  { name: "Өмнөд Солонгос", region: "asia", photo: "1538485399081-7191377e8241" },
  { name: "Хятад", region: "asia", photo: "1508804185872-d7badad00f7d" },
  { name: "Турк", region: "asia", photo: "1524231757912-21f4fe3a7200" },
  { name: "Их Британи", region: "europe", photo: "1486299267070-83823f5448dd" },
  { name: "Герман", region: "europe", photo: "1587330979470-3595ac045ab0" },
  { name: "Унгар", region: "europe", photo: "1541343672885-9be56236302a" },
  { name: "Австрали", region: "americas", photo: "1506973035872-a4ec16b8e8d9" },
];

export function renderHomePage() {
  const app = document.getElementById("app");
  const user = getUser();

  // Тоон үзүүлэлтийг өгөгдлөөс тоолно (гараар бичихгүй)
  const all = REGIONS.flatMap((r) => r.scholarships.map((s) => ({ ...s, region: r })));
  const countryCount = new Set(all.map((s) => s.country)).size;
  const fullCount = all.filter((s) => s.coverage === "full").length;

  const stats = [
    [all.length, "Тэтгэлэг"],
    [countryCount, "Улс орон"],
    [fullCount, "Бүрэн тэтгэлэг"],
    [REGIONS.length, "Бүс нутаг"],
  ]
    .map(([v, l]) => `<div class="app-stat"><strong>${v}</strong><span>${l}</span></div>`)
    .join("");

  const featured = FEATURED.map((f) => ({ ...all.find((s) => s.name === f.name), photo: f.photo }))
    .filter((s) => s.region)
    .map(
      (s) => `
      <a class="app-news-card" href="#/scholarships?region=${s.region.id}" style="--bg:url('${img(s.photo, 800)}')">
        <span class="app-news-meta">${s.country} · ${s.deadline}</span>
        <h3>${s.name}</h3>
        <span class="app-news-foot">
          <span>${s.coverage === "full" ? "Бүрэн тэтгэлэг" : "Хэсэгчилсэн"}</span>
          <i class="fas fa-arrow-right"></i>
        </span>
      </a>`
    )
    .join("");

  const countries = COUNTRIES.map(
    (c) => `
      <a class="app-gallery-item" href="#/scholarships?region=${c.region}">
        <img src="${img(c.photo, 500)}" alt="${c.name}" loading="lazy" />
        <span>${c.name}</span>
      </a>`
  ).join("");

  // Нэвтэрсэн бол бүртгүүлэх хэсгийн оронд профайл бөглөхийг санал болгоно
  const join = user
    ? { title: "Миний профайл", text: "Боловсрол, хэлний оноо, бичиг баримтаа профайлдаа бөглөж, өргөдөлдөө бэлэн байгаарай.", href: "#/profile", btn: "Профайл руу" }
    : { title: "Бүртгүүлэх", text: "Бүртгэл үүсгээд суралцах түвшин, мэргэжилдээ тохирох тэтгэлгийг хадгалж, профайлдаа бичиг баримтаа цэгцлээрэй.", href: "#/register", btn: "Одоо бүртгүүлэх" };

  app.innerHTML = `
    <div class="app-home">
      <!-- 1. Hero: зураг + өнгөт хайрцаг -->
      <section class="app-hero" style="--hero:url('${HERO_IMG}')">
        <div class="container">
          <div class="app-hero-box">
            <h1>Гадаадад суралц</h1>
            <p>Монгол оюутнуудад зориулсан ${all.length} тэтгэлэг нэг дор</p>
            <a class="button app-btn-dark" href="#/scholarships">Тэтгэлэг хайх</a>
          </div>
        </div>
      </section>

      <!-- 2. Төвд гарчигтай хэсэг -->
      <section class="app-band app-center">
        <div class="container">
          <h2 class="app-display">Өргөдлөө цагтаа өгөөрэй</h2>
          <p>Ихэнх тэтгэлгийн бүртгэл 10-р сараас 3-р сарын хооронд явагддаг. Хугацаа, шаардлагыг албан сайтаас нь заавал шалгаж, бичиг баримтаа эрт бүрдүүлээрэй.</p>
          <a class="button is-primary" href="#/eligibility">Тэнцэх эсэхээ шалгах</a>
          <div class="app-stats">${stats}</div>
        </div>
      </section>

      <!-- 3. Зураг / хар хөх ээлжилсэн мөрүүд -->
      <section class="app-split">
        <div class="app-split-img" style="--bg:url('${img("1522202176988-66273c2fd55f")}')"></div>
        <div class="app-split-text">
          <h2>Тэтгэлгүүд</h2>
          <p>Ази, Европ, Америк, Австрали болон Монгол Улсын тэтгэлгийг бүс, суралцах түвшин, мэргэжлээр нь шүүж харьцуулаарай.</p>
          <a class="button is-primary" href="#/scholarships">Тэтгэлэг хайх</a>
        </div>
      </section>
      <section class="app-split is-reversed">
        <div class="app-split-img" style="--bg:url('${img("1523580846011-d3a5bc25702b")}')"></div>
        <div class="app-split-text">
          <h2>${join.title}</h2>
          <p>${join.text}</p>
          <a class="button is-primary" href="${join.href}">${join.btn}</a>
        </div>
      </section>

      <!-- 4. Онцлох тэтгэлгүүд -->
      <section class="app-news">
        <div class="container">
          <h2 class="app-display has-text-centered">Онцлох тэтгэлэг</h2>
        </div>
        <div class="app-news-band">
          <div class="container">
            <div class="app-news-grid">${featured}</div>
            <div class="has-text-centered">
              <a class="button app-btn-dark" href="#/scholarships">Бүх тэтгэлгийг харах</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Улсуудын зургийн сүлжээ -->
      <section class="app-gallery">
        <div class="container">
          <h2 class="app-display has-text-centered">Хаана суралцах вэ?</h2>
          <div class="app-gallery-grid">${countries}</div>
        </div>
      </section>

      <!-- 6. Мэдээ захиалах -->
      <section class="app-band app-subscribe">
        <div class="container">
          <h2 class="app-display has-text-centered">Шинэ тэтгэлгийн мэдээ</h2>
          <p class="has-text-centered">Шинэ тэтгэлэг зарлагдахад хамгийн түрүүнд мэдээрэй</p>
          <form id="subscribeForm" class="app-subscribe-form" novalidate>
            <div class="app-subscribe-row">
              <label class="app-sr" for="subEmail">И-мэйл</label>
              <input id="subEmail" class="input" name="email" type="email" autocomplete="email" placeholder="И-мэйл хаягаа оруулна уу" />
              <button class="button app-btn-dark" type="submit">Захиалах</button>
            </div>
            <label class="checkbox mt-3">
              <input type="checkbox" name="agree" /> Тийм, мэдээллийн хуудас авахыг зөвшөөрч байна.*
            </label>
            <p class="help" id="subMsg" role="status"></p>
          </form>
        </div>
      </section>
    </div>
  `;

  document.getElementById("subscribeForm").addEventListener("submit", handleSubscribe);
}

// Мэдээ захиалах: и-мэйл, зөвшөөрлийг шалгаад хөтөчид хадгална (сургалтын төсөл — сервергүй)
function handleSubscribe(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const msg = document.getElementById("subMsg");

  const fail = (text) => {
    msg.textContent = text;
    msg.className = "help is-danger";
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("И-мэйл хаяг буруу байна.");
  if (!form.elements.agree.checked) return fail("Зөвшөөрлийн нүдийг чагтлана уу.");

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem("tetgeleg_newsletter") || "[]");
  } catch {
    list = [];
  }
  const already = list.includes(email.toLowerCase());
  if (!already) {
    list.push(email.toLowerCase());
    try {
      localStorage.setItem("tetgeleg_newsletter", JSON.stringify(list));
    } catch {
      /* хадгалах боломжгүй бол зүгээр алгасна */
    }
  }
  msg.textContent = already ? "Та аль хэдийн захиалсан байна." : "Баярлалаа! Таныг захиалагчдын жагсаалтад нэмлээ.";
  msg.className = "help is-success";
  form.reset();
}
