import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FitScoreBreakdownModal } from "@/components/binder/FitScoreBreakdown";
import { SwipeCard } from "@/components/binder/SwipeCard";
import { EmptyState } from "@/components/binder/EmptyState";
import { computeProviderFit, computeRequestFit } from "@/lib/algorithms/fitscore";
import { adjustWeights } from "@/lib/algorithms/weights";
import { useApp } from "@/lib/context/AppContext";
import { MOCK_PROVIDERS, MOCK_REQUESTS, formatFCFA } from "@/lib/mock/data";
import type { FitScoreBreakdown, Profile, ServiceRequest } from "@/lib/types";
import { db } from "@/lib/db/dexie";

export const Route = createFileRoute("/app/discover")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const { t, user, role, weights, setWeights, online } = useApp();
  const [index, setIndex] = useState(0);
  const [openBreakdown, setOpenBreakdown] = useState<FitScoreBreakdown | null>(null);

  if (!user) return null;
  const isClient = role === "client";
  const items = isClient ? MOCK_PROVIDERS : MOCK_REQUESTS;

  const ranked = useMemo(() => {
    if (isClient) {
      return [...MOCK_PROVIDERS]
        .map((p) => ({ item: p as Profile, breakdown: computeProviderFit(user, p, weights) }))
        .sort((a, b) => b.breakdown.composite - a.breakdown.composite);
    }
    return [...MOCK_REQUESTS]
      .map((r) => ({ item: r as ServiceRequest, breakdown: computeRequestFit(user, r, weights) }))
      .sort((a, b) => b.breakdown.composite - a.breakdown.composite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, user!.id, weights]);

  const current = ranked[index];
  const next = ranked[index + 1];

  async function swipe(dir: "left" | "right") {
    if (!current || !user) return;
    const nextW = adjustWeights(weights, current.breakdown, dir);
    setWeights(nextW);

    // Optimistic write + queue if offline
    try {
      const swipeRecord = {
        id: crypto.randomUUID(),
        userId: user.id,
        targetId: "userId" in current.item ? current.item.userId : current.item.id,
        targetType: (isClient ? "user" : "request") as "user" | "request",
        swiperRole: role,
        direction: dir,
        fitScore: current.breakdown.composite,
        timestamp: new Date().toISOString(),
        isSynced: online,
      };
      await db().swipes.put(swipeRecord);
      if (!online) {
        await db().queue.put({
          id: crypto.randomUUID(),
          type: "swipe",
          payload: swipeRecord,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn(e);
    }

    if (dir === "right") {
      if (isClient) {
        toast.success("Request sent", {
          description: "We'll let this provider know you're interested.",
        });
      } else {
        toast.success("Your info has been sent to the client", {
          description: "They'll see your profile and contact details.",
        });
      }
    }

    setIndex((i) => i + 1);
  }

  if (!current) {
    return (
      <EmptyState
        title={t("empty")}
        description="You have swiped through everyone in your area."
      />
    );
  }

  return (
    <div className="pt-4">
      <div className="relative mx-auto min-h-[440px] w-full max-w-sm">
        <AnimatePresence>
          {next && (
            <div key={"userId" in next.item ? next.item.userId : next.item.id} className="absolute inset-0">
              <SwipeCard
                behind
                score={next.breakdown.composite}
                onSwipe={() => {}}
                onInfo={() => {}}
              >
                <CardContent item={next.item} isClient={isClient} />
              </SwipeCard>
            </div>
          )}
          <div
            key={"userId" in current.item ? current.item.userId : current.item.id}
            className="absolute inset-0"
          >
            <SwipeCard
              score={current.breakdown.composite}
              onSwipe={swipe}
              onInfo={() => setOpenBreakdown(current.breakdown)}
              onSave={() => setIndex((i) => i + 1)}
            >
              <CardContent item={current.item} isClient={isClient} />
            </SwipeCard>
          </div>
        </AnimatePresence>
      </div>

      <FitScoreBreakdownModal
        breakdown={openBreakdown}
        onClose={() => setOpenBreakdown(null)}
      />
    </div>
  );
}

function CardContent({
  item,
  isClient,
}: {
  item: Profile | ServiceRequest;
  isClient: boolean;
}) {
  if (isClient && "userId" in item) {
    return (
      <div>
        <div
          className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold"
          style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
        >
          {item.name.charAt(0)}
        </div>
        <h3 className="text-lg font-bold">{item.name}</h3>
        <div className="text-sm text-[#1E40AF]">{item.title}</div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-[#64748B]">
          <Meta icon={<MapPin size={12} />}>{item.location}</Meta>
          <Meta icon={<Star size={12} strokeWidth={2.5} />}>
            {item.rating} · {item.reviewCount}
          </Meta>
          <Meta icon={<Clock size={12} />}>{item.availability.replace("_", " ")}</Meta>
        </div>
        {item.bio && (
          <p className="mt-3 line-clamp-3 text-sm text-[#0f172a]">{item.bio}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.skills.map((s) => (
            <span
              key={s}
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-3 text-lg font-bold text-[#1E40AF]">
          {item.price ? formatFCFA(item.price) : "—"}
        </div>
      </div>
    );
  }

  // Provider viewing a client request
  const req = item as ServiceRequest;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-widest text-[#1E40AF]">
        {req.category}
      </div>
      <h3 className="mt-1 text-lg font-bold">{req.title}</h3>
      <p className="mt-2 text-sm text-[#0f172a]">{req.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-[#64748B]">
        <Meta icon={<MapPin size={12} />}>{req.location}</Meta>
        <Meta icon={<Clock size={12} />}>{req.urgency.replace("_", " ")}</Meta>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {req.skills.map((s) => (
          <span
            key={s}
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-3 text-lg font-bold text-[#1E40AF]">
        {formatFCFA(req.budget)}
      </div>
      <div className="mt-1 text-[11px] text-[#64748B]">By {req.clientName}</div>
    </div>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border border-[#E2E8F0] px-2 py-0.5">
      {icon}
      {children}
    </span>
  );
}
