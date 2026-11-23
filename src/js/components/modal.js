import { t } from "../i18n/i18n.js";

// Миний: зураг, газрын зураг, PDF гурван modal-д давтагдах нээх/хаах логикийг нэг газар.
//   - body-д нэг л удаа нэмэгдэнэ (id-аар), дахин нээхэд агуулгыг нь солино
//   - ESC, арын бараан хэсэг, × товчоор хаагдана; хаахад өмнөх фокус руу буцна
//   - нээлттэй үед хуудас гүйлгэгдэхгүй (html.is-clipped — Bulma)
//   - хуудас солигдоход (hashchange) автоматаар хаагдана
let lastFocus = null;

export function openModal({ id, className = "", content, onKey }) {
  let modal = document.getElementById(id);
  if (!modal) {
    modal = document.createElement("div");
    modal.id = id;
    modal.className = `modal ${className}`;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeModal(id);
    });
  }
  modal.innerHTML = `
    <div class="modal-background" data-close></div>
    ${content}
    <button class="modal-close is-large" type="button" aria-label="${t("common.close")}" data-close></button>`;

  lastFocus = document.activeElement;
  modal.classList.add("is-active");
  document.documentElement.classList.add("is-clipped");
  modal._onKey = (e) => {
    if (e.key === "Escape") closeModal(id);
    else onKey?.(e);
  };
  document.addEventListener("keydown", modal._onKey);
  (modal.querySelector("[autofocus]") || modal.querySelector(".modal-close")).focus();
  return modal;
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal?.classList.contains("is-active")) return;
  modal.classList.remove("is-active");
  document.removeEventListener("keydown", modal._onKey);
  document.documentElement.classList.remove("is-clipped");
  modal.querySelector("iframe")?.remove(); // PDF-ийг санах ойгоос чөлөөлнө
  lastFocus?.focus?.();
}

window.addEventListener("hashchange", () => {
  document.querySelectorAll(".modal.is-active").forEach((m) => closeModal(m.id));
});
