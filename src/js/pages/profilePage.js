import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { PROFILE_SECTIONS, DOCUMENTS } from "../data/profileSections.js";
import { getUser, updateUser } from "../fn/auth.js";
import { escapeHtml } from "../fn/escapeHtml.js";
import { scoresFromProfile, evaluateAll } from "../fn/eligibility.js";

// Профайл хуудас: зүүн талд зураг, товч мэдээлэл, зорилго, зөвлөмж;
// баруун талд хэсэг бүр (хувийн, боловсрол, хэл, хүсэл, туршлага, бичиг баримт).
// Хэсэг бүрийн "Засах" товчоор тухайн хэсэг форм болж, "Хадгалах" дарахад localStorage-д бичигдэнэ.

let editing = null; // одоо засаж буй хэсгийн id (нэг удаа нэг хэсэг)

export function renderProfilePage() {
  const app = document.getElementById("app");
  editing = null;

  // Нэвтрээгүй бол профайл харуулахгүй
  if (!getUser()) {
    app.innerHTML = renderPageLayout({
      id: "profile",
      title: "Миний профайл",
      content: `
        ${renderNotification("Профайлаа харахын тулд нэвтэрнэ үү эсвэл шинээр бүртгүүлнэ үү.", "warning")}
        <div class="buttons">
          <a class="button is-link" href="#/login"><span class="icon"><i class="fas fa-right-to-bracket"></i></span><span>Нэвтрэх</span></a>
          <a class="button is-primary" href="#/register"><span class="icon"><i class="fas fa-user-plus"></i></span><span>Бүртгүүлэх</span></a>
        </div>`,
    });
    return;
  }

  app.innerHTML = renderPageLayout({ id: "profile", content: `<div id="profileRoot"></div>` });
  const root = document.getElementById("profileRoot");
  draw();

  // Event delegation: root нь хэвээр үлдэж, дотор нь дахин зурагддаг тул listener нэг л удаа нэмэгдэнэ
  root.addEventListener("click", onClick);
  root.addEventListener("submit", onSubmit);
  root.addEventListener("change", onChange);
}

/* ===================== Зурах ===================== */

function draw() {
  const root = document.getElementById("profileRoot");
  if (!root) return;
  const user = getUser();
  const pct = completion(user);

  root.innerHTML = `
    <div class="app-profile-head">
      <div>
        <h1 class="app-title mb-1">Миний профайл</h1>
        <p class="app-subtitle mb-0">Профайлаа бөглөж, өөрт тохирох тэтгэлгээ олоорой.</p>
      </div>
      <div class="box app-completion">
        <div class="is-flex is-justify-content-space-between mb-2">
          <strong>Профайлын бүрдэл</strong><strong class="${pct >= 80 ? "has-text-success" : "has-text-warning"}">${pct}%</strong>
        </div>
        <progress class="progress is-small ${pct >= 80 ? "is-success" : "is-warning"} mb-0" value="${pct}" max="100">${pct}%</progress>
      </div>
    </div>
    <div class="columns">
      <div class="column is-4-tablet is-3-desktop">${renderSide(user)}</div>
      <div class="column">
        ${PROFILE_SECTIONS.map((s) => renderSection(s, user)).join("")}
        ${renderDocuments(user)}
      </div>
    </div>`;
}

// Хэсгийн утгыг авах туслах функц
const val = (user, sectionId, fieldId) => user.profile?.[sectionId]?.[fieldId] ?? "";

// select-ийн утгыг шошго болгон харуулна (жишээ: "master" → "Магистр")
function display(field, value) {
  if (value === "" || value == null) return `<span class="has-text-grey-light">—</span>`;
  const opt = field.options?.find((o) => String(o.value) === String(value));
  return escapeHtml(opt ? opt.label : value);
}

// ---------- Зүүн тал ----------
function renderSide(user) {
  const p = user.profile || {};
  const a = p.academic || {};
  const photo = user.photo
    ? `<img src="${user.photo}" alt="Профайл зураг" />`
    : `<span class="icon"><i class="fas fa-user fa-3x"></i></span>`;

  const quick = [
    ["fa-star", "Голч", a.gpa ? `${a.gpa}${a.gpaScale ? " / " + a.gpaScale : ""}` : ""],
    ["fa-book", "Мэргэжил", a.major],
    ["fa-building-columns", "Сургууль", a.university],
    ["fa-calendar-check", "Төгсөх", a.gradYear],
  ]
    .map(([icon, label, v]) => `
      <li><span class="icon has-text-link"><i class="fas ${icon}"></i></span>
        <span>${label}: <strong>${v ? escapeHtml(v) : "—"}</strong></span></li>`)
    .join("");

  // Зөвлөмж: дутуу байгаа эхний хэсгийг санал болгоно
  const missing = PROFILE_SECTIONS.find((s) => s.fields.some((f) => !val(user, s.id, f.id)));
  const pref = p.preferences || {};
  const tip = missing
    ? `"${missing.title}" хэсгээ бөглөвөл танд илүү тохирох тэтгэлэг олоход тусална.`
    : `Профайл бүрэн байна! <a href="#/scholarships?level=${pref.degree || "all"}&field=${pref.field || "all"}">Тохирох тэтгэлгүүд →</a>`;

  const goalsBlock = editing === "goals"
    ? `<form data-form="goals">
         <textarea class="textarea is-small" name="goals" rows="3" maxlength="300" placeholder="Жишээ: Японд компьютерын ухаанаар магистр хамгаалах">${escapeHtml(user.goals || "")}</textarea>
         <div class="buttons are-small mt-2">
           <button class="button is-link" type="submit">Хадгалах</button>
           <button class="button is-light" type="button" data-cancel>Болих</button>
         </div>
       </form>`
    : `<p>${user.goals ? escapeHtml(user.goals) : `<span class="has-text-grey">Зорилгоо бичээгүй байна.</span>`}</p>
       <div class="has-text-right"><button class="button is-small is-ghost" type="button" data-edit="goals">
         <span class="icon"><i class="fas fa-pen"></i></span><span>Засах</span></button></div>`;

  return `
    <div class="box has-text-centered app-profile-card">
      <div class="app-avatar">
        ${photo}
        <label class="app-avatar-btn" title="Зураг солих">
          <input type="file" accept="image/*" data-photo hidden />
          <i class="fas fa-camera"></i>
        </label>
      </div>
      <p class="title is-5 mt-3 mb-1">${escapeHtml(val(user, "personal", "fullName") || user.name)}</p>
      <p class="is-size-7 has-text-grey"><span class="icon"><i class="fas fa-envelope"></i></span>${escapeHtml(user.email)}</p>
      ${val(user, "personal", "nationality") ? `<p class="is-size-7 has-text-grey"><span class="icon"><i class="fas fa-location-dot"></i></span>${escapeHtml(val(user, "personal", "nationality"))}</p>` : ""}
      <div class="buttons is-centered are-small mt-3">
        <label class="button is-link is-light">
          <input type="file" accept="image/*" data-photo hidden />
          <span class="icon"><i class="fas fa-image"></i></span><span>Зураг солих</span>
        </label>
        ${user.photo ? `<button class="button is-light" type="button" data-remove-photo>Устгах</button>` : ""}
      </div>
      <p class="help is-danger" id="photoError"></p>
    </div>

    <div class="box app-side-box">
      <p class="title is-6"><span class="icon has-text-link"><i class="fas fa-bolt"></i></span> Товч мэдээлэл</p>
      <ul class="app-quick">${quick}</ul>
    </div>

    <div class="box app-side-box">
      <p class="title is-6"><span class="icon has-text-danger"><i class="fas fa-bullseye"></i></span> Миний зорилго</p>
      ${goalsBlock}
    </div>

    ${renderMatchBox(user)}
    <div class="notification is-success is-light app-tip">
      <p class="has-text-weight-bold mb-1"><span class="icon"><i class="fas fa-lightbulb"></i></span> Зөвлөмж</p>
      <p class="is-size-7">${tip}</p>
    </div>`;
}

// ---------- Баруун талын хэсэг ----------
function renderSection(section, user) {
  const isEdit = editing === section.id;
  const head = `
    <div class="app-section-head">
      <span class="app-section-icon tag ${section.color} is-light"><i class="fas ${section.icon}"></i></span>
      <div class="is-flex-grow-1">
        <p class="title is-6 mb-0">${section.title}</p>
        <p class="is-size-7 has-text-grey">${section.subtitle}</p>
      </div>
      ${isEdit ? "" : `<button class="button is-small is-link is-outlined" type="button" data-edit="${section.id}">
        <span class="icon"><i class="fas fa-pen"></i></span><span>Засах</span></button>`}
    </div>`;

  const body = isEdit
    ? `<form data-form="${section.id}" novalidate>
        <div class="columns is-multiline is-variable is-2 mt-2">
          ${section.fields.map((f) => `<div class="column is-6-tablet is-4-desktop">${renderInput(f, val(user, section.id, f.id))}</div>`).join("")}
        </div>
        <div class="buttons is-right">
          <button class="button is-light" type="button" data-cancel>Болих</button>
          <button class="button is-link" type="submit"><span class="icon"><i class="fas fa-floppy-disk"></i></span><span>Хадгалах</span></button>
        </div>
      </form>`
    : `<div class="app-fields">
        ${section.fields.map((f) => `<div><p class="app-field-name">${f.label}</p><p class="app-field-value">${display(f, val(user, section.id, f.id))}</p></div>`).join("")}
      </div>`;

  return `<div class="box app-section ${isEdit ? "is-editing" : ""}" id="sec-${section.id}">${head}${body}</div>`;
}

// Нэг талбарын input (төрлөөс нь хамаарна)
function renderInput(f, value) {
  const v = escapeHtml(value ?? "");
  const req = f.required ? ` <span class="has-text-danger">*</span>` : "";
  let control;
  if (f.type === "select") {
    control = `<div class="select is-small is-fullwidth"><select name="${f.id}">
      <option value="">— Сонгох —</option>
      ${f.options.map((o) => `<option value="${escapeHtml(o.value)}" ${String(o.value) === String(value) ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}
    </select></div>`;
  } else if (f.type === "textarea") {
    control = `<textarea class="textarea is-small" name="${f.id}" rows="2">${v}</textarea>`;
  } else {
    const range = f.type === "number" ? ` min="${f.min}" max="${f.max}" step="${f.step}"` : "";
    control = `<input class="input is-small" name="${f.id}" type="${f.type}" value="${v}"${range} placeholder="${escapeHtml(f.placeholder || "")}" />`;
  }
  return `<label class="label is-small">${f.label}${req}</label>${control}<p class="help is-danger" data-error="${f.id}"></p>`;
}

// ---------- Бичиг баримт ----------
function renderDocuments(user) {
  const docs = user.documents || {};
  const items = DOCUMENTS.map((d) => {
    const file = docs[d.id];
    return `
      <div class="column is-6-tablet is-3-desktop">
        <div class="app-doc ${file ? "is-uploaded" : ""}">
          <span class="icon is-medium ${file ? "has-text-success" : "has-text-grey"}"><i class="fas ${file ? "fa-circle-check" : d.icon} fa-lg"></i></span>
          <div class="app-doc-text">
            <p class="has-text-weight-semibold">${d.label}</p>
            <p class="is-size-7 has-text-grey" title="${file ? escapeHtml(file.name) : ""}">${file ? escapeHtml(file.name) : "Байршуулаагүй"}</p>
          </div>
          <div class="buttons are-small">
            <label class="button is-small ${file ? "is-light" : "is-link is-light"}">
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" data-doc="${d.id}" hidden />
              <span class="icon"><i class="fas ${file ? "fa-rotate" : "fa-upload"}"></i></span>
            </label>
            ${file ? `<button class="button is-small is-light" type="button" data-remove-doc="${d.id}" title="Устгах"><span class="icon"><i class="fas fa-trash"></i></span></button>` : ""}
          </div>
        </div>
      </div>`;
  }).join("");

  return `
    <div class="box app-section">
      <div class="app-section-head">
        <span class="app-section-icon tag is-danger is-light"><i class="fas fa-folder-open"></i></span>
        <div class="is-flex-grow-1">
          <p class="title is-6 mb-0">Бичиг баримт</p>
          <p class="is-size-7 has-text-grey">Сургалтын төсөл тул файлыг хадгалахгүй — зөвхөн нэрийг тэмдэглэнэ</p>
        </div>
      </div>
      <div class="columns is-multiline is-variable is-2 mt-2">${items}</div>
    </div>`;
}

// Профайлын бүрдлийн хувь: бүх талбар + зураг + зорилго + бичиг баримт
function completion(user) {
  let total = 0;
  let filled = 0;
  for (const s of PROFILE_SECTIONS) {
    for (const f of s.fields) {
      total++;
      if (val(user, s.id, f.id) !== "") filled++;
    }
  }
  total += 2 + DOCUMENTS.length;
  if (user.photo) filled++;
  if (user.goals) filled++;
  filled += DOCUMENTS.filter((d) => user.documents?.[d.id]).length;
  return Math.round((filled / total) * 100);
}

/* ===================== Үйлдлүүд ===================== */

function onClick(e) {
  const edit = e.target.closest("[data-edit]");
  if (edit) {
    editing = edit.dataset.edit;
    draw();
    // Засаж буй хэсэг рүү гүйлгэж, эхний талбарт фокуслана
    const sec = document.getElementById(`sec-${editing}`);
    sec?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.querySelector(`[data-form="${editing}"] input, [data-form="${editing}"] select, [data-form="${editing}"] textarea`)?.focus();
    return;
  }
  if (e.target.closest("[data-cancel]")) {
    editing = null;
    draw();
    return;
  }
  if (e.target.closest("[data-remove-photo]")) {
    updateUser({ photo: null });
    draw();
    return;
  }
  const rmDoc = e.target.closest("[data-remove-doc]");
  if (rmDoc) {
    updateUser((acc) => {
      delete acc.documents?.[rmDoc.dataset.removeDoc];
      return acc;
    });
    draw();
  }
}

function onSubmit(e) {
  const form = e.target.closest("form[data-form]");
  if (!form) return;
  e.preventDefault();
  const id = form.dataset.form;
  const data = Object.fromEntries(new FormData(form));

  if (id === "goals") {
    updateUser({ goals: data.goals.trim() });
    editing = null;
    draw();
    return;
  }

  const section = PROFILE_SECTIONS.find((s) => s.id === id);
  const errors = validate(section, data);
  form.querySelectorAll("[data-error]").forEach((p) => {
    p.textContent = errors[p.dataset.error] || "";
    form.elements[p.dataset.error]?.classList.toggle("is-danger", Boolean(errors[p.dataset.error]));
  });
  if (Object.keys(errors).length) return;

  // Хоосон зайг цэвэрлээд хадгална
  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.trim()]));
  updateUser((acc) => {
    acc.profile = acc.profile || {};
    acc.profile[id] = clean;
    // Нэрээ сольсон бол бүртгэлийн нэр ч шинэчлэгдэнэ (navbar-т харагдана)
    if (id === "personal" && clean.fullName) acc.name = clean.fullName;
    return acc;
  });
  editing = null;
  draw();
}

// Талбаруудыг шалгах
function validate(section, data) {
  const errors = {};
  for (const f of section.fields) {
    const v = (data[f.id] ?? "").trim();
    if (f.required && !v) errors[f.id] = "Заавал бөглөнө.";
    if (!v) continue;
    if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[f.id] = "И-мэйл буруу байна.";
    if (f.type === "tel" && !/^[+\d\s()-]{6,20}$/.test(v)) errors[f.id] = "Утасны дугаар буруу байна.";
    if (f.type === "number") {
      const n = Number(v);
      if (Number.isNaN(n) || n < f.min || n > f.max) errors[f.id] = `${f.min}–${f.max} хооронд байна.`;
    }
  }
  // Голч дүн нь сонгосон хэмжүүрээс их байж болохгүй
  if (section.id === "academic" && data.gpa && data.gpaScale && Number(data.gpa) > Number(data.gpaScale)) {
    errors.gpa = `${data.gpaScale}-аас их байж болохгүй.`;
  }
  return errors;
}

async function onChange(e) {
  // Профайл зураг: 256×256 болгож жижигрүүлээд хадгална (localStorage-ийн багтаамж бага)
  if (e.target.matches("[data-photo]")) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showPhotoError("Зөвхөн зураг сонгоно уу.");
    try {
      const dataUrl = await resizeImage(file, 256);
      if (!updateUser({ photo: dataUrl })) return showPhotoError("Зураг хадгалах боломжгүй байна.");
      draw();
    } catch {
      showPhotoError("Зургийг уншиж чадсангүй.");
    }
    return;
  }

  // Бичиг баримт: зөвхөн нэр, хэмжээ, огноог тэмдэглэнэ
  if (e.target.matches("[data-doc]")) {
    const file = e.target.files[0];
    if (!file) return;
    const id = e.target.dataset.doc;
    updateUser((acc) => {
      acc.documents = acc.documents || {};
      acc.documents[id] = { name: file.name, size: file.size, date: new Date().toISOString().slice(0, 10) };
      return acc;
    });
    draw();
  }
}

function showPhotoError(msg) {
  const p = document.getElementById("photoError");
  if (p) p.textContent = msg;
}

// Зургийг дөрвөлжин хэлбэрт тайрч, size×size JPEG data URL болгоно
function resizeImage(file, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

// Миний: профайлд голч дүн, IELTS/TOPIK оруулсан бол тэнцэх тэтгэлгийн тоог харуулж,
// "Тэнцэх эсэх" хуудас руу холбоно.
function renderMatchBox(user) {
  const sc = scoresFromProfile(user);
  if (sc.gpa === "" && sc.ielts === "" && sc.topik === "") {
    return `<a class="box app-match-box" href="#/eligibility">
      <span class="icon is-medium"><i class="fas fa-list-check fa-lg"></i></span>
      <span>Голч дүн, IELTS/TOPIK оноогоо оруулаад тохирох сургуулиа олоорой →</span></a>`;
  }
  const res = evaluateAll(sc);
  const ok = res.filter((r) => r.status === "match").length;
  const close = res.filter((r) => r.status === "close").length;
  return `<a class="box app-match-box" href="#/eligibility">
    <span class="app-match-num">${ok}</span>
    <span><strong>тэтгэлэгт тэнцэнэ</strong>${close ? `<br><small>${close} нь бага зэрэг дутуу</small>` : ""}<br><small>Тохирох сургуулиудыг харах →</small></span></a>`;
}
