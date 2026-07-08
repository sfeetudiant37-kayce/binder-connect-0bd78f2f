import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Briefcase, ChevronRight, Compass, MapPin, MessageCircle, Sparkles, Star, TrendingUp } from "lucide-react";
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

  const top = ranked[0];

  return (
    <div className="space-y-5">
      {/* Hero — spotlight card */}
      <section className="surface-brand relative overflow-hidden p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-accent)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            <Sparkles size={12} /> {t("recommended")}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
            {isClient ? "Top providers near you" : "New requests for you"}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Curated by your FitScore preferences.
          </p>
          {top && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 font-display text-sm font-bold text-white">
                {("name" in top.item ? top.item.name : top.item.clientName).charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {"userId" in top.item ? top.item.name : top.item.title}
                </div>
                <div className="truncate text-[11px] text-white/70">
                  {top.item.location}
                </div>
              </div>
              <FitScoreBadge score={top.score} />
            </div>
          )}
          <Link
            to="/app/discover"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand shadow-sm hover:bg-white/90"
          >
            {t("discoverMore")} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Profile completion + quick stats — bento */}
      <section className="grid grid-cols-6 gap-3">
        <div className="card-surface col-span-6 p-4 sm:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">{t("profileCompletion")}</div>
              <div className="mt-1 font-display text-2xl font-bold">
                {user.profileCompletion}
                <span className="text-base text-muted-foreground">%</span>
              </div>
            </div>
            <Link to="/app/profile" className="btn-ghost">
              Edit
            </Link>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${user.profileCompletion}%`,
                background: "var(--gradient-accent)",
              }}
            />
          </div>
        </div>

        <BentoStat
          className="col-span-3 sm:col-span-2"
          icon={<TrendingUp size={16} />}
          label={t("matches")}
          value="0"
          tone="brand"
        />
        <BentoStat
          className="col-span-3 sm:col-span-3"
          icon={<MessageCircle size={16} />}
          label={t("messages")}
          value="3"
          tone="neutral"
        />
        <BentoStat
          className="col-span-3 sm:col-span-3"
          icon={<Briefcase size={16} />}
          label={t("swipes")}
          value="—"
          tone="neutral"
        />
      </section>

      {/* Recommended list */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Picked for you</h2>
          <Link
            to="/app/discover"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand hover:underline"
          >
            {t("discoverMore")} <ChevronRight size={14} />
          </Link>
        </div>

        <ul className="space-y-2">
          {ranked.map(({ item, score }) => (
            <li key={"userId" in item ? item.userId : item.id}>
              <Link
                to="/app/discover"
                className="card-surface flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {("name" in item ? item.name : item.clientName).charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {"userId" in item ? item.name : item.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
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
                      <span className="font-semibold text-foreground">
                        {formatFCFA(item.budget)}
                      </span>
                    )}
                  </div>
                </div>
                <FitScoreBadge score={score} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Link to="/app/discover" className="btn-primary w-full">
          <Compass size={16} /> {t("discoverMore")}
        </Link>
      </section>
    </div>
  );
}

function BentoStat({
  icon,
  label,
  value,
  tone,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "neutral";
  className?: string;
}) {
  const isBrand = tone === "brand";
  return (
    <div
      className={`${className} relative overflow-hidden rounded-2xl border p-4 ${
        isBrand ? "text-white" : "bg-surface text-foreground"
      }`}
      style={
        isBrand
          ? {
              background: "var(--gradient-brand)",
              borderColor: "transparent",
              boxShadow: "var(--shadow-soft)",
            }
          : { boxShadow: "var(--shadow-soft)" }
      }
    >
      <div
        className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg"
        style={{
          background: isBrand ? "rgba(255,255,255,0.15)" : "var(--color-brand-soft)",
          color: isBrand ? "#fff" : "var(--color-brand)",
        }}
      >
        {icon}
      </div>
      <div className="font-display text-2xl font-bold leading-none">{value}</div>
      <div
        className="mt-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: isBrand ? "rgba(255,255,255,0.75)" : "var(--color-muted-foreground)" }}
      >
        {label}
      </div>
    </div>
  );
}
