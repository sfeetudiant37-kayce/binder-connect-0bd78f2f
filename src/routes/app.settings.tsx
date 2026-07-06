import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Globe, LogOut } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang, signOut } = useApp();
  const nav = useNavigate();

  function logout() {
    signOut();
    nav({ to: "/" });
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">{t("settings")}</h1>
      </header>

      <section className="card-surface divide-y divide-[#E2E8F0]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
              <Globe size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">{t("language")}</div>
              <div className="text-xs text-[#64748B]">English / Français</div>
            </div>
          </div>
          <div className="inline-flex overflow-hidden rounded-full border border-[#1E40AF] text-[11px] font-semibold">
            <button
              onClick={() => setLang("en")}
              className={"px-3 py-1 " + (lang === "en" ? "bg-[#1E40AF] text-white" : "text-[#1E40AF]")}
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={"px-3 py-1 " + (lang === "fr" ? "bg-[#1E40AF] text-white" : "text-[#1E40AF]")}
            >
              FR
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
              <Bell size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">{t("notifications")}</div>
              <div className="text-xs text-[#64748B]">Match & message alerts</div>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-9 accent-[#1E40AF]" />
        </div>
      </section>

      <button onClick={logout} className="btn-danger w-full">
        <LogOut size={16} /> {t("logout")}
      </button>

      <p className="pb-4 text-center text-[11px] text-[#64748B]">
        Binder v1.0 · Built for Cameroon
      </p>
    </div>
  );
}
