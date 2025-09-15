import React from "react";

function OrderStatusIcon({ status }) {
  const styles = {
    wrapper: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 700,
       padding: "6px 8px",
       borderRadius : '6px',
       fontSize :'11px'
    },
    pending: { color: "rgba(54, 185, 204, 1)", backgroundColor:"rgba(139, 197, 216, 0.1)" },
    processing: { color: "rgba(239, 86, 5, 1)", backgroundColor: "rgba(239, 86, 5, 0.1)" },
    shipping: { color: "rgba(246, 2, 2, 1)", backgroundColor: "rgba(246, 2, 2, 0.1)" },
    completed: { color: "rgba(28, 200, 138, 1)", backgroundColor: "rgba(28, 200, 138, 0.1)" },
    cancelled: { color: "rgba(117, 114, 114, 1)", backgroundColor: "rgba(117, 114, 114, 0.1)" },
  };

  const statusConfig = {
    pending: { icon: "bi bi-clock-history", style: styles.pending },
    processing: { icon: "bi bi-gear", style: styles.processing },
    shipping: { icon: "bi bi-rocket-takeoff-fill", style: styles.shipping },
    completed: { icon: "bi bi-check-circle-fill", style: styles.completed },
    cancelled: { icon: "bi bi-x-circle", style: styles.cancelled },
  };

  const current = statusConfig[status];

  if (!current) return null; // phòng khi status không hợp lệ

  return (
    <span style={{ ...styles.wrapper, ...current.style }}>
      <i className={current.icon}></i>
      <span>{status}</span>
    </span>
  );
}

export default OrderStatusIcon;
