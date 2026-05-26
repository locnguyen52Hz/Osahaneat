import React, { useState } from "react";
import Rating from "./Rating";
import shared from "../../assets/styles/Shared.module.css";
import styles from "../../assets/styles/Review.module.css";

function Review({ onSubmit }) {
  const [stars, setStars] = useState(0);

  const handleSubmit = () => {
    if (stars === 0) return;
    onSubmit(stars);
    console.log(onSubmit?.(stars));
  };

  return (
    <div className={styles.container}>
      <Rating value={stars} onChange={setStars} />

      <div className={styles.submitBtn}>
        <button
          className={`${stars === 0 ? styles.disabled : shared.submitBtn} `}
          onClick={handleSubmit}
          disabled={stars === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Review;
