import React, { useState } from "react";
import styles from "../../assets/styles/Rating.module.css";
import { RatingProps } from "../../types/order/RatingProps";

function Rating({ value = 0, onChange, disabled = false }: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const displayValue = hover ?? value;

  const handleMouseEnter = (index: number) => {
    if (disabled) return;
    setHover(index);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHover(null);
  };

  const handleClick = (index: number) => {
    console.log(index);
    if (disabled) return;
    onChange(index);
  };

  return (
    <div className={`${styles.starList} ${disabled ? styles.disabled : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          onClick={() => handleClick(star)}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => handleMouseEnter(star)}
          className={` bi bi-star-fill ${styles.star} ${star <= displayValue ? styles.active : ""}`}
        ></i>
      ))}
    </div>
  );
}

export default Rating;
