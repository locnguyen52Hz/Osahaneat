export const STATUS_ORDER = ["PENDING", "PROCESSING", "SHIPPING", "COMPLETED"];

export const BUYER_TIMELINE_TEXT = {
  PENDING: {
    current: "Đặt hàng ",
    done: "Đã xác nhận",
  },
  PROCESSING: {
    current: "Đang xử lý",
    done: "Đã đóng gói",
  },
  SHIPPING: {
    current: "Đang giao hàng",
    done: "Đã giao hàng",
  },
  COMPLETED: {
    current: "Đã hoàn thành",
  },
  CANCELLED: {
    current: "Đã hủy",
  },
};

export const MANAGER_TIMELINE_TEXT = {
  PENDING: {
    current: "Chờ xác nhận",
    done: "Đã xác nhận",
    icon: "bi bi-check-lg",
  },
  PROCESSING: {
    current: "Đang chuẩn bị",
    done: "Đã chuẩn bị",
    upcoming: "Chuẩn bị",
    icon: "bi bi-hourglass-split",
  },
  SHIPPING: {
    current: "Đang vận chuyển",
    done: "Đã vận chuyển",
    upcoming: "Giao hàng",
    icon: "bi bi-truck",
  },
  COMPLETED: {
    done: "Đã hoàn thành",
    upcoming: "Hoàn thành",
    icon: "bi bi-geo-alt-fill",
  },
};

export function getTimeline(currentStatus, statusOrder = STATUS_ORDER) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return statusOrder.map((status, index) => ({
    status,
    state:
      index < currentIndex
        ? "done"
        : index === currentIndex
          ? "current"
          : "upcoming",
  }));
}

export function buildTimelineData(currentStatus, statuses) {
  const timeline = getTimeline(currentStatus);

  const statusMap = Object.fromEntries(
    statuses.map((item) => [item.status, item]),
  );

  return {
    isFinished: currentStatus === "COMPLETED",

    items: timeline.map((item) => {
      const statusInfo = statusMap[item.status];

      return {
        status: item.status,
        state: item.state,
        startTime: statusInfo?.startTime ?? null,
        endTime: statusInfo?.endTime ?? null,
        time:
          item.state === "done"
            ? (statusInfo?.endTime ?? null)
            : item.state === "current"
              ? (statusInfo?.startTime ?? null)
              : null,
      };
    }),
  };
}
