import type { FitScoreBreakdown, Weights } from "../types";

const FACTOR_KEYS: (keyof Omit<Weights, "userId" | "updatedAt">)[] = [
  "preferences",
  "location",
  "price",
  "rating",
  "availability",
  "profileCompleteness",
  "experience",
];

const BOUNDS: Record<string, [number, number]> = {
  preferences: [0.1, 0.4],
  location: [0.05, 0.35],
  price: [0.05, 0.3],
  rating: [0.05, 0.3],
  availability: [0.05, 0.25],
  profileCompleteness: [0.05, 0.25],
  experience: [0.05, 0.25],
};

/**
 * Feedback loop: adjust weights based on swipe.
 * Right swipe (+2%) reinforces factors that scored high on the target.
 * Left swipe (-1%) softens them. Normalized to sum=1.
 */
export function adjustWeights(
  weights: Weights,
  breakdown: FitScoreBreakdown,
  direction: "left" | "right",
): Weights {
  const delta = direction === "right" ? 0.02 : -0.01;
  const next: Weights = { ...weights, updatedAt: new Date().toISOString() };

  for (const key of FACTOR_KEYS) {
    const factorScore = breakdown[key];
    // Only nudge factors that were meaningfully present (>0.5) on the target
    if (factorScore >= 0.5) {
      const [min, max] = BOUNDS[key];
      next[key] = Math.max(min, Math.min(max, next[key] + delta));
    }
  }

  const total = FACTOR_KEYS.reduce((s, k) => s + next[k], 0);
  if (total > 0) {
    for (const key of FACTOR_KEYS) next[key] = next[key] / total;
  }
  return next;
}
