import { loadWorldMap } from "../services/dataService.js";
import { getAllScholarships } from "../services/scholarshipService.js";
import { t, getLang } from "../i18n/i18n.js";

// 2.10 Газрын зураг — номын map.js (аймгийн SVG) → дэлхийн SVG.
// world.svg-ийн улс бүр <path id="c392" data-name="Japan">. Тэтгэлэг бүрийн mapIds-ээр холбоно.
// Миний: тэтгэлэгтэй улсыг өнгөөр будаж, өнгөний тайлбар (legend) нэмэв; hover/focus хийхэд
// улсын нэр, тэтгэлгийн тоо гарна; гараар (Tab + Enter) ч сонгож болно.
// onSelect(country, scholarships) — улс дарахад дуудагдана.

// SVG-д улсын нэр англиар байдаг. Зөвхөн Erasmus-аар будагдах ЕХ-ны улсуудын монгол нэр.
const EU_MN = {
  "040": "Австри", "056": "Бельги", "100": "Болгар", "191": "Хорват", "196": "Кипр", "203": "Чех",
  "208": "Дани", "233": "Эстони", "246": "Финланд", "250": "Франц", "300": "Грек", "372": "Ирланд",
  "380": "Итали", "428": "Латви", "440": "Литва", "442": "Люксембург", "470": "Мальта", "528": "Нидерланд",
  "616": "Польш", "620": "Португал", "642": "Румын", "703": "Словак", "705": "Словени", "724": "Испани",
  "752": "Швед",
};

// mapId → тэтгэлгүүд
function buildIndex() {
  const index = new Map();
  getAllScholarships().forEach((s) =>
    (s.mapIds || []).forEach((id) => {
      if (!index.has(id)) index.set(id, []);
      index.get(id).push(s);
    })
  );
  return index;
}

export async function mountWorldMap(container, onSelect) {
  container.innerHTML = await loadWorldMap();
  const svg = container.querySelector("svg");
  svg.setAttribute("aria-label", t("ov.mapLabel"));
  const tooltip = document.getElementById("mapTooltip");
  const index = buildIndex();

  svg.querySelectorAll("path[id]").forEach((path) => {
    const list = index.get(path.id.slice(1));
    if (!list) return;
    // Зөвхөн Erasmus (ЕХ-ны ерөнхий хөтөлбөр) байгаа улсыг цайвар өнгөөр
    const onlyEu = list.every((s) => s.id === "erasmus");
    path.classList.add(onlyEu ? "is-eu" : "is-has");
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", `${countryName(path, list)}: ${t("ov.tooltip", { count: list.length })}`);
  });

  // Улсын нэр: тэтгэлгийн өгөгдөлд тухайн улсын нэр байвал түүнийг (монголоор), үгүй бол SVG-ийн англи нэр
  function countryName(path, list) {
    const own = list.find((s) => s.id !== "erasmus" && s.mapIds.length === 1);
    if (own) return own.country;
    return getLang() === "mn" ? EU_MN[path.id.slice(1)] ?? path.dataset.name : path.dataset.name;
  }

  function showTip(path, x, y) {
    const list = index.get(path.id.slice(1));
    if (!list) return hideTip();
    tooltip.innerHTML = `<strong>${countryName(path, list)}</strong><span>${t("ov.tooltip", { count: list.length })}</span>`;
    const box = tooltip.parentElement.getBoundingClientRect(); // .app-map-box (position: relative)
    tooltip.style.left = `${Math.min(x - box.left + 12, box.width - 170)}px`;
    tooltip.style.top = `${y - box.top + 12}px`;
    tooltip.hidden = false;
  }
  const hideTip = () => (tooltip.hidden = true);

  const select = (path) => {
    const list = index.get(path?.id?.slice(1));
    if (list) onSelect(countryName(path, list), list);
  };

  svg.addEventListener("mousemove", (e) => {
    const path = e.target.closest("path.is-has, path.is-eu");
    path ? showTip(path, e.clientX, e.clientY) : hideTip();
  });
  svg.addEventListener("mouseleave", hideTip);
  svg.addEventListener("click", (e) => select(e.target.closest("path.is-has, path.is-eu")));
  svg.addEventListener("focusin", (e) => {
    const path = e.target.closest("path[tabindex]");
    if (!path) return;
    const r = path.getBoundingClientRect();
    showTip(path, r.left + r.width / 2, r.top + r.height / 2);
  });
  svg.addEventListener("focusout", hideTip);
  svg.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(e.target.closest("path[tabindex]"));
    }
  });

  // Газрын зураг дээр будагдсан улсын тоо (1:110m зурагт Мальта зэрэг жижиг улс байхгүй)
  return { countries: svg.querySelectorAll("path.is-has, path.is-eu").length };
}
