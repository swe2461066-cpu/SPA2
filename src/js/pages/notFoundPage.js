import { renderPageLayout } from "../layouts/pageLayout.js";

// Бүртгэлгүй hash руу орвол энэ хуудас гарна.
// Миний: номд "дараагийн бүлгүүдэд хийгдэнэ" гэсэн хоосон хуудас байсныг буцах товчтой болгосон.
export function renderNotFoundPage() {
  document.getElementById("app").innerHTML = renderPageLayout({
    id: "notFound",
    content: `
      <div class="has-text-centered py-6">
        <p class="app-404">404</p>
        <p class="title is-4">Хуудас олдсонгүй</p>
        <p class="mb-5"><code>${location.hash}</code> гэсэн хуудас байхгүй байна.</p>
        <a class="button is-info" href="#/home">
          <span class="icon"><i class="fas fa-house"></i></span><span>Нүүр хуудас руу буцах</span>
        </a>
      </div>
    `,
  });
}
