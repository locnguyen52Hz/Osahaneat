import styles from "../../../assets/styles/OrderCard.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import DateTime from "../../../components/common/DateTime";
import { useModal } from "../../../contexts/ModalContext";
import {
  formatDistance
} from "../../../util/format";
import ProgressTimeline from "../../TimeLine/ProgressTimeline";
import OrderDetails from "./OrderDetails";
import StatusBadge from "./StatusBadge";
import TrackStatus from "./TrackStatus";

function UpcomingOrderCard({ order, updateOrderStatus, handleCancelOrder }) {
  const { openModal } = useModal();
  // console.log(order)
  return (
    <div className={styles.cardOrder}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <p className={shared.titleText}>
          {order.shopName} - #{order.orderId}
        </p>

        <StatusBadge status={order.status} />
      </div>

      {/* Time */}
      <div className={styles.time}>
        <DateTime time={order.createdAt} />
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div>
          <p className={`${shared.paragraphColor} ${shared.small}`}>
            Khoảng cách
          </p>

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
            Chi tiết
          </button>

          <button
            className={styles.trackBtn}
            onClick={() =>
              openModal(<TrackStatus order={order} />, { type: "slide" })
            }
          >
            Theo dõi
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
