import React from "react";
import OrderAddress from "./OrderAddress";
import { formatCurrency } from "../../../util/format";
import styles from "../../../assets/styles/OrderDetails.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import OrderStatusIcon from "./OrderStatusIcon";
import FoodItems from "../../foods/components/FoodItems";

function OrderDetailsView({
  order,
  foods,
  loadingItems,
  footer,
}) {
  if (!order) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={shared.h5}>Order Details</h2>

        {order.orderId && <p>#{order.orderId}</p>}

        {order.status && (
          <OrderStatusIcon status={order.status} size={10} />
        )}

        <OrderAddress address={order.address} />
        <h4 className={styles.shopName}>{order.shopName}</h4>
      </div>

      {/* DETAILS */}
      <div className={styles.details}>
        <div className={styles.list}>
          {loadingItems && <p>Loading...</p>}
          {foods?.length > 0 && <FoodItems listItem={foods} />}
        </div>

        <div className={styles.pay}>
          <div>
            <p>Subtotal</p>
            <p>{formatCurrency(order.subtotal)}</p>
          </div>
          <div>
            <p>Delivery fee</p>
            <p>{formatCurrency(order.shippingFee)}</p>
          </div>
          <div>
            <p>Total</p>
            <p>{formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        {order.note && (
          <div className={styles.note}>
            <h3>
              <u>Note</u>
            </h3>
            <p className={`${shared.paragraph} ${shared.bgLight}`}>
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* FOOTER (inject từ ngoài) */}
      <div className={styles.footer}>{footer}</div>
    </div>
  );
}

export default OrderDetailsView;