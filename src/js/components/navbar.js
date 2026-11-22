import { getUser, logout } from "../fn/auth.js";
import { escapeHtml } from "../fn/escapeHtml.js";

// Дээд цэс. Цэсийн мөрүүдийг массиваас үүсгэнэ.
// Миний: номд <a> бүрийг гараар давтаж бичсэн байсныг NAV_ITEMS массив болгосон.
const NAV_ITEMS = [
  { href: "#/home", label: "Нүүр" },
  { href: "#/scholarships", label: "Тэтгэлгүүд" },
  { href: "#/eligibility", label: "Тэнцэх эсэх" },
  { href: "#/contact", label: "Зөвлөгөө авах" },
  { href: "#/profile", label: "Миний профайл" },
];

// Миний: сургуулийн сайтын загвар шиг 2 давхар толгой —
//   1) цагаан мөр: зүүнд хайлт, голд лого, баруунд нэвтрэх хэсэг (доош гүйлгэхэд нуугдана)
//   2) хар хөх цэсний зурвас (дээрээ наалдаж үлдэнэ)
export function renderNavbar() {
  const links = NAV_ITEMS.map(
    (item) => `<a class="navbar-item" href="${item.href}">${item.label}</a>`
  ).join("");

  return `
    <header class="app-header">
      <div class="container app-topbar">
        <button class="app-top-search" id="searchToggle" type="button" aria-label="Сургууль, улсаар хайх" aria-expanded="false" aria-controls="headerSearch" title="Сургууль, улсаар хайх">
          <i class="fas fa-magnifying-glass"></i>
        </button>
        <a class="app-logo" href="#/home">
          <img src="./img/icon/logo.svg" alt="" width="44" height="50" />
          <span class="app-logo-text">
            <strong>Тэтгэлэг хайх</strong>
            <small>Гадаадад суралцах портал</small>
          </span>
        </a>
        <div class="app-top-right">
          <div class="app-auth" id="authArea">${renderAuthArea()}</div>
          <button class="navbar-burger" type="button" aria-label="Цэс" aria-expanded="false" data-target="topNavbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <form class="app-search-panel" id="headerSearch" role="search">
        <div class="container">
          <span class="icon"><i class="fas fa-magnifying-glass"></i></span>
          <input class="input" name="q" type="search" autocomplete="off" maxlength="80"
            placeholder="Сонирхож буй сургууль эсвэл улс — жишээ: Токио, KAIST, Герман" aria-label="Сургууль эсвэл улсаар хайх" />
          <button class="button is-primary" type="submit">Хайх</button>
        </div>
      </form>
      <nav class="app-navbar" id="topNavbar" aria-label="Үндсэн цэс">
        <div class="container app-navbar-links">${links}</div>
      </nav>
    </header>
  `;
}

// Баруун дээд хэсэг:
//   нэвтрээгүй — "Нэвтрэх" холбоос + "Бүртгүүлэх" товч
//   нэвтэрсэн  — профайлын зураг, нэр + "Гарах"
function renderAuthArea() {
  const user = getUser();
  if (!user) {
    return `
      <a class="app-login-link" href="#/login">
        <i class="fas fa-circle-user"></i><span>Нэвтрэх</span>
      </a>
      <a class="button is-primary app-register-btn" href="#/register">Бүртгүүлэх</a>`;
  }
  const avatar = user.photo
    ? `<img class="app-nav-avatar" src="${user.photo}" alt="" />`
    : `<i class="fas fa-circle-user"></i>`;
  return `
    <a class="app-login-link app-user" href="#/profile" title="Миний профайл">
      ${avatar}<span>${escapeHtml(user.name.split(" ")[0])}</span>
    </a>
    <button class="button is-small app-logout" id="logoutBtn" type="button" title="Гарах">
      <span class="icon"><i class="fas fa-right-from-bracket"></i></span><span>Гарах</span>
    </button>`;
}

// Бүртгүүлэх/гарах үед зөвхөн баруун талын хэсгийг дахин зурна.
function refreshAuthArea() {
  const area = document.getElementById("authArea");
  if (!area) return;
  area.innerHTML = renderAuthArea();
  setActiveNavLink(window.location.hash.split("?")[0]);
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    logout();
    window.location.hash = "#/home";
  });
}

// Mobile дээр burger товчоор цэсийг нээх/хаах.
export function initNavbar() {
  const burger = document.querySelector(".app-header .navbar-burger");
  const menu = document.getElementById(burger?.dataset.target);
  if (!burger || !menu) return;

  const setOpen = (open) => {
    burger.classList.toggle("is-active", open);
    menu.classList.toggle("is-active", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-active")));
  // Цэсний холбоос дээр дарахад mobile цэс хаагдана.
  // (event delegation — дараа нь дахин зурагддаг "Бүртгүүлэх" товч ч хамрагдана)
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1023) setOpen(false);
  });
}

// Миний: одоогийн хуудасны цэсийг тодруулна (номд идэвхтэй цэс харагддаггүй байсан).
export function setActiveNavLink(hash) {
  document.querySelectorAll("#topNavbar .navbar-item").forEach((a) => {
    a.classList.toggle("is-active", a.getAttribute("href") === hash);
  });
}

// Миний: 🔍 товч дарахад хайлтын мөр нээгдэнэ. Хайхад тэтгэлгийн хуудас руу ?q=... -тэй шилжинэ.
// Утсан дээр хайлтын мөр burger цэс нээгдэхэд хамт харагдана (CSS).
function initSearch() {
  const toggle = document.getElementById("searchToggle");
  const panel = document.getElementById("headerSearch");
  if (!toggle || !panel) return;
  const input = panel.elements.q;

  const setOpen = (open) => {
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });
  panel.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    setOpen(false);
    document.querySelector(".app-header .navbar-burger.is-active")?.click();
    input.value = "";
    window.location.hash = `#/scholarships${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  });
}

export function mountNavbar(root) {
  if (!root) return;
  root.innerHTML = renderNavbar();
  initNavbar();
  initSearch();
  refreshAuthArea();
  window.addEventListener("auth-change", refreshAuthArea);
}
