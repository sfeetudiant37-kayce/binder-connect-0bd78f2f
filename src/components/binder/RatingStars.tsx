import { Star } from "lucide-react";
import { useState } from "react";

export function RatingStars({
  value,
  onChange,
  size = 24,
  readOnly,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;
  return (
    <div className="inline-flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            role="radio"
            aria-checked={n === Math.round(value)}
            aria-label={`${n} stars`}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange?.(n)}
            className="p-0.5"
          >
            <Star
              size={size}
              strokeWidth={2}
              style={{
                color: filled ? "#1E40AF" : "#E2E8F0",
                fill: filled ? "#1E40AF" : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
