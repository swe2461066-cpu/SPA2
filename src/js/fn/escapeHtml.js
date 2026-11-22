// Хэрэглэгчийн оруулсан текстийг HTML болгон оруулахаас өмнө escape хийнэ (XSS-ээс сэргийлэх).
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
