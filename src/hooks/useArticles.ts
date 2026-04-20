"use client";

import { useCallback, useEffect, useState } from "react";
import { Article, AuditAction, AuditLog, User } from "@/data/mockData";
import { storage, uid } from "@/lib/storage";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setArticles(storage.getArticles());
    setLogs(storage.getLogs());
  }, []);

  const persist = (next: Article[]) => {
    storage.setArticles(next);
    setArticles(next);
  };

  const log = (userId: string, action: AuditAction, articleId: string) => {
    const entry: AuditLog = {
      id: uid(),
      userId,
      action,
      articleId,
      timestamp: new Date().toISOString(),
    };

    const next = [entry, ...storage.getLogs()];
    storage.setLogs(next);
    setLogs(next);
  };

  // 🔐 RBAC Rules
  const canCreate = (user: User | null) =>
    !!user && (user.role === "admin" || user.role === "editor");

  const canDelete = (user: User | null, article: Article) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "editor") return article.createdBy === user.id;
    return false;
  };

  const canPublish = (user: User | null, article: Article) => {
    if (!user || article.status === "published") return false;
    if (user.role === "admin") return true;
    if (user.role === "editor") return article.createdBy === user.id;
    return false;
  };

  const canView = (user: User | null, article: Article) => {
    if (!user) return false;
    if (article.status === "published") return true;
    if (user.role === "admin") return true;
    return article.createdBy === user.id;
  };

  const visibleArticles = (user: User | null) => {
    if (!user) return [];
    if (user.role === "viewer") {
      return articles.filter((a) => a.status === "published");
    }
    return articles;
  };

  // 📝 Actions
  const createArticle = useCallback(
    (user: User, data: { title: string; content: string }) => {
      if (!canCreate(user)) {
        return { ok: false, error: "Not authorized" };
      }

      const article: Article = {
        id: uid(),
        title: data.title.trim(),
        content: data.content.trim(),
        createdBy: user.id,
        status: "draft",
        createdAt: new Date().toISOString(),
      };

      const next = [article, ...storage.getArticles()];
      persist(next);
      log(user.id, "CREATE_ARTICLE", article.id);

      return { ok: true, article };
    },
    []
  );

  const deleteArticle = (user: User, articleId: string) => {
    const current = storage.getArticles();
    const article = current.find((a) => a.id === articleId);

    if (!article) {
      return { ok: false, error: "Article not found" };
    }

    if (!canDelete(user, article)) {
      return { ok: false, error: "Not authorized" };
    }

    persist(current.filter((a) => a.id !== articleId));
    log(user.id, "DELETE_ARTICLE", articleId);

    return { ok: true };
  };

  const publishArticle = (user: User, articleId: string) => {
    const current = storage.getArticles();
    const article = current.find((a) => a.id === articleId);

    if (!article) {
      return { ok: false, error: "Article not found" };
    }

    if (article.status === "published") {
      return { ok: false, error: "Already published" };
    }

    if (!canPublish(user, article)) {
      return { ok: false, error: "Not authorized" };
    }

    const next = current.map((a) =>
      a.id === articleId
        ? { ...a, status: "published" as const }
        : a
    );

    persist(next);
    log(user.id, "PUBLISH_ARTICLE", articleId);

    return { ok: true };
  };

  return {
    articles,
    logs,
    visibleArticles,
    createArticle,
    deleteArticle,
    publishArticle,
    canCreate,
    canDelete,
    canPublish,
    canView,
  };
}