import { renderPageLayout } from "./pageLayout.js";

// 2.10 Хоёр баганатай layout — зүүн талд том (газрын зураг), баруун талд текст.
// Tablet-аас доош нэг багана болж, зүүн тал нь дээр гарна.
export function renderSplitPageLayout({ id, title, subtitle, left = "", right = "" }) {
  return renderPageLayout({
    id,
    title,
    subtitle,
    content: `
      <div class="columns is-variable is-5-desktop">
        <div class="column is-8-desktop is-12-tablet">${left}</div>
        <div class="column is-4-desktop is-12-tablet">${right}</div>
      </div>`,
  });
}
