import React from "react";
import styles from "../assets/styles/DashboardSummary.module.css";

function DashboardSummary({ title, count, backGroupColor1, backGroupColor2, url }) {
  return (
    <div className={styles.cardContainer}>
      <div
        style={{
          background: `linear-gradient(45deg, ${backGroupColor1}, ${backGroupColor2})`,
        }}
        className={styles.cardItem}
      >
        <div className={styles.cardBody}>
          {count} {title}!
        </div>
        <div className={styles.cardFooter}>
          <p>View Details</p>
          <i className="bi bi-chevron-compact-right"></i>
        </div>
      </div>
    </div>
  );
}

export default DashboardSummary;
