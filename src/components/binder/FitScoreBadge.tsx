export function FitScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  // Color-code by tier but stay inside the blue/red palette
  const isStrong = score >= 70;
  const isWeak = score < 40;
  const bg = isStrong ? "#1E40AF" : isWeak ? "#FEE2E2" : "#DBEAFE";
  const fg = isStrong ? "#FFFFFF" : isWeak ? "#DC2626" : "#1E3A8A";

  const dims =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : size === "lg"
      ? "px-3 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold tabular-nums ${dims}`}
      style={{ backgroundColor: bg, color: fg }}
      aria-label={`FitScore ${score} percent`}
    >
      {score}%
    </span>
  );
}
