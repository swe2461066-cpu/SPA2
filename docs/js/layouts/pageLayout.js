// Бүх хуудсанд давтагдах section → container → гарчиг бүтэц.
export function renderPageLayout({ id = "", title = "", subtitle = "", content = "" }) {
  return `
    <section ${id ? `id="${id}"` : ""} class="section">
      <div class="container">
        ${title ? `<h1 class="app-title">${title}</h1><div class="app-line"></div>` : ""}
        ${subtitle ? `<p class="app-subtitle">${subtitle}</p>` : ""}
        ${content}
      </div>
    </section>
  `;
}
