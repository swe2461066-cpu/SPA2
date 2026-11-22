// Hash зам → хуудас зурах функц, хуудасны гарчиг.
// Миний: номд зөвхөн функц байсан бол энд title нэмж, router нь document.title-ийг сольдог болгосон.
import { renderHomePage } from "./pages/homePage.js";
import { renderScholarshipsPage } from "./pages/scholarshipsPage.js";
import { renderEligibilityPage } from "./pages/eligibilityPage.js";
import { renderContactPage } from "./pages/contactPage.js";
import { renderRegisterPage } from "./pages/registerPage.js";
import { renderLoginPage } from "./pages/loginPage.js";
import { renderProfilePage } from "./pages/profilePage.js";
import { renderNotFoundPage } from "./pages/notFoundPage.js";

export const DEFAULT_ROUTE = "#/home";

export const routes = {
  "#/home": { title: "Нүүр", render: renderHomePage },
  "#/scholarships": { title: "Тэтгэлгүүд", render: renderScholarshipsPage },
  "#/eligibility": { title: "Тэнцэх эсэхээ шалгах", render: renderEligibilityPage },
  "#/contact": { title: "Зөвлөгөө авах", render: renderContactPage },
  "#/register": { title: "Бүртгүүлэх", render: renderRegisterPage },
  "#/login": { title: "Нэвтрэх", render: renderLoginPage },
  "#/profile": { title: "Миний профайл", render: renderProfilePage },
  "#/404": { title: "Хуудас олдсонгүй", render: renderNotFoundPage },
};
