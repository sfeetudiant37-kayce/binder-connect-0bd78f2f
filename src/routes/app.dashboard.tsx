import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { useMemo } from "react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { useApp } from "@/lib/context/AppContext";
import { computeProviderFit, computeRequestFit } from "@/lib/algorithms/fitscore";
import { MOCK_PROVIDERS, MOCK_REQUESTS, formatFCFA } from "@/lib/mock/data";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t, user, role, weights } = useApp();
  if (!user) return null;
  const isClient = role === "client";

  const ranked = useMemo(() => {
    if (isClient) {
      return [...MOCK_PROVIDERS]
        .map((p) => ({ item: p, score: computeProviderFit(user, p, weights).composite }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    }
    return [...MOCK_REQUESTS]
      .map((r) => ({ item: r, score: computeRequestFit(user, r, weights).composite }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [isClient, user, weights]);

  return (
    <div className="space-y-6">
      {/* Profile completion */}
      <section className="card-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#1E40AF]">
              {t("profileCompletion")}
            </div>
            <div className="mt-1 text-xl font-bold">
              {user.profileCompletion}%
            </div>
          </div>
          <Link
            to="/app/profile"
            className="text-xs font-semibold text-[#1E40AF]"
          >
            Edit
          </Link>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
          <div
            className="h-full rounded-full"
            style={{ width: `${user.profileCompletion}%`, backgroundColor: "#1E40AF" }}
          />
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-2">
        <Stat label={t("swipes")} value="—" />
        <Stat label={t("matches")} value="0" />
        <Stat label={t("messages")} value="3" />
      </section>

      {/* Recommended */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold">{t("recommended")}</h2>
          <Link
            to="/app/discover"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#1E40AF]"
          >
            {t("discoverMore")} <ChevronRight size={14} />
          </Link>
        </div>

        <ul className="space-y-2">
          {ranked.map(({ item, score }) => (
            <li key={"userId" in item ? item.userId : item.id}>
              <div className="card-surface flex items-center gap-3 p-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
                >
                  {("name" in item ? item.name : item.clientName).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {"title" in item && "userId" in item
                      ? item.name
                      : item.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin size={11} />
                      {item.location}
                    </span>
                    {"rating" in item ? (
                      <span className="inline-flex items-center gap-0.5">
                        <Star size={11} strokeWidth={2.5} />
                        {item.rating}
                      </span>
                    ) : (
                      <span>{formatFCFA(item.budget)}</span>
                    )}
                  </div>
                </div>
                <FitScoreBadge score={score} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Link to="/app/discover" className="btn-primary w-full">
          {t("discoverMore")}
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-3 text-center">
      <div className="text-lg font-bold text-[#1E40AF]">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
        {label}
      </div>
    </div>
  );
}
