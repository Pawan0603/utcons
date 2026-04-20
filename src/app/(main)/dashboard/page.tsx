"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useArticles } from "@/hooks/useArticles";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArticleCard from "@/components/ArticleCard";
import ArticleDetailDialog from "@/components/ArticleDetailDialog";
import RoleBadge from "@/components/RoleBadge";
import { Article } from "@/data/mockData";
import { Plus, Search, FileQuestion } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    visibleArticles,
    createArticle,
    deleteArticle,
    publishArticle,
    canCreate,
    canDelete,
    canPublish,
  } = useArticles();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [viewing, setViewing] = useState<Article | null>(null);

  const users = useMemo(() => storage.getUsers(), []);

  // ✅ Replace Navigate
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const list = visibleArticles(user)
    .filter((a) => (filter === "all" ? true : a.status === filter))
    .filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    const res = createArticle(user, { title, content });

    if (!res.ok) {
      toast.error(res.error ?? "Could not create");
      return;
    }

    toast.success("Draft created");
    setTitle("");
    setContent("");
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const res = deleteArticle(user, id);
    if (!res.ok) toast.error(res.error ?? "Failed");
    else toast.success("Article deleted");
  };

  const handlePublish = (id: string) => {
    const res = publishArticle(user, id);
    if (!res.ok) toast.error(res.error ?? "Failed");
    else toast.success("Article published");
  };

  const stats = {
    total: list.length,
    drafts: visibleArticles(user).filter((a) => a.status === "draft").length,
    published: visibleArticles(user).filter(
      (a) => a.status === "published"
    ).length,
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name.split(" ")[0]}
            </p>
            <RoleBadge role={user.role} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Articles
          </h1>
        </div>

        {canCreate(user) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-glow w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1.5" /> New article
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new article</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                    required
                    rows={6}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-primary"
                  >
                    Save as draft
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Visible", value: stats.total },
          { label: "Drafts", value: stats.drafts },
          { label: "Published", value: stats.published },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border/60 bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">
              {s.label}
            </p>
            <p className="text-2xl font-bold mt-1">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["all", "draft", "published"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm ${
                  filter === f
                    ? "bg-card text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl">
          <FileQuestion className="mx-auto mb-4" />
          <h3>No articles found</h3>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const author = users.find(
              (u) => u.id === a.createdBy
            );

            return (
              <ArticleCard
                key={a.id}
                article={a}
                author={author}
                currentUser={user}
                canDelete={canDelete(user, a)}
                canPublish={canPublish(user, a)}
                onDelete={() => handleDelete(a.id)}
                onPublish={() => handlePublish(a.id)}
                onView={() => setViewing(a)}
              />
            );
          })}
        </div>
      )}

      <ArticleDetailDialog
        article={viewing}
        author={
          viewing
            ? users.find(
                (u) => u.id === viewing.createdBy
              )
            : undefined
        }
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </>
  );
}