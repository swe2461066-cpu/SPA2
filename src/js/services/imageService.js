import { CONFIG, fetchData } from "../config.js";

// 2.8 Дээжийн зураг — номын imageService.js-ийн тэтгэлгийн хувилбар.
// images.json: { "mext": [{ thumb, full }, ...], ... }  (tools/generate-images-json.mjs үүсгэнэ)

let images = null;

export async function loadImages() {
  images ??= await fetchData(CONFIG.data.images);
  return images;
}

export function getImages(scholarshipId) {
  return images?.[scholarshipId] || [];
}
