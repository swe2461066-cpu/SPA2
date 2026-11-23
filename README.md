# Тэтгэлэг — SPA (CON354, 4–6-р ажил)

"Хүнсний найрлагын мэдээллийн сангаар Single Page Application бүтээх" номын II бүлгийн (2.1–2.13) жишээг
**өөр сэдвээр** (гадаадад суралцах тэтгэлгийн мэдээллийн систем) бүрэн өөрчилж бүтээсэн SPA.
Vanilla JavaScript (ES modules), Bulma, Sass.

| Ажил | Номын хэсэг | Энэ төсөлд |
|---|---|---|
| 4-р ажил | 2.1–2.5 | Төслийн бүтэц, Bulma + Sass, hash router, navbar, page/sidebar layout, Нүүр, Тэтгэлгүүд, Тэнцэх эсэх, Зөвлөгөө авах, 404 |
| 5-р ажил | 2.6–2.9 | JSON өгөгдөл + service давхарга, хайлт ба харьцуулах хүснэгт, тэтгэлгийн зураг (modal), MN/EN хэл солих |
| 6-р ажил | 2.10–2.13 | Дэлхийн газрын зураг (Тойм), зардлын тооцоолуур, PDF гарын авлага, footer компонент |

## Ажиллуулах

```bash
npm install
npm run sass:build        # src/css/main.css
npm start                 # http://127.0.0.1:5501/
```

Өгөгдөл үүсгэх скриптүүд (`tools/`, үр дүн нь аль хэдийн `src/`-д байгаа тул заавал биш):

```bash
npm run convert:enmn      # src/data/scholarships.json + tools/dictionary-en.json → scholarshipsEnMn.json
npm run generate:images   # tools/imageSources.json → src/data/images.json (зураг бүрийг шалгана)
npm run build:map         # world-atlas → src/img/world.svg
npm run build:guides      # tools/guides/*.html → src/pdf/*.pdf (Edge/Chrome headless)
```

GitHub Pages: `npm run docs` нь `src`-ийг `docs` руу хуулна, Pages-ийн эх үүсвэр `master /docs`.
Өгөгдлийг `fetch`-ээр уншдаг тул сайтыг `file://`-ээр биш, http сервер (npm start, Live Server)-ээр нээнэ.

## Бүтэц

```
src/
  index.html                    # цорын ганц HTML
  data/                         # scholarships(EnMn).json, images.json, costs.json, guides.json, txt.json
  img/world.svg                 # дэлхийн газрын зураг (tools/buildWorldMap.mjs)
  pdf/                          # гарын авлагууд (tools/buildGuides.mjs)
  js/app.js                     # эхлэл: өгөгдөл ачаалах → navbar, footer, router; хэл солиход дахин зурна
  js/config.js                  # өгөгдлийн файлын замууд, fetchData()
  js/router.js, routes.js       # hash → хуудас, гарчиг (орчуулгын түлхүүр)
  js/services/                  # scholarshipService, imageService, dataService (зардал, гарын авлага, текст, газрын зураг)
  js/i18n/                      # i18n.js (t, loc, setLang), translations.js (mn, en)
  js/components/                # navbar, footer, scholarshipCard, scholarshipTable, modal, imageModal, map, infoModal, guideCard, pdfModal
  js/layouts/                   # page, sidebarPage, splitPage, gridPage, table, notification
  js/pages/                     # home, scholarships, overview, eligibility, calculator, guides, contact, register, login, profile, notFound
  js/fn/                        # sidebarEvents, auth, escapeHtml, search, eligibility
  js/data/                      # categories.js (түвшин, мэргэжил), profileSections.js
  scss/                         # main + theme + components + layouts
tools/                          # өгөгдөл, зураг, газрын зураг, PDF үүсгэх скриптүүд
```

## Номын кодоос өөрчилсөн зүйлс

### 4-р ажил (2.1–2.5)

- Сэдэв: хүнсний мэдээллийн сан → тэтгэлгийн мэдээллийн систем (4 бүс, 12 бодит тэтгэлэг: MEXT, GKS, CSC,
  Türkiye Bursları, Chevening, DAAD, Stipendium Hungaricum, Erasmus Mundus, ОХУ-ын квот, Fulbright,
  Australia Awards, Боловсролын зээлийн сан).
- `routes.js` — зам бүрд гарчиг нэмж, router хуудас солих бүрд `document.title`-ийг сольдог болгосон.
- `router.js` — `#/scholarships?region=asia&level=master` гэх мэт query-тэй hash-ийг таньдаг, `#/` эсвэл
  хоосон hash-ийг нүүр рүү шилжүүлдэг, хуудас солигдоход дээш scroll хийдэг.
- `navbar.js` — давтагдсан `<a>`-уудыг `NAV_ITEMS` массиваас үүсгэдэг, идэвхтэй цэсийг тодруулдаг.
- `sidebarEvents.js` — `keydown`/`resize` listener-ийг нэг удаа бүртгэдэг (номд давхардаж нэмэгддэг байсан).
- `scholarshipsPage.js` — бүсийн цэс, түвшин, мэргэжлийн шүүлтүүр хамт ажиллана; илэрцийн тоо, хоосон үеийн мэдэгдэл.
- `registerPage.js`, `loginPage.js`, `fn/auth.js` — бүртгэл, нэвтрэлт (localStorage, нууц үг SHA-256 hash).
- `profilePage.js` — профайл; `eligibilityPage.js` — голч дүн, IELTS/TOPIK-оор тэнцэх тэтгэлэг, сургууль.
- Сургууль, улсаар хайх (`fn/search.js`) — монгол үгийн нөхцөлийг ("Токиод") таньдаг.

### 5-р ажил (2.6–2.9)

- **2.6 Service давхарга** — тэтгэлгийн өгөгдөл JS массиваас `data/scholarships.json` руу шилжсэн.
  `config.js`-д бүх замыг төвлөрүүлж, `fetchData()` нэг функцээр алдааг ойлгомжтой гаргана.
  Service нь JSON-ийг нэг удаа татаж cache-лана; хэл солигдоход нэг удаа хөрвүүлнэ.
- **2.7 Хайлт, хүснэгт** — Тэтгэлгүүд хуудсанд "Карт / Хүснэгт" харагдац. `tableLayout.js` баганын
  `render()`-ийг дэмждэг болсон (номд дэмжээгүй байсан), нэр, голч, IELTS, зургийн тоогоор эрэмбэлнэ
  (`aria-sort`). Харагдац URL-д хадгалагдана (`?view=table`).
- **2.8 Зураг** — `tools/generate-images-json.mjs` нь Unsplash-ийн зургийн id-аас `images.json` үүсгэж,
  ажиллахгүй зургийг алгасна. Картын дээр зураг, "Зураг (n)" товч → modal (2 / 4 дугаар, ← → товч ба сум,
  эргэлддэг, ESC). Modal-ийн нийтлэг логик `components/modal.js`-д (фокус буцаах, хуудас гүйлгэхгүй).
- **2.9 Хэл солих** — `tools/convertScholarshipsEnMn.mjs` нь толь (`dictionary-en.json`)-оор текст бүрийг
  `{ mn, en }` болгож, орчуулгагүй утгыг хэвлэнэ. Интерфэйсийн бичвэр `i18n/translations.js`-д.
  Сонгосон хэл localStorage-д хадгалагдана (номд сэргээхэд монгол руу буцдаг байсан); хэл солиход
  `lang-change` event → navbar, footer, тухайн хуудас дахин зурагдана. Хайлт хоёр хэлний нэрээр ажиллана.
  Тэнцэх эсэх, Зөвлөгөө авах, Бүртгэл, Профайл хуудсууд одоохондоо зөвхөн монголоор.

### 6-р ажил (2.10–2.13)

- **2.10 Тойм** — номын аймгийн газрын зургийн оронд `tools/buildWorldMap.mjs` world-atlas (Natural Earth)
  өгөгдлөөс дэлхийн SVG үүсгэнэ. Тэтгэлэгтэй улс өнгөтэй, зөвхөн Erasmus (ЕХ) хамаарах улс цайвар,
  өнгөний тайлбартай; hover/focus-д нэр, тэтгэлгийн тоо; Tab + Enter-ээр гараар сонгоно. Улс дарахад
  `infoModal` — тэтгэлэг сонгоогүй үед товч идэвхгүй (номд `alert()` гардаг байсан), "Зардал тооцох" холбоос.
  `splitPageLayout.js`, текстийг `\n\n`-ээр догол мөр болгоно.
- **2.11 Зардлын тооцоо** — номын хүнсний тооцоолуурын санааг сарын тэтгэмж ба амьжиргааны зардалд
  хэрэглэв. Зардлын төрлүүд `costs.json`-ийн массиваас үүснэ (номд 8 бодис бүрт давтагдсан код байсан).
  Мөр нэмэх, устгах; тэтгэмжийн хувийг өнгөөр (≤80% ногоон, ≤100% шар, >100% улаан); суралцах хугацаанд
  нэмэлтээр хэрэгтэй мөнгө. Оруулсан утга тэтгэлэг бүрээр хадгалагдана — номд хүнс нэмэхэд өмнөх хэмжээ
  100 г болж буцдаг алдаа байсан. Бичих бүрд зөвхөн дүн шинэчлэгдэнэ (фокус алдагдахгүй).
- **2.12 Гарын авлага** — `gridPageLayout.js`, `guideCard.js`, `pdfModal.js`. 6 PDF-ийг
  `tools/buildGuides.mjs` нь HTML эхээс Edge/Chrome headless-ээр үүсгэнэ. Утсанд "Шинэ цонхонд нээх".
- **2.13 Footer** — `index.html` дахь статик footer-ийг `components/footer.js` болгож, холбоосыг массиваас,
  бүсүүдийг өгөгдлөөс үүсгэнэ; хэл солиход орчуулагдана.

> Тэтгэлгийн хугацаа, шаардлага, тэтгэмж, амьжиргааны зардал нь ойролцоо утга (USD) бөгөөд жил бүр
> өөрчлөгддөг. Үргэлж албан сайтаас шалгана. Зураг: Unsplash. Газрын зураг: Natural Earth (world-atlas).
