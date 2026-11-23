// Hash зам → хуудас зурах функц, хуудасны гарчиг.
// Миний: номд зөвхөн функц байсан бол энд гарчиг нэмж, router нь document.title-ийг сольдог болгосон.
// 5–6-р ажлаас: гарчиг нь орчуулгын түлхүүр (titleKey), шинээр Тойм, Зардлын тооцоо, Гарын авлага.
import { renderHomePage } from "./pages/homePage.js";
import { renderScholarshipsPage } from "./pages/scholarshipsPage.js";
import { renderOverviewPage } from "./pages/overviewPage.js";
import { renderEligibilityPage } from "./pages/eligibilityPage.js";
import { renderCalculatorPage } from "./pages/calculatorPage.js";
import { renderGuidesPage } from "./pages/guidesPage.js";
import { renderContactPage } from "./pages/contactPage.js";
import { renderRegisterPage } from "./pages/registerPage.js";
import { renderLoginPage } from "./pages/loginPage.js";
import { renderProfilePage } from "./pages/profilePage.js";
import { renderNotFoundPage } from "./pages/notFoundPage.js";

export const DEFAULT_ROUTE = "#/home";

export const routes = {
  "#/home": { titleKey: "title.home", render: renderHomePage },
  "#/scholarships": { titleKey: "title.scholarships", render: renderScholarshipsPage },
  "#/overview": { titleKey: "title.overview", render: renderOverviewPage },
  "#/eligibility": { titleKey: "title.eligibility", render: renderEligibilityPage },
  "#/calculator": { titleKey: "title.calculator", render: renderCalculatorPage },
  "#/guides": { titleKey: "title.guides", render: renderGuidesPage },
  "#/contact": { titleKey: "title.contact", render: renderContactPage },
  "#/register": { titleKey: "title.register", render: renderRegisterPage },
  "#/login": { titleKey: "title.login", render: renderLoginPage },
  "#/profile": { titleKey: "title.profile", render: renderProfilePage },
  "#/404": { titleKey: "title.404", render: renderNotFoundPage },
};
