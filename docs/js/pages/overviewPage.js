import { renderSplitPageLayout } from "../layouts/splitPageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { mountWorldMap } from "../components/map.js";
import { openInfoModal } from "../components/infoModal.js";
import { loadTexts } from "../services/dataService.js";
import { getAllScholarships } from "../services/scholarshipService.js";
import { t, loc } from "../i18n/i18n.js";

// 2.10 Тойм хуудас — номын overviewPage.js.
// Зүүн талд дэлхийн газрын зураг, баруун талд танилцуулга текст (txt.json) ба тоон мэдээлэл.
export async function renderOverviewPage() {
  const app = document.getElementById("app");
  const all = getAllScholarships();

  app.innerHTML = renderSplitPageLayout({
    id: "overview",
    title: t("title.overview"),
    subtitle: t("ov.subtitle"),
    left: `
      <div class="box app-map-box">
        <div class="app-map-legend" aria-hidden="true">
          <span><i class="is-has"></i>${t("ov.legendHas")}</span>
          <span><i class="is-eu"></i>${t("ov.legendEu")}</span>
          <span><i></i>${t("ov.legendNone")}</span>
        </div>
        <div class="app-map" id="worldMap"><p class="has-text-grey">${t("common.loading")}</p></div>
        <div class="app-map-tip" id="mapTooltip" hidden></div>
        <p class="app-map-hint"><i class="fas fa-hand-pointer"></i> ${t("ov.hint")}</p>
      </div>`,
    right: `<div class="app-overview-text" id="overviewText"><p class="has-text-grey">${t("common.loading")}</p></div>`,
  });

  const mapEl = document.getElementById("worldMap");
  const textEl = document.getElementById("overviewText");

  // Газрын зураг, текст хоёрыг зэрэг ачаална. Нэг нь алдаа гарвал нөгөө нь харагдсаар байна.
  const [mapResult, textResult] = await Promise.allSettled([
    mountWorldMap(mapEl, (country, list) => openInfoModal(country, list)),
    loadTexts(),
  ]);
  // Ачаалах хооронд өөр хуудас руу шилжсэн бол юу ч хийхгүй
  if (!document.body.contains(mapEl)) return;

  if (mapResult.status === "rejected") {
    mapEl.innerHTML = renderNotification(t("common.loadError", { error: mapResult.reason.message }), "danger");
  }

  const countries = new Set(all.map((s) => s.country)).size;
  const stats = `
    <div class="app-overview-stats">
      <div><strong>${all.length}</strong><span>${t("home.stat.scholarships")}</span></div>
      <div><strong>${countries}</strong><span>${t("home.stat.countries")}</span></div>
      <div><strong>${mapResult.value?.countries ?? "—"}</strong><span>${t("ov.legendHas")}</span></div>
    </div>`;

  if (textResult.status === "fulfilled") {
    const ov = textResult.value.overview;
    // Миний: номд текстийг нэг <p>-д хийдэг байсныг \n\n-ээр догол мөр болгон хуваав
    const paragraphs = loc(ov.text).split(/\n\n+/).map((p) => `<p>${p}</p>`).join("");
    textEl.innerHTML = `<h2 class="title is-4">${loc(ov.title)}</h2>${stats}${paragraphs}
      <a class="button is-primary mt-2" href="#/scholarships">${t("home.allBtn")}</a>`;
  } else {
    textEl.innerHTML = stats + renderNotification(t("common.loadError", { error: textResult.reason.message }), "danger");
  }
}
