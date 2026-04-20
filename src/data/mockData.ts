export type Role = "admin" | "editor" | "viewer";

export interface User {
  _id: string;
  name: string;
  email: string;
  // password: string;
  role: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  createdBy: string; // user id
  status: "draft" | "published";
  createdAt: string;
}

export type AuditAction =
  | "CREATE_ARTICLE"
  | "DELETE_ARTICLE"
  | "PUBLISH_ARTICLE";

export interface AuditLog {
  _id: string;
  userId: string;
  action: AuditAction;
  articleId: string;
  timestamp: string;
}

export const seedUsers: User[] = [
  {
    _id: "u1",
    name: "Ada Admin",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
  },
  {
    _id: "u2",
    name: "Eli Editor",
    email: "editor@demo.com",
    password: "editor123",
    role: "editor",
  },
  {
    _id: "u3",
    name: "Vera Viewer",
    email: "viewer@demo.com",
    password: "viewer123",
    role: "viewer",
  },
];

export const seedArticles: Article[] = [
  {
    _id: "a1",
    title: "Welcome to Helix CMS",
    content:
      "Helix is a modern role-based content platform. Explore the dashboard to get started.",
    createdBy: "u1",
    status: "published",
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 5
    ).toISOString(),
  },
  {
    _id: "a2",
    title: "Editorial guidelines (Draft)",
    content:
      "Internal draft outlining the new content style. Not yet ready for publication.",
    createdBy: "u2",
    status: "draft",
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 2
    ).toISOString(),
  },
  {
    _id: "a3",
    title: "Q4 Product Roadmap",
    content:
      "Here's what's shipping next quarter — RBAC v2, audit insights, and richer content blocks.",
    createdBy: "u2",
    status: "published",
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(),
  },
];

export const seedLogs: AuditLog[] = [];