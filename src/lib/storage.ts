"use client";

const KEYS = {
  users: "rbac:users",
  articles: "rbac:articles",
  logs: "rbac:logs",
  session: "rbac:session",
} as const;

// ✅ Safe check for browser
const isBrowser = typeof window !== "undefined";

function load<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;

  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}