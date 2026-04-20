"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useArticles } from "@/hooks/useArticles";
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
import axios, { AxiosError } from "axios";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
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

  const [Article, setArticle] = useState<Article[]>([]);

  // const users = useMemo(() => storage.getUsers(), []);

  const getAllArticles = async () => {
    try {
      const res = await axios.get("/api/article", {
        withCredentials: true,
      });
      setArticle(res.data.articles);
      console.log("Fetched articles:", res.data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllArticles();
    }
  }, [user]);

  if (loading || !user) return null;

  const list = Article
    .filter((a) => (filter === "all" ? true : a.status === filter))
    .filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      const res = await axios.post(
        "/api/article",
        {
          title,
          content,
          status: "draft", // optional
        },
        {
          withCredentials: true, // ✅ important for cookies
        }
      );

      toast.success("Draft created");

      setTitle("");
      setContent("");
      setOpen(false);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>
      toast.error(error.response?.data.error || "Somethin went worng.")
    }
  };

  const handleDelete = async (id: string) => {
    try {
    await axios.delete(`/api/article/${id}`, {
      withCredentials: true,
    });

    setArticle((prev) => prev.filter((a) => a._id !== id));
    toast.success("Article deleted");
  } catch (err) {
    const error = err as AxiosError<{ error: string }>
    toast.error(error.response?.data.error || "Somethin went worng.")
  }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await axios.patch(
        `/api/article/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setArticle((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "published" } : a
        )
      );

      toast.success("Article published");
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.error || "Failed to publish",
      };
    }
  };

  const stats = {
    total: list.length,
    drafts: list.filter((a) => a.status === "draft").length,
    published: list.filter((a) => a.status === "published").length,
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
                className={`px-4 py-1.5 rounded-md text-sm ${filter === f
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
            return (
              <ArticleCard
                key={a._id}
                article={a}
                author={a.createdBy}
                currentUser={user}
                canDelete={canDelete(user, a)}
                canPublish={canPublish(user, a)}
                onDelete={() => handleDelete(a._id)}
                onPublish={() => handlePublish(a._id)}
                onView={() => setViewing(a)}
              />
            );
          })}
        </div>
      )}

      <ArticleDetailDialog
        article={viewing}
        author={viewing?.createdBy}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </>
  );
}