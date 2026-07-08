export function FitScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const isStrong = score >= 70;
  const isWeak = score < 40;

  const style = isStrong
    ? { background: "var(--gradient-accent)", color: "var(--color-accent-foreground)" }
    : isWeak
      ? { background: "var(--color-danger-soft)", color: "var(--color-danger)" }
      : { background: "var(--color-brand-soft)", color: "var(--color-brand)" };

  const dims =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : size === "lg"
        ? "px-3 py-1.5 text-sm"
        : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold tabular-nums shadow-sm ${dims}`}
      style={style}
      aria-label={`FitScore ${score} percent`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "currentColor", opacity: 0.7 }}
        aria-hidden
      />
      {score}%
    </span>
  );
}
