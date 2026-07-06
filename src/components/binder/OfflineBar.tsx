import { WifiOff } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function OfflineBar() {
  const { online, t } = useApp();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-danger px-4 py-2 text-xs font-semibold text-white"
      style={{ backgroundColor: "#DC2626" }}
    >
      <WifiOff size={14} strokeWidth={2.25} />
      <span>{t("offlineMode")}</span>
    </div>
  );
}
