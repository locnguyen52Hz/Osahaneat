import React, { useMemo } from "react";
import DateTime from "../../components/common/DateTime";
import styles from "../../assets/styles/ProgressTimeline.module.css";

import { STATUS_TEXT, buildTimelineData, getTimeLine } from "../../util/timeline";
import { timeAgo } from "../../util/format";

function ProgressTimeline({ currentStatus, statuses }) {
  const timelineData = useMemo(
    () => buildTimelineData(currentStatus, statuses),
    [currentStatus, statuses],
  );


  return (
    <div className={styles.timeLineTracks}>
      {timelineData.map((item) => (
        <div
          key={item.status}
          className={styles[item.state]}
        >
          {item.time && item.text && (
            <div className={styles.tooltip}>
              <p>{item.text}</p>

              {item.isCurrent ? (
                timeAgo(item.time)
              ) : (
                <DateTime time={item.time} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressTimeline;
