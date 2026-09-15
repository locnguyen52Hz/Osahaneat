import styles from "../../../assets/styles/PreviousOrdersCard.module.css";
import DateTime from "../../../components/common/DateTime";
import { useModal } from "../../../contexts/ModalContext";
import { formatCurrency } from "../../../util/format";
import OrderAddress from "./OrderAddress";
import OrderDetails from "./OrderDetails";
import StatusBadge from "./StatusBadge";

function PreviousOrdersCard({ order, submitRating, loading }) {
  const { openModal } = useModal();

  return (
    <div className={styles.cardOrder}>
      <div className={styles.header}>
        <h6>
          {order.shopName} - # {order.orderId}
        </h6>
        <StatusBadge status={order.status} />
      </div>
      <div className={styles.time}>
        <DateTime time={order.createdAt} />
      </div>
      <OrderAddress address={order.deliveredTo} border={false} />
      <div className={styles.cost}>
        <p>Total: {formatCurrency(order.totalAmount)} </p>
      </div>
      <div
        onClick={() =>
          openModal(
            <OrderDetails
              key={order.orderId}
              order={order}
              onSubmitRating= {submitRating}
            />,
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
