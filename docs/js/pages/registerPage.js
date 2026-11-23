import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { LEVELS, FIELDS } from "../data/categories.js";
import { getUser, register } from "../fn/auth.js";

// Бүртгүүлэх хуудас: шалгалттай (validation) форм.
// Бүртгүүлсний дараа автоматаар нэвтэрч, профайл хуудас руу шилжинэ.
export function renderRegisterPage() {
  const app = document.getElementById("app");

  // Аль хэдийн нэвтэрсэн бол профайл руу
  if (getUser()) {
    window.location.replace("#/profile");
    return;
  }

  const levelOptions = LEVELS.map((l) => `<option value="${l.id}">${l.name}</option>`).join("");
  const fieldOptions = FIELDS.map((f) => `<option value="${f.id}">${f.name}</option>`).join("");

  app.innerHTML = renderPageLayout({
    id: "register",
    title: "Бүртгүүлэх",
    subtitle: "Бүртгүүлээд өөрт тохирох тэтгэлгийн мэдээллийг хурдан олоорой.",
    content: `
      <div class="columns">
        <div class="column is-7-desktop">
          <form id="registerForm" class="box" novalidate>
            <div class="columns mb-0">
              <div class="column field mb-0">
                <label class="label" for="rName">Нэр</label>
                <div class="control has-icons-left">
                  <input id="rName" class="input" name="name" autocomplete="name" placeholder="Таны нэр" />
                  <span class="icon is-left"><i class="fas fa-user"></i></span>
                </div>
                <p class="help is-danger" data-error="name"></p>
              </div>
              <div class="column field mb-0">
                <label class="label" for="rEmail">И-мэйл</label>
                <div class="control has-icons-left">
                  <input id="rEmail" class="input" name="email" type="email" autocomplete="email" placeholder="name@example.com" />
                  <span class="icon is-left"><i class="fas fa-envelope"></i></span>
                </div>
                <p class="help is-danger" data-error="email"></p>
              </div>
            </div>

            <div class="columns mb-0">
              <div class="column field mb-0">
                <label class="label" for="rPass">Нууц үг</label>
                <div class="control has-icons-left">
                  <input id="rPass" class="input" name="password" type="password" autocomplete="new-password" placeholder="8+ тэмдэгт" />
                  <span class="icon is-left"><i class="fas fa-lock"></i></span>
                </div>
                <p class="help is-danger" data-error="password"></p>
              </div>
              <div class="column field mb-0">
                <label class="label" for="rPass2">Нууц үг давтах</label>
                <div class="control has-icons-left">
                  <input id="rPass2" class="input" name="password2" type="password" autocomplete="new-password" placeholder="Дахин бичих" />
                  <span class="icon is-left"><i class="fas fa-lock"></i></span>
                </div>
                <p class="help is-danger" data-error="password2"></p>
              </div>
            </div>

            <div class="columns mb-0">
              <div class="column field mb-0">
                <label class="label" for="rLevel">Суралцах түвшин</label>
                <div class="select is-fullwidth"><select id="rLevel" name="level">
                  <option value="">— Сонгох —</option>${levelOptions}
                </select></div>
                <p class="help is-danger" data-error="level"></p>
              </div>
              <div class="column field mb-0">
                <label class="label" for="rField">Сонирхож буй мэргэжил</label>
                <div class="select is-fullwidth"><select id="rField" name="field">
                  <option value="">— Сонгох —</option>${fieldOptions}
                </select></div>
                <p class="help is-danger" data-error="field"></p>
              </div>
            </div>

            <div class="field mt-3">
              <label class="checkbox">
                <input type="checkbox" name="agree" />
                Шинэ тэтгэлэг зарлагдахад и-мэйлээр мэдэгдэл авахыг зөвшөөрч байна
              </label>
              <p class="help is-danger" data-error="agree"></p>
            </div>

            <div id="registerError"></div>
            <button class="button is-primary is-fullwidth mt-4" type="submit">
              <span class="icon"><i class="fas fa-user-plus"></i></span><span>Бүртгүүлэх</span>
            </button>
            <p class="has-text-centered mt-4">Бүртгэлтэй юу? <a href="#/login">Нэвтрэх</a></p>
          </form>
        </div>
        <div class="column is-5-desktop">
          <div class="box">
            <p class="title is-6">Бүртгүүлснээр:</p>
            <ul class="app-checklist">
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Таны түвшин, мэргэжилд тохирох тэтгэлгийг шууд харна</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Бүртгэлийн хугацаа ойртоход сануулга авна</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Профайлдаа боловсрол, хэлний оноо, бичиг баримтаа хадгална</li>
            </ul>
            ${renderNotification("Сургалтын төсөл: мэдээлэл зөвхөн таны хөтөч дээр хадгалагдана. Нууц үгийг шууд биш, SHA-256 hash хэлбэрээр хадгална.", "info")}
          </div>
        </div>
      </div>
    `,
  });

  document.getElementById("registerForm").addEventListener("submit", handleSubmit);
}

// Талбар бүрийг шалгаж, алдааг тухайн талбарын доор харуулна.
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const errors = {};

  if (data.name.trim().length < 2) errors.name = "Нэрээ бичнэ үү.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "И-мэйл хаяг буруу байна.";
  if (data.password.length < 8) errors.password = "Нууц үг дор хаяж 8 тэмдэгт байна.";
  else if (!/\d/.test(data.password) || !/[a-zA-Zа-яА-ЯөӨүҮёЁ]/.test(data.password)) errors.password = "Үсэг болон тоо хоёуланг агуулна.";
  if (data.password2 !== data.password) errors.password2 = "Нууц үг таарахгүй байна.";
  if (!data.level) errors.level = "Түвшнээ сонгоно уу.";
  if (!data.field) errors.field = "Мэргэжлээ сонгоно уу.";
  if (!data.agree) errors.agree = "Мэдэгдэл авахыг зөвшөөрнө үү.";

  form.querySelectorAll("[data-error]").forEach((p) => {
    const key = p.dataset.error;
    p.textContent = errors[key] || "";
    const input = form.elements[key];
    if (input && input.type !== "checkbox") input.classList.toggle("is-danger", Boolean(errors[key]));
  });

  if (Object.keys(errors).length) return;

  const res = await register({
    name: data.name, email: data.email, password: data.password, level: data.level, field: data.field,
  });
  if (res.error) {
    document.getElementById("registerError").innerHTML = renderNotification(res.error, "danger");
    return;
  }
  // Бүртгүүлсний дараа профайлаа бөглөхөөр шилжинэ
  window.location.hash = "#/profile";
}

