import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { LEVELS, FIELDS } from "../data/scholarships.js";
import { getUser, updateUser } from "../fn/auth.js";
import { scoresFromProfile, evaluateAll } from "../fn/eligibility.js";

// Тэнцэх эсэхээ шалгах хуудас.
// Миний: профайлд оруулсан голч дүн, IELTS, TOPIK оноог автоматаар уншиж,
// тэнцэх тэтгэлэг болон тухайн тэтгэлгээр суралцах боломжтой сургуулиудыг харуулна.
// Утгыг энд өөрчлөхөд үр дүн шууд шинэчлэгдэнэ; нэвтэрсэн бол профайлдаа хадгалж болно.

const STATUS = {
  match: { label: "Тэнцэнэ", cls: "is-success", icon: "fa-circle-check" },
  close: { label: "Бага зэрэг дутуу", cls: "is-warning", icon: "fa-circle-exclamation" },
  unknown: { label: "Оноо дутуу оруулсан", cls: "is-light", icon: "fa-circle-question" },
  no: { label: "Тэнцэхгүй", cls: "is-danger", icon: "fa-circle-xmark" },
};
const CHECK_ICON = { ok: "fa-check has-text-success", close: "fa-minus has-text-warning-dark", no: "fa-xmark has-text-danger", unknown: "fa-question has-text-grey" };

export function renderEligibilityPage() {
  const user = getUser();
  const s = user ? scoresFromProfile(user) : { gpa: "", gpaScale: "", ielts: "", topik: "", degree: "", field: "" };
  const hasScores = user && (s.gpa !== "" || s.ielts !== "" || s.topik !== "");

  const opt = (list, val) => list.map((o) => `<option value="${o.value}"${String(o.value) === String(val) ? " selected" : ""}>${o.label}</option>`).join("");

  const intro = !user
    ? renderNotification(`<a href="#/login">Нэвтэрч</a> эсвэл <a href="#/register">бүртгүүлж</a> профайлдаа голч дүн, IELTS/TOPIK оноогоо оруулбал энд автоматаар бөглөгдөнө. Одоохондоо доор гараар оруулж шалгаж болно.`, "info")
    : hasScores
      ? renderNotification(`<span class="icon"><i class="fas fa-user-check"></i></span> Таны <a href="#/profile">профайлаас</a> оноог автоматаар авлаа.`, "success")
      : renderNotification(`<a href="#/profile">Профайлдаа</a> голч дүн, IELTS/TOPIK оноогоо оруулаагүй байна. Доор оруулаад "Профайлдаа хадгалах" дарж болно.`, "warning");

  document.getElementById("app").innerHTML = renderPageLayout({
    id: "eligibility",
    title: "Тэнцэх эсэхээ шалгах",
    subtitle: "Голч дүн, IELTS эсвэл TOPIK оноогоороо тохирох тэтгэлэг, сургуулиа олоорой.",
    content: `
      ${intro}
      <div class="columns">
        <div class="column is-4-desktop is-5-tablet">
          <form id="eligForm" class="box app-elig-form" novalidate>
            <p class="title is-6">Таны оноо</p>
            <div class="columns is-mobile mb-0">
              <div class="column field mb-0">
                <label class="label is-small" for="eGpa">Голч дүн</label>
                <input id="eGpa" class="input" name="gpa" type="number" step="0.01" min="0" value="${s.gpa}" placeholder="3.5 эсвэл 85" />
              </div>
              <div class="column is-5 field mb-0">
                <label class="label is-small" for="eScale">Хэмжүүр</label>
                <div class="select is-fullwidth"><select id="eScale" name="gpaScale">
                  ${opt([{ value: "", label: "Автомат" }, { value: "4.0", label: "4.0" }, { value: "100", label: "100" }], s.gpaScale)}
                </select></div>
              </div>
            </div>
            <div class="columns is-mobile mb-0">
              <div class="column field mb-0">
                <label class="label is-small" for="eIelts">IELTS</label>
                <input id="eIelts" class="input" name="ielts" type="number" step="0.5" min="0" max="9" value="${s.ielts}" placeholder="6.5" />
              </div>
              <div class="column field mb-0">
                <label class="label is-small" for="eTopik">TOPIK</label>
                <div class="select is-fullwidth"><select id="eTopik" name="topik">
                  ${opt([{ value: "", label: "Байхгүй" }, ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: `TOPIK ${n}` }))], s.topik)}
                </select></div>
              </div>
            </div>
            <p class="help is-danger" id="eligError"></p>
            <div class="field mt-3">
              <label class="label is-small" for="eDegree">Суралцах түвшин</label>
              <div class="select is-fullwidth"><select id="eDegree" name="degree">
                ${opt([{ value: "", label: "Бүгд" }, ...LEVELS.map((l) => ({ value: l.id, label: l.name }))], s.degree)}
              </select></div>
            </div>
            <div class="field">
              <label class="label is-small" for="eField">Мэргэжил</label>
              <div class="select is-fullwidth"><select id="eField" name="field">
                ${opt([{ value: "", label: "Бүгд" }, ...FIELDS.map((f) => ({ value: f.id, label: f.name }))], s.field)}
              </select></div>
            </div>
            ${user ? `<button class="button is-primary is-fullwidth mt-2" type="submit"><span class="icon"><i class="fas fa-floppy-disk"></i></span><span>Профайлдаа хадгалах</span></button>
            <p class="help has-text-centered" id="eligSaved" role="status"></p>` : ""}
          </form>
          <p class="app-elig-note">Шаардлагууд нь ойролцоо утга бөгөөд жил, сургууль бүрээр өөрчлөгддөг. Албан сайтаас заавал шалгана уу.</p>
        </div>
        <div class="column">
          <div id="eligSummary" class="app-elig-summary"></div>
          <div id="eligResults"></div>
        </div>
      </div>
    `,
  });

  const form = document.getElementById("eligForm");
  form.addEventListener("input", () => update(form));
  form.addEventListener("change", () => update(form));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    save(form);
  });
  update(form);
}

// Формын утгыг уншиж, хязгаараас гарсан утгыг алдаа болгож тооцоонд ашиглахгүй
function readForm(form) {
  const data = Object.fromEntries(new FormData(form));
  const errors = [];

  const iBad = data.ielts !== "" && (Number(data.ielts) < 0 || Number(data.ielts) > 9);
  form.elements.ielts.classList.toggle("is-danger", iBad);
  if (iBad) {
    errors.push("IELTS оноо 0–9 хооронд байна.");
    data.ielts = "";
  }
  const gpaMax = data.gpaScale === "4.0" ? 4 : 100;
  const gBad = data.gpa !== "" && (Number(data.gpa) < 0 || Number(data.gpa) > gpaMax);
  form.elements.gpa.classList.toggle("is-danger", gBad);
  if (gBad) {
    errors.push(`Голч дүн 0–${gpaMax} хооронд байна.`);
    data.gpa = "";
  }
  document.getElementById("eligError").textContent = errors.join(" ");
  return { data, ok: !errors.length };
}

function update(form) {
  const { data } = readForm(form);
  const results = evaluateAll(data);
  const count = (st) => results.filter((r) => r.status === st).length;
  const noScores = data.gpa === "" && data.ielts === "" && data.topik === "";

  document.getElementById("eligSummary").innerHTML = noScores
    ? renderNotification("Голч дүн, IELTS эсвэл TOPIK оноогоо оруулахад тохирох тэтгэлгүүд энд гарна.", "info")
    : `
      <div class="app-elig-stat is-success"><strong>${count("match")}</strong><span>Тэнцэнэ</span></div>
      <div class="app-elig-stat is-warning"><strong>${count("close")}</strong><span>Бага зэрэг дутуу</span></div>
      <div class="app-elig-stat is-danger"><strong>${count("no")}</strong><span>Тэнцэхгүй</span></div>
      <div class="app-elig-stat"><strong>${results.length}</strong><span>Нийт шалгасан</span></div>`;

  document.getElementById("eligResults").innerHTML = results.length
    ? results.map(renderResult).join("")
    : renderNotification("Сонгосон түвшин, мэргэжилд тохирох тэтгэлэг олдсонгүй.", "warning");
}

function renderResult(r) {
  const st = STATUS[r.status];
  const checks = r.checks
    .map((c) => `<li><i class="fas ${CHECK_ICON[c.state]}"></i> ${c.label}${c.have ? ` <span class="app-elig-have">— таных: ${c.have}</span>` : ""}</li>`)
    .join("");
  const unis = r.req.universities.map((u) => `<li><i class="fas fa-building-columns"></i> ${u}</li>`).join("");
  return `
    <article class="box app-elig-card is-${r.status}">
      <div class="app-elig-head">
        <div>
          <p class="app-elig-country"><i class="fas ${r.region.icon}"></i> ${r.country}</p>
          <h3 class="title is-5 mb-0">${r.name}</h3>
        </div>
        <span class="tag ${st.cls} is-medium"><i class="fas ${st.icon}"></i>&nbsp;${st.label}</span>
      </div>
      <div class="app-elig-body">
        <div>
          <p class="app-field-label">Шаардлага</p>
          <ul class="app-elig-checks">${checks}</ul>
          <p class="app-elig-hint">${r.req.note}</p>
        </div>
        <div>
          <p class="app-field-label">${r.status === "no" ? "Сургуулиуд" : "Тохирох сургуулиуд"}</p>
          <ul class="app-elig-unis">${unis}</ul>
        </div>
      </div>
      <a class="app-elig-link" href="${r.url}" target="_blank" rel="noopener">Албан сайт <i class="fas fa-arrow-up-right-from-square"></i></a>
    </article>`;
}

// Нэвтэрсэн хэрэглэгчийн профайлд оноог хадгална (бусад талбарыг өөрчлөхгүй)
function save(form) {
  const { data, ok } = readForm(form);
  const msg = document.getElementById("eligSaved");
  if (!ok) {
    msg.textContent = "Алдааг засаад дахин хадгална уу.";
    msg.className = "help has-text-centered is-danger";
    return;
  }
  const saved = updateUser((acc) => {
    acc.profile = acc.profile || {};
    acc.profile.academic = { ...acc.profile.academic, gpa: data.gpa, gpaScale: data.gpaScale };
    acc.profile.language = { ...acc.profile.language, ielts: data.ielts, topik: data.topik };
    acc.profile.preferences = { ...acc.profile.preferences, degree: data.degree, field: data.field };
    return acc;
  });
  msg.textContent = saved ? "Профайлд хадгаллаа." : "Хадгалж чадсангүй.";
  msg.className = `help has-text-centered ${saved ? "is-success" : "is-danger"}`;
}
