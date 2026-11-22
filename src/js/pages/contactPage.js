import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { escapeHtml } from "../fn/escapeHtml.js";

// Зөвлөгөө авах хуудас. Миний: номд хоосон байсан хуудсанд шалгалттай (validation) форм нэмсэн.
export function renderContactPage() {
  const app = document.getElementById("app");
  app.innerHTML = renderPageLayout({
    id: "contact",
    title: "Зөвлөгөө авах",
    subtitle: "Тэтгэлэг, өргөдөл, бичиг баримтын талаар асуух зүйлээ бичээрэй.",
    content: `
      <div class="columns">
        <div class="column is-7">
          <form id="contactForm" class="box" novalidate>
            <div class="field">
              <label class="label" for="cName">Нэр</label>
              <div class="control"><input id="cName" class="input" name="name" placeholder="Таны нэр" /></div>
              <p class="help is-danger" data-error="name"></p>
            </div>
            <div class="field">
              <label class="label" for="cEmail">И-мэйл</label>
              <div class="control"><input id="cEmail" class="input" name="email" type="email" placeholder="name@example.com" /></div>
              <p class="help is-danger" data-error="email"></p>
            </div>
            <div class="field">
              <label class="label" for="cLevel">Сонирхож буй түвшин</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="cLevel" name="level">
                    <option value="">— Сонгох —</option>
                    <option>Бакалавр</option>
                    <option>Магистр</option>
                    <option>Доктор</option>
                  </select>
                </div>
              </div>
              <p class="help is-danger" data-error="level"></p>
            </div>
            <div class="field">
              <label class="label" for="cMsg">Асуулт</label>
              <div class="control"><textarea id="cMsg" class="textarea" name="message" rows="4" placeholder="Жишээ нь: Chevening-д ажлын туршлага хэдэн жил хэрэгтэй вэ?"></textarea></div>
              <p class="help is-danger" data-error="message"></p>
            </div>
            <button class="button is-info" type="submit">
              <span class="icon"><i class="fas fa-paper-plane"></i></span><span>Илгээх</span>
            </button>
          </form>
          <div id="contactResult"></div>
        </div>
        <div class="column is-5">
          <div class="box">
            <p class="title is-6">Өргөдөлд ихэвчлэн шаардагдах бичиг баримт</p>
            <ul class="app-checklist">
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Дипломын хуулбар, дүнгийн хуудас</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Хэлний сертификат (IELTS, TOEFL, TOPIK, JLPT)</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Зорилгын захидал (Motivation letter)</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> 2 тодорхойлолт захидал</li>
              <li><span class="icon has-text-success"><i class="fas fa-check"></i></span> Гадаад паспорт, эрүүл мэндийн үзлэг</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  });

  document.getElementById("contactForm").addEventListener("submit", handleSubmit);
}

// Талбар бүрийг шалгаж, алдааг тухайн талбарын доор харуулна.
function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const errors = {};

  if (data.name.trim().length < 2) errors.name = "Нэрээ бичнэ үү.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "И-мэйл хаяг буруу байна.";
  if (!data.level) errors.level = "Түвшнээ сонгоно уу.";
  if (data.message.trim().length < 10) errors.message = "Асуулт дор хаяж 10 тэмдэгт байна.";

  form.querySelectorAll("[data-error]").forEach((p) => {
    const key = p.dataset.error;
    p.textContent = errors[key] || "";
    form.elements[key].classList.toggle("is-danger", Boolean(errors[key]));
  });

  if (Object.keys(errors).length) return;

  // Сервер байхгүй тул зөвхөн амжилттай гэсэн мессеж харуулна.
  document.getElementById("contactResult").innerHTML = renderNotification(
    `Баярлалаа, <strong>${escapeHtml(data.name.trim())}</strong>! Таны асуултыг хүлээн авлаа. Зөвлөх тантай и-мэйлээр холбогдоно.`,
    "success"
  );
  form.reset();
}

