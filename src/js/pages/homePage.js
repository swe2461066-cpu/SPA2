import { getRegions, getAllScholarships } from "../services/scholarshipService.js";
import { getUser } from "../fn/auth.js";
import { t, loc } from "../i18n/i18n.js";

// Миний: нүүр хуудсыг сургуулийн вэбсайтын загвараар (Wix "school" template-ийн бүтэц) хийв:
//   hero (зураг + өнгөт хайрцаг) → төвд гарчигтай хэсэг → зураг/хар хөх ээлжилсэн мөрүүд →
//   онцлох тэтгэлгийн картууд → хэрэгслүүд → улсуудын зургийн сүлжээ → мэдээ захиалах форм.
// 5-р ажлаас: өгөгдлийг service-ээс авч, бичвэр бүрийг t() -ээр 2 хэлээр харуулна.
// Зургууд: Unsplash (үнэгүй лиценз), шууд холбоосоор ачаална.
const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const HERO_IMG = img("1541339907198-e08756dedf3f", 1920);

// Онцлох 3 тэтгэлэг: id-аар нь өгөгдлөөс хайж, мэдээллийг автоматаар авна
const FEATURED = [
  { id: "mext", photo: "1545569341-9eb8b30979d9" },
  { id: "chevening", photo: "1513635269975-59663e0ac1ad" },
  { id: "fulbright", photo: "1496588152823-86ff7695e68f" },
];

// Улсуудын зургийн сүлжээ (4 x 2). Дарахад тухайн улсаар хайсан тэтгэлгүүд рүү шилжинэ.
const COUNTRIES = [
  { mn: "Япон", en: "Japan", photo: "1513407030348-c983a97b98d8" },
  { mn: "Өмнөд Солонгос", en: "South Korea", photo: "1538485399081-7191377e8241" },
  { mn: "Хятад", en: "China", photo: "1508804185872-d7badad00f7d" },
  { mn: "Турк", en: "Türkiye", photo: "1524231757912-21f4fe3a7200" },
  { mn: "Их Британи", en: "United Kingdom", photo: "1486299267070-83823f5448dd" },
  { mn: "Герман", en: "Germany", photo: "1587330979470-3595ac045ab0" },
  { mn: "Унгар", en: "Hungary", photo: "1541343672885-9be56236302a" },
  { mn: "Австрали", en: "Australia", photo: "1506973035872-a4ec16b8e8d9" },
];

// Хэрэгслүүд (6-р ажлын хуудсууд руу)
const TOOLS = [
  { href: "#/overview", icon: "fa-earth-asia", title: "nav.overview", text: "home.mapText" },
  { href: "#/calculator", icon: "fa-calculator", title: "nav.calculator", text: "home.tool.calc" },
  { href: "#/guides", icon: "fa-book-open", title: "nav.guides", text: "home.tool.guides" },
  { href: "#/eligibility", icon: "fa-list-check", title: "nav.eligibility", text: "home.tool.elig" },
];

export function renderHomePage() {
  const app = document.getElementById("app");
  const user = getUser();
  const regions = getRegions();

  // Тоон үзүүлэлтийг өгөгдлөөс тоолно (гараар бичихгүй)
  const all = getAllScholarships();
  const countryCount = new Set(all.map((s) => s.country)).size;
  const fullCount = all.filter((s) => s.coverage === "full").length;

  const stats = [
    [all.length, t("home.stat.scholarships")],
    [countryCount, t("home.stat.countries")],
    [fullCount, t("home.stat.full")],
    [regions.length, t("home.stat.regions")],
  ]
    .map(([v, l]) => `<div class="app-stat"><strong>${v}</strong><span>${l}</span></div>`)
    .join("");

  const featured = FEATURED.map((f) => ({ ...all.find((s) => s.id === f.id), photo: f.photo }))
    .filter((s) => s.region)
    .map(
      (s) => `
      <a class="app-news-card" href="#/scholarships?q=${encodeURIComponent(s.name)}" style="--bg:url('${img(s.photo, 800)}')">
        <span class="app-news-meta">${s.country} · ${s.deadline}</span>
        <h3>${s.name}</h3>
        <span class="app-news-foot">
          <span>${s.coverage === "full" ? t("common.fullScholarship") : t("common.partial")}</span>
          <i class="fas fa-arrow-right"></i>
        </span>
      </a>`
    )
    .join("");

  const countries = COUNTRIES.map(
    (c) => `
      <a class="app-gallery-item" href="#/scholarships?q=${encodeURIComponent(c.en)}">
        <img src="${img(c.photo, 500)}" alt="${loc(c)}" loading="lazy" />
        <span>${loc(c)}</span>
      </a>`
  ).join("");

  const tools = TOOLS.map(
    (tool) => `
      <a class="app-tool" href="${tool.href}">
        <span class="app-tool-icon"><i class="fas ${tool.icon}"></i></span>
        <strong>${t(tool.title)}</strong>
        <span>${t(tool.text)}</span>
      </a>`
  ).join("");

  // Нэвтэрсэн бол бүртгүүлэх хэсгийн оронд профайл бөглөхийг санал болгоно
  const join = user
    ? { title: t("home.profileTitle"), text: t("home.profileText"), href: "#/profile", btn: t("home.profileBtn") }
    : { title: t("home.joinTitle"), text: t("home.joinText"), href: "#/register", btn: t("home.joinBtn") };

  app.innerHTML = `
    <div class="app-home">
      <!-- 1. Hero: зураг + өнгөт хайрцаг -->
      <section class="app-hero" style="--hero:url('${HERO_IMG}')">
        <div class="container">
          <div class="app-hero-box">
            <h1>${t("home.heroTitle")}</h1>
            <p>${t("home.heroText", { count: all.length })}</p>
            <a class="button app-btn-dark" href="#/scholarships">${t("home.heroBtn")}</a>
          </div>
        </div>
      </section>

      <!-- 2. Төвд гарчигтай хэсэг -->
      <section class="app-band app-center">
        <div class="container">
          <h2 class="app-display">${t("home.bandTitle")}</h2>
          <p>${t("home.bandText")}</p>
          <a class="button is-primary" href="#/eligibility">${t("home.bandBtn")}</a>
          <div class="app-stats">${stats}</div>
        </div>
      </section>

      <!-- 3. Зураг / хар хөх ээлжилсэн мөрүүд -->
      <section class="app-split">
        <div class="app-split-img" style="--bg:url('${img("1522202176988-66273c2fd55f")}')"></div>
        <div class="app-split-text">
          <h2>${t("home.split1Title")}</h2>
          <p>${t("home.split1Text")}</p>
          <a class="button is-primary" href="#/scholarships">${t("home.heroBtn")}</a>
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
          <h2 class="app-display has-text-centered">${t("home.featured")}</h2>
        </div>
        <div class="app-news-band">
          <div class="container">
            <div class="app-news-grid">${featured}</div>
            <div class="has-text-centered">
              <a class="button app-btn-dark" href="#/scholarships">${t("home.allBtn")}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Хэрэгслүүд (газрын зураг, зардал, гарын авлага, тэнцэх эсэх) -->
      <section class="app-band app-tools-band">
        <div class="container">
          <h2 class="app-display has-text-centered">${t("home.toolsTitle")}</h2>
          <div class="app-tools">${tools}</div>
        </div>
      </section>

      <!-- 6. Улсуудын зургийн сүлжээ -->
      <section class="app-gallery">
        <div class="container">
          <h2 class="app-display has-text-centered">${t("home.where")}</h2>
          <div class="app-gallery-grid">${countries}</div>
        </div>
      </section>

      <!-- 7. Мэдээ захиалах -->
      <section class="app-band app-subscribe">
        <div class="container">
          <h2 class="app-display has-text-centered">${t("home.subTitle")}</h2>
          <p class="has-text-centered">${t("home.subText")}</p>
          <form id="subscribeForm" class="app-subscribe-form" novalidate>
            <div class="app-subscribe-row">
              <label class="app-sr" for="subEmail">${t("home.subEmail")}</label>
              <input id="subEmail" class="input" name="email" type="email" autocomplete="email" placeholder="${t("home.subPlaceholder")}" />
              <button class="button app-btn-dark" type="submit">${t("home.subBtn")}</button>
            </div>
            <label class="checkbox mt-3">
              <input type="checkbox" name="agree" /> ${t("home.subAgree")}
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t("home.subBadEmail"));
  if (!form.elements.agree.checked) return fail(t("home.subNoAgree"));

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
  msg.textContent = already ? t("home.subAlready") : t("home.subDone");
  msg.className = "help is-success";
  form.reset();
}
