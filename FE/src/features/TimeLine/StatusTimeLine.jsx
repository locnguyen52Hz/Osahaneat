import React, { useMemo } from "react";
import { buildTimelineData, BUYER_TIMELINE_TEXT } from "../../util/timeline";
import TimelineItem from "./TimelineItem";

function StatusTimeline({ currentStatus, statuses }) {
  const timelineData = useMemo(
    () => buildTimelineData(currentStatus, statuses),
    [currentStatus, statuses],
  );
  return (
    <>
      {timelineData.items
        .filter((item) => item.state !== "upcoming")
        .map((item) => (
          <TimelineItem
            key={item.status}
            text={BUYER_TIMELINE_TEXT[item.status][item.state]}
            time={item.time}
            state={currentStatus === "COMPLETED" ? "done" : item.state}
          />
        ))}
    </>
  );
}

export default StatusTimeline;
