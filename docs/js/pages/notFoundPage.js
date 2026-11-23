import { renderPageLayout } from "../layouts/pageLayout.js";
import { escapeHtml } from "../fn/escapeHtml.js";
import { t } from "../i18n/i18n.js";

// Бүртгэлгүй hash руу орвол энэ хуудас гарна.
// Миний: номд "дараагийн бүлгүүдэд хийгдэнэ" гэсэн хоосон хуудас байсныг буцах товчтой болгосон.
// URL-ийн хэсгийг escapeHtml-ээр хамгаалж харуулна (#/<img onerror=...> гэх мэт).
export function renderNotFoundPage() {
  let hash = location.hash;
  try {
    hash = decodeURIComponent(hash);
  } catch {
    /* буруу %-кодтой бол байгаагаар нь харуулна */
  }
  document.getElementById("app").innerHTML = renderPageLayout({
    id: "notFound",
    content: `
      <div class="has-text-centered py-6">
        <p class="app-404">404</p>
        <p class="title is-4">${t("title.404")}</p>
        <p class="mb-5">${t("nf.text", { hash: escapeHtml(hash) })}</p>
        <a class="button is-primary" href="#/home">
          <span class="icon"><i class="fas fa-house"></i></span><span>${t("nf.back")}</span>
        </a>
      </div>
    `,
  });
}
