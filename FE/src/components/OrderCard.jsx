import React from "react";
import OrderStatusIcon from "./common/OrderStatusIcon";
import DateTime from "./common/DateTime";
import shared from "../assets/styles/Shared.module.css";
import { useModal } from "../contexts/ModalContext";
import OrderDetails from "../pages/Common/OrderDetails";
import styles from "../assets/styles/OrderCard.module.css";
import { formatDistance } from "../util/format";

function OrderCard({ order, updateOrderStatus }) {
  const { openModal } = useModal();

  return (
    <>
      <div className={styles.cardOrder}>
        {/* card header */}
        <div className={styles.cardHeader}>
          <p className={`${shared.titleText} `}>
            {order.partnerName} - #{order.orderID}
          </p>
          <OrderStatusIcon status={order.status} />
        </div>
        <div className={styles.time}>
          <DateTime time={order.time} />
        </div>
        {/* Card body */}
        <div className={styles.cardBody}>
          <i className="bi bi-map"></i>
          <div className="distance">
            <p className={`${shared.paragraphColor} ${shared.small}`}>
              Distance
            </p>
            <h2>{formatDistance(order.distance)} km</h2>
          </div>
          <button
            onClick={() =>
              openModal(
                <OrderDetails
                  key={order.orderID}
                  orderDetails={order}
                  updateOrderStatus={updateOrderStatus}
                />,
                { type: "slide" }
              )
            }
            className={styles.orderDetailBtn}
          >
            Details
          </button>
          {/* <div></div> */}
        </div>
      </div>
    </>
  );
}

export default OrderCard;
