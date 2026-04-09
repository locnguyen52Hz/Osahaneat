import React from "react";
import { ORDER_STATUS } from "../../config/OrdersStatusConfig";

function OrderStatusIcon({ status , size }) {
  
  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 700,
      padding: "6px 8px",
      borderRadius: "6px",
    
      fontSize: (size ? `${size}px` : '11px')
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
