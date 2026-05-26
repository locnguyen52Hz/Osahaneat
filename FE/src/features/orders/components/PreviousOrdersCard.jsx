import React from "react";
import styles from "../../../assets/styles/PreviousOrdersCard.module.css";
import OrderStatusIcon from "./OrderStatusIcon";
import DateTime from "../../../components/common/DateTime";
import { formatCurrency } from "../../../util/format";
import OrderAddress from "./OrderAddress";
import { useModal } from "../../../contexts/ModalContext";
import OrderDetails from "./OrderDetails";
import Rating from "../../review/Rating";
import Review from "../../review/Review";

function PreviousOrdersCard({ order }) {
  const { openModal } = useModal();
  return (
    <div className={styles.cardOrder}>
      <div className={styles.header}>
        <h6>
          {order.shopName} - # {order.orderId}
        </h6>
        <OrderStatusIcon status={order.status} />
      </div>
      <div className={styles.time}>
        <DateTime time={order.createdAt} />
      </div>
      <OrderAddress address={order.address} border={false} />
      <div className={styles.cost}>
        <p>Total: {formatCurrency(order.totalAmount)} </p>
      </div>
      <div
        onClick={() =>
          openModal(
            <OrderDetails key={order.orderId} orderDetails={order} action={<Review />} />,
            { type: "slide" },
          )
        }
        className={`${styles.orderDetailBtn} ${
          order.status === "CANCELLED" ? styles.cancelled : styles.completed
        }`}
      >
        Details
      </div>
    </div>
  );
}

export default PreviousOrdersCard;
