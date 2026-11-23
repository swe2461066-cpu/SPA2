import { getLang } from "../i18n/i18n.js";

// Суралцах түвшин, мэргэжлийн чиглэл — шүүлтүүр, tag-д ашиглана.
// 5-р ажлаар тэтгэлгийн өгөгдөл JSON (data/scholarshipsEnMn.json) руу шилжсэн.
// Эдгээр нь интерфэйсийн тогтмол ангилал тул JS-д үлдээв.
// Миний: name нь getter — хэл солигдоход импорт хийсэн газар бүрт автоматаар англи/монгол болно.
const withName = (list) =>
  list.map((item) => ({
    ...item,
    get name() {
      return getLang() === "en" ? item.en : item.mn;
    },
  }));

export const LEVELS = withName([
  { id: "bachelor", mn: "Бакалавр", en: "Bachelor", color: "is-info" },
  { id: "master", mn: "Магистр", en: "Master", color: "is-success" },
  { id: "phd", mn: "Доктор", en: "PhD", color: "is-danger" },
]);

// Тэтгэлэг бүрийн "fields" нь "all" (бүх мэргэжилд нээлттэй) эсвэл эдгээр id-ийн массив байна.
export const FIELDS = withName([
  { id: "it", mn: "Мэдээллийн технологи", en: "Information technology", icon: "fa-laptop-code" },
  { id: "engineering", mn: "Инженерчлэл", en: "Engineering", icon: "fa-gears" },
  { id: "science", mn: "Байгалийн ухаан", en: "Natural sciences", icon: "fa-flask" },
  { id: "business", mn: "Бизнес, эдийн засаг", en: "Business & economics", icon: "fa-chart-line" },
  { id: "medicine", mn: "Анагаах ухаан", en: "Medicine", icon: "fa-stethoscope" },
  { id: "social", mn: "Хууль, нийгэм, төрийн удирдлага", en: "Law, social sciences & public policy", icon: "fa-scale-balanced" },
  { id: "education", mn: "Боловсрол", en: "Education", icon: "fa-chalkboard-user" },
  { id: "humanities", mn: "Хэл, урлаг, хүмүүнлэг", en: "Languages, arts & humanities", icon: "fa-palette" },
  { id: "agriculture", mn: "Хөдөө аж ахуй, байгаль орчин", en: "Agriculture & environment", icon: "fa-seedling" },
]);

// Тухайн тэтгэлэг сонгосон мэргэжилд хамаарах эсэх
export function hasField(scholarship, fieldId) {
  return fieldId === "all" || scholarship.fields === "all" || scholarship.fields.includes(fieldId);
}
