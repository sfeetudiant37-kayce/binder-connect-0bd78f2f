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
      className="sticky bottom-0 z-30 border-t border-[#E2E8F0] bg-white"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const active = path === tab.to || path.startsWith(tab.to + "/");
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium"
                style={{ color: active ? "#1E40AF" : "#64748B" }}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
