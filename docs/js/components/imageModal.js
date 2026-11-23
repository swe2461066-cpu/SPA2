import { openModal } from "./modal.js";
import { getImages } from "../services/imageService.js";
import { t } from "../i18n/i18n.js";
import { escapeHtml } from "../fn/escapeHtml.js";

// 2.8 Зургийн modal — номын imageModal.js.
// Миний: зургийн дугаар (2 / 4), ← → товч болон гарын сумаар солих, том зургийг дарж байж ачаална.
export function openImageModal(scholarship, start = 0) {
  const images = getImages(scholarship.id);
  let index = Math.min(start, Math.max(images.length - 1, 0));

  const modal = openModal({
    id: "imageModal",
    className: "app-image-modal",
    content: `
      <div class="modal-content" aria-labelledby="imageModalTitle">
        <p class="app-image-title" id="imageModalTitle">${escapeHtml(t("img.title", { name: scholarship.name }))}</p>
        ${images.length
          ? `<figure class="app-image-frame">
              <img id="imageModalImg" alt="" />
              <button class="app-image-nav is-prev" type="button" data-step="-1" aria-label="${t("img.prev")}"><i class="fas fa-chevron-left"></i></button>
              <button class="app-image-nav is-next" type="button" data-step="1" aria-label="${t("img.next")}" autofocus><i class="fas fa-chevron-right"></i></button>
            </figure>
            <p class="app-image-meta"><span id="imageModalCount"></span><span>${t("img.credit")}</span></p>`
          : `<p class="notification is-light">${t("img.none")}</p>`}
      </div>`,
    onKey: (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    },
  });

  function show(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length; // эхэнд/төгсгөлд хүрвэл эргэлдэнэ
    const img = modal.querySelector("#imageModalImg");
    img.src = images[index].full;
    img.alt = `${scholarship.name} ${index + 1}`;
    modal.querySelector("#imageModalCount").textContent = `${index + 1} / ${images.length}`;
  }

  modal.querySelectorAll("[data-step]").forEach((btn) =>
    btn.addEventListener("click", () => show(index + Number(btn.dataset.step)))
  );
  show(index);
}
