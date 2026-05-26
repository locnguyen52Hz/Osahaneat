import React from "react";
import DateTime from "../../components/common/DateTime";
import { formatTime, timeAgo } from "../../util/format";
import styles from "../../assets/styles/TimelineItem.module.css";

function TimelineItem({ text, time, state, icon, showRelativeTime = false }) {
  return (
    <div className={styles.item}>
      
      <div className={`${styles.iconWrapper} ${styles[state]}`}>
        {state === "done" && <i className="bi bi-check-square"></i>}
        {state === "current" && <i className="bi bi-hourglass-split"></i>}
        {icon}
      </div>

      <div className={styles.content}>
        <p className={styles.text}>{text}</p>
        {state === "current" && <p> {timeAgo(time)}</p>}
        {state === "done" && <p>{formatTime(time)}</p>}
      </div>
    </div>
  );
}

export default TimelineItem;
