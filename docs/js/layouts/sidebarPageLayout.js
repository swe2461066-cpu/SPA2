import { renderPageLayout } from "./pageLayout.js";
import { t } from "../i18n/i18n.js";

// Зүүн талд sidebar цэс, баруун талд үндсэн агуулгатай layout.
// Mobile (<=768px) дээр sidebar нуугдаж, товчоор гулсаж гарна.
// Миний: товчны бичвэрийг (sidebarLabel) хуудас бүр өөрөө өгнө — Тэтгэлгүүд, Зардлын тооцоо хоёулаа ашиглана.
export function renderSidebarPageLayout({ sidebarContent = "", mainContent = "", pageId = "", pageTitle = "", pageSubtitle = "", sidebarLabel = "" }) {
  return `
    <div class="app-mobile-sidebar">
      <button id="openSidebar" class="button is-small is-light" type="button">
        <span class="icon"><i class="fas fa-bars"></i></span><span>${sidebarLabel || t("sidebar.open")}</span>
      </button>
    </div>
    <div id="sidebarOverlay" class="app-sidebar-overlay"></div>
    <div class="app-shell">
      <aside id="appSidebar" class="app-sidebar">
        <div class="app-sidebar-mobile-head">
          <button id="closeSidebar" class="delete" aria-label="${t("common.close")}" type="button"></button>
        </div>
        <nav class="menu">${sidebarContent}</nav>
      </aside>
      <div class="app-main-content">
        ${renderPageLayout({ id: pageId, title: pageTitle, subtitle: pageSubtitle, content: mainContent })}
      </div>
    </div>
  `;
}
