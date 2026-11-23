import { openModal } from "./modal.js";
import { t, loc } from "../i18n/i18n.js";

// 2.12 PDF modal — номын pdfModal.js. PDF-ийг iframe дотор харуулна.
// Миний: утасны зарим хөтөч PDF-ийг iframe-д харуулдаггүй тул "Шинэ цонхонд нээх" холбоос нэмэв.
// Хаахад iframe-ийг устгаж (modal.js) санах ойг чөлөөлнө.
export function openPdfModal(guide) {
  openModal({
    id: "pdfModal",
    className: "app-pdf-modal",
    content: `
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">${loc(guide.title)}</p>
          <a class="button is-small is-light" href="${guide.pdf}" target="_blank" rel="noopener" autofocus>
            <span class="icon"><i class="fas fa-up-right-from-square"></i></span><span>${t("gd.openTab")}</span>
          </a>
        </header>
        <section class="modal-card-body p-0">
          <iframe src="${guide.pdf}#view=FitH" title="${loc(guide.title)}">
            <p>${t("gd.noPdf")} <a href="${guide.pdf}">${t("gd.download")}</a></p>
          </iframe>
        </section>
      </div>`,
  });
}
