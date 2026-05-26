import React from "react";
import { ORDER_STATUS } from "../config/OrdersStatusConfig";

function OrderStatusIcon({ status, size = 11 }) {
  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 700,
      padding: "6px 8px",
      borderRadius: "6px",
      justifyContent: "center",
      fontSize: size,
    },
  };

  const { stt = status, color, backgroundColor, icon } = ORDER_STATUS[status];
  // console.log(currentStatus)
  // console.log(stt)

  // phòng khi status không hợp lệ
  // if (!currentStatus) return null;

  return (
    <>
      <span
        style={{ ...styles.wrapper, color, backgroundColor }}
        className={icon}
      >
        {stt}
      </span>
    </>
  );
}

export default OrderStatusIcon;

// 124 168 79 187 68 100 79
805