import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight } from "lucide-react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { useApp } from "@/lib/context/AppContext";
import { computeRequestFit } from "@/lib/algorithms/fitscore";
import { MOCK_REQUESTS } from "@/lib/mock/data";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t, user, weights } = useApp();
  if (!user) return null;

  const items = MOCK_REQUESTS.map((r) => ({
    r,
    score: computeRequestFit(user, r, weights).composite,
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold">{t("clientNotifications")}</h1>
        <p className="mt-1 text-xs text-[#64748B]">{t("clientNotificationsDesc")}</p>
      </header>

      <ul className="space-y-2">
        {items.map(({ r, score }) => (
          <li key={r.id}>
            <div className="card-surface flex items-center gap-3 p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
              >
                <Bell size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {r.clientName} wants more info
                </div>
                <div className="truncate text-xs text-[#64748B]">{r.title}</div>
              </div>
              <FitScoreBadge score={score} />
              <Link
                to="/app/chat/$id"
                params={{ id: r.clientId }}
                className="rounded-full p-1 text-[#64748B]"
                aria-label={t("chat")}
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
