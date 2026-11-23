// 2.12 Ном — номын booksPage-д PDF файлуудыг modal дотор харуулдаг.
// Миний: гарын авлагын PDF-ийг гараар хийхийн оронд tools/guides/*.html эх текстийг нэг загварт
// оруулж, Microsoft Edge (эсвэл Chrome)-ийн headless горимоор PDF болгон хэвлэнэ.
//   tools/guides/<id>.html  →  src/pdf/<id>.pdf
// Ажиллуулах: npm run build:guides
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const guides = JSON.parse(readFileSync(join(root, "src/data/guides.json"), "utf8"));

const BROWSERS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = process.env.BROWSER_PATH || BROWSERS.find(existsSync);
if (!browser) throw new Error("Edge эсвэл Chrome олдсонгүй. BROWSER_PATH орчны хувьсагчаар зааж өгнө үү.");

// Бүх гарын авлагад нийтлэг загвар (сайтын хар хөх + ягаан-хөх өнгө)
const page = (g, body) => `<!doctype html><html lang="mn"><head><meta charset="utf-8">
<title>${g.title.mn}</title>
<style>
  @page { size: A4; margin: 18mm 18mm 20mm; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1d1d36; font-size: 11pt; line-height: 1.55; }
  header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${g.color};
    padding-bottom: 6px; margin-bottom: 18px; font-size: 9pt; color: #64748b; letter-spacing: .04em; text-transform: uppercase; }
  header b { color: #1d1d36; }
  h1 { font-size: 22pt; margin: 0 0 8px; color: ${g.color}; }
  h2 { font-size: 13pt; margin: 20px 0 8px; padding-left: 8px; border-left: 4px solid ${g.color}; }
  .lead { font-size: 12pt; color: #334155; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10pt; }
  th, td { border: 1px solid #d7dbe8; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f1f1fb; }
  ul.check { list-style: none; padding-left: 0; }
  ul.check li::before { content: "☐  "; color: ${g.color}; font-weight: bold; }
  li { margin-bottom: 4px; }
  .note { background: #f8fafc; border-left: 4px solid #94a3b8; padding: 8px 12px; font-size: 10pt; }
  footer { margin-top: 24px; font-size: 8.5pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px; }
</style></head><body>
<header><b>Тэтгэлэг хайх</b><span>Гарын авлага</span></header>
${body}
<footer>Тэтгэлэг хайх · CON354 сургалтын төсөл · Зөвлөмж ерөнхий шинжтэй, тэтгэлэг бүрийн албан шаардлагыг заавал шалгана уу.</footer>
</body></html>`;

mkdirSync(join(root, "src/pdf"), { recursive: true });
const tmp = join(tmpdir(), "tetgeleg-guides");
mkdirSync(tmp, { recursive: true });

for (const g of guides) {
  const html = join(tmp, `${g.id}.html`);
  writeFileSync(html, page(g, readFileSync(join(root, "tools/guides", `${g.id}.html`), "utf8")));
  const pdf = join(root, g.pdf.startsWith("src/") ? g.pdf : `src/${g.pdf}`);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    `--print-to-pdf=${pdf}`, pathToFileURL(html).href,
  ], { stdio: "ignore" });
  console.log(`${g.pdf}  ←  tools/guides/${g.id}.html`);
}
rmSync(tmp, { recursive: true, force: true });
