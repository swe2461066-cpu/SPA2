import { openModal } from "./modal.js";
import { t } from "../i18n/i18n.js";

// 2.10 Улсын мэдээллийн modal — номын infoModal.js (аймгийн хүнсний жагсаалт).
// Тухайн улсын тэтгэлгүүдийг radio-оор сонгуулна.
// Миний: номд хүнс сонгоогүй үед "Хайх" дарахад alert() гардаг байсан —
// энд сонгоогүй үед товчнууд идэвхгүй, сонгомогц идэвхжинэ. ESC-ээр хаагдана.
export function openInfoModal(country, scholarships) {
  const items = scholarships
    .map(
      (s, i) => `
      <label class="app-info-item">
        <input type="radio" name="infoPick" value="${s.id}" ${scholarships.length === 1 ? "checked" : ""} ${i === 0 ? "autofocus" : ""} />
        <span>
          <strong>${s.name}</strong>
          <small>${s.country} · ${s.coverage === "full" ? t("common.fullScholarship") : t("common.partial")} · ${s.deadline}</small>
        </span>
      </label>`
    )
    .join("");

  const modal = openModal({
    id: "infoModal",
    content: `
      <div class="modal-card app-info-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">${t("ov.modalTitle", { country })}</p>
        </header>
        <section class="modal-card-body">
          <p class="mb-3 has-text-grey">${t("ov.modalChoose")}</p>
          <div class="app-info-list" role="radiogroup">${items}</div>
        </section>
        <footer class="modal-card-foot app-info-foot">
          <a class="button is-primary" id="infoDetails" aria-disabled="true">${t("ov.details")}</a>
          <a class="button is-light" id="infoCalc" aria-disabled="true"><span class="icon"><i class="fas fa-calculator"></i></span><span>${t("ov.calc")}</span></a>
        </footer>
      </div>`,
  });

  const details = modal.querySelector("#infoDetails");
  const calc = modal.querySelector("#infoCalc");
  const sync = () => {
    const id = modal.querySelector("input[name=infoPick]:checked")?.value;
    const s = scholarships.find((x) => x.id === id);
    [details, calc].forEach((b) => {
      b.toggleAttribute("disabled", !s);
      b.setAttribute("aria-disabled", String(!s));
    });
    if (s) {
      details.href = `#/scholarships?q=${encodeURIComponent(s.name)}`;
      calc.href = `#/calculator?id=${s.id}`;
    } else {
      details.removeAttribute("href");
      calc.removeAttribute("href");
    }
  };
  modal.querySelector(".app-info-list").addEventListener("change", sync);
  sync();
}
