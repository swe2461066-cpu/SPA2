import { LEVELS, FIELDS } from "./scholarships.js";

// Профайлын хэсгүүд ба талбарууд.
// Хуудас нь энэ тохиргооноос харах (view) болон засах (edit) хэлбэрийг автоматаар үүсгэнэ —
// шинэ талбар нэмэхэд зөвхөн энд нэг мөр нэмэхэд хангалттай.
//   type: text | email | tel | date | number | select | textarea
//   options: select-ийн сонголтууд [{ value, label }]
//   min/max/step: number-ийн хязгаар (хадгалахын өмнө шалгана)
const opts = (list) => list.map((x) => (typeof x === "string" ? { value: x, label: x } : x));

export const PROFILE_SECTIONS = [
  {
    id: "personal",
    title: "Хувийн мэдээлэл",
    subtitle: "Таны үндсэн мэдээлэл",
    icon: "fa-user",
    color: "is-link",
    fields: [
      { id: "fullName", label: "Овог нэр", type: "text", required: true },
      { id: "birthDate", label: "Төрсөн огноо", type: "date" },
      { id: "nationality", label: "Иргэншил", type: "text", placeholder: "Монгол" },
      { id: "phone", label: "Утас", type: "tel", placeholder: "+976 9911 2233" },
      { id: "email", label: "И-мэйл", type: "email", required: true },
    ],
  },
  {
    id: "academic",
    title: "Боловсрол",
    subtitle: "Таны сурлагын мэдээлэл",
    icon: "fa-graduation-cap",
    color: "is-info",
    fields: [
      { id: "eduLevel", label: "Боловсролын түвшин", type: "select", options: opts(["Бүрэн дунд", "Бакалавр", "Магистр", "Доктор"]) },
      { id: "university", label: "Сургууль", type: "text", placeholder: "МУИС" },
      { id: "major", label: "Мэргэжил", type: "text", placeholder: "Компьютерын ухаан" },
      { id: "gpa", label: "Голч дүн (GPA)", type: "number", min: 0, max: 100, step: 0.01 },
      { id: "gpaScale", label: "GPA хэмжүүр", type: "select", options: opts(["4.0", "100"]) },
      { id: "gradYear", label: "Төгсөх он", type: "number", min: 1980, max: 2040, step: 1 },
    ],
  },
  {
    id: "language",
    title: "Гадаад хэлний түвшин",
    subtitle: "Хэлний шалгалтын оноо",
    icon: "fa-language",
    color: "is-success",
    fields: [
      // Миний: тэнцэх эсэх тооцоолуурт шууд ашиглагдах 2 оноо
      { id: "ielts", label: "IELTS оноо", type: "number", min: 0, max: 9, step: 0.5, placeholder: "6.5" },
      { id: "topik", label: "TOPIK түвшин", type: "select", options: [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `TOPIK ${n}` })) },
      { id: "language", label: "Хэл", type: "select", options: opts(["Англи", "Япон", "Солонгос", "Хятад", "Герман", "Турк", "Орос", "Унгар"]) },
      { id: "certificate", label: "Сертификат", type: "select", options: opts(["IELTS", "TOEFL iBT", "Duolingo", "TOPIK", "JLPT", "HSK", "TestDaF", "Бусад"]) },
      { id: "overall", label: "Нийт оноо", type: "number", min: 0, max: 200, step: 0.5 },
      { id: "listening", label: "Сонсох", type: "number", min: 0, max: 100, step: 0.5 },
      { id: "reading", label: "Унших", type: "number", min: 0, max: 100, step: 0.5 },
      { id: "writing", label: "Бичих", type: "number", min: 0, max: 100, step: 0.5 },
      { id: "speaking", label: "Ярих", type: "number", min: 0, max: 100, step: 0.5 },
      { id: "testDate", label: "Шалгалт өгсөн огноо", type: "date" },
    ],
  },
  {
    id: "preferences",
    title: "Суралцах хүсэл",
    subtitle: "Хаана, юу сурах вэ",
    icon: "fa-plane-departure",
    color: "is-primary",
    fields: [
      { id: "countries", label: "Сонирхож буй улс", type: "text", placeholder: "Япон, Солонгос, Герман" },
      { id: "degree", label: "Зэрэг", type: "select", options: LEVELS.map((l) => ({ value: l.id, label: l.name })) },
      { id: "field", label: "Мэргэжлийн чиглэл", type: "select", options: FIELDS.map((f) => ({ value: f.id, label: f.name })) },
      { id: "funding", label: "Санхүүжилт", type: "select", options: opts(["Бүрэн тэтгэлэг", "Хэсэгчилсэн", "Аль нь ч болно"]) },
      { id: "startYear", label: "Эхлэх он", type: "number", min: 2024, max: 2035, step: 1 },
    ],
  },
  {
    id: "experience",
    title: "Туршлага, амжилт",
    subtitle: "Ажил, судалгаа, шагнал",
    icon: "fa-trophy",
    color: "is-warning",
    fields: [
      { id: "work", label: "Ажлын туршлага", type: "text", placeholder: "Программист (дадлага) • 6 сар" },
      { id: "research", label: "Судалгааны туршлага", type: "text", placeholder: "AI судалгааны төсөл" },
      { id: "volunteer", label: "Сайн дурын ажил", type: "text", placeholder: "Teach for Mongolia" },
      { id: "awards", label: "Шагнал", type: "text", placeholder: "Шилдэг оюутан 2024" },
      { id: "skills", label: "Ур чадвар", type: "text", placeholder: "Python, Java, ML" },
    ],
  },
];

// Байршуулах бичиг баримт. Файлын агуулгыг хадгалахгүй — зөвхөн нэр, хэмжээ, огноо.
export const DOCUMENTS = [
  { id: "cv", label: "CV / Анкет", icon: "fa-file-lines" },
  { id: "transcript", label: "Дүнгийн хуудас", icon: "fa-file-invoice" },
  { id: "recommendation", label: "Тодорхойлолт", icon: "fa-file-signature" },
  { id: "statement", label: "Зорилгын захидал", icon: "fa-file-pen" },
];
