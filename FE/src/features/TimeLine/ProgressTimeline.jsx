import { useMemo } from "react";
import styles from "../../assets/styles/ProgressTimeline.module.css";
import DateTime from "../../components/common/DateTime";

import { timeAgo } from "../../util/format";
import { BUYER_TIMELINE_TEXT, buildTimelineData } from "../../util/timeline";

function ProgressTimeline({ currentStatus, statuses }) {
  // console.log(statuses);
  const timelineData = useMemo(
    () =>
      buildTimelineData(currentStatus, statuses).items.filter(
        (item) => item.status !== "COMPLETED",
      ),
    [currentStatus, statuses],
  );

  console.log(timelineData.map((item) => item));

  return (
    <div className={styles.timeLineTracks}>
      {timelineData.map((item) => (
        <div key={item.status} className={styles[item.state]}>
          {item.time && (
            <div className={styles.tooltip}>
              <p>{BUYER_TIMELINE_TEXT[item.status][item.state]}</p>

              {item.state === "current" ? (
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
