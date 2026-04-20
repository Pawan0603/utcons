"use client";

import { Article, User } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "./StatusBadge";
import { User as UserIcon, Calendar } from "lucide-react";

interface Props {
  article: Article | null;
  author?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArticleDetailDialog({
  article,
  author,
  open,
  onOpenChange,
}: Props) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={article.status} />
          </div>

          <DialogTitle className="text-2xl leading-tight">
            {article.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border/60">
          <div className="flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              {author?.name ?? "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(article.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
            {article.content}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}