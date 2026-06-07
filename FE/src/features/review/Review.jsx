import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import shared from "../../assets/styles/Shared.module.css";
import styles from "../../assets/styles/Review.module.css";

function Review({ onSubmit, rating, loading }) {
  const [stars, setStars] = useState(rating);

  useEffect(() => {
    setStars(rating);
  }, [rating]);

  const hasRated = rating != null;

  const handleSubmit = () => {
    if (!stars || hasRated || loading) return;
    onSubmit(stars);
  };

  const handleSetStars = (star) => {
    console.log(star);
    if (hasRated || loading) return;
    setStars(star);
  };

  return (
    <div className={styles.container}>
      <Rating value={stars} onChange={handleSetStars} disabled={hasRated} />

      <div className={styles.submitBtn}>
        <button
          className={`${!stars || hasRated || loading ? styles.disabled : shared.submitBtn}`}
          onClick={handleSubmit}
          disabled={!stars || hasRated || loading}
        >
          {loading ? "Submitting..." : hasRated ? "Rated" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Review;
