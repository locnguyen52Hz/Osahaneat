import React, { useEffect, useState } from "react";
import OrderAddress from "../../components/OrderAddress";
import { formatCurrency } from "../../util/format";
import styles from "../../assets/styles/OrderDetails.module.css";
import shared from "../../assets/styles/Shared.module.css";
import OrderActions from "../../components/OrderActions";
import OrderStatusIcon from "../../components/common/OrderStatusIcon";
import { apiGet, apiPatch } from "../../api/api";
import endpoints from "../../api/endpoints";
import { ORDER_STATUS } from "../../config/OrdersStatusConfig";
import { toast } from "react-toastify";

function OrderDetails({ orderDetails, updateOrderStatus }) {
  const role = localStorage.getItem("role");
  const [details, setDetails] = useState(orderDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDetails(orderDetails);
    setLoading(true);
  }, [orderDetails]);


  useEffect(() => {
    if (!details?.orderID) return;

    const fetchOrderItems = async () => {
      try {
        const res = await apiGet(
          `${endpoints.order.items}?ordersId=${details.orderID}`
        );
        setDetails((prev) => ({
          ...prev,
          foods: res.data.data || [],
        }));
      } catch (err) {
        console.log(err);
        setDetails((prev) => ({
          ...prev,
          foods: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  const handleUpdateStt = async () => {
    try {
      const res = await apiPatch(
        endpoints.order.updateStatus(
          details.orderID,
          ORDER_STATUS[details.status].action
        )
      );

      const { status, orderID } = res.data.data;
      setDetails((prev) => ({ ...prev, status }));
      updateOrderStatus(orderID, status);
      toast.success("Ok");
    } catch (err) {
      console.log(err);
      toast.error("Thất bại");
    }
  };

  const handleCancel = async () => {
    try {
      const res = await apiPatch(
        endpoints.order.updateStatus(details.orderID, "CANCELLED")
      );

      const { status, orderID } = res.data.data;
      setDetails((prev) => ({ ...prev, status }));
      updateOrderStatus(orderID, status);
      toast.success("Hủy thành công");
    } catch (error) {
      console.log(error);
      toast.error("Hủy đơn thất bại");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={shared.h5}>Order Details</h2>

        {details.status && (
          <OrderStatusIcon status={details.status} size={10} />
        )}

        <OrderAddress address={details.address} />
        <h4 className={styles.shopName}>{details.partnerName}</h4>
      </div>

      <div className={styles.details}>
        <div className={styles.list}>
          {loading && <p>Loading...</p>}

          {!loading &&
            (details.foods?.length > 0 ? (
              details.foods.map((food) => (
                <div className={styles.foodItem} key={food.foodId}>
                  <p className={`${styles.quantity}  ${shared.bgLight}`}>
                    {food.quantity}
                  </p>
                  <p className={styles.foodName}>{food.name}</p>
                  <p className={styles.price}>{formatCurrency(food.price)}</p>
                </div>
              ))
            ) : (
              <p>No items</p>
            ))}
        </div>

        <div className={styles.pay}>
          <div>
            <p>Subtotal</p>
            <p>{formatCurrency(details.subtotal)}</p>
          </div>
          <div>
            <p>Delivery fee</p>
            <p>{formatCurrency(details.shippingFee)}</p>
          </div>
          <div>
            <p>Total</p>
            <p>{formatCurrency(details.totalAmount)}</p>
          </div>
        </div>

        {details.note && (
          <div className={styles.note}>
            <h3>
              <u>Note</u>
            </h3>
            <p className={`${shared.paragraph} ${shared.bgLight}`}>
              {details.note}
            </p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {role === "ROLE_SHOP_MANAGER" && (
          <OrderActions
            action={handleUpdateStt}
            label={ORDER_STATUS[details.status].label}
            cancelOrder={handleCancel}
            cancelBtn={
              details.status === "CANCELLED" || details.status === "COMPLETED"
                ? false
                : true
            }
          />
        )}

        {role === "ROLE_BUYER" && (
          <OrderActions
            cancelOrder={handleCancel}
            cancelBtn={details.status === "PENDING"}
          />
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
