import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { getUser, login } from "../fn/auth.js";

// Нэвтрэх хуудас: и-мэйл, нууц үгээ шалгаад профайл руу шилжинэ.
export function renderLoginPage() {
  const app = document.getElementById("app");

  // Аль хэдийн нэвтэрсэн бол шууд профайл руу
  if (getUser()) {
    window.location.replace("#/profile");
    return;
  }

  app.innerHTML = renderPageLayout({
    id: "login",
    title: "Нэвтрэх",
    subtitle: "Бүртгэлтэй и-мэйл, нууц үгээрээ нэвтэрнэ үү.",
    content: `
      <div class="columns">
        <div class="column is-6-tablet is-5-desktop">
          <form id="loginForm" class="box" novalidate>
            <div class="field">
              <label class="label" for="lEmail">И-мэйл</label>
              <div class="control has-icons-left">
                <input id="lEmail" class="input" name="email" type="email" autocomplete="email" placeholder="name@example.com" />
                <span class="icon is-left"><i class="fas fa-envelope"></i></span>
              </div>
            </div>
            <div class="field">
              <label class="label" for="lPass">Нууц үг</label>
              <div class="control has-icons-left">
                <input id="lPass" class="input" name="password" type="password" autocomplete="current-password" />
                <span class="icon is-left"><i class="fas fa-lock"></i></span>
              </div>
            </div>
            <div id="loginError"></div>
            <button class="button is-link is-fullwidth mt-3" type="submit">
              <span class="icon"><i class="fas fa-right-to-bracket"></i></span><span>Нэвтрэх</span>
            </button>
            <p class="has-text-centered mt-4">Бүртгэлгүй юу? <a href="#/register">Бүртгүүлэх</a></p>
          </form>
        </div>
      </div>
    `,
  });

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.email.trim() || !data.password) {
      document.getElementById("loginError").innerHTML = renderNotification("И-мэйл, нууц үгээ бөглөнө үү.", "danger");
      return;
    }
    const res = await login(data.email, data.password);
    if (res.error) {
      document.getElementById("loginError").innerHTML = renderNotification(res.error, "danger");
      return;
    }
    window.location.hash = "#/profile";
  });
}
