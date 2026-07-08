import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Home, MessageCircle, RefreshCw, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useApp } from "@/lib/context/AppContext";

interface Tab {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export function BottomNav() {
  const { t } = useApp();
  const location = useLocation();
  const path = location.pathname;

  const tabs: Tab[] = [
    { to: "/app/dashboard", label: t("home"), icon: Home },
    { to: "/app/discover", label: t("discover"), icon: Compass },
    { to: "/app/matches", label: t("matches"), icon: Users },
    { to: "/app/messages", label: t("chat"), icon: MessageCircle },
    { to: "/app/sync", label: t("sync"), icon: RefreshCw },
  ];

  return (
    <nav
      aria-label="Primary"
      className="glass-bar sticky bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-1.5">
        {tabs.map((tab) => {
          const active = path === tab.to || path.startsWith(tab.to + "/");
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className="group relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition-colors"
                style={{
                  color: active ? "var(--color-brand-foreground)" : "var(--color-muted-foreground)",
                  background: active ? "var(--gradient-brand)" : "transparent",
                  boxShadow: active ? "var(--shadow-soft)" : "none",
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
