import { DEFAULT_ROUTE } from "./routes.js";
import { setActiveNavLink } from "./components/navbar.js";
import { t } from "./i18n/i18n.js";

// URL-ийн # (hash) хэсэг өөрчлөгдөхөд тохирох хуудсыг зурна.
// Жишээ: index.html#/scholarships → routes["#/scholarships"].render()
// Миний: renderRoute-ийг буцаадаг болгосон — хэл солигдоход app.js тухайн хуудсыг дахин зурна.
export function initRouter(routes) {
  function renderRoute({ keepScroll = false } = {}) {
    // Миний: "#/scholarships?region=asia" гэх мэт query-тэй hash-ийг ч таньдаг болгосон.
    const hash = (window.location.hash || DEFAULT_ROUTE).split("?")[0];

    // Миний: "#/" эсвэл хоосон hash ирвэл нүүр хуудас руу шилжүүлнэ (номд 404 гардаг байсан).
    if (hash === "#/" || hash === "#") {
      window.location.replace(DEFAULT_ROUTE);
      return;
    }

    const route = routes[hash] || routes["#/404"];
    // 6-р ажлын хуудсууд өгөгдлөө async ачаалдаг — алдааг консолд гаргаж, хуудас эвдрэхээс сэргийлнэ
    Promise.resolve(route.render()).catch((err) => console.error(err));

    // Миний: хуудасны гарчиг, идэвхтэй цэс, scroll-ийг хуудас солих бүрд шинэчилнэ.
    document.title = `${t(route.titleKey)} | ${t("site")}`;
    setActiveNavLink(hash);
    if (!keepScroll) window.scrollTo({ top: 0 });
  }

  // Миний: номд "load" event ашигласан. type="module" скрипт DOM бэлэн болсны дараа ажилладаг тул
  // шууд дуудвал зураг ачаалагдахыг хүлээхгүйгээр хуудас хурдан гарна.
  renderRoute();
  window.addEventListener("hashchange", () => renderRoute());
  return renderRoute;
}
