// utils/orderTimeline.js

export const STATUS_ORDER = ["PENDING", "PROCESSING", "SHIPPING"];

export const STATUS_TEXT = {
  PENDING: {
    current: "Ordered on",
    done: "Order confirmed",
  },

  PROCESSING: {
    current: "Order preparing",
    done: "Order packed",
  },

  SHIPPING: {
    current: "Departed ",
  },
};

export function getTimeLine(currentStatus) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return STATUS_ORDER.map((status, index) => ({
    status,

    state:
      index < currentIndex
        ? "done"
        : index === currentIndex
          ? "current"
          : "upcoming",
  }));
}

export function buildTimelineData(currentStatus, statuses, options = {}) {
  const { hideEmpty = false } = options;

  const timeLine = getTimeLine(currentStatus);

  const statusMap = Object.fromEntries(statuses.map((s) => [s.status, s]));

  const data = timeLine.map((item) => {
    const statusInfo = statusMap[item.status];

    const time =
      item.state === "current"
        ? statusInfo?.startTime
        : item.state === "done"
          ? statusInfo?.endTime
          : null;

    const text = STATUS_TEXT[item.status]?.[item.state];

    return {
      status: item.status,
      state: item.state,
      text,
      time,
      isCurrent: item.state === "current",
    };
  });

  return hideEmpty ? data.filter((item) => item.text) : data;
}
