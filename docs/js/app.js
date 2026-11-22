// SPA-ийн эхлэл: navbar-ийг зурж, router-ийг асаана.
import { mountNavbar } from "./components/navbar.js";
import { initRouter } from "./router.js";
import { routes } from "./routes.js";

mountNavbar(document.getElementById("navbar"));
initRouter(routes);
