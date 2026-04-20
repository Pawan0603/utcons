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
  createdBy: User; // user id
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

// export const seedArticles: Article[] = [
//   {
//     _id: "a1",
//     title: "Welcome to Helix CMS",
//     content:
//       "Helix is a modern role-based content platform. Explore the dashboard to get started.",
//     createdBy: "u1",
//     status: "published",
//     createdAt: new Date(
//       Date.now() - 1000 * 60 * 60 * 24 * 5
//     ).toISOString(),
//   },
//   {
//     _id: "a2",
//     title: "Editorial guidelines (Draft)",
//     content:
//       "Internal draft outlining the new content style. Not yet ready for publication.",
//     createdBy: "u2",
//     status: "draft",
//     createdAt: new Date(
//       Date.now() - 1000 * 60 * 60 * 24 * 2
//     ).toISOString(),
//   },
//   {
//     _id: "a3",
//     title: "Q4 Product Roadmap",
//     content:
//       "Here's what's shipping next quarter — RBAC v2, audit insights, and richer content blocks.",
//     createdBy: "u2",
//     status: "published",
//     createdAt: new Date(
//       Date.now() - 1000 * 60 * 60 * 24
//     ).toISOString(),
//   },
// ];

export const seedLogs: AuditLog[] = [];