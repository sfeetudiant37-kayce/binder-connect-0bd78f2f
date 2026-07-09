import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
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
    <main
      className="relative min-h-dvh overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Technical grid ornament */}
      <div
        aria-hidden
        className="grid-ornament pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-6 py-10">
        <div className="pt-6">
          <div className="tag-outline">
            <Sparkles size={11} /> Final-Year Project · Cameroon
          </div>
          <h1 className="mt-6 font-display text-[68px] font-bold leading-[0.92] tracking-tight text-brand">
            Binder<span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>
          <p className="mt-4 max-w-sm font-display text-xl font-semibold text-foreground">
            {t("tagline")}
          </p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            A mobile-first marketplace where clients and skilled providers meet
            in a single swipe. Offline-ready. Bilingual EN / FR.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="tag-soft"><ShieldCheck size={11} /> Trust-weighted matching</span>
            <span className="tag-soft"><WifiOff size={11} /> Offline-first PWA</span>
          </div>
        </div>

        <div className="my-8 flex-1">
          <div className="surface-brand relative mx-auto flex aspect-[4/5] max-w-xs items-center justify-center p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
              style={{ background: "var(--gradient-accent)" }}
            />
            <div
              aria-hidden
              className="grid-ornament pointer-events-none absolute inset-0 opacity-[0.12]"
            />
            <div className="relative text-center">
              <div className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>
                v1.0 · Simulation Build
              </div>
              <div className="mt-3 font-display text-[96px] font-bold leading-none">
                B<span style={{ color: "var(--color-accent-2)" }}>.</span>
              </div>
              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                Connect · Match · Work
              </div>
              <div className="mx-auto mt-5 h-px w-20 bg-white/25" />
              <div className="mt-5 grid grid-cols-3 gap-3 text-left">
                <MetricPill label="Matches" value="1.2k" />
                <MetricPill label="Providers" value="380" />
                <MetricPill label="Cities" value="12" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-4">
          <Link to="/signup" className="btn-accent w-full">
            {t("getStarted")} <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary w-full">
            {t("signIn")}
          </Link>
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
            <WifiOff size={12} /> Works offline · EN / FR
          </div>
        </div>
      </div>
    </main>
  );
}
