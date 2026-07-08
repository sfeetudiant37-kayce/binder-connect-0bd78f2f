import { Link } from "@tanstack/react-router";
import { Settings, UserCircle2 } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function AppHeader({ title }: { title?: string }) {
  const { t, user } = useApp();

  return (
    <header className="glass-bar sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <Link to="/app/dashboard" className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
            style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-soft)" }}
          >
            B
          </span>
          <span className="min-w-0">
            {title ? (
              <h1 className="truncate font-display text-[15px] font-bold leading-tight text-foreground">
                {title}
              </h1>
            ) : (
              <span className="block font-display text-[15px] font-bold leading-tight text-foreground">
                Binder
              </span>
            )}
            <span className="block truncate text-[11px] text-muted-foreground">
              {user ? `Hi, ${user.name}` : t("welcome")}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/app/profile"
            aria-label={t("profile")}
            className="rounded-full p-2 text-brand hover:bg-brand-soft"
          >
            <UserCircle2 size={22} />
          </Link>
          <Link
            to="/app/settings"
            aria-label={t("settings")}
            className="rounded-full p-2 text-brand hover:bg-brand-soft"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
