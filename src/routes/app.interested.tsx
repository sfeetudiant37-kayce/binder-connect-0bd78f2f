import { createFileRoute, Link } from "@tanstack/react-router";
import { Facebook, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { useMemo } from "react";
import { FitScoreBadge } from "@/components/binder/FitScoreBadge";
import { useApp } from "@/lib/context/AppContext";
import { computeProviderFit } from "@/lib/algorithms/fitscore";
import { MOCK_PROVIDERS, formatFCFA } from "@/lib/mock/data";

export const Route = createFileRoute("/app/interested")({
  component: InterestedPage,
});

function InterestedPage() {
  const { t, user, weights } = useApp();
  if (!user) return null;

  const ranked = useMemo(
    () =>
      MOCK_PROVIDERS.map((p) => ({
        provider: p,
        score: computeProviderFit(user, p, weights).composite,
      })).sort((a, b) => b.score - a.score),
    [user, weights],
  );

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold">{t("interestedProviders")}</h1>
        <p className="mt-1 text-xs text-[#64748B]">
          {t("interestedProvidersDesc")}
        </p>
      </header>

      <ul className="space-y-3">
        {ranked.map(({ provider, score }) => (
          <li key={provider.userId} className="card-surface p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold"
                style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
              >
                {provider.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to="/app/profile/$id"
                    params={{ id: provider.userId }}
                    className="truncate text-sm font-bold hover:text-[#1E40AF]"
                  >
                    {provider.name}
                  </Link>
                  <FitScoreBadge score={score} />
                </div>
                <div className="text-xs text-[#1E40AF]">{provider.title}</div>
                <div className="mt-0.5 text-[11px] text-[#64748B]">
                  {provider.location} · {formatFCFA(provider.price ?? 0)}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              <ContactBtn
                href={`tel:${provider.socialLinks?.phone?.replace(/\s/g, "")}`}
                icon={<Phone size={16} />}
                label={t("call")}
              />
              <ContactBtn
                href={`https://wa.me/${provider.socialLinks?.whatsapp?.replace(/\D/g, "")}`}
                icon={<MessageSquare size={16} />}
                label={t("whatsapp")}
              />
              <ContactBtn
                href={
                  provider.socialLinks?.facebook
                    ? `https://facebook.com/${provider.socialLinks.facebook}`
                    : "#"
                }
                icon={<Facebook size={16} />}
                label={t("facebook")}
              />
              <Link
                to="/app/chat/$id"
                params={{ id: provider.userId }}
                className="flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-semibold text-white"
                style={{ backgroundColor: "#1E40AF" }}
              >
                <MessageCircle size={16} />
                {t("chat")}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactBtn({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-[#1E40AF] py-2 text-[10px] font-semibold text-[#1E40AF]"
    >
      {icon}
      {label}
    </a>
  );
}
