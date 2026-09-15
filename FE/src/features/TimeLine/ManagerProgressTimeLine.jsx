import React from "react";
import useOrderTimeline from "../orders/hooks/useOrderTimeline";
import { useParams } from "react-router-dom";
import { buildTimelineData, MANAGER_TIMELINE_TEXT } from "../../util/timeline";
import ManagerTimelineItem from "./ManagerTimelineItem";
import styles from "../../assets/styles/ManagerProgressTimeLine.module.css";
import DateTime from "../../components/common/DateTime";

function ManagerProgressTimeLine({ loadingTimeLine, timeline }) {
  const { id } = useParams();
  // console.log(timeline);
  const timelineData = buildTimelineData(
    timeline.currentStatus,
    timeline.statuses,
  );
  const isFinished = timeline.currentStatus === "COMPLETED";
  return (
    <div className={styles.container}>
      {timeline.currentStatus === "CANCELLED" ? (
        <div className={styles.cancel}>
          <p>Đơn hàng đã hủy </p>
          <DateTime
            time={timeline.statuses[timeline.statuses.length - 1].startTime}
          />
        </div>
      ) : (
        <div className={styles.timeline}>
          {!loadingTimeLine && (
            <>
              {timelineData.items.map((item) => (
                <ManagerTimelineItem
                  isFinished={isFinished}
                  key={item.status}
                  item={item}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ManagerProgressTimeLine;
