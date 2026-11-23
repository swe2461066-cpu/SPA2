import { getUser, logout } from "../fn/auth.js";
import { escapeHtml } from "../fn/escapeHtml.js";
import { t, getLang, setLang } from "../i18n/i18n.js";
import { currentTheme, toggleTheme } from "../fn/theme.js";

// Дээд цэс. Цэсийн мөрүүдийг массиваас үүсгэнэ.
// Миний: номд <a> бүрийг гараар давтаж бичсэн байсныг NAV_ITEMS массив болгосон.
// 5–6-р ажлаас: Тойм, Зардлын тооцоо, Гарын авлага нэмэгдэж, бичвэрүүд t()-ээр 2 хэлтэй болов.
// "Миний профайл" нь баруун дээд буланд (нэвтэрсэн үед) байгаа тул цэснээс хасав.
const NAV_ITEMS = [
  { href: "#/home", key: "nav.home" },
  { href: "#/scholarships", key: "nav.scholarships" },
  { href: "#/overview", key: "nav.overview" },
  { href: "#/eligibility", key: "nav.eligibility" },
  { href: "#/calculator", key: "nav.calculator" },
  { href: "#/guides", key: "nav.guides" },
  { href: "#/contact", key: "nav.contact" },
];

let root = null;

// Миний: сургуулийн сайтын загвар шиг 2 давхар толгой —
//   1) цагаан мөр: зүүнд хайлт, голд лого, баруунд хэл солих + нэвтрэх хэсэг (доош гүйлгэхэд нуугдана)
//   2) хар хөх цэсний зурвас (дээрээ наалдаж үлдэнэ)
export function renderNavbar() {
  const links = NAV_ITEMS.map((item) => `<a class="navbar-item" href="${item.href}">${t(item.key)}</a>`).join("");
  const other = getLang() === "mn" ? "en" : "mn";

  return `
    <header class="app-header">
      <div class="container app-topbar">
        <button class="app-top-search" id="searchToggle" type="button" aria-label="${t("header.search")}" aria-expanded="false" aria-controls="headerSearch" title="${t("header.search")}">
          <i class="fas fa-magnifying-glass"></i>
        </button>
        <a class="app-logo" href="#/home">
          <img src="./img/icon/logo.svg" alt="" width="44" height="50" />
          <span class="app-logo-text">
            <strong>${t("brand.name")}</strong>
            <small>${t("brand.tagline")}</small>
          </span>
        </a>
        <div class="app-top-right">
          <button class="app-lang" id="langToggle" type="button" data-lang="${other}" title="${t("header.lang")}" aria-label="${t("header.lang")}">
            <i class="fas fa-globe"></i><span>${other.toUpperCase()}</span>
          </button>
          <button class="app-lang app-theme" id="themeToggle" type="button">${renderThemeIcon()}</button>
          <div class="app-auth" id="authArea">${renderAuthArea()}</div>
          <button class="navbar-burger" type="button" aria-label="${t("nav.menu")}" aria-expanded="false" data-target="topNavbar">
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
            placeholder="${t("header.searchPlaceholder")}" aria-label="${t("header.search")}" />
          <button class="button is-primary" type="submit">${t("header.searchBtn")}</button>
        </div>
      </form>
      <nav class="app-navbar" id="topNavbar" aria-label="${t("nav.menu")}">
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
        <i class="fas fa-circle-user"></i><span>${t("header.login")}</span>
      </a>
      <a class="button is-primary app-register-btn" href="#/register">${t("header.register")}</a>`;
  }
  const avatar = user.photo
    ? `<img class="app-nav-avatar" src="${user.photo}" alt="" />`
    : `<i class="fas fa-circle-user"></i>`;
  return `
    <a class="app-login-link app-user" href="#/profile" title="${t("nav.profile")}">
      ${avatar}<span>${escapeHtml(user.name.split(" ")[0])}</span>
    </a>
    <button class="button is-small app-logout" id="logoutBtn" type="button" title="${t("header.logout")}">
      <span class="icon"><i class="fas fa-right-from-bracket"></i></span><span>${t("header.logout")}</span>
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
function setMenuOpen(open) {
  const burger = document.querySelector(".app-header .navbar-burger");
  const menu = document.getElementById("topNavbar");
  if (!burger || !menu) return;
  burger.classList.toggle("is-active", open);
  menu.classList.toggle("is-active", open);
  burger.setAttribute("aria-expanded", String(open));
}

export function initNavbar() {
  const burger = document.querySelector(".app-header .navbar-burger");
  const menu = document.getElementById("topNavbar");
  if (!burger || !menu) return;
  burger.addEventListener("click", () => setMenuOpen(!menu.classList.contains("is-active")));
  // Цэсний холбоос дээр дарахад mobile цэс хаагдана.
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) setMenuOpen(false);
  });
}

// Миний: одоогийн хуудасны цэсийг тодруулна (номд идэвхтэй цэс харагддаггүй байсан).
export function setActiveNavLink(hash) {
  document.querySelectorAll("#topNavbar .navbar-item").forEach((a) => {
    const on = a.getAttribute("href") === hash;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
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
    setMenuOpen(false);
    input.value = "";
    window.location.hash = `#/scholarships${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  });
}

// Хэл солих товч (2.9)
function initLang() {
  document.getElementById("langToggle")?.addEventListener("click", (e) => {
    setLang(e.currentTarget.dataset.lang);
  });
}

// Миний: цайвар / харанхуй горим солих товч. Харанхуй үед нар (цайвар руу), цайвар үед сар дүрс.
function renderThemeIcon() {
  return `<i class="fas ${currentTheme() === "dark" ? "fa-sun" : "fa-moon"}"></i>`;
}
function syncThemeButton() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const label = t(currentTheme() === "dark" ? "header.themeLight" : "header.themeDark");
  btn.innerHTML = renderThemeIcon();
  btn.title = label;
  btn.setAttribute("aria-label", label);
}
function initTheme() {
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  syncThemeButton();
}

// Navbar-ийг (дахин) зурна. Хэл солигдоход app.js үүнийг дуудна.
export function renderNavbarInto() {
  if (!root) return;
  root.innerHTML = renderNavbar();
  initNavbar();
  initSearch();
  initLang();
  initTheme();
  refreshAuthArea();
  document.getElementById("langToggle")?.focus({ preventScroll: true });
}

// Window-ийн listener-уудыг нэг л удаа бүртгэнэ (дахин зурахад давхардахгүй).
export function mountNavbar(el) {
  if (!el) return;
  root = el;
  root.innerHTML = renderNavbar();
  initNavbar();
  initSearch();
  initLang();
  initTheme();
  refreshAuthArea();
  window.addEventListener("auth-change", refreshAuthArea);
  window.addEventListener("theme-change", syncThemeButton);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1023) setMenuOpen(false);
  });
}
