import React, { useState } from "react";

const MAX_STARS = 5;

function Rating({ value = 0, onChange, size = 24, disabled = false }) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = hoverValue ?? value;

  const handleClick = (index) => {
    if (disabled) return;
    onChange?.(index);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {[...Array(MAX_STARS)].map((_, i) => {
        const starIndex = i + 1;

        return (
          <i
            className="bi bi-star-fill"
            key={starIndex}
            onMouseEnter={() => setHoverValue(starIndex)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(starIndex)}
            style={{
              fontSize: size,
              color: starIndex <= displayValue ? "#facc15" : "#d1d5db",
              transition: "color 0.2s",
            }}
          ></i>
        );
      })}
    </div>
  );
}

export default Rating;
