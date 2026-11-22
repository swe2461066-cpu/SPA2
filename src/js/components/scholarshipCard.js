import { LEVELS, FIELDS } from "../data/scholarships.js";

// Нэг тэтгэлгийн мэдээллийг Bulma card хэлбэрээр зурна.
// selectedField — шүүлтүүрт сонгосон мэргэжил (тодруулж харуулна)
// matchedUnis — Миний: хайлтад таарсан сургуулиуд (картын дээр тодруулж харуулна)
export function renderScholarshipCard(item, region, selectedField = "all", matchedUnis = []) {
  const unisBlock = matchedUnis.length
    ? `<div class="app-card-match"><p class="app-field-label">Хайлтад таарсан сургууль</p>
        ${matchedUnis.map((u) => `<span><i class="fas fa-building-columns"></i> ${u}</span>`).join("")}</div>`
    : "";
  // Түвшин бүрийг өөр өнгийн tag болгоно
  const levelTags = LEVELS.filter((l) => item.levels.includes(l.id))
    .map((l) => `<span class="tag ${l.color} is-light">${l.name}</span>`)
    .join("");

  const coverage = item.coverage === "full"
    ? `<span class="app-badge is-full"><i class="fas fa-circle-check"></i> Бүрэн</span>`
    : `<span class="app-badge is-partial"><i class="fas fa-circle-half-stroke"></i> Хэсэгчилсэн</span>`;

  // Мэргэжил: бүх мэргэжилд нээлттэй бол нэг tag, үгүй бол чиглэл бүрийг жагсаана
  const fieldTags = item.fields === "all"
    ? `<span class="tag is-light">Бүх мэргэжил</span>`
    : FIELDS.filter((f) => item.fields.includes(f.id))
        .map((f) => `<span class="tag ${f.id === selectedField ? "is-link" : "is-light"}">${f.name}</span>`)
        .join("");

  return `
    <div class="column is-12-mobile is-6-tablet is-4-widescreen">
      <article class="card app-scholar-card">
        <div class="card-content">
          <div class="app-card-top">
            <span class="tag ${region.color} is-light app-country">
              <i class="fas ${region.icon}"></i>&nbsp;${item.country}
            </span>
            ${coverage}
          </div>
          <h3 class="title is-5 mt-3 mb-1">${item.name}</h3>
          <p class="app-scholar-provider">${item.provider}</p>
          <p class="app-scholar-text mt-3">${item.text}</p>
          ${unisBlock}

          <div class="app-card-meta">
            <div>
              <p class="app-field-label">Түвшин</p>
              <div class="tags are-small mb-0">${levelTags}</div>
            </div>
            <div>
              <p class="app-field-label">Мэргэжил</p>
              <div class="tags are-small mb-0">${fieldTags}</div>
            </div>
          </div>
        </div>
        <footer class="app-card-foot">
          <span class="app-deadline" title="Бүртгэлийн хугацаа (ойролцоо)">
            <i class="fas fa-calendar-days"></i> ${item.deadline}
          </span>
          <a class="button is-small is-link is-light" href="${item.url}" target="_blank" rel="noopener">
            <span>Албан сайт</span><span class="icon"><i class="fas fa-arrow-up-right-from-square"></i></span>
          </a>
        </footer>
      </article>
    </div>
  `;
}
