import React from "react";
import styles from "../../assets/styles/RatingDisplay.module.css";

function RatingDisplay({
  value = 0,
  count = 0,
  showCount = true,
  size = "md", // "sm" | "md" | "lg"
  className = "",
}) {
  const containerClass = `
    ${styles.rating}
    ${styles[size]}
    ${className}
  `;

  return (
    <div className={containerClass}>
      <i className="bi bi-star-fill"></i>
      <p>
        <b>{value}</b>
        {showCount && <> - {count} Ratings</>}
      </p>
    </div>
  );
}

export default RatingDisplay;