import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../../assets/styles/ManagerOrderDetails.module.css";
import CustomerInfo from "../../../components/CustomerInfo";
import DeliveryLocation from "../../../components/DeliveryLocation";
import DateTime from "../../../components/common/DateTime";
import ManagerProgressTimeLine from "../../TimeLine/ManagerProgressTimeLine";
import StatusTimeline from "../../TimeLine/StatusTimeLine";
import ManagerOrderSummary from "../../orders/components/ManagerOrderSummary";
import OrderActions from "../../orders/components/OrderActions";
import ProductTable from "../../orders/components/ProductTable";
import StatusBadge from "../../orders/components/StatusBadge";
import { NEXT_STATUS } from "../../orders/config/OrdersStatusConfig";
import useOrderDetails from "../../orders/hooks/useOrderDetails";
import useOrderItems from "../../orders/hooks/useOrderItems";
import useOrderTimeline from "../../orders/hooks/useOrderTimeline";
import { updateOrderStatus } from "../../orders/service/orderApi";

function ManagerOrderDetails() {
  const { id } = useParams();
  const orderId = Number(id);

  const { loading, order, fectchOrderDetails } = useOrderDetails(orderId);
  const { loadingTimeLine, timeline, fetchOrderTimeline } =
    useOrderTimeline(id);

  const { items } = useOrderItems(id);

  const nextStatus = order ? NEXT_STATUS[order.status] : null;

  const handleCancel = async () => {
    try {
      await updateOrderStatus(orderId, "CANCELLED");
      toast.success("Hủy thành công");
      await fectchOrderDetails();
      await fetchOrderTimeline();
    } catch (error) {
      console.log(error);
      toast.error("Hủy thất bại");
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (nextStatus) {
        await updateOrderStatus(orderId, nextStatus.next);
        toast.success("Cập nhật thành công");
        await fectchOrderDetails();
        await fetchOrderTimeline();
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại");
    }
  };

  if (!order) return;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <h3 className={styles.orderId}>
              {!loading && (
                <>
                  Đơn hàng #{order.orderId}
                  <StatusBadge status={order.status} />
                </>
              )}
            </h3>

            <DateTime time={order.createdAt} color={"#64748B"} />
          </div>

          {nextStatus && (
            <div className={styles.actions}>
              <OrderActions
                label={"Hủy đơn"}
                border={"1px red solid"}
                backGroundColor={"white"}
                icon={"bi bi-x-circle"}
                color={"red"}
                action={handleCancel}
              />
              <OrderActions
                label={nextStatus.label}
                icon={"bi bi-check-circle"}
                backGroundColor={"black"}
                color={"white"}
                action={handleUpdateStatus}
              />
            </div>
          )}
        </div>

        <div className={styles.timeline}>
          <ManagerProgressTimeLine
            loadingTimeLine={loadingTimeLine}
            timeline={timeline}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.table}>
            <div className={styles.productTable}>
              <ProductTable orderItems={items} />
            </div>

            <div className={styles.summary}>
              <ManagerOrderSummary
                shippingFee={order.shippingFee}
                subtotal={order.subtotal}
                totalAmount={order.totalAmount}
              />
            </div>
          </div>
          <div className={styles.customer}>
            <CustomerInfo
              fullName={order.partnerName}
              email={order.partnerEmail}
              deliveredTo={order.deliveredTo}
            />
            {!loading && (
              <>
                <div className={styles.deliveryLocation}>
                  <DeliveryLocation
                    customerName={order.partnerName}
                    fromLat={order.latitude}
                    fromLong={order.longitude}
                    toLat={order.partnerLatitude}
                    toLong={order.partnerLongitude}
                  />
                </div>

                {order.status !== "CANCELLED" && (
                  <div className={styles.history}>
                    <p className={styles.label}>Lịch sử thao tác</p>
                    <StatusTimeline
                      currentStatus={timeline.currentStatus}
                      statuses={timeline.statuses}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerOrderDetails;
