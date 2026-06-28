import React from "react";
import styles from "../../../assets/styles/OrderSummary.module.css";
import { formatCurrency } from "../../../util/format";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import OrderAddress from "../../orders/components/OrderAddress";
import AddressDisplay from "../../../components/common/AddressDisplay";

function OrderSummary({
  subtotal = 0,
  shippingFee = 0,
  loadingShippingFee,
  onOpenCheckout,
}) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tóm tắt đơn hàng</h3>
      <div className={styles.body}>
        {/* <AddressDisplay address={deliveredTo} /> */}
        <div className={styles.details}>
          <div className={styles.item}>
            <p>Tạm tính</p>
            <p className={styles.cost}>{formatCurrency(subtotal)}</p>
          </div>
          <div className={styles.item}>
            <p>Phí giao hàng</p>
            {loadingShippingFee ? (
              <LoadingSpinner />
            ) : (
              <p className={styles.cost}>{formatCurrency(shippingFee)}</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.summary}>
          <p>Tổng cộng</p>
          {loadingShippingFee ? (
            <LoadingSpinner />
          ) : (
            <b>{formatCurrency(shippingFee + subtotal)}</b>
          )}
        </div>
        {loadingShippingFee ? (
          <LoadingSpinner />
        ) : (
          <button onClick={() => onOpenCheckout()}>
            Xác nhận <i className="bi bi-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderSummary;
