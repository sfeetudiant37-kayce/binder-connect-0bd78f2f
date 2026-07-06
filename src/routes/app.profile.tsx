import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { DEFAULT_WEIGHTS } from "@/lib/algorithms/fitscore";
import type { Weights } from "@/lib/types";
import type { TKey } from "@/lib/i18n/dict";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

const FACTORS: { key: keyof Omit<Weights, "userId" | "updatedAt">; label: TKey }[] = [
  { key: "preferences", label: "preferencesFactor" },
  { key: "location", label: "locationFactor" },
  { key: "price", label: "priceFactor" },
  { key: "rating", label: "ratingFactor" },
  { key: "availability", label: "availabilityFactor" },
  { key: "profileCompleteness", label: "completenessFactor" },
  { key: "experience", label: "experienceFactor" },
];

function ProfilePage() {
  const { t, user, role, toggleRole, weights, setWeights, updateUser } = useApp();
  if (!user) return null;

  function resetWeights() {
    setWeights({ userId: user!.id, updatedAt: new Date().toISOString(), ...DEFAULT_WEIGHTS });
  }

  return (
    <div className="space-y-6">
      <section className="card-surface p-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
            style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold">{user.name}</h1>
            <div className="text-xs text-[#64748B]">{user.email}</div>
            <div className="text-xs text-[#64748B]">{user.location}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold">{t("profileCompletion")}</span>
            <span className="tabular-nums">{user.profileCompletion}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full"
              style={{ width: `${user.profileCompletion}%`, backgroundColor: "#1E40AF" }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#DBEAFE] p-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
              {t("role")}
            </div>
            <div className="text-sm font-bold">
              {role === "client" ? t("client") : t("provider")}
            </div>
          </div>
          <button onClick={toggleRole} className="btn-primary min-h-0 px-3 py-1.5 text-xs">
            {t("switchRole")}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-base font-bold">Preferences</h2>
        <div className="flex flex-wrap gap-1.5">
          {user.preferences.length === 0 && (
            <span className="text-xs text-[#64748B]">No preferences yet.</span>
          )}
          {user.preferences.map((p) => (
            <span
              key={p}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="card-surface p-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-bold">{t("weights")}</h2>
          <button
            onClick={resetWeights}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF]"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>
        <p className="mb-3 text-xs text-[#64748B]">{t("weightsHint")}</p>
        <ul className="space-y-2">
          {FACTORS.map(({ key, label }) => {
            const pct = Math.round((weights[key] ?? 0) * 100);
            return (
              <li key={key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{t(label)}</span>
                  <span className="tabular-nums text-[#64748B]">{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: "#1E40AF" }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card-surface p-4">
        <h2 className="mb-3 text-base font-bold">Quick edits</h2>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("fullName")}</span>
            <input
              className="input-field"
              value={user.name}
              onChange={(e) => updateUser({ name: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("location")}</span>
            <input
              className="input-field"
              value={user.location}
              onChange={(e) => updateUser({ location: e.target.value })}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
