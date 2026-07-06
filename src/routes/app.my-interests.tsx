import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { EmptyState } from "@/components/binder/EmptyState";
import { useApp } from "@/lib/context/AppContext";
import { computeRequestFit } from "@/lib/algorithms/fitscore";
import { MOCK_REQUESTS, formatFCFA } from "@/lib/mock/data";

export const Route = createFileRoute("/app/my-interests")({
  component: MyInterestsPage,
});

function MyInterestsPage() {
  const { t, user, weights } = useApp();
  if (!user) return null;

  const items = MOCK_REQUESTS.slice(0, 4).map((r) => ({
    r,
    score: computeRequestFit(user, r, weights).composite,
  }));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold">{t("myInterests")}</h1>
        <p className="mt-1 text-xs text-[#64748B]">{t("myInterestsDesc")}</p>
      </header>

      {items.length === 0 ? (
        <EmptyState title={t("empty")} />
      ) : (
        <ul className="space-y-2">
          {items.map(({ r, score }) => (
            <li key={r.id} className="card-surface p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-bold">{r.title}</h3>
                <FitScoreBadge score={score} />
              </div>
              <div className="mt-1 truncate text-xs text-[#64748B]">
                {r.clientName} · {r.location} · {formatFCFA(r.budget)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[10px] font-semibold text-[#1E3A8A]">
                <Clock size={11} /> Waiting on client
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
