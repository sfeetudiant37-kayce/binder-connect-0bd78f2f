import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  HardHat,
  Handshake,
  Search,
  TrendingUp,
  Users2,
} from "lucide-react";
import type { ComponentType } from "react";
import { useApp } from "@/lib/context/AppContext";
import type { Objective, Role } from "@/lib/types";
import type { TKey } from "@/lib/i18n/dict";

export const Route = createFileRoute("/onboarding/objective")({
  component: ObjectivePage,
});

interface OItem {
  key: Objective;
  labelKey: TKey;
  descKey: TKey;
  role: Role;
  icon: ComponentType<{ size?: number }>;
}
const OPTIONS: OItem[] = [
  { key: "find_service", labelKey: "findService", descKey: "findServiceDesc", role: "client", icon: Search },
  { key: "offer_service", labelKey: "offerService", descKey: "offerServiceDesc", role: "provider", icon: HardHat },
  { key: "find_job", labelKey: "findJob", descKey: "findJobDesc", role: "client", icon: Briefcase },
  { key: "recruit_talent", labelKey: "recruitTalent", descKey: "recruitTalentDesc", role: "client", icon: Users2 },
  { key: "grow_brand", labelKey: "growBrand", descKey: "growBrandDesc", role: "provider", icon: TrendingUp },
  { key: "network", labelKey: "network", descKey: "networkDesc", role: "provider", icon: Handshake },
];

function ObjectivePage() {
  const { t, updateUser, setRole } = useApp();
  const nav = useNavigate();

  function pick(o: OItem) {
    updateUser({ objective: o.key, activeRole: o.role });
    setRole(o.role);
    nav({ to: "/onboarding/preferences" });
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-md px-5 py-8">
        <Progress step={1} total={3} />
        <h1 className="mt-6 text-2xl font-bold">{t("chooseObjective")}</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Pick your main goal — you can do more later.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.key}
                onClick={() => pick(o)}
                className="group flex flex-col items-start gap-2 rounded-xl border border-[#E2E8F0] bg-white p-4 text-left transition hover:border-[#1E40AF] hover:bg-[#DBEAFE]/50"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
                >
                  <Icon size={20} />
                </div>
                <div className="text-sm font-bold">{t(o.labelKey)}</div>
                <div className="text-xs text-[#64748B]">{t(o.descKey)}</div>
                <div className="mt-auto text-[10px] font-semibold uppercase tracking-widest text-[#1E40AF]">
                  {t(o.role)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{ backgroundColor: i < step ? "#1E40AF" : "#E2E8F0" }}
        />
      ))}
    </div>
  );
}
