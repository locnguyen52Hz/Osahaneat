import React, { useMemo } from "react";
import DateTime from "../../components/common/DateTime";
import styles from "../../assets/styles/ProgressTimeline.module.css";

import { BUYER_TIMELINE_TEXT, buildTimelineData } from "../../util/timeline";
import { timeAgo } from "../../util/format";

function ProgressTimeline({ currentStatus, statuses }) {
  const timelineData = useMemo(
    () =>
      buildTimelineData(currentStatus, statuses).items.filter(
        (item) => item.status !== "COMPLETED",
      ),
    [currentStatus, statuses],
  );

  // console.log(timelineData)

  return (
    <div className={styles.timeLineTracks}>
      {timelineData.map((item) => (
        <div key={item.status} className={styles[item.state]}>
          {item.time && (
            <div className={styles.tooltip}>
              <p>{BUYER_TIMELINE_TEXT[item.status][item.state]}</p>

              {item.isCurrent ? (
                timeAgo(item.startTime)
              ) : (
                <DateTime time={item.endTime} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressTimeline;
