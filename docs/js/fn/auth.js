// Бүртгэл, нэвтрэлт, профайлын мэдээллийг хөтчийн localStorage-д хадгална.
// 4-р ажилд сервер байхгүй тул зөвхөн энэ хөтөч дээр санагдана.
//   tetgeleg_accounts — { "и-мэйл": бүртгэл } (нэг хөтөч дээр олон бүртгэл байж болно)
//   tetgeleg_session  — одоо нэвтэрсэн хэрэглэгчийн и-мэйл
// Нууц үгийг шууд биш, SHA-256 hash болгож хадгална (жинхэнэ системд энэ нь серверт хийгдэнэ).
const ACCOUNTS_KEY = "tetgeleg_accounts";
const SESSION_KEY = "tetgeleg_session";

// localStorage-г try/catch-ээр хамгаална (хувийн цонх, хаалттай storage үед алдаа өгдөг)
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // зураг хэт том, storage дүүрсэн гэх мэт
  }
}

// Navbar, профайл зэрэг бусад хэсэгт өөрчлөлтийг мэдэгдэнэ
const notify = () => window.dispatchEvent(new Event("auth-change"));

const normEmail = (email) => email.trim().toLowerCase();

async function hashPassword(email, password) {
  const bytes = new TextEncoder().encode(`${normEmail(email)}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Одоо нэвтэрсэн хэрэглэгч (нууц үгийн hash-гүйгээр) эсвэл null
export function getUser() {
  const email = read(SESSION_KEY, null);
  if (!email) return null;
  const acc = read(ACCOUNTS_KEY, {})[email];
  if (!acc) return null;
  const { passHash, ...user } = acc;
  return user;
}

// Шинэ бүртгэл. Амжилттай бол автоматаар нэвтэрнэ. Алдаа гарвал мессеж буцаана.
export async function register({ name, email, password, level, field }) {
  const accounts = read(ACCOUNTS_KEY, {});
  const key = normEmail(email);
  if (accounts[key]) return { error: "Энэ и-мэйлээр бүртгэл үүссэн байна. Нэвтэрнэ үү." };

  accounts[key] = {
    name: name.trim(),
    email: key,
    passHash: await hashPassword(key, password),
    createdAt: new Date().toISOString(),
    photo: null,
    goals: "",
    // Бүртгэлийн үеийн сонголтоор профайлыг урьдчилан бөглөнө
    profile: {
      personal: { fullName: name.trim(), email: key },
      preferences: { degree: level, field },
    },
    documents: {},
  };
  if (!write(ACCOUNTS_KEY, accounts)) return { error: "Хөтөч мэдээлэл хадгалах боломжгүй байна." };
  write(SESSION_KEY, key);
  notify();
  return { ok: true };
}

export async function login(email, password) {
  const key = normEmail(email);
  const acc = read(ACCOUNTS_KEY, {})[key];
  if (!acc || acc.passHash !== (await hashPassword(key, password))) {
    return { error: "И-мэйл эсвэл нууц үг буруу байна." };
  }
  write(SESSION_KEY, key);
  notify();
  return { ok: true };
}

// Гарах: бүртгэл, профайл устахгүй, зөвхөн нэвтрэлт дуусна
export function logout() {
  write(SESSION_KEY, null);
  notify();
}

// Нэвтэрсэн хэрэглэгчийн мэдээллийг шинэчилнэ (patch нь функц эсвэл объект)
export function updateUser(patch) {
  const email = read(SESSION_KEY, null);
  const accounts = read(ACCOUNTS_KEY, {});
  const acc = accounts[email];
  if (!acc) return false;
  accounts[email] = typeof patch === "function" ? patch(structuredClone(acc)) : { ...acc, ...patch };
  const ok = write(ACCOUNTS_KEY, accounts);
  if (ok) notify();
  return ok;
}
