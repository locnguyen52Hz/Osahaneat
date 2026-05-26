export const ORDER_STATUS = {
  // all:{},
  PENDING:{
    color: "rgba(54, 185, 204, 1)",
    backgroundColor: "rgba(139, 197, 216, 0.1)",
    icon: "bi bi-clock-history",
    status: "PENDING",
    label: "Confirm Order",
    action: "PROCESSING"
  },
  PROCESSING:{
    color: "rgba(239, 86, 5, 1)",
    backgroundColor: "rgba(239, 86, 5, 0.1)",
    icon: "bi bi-gear",
    status: "PROCESSING",
    label: "Ship Order",
    action: "SHIPPING"
  },
  SHIPPING:{
    color: "rgba(246, 2, 2, 1)",
    backgroundColor: "rgba(246, 2, 2, 0.1)",
    icon: "bi bi-rocket-takeoff-fill",
    status: "SHIPPING",
    label: "Completed",
    action: 'COMPLETED'
  },
  COMPLETED:{
    color: "rgba(28, 200, 138, 1)",
    backgroundColor: "rgba(28, 200, 138, 0.1)",
    icon: "bi bi-check-circle-fill",
    status: "COMPLETED",
    label: null,
  },
  CANCELLED:{
    color: "rgba(117, 114, 114, 1)",
    backgroundColor: "rgba(117, 114, 114, 0.1)",
    icon: "bi bi-x-circle",
    status: "CANCELLED",
    label: null,
  },
  all:null
}

// Trạng thái kế tiếp + label cho nút
export const NEXT_STATUS = {
  PENDING: { next: "PROCESSING", label: "Confirm Order" },
  PROCESSING: { next: "SHIPPING", label: "Ship Order" },
  SHIPPING: { next: "COMPLETED", label: "Mark Completed" },
  COMPLETED: null,
  CANCELLED: null,
};

// Hàm tiện ích
export function getNextStatus(status) {
  return NEXT_STATUS[status] || null;
}
