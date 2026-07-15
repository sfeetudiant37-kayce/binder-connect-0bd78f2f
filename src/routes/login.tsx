import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/context/AppContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Binder" }] }),
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type Form = z.infer<typeof schema>;

function LoginPage() {
  const { t, signIn, signInGoogle } = useApp();
  const nav = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(v: Form) {
    const { error } = await signIn(v.email, v.password);
    if (error) {
      toast.error("Sign in failed", { description: error });
      return;
    }
    toast.success("Welcome back");
    nav({ to: "/app/dashboard" });
  }

  async function onGoogle() {
    setGoogleLoading(true);
    const { error } = await signInGoogle();
    if (error) {
      toast.error("Google sign-in failed", { description: error });
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-dvh" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-md px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="mt-8">
          <span className="eyebrow">Welcome back</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {t("signIn")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to pick up where you left off.
          </p>
        </div>

        <div className="card-elevated mt-8 space-y-4 p-6">
          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Opening Google…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-[#64748B]">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            or
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label={t("email")} error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                {...register("email")}
              />
            </Field>
            <Field label={t("password")} error={errors.password?.message}>
              <input
                type="password"
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
                {...register("password")}
              />
            </Field>
            <button className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : t("signIn")}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link to="/signup" className="font-semibold text-brand hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.7 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.3-7.2 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C10 39.3 16.5 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2c-.4.4 6.5-4.7 6.5-14.7 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
