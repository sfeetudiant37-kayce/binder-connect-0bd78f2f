import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — Binder" }] }),
});

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email(),
  password: z.string().min(6, "At least 6 characters"),
  terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});
type Form = z.infer<typeof schema>;

function SignupPage() {
  const { t, signUp } = useApp();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  function onSubmit(v: Form) {
    signUp(v.name, v.email);
    nav({ to: "/onboarding/objective" });
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto max-w-md px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#1E40AF]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{t("createAccount")}</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Free to join. Cancel anytime.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label={t("fullName")} error={errors.name?.message}>
            <input
              className="input-field"
              placeholder="Paul Ekwalla"
              {...register("name")}
            />
          </Field>
          <Field label={t("email")} error={errors.email?.message}>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              {...register("email")}
            />
          </Field>
          <Field label={t("password")} error={errors.password?.message}>
            <input
              type="password"
              className="input-field"
              placeholder="At least 6 characters"
              {...register("password")}
            />
          </Field>
          <label className="flex items-start gap-2 text-xs text-[#64748B]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#1E40AF]"
              {...register("terms")}
            />
            <span>{t("acceptTerms")}</span>
          </label>
          {errors.terms && (
            <span className="block text-xs text-[#DC2626]">
              {errors.terms.message}
            </span>
          )}
          <button className="btn-primary w-full" disabled={isSubmitting}>
            {t("createAccount")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          {t("haveAccount")}{" "}
          <Link to="/login" className="font-semibold text-[#1E40AF]">
            {t("signIn")}
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
