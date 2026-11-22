// Миний: тэтгэлэг бүрийн ОЙРОЛЦОО шаардлага ба жишээ их сургуулиуд.
// Тэнцэх эсэх тооцоолуурт ашиглана. Түлхүүр нь scholarships.js дахь "name".
//   gpa   — доод голч дүн, 100 онооны хэмжүүрээр (4.0 бол 4.0 → 100 гэж хөрвүүлнэ)
//   ielts — англиар суралцахад шаардагдах IELTS (null = шаардлагагүй)
//   topik — солонгосоор суралцахад TOPIK түвшин (null = хамаарахгүй)
//   IELTS ба TOPIK хоёулаа байвал аль нэгийг хангахад хэлний шаардлага биелнэ.
//   note  — нэмэлт тайлбар (бусад хэлний шалгалт гэх мэт)
// Анхаар: эдгээр нь жил бүр, сургууль бүрээр өөрчлөгддөг. Албан сайтаас заавал шалгана.
export const REQUIREMENTS = {
  "MEXT тэтгэлэг": {
    gpa: 80, ielts: 6.0, topik: null,
    note: "Япон хэлээр суралцах бол JLPT N2+ давуу тал болно.",
    universities: ["Токиогийн их сургууль", "Киотогийн их сургууль", "Осакагийн их сургууль", "Тохокугийн их сургууль"],
  },
  "Global Korea Scholarship (GKS)": {
    gpa: 80, ielts: 5.5, topik: 3,
    note: "TOPIK 3+ эсвэл англи хэлний оноо нэмэлт оноо өгнө.",
    universities: ["Сөүлийн үндэсний их сургууль", "KAIST", "Ёнсэ их сургууль", "Корёо их сургууль"],
  },
  "Хятадын Засгийн газрын тэтгэлэг (CSC)": {
    gpa: 70, ielts: 6.0, topik: null,
    note: "Хятад хэлээр суралцах бол HSK 4+ шаардана.",
    universities: ["Цинхуагийн их сургууль", "Бээжингийн их сургууль", "Жэжянгийн их сургууль", "Фүданы их сургууль"],
  },
  "Türkiye Bursları": {
    gpa: 75, ielts: null, topik: null,
    note: "Хэлний оноо шаардахгүй — 1 жил турк хэлний бэлтгэл олгоно.",
    universities: ["Истанбулын их сургууль", "Ойрх Дорнодын техникийн их сургууль (METU)", "Богазичи их сургууль", "Анкарагийн их сургууль"],
  },
  Chevening: {
    gpa: 75, ielts: 6.5, topik: null,
    note: "Магистрт 2+ жилийн ажлын туршлага шаардана.",
    universities: ["Оксфордын их сургууль", "University College London", "Эдинбургийн их сургууль", "Манчестерийн их сургууль"],
  },
  "DAAD тэтгэлэг": {
    gpa: 75, ielts: 6.5, topik: null,
    note: "Герман хэлээр суралцах бол TestDaF 4 / DSH-2.",
    universities: ["Мюнхений техникийн их сургууль (TUM)", "Хайдельбергийн их сургууль", "RWTH Аахен", "Берлиний Гумбольдтын их сургууль"],
  },
  "Stipendium Hungaricum": {
    gpa: 70, ielts: 6.0, topik: null,
    note: "Унгар хэлээр суралцах бол бэлтгэл жил байдаг.",
    universities: ["ELTE (Этвёш Лорандын их сургууль)", "Будапештийн технологи, эдийн засгийн их сургууль", "Дебрецений их сургууль", "Сегедийн их сургууль"],
  },
  "Erasmus Mundus": {
    gpa: 75, ielts: 6.5, topik: null,
    note: "Хөтөлбөр бүр өөр өөр шаардлагатай — 2+ улсын сургуульд суралцана.",
    universities: ["Европын хамтарсан магистрын хөтөлбөрүүд (консорциум)"],
  },
  "ОХУ-ын Засгийн газрын квот": {
    gpa: 70, ielts: null, topik: null,
    note: "Хэлний оноо шаардахгүй — орос хэлний бэлтгэл жил олгоно.",
    universities: ["Москвагийн улсын их сургууль", "Санкт-Петербургийн улсын их сургууль", "Эдийн засгийн дээд сургууль (HSE)", "Томскийн политехникийн их сургууль"],
  },
  Fulbright: {
    gpa: 80, ielts: 6.5, topik: null,
    note: "TOEFL iBT 80+ мөн хүлээн зөвшөөрнө.",
    universities: ["АНУ-ын их сургуулиуд (Fulbright байршуулна)", "Жишээ: Иллинойсын их сургууль", "Аризонагийн улсын их сургууль"],
  },
  "Australia Awards": {
    gpa: 70, ielts: 6.5, topik: null,
    note: "IELTS хэсэг бүр 6.0-аас доошгүй байх шаардлагатай.",
    universities: ["Австралийн үндэсний их сургууль (ANU)", "Мельбурны их сургууль", "Сиднейн их сургууль", "UNSW Сидней"],
  },
  "Боловсролын зээлийн сангийн тэтгэлэг": {
    gpa: 80, ielts: 6.5, topik: null,
    note: "Дэлхийн шилдэг их сургуульд элссэн байх шаардлагатай.",
    universities: ["Дэлхийн жагсаалтын эхний 100 доторх их сургуулиуд"],
  },
};

// Миний: хайлтад зориулсан нэмэлт түлхүүр үгс (англи нэр, хот, сургуулийн товчлол).
// Жишээ нь "Tokyo", "KAIST", "London" гэж хайхад тухайн тэтгэлэг олдоно.
export const SEARCH_KEYWORDS = {
  "MEXT тэтгэлэг": "japan nihon tokyo kyoto osaka tohoku токио киото осака",
  "Global Korea Scholarship (GKS)": "korea south korea seoul snu kaist yonsei korea university сөүл кайст",
  "Хятадын Засгийн газрын тэтгэлэг (CSC)": "china beijing tsinghua peking pku zhejiang fudan shanghai бээжин шанхай",
  "Türkiye Bursları": "turkey turkiye istanbul ankara metu bogazici истанбул анкара",
  Chevening: "uk united kingdom england britain london oxford ucl edinburgh manchester англи лондон",
  "DAAD тэтгэлэг": "germany deutschland munich tum heidelberg rwth aachen berlin humboldt мюнхен берлин",
  "Stipendium Hungaricum": "hungary budapest elte bme debrecen szeged будапешт",
  "Erasmus Mundus": "europe eu erasmus",
  "ОХУ-ын Засгийн газрын квот": "russia moscow msu saint petersburg spbu hse tomsk москва",
  Fulbright: "usa united states america illinois arizona ам",
  "Australia Awards": "australia anu melbourne sydney unsw канберра",
  "Боловсролын зээлийн сангийн тэтгэлэг": "mongolia монгол top 100",
};
