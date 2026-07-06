import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Facebook,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Star,
  X,
} from "lucide-react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { useApp } from "@/lib/context/AppContext";
import { computeProviderFit } from "@/lib/algorithms/fitscore";
import { MOCK_PROVIDERS, formatFCFA } from "@/lib/mock/data";

export const Route = createFileRoute("/app/profile/$id")({
  component: ProfileViewPage,
  notFoundComponent: () => (
    <div className="p-6 text-center text-sm text-[#64748B]">Profile not found</div>
  ),
});

function ProfileViewPage() {
  const { id } = Route.useParams();
  const { t, user, weights } = useApp();
  const nav = useNavigate();
  const provider = MOCK_PROVIDERS.find((p) => p.userId === id);

  if (!provider || !user) {
    return (
      <div className="p-6 text-center text-sm text-[#64748B]">
        Profile not found
      </div>
    );
  }

  const breakdown = computeProviderFit(user, provider, weights);

  return (
    <div className="space-y-5">
      <Link to="/app/matches" className="inline-flex items-center gap-1 text-sm text-[#1E40AF]">
        <ArrowLeft size={16} /> Back
      </Link>

      <section className="card-surface overflow-hidden">
        <div className="h-24" style={{ backgroundColor: "#DBEAFE" }} />
        <div className="-mt-10 p-4">
          <div
            className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-2xl font-bold"
            style={{ backgroundColor: "#1E40AF", color: "#fff" }}
          >
            {provider.name.charAt(0)}
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-xl font-bold">{provider.name}</h1>
              <div className="text-sm text-[#1E40AF]">{provider.title}</div>
            </div>
            <FitScoreBadge score={breakdown.composite} size="lg" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#64748B]">
            <Meta icon={<MapPin size={12} />}>{provider.location}</Meta>
            <Meta icon={<Star size={12} strokeWidth={2.5} />}>
              {provider.rating} · {provider.reviewCount} {t("reviews")}
            </Meta>
            <Meta icon={<Clock size={12} />}>{provider.availability.replace("_", " ")}</Meta>
          </div>

          {provider.bio && (
            <p className="mt-3 text-sm text-[#0f172a]">{provider.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.skills.map((s) => (
              <span
                key={s}
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-3 text-2xl font-bold text-[#1E40AF]">
            {formatFCFA(provider.price ?? 0)}
          </div>
        </div>
      </section>

      <section className="card-surface p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
          {t("contactReveal")}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <a
            href={`tel:${provider.socialLinks?.phone?.replace(/\s/g, "")}`}
            className="flex flex-col items-center gap-1 rounded-lg border border-[#1E40AF] py-2 text-[10px] font-semibold text-[#1E40AF]"
          >
            <Phone size={16} />
            {t("call")}
          </a>
          <a
            href={`https://wa.me/${provider.socialLinks?.whatsapp?.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 rounded-lg border border-[#1E40AF] py-2 text-[10px] font-semibold text-[#1E40AF]"
          >
            <MessageSquare size={16} />
            {t("whatsapp")}
          </a>
          <a
            href={`https://facebook.com/${provider.socialLinks?.facebook ?? ""}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 rounded-lg border border-[#1E40AF] py-2 text-[10px] font-semibold text-[#1E40AF]"
          >
            <Facebook size={16} />
            {t("facebook")}
          </a>
          <Link
            to="/app/chat/$id"
            params={{ id: provider.userId }}
            className="flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold text-white"
            style={{ backgroundColor: "#1E40AF" }}
          >
            <MessageCircle size={16} />
            {t("chat")}
          </Link>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          className="btn-danger flex-1"
          onClick={() => nav({ to: "/app/discover" })}
        >
          <X size={16} /> {t("pass")}
        </button>
        <Link
          to="/app/chat/$id"
          params={{ id: provider.userId }}
          className="btn-primary flex-1"
        >
          <Check size={16} /> {t("interested")}
        </Link>
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border border-[#E2E8F0] px-2 py-0.5">
      {icon}
      {children}
    </span>
  );
}
