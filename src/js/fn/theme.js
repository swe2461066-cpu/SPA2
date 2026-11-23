// Миний: цайвар / харанхуй горим солих.
// Анх орж ирэхэд системийн тохиргоог (prefers-color-scheme) дагана. Хэрэглэгч товч дарвал
// <html data-theme="light|dark"> болж, сонголт localStorage-д хадгалагдана.
// Хуудас ачаалахад цагаан → хар болж анивчихгүйн тулд хадгалсан утгыг index.html-ийн <head> доторх
// жижиг скрипт CSS-ээс өмнө тавьдаг.
const KEY = "tetgeleg_theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

export function currentTheme() {
  return document.documentElement.dataset.theme || (media.matches ? "dark" : "light");
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* хадгалах боломжгүй бол зөвхөн энэ удаад солигдоно */
  }
  window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

// Хэрэглэгч өөрөө сонгоогүй үед системийн горим солигдвол товчны дүрсийг шинэчлэх
media.addEventListener("change", () => {
  if (!document.documentElement.dataset.theme) window.dispatchEvent(new CustomEvent("theme-change"));
});
