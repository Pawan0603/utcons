"use client";

import { MouseEvent, useState } from "react";
import { Article, User } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2, User as UserIcon } from "lucide-react";

interface Props {
  article: Article;
  author?: User;
  currentUser: User;
  canDelete: boolean;
  canPublish: boolean;
  onDelete: () => void;
  onPublish: () => void;
  onView: () => void;
}

export default function ArticleCard({
  article,
  author,
  currentUser,
  canDelete,
  canPublish,
  onDelete,
  onPublish,
  onView,
}: Props) {
  const isMine = article.createdBy._id === currentUser._id;

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onView();
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-elegant hover:border-primary/30 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <StatusBadge status={article.status} />
        {isMine && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Yours
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
        {article.content}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 pt-3 border-t border-border/60">
        <UserIcon className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">
          {author?.name ?? "Unknown"}
        </span>
        <span>·</span>
        <span>
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>

      {(canPublish || canDelete) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {canPublish && (
            <Button
              size="sm"
              onClick={() => {
                setIsPublishing(true);
                onPublish();
              }}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground cursor-pointer"
              disabled={isPublishing}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}

          {canDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsDeleting(true);
                onDelete();
              }}
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:text-white cursor-pointer"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}