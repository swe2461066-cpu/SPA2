import { t, loc } from "../i18n/i18n.js";

// 2.12 Гарын авлагын карт — номын bookCard.js.
// Миний: номд зөвхөн зураг байсан бол энд өнгөт нүүр, гарчиг, хуудасны тоо, "Унших" (modal)
// болон "Татах" товч нэмэв. Hover хийхэд карт дээшээ бага зэрэг хөдөлнө.
export function renderGuideCard(g) {
  return `
    <article class="card app-guide-card" style="--guide:${g.color}">
      <div class="app-guide-cover">
        <i class="fas ${g.icon}"></i>
        <span class="app-guide-pages">PDF · ${t("gd.pages", { count: g.pages })}</span>
      </div>
      <div class="card-content">
        <h3 class="title is-5 mb-2">${loc(g.title)}</h3>
        <p class="app-guide-text">${loc(g.text)}</p>
      </div>
      <footer class="app-guide-foot">
        <button class="button is-primary is-small" type="button" data-read="${g.id}">
          <span class="icon"><i class="fas fa-book-open-reader"></i></span><span>${t("gd.read")}</span>
        </button>
        <a class="button is-light is-small" href="${g.pdf}" download>
          <span class="icon"><i class="fas fa-download"></i></span><span>${t("gd.download")}</span>
        </a>
      </footer>
    </article>`;
}
