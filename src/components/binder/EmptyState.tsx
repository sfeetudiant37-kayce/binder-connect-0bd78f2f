import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card-surface flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div
        className="grid h-14 w-14 place-items-center rounded-2xl"
        style={{ background: "var(--gradient-brand)", color: "#fff", boxShadow: "var(--shadow-soft)" }}
      >
        <Inbox size={24} />
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
