import React from "react";
import styles from "../../assets/styles/IconBadge.module.css";
function IconBadge({
  icon,
  count = 0,
  showDot = true,
  backgroundColor,
  color = 'white',
  iconSize = 18,
  countSize = 10,
}) {
  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <div className={styles.icon} style={{ color, fontSize: iconSize }}>
        {icon}
      </div>

      {!!count && (
        <p className={styles.count} style={{ backgroundColor, color }}>
          {count}
        </p>
      )}

      {showDot && (
        <span className={styles.dot}>
          <i className="bi bi-dot"></i>
        </span>
      )}
    </div>
  );
}

export default IconBadge;
