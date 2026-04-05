import type { User } from "./types";

const USERS_KEY = "dt_users_by_phone";
const SESSION_KEY = "dt_session_phone";

function readUsers(): Record<string, User> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, User>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function notifyUserListeners() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("dt-user-change"));
}

export function getSessionPhone(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionPhone(phone: string | null) {
  if (phone === null) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, phone);
  notifyUserListeners();
}

export function getUserByPhone(phone: string): User | null {
  const users = readUsers();
  return users[phone] ?? null;
}

export function saveUser(user: User) {
  const users = readUsers();
  users[user.phone] = user;
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, user.phone);
  notifyUserListeners();
}

export function clearSession() {
  setSessionPhone(null);
}

export function generateUserId(): string {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DT-${part()}-${part()}`;
}
