// Mobile sidebar-ийг нээх/хаах event-үүд.
// Миний: номд keydown, resize listener-ийг document/window дээр хуудас руу орох бүрд нэмдэг тул
// давхардаж байсан. Энд нэг л удаа бүртгэж, sidebar байхгүй үед юу ч хийхгүй болгосон.
let globalBound = false;

function setSidebarOpen(open) {
  document.getElementById("appSidebar")?.classList.toggle("is-open", open);
  document.getElementById("sidebarOverlay")?.classList.toggle("is-active", open);
  document.body.style.overflow = open ? "hidden" : "";
}

export function bindSidebar() {
  document.getElementById("openSidebar")?.addEventListener("click", () => setSidebarOpen(true));
  document.getElementById("closeSidebar")?.addEventListener("click", () => setSidebarOpen(false));
  document.getElementById("sidebarOverlay")?.addEventListener("click", () => setSidebarOpen(false));

  if (globalBound) return;
  globalBound = true;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setSidebarOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setSidebarOpen(false);
  });
  // Хуудас солигдоход body-ийн scroll түгжээ үлдэхгүй.
  window.addEventListener("hashchange", () => setSidebarOpen(false));
}

export { setSidebarOpen };
