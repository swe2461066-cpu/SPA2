import { t } from "../i18n/i18n.js";
import { getRegions } from "../services/scholarshipService.js";

// 2.13 Footer — номын footer.js.
// Миний: номд <li> бүрийг гараар давтаж, inline style ашигласан байсныг массиваас үүсгэж,
// загварыг SCSS (_theme.scss → .app-footer) руу шилжүүлэв. 4-р ажилд index.html-д байсан
// статик footer-ийг энэ компонент болгосноор хэл солигдоход footer ч орчуулагдана.
const MENU = [
  { href: "#/home", key: "nav.home" },
  { href: "#/scholarships", key: "nav.scholarships" },
  { href: "#/eligibility", key: "nav.eligibility" },
  { href: "#/contact", key: "nav.contact" },
  { href: "#/register", key: "header.register" },
  { href: "#/profile", key: "nav.profile" },
];

const TOOLS = [
  { href: "#/overview", key: "nav.overview", icon: "fa-earth-asia" },
  { href: "#/calculator", key: "nav.calculator", icon: "fa-calculator" },
  { href: "#/guides", key: "nav.guides", icon: "fa-book-open" },
];

const links = (list) =>
  list.map((l) => `<a href="${l.href}">${l.icon ? `<i class="fas ${l.icon}"></i> ` : ""}${l.text ?? t(l.key)}</a>`).join("");

export function renderFooter() {
  const regions = getRegions().map((r) => ({ href: `#/scholarships?region=${r.id}`, text: r.name }));
  return `
    <div class="container app-footer-grid">
      <a class="app-footer-brand" href="#/home">
        <img src="./img/icon/logo.svg" alt="" width="52" height="58" />
        <span><strong>${t("brand.name")}</strong><small>${t("brand.tagline")}</small></span>
      </a>
      <div>
        <p class="app-footer-title">${t("footer.menu")}</p>
        <nav class="app-footer-links is-two" aria-label="${t("footer.menu")}">${links(MENU)}</nav>
      </div>
      <div>
        <p class="app-footer-title">${t("footer.regions")}</p>
        <nav class="app-footer-links" aria-label="${t("footer.regions")}">${links(regions)}</nav>
      </div>
      <div>
        <p class="app-footer-title">${t("footer.tools")}</p>
        <nav class="app-footer-links" aria-label="${t("footer.tools")}">${links(TOOLS)}</nav>
        <p class="app-footer-note">${t("footer.noticeText")}</p>
      </div>
    </div>
    <p class="app-footer-copy">${t("footer.copy", { year: new Date().getFullYear() })}</p>`;
}

export function mountFooter(el) {
  if (el) el.innerHTML = renderFooter();
}
