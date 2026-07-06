import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Briefcase, ChevronRight, PlusCircle, Users } from "lucide-react";
import { useMemo } from "react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { EmptyState } from "@/components/binder/EmptyState";
import { useApp } from "@/lib/context/AppContext";
import { computeProviderFit, computeRequestFit } from "@/lib/algorithms/fitscore";
import { MOCK_PROVIDERS, MOCK_REQUESTS, formatFCFA } from "@/lib/mock/data";

export const Route = createFileRoute("/app/matches")({
  component: MatchesPage,
});

function MatchesPage() {
  const { t, role, user, weights } = useApp();
  if (!user) return null;
  const isClient = role === "client";

  // For demo, treat top-scoring providers as "interested" for client;
  // top-scoring requests as "interests" for provider.
  const pool = useMemo(() => {
    if (isClient) {
      return MOCK_PROVIDERS.map((p) => ({
        item: p,
        score: computeProviderFit(user, p, weights).composite,
      })).sort((a, b) => b.score - a.score);
    }
    return MOCK_REQUESTS.map((r) => ({
      item: r,
      score: computeRequestFit(user, r, weights).composite,
    })).sort((a, b) => b.score - a.score);
  }, [isClient, user, weights]);

  return (
    <div className="space-y-6">
      {/* Section header + quick nav */}
      <div className="flex flex-wrap gap-2">
        {isClient ? (
          <>
            <Link to="/app/interested" className="btn-primary flex-1">
              <Users size={16} />
              {t("interestedProviders")}
            </Link>
            <Link to="/app/requests" className="btn-secondary flex-1">
              <PlusCircle size={16} />
              {t("myRequests")}
            </Link>
          </>
        ) : (
          <>
            <Link to="/app/notifications" className="btn-primary flex-1">
              <Bell size={16} />
              {t("clientNotifications")}
            </Link>
            <Link to="/app/my-interests" className="btn-secondary flex-1">
              <Briefcase size={16} />
              {t("myInterests")}
            </Link>
          </>
        )}
      </div>

      <section>
        <h2 className="mb-2 text-base font-bold">
          {isClient ? t("interestedProviders") : t("clientNotifications")}
        </h2>
        <p className="mb-3 text-xs text-[#64748B]">
          {isClient
            ? t("interestedProvidersDesc")
            : t("clientNotificationsDesc")}
        </p>

        {pool.length === 0 ? (
          <EmptyState title={t("empty")} />
        ) : (
          <ul className="space-y-2">
            {pool.slice(0, 6).map(({ item, score }) => {
              const id = "userId" in item ? item.userId : item.id;
              const name = "name" in item ? item.name : item.clientName;
              const sub =
                "title" in item && item.title
                  ? item.title
                  : "budget" in item
                  ? formatFCFA(item.budget)
                  : "";
              const mutual = score >= 75;
              return (
                <li key={id}>
                  <Link
                    to="/app/profile/$id"
                    params={{ id }}
                    className="card-surface flex items-center gap-3 p-3"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
                    >
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold">{name}</div>
                        {mutual && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
                            style={{ backgroundColor: "#1E40AF" }}
                          >
                            {t("mutualMatch")}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-[#64748B]">{sub}</div>
                    </div>
                    <FitScoreBadge score={score} />
                    <ChevronRight size={16} className="text-[#64748B]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
