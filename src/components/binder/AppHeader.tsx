import { Link } from "@tanstack/react-router";
import { Settings, UserCircle2 } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function AppHeader({ title }: { title?: string }) {
  const { t, role, toggleRole, user } = useApp();
  const isClient = role === "client";

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1E40AF]">
            Binder
          </div>
          {title ? (
            <h1 className="truncate text-lg font-bold text-[#0f172a]">{title}</h1>
          ) : (
            <div className="text-xs text-[#64748B]">
              {user ? user.name : t("welcome")}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={toggleRole}
              aria-label={t("switchRole")}
              className="inline-flex overflow-hidden rounded-full border border-[#1E40AF] text-[11px] font-semibold"
            >
              <span
                className={
                  "px-2.5 py-1 " +
                  (isClient ? "bg-[#1E40AF] text-white" : "text-[#1E40AF]")
                }
              >
                {t("client")}
              </span>
              <span
                className={
                  "px-2.5 py-1 " +
                  (!isClient ? "bg-[#1E40AF] text-white" : "text-[#1E40AF]")
                }
              >
                {t("provider")}
              </span>
            </button>
          )}
          <Link
            to="/app/profile"
            aria-label={t("profile")}
            className="rounded-full p-2 text-[#1E40AF] hover:bg-[#DBEAFE]"
          >
            <UserCircle2 size={22} />
          </Link>
          <Link
            to="/app/settings"
            aria-label={t("settings")}
            className="rounded-full p-2 text-[#1E40AF] hover:bg-[#DBEAFE]"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
