"use client";

interface Props {
  status: "draft" | "published";
}

export default function StatusBadge({ status }: Props) {
  const cls =
    status === "published"
      ? "bg-success/10 text-success ring-1 ring-success/20"
      : "bg-warning/10 text-warning ring-1 ring-warning/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cls}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "published" ? "bg-success" : "bg-warning"
        }`}
      />
      {status}
    </span>
  );
}