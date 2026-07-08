import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Check, Info, Star, X as XIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { FitScoreBadge } from "./FitScoreBadge";
import { useApp } from "@/lib/context/AppContext";

interface SwipeCardProps {
  children: ReactNode;
  score: number;
  onSwipe: (dir: "left" | "right") => void;
  onInfo: () => void;
  onSave?: () => void;
  isMutual?: boolean;
  behind?: boolean;
}

export function SwipeCard({
  children,
  score,
  onSwipe,
  onInfo,
  onSave,
  isMutual,
  behind,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const [gone, setGone] = useState<null | "left" | "right">(null);
  const { t } = useApp();

  function handleEnd(_: unknown, info: PanInfo) {
    const power = info.offset.x + info.velocity.x * 0.3;
    if (power > 140) {
      setGone("right");
      setTimeout(() => onSwipe("right"), 180);
    } else if (power < -140) {
      setGone("left");
      setTimeout(() => onSwipe("left"), 180);
    }
  }

  function trigger(dir: "left" | "right") {
    setGone(dir);
    setTimeout(() => onSwipe(dir), 180);
  }

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        drag={behind ? false : "x"}
        dragElastic={0.6}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleEnd}
        style={{ x, rotate, touchAction: "pan-y" }}
        animate={
          gone
            ? {
                x: gone === "right" ? 500 : -500,
                opacity: 0,
                rotate: gone === "right" ? 25 : -25,
              }
            : behind
            ? { scale: 0.94, y: 12, opacity: 0.6 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="card-elevated relative w-full max-w-sm cursor-grab select-none p-5 active:cursor-grabbing"
      >
        {isMutual && (
          <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#1E40AF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {t("mutualMatch")}
          </div>
        )}

        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">{/* header slot lives in children */}</div>
          <FitScoreBadge score={score} size="lg" />
        </div>

        {children}

        {/* Drag overlays */}
        <motion.div
          style={{ opacity: rightOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border-4"
        >
          <div
            className="rounded-lg border-4 px-4 py-1 text-xl font-bold tracking-widest"
            style={{ borderColor: "#1E40AF", color: "#1E40AF" }}
          >
            {t("interested").toUpperCase()}
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: leftOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border-4"
        >
          <div
            className="rounded-lg border-4 px-4 py-1 text-xl font-bold tracking-widest"
            style={{ borderColor: "#DC2626", color: "#DC2626" }}
          >
            {t("pass").toUpperCase()}
          </div>
        </motion.div>
      </motion.div>

      {!behind && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <ActionButton onClick={() => trigger("left")} label={t("pass")} tone="danger">
            <XIcon size={24} />
          </ActionButton>
          <ActionButton onClick={onInfo} label={t("details")} tone="ghost">
            <Info size={20} />
          </ActionButton>
          <ActionButton onClick={onSave} label={t("saveForLater")} tone="ghost">
            <Star size={20} />
          </ActionButton>
          <ActionButton
            onClick={() => trigger("right")}
            label={t("interested")}
            tone="primary"
          >
            <Check size={24} />
          </ActionButton>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  label,
  tone,
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  tone: "primary" | "danger" | "ghost";
}) {
  const styles =
    tone === "primary"
      ? { backgroundColor: "#1E40AF", color: "#fff" }
      : tone === "danger"
      ? { backgroundColor: "#DC2626", color: "#fff" }
      : { backgroundColor: "#fff", color: "#1E40AF", borderColor: "#1E40AF" };
  const size = tone === "ghost" ? "h-11 w-11 border" : "h-14 w-14 shadow-md";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center rounded-full ${size}`}
      style={styles}
    >
      {children}
    </button>
  );
}
