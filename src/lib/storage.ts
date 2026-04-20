"use client";

import {
  Article,
  AuditLog,
  User,
  seedArticles,
  seedLogs,
  seedUsers,
} from "@/data/mockData";

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

export const storage = {
  getUsers: (): User[] => load<User[]>(KEYS.users, seedUsers),

  setUsers: (users: User[]) => {
    if (!isBrowser) return;
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  },

  getArticles: (): Article[] =>
    load<Article[]>(KEYS.articles, seedArticles),

  setArticles: (a: Article[]) => {
    if (!isBrowser) return;
    localStorage.setItem(KEYS.articles, JSON.stringify(a));
  },

  getLogs: (): AuditLog[] =>
    load<AuditLog[]>(KEYS.logs, seedLogs),

  setLogs: (l: AuditLog[]) => {
    if (!isBrowser) return;
    localStorage.setItem(KEYS.logs, JSON.stringify(l));
  },

  getSession: (): string | null => {
    if (!isBrowser) return null;

    try {
      return localStorage.getItem(KEYS.session);
    } catch {
      return null;
    }
  },

  setSession: (userId: string | null) => {
    if (!isBrowser) return;

    if (userId) {
      localStorage.setItem(KEYS.session, userId);
    } else {
      localStorage.removeItem(KEYS.session);
    }
  },
};

// ✅ Utility
export const uid = (): string =>
  Math.random().toString(36).slice(2, 10);