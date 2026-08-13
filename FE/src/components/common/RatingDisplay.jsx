import React from "react";
import styles from "../../assets/styles/RatingDisplay.module.css";

function RatingDisplay({
  value = 0,
  count = 0,
  showCount = true,
  size = "md", // "sm" | "md" | "lg"
}) {
  const containerClass = `
    ${styles.rating}
    ${styles[size]}

  `;

  return (
    <div className={containerClass}>
      <i className="bi bi-star-fill"></i>
      <p>
        <b>{value}</b>
        {showCount && <> ({count})</>}
      </p>
    </div>
  );
}

export default RatingDisplay;
