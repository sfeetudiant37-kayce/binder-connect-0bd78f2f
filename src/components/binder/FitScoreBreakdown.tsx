import { X } from "lucide-react";
import type { FitScoreBreakdown as FSB } from "@/lib/types";
import { useApp } from "@/lib/context/AppContext";
import type { TKey } from "@/lib/i18n/dict";

const FACTORS: { key: keyof Omit<FSB, "composite">; label: TKey }[] = [
  { key: "preferences", label: "preferencesFactor" },
  { key: "location", label: "locationFactor" },
  { key: "price", label: "priceFactor" },
  { key: "rating", label: "ratingFactor" },
  { key: "availability", label: "availabilityFactor" },
  { key: "profileCompleteness", label: "completenessFactor" },
  { key: "experience", label: "experienceFactor" },
];

export function FitScoreBreakdownModal({
  breakdown,
  onClose,
}: {
  breakdown: FSB | null;
  onClose: () => void;
}) {
  const { t, weights } = useApp();
  if (!breakdown) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("fitScoreBreakdown")}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{t("fitScoreBreakdown")}</h2>
            <p className="mt-1 text-xs text-[#64748B]">{t("fitFormula")}</p>
          </div>
          <button
            aria-label={t("cancel")}
            className="rounded-full p-1 text-[#64748B] hover:bg-[#DBEAFE] hover:text-[#1E40AF]"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="my-4 rounded-xl p-4 text-center"
          style={{ backgroundColor: "#DBEAFE" }}
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
            {t("fitScore")}
          </div>
          <div className="text-4xl font-bold text-[#1E40AF]">
            {breakdown.composite}%
          </div>
        </div>

        <ul className="space-y-3">
          {FACTORS.map(({ key, label }) => {
            const value = breakdown[key];
            const weight = weights[key];
            const pct = Math.round(value * 100);
            return (
              <li key={key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{t(label)}</span>
                  <span className="tabular-nums text-[#64748B]">
                    {pct}% × w{(weight * 100).toFixed(0)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "#1E40AF",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <button className="btn-primary mt-5 w-full" onClick={onClose}>
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
