import { renderTable } from "../layouts/tableLayout.js";
import { LEVELS } from "../data/categories.js";
import { getImages } from "../services/imageService.js";
import { t } from "../i18n/i18n.js";

// 2.7 Тэтгэлгүүдийг харьцуулах хүснэгт (номын nutritionTables.js-ийн оронд).
// Миний: нэр, голч, IELTS, зургийн тоогоор эрэмбэлнэ. Зургийн тоо дээр дарахад modal нээгдэнэ (2.8).
const SORTERS = {
  name: (s) => s.name,
  gpa: (s) => s.requirements.gpa,
  ielts: (s) => s.requirements.ielts ?? 0,
  photos: (s) => getImages(s.id).length,
};

export function renderScholarshipTable(list, sort) {
  const rows = [...list];
  if (sort && SORTERS[sort.key]) {
    const get = SORTERS[sort.key];
    const dir = sort.dir === "ascending" ? 1 : -1;
    rows.sort((a, b) => {
      const x = get(a);
      const y = get(b);
      return (typeof x === "string" ? x.localeCompare(y, "mn") : x - y) * dir;
    });
  }

  const lang = (s) => {
    const r = s.requirements;
    const parts = [r.ielts != null && `IELTS ${r.ielts.toFixed(1)}`, r.topik != null && `TOPIK ${r.topik}`].filter(Boolean);
    return parts.length ? parts.join(" / ") : `<span class="has-text-grey">${t("table.noLang")}</span>`;
  };

  return renderTable({
    caption: t("title.scholarships"),
    sort,
    sortLabel: (label) => t("table.sort", { label }),
    rows,
    columns: [
      {
        key: "name",
        label: t("table.name"),
        sortable: true,
        render: (s) => `<strong>${s.name}</strong><br><small class="has-text-grey"><i class="fas ${s.region.icon}"></i> ${s.country}</small>`,
      },
      {
        key: "levels",
        label: t("table.level"),
        render: (s) => `<div class="tags are-small mb-0">${LEVELS.filter((l) => s.levels.includes(l.id))
          .map((l) => `<span class="tag ${l.color} is-light">${l.name}</span>`).join("")}</div>`,
      },
      {
        key: "coverage",
        label: t("table.coverage"),
        render: (s) => (s.coverage === "full"
          ? `<span class="app-badge is-full">${t("common.full")}</span>`
          : `<span class="app-badge is-partial">${t("common.partial")}</span>`),
      },
      { key: "gpa", label: t("table.gpa"), sortable: true, className: "has-text-right", render: (s) => `${s.requirements.gpa}%` },
      { key: "ielts", label: t("table.lang"), sortable: true, render: lang },
      { key: "deadline", label: t("table.deadline"), className: "app-td-wide", render: (s) => s.deadline },
      {
        key: "photos",
        label: t("table.photos"),
        sortable: true,
        className: "has-text-centered",
        render: (s) => {
          const n = getImages(s.id).length;
          return n
            ? `<button class="button is-small is-light" type="button" data-photos="${s.id}" aria-label="${t("card.photos", { count: n })}">
                <span class="icon"><i class="fas fa-images"></i></span><span>${n}</span></button>`
            : "—";
        },
      },
    ],
  });
}
