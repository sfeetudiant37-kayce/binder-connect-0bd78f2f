import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Sparkles, WifiOff } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const { user, t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/app/dashboard" });
  }, [user, navigate]);

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-6 py-10">
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#DBEAFE] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1E3A8A]">
            <Sparkles size={12} /> Cameroon
          </div>
          <h1 className="mt-6 text-5xl font-extrabold leading-none tracking-tight text-[#1E40AF]">
            BINDER
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#0f172a]">
            {t("tagline")}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#64748B]">
            The mobile marketplace where clients and skilled providers find each other.
            Works offline. Available in English and French.
          </p>
        </div>

        <div className="my-10 flex-1">
          <div className="mx-auto flex aspect-square max-w-xs items-center justify-center rounded-3xl border border-[#E2E8F0] bg-[#DBEAFE]">
            <div className="text-center">
              <div className="text-6xl font-black text-[#1E40AF]">B</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1E3A8A]">
                Connect · Match · Work
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-6">
          <Link to="/signup" className="btn-primary w-full">
            {t("getStarted")} <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary w-full">
            {t("signIn")}
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-[#64748B]">
            <WifiOff size={12} /> Works offline · EN / FR
          </div>
        </div>
      </div>
    </main>
  );
}
