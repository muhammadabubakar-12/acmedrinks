import { Star } from "lucide-react";
import React from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: number;
}

export default function StarRatingInput({
  value,
  onChange,
  disabled = false,
  size = 28,
}: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className="focus:outline-none"
        >
          <Star
            className={
              star <= value
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
            width={size}
            height={size}
            strokeWidth={1.5}
            fill={star <= value ? "#facc15" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
