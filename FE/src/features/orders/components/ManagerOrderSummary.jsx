import React from "react";
import styles from "../../../assets/styles/ManagerOrderSummary.module.css";
function ManagerOrderSummary({ subtotal, shippingFee, totalAmount }) {
  return (
    <div className={styles.orderSummary}>
      <div className={styles.label}>
        <p>Tạm tính:</p>
        <p>Phí vận chuyển:</p>
        <p>Tổng cộng:</p>
      </div>
      <div className={styles.amount}>
        <p>{subtotal}</p>
        <p>{shippingFee}</p>
        <p>{totalAmount}</p>
      </div>
    </div>
  );
}

export default ManagerOrderSummary;
