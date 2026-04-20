"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ScrollText, Plus, Trash2, CheckCircle2 } from "lucide-react";
import axios from "axios";

const actionMeta = {
  CREATE_ARTICLE: {
    label: "Created",
    Icon: Plus,
    cls: "bg-primary/10 text-primary",
  },
  PUBLISH_ARTICLE: {
    label: "Published",
    Icon: CheckCircle2,
    cls: "bg-success/10 text-success",
  },
  DELETE_ARTICLE: {
    label: "Deleted",
    Icon: Trash2,
    cls: "bg-destructive/10 text-destructive",
  },
};

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Article {
  _id: string;
  title: string;
}

export type AuditAction =
  | "CREATE_ARTICLE"
  | "DELETE_ARTICLE"
  | "PUBLISH_ARTICLE";

export interface AuditLog {
  _id: string;
  action: AuditAction;
  userId: User;
  articleId: Article;
  createdAt: string; // ISO date string
}

export default function Logs() {
  const { user, loading } = useAuth();
  // const { logs, articles } = useArticles();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const router = useRouter();

  const getLogs = async () => {
    try {
      const res = await axios.get("/api/logs", {
        withCredentials: true,
      });
      console.log("Fetched logs:", res.data.logs);
      setLogs(res.data.logs);
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.error || "Failed to fetch logs",
      };
    }
  };

  useEffect(() => {
    if(user){
      getLogs();
    }
  }, [user]);

  if (loading || !user) return null;

  // const visible =
  //   user.role === "admin"
  //     ? logs
  //     : logs.filter((l) => l.userId === user._id);

  return (
    <main>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {user.role === "admin"
              ? "Workspace activity"
              : "Your activity"}
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Audit logs
        </h1>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border-2 border-dashed border-border">
          <ScrollText className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="font-semibold">No activity yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Logs will appear here as articles are created,
            published, or deleted.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <ul className="divide-y divide-border/60">
            {logs.map((log) => {
              const meta = actionMeta[log.action];

              return (
                <li
                  key={log._id}
                  className="flex items-start gap-4 p-4 sm:p-5 hover:bg-muted/40 transition-colors"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.cls}`}
                  >
                    <meta.Icon
                      className="h-4 w-4"
                      strokeWidth={2.5}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {log.userId.name}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {meta.label.toLowerCase()}
                      </span>{" "}
                      <span className="font-medium">
                        {log.articleId === null || log.articleId === undefined
                          ? "an article"
                          : `"${log.articleId.title}"`}
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.cls}`}
                  >
                    {log.action.replace("_", " ")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
}