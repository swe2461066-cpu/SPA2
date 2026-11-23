import { renderGridPageLayout } from "../layouts/gridPageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderGuideCard } from "../components/guideCard.js";
import { openPdfModal } from "../components/pdfModal.js";
import { loadGuides } from "../services/dataService.js";
import { t } from "../i18n/i18n.js";

// 2.12 Гарын авлага хуудас — номын booksPage.js.
// guides.json-оос картуудыг grid layout-оор зурна. "Унших" дарахад PDF modal нээгдэнэ.
// PDF-үүдийг tools/buildGuides.mjs нь tools/guides/*.html-ээс үүсгэдэг.
export async function renderGuidesPage() {
  const app = document.getElementById("app");
  let guides;
  try {
    guides = await loadGuides();
  } catch (err) {
    app.innerHTML = renderGridPageLayout({ id: "guides", title: t("title.guides"), before: renderNotification(t("common.loadError", { error: err.message }), "danger") });
    return;
  }
  if (!location.hash.startsWith("#/guides")) return;

  app.innerHTML = renderGridPageLayout({
    id: "guides",
    title: t("title.guides"),
    subtitle: t("gd.subtitle"),
    items: guides.map(renderGuideCard),
  });

  app.querySelector(".app-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-read]");
    const guide = btn && guides.find((g) => g.id === btn.dataset.read);
    if (guide) openPdfModal(guide);
  });
}
