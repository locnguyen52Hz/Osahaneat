import React, { useMemo } from "react";
import OrderStatusIcon from "./OrderStatusIcon";
import DateTime from "../../../components/common/DateTime";
import shared from "../../../assets/styles/Shared.module.css";
import { useModal } from "../../../contexts/ModalContext";
import OrderDetails from "./OrderDetails";
import styles from "../../../assets/styles/OrderCard.module.css";
import { formatDateTime, formatDistance } from "../../../util/format";
import ProgressTimeline from "../../TimeLine/ProgressTimeline";
import OrderAddress from "./OrderAddress";
import FoodItems from "../../foods/components/FoodItems";
import TrackStatus from "./TrackStatus";
import OrderActions from "./OrderActions";


function UpcomingOrderCard({ order, updateOrderStatus, handleCancelOrder }) {
  const { openModal } = useModal();
  console.log(order);
  return (
    <div className={styles.cardOrder}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <p className={shared.titleText}>
          {order.shopName} - #{order.orderId}
        </p>

        <OrderStatusIcon status={order.status} />
      </div>

      {/* Time */}
      <div className={styles.time}>
        <DateTime time={order.createdAt} />
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div>
          <p className={`${shared.paragraphColor} ${shared.small}`}>Distance</p>

          <h2>{formatDistance(order.distance)} km</h2>
        </div>
        <div className={styles.btns}>
          <button
            className={styles.detailBtn}
            onClick={() =>
              openModal(
                <OrderDetails
                  key={order.orderId}
                  order={order}
                  action={() => handleCancelOrder(order.orderId)}
                  actionsLabel={"Cancel order"}
                />,
                { type: "slide" },
              )
            }
          >
            Details
          </button>

          <button
            className={styles.trackBtn}
            onClick={() =>
              openModal(<TrackStatus order={order} />, { type: "slide" })
            }
          >
            Track
          </button>
        </div>
      </div>

      {/* Timeline */}

      <ProgressTimeline
        currentStatus={order.status}
        statuses={order.statuses}
      />
    </div>
  );
}

export default UpcomingOrderCard;
