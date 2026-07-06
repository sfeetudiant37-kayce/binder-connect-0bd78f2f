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
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-md px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#1E40AF]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{t("signIn")}</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Welcome back. Sign in to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
            <button type="button" className="text-xs font-semibold text-[#1E40AF]">
              {t("forgot")}
            </button>
          </div>
          <button className="btn-primary w-full" disabled={isSubmitting}>
            {t("signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          {t("noAccount")}{" "}
          <Link to="/signup" className="font-semibold text-[#1E40AF]">
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
      <span className="mb-1 block text-xs font-semibold text-[#0f172a]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-[#DC2626]">{error}</span>}
    </label>
  );
}
