import { LEVELS, FIELDS } from "../data/categories.js";
import { getImages } from "../services/imageService.js";
import { t } from "../i18n/i18n.js";

// Нэг тэтгэлгийн мэдээллийг Bulma card хэлбэрээр зурна.
// selectedField — шүүлтүүрт сонгосон мэргэжил (тодруулж харуулна)
// matchedUnis — Миний: хайлтад таарсан сургуулиуд (картын дээр тодруулж харуулна)
// 5-р ажлаас: дээр нь зураг (2.8), "Зураг (n)" товч modal нээнэ, бичвэрүүд 2 хэлээр (2.9).
export function renderScholarshipCard(item, region, selectedField = "all", matchedUnis = []) {
  const images = getImages(item.id);
  const photo = images.length
    ? `<div class="card-image app-card-photo">
        <img src="${images[0].thumb}" alt="" loading="lazy" />
        <button class="app-photo-btn" type="button" data-photos="${item.id}">
          <i class="fas fa-images"></i> ${t("card.photos", { count: images.length })}
        </button>
      </div>`
    : "";

  const unisBlock = matchedUnis.length
    ? `<div class="app-card-match"><p class="app-field-label">${t("card.matched")}</p>
        ${matchedUnis.map((u) => `<span><i class="fas fa-building-columns"></i> ${u}</span>`).join("")}</div>`
    : "";
  // Түвшин бүрийг өөр өнгийн tag болгоно
  const levelTags = LEVELS.filter((l) => item.levels.includes(l.id))
    .map((l) => `<span class="tag ${l.color} is-light">${l.name}</span>`)
    .join("");

  const coverage = item.coverage === "full"
    ? `<span class="app-badge is-full"><i class="fas fa-circle-check"></i> ${t("common.full")}</span>`
    : `<span class="app-badge is-partial"><i class="fas fa-circle-half-stroke"></i> ${t("common.partial")}</span>`;

  // Мэргэжил: бүх мэргэжилд нээлттэй бол нэг tag, үгүй бол чиглэл бүрийг жагсаана
  const fieldTags = item.fields === "all"
    ? `<span class="tag app-major-tag">${t("common.allFields")}</span>`
    : FIELDS.filter((f) => item.fields.includes(f.id))
        .map((f) => `<span class="tag app-major-tag${f.id === selectedField ? " is-selected" : ""}">${f.name}</span>`)
        .join("");

  return `
    <div class="column is-12-mobile is-6-tablet is-4-widescreen">
      <article class="card app-scholar-card">
        ${photo}
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
              <p class="app-field-label">${t("common.level")}</p>
              <div class="tags are-small mb-0">${levelTags}</div>
            </div>
            <div>
              <p class="app-field-label">${t("common.field")}</p>
              <div class="tags are-small mb-0">${fieldTags}</div>
            </div>
          </div>
        </div>
        <footer class="app-card-foot">
          <span class="app-deadline" title="${t("card.deadline")}">
            <i class="fas fa-calendar-days"></i> ${item.deadline}
          </span>
          <span class="app-card-actions">
            <a class="button is-small is-light" href="#/calculator?id=${item.id}" title="${t("nav.calculator")}">
              <span class="icon"><i class="fas fa-calculator"></i></span><span>${t("card.cost")}</span>
            </a>
            <a class="button is-small is-link is-light" href="${item.url}" target="_blank" rel="noopener">
              <span>${t("common.officialSite")}</span><span class="icon"><i class="fas fa-arrow-up-right-from-square"></i></span>
            </a>
          </span>
        </footer>
      </article>
    </div>
  `;
}
