"use client";

import { Article, User } from "@/data/mockData";

export function useArticles() {

  // 🔐 RBAC Rules
  const canCreate = (user: User | null) =>
    !!user && (user.role === "admin" || user.role === "editor");

  const canDelete = (user: User | null, article: Article) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "editor") return article.createdBy._id === user._id;
    return false;
  };

  const canPublish = (user: User | null, article: Article) => {
    if (!user || article.status === "published") return false;
    if (user.role === "admin") return true;
    if (user.role === "editor") return article.createdBy._id === user._id;
    return false;
  };

  const canView = (user: User | null, article: Article) => {
    if (!user) return false;
    if (article.status === "published") return true;
    if (user.role === "admin") return true;
    return article.createdBy._id === user._id;
  };



  return {
    canCreate,
    canDelete,
    canPublish,
    canView,
  };
}