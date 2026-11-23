import { CONFIG, fetchData } from "../config.js";

// 2.10–2.12 хуудсуудын өгөгдөл: зардал, гарын авлага, танилцуулга текст, газрын зураг.
// Номд costService, bookService, txtService, mapService тусдаа байсан. Миний: бүгд адилхан
// "нэг удаа татаад cache-лах" логиктой тул нэг ерөнхий функцээр хийв.

const cache = new Map();

function load(key, as = "json") {
  if (!cache.has(key)) {
    // Promise-ийг хадгална — зэрэг дуудвал нэг л fetch явна. Алдаа гарвал дараа дахин оролдоно.
    const p = fetchData(CONFIG.data[key], as).catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, p);
  }
  return cache.get(key);
}

export const loadCosts = () => load("costs"); // 2.11 зардлын тооцоо
export const loadGuides = () => load("guides"); // 2.12 гарын авлага
export const loadTexts = () => load("txt"); // 2.10 тоймын текст
export const loadWorldMap = () => load("worldMap", "text"); // 2.10 SVG газрын зураг
