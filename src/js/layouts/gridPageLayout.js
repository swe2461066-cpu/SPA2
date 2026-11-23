import { renderPageLayout } from "./pageLayout.js";

// 2.12 Сүлжээ (grid) layout — номын booksPage-ийн картуудыг жигд байрлуулна.
// items — карт бүрийн HTML. Дэлгэцийн өргөнөөс хамаарч 1–3 багана.
export function renderGridPageLayout({ id, title, subtitle, items = [], before = "" }) {
  return renderPageLayout({
    id,
    title,
    subtitle,
    content: `${before}<div class="app-grid">${items.join("")}</div>`,
  });
}
