// 2.7 Хүснэгтийн layout — номын tableLayout.js.
// columns: [{ key, label, render?(row) , sortable?, className? }]
// Миний: номд 2.8.3-т багананд render() нэмэгдсэн ч tableLayout дэмжээгүй байсныг засав.
//        Эрэмбэлэх боломжтой баганын гарчиг товч болж, aria-sort-оор чиглэлээ заана.
export function renderTable({ columns, rows, caption = "", sort = null, sortLabel = (l) => l }) {
  const head = columns
    .map((c) => {
      if (!c.sortable) return `<th class="${c.className || ""}">${c.label}</th>`;
      const active = sort?.key === c.key;
      const dir = active ? sort.dir : "none";
      const icon = !active ? "fa-sort" : sort.dir === "ascending" ? "fa-sort-up" : "fa-sort-down";
      return `<th class="${c.className || ""}" aria-sort="${dir}">
        <button class="app-sort" type="button" data-sort="${c.key}" aria-label="${sortLabel(c.label)}">
          ${c.label} <i class="fas ${icon}"></i>
        </button></th>`;
    })
    .join("");

  const body = rows
    .map((row) => `<tr>${columns.map((c) => `<td class="${c.className || ""}">${c.render ? c.render(row) : row[c.key] ?? ""}</td>`).join("")}</tr>`)
    .join("");

  return `
    <div class="table-container app-table">
      <table class="table is-fullwidth is-hoverable">
        ${caption ? `<caption class="app-sr">${caption}</caption>` : ""}
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}
