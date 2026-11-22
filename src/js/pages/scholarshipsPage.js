import { REGIONS, LEVELS, FIELDS, hasField } from "../data/scholarships.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderScholarshipCard } from "../components/scholarshipCard.js";
import { bindSidebar, setSidebarOpen } from "../fn/sidebarEvents.js";
import { matchScholarship, searchSuggestions } from "../fn/search.js";
import { escapeHtml } from "../fn/escapeHtml.js";

// Одоо сонгогдсон бүс, түвшин (шүүлтүүрийн төлөв)
// Миний: q — сургууль, улсаар хайх үг
const state = { region: "all", level: "all", field: "all", q: "" };

// Тэтгэлгүүд хуудас: зүүн талд бүсийн цэс, баруун талд түвшний шүүлтүүр + тэтгэлгийн картууд.
export function renderScholarshipsPage() {
  const app = document.getElementById("app");

  // URL-ээс бүс, түвшин, мэргэжлийг уншина (#/scholarships?region=asia&level=master&field=it).
  // Нүүр хуудасны товчноос шууд шүүгдсэн байдлаар ирэх боломжтой.
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  state.region = params.get("region") || "all";
  state.level = params.get("level") || "all";
  state.field = params.get("field") || "all";
  state.q = (params.get("q") || "").slice(0, 80);

  const total = REGIONS.reduce((sum, r) => sum + r.scholarships.length, 0);
  const sidebar = `
    <p class="menu-label">Бүс сонгох</p>
    <ul class="menu-list" id="regionMenu">
      <li><a data-region="all"><span class="icon"><i class="fas fa-globe"></i></span> Бүгд
        <span class="tag is-rounded is-light ml-auto">${total}</span></a></li>
      ${REGIONS.map(
        (r) => `<li><a data-region="${r.id}"><span class="icon"><i class="fas ${r.icon}"></i></span> ${r.name}
          <span class="tag is-rounded is-light ml-auto">${r.scholarships.length}</span></a></li>`
      ).join("")}
    </ul>
  `;

  // Түвшний шүүлтүүр — Bulma buttons group
  const levelButtons = [{ id: "all", name: "Бүх түвшин" }, ...LEVELS]
    .map((l) => `<button class="button is-small is-rounded" data-level="${l.id}" type="button">${l.name}</button>`)
    .join("");

  app.innerHTML = renderSidebarPageLayout({
    sidebarContent: sidebar,
    mainContent: `
      <form class="app-search" id="searchForm" role="search">
        <span class="icon"><i class="fas fa-magnifying-glass"></i></span>
        <input class="input" id="searchInput" type="search" list="searchSuggest" autocomplete="off"
          placeholder="Сургууль эсвэл улсаар хайх — жишээ: Токио, KAIST, Герман, London" aria-label="Сургууль эсвэл улсаар хайх" value="${escapeHtml(state.q)}" />
        <datalist id="searchSuggest">${searchSuggestions().map((t) => `<option value="${t}"></option>`).join("")}</datalist>
      </form>
      <div class="app-filters mb-4">
        <div class="buttons mb-0" id="levelFilter">${levelButtons}</div>
        <div class="control has-icons-left">
          <div class="select is-small is-rounded">
            <select id="fieldFilter" aria-label="Мэргэжил">
              <option value="all">Бүх мэргэжил</option>
              ${FIELDS.map((f) => `<option value="${f.id}">${f.name}</option>`).join("")}
            </select>
          </div>
          <span class="icon is-small is-left"><i class="fas fa-briefcase"></i></span>
        </div>
      </div>
      ${renderNotification(
        `<span class="icon"><i class="fas fa-circle-info"></i></span>
         Бүртгэлийн хугацаа, нөхцөл жил бүр өөрчлөгддөг. Өргөдөл гаргахаасаа өмнө <b>албан сайтаас</b> шалгаарай.`,
        "info"
      )}
      <p class="mb-3 app-count" id="resultCount"></p>
      <div class="columns is-multiline" id="scholarList"></div>`,
    pageId: "scholarships",
    pageTitle: "Тэтгэлгүүд",
    pageSubtitle: "Бүс, суралцах түвшин, мэргэжлээ сонгоод өөрт тохирох тэтгэлгээ олоорой.",
  });

  bindSidebar();
  showList();

  // Бүсийн цэс: дарахад зөвхөн жагсаалт шинэчлэгдэнэ (хуудас бүтнээрээ дахин зурагдахгүй).
  document.getElementById("regionMenu").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-region]");
    if (!link) return;
    state.region = link.dataset.region;
    showList();
    setSidebarOpen(false);
  });

  // Түвшний товч
  document.getElementById("levelFilter").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-level]");
    if (!btn) return;
    state.level = btn.dataset.level;
    showList();
  });

  // Хайлт: бичих бүрд жагсаалт шинэчлэгдэж, URL-д q хадгалагдана (хуудас дахин зурагдахгүй)
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => {
    state.q = input.value.slice(0, 80);
    showList();
    syncUrl();
  });
  document.getElementById("searchForm").addEventListener("submit", (e) => e.preventDefault());

  // Мэргэжлийн сонголт
  document.getElementById("fieldFilter").addEventListener("change", (e) => {
    state.field = e.target.value;
    showList();
  });
}

// Сонгосон бүс, түвшинд тохирох тэтгэлгүүдийг карт болгон зурна.
function showList() {
  // Буруу id ирвэл бүгдийг харуулна
  if (state.region !== "all" && !REGIONS.some((r) => r.id === state.region)) state.region = "all";
  if (state.level !== "all" && !LEVELS.some((l) => l.id === state.level)) state.level = "all";
  if (state.field !== "all" && !FIELDS.some((f) => f.id === state.field)) state.field = "all";

  const regions = state.region === "all" ? REGIONS : REGIONS.filter((r) => r.id === state.region);
  const cards = regions.flatMap((r) =>
    r.scholarships
      .map((s) => ({ s, m: matchScholarship(s, r, state.q) }))
      .filter(({ m }) => m)
      .filter(({ s }) => state.level === "all" || s.levels.includes(state.level))
      .filter(({ s }) => hasField(s, state.field))
      // Мэргэжил сонгосон бол тухайн чиглэлд тусгайлсан тэтгэлгийг эхэнд нь харуулна
      .sort((a, b) => (state.field === "all" ? 0 : (a.s.fields === "all") - (b.s.fields === "all")))
      .map(({ s, m }) => renderScholarshipCard(s, r, state.field, m.universities))
  );

  document.getElementById("scholarList").innerHTML = cards.length
    ? cards.join("")
    : `<div class="column">${renderNotification(
        state.q
          ? `"${escapeHtml(state.q)}" гэсэн хайлтад тохирох тэтгэлэг олдсонгүй. Өөр сургууль, улсын нэрээр (жишээ: Япон, Seoul) хайгаад үзээрэй.`
          : "Энэ шүүлтүүрт тохирох тэтгэлэг олдсонгүй.",
        "warning"
      )}</div>`;
  const fieldName = FIELDS.find((f) => f.id === state.field)?.name;
  document.getElementById("resultCount").textContent =
    `${state.q ? `"${state.q}" · ` : ""}${cards.length} тэтгэлэг олдлоо${fieldName ? ` · ${fieldName}` : ""}`;
  document.getElementById("fieldFilter").value = state.field;

  // Идэвхтэй цэс, товчийг тодруулна
  document.querySelectorAll("#regionMenu a").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.region === state.region);
  });
  document.querySelectorAll("#levelFilter button").forEach((b) => {
    b.classList.toggle("is-link", b.dataset.level === state.level);
  });
}

// Хайлтын үгийг URL-д хадгална — хуудсыг сэргээх, холбоос хуваалцахад хайлт хэвээр үлдэнэ.
// replaceState нь hashchange үүсгэхгүй тул хуудас дахин зурагдахгүй.
function syncUrl() {
  const params = new URLSearchParams();
  if (state.region !== "all") params.set("region", state.region);
  if (state.level !== "all") params.set("level", state.level);
  if (state.field !== "all") params.set("field", state.field);
  if (state.q.trim()) params.set("q", state.q.trim());
  const qs = params.toString();
  history.replaceState(null, "", `#/scholarships${qs ? `?${qs}` : ""}`);
}
