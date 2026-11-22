// Монгол оюутнуудад нээлттэй гол тэтгэлгүүд, бүсээр нь ангилсан.
// 4-р ажилд JS массив хэлбэрээр байна. 5-р ажлаар JSON файл + service давхарга руу шилжинэ.
// Анхаар: хугацаа, нөхцөл жил бүр өөрчлөгддөг тул "deadline" нь ойролцоо утга.
// Бодит мэдээллийг үргэлж "url" дахь албан ёсны сайтаас шалгана.

// Суралцах түвшин — шүүлтүүр, tag-ийн өнгөнд ашиглана
export const LEVELS = [
  { id: "bachelor", name: "Бакалавр", color: "is-info" },
  { id: "master", name: "Магистр", color: "is-success" },
  { id: "phd", name: "Доктор", color: "is-danger" },
];

// Мэргэжлийн чиглэл — шүүлтүүр, нүүр хуудасны товчинд ашиглана.
// Тэтгэлэг бүрийн "fields" нь "all" (бүх мэргэжилд нээлттэй) эсвэл эдгээр id-ийн массив байна.
export const FIELDS = [
  { id: "it", name: "Мэдээллийн технологи", icon: "fa-laptop-code" },
  { id: "engineering", name: "Инженерчлэл", icon: "fa-gears" },
  { id: "science", name: "Байгалийн ухаан", icon: "fa-flask" },
  { id: "business", name: "Бизнес, эдийн засаг", icon: "fa-chart-line" },
  { id: "medicine", name: "Анагаах ухаан", icon: "fa-stethoscope" },
  { id: "social", name: "Хууль, нийгэм, төрийн удирдлага", icon: "fa-scale-balanced" },
  { id: "education", name: "Боловсрол", icon: "fa-chalkboard-user" },
  { id: "humanities", name: "Хэл, урлаг, хүмүүнлэг", icon: "fa-palette" },
  { id: "agriculture", name: "Хөдөө аж ахуй, байгаль орчин", icon: "fa-seedling" },
];

// Тухайн тэтгэлэг сонгосон мэргэжилд хамаарах эсэх
export function hasField(scholarship, fieldId) {
  return fieldId === "all" || scholarship.fields === "all" || scholarship.fields.includes(fieldId);
}

export const REGIONS = [
  {
    id: "asia",
    name: "Ази",
    icon: "fa-torii-gate",
    color: "is-danger",
    scholarships: [
      {
        name: "MEXT тэтгэлэг",
        country: "Япон",
        provider: "Японы Боловсрол, соёл, спорт, шинжлэх ухаан, технологийн яам",
        levels: ["bachelor", "master", "phd"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 4–5 сар (ЭСЯ-ны шалгаруулалт)",
        text: "Сургалтын төлбөр, сарын тэтгэмж, онгоцны тийз. Эхний жилд япон хэлний бэлтгэл хамрагдана.",
        url: "https://www.studyinjapan.go.jp/en/",
      },
      {
        name: "Global Korea Scholarship (GKS)",
        country: "Өмнөд Солонгос",
        provider: "Солонгосын Засгийн газар (NIIED)",
        levels: ["bachelor", "master", "phd"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 2–3 сар (магистр), 9–10 сар (бакалавр)",
        text: "Сургалтын төлбөр, сарын тэтгэмж, 1 жилийн солонгос хэлний сургалт, онгоцны тийз.",
        url: "https://www.studyinkorea.go.kr",
      },
      {
        name: "Хятадын Засгийн газрын тэтгэлэг (CSC)",
        country: "Хятад",
        provider: "China Scholarship Council",
        levels: ["bachelor", "master", "phd"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 1–4 сар",
        text: "Сургалтын төлбөр, дотуур байр, сарын тэтгэмж, эрүүл мэндийн даатгал.",
        url: "https://www.campuschina.org",
      },
      {
        name: "Türkiye Bursları",
        country: "Турк",
        provider: "Туркийн Засгийн газар",
        levels: ["bachelor", "master", "phd"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 1–2 сар",
        text: "Сургалтын төлбөр, сарын тэтгэмж, байр, 1 жилийн турк хэлний бэлтгэл.",
        url: "https://www.turkiyeburslari.gov.tr",
      },
    ],
  },
  {
    id: "europe",
    name: "Европ",
    icon: "fa-landmark",
    color: "is-info",
    scholarships: [
      {
        name: "Chevening",
        country: "Их Британи",
        provider: "Их Британийн Гадаад хэргийн яам (FCDO)",
        levels: ["master"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 8–11 сар",
        text: "1 жилийн магистр. Дор хаяж 2 жилийн ажлын туршлага шаардлагатай. Манлайлагч болох чадварыг үнэлдэг.",
        url: "https://www.chevening.org",
      },
      {
        name: "DAAD тэтгэлэг",
        country: "Герман",
        provider: "Германы академик солилцооны алба",
        levels: ["master", "phd"],
        coverage: "full",
        fields: ["engineering", "it", "science", "business", "agriculture", "medicine", "social"],
        deadline: "Хөтөлбөрөөс хамаарна (ихэвчлэн 8–10 сар)",
        text: "Магистр, докторын болон судалгааны олон төрлийн хөтөлбөр. Сарын тэтгэмж, даатгал, аяллын зардал. Ихэнх хөтөлбөр нь инженер, байгалийн ухаан, хөгжлийн чиглэлд.",
        url: "https://www.daad.de/en/",
      },
      {
        name: "Stipendium Hungaricum",
        country: "Унгар",
        provider: "Унгарын Засгийн газар (Tempus Public Foundation)",
        levels: ["bachelor", "master", "phd"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 11–1 сар",
        text: "Сургалтын төлбөргүй, сарын тэтгэмж, байр эсвэл байрны хөлс, эрүүл мэндийн даатгал.",
        url: "https://stipendiumhungaricum.hu",
      },
      {
        name: "Erasmus Mundus",
        country: "Европын холбоо",
        provider: "Европын Комисс",
        levels: ["master"],
        coverage: "full",
        fields: "all",
        deadline: "Ихэвчлэн 10–1 сар (хөтөлбөр бүрт өөр)",
        text: "2 ба түүнээс дээш Европ улсад суралцах хамтарсан магистрын хөтөлбөр.",
        url: "https://erasmus-plus.ec.europa.eu",
      },
      {
        name: "ОХУ-ын Засгийн газрын квот",
        country: "Орос",
        provider: "ОХУ-ын Шинжлэх ухаан, дээд боловсролын яам",
        levels: ["bachelor", "master", "phd"],
        coverage: "partial",
        fields: "all",
        deadline: "Ихэвчлэн 11–2 сар",
        text: "Сургалтын төлбөргүй, бага хэмжээний тэтгэмж. Байр, амьжиргааны зардлыг өөрөө хариуцна.",
        url: "https://education-in-russia.com",
      },
    ],
  },
  {
    id: "americas",
    name: "Америк, Австрали",
    icon: "fa-earth-americas",
    color: "is-success",
    scholarships: [
      {
        name: "Fulbright",
        country: "АНУ",
        provider: "АНУ-ын Төрийн департамент",
        levels: ["master", "phd"],
        coverage: "full",
        fields: ["it", "engineering", "science", "business", "social", "education", "humanities", "agriculture"],
        deadline: "Ихэвчлэн 2–5 сар (Элчин сайдын яамаар)",
        text: "АНУ-ын их сургуульд магистр, докторт суралцах. Сургалтын төлбөр, тэтгэмж, онгоцны тийз. Эмнэлгийн клиник сургалт хамаарахгүй.",
        url: "https://foreign.fulbrightonline.org",
      },
      {
        name: "Australia Awards",
        country: "Австрали",
        provider: "Австралийн Гадаад хэрэг, худалдааны яам",
        levels: ["master"],
        coverage: "full",
        fields: ["education", "medicine", "social", "agriculture", "engineering", "business"],
        deadline: "Ихэвчлэн 2–4 сар",
        text: "Хөгжлийн тэргүүлэх чиглэлийн (боловсрол, эрүүл мэнд, засаглал, хөдөө аж ахуй) магистрын хөтөлбөр. Сургалтын төлбөр, амьжиргааны тэтгэмж, онгоцны тийз.",
        url: "https://www.dfat.gov.au/people-to-people/australia-awards",
      },
    ],
  },
  {
    id: "mongolia",
    name: "Монгол Улс",
    icon: "fa-flag",
    color: "is-warning",
    scholarships: [
      {
        name: "Боловсролын зээлийн сангийн тэтгэлэг",
        country: "Монгол",
        provider: "Боловсролын зээлийн сан",
        levels: ["bachelor", "master", "phd"],
        coverage: "partial",
        fields: "all",
        deadline: "Жил бүр зарлагдана",
        text: "Дотоод, гадаадын их сургуульд суралцах тэтгэлэг, хөнгөлөлттэй зээлийн олон хөтөлбөр.",
        url: "https://www.elf.gov.mn",
      },
    ],
  },
];
