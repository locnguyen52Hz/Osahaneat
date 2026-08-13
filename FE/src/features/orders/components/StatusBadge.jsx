import React from "react";
import { ORDER_STATUS } from "../config/OrdersStatusConfig";

function StatusBadge({
  status,
  size = "11px",
  showIcon = true,
  fullWidth = false,
}) {
  const config = ORDER_STATUS[status];

  if (!config) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
        borderRadius: "8px",
        width: fullWidth ? "100%" : "fit-content",
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontSize: size,
      }}
    >
      {showIcon && <i className={config.icon} />}
      <span>{config.status}</span>
    </span>
  );
}

export default StatusBadge;
