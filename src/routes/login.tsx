import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
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
  const { t, signIn } = useApp();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  function onSubmit(v: Form) {
    signIn(v.email);
    nav({ to: "/app/dashboard" });
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

        <form onSubmit={handleSubmit(onSubmit)} className="card-elevated mt-8 space-y-4 p-6">
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
          <div className="flex justify-end">
            <button type="button" className="text-xs font-semibold text-brand hover:underline">
              {t("forgot")}
            </button>
          </div>
          <button className="btn-primary w-full" disabled={isSubmitting}>
            {t("signIn")}
          </button>
        </form>

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
