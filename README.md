# Тэтгэлэг — SPA (CON354, 4-р ажил)

"Хүнсний найрлагын мэдээллийн сангаар Single Page Application бүтээх" номын II бүлгийн (2.1–2.5) жишээг
**өөр сэдвээр** (гадаадад суралцах тэтгэлгийн мэдээллийн систем) бүрэн өөрчилж бүтээсэн SPA.
Vanilla JavaScript (ES modules), Bulma, Sass.

| Ажил | Номын хэсэг | Энэ төсөлд |
|---|---|---|
| 4-р ажил | 2.1–2.5 | Төслийн бүтэц, Bulma + Sass, hash router, navbar, page/sidebar layout, Нүүр, Тэтгэлгүүд, Тэнцэх эсэх, Зөвлөгөө авах, 404 |

## Ажиллуулах

```bash
npm install
npm run sass:build   # src/css/main.css
npm start            # http://127.0.0.1:5501/
```

GitHub Pages: `npm run docs` нь `src`-ийг `docs` руу хуулна, Pages-ийн эх үүсвэр `master /docs`.

## Бүтэц

```
src/
  index.html                  # цорын ганц HTML
  js/app.js                   # эхлэл: navbar + router
  js/router.js                # hash → хуудас
  js/routes.js                # зам, гарчиг, render функц
  js/components/              # navbar, scholarshipCard
  js/layouts/                 # pageLayout, sidebarPageLayout, notificationLayout
  js/pages/                   # home, scholarships, eligibility, contact, register, login, profile, notFound
  js/fn/                      # sidebarEvents, auth (бүртгэл/нэвтрэлт), escapeHtml
  js/data/scholarships.js     # бүс, түвшин, мэргэжил, тэтгэлгийн өгөгдөл (5-р ажлаар JSON + service болно)
  js/data/profileSections.js  # профайлын хэсэг, талбаруудын тохиргоо
  scss/                       # main + components + layouts
```

## Номын кодоос өөрчилсөн зүйлс (4-р ажил, 2.1–2.5)

- Сэдэв: хүнсний мэдээллийн сан → тэтгэлгийн мэдээллийн систем (4 бүс, 12 бодит тэтгэлэг: MEXT, GKS, CSC,
  Türkiye Bursları, Chevening, DAAD, Stipendium Hungaricum, Erasmus Mundus, ОХУ-ын квот, Fulbright,
  Australia Awards, Боловсролын зээлийн сан).
- `routes.js` — зам бүрд `title` нэмж, router хуудас солих бүрд `document.title`-ийг сольдог болгосон.
- `router.js` — `#/scholarships?region=asia&level=master` гэх мэт query-тэй hash-ийг таньдаг, `#/` эсвэл
  хоосон hash-ийг нүүр рүү шилжүүлдэг, хуудас солигдоход дээш scroll хийдэг.
- `navbar.js` — давтагдсан `<a>`-уудыг `NAV_ITEMS` массиваас үүсгэдэг, идэвхтэй цэсийг тодруулдаг.
- `sidebarEvents.js` — `keydown`/`resize` listener-ийг нэг удаа бүртгэдэг (номд давхардаж нэмэгддэг байсан).
- `scholarshipsPage.js` — зүүн талд бүсийн цэс, дээр нь суралцах түвшний шүүлтүүр; хоёр шүүлтүүр хамт ажиллана,
  дарахад зөвхөн жагсаалт шинэчлэгдэнэ; илэрцийн тоо, хоосон үеийн мэдэгдэл.
- `scholarshipCard.js` — бүрэн/хэсэгчилсэн, түвшний өнгөт tag, хугацаа, албан сайтын холбоос.
- `homePage.js` — улс, тэтгэлэг, бүрэн тэтгэлгийн тоог өгөгдлөөс тоолж харуулна; бүс, түвшний товч.
- `contactPage.js` — "Зөвлөгөө авах" форм: validation, түвшин сонгох, XSS-ээс хамгаалсан `escapeHtml()`,
  шаардлагатай бичиг баримтын жагсаалт.
- `eligibilityPage.js` — 6-р ажлаар тооцоолуур болох хуудас.
- `notFoundPage.js` — буцах товчтой 404 хуудас.
- Мэргэжлээр ангилал — 9 чиглэл, тэтгэлэг бүр `fields`-тэй ("all" эсвэл чиглэлийн жагсаалт).
- `registerPage.js`, `loginPage.js`, `fn/auth.js` — бүртгүүлэх, нэвтрэх, гарах. Сервергүй тул localStorage-д
  хадгална; нууц үгийг SHA-256 hash болгож хадгална (жинхэнэ системд сервер дээр хийгдэх ёстой).
- `profilePage.js` — нэвтэрсний дараах профайл: зураг, товч мэдээлэл, зорилго, зөвлөмж, бүрдлийн хувь;
  хувийн мэдээлэл, боловсрол, хэлний оноо, суралцах хүсэл, туршлага хэсэг бүрийг тусад нь засна;
  бичиг баримтын нэрийг тэмдэглэнэ. Талбаруудыг `profileSections.js` тохиргооноос автоматаар үүсгэнэ.

> Тэтгэлгийн хугацаа, нөхцөл жил бүр өөрчлөгддөг тул сайт дээрх огноо ойролцоо. Үргэлж албан сайтаас шалгана.
