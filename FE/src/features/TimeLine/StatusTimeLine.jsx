import React, { useMemo } from "react";
import { buildTimelineData } from "../../util/timeline";
import TimelineItem from "./TimelineItem";

function StatusTimeline({ currentStatus, statuses }) {
  const timelineData = useMemo(
    () => buildTimelineData(currentStatus, statuses, { hideEmpty: true }),
    [currentStatus, statuses],
  );


  return (
    <>
      {timelineData.map((item) => (
        <TimelineItem
          key={item.status}
          text={item.text}
          time={item.time}
          state={item.state}
        />
      ))}
    </>
  );
}

export default StatusTimeline;
