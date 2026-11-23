import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { bindSidebar } from "../fn/sidebarEvents.js";
import { escapeHtml } from "../fn/escapeHtml.js";
import { loadCosts } from "../services/dataService.js";
import { getRegions, getScholarship } from "../services/scholarshipService.js";
import { t, loc } from "../i18n/i18n.js";

// 2.11 Зардлын тооцоолуур — номын calculationPage.js (хүнсний шим тэжээлийн тооцоо)-ийн
// тэтгэлгийн хувилбар: сарын тэтгэмж тухайн хотын амьжиргааны зардлыг хүрэх эсэхийг тооцно.
//   хүнс нэмэх      → зардал нэмэх (байр, хоол, тээвэр ... + өөрийн нэмсэн мөр)
//   хоногийн хэрэгцээ → сарын тэтгэмж (хувиар, өнгөөр ялгана)
// Миний: номд 8 шимт бодис бүрт давтагдсан кодыг ITEMS тохиргооны массиваар хийсэн шиг энд ч
// зардлын төрлүүдийг costs.json-ийн "items" массиваас үүсгэнэ. Номд хүнс нэмэх бүрт өмнө оруулсан
// хэмжээ 100 г болж буцдаг алдаа байсан — энд тэтгэлэг бүрийн оруулсан утгыг store-д хадгалж,
// хүснэгтийг дахин зурахгүйгээр зөвхөн дүнг шинэчилнэ (фокус алдагдахгүй).

const MAX = 100000;
const store = new Map(); // тэтгэлгийн id → { living, custom, oneTime, months }
let costs = null;

const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
const clamp = (v, min = 0, max = MAX) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min;
};

function defaults(c) {
  return { living: { ...c.living }, custom: [], oneTime: { ...c.oneTime }, months: c.months };
}

export async function renderCalculatorPage() {
  const app = document.getElementById("app");
  app.innerHTML = `<section class="section"><div class="container"><p class="has-text-grey">${t("common.loading")}</p></div></section>`;

  try {
    costs ??= await loadCosts();
  } catch (err) {
    app.innerHTML = `<section class="section"><div class="container">${renderNotification(t("common.loadError", { error: err.message }), "danger")}</div></section>`;
    return;
  }
  if (!location.hash.startsWith("#/calculator")) return; // ачаалах хооронд өөр хуудас руу шилжсэн

  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const id = params.get("id") || "mext";
  const s = getScholarship(id);
  const c = costs.scholarships[id];

  // Sidebar: бүсээр бүлэглэсэн тэтгэлгүүд
  const sidebar = getRegions()
    .map(
      (r) => `
      <p class="menu-label">${r.name}</p>
      <ul class="menu-list">
        ${r.scholarships
          .filter((x) => costs.scholarships[x.id])
          .map((x) => `<li><a href="#/calculator?id=${x.id}" class="${x.id === id ? "is-active" : ""}" ${x.id === id ? 'aria-current="page"' : ""}>${x.name}</a></li>`)
          .join("")}
      </ul>`
    )
    .join("");

  app.innerHTML = renderSidebarPageLayout({
    sidebarContent: sidebar,
    sidebarLabel: t("calc.choose"),
    pageId: "calculator",
    pageTitle: t("title.calculator"),
    pageSubtitle: t("calc.subtitle"),
    mainContent: s && c ? renderCalculator(s, c) : renderNotification(t("calc.unknown"), "warning"),
  });
  bindSidebar();
  if (s && c) bindCalculator(s, c);
}

function renderCalculator(s, c) {
  if (!store.has(s.id)) store.set(s.id, defaults(c));
  const st = store.get(s.id);
  const covered = (itemId) => c.covered.includes(itemId);
  const coveredNames = [...costs.items, ...costs.oneTime].filter((i) => covered(i.id)).map((i) => loc(i));

  const livingRows = costs.items
    .map((item) => {
      const cell = covered(item.id)
        ? `<span class="tag is-success is-light"><i class="fas fa-check"></i>&nbsp;${t("calc.coveredTag")}</span>`
        : `<input class="input is-small app-calc-input" type="number" min="0" max="${MAX}" step="10" inputmode="numeric"
            data-living="${item.id}" value="${st.living[item.id] ?? 0}" aria-label="${loc(item)} ($)" />`;
      return `
        <tr>
          <td><span class="icon has-text-grey"><i class="fas ${item.icon}"></i></span> ${loc(item)}</td>
          <td>${cell}</td>
          <td class="app-calc-share" data-share="living:${item.id}"></td>
        </tr>`;
    })
    .join("");

  const oneTimeRows = costs.oneTime
    .map((item) => {
      const cell = covered(item.id)
        ? `<span class="tag is-success is-light"><i class="fas fa-check"></i>&nbsp;${t("calc.coveredTag")}</span>`
        : `<input class="input is-small app-calc-input" type="number" min="0" max="${MAX}" step="10" inputmode="numeric"
            data-once="${item.id}" value="${st.oneTime[item.id] ?? 0}" aria-label="${loc(item)} ($)" />`;
      return `<tr><td><span class="icon has-text-grey"><i class="fas ${item.icon}"></i></span> ${loc(item)}</td><td>${cell}</td></tr>`;
    })
    .join("");

  return `
    <div class="box app-calc-head">
      <div>
        <p class="app-elig-country"><i class="fas ${s.region.icon}"></i> ${s.country} · ${t("calc.city")}: ${loc(c.city)}</p>
        <h2 class="title is-4 mb-2">${s.name}</h2>
        ${coveredNames.length ? `<p class="app-calc-covers"><span>${t("calc.covers")}:</span> ${coveredNames.map((n) => `<span class="tag is-success is-light">${n}</span>`).join("")}</p>` : ""}
      </div>
      <div class="app-calc-stipend">
        <span>${t("calc.stipend")}</span>
        <strong>${c.stipend ? money(c.stipend) : "—"}</strong>
      </div>
    </div>
    ${c.stipend ? "" : renderNotification(t("calc.noStipend"), "warning")}

    <div class="columns is-desktop">
      <div class="column is-7-desktop">
        <div class="box">
          <h3 class="title is-5">${t("calc.monthly")}</h3>
          <div class="table-container">
            <table class="table is-fullwidth app-calc-table">
              <thead><tr><th>${t("calc.item")}</th><th>${t("calc.amount")}</th><th>${t("calc.share")}</th></tr></thead>
              <tbody id="livingBody">${livingRows}</tbody>
              <tbody id="customBody">${renderCustomRows(st)}</tbody>
            </table>
          </div>
          <form id="addCost" class="app-calc-add" novalidate>
            <p class="app-field-label">${t("calc.addTitle")}</p>
            <div class="field has-addons">
              <div class="control is-expanded"><input class="input is-small" name="name" maxlength="40" placeholder="${t("calc.addName")}" aria-label="${t("calc.addName")}" /></div>
              <div class="control"><input class="input is-small app-calc-input" name="amount" type="number" min="1" max="${MAX}" step="10" placeholder="${t("calc.addAmount")}" aria-label="${t("calc.addAmount")}" /></div>
              <div class="control"><button class="button is-small is-primary" type="submit"><span class="icon"><i class="fas fa-plus"></i></span><span>${t("calc.addBtn")}</span></button></div>
            </div>
            <p class="help is-danger" id="addError" role="alert"></p>
          </form>
        </div>
        <div class="box">
          <h3 class="title is-5">${t("calc.oneTime")}</h3>
          <table class="table is-fullwidth app-calc-table">
            <thead><tr><th>${t("calc.item")}</th><th>${t("calc.oneTimeAmount")}</th></tr></thead>
            <tbody>${oneTimeRows}</tbody>
          </table>
        </div>
      </div>
      <div class="column is-5-desktop">
        <div class="box app-calc-summary">
          <div class="field">
            <label class="label is-small" for="calcMonths">${t("calc.months")}</label>
            <input class="input" id="calcMonths" type="number" min="1" max="72" value="${st.months}" />
          </div>
          <div id="calcSummary" aria-live="polite"></div>
          <button class="button is-small is-light mt-3" id="calcReset" type="button">
            <span class="icon"><i class="fas fa-rotate-left"></i></span><span>${t("calc.reset")}</span>
          </button>
          <p class="app-elig-note mt-3">${t("calc.note")}</p>
        </div>
      </div>
    </div>`;
}

function renderCustomRows(st) {
  return st.custom
    .map(
      (row, i) => `
      <tr>
        <td><span class="icon has-text-grey"><i class="fas fa-tag"></i></span> ${escapeHtml(row.name)}</td>
        <td>
          <div class="app-calc-custom">
            <input class="input is-small app-calc-input" type="number" min="0" max="${MAX}" step="10" data-custom="${i}" value="${row.amount}" aria-label="${escapeHtml(row.name)} ($)" />
            <button class="delete is-small" type="button" data-remove="${i}" aria-label="${t("calc.remove")}: ${escapeHtml(row.name)}"></button>
          </div>
        </td>
        <td class="app-calc-share" data-share="custom:${i}"></td>
      </tr>`
    )
    .join("");
}

function bindCalculator(s, c) {
  const st = store.get(s.id);
  const main = document.querySelector(".app-main-content");

  // Тоо оруулах бүрд зөвхөн дүнг шинэчилнэ (хүснэгт дахин зурагдахгүй)
  main.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.living) st.living[el.dataset.living] = clamp(el.value);
    else if (el.dataset.once) st.oneTime[el.dataset.once] = clamp(el.value);
    else if (el.dataset.custom) st.custom[el.dataset.custom].amount = clamp(el.value);
    else if (el.id === "calcMonths") st.months = clamp(el.value, 1, 72);
    else return;
    recalc(st, c);
  });

  // Буруу утга (сөрөг, хэт их) оруулаад гарахад хүчинтэй утгаар солино
  main.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.living) el.value = st.living[el.dataset.living];
    if (el.dataset.once) el.value = st.oneTime[el.dataset.once];
    if (el.dataset.custom) el.value = st.custom[el.dataset.custom].amount;
    if (el.id === "calcMonths") el.value = st.months;
  });

  document.getElementById("addCost").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.name.value.trim();
    const amount = Number(form.elements.amount.value);
    const err = document.getElementById("addError");
    if (!name || !(amount > 0)) {
      err.textContent = t("calc.addError");
      return;
    }
    err.textContent = "";
    st.custom.push({ name: name.slice(0, 40), amount: clamp(amount) });
    redrawCustom(st, c);
    form.reset();
    form.elements.name.focus();
  });

  document.getElementById("customBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    st.custom.splice(Number(btn.dataset.remove), 1);
    redrawCustom(st, c);
    document.querySelector("#addCost input[name=name]").focus();
  });

  document.getElementById("calcReset").addEventListener("click", () => {
    store.set(s.id, defaults(c));
    renderCalculatorPage();
  });

  recalc(st, c);
}

function redrawCustom(st, c) {
  document.getElementById("customBody").innerHTML = renderCustomRows(st);
  recalc(st, c);
}

// Нийт дүн, тэтгэмжийн хувь, үлдэгдэл, нэмэлт хэрэгтэй мөнгийг тооцож харуулна
function recalc(st, c) {
  const stipend = c.stipend;
  const share = (amount) => {
    if (!stipend) return "—";
    const pct = Math.round((amount / stipend) * 100);
    return `<span class="app-calc-bar"><i style="width:${Math.min(pct, 100)}%"></i></span><span>${pct}%</span>`;
  };
  document.querySelectorAll("[data-share]").forEach((cell) => {
    const [kind, key] = cell.dataset.share.split(":");
    const amount = kind === "living" ? st.living[key] ?? 0 : st.custom[key]?.amount ?? 0;
    cell.innerHTML = share(amount);
  });

  const total = Object.values(st.living).reduce((a, b) => a + b, 0) + st.custom.reduce((a, r) => a + r.amount, 0);
  const balance = stipend - total;
  const oneTime = costs.oneTime.filter((i) => !c.covered.includes(i.id)).reduce((a, i) => a + (st.oneTime[i.id] ?? 0), 0);
  const need = Math.max(0, -balance) * st.months + oneTime;
  const pct = stipend ? Math.round((total / stipend) * 100) : null;
  // ≤80% ногоон, 80–100% шар, >100% улаан
  const level = pct == null ? "is-danger" : pct > 100 ? "is-danger" : pct > 80 ? "is-warning" : "is-success";

  document.getElementById("calcSummary").innerHTML = `
    <dl class="app-calc-totals">
      <div><dt>${t("calc.total")}</dt><dd>${money(total)}</dd></div>
      <div><dt>${t("calc.stipend")}</dt><dd>${stipend ? money(stipend) : "—"}</dd></div>
      <div class="is-${balance >= 0 ? "plus" : "minus"}"><dt>${t("calc.balance")}</dt><dd>${balance >= 0 ? "+" : "−"}${money(Math.abs(balance))}</dd></div>
    </dl>
    ${pct != null ? `<progress class="progress ${level} mb-2" value="${Math.min(pct, 100)}" max="100" aria-label="${t("calc.share")}">${pct}%</progress>` : ""}
    <p class="app-calc-verdict ${level}">
      <i class="fas ${balance >= 0 ? "fa-circle-check" : "fa-triangle-exclamation"}"></i>
      ${balance >= 0 ? t("calc.surplus", { amount: Math.round(balance).toLocaleString("en-US") }) : t("calc.deficit", { amount: Math.round(-balance).toLocaleString("en-US") })}
    </p>
    <div class="app-calc-need">
      <span>${t("calc.need")}</span>
      <strong>${money(need)}</strong>
      <small>${t("calc.needNote", { months: st.months })}</small>
    </div>`;
}
