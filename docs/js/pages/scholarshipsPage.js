import { LEVELS, FIELDS, hasField } from "../data/categories.js";
import { getRegions } from "../services/scholarshipService.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderScholarshipCard } from "../components/scholarshipCard.js";
import { renderScholarshipTable } from "../components/scholarshipTable.js";
import { openImageModal } from "../components/imageModal.js";
import { bindSidebar, setSidebarOpen } from "../fn/sidebarEvents.js";
import { matchScholarship, searchSuggestions } from "../fn/search.js";
import { escapeHtml } from "../fn/escapeHtml.js";
import { t } from "../i18n/i18n.js";

// Одоо сонгогдсон бүс, түвшин (шүүлтүүрийн төлөв)
// Миний: q — сургууль, улсаар хайх үг
// 5-р ажлаас (2.7): view — "cards" эсвэл "table" (харьцуулах хүснэгт), sort — хүснэгтийн эрэмбэ
const state = { region: "all", level: "all", field: "all", q: "", view: "cards", sort: null };

// Тэтгэлгүүд хуудас: зүүн талд бүсийн цэс, баруун талд шүүлтүүр + картууд эсвэл хүснэгт.
export function renderScholarshipsPage() {
  const app = document.getElementById("app");
  const regions = getRegions();

  // URL-ээс бүс, түвшин, мэргэжил, хайлт, харагдацыг уншина (#/scholarships?region=asia&view=table).
  // Нүүр хуудасны товчноос шууд шүүгдсэн байдлаар ирэх боломжтой.
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  state.region = params.get("region") || "all";
  state.level = params.get("level") || "all";
  state.field = params.get("field") || "all";
  state.q = (params.get("q") || "").slice(0, 80);
  state.view = params.get("view") === "table" ? "table" : "cards";

  const total = regions.reduce((sum, r) => sum + r.scholarships.length, 0);
  const sidebar = `
    <p class="menu-label">${t("sch.regionLabel")}</p>
    <ul class="menu-list" id="regionMenu">
      <li><a data-region="all"><span class="icon"><i class="fas fa-globe"></i></span> ${t("common.all")}
        <span class="tag is-rounded is-light ml-auto">${total}</span></a></li>
      ${regions.map(
        (r) => `<li><a data-region="${r.id}"><span class="icon"><i class="fas ${r.icon}"></i></span> ${r.name}
          <span class="tag is-rounded is-light ml-auto">${r.scholarships.length}</span></a></li>`
      ).join("")}
    </ul>
  `;

  // Түвшний шүүлтүүр — Bulma buttons group
  const levelButtons = [{ id: "all", name: t("common.allLevels") }, ...LEVELS]
    .map((l) => `<button class="button is-small is-rounded" data-level="${l.id}" type="button">${l.name}</button>`)
    .join("");

  app.innerHTML = renderSidebarPageLayout({
    sidebarContent: sidebar,
    sidebarLabel: t("sch.regionLabel"),
    mainContent: `
      <form class="app-search" id="searchForm" role="search">
        <span class="icon"><i class="fas fa-magnifying-glass"></i></span>
        <input class="input" id="searchInput" type="search" list="searchSuggest" autocomplete="off"
          placeholder="${t("sch.searchPlaceholder")}" aria-label="${t("header.search")}" value="${escapeHtml(state.q)}" />
        <datalist id="searchSuggest">${searchSuggestions().map((s) => `<option value="${escapeHtml(s)}"></option>`).join("")}</datalist>
      </form>
      <div class="app-filters mb-4">
        <div class="buttons mb-0" id="levelFilter">${levelButtons}</div>
        <div class="control has-icons-left">
          <div class="select is-small is-rounded">
            <select id="fieldFilter" aria-label="${t("common.field")}">
              <option value="all">${t("common.allFields")}</option>
              ${FIELDS.map((f) => `<option value="${f.id}">${f.name}</option>`).join("")}
            </select>
          </div>
          <span class="icon is-small is-left"><i class="fas fa-briefcase"></i></span>
        </div>
        <div class="buttons has-addons mb-0 app-view-toggle" id="viewToggle" role="group" aria-label="${t("sch.view")}">
          <button class="button is-small" type="button" data-view="cards"><span class="icon"><i class="fas fa-grip"></i></span><span>${t("sch.viewCards")}</span></button>
          <button class="button is-small" type="button" data-view="table"><span class="icon"><i class="fas fa-table-list"></i></span><span>${t("sch.viewTable")}</span></button>
        </div>
      </div>
      ${renderNotification(`<span class="icon"><i class="fas fa-circle-info"></i></span> ${t("sch.notice")}`, "info")}
      <p class="mb-3 app-count" id="resultCount" aria-live="polite"></p>
      <div id="scholarList"></div>`,
    pageId: "scholarships",
    pageTitle: t("title.scholarships"),
    pageSubtitle: t("sch.subtitle"),
  });

  bindSidebar();
  showList();

  // Бүсийн цэс: дарахад зөвхөн жагсаалт шинэчлэгдэнэ (хуудас бүтнээрээ дахин зурагдахгүй).
  document.getElementById("regionMenu").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-region]");
    if (!link) return;
    state.region = link.dataset.region;
    update();
    setSidebarOpen(false);
  });

  // Түвшний товч
  document.getElementById("levelFilter").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-level]");
    if (!btn) return;
    state.level = btn.dataset.level;
    update();
  });

  // Карт / хүснэгт солих
  document.getElementById("viewToggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-view]");
    if (!btn) return;
    state.view = btn.dataset.view;
    update();
  });

  // Хайлт: бичих бүрд жагсаалт шинэчлэгдэж, URL-д q хадгалагдана (хуудас дахин зурагдахгүй)
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => {
    state.q = input.value.slice(0, 80);
    update();
  });
  document.getElementById("searchForm").addEventListener("submit", (e) => e.preventDefault());

  // Мэргэжлийн сонголт
  document.getElementById("fieldFilter").addEventListener("change", (e) => {
    state.field = e.target.value;
    update();
  });

  // Жагсаалт дахин зурагддаг тул товчнуудыг event delegation-оор барина:
  //   "Зураг (n)" → зургийн modal, хүснэгтийн гарчиг → эрэмбэ солих
  document.getElementById("scholarList").addEventListener("click", (e) => {
    const photos = e.target.closest("[data-photos]");
    if (photos) {
      const s = regions.flatMap((r) => r.scholarships).find((x) => x.id === photos.dataset.photos);
      if (s) openImageModal(s);
      return;
    }
    const sortBtn = e.target.closest("[data-sort]");
    if (sortBtn) {
      const key = sortBtn.dataset.sort;
      const dir = state.sort?.key === key && state.sort.dir === "ascending" ? "descending" : "ascending";
      state.sort = { key, dir };
      showList();
      document.querySelector(`#scholarList [data-sort="${key}"]`)?.focus();
    }
  });
}

function update() {
  showList();
  syncUrl();
}

// Сонгосон бүс, түвшин, мэргэжил, хайлтад тохирох тэтгэлгүүдийг карт эсвэл хүснэгтээр зурна.
function showList() {
  const all = getRegions();
  // Буруу id ирвэл бүгдийг харуулна
  if (state.region !== "all" && !all.some((r) => r.id === state.region)) state.region = "all";
  if (state.level !== "all" && !LEVELS.some((l) => l.id === state.level)) state.level = "all";
  if (state.field !== "all" && !FIELDS.some((f) => f.id === state.field)) state.field = "all";

  const regions = state.region === "all" ? all : all.filter((r) => r.id === state.region);
  const found = regions.flatMap((region) =>
    region.scholarships
      .map((s) => ({ s: { ...s, region }, m: matchScholarship(s, state.q) }))
      .filter(({ m }) => m)
      .filter(({ s }) => state.level === "all" || s.levels.includes(state.level))
      .filter(({ s }) => hasField(s, state.field))
      // Мэргэжил сонгосон бол тухайн чиглэлд тусгайлсан тэтгэлгийг эхэнд нь харуулна
      .sort((a, b) => (state.field === "all" ? 0 : (a.s.fields === "all") - (b.s.fields === "all")))
  );

  const list = document.getElementById("scholarList");
  if (!found.length) {
    list.innerHTML = renderNotification(
      state.q ? t("sch.noResultQ", { q: escapeHtml(state.q) }) : t("sch.noResult"),
      "warning"
    );
  } else if (state.view === "table") {
    list.innerHTML = renderScholarshipTable(found.map(({ s }) => s), state.sort);
  } else {
    list.innerHTML = `<div class="columns is-multiline">${found
      .map(({ s, m }) => renderScholarshipCard(s, s.region, state.field, m.universities))
      .join("")}</div>`;
  }

  const fieldName = FIELDS.find((f) => f.id === state.field)?.name;
  document.getElementById("resultCount").textContent =
    `${state.q ? `"${state.q}" · ` : ""}${t("sch.count", { count: found.length })}${fieldName ? ` · ${fieldName}` : ""}`;
  document.getElementById("fieldFilter").value = state.field;

  // Идэвхтэй цэс, товчийг тодруулна
  document.querySelectorAll("#regionMenu a").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.region === state.region);
  });
  document.querySelectorAll("#levelFilter button").forEach((b) => {
    b.classList.toggle("is-link", b.dataset.level === state.level);
  });
  document.querySelectorAll("#viewToggle button").forEach((b) => {
    const on = b.dataset.view === state.view;
    b.classList.toggle("is-link", on);
    b.setAttribute("aria-pressed", String(on));
  });
}

// Шүүлтүүрийг URL-д хадгална — хуудсыг сэргээх, холбоос хуваалцахад хэвээр үлдэнэ.
// replaceState нь hashchange үүсгэхгүй тул хуудас дахин зурагдахгүй.
function syncUrl() {
  const params = new URLSearchParams();
  if (state.region !== "all") params.set("region", state.region);
  if (state.level !== "all") params.set("level", state.level);
  if (state.field !== "all") params.set("field", state.field);
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.view === "table") params.set("view", "table");
  const qs = params.toString();
  history.replaceState(null, "", `#/scholarships${qs ? `?${qs}` : ""}`);
}
