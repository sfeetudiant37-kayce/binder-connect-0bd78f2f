import type { FitScoreBreakdown, Profile, ServiceRequest, User, Weights } from "../types";

export const DEFAULT_WEIGHTS: Omit<Weights, "userId" | "updatedAt"> = {
  preferences: 0.25,
  location: 0.15,
  price: 0.15,
  rating: 0.15,
  availability: 0.1,
  profileCompleteness: 0.1,
  experience: 0.1,
};

/** Jaccard similarity between two string sets (case-insensitive). */
export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  if (A.size === 0 && B.size === 0) return 0.3;
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  return uni === 0 ? 0.3 : inter / uni;
}

function availabilityScore(a?: string): number {
  switch (a) {
    case "immediate":
      return 1;
    case "this_week":
      return 0.7;
    case "flexible":
      return 0.5;
    default:
      return 0.3;
  }
}

/** Compute fit score for a client (user) evaluating a provider (target profile). */
export function computeProviderFit(
  user: User,
  target: Profile,
  weights: Weights,
  userPrice = 100_000,
): FitScoreBreakdown {
  const preferences = jaccard(user.preferences, target.skills);
  const location = user.location === target.location ? 1 : 0.3;
  const priceDiff = Math.abs(userPrice - (target.price ?? 100_000));
  const maxPrice = Math.max(userPrice, target.price ?? 100_000, 1);
  const price = 1 - priceDiff / maxPrice;
  const rating = target.rating / 5;
  const availability = availabilityScore(target.availability);
  const profileCompleteness = target.profileCompletion / 100;
  const experience = Math.min((target.experience ?? 0) / 10, 1);

  const raw =
    weights.preferences * preferences +
    weights.location * location +
    weights.price * price +
    weights.rating * rating +
    weights.availability * availability +
    weights.profileCompleteness * profileCompleteness +
    weights.experience * experience;

  return {
    preferences,
    location,
    price,
    rating,
    availability,
    profileCompleteness,
    experience,
    composite: Math.round(raw * 100),
  };
}

/** Compute fit score for a provider evaluating a client service request. */
export function computeRequestFit(
  user: User,
  target: ServiceRequest,
  weights: Weights,
  userPrice = 100_000,
): FitScoreBreakdown {
  const preferences = jaccard(user.preferences, target.skills);
  const location = user.location === target.location ? 1 : 0.3;
  const priceDiff = Math.abs(userPrice - target.budget);
  const maxPrice = Math.max(userPrice, target.budget, 1);
  const price = 1 - priceDiff / maxPrice;
  const rating = 0.7; // client rating placeholder
  const availability =
    target.urgency === "urgent" ? 1 : target.urgency === "this_week" ? 0.7 : 0.5;
  const profileCompleteness = 0.8;
  const experience = 0.5;

  const raw =
    weights.preferences * preferences +
    weights.location * location +
    weights.price * price +
    weights.rating * rating +
    weights.availability * availability +
    weights.profileCompleteness * profileCompleteness +
    weights.experience * experience;

  return {
    preferences,
    location,
    price,
    rating,
    availability,
    profileCompleteness,
    experience,
    composite: Math.round(raw * 100),
  };
}
