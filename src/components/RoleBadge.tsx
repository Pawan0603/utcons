"use client";

import { Crown, Pencil, Eye } from "lucide-react";

const config: Record<
  string,
  { label: string; cls: string; Icon: React.ElementType }
> = {
  admin: {
    label: "admin",
    cls: "bg-gradient-primary text-primary-foreground",
    Icon: Crown,
  },
  editor: {
    label: "editor",
    cls: "bg-accent text-accent-foreground",
    Icon: Pencil,
  },
  viewer: {
    label: "viewer",
    cls: "bg-muted text-muted-foreground",
    Icon: Eye,
  },
};

export default function RoleBadge({ role }: { role: string }) {
  const { label, cls, Icon } = config[role];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {label}
    </span>
  );
}