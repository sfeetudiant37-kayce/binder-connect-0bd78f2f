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
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, #eaeef8 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, #fef3e2 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-between px-6 py-10">
        <div className="pt-6">
          <div className="tag-soft gap-1.5">
            <Sparkles size={12} /> Made in Cameroon
          </div>
          <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight text-brand">
            Binder.
          </h1>
          <p className="mt-4 max-w-sm font-display text-xl font-medium text-foreground">
            {t("tagline")}
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            A mobile marketplace where clients and skilled providers meet in a
            single swipe. Works offline, speaks EN &amp; FR.
          </p>
        </div>

        <div className="my-8 flex-1">
          <div
            className="surface-brand relative mx-auto flex aspect-[4/5] max-w-xs items-center justify-center overflow-hidden p-8"
          >
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
              style={{ background: "var(--gradient-accent)" }}
            />
            <div
              aria-hidden
              className="absolute -left-8 bottom-4 h-32 w-32 rounded-full opacity-25 blur-2xl"
              style={{ background: "#fff" }}
            />
            <div className="relative text-center">
              <div className="font-display text-8xl font-bold leading-none">B.</div>
              <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                Connect · Match · Work
              </div>
              <div className="mx-auto mt-6 h-px w-16 bg-white/25" />
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/85">
                <ShieldCheck size={12} /> Trusted matching
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
