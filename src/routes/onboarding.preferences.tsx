import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/context/AppContext";
import { JOB_SKILLS, SERVICE_SKILLS } from "@/lib/mock/data";
import { Progress } from "./onboarding.objective";

export const Route = createFileRoute("/onboarding/preferences")({
  component: PreferencesPage,
});

function PreferencesPage() {
  const { t, user, updateUser } = useApp();
  const nav = useNavigate();
  const [picked, setPicked] = useState<string[]>(user?.preferences ?? []);

  const objective = user?.objective ?? "find_service";
  const isJob = objective === "find_job" || objective === "recruit_talent";
  const pool = isJob ? JOB_SKILLS : SERVICE_SKILLS;
  const max = 4;

  function toggle(skill: string) {
    setPicked((cur) =>
      cur.includes(skill)
        ? cur.filter((s) => s !== skill)
        : cur.length < max
        ? [...cur, skill]
        : cur,
    );
  }

  function next() {
    updateUser({ preferences: picked });
    nav({ to: "/onboarding/profile-setup" });
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-md px-5 py-8">
        <Progress step={2} total={3} />
        <h1 className="mt-6 text-2xl font-bold">{t("choosePreferences")}</h1>
        <p className="mt-1 text-sm text-[#64748B]">{t("preferencesHint")}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {pool.map((s) => {
            const active = picked.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={"chip " + (active ? "chip-active" : "")}
                aria-pressed={active}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-[#64748B]">
          {picked.length} / {max}
        </div>

        <div className="mt-8 space-y-2">
          <button
            className="btn-primary w-full"
            disabled={picked.length === 0}
            onClick={next}
          >
            {t("continue")}
          </button>
          <button className="btn-ghost w-full" onClick={next}>
            {t("skip")}
          </button>
        </div>
      </div>
    </main>
  );
}
