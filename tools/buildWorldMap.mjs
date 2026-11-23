// 2.10 Тойм — газрын зураг.
// Номд Монголын аймгуудын бэлэн map.svg ашигласан. Миний: тэтгэлгүүд олон улсад байдаг тул
// world-atlas (Natural Earth, 1:110m) өгөгдлөөс дэлхийн газрын зургийг SVG болгож үүсгэнэ.
// Улс бүр <path id="c392" data-name="Japan"> хэлбэртэй (тоо нь ISO 3166-1 numeric код).
// Ажиллуулах: npm run build:map   →  src/img/world.svg
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-110m.json"), "utf8"));

const W = 960;
const H = 470;
// Антарктидыг (010) хасна — зураг дээр хэт их зай эзэлдэг
const world = feature(topo, topo.objects.countries);
world.features = world.features.filter((f) => f.id !== "010");

const projection = geoNaturalEarth1().fitExtent([[4, 4], [W - 4, H - 4]], world);
const path = geoPath(projection);
// Координатыг 1 оронгийн нарийвчлалтай болгож файлын хэмжээг багасгана
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(1));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const paths = world.features
  .filter((f) => f.id)
  .map((f) => `<path id="c${f.id}" data-name="${esc(f.properties.name)}" d="${round(path(f))}"/>`)
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="World map">
${paths}
</svg>
`;
writeFileSync(new URL("../src/img/world.svg", import.meta.url), svg);
console.log(`world.svg: ${world.features.length} улс, ${(svg.length / 1024).toFixed(0)} KB`);
