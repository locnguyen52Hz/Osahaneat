import React from "react";
import { useParams } from "react-router-dom";
import styles from "../../../assets/styles/ManagerOrderDetails.module.css";
import ProductTable from "../../orders/components/ProductTable";
import ManagerOrderSummary from "../../orders/components/ManagerOrderSummary";
import CustomerInfo from "../../../components/CustomerInfo";
import { calcCartTotal } from "../../../util/cart";
import StatusBadge from "../../orders/components/StatusBadge";
import OrderActions from "../../orders/components/OrderActions";
import { NEXT_STATUS } from "../../orders/config/OrdersStatusConfig";
import DateTime from "../../../components/common/DateTime";
import ManagerProgressTimeLine from "../../TimeLine/ManagerProgressTimeLine";
import useOrderDetails from "../../orders/hooks/useOrderDetails";
import DeliveryLocation from "../../../components/DeliveryLocation";
import useOrderTimeline from "../../orders/hooks/useOrderTimeline";
import StatusTimeline from "../../TimeLine/StatusTimeLine";
import useOrderActions from "../../orders/hooks/useOrderActions";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../orders/service/OrderServices";

const MOCK = {
  orderId: 1,
  shippingFee: 15000,
  deliveredTo: "Ngõ Tiểu học Phượng Cách, Xã Quốc Oai, Hà Nội, 01234, Việt Nam",
  status: "PENDING",
  created_at: "2026-05-22 05:15:20.030466",
  subtotal: 12000,
  totalAmount: 2312323,
  totalQuantity: 4,
  status: "PENDING",
  orderItems: [
    {
      foodId: 1,
      foodName:
        "Ngõ Tiểu học Phượng Cách, Xã Quốc Oai, Hà Nội, 01234, Việt Nam",
      quantity: 1,
      price: 3500000,
    },
    {
      foodId: 2,
      foodName: "xyz",
      quantity: 3,
      price: 120000,
    },
  ],
};

const CUSTOMER_INFO = {
  fullName: "Nguyễn Lâm Anh",
  email: "lamanh.nguyen@email.com",
};

function ManagerOrderDetails() {
  const { id } = useParams();

  const { loading, order, fectchOrderDetails, setOrder } = useOrderDetails(id);
  const { loadingTimeLine, timeline, fetchOrderTimeline } =
    useOrderTimeline(id);
  // const { updateStatus, cancelOrder } = useOrderActions(setOrder);
  // console.log(NEXT_STATUS[order.status]);

  const nextStatus = NEXT_STATUS[order.status];
  console.log(nextStatus);

  const handleCancel = async () => {
    try {
      await updateOrderStatus(id, "CANCELLED");
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
      await updateOrderStatus(id, nextStatus.next);
      toast.success("Cập nhật thành công");
      await fectchOrderDetails();
      await fetchOrderTimeline();
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <h3 className={styles.orderId}>
              {!loading && (
                <>
                  Đơn hàng #{order.orderId}{" "}
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
              <ProductTable orderItems={MOCK.orderItems} />
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
