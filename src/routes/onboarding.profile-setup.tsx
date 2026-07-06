import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useApp } from "@/lib/context/AppContext";
import { LOCATIONS } from "@/lib/mock/data";
import type { Availability } from "@/lib/types";
import { Progress } from "./onboarding.objective";

export const Route = createFileRoute("/onboarding/profile-setup")({
  component: ProfileSetupPage,
});

interface Form {
  location: string;
  price: number;
  availability: Availability;
  bio: string;
}

function ProfileSetupPage() {
  const { t, user, updateUser } = useApp();
  const nav = useNavigate();
  const { register, handleSubmit } = useForm<Form>({
    defaultValues: {
      location: user?.location ?? "Douala",
      price: 15000,
      availability: "immediate",
      bio: "",
    },
  });

  function save(v: Form) {
    updateUser({ location: v.location, profileCompletion: 90 });
    nav({ to: "/app/dashboard" });
  }
  function skip() {
    updateUser({ profileCompletion: 30 });
    nav({ to: "/app/dashboard" });
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-md px-5 py-8">
        <Progress step={3} total={3} />
        <h1 className="mt-6 text-2xl font-bold">{t("profileSetup")}</h1>
        <p className="mt-1 text-sm text-[#64748B]">{t("profileSetupHint")}</p>

        <form onSubmit={handleSubmit(save)} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("location")}</span>
            <select className="input-field" {...register("location")}>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("price")}</span>
            <input
              type="number"
              step={1000}
              className="input-field"
              {...register("price", { valueAsNumber: true })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("availability")}</span>
            <select className="input-field" {...register("availability")}>
              <option value="immediate">{t("immediate")}</option>
              <option value="this_week">{t("thisWeek")}</option>
              <option value="flexible">{t("flexible")}</option>
              <option value="busy">{t("busy")}</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">{t("bio")}</span>
            <textarea
              rows={4}
              className="input-field"
              placeholder="A few lines about you..."
              {...register("bio")}
            />
          </label>

          <div className="space-y-2 pt-2">
            <button className="btn-primary w-full">{t("save")}</button>
            <button type="button" className="btn-ghost w-full" onClick={skip}>
              {t("skip")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
