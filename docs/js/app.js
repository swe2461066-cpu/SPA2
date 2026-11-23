// SPA-ийн эхлэл: өгөгдлөө ачаалж, navbar, footer-ийг зурж, router-ийг асаана.
// 5-р ажлаас (2.6): тэтгэлэг, зургийн JSON-ийг service-ээр нэг удаа татна. Бусад хуудсууд
// (газрын зураг, зардал, гарын авлага) өөрийн өгөгдлөө орох үедээ ачаална.
// 2.9: хэл солигдоход ("lang-change") navbar, footer, тухайн хуудас дахин зурагдана.
import { mountNavbar, renderNavbarInto } from "./components/navbar.js";
import { mountFooter } from "./components/footer.js";
import { initRouter } from "./router.js";
import { routes } from "./routes.js";
import { loadScholarships } from "./services/scholarshipService.js";
import { loadImages } from "./services/imageService.js";
import { renderNotification } from "./layouts/notificationLayout.js";
import { t } from "./i18n/i18n.js";

const navbarEl = document.getElementById("navbar");
const footerEl = document.getElementById("footer");
const app = document.getElementById("app");

mountNavbar(navbarEl);
app.innerHTML = `<section class="section"><div class="container"><p class="has-text-grey">${t("common.loading")}</p></div></section>`;

try {
  // Зураг ачаалагдаагүй ч сайт ажиллана (зураггүй карт харагдана)
  await Promise.all([loadScholarships(), loadImages().catch((err) => console.warn(err))]);
  mountFooter(footerEl);
  const rerender = initRouter(routes);

  window.addEventListener("lang-change", () => {
    renderNavbarInto();
    mountFooter(footerEl);
    rerender({ keepScroll: true });
  });
} catch (err) {
  console.error(err);
  app.innerHTML = `<section class="section"><div class="container">${renderNotification(
    t("common.loadError", { error: err.message }),
    "danger"
  )}</div></section>`;
}
