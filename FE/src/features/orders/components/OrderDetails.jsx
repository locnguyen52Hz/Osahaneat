import React, { Children, useEffect, useState } from "react";
import OrderAddress from "./OrderAddress";
import { formatCurrency } from "../../../util/format";
import styles from "../../../assets/styles/OrderDetails.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import OrderActions from "./OrderActions";
import OrderStatusIcon from "./OrderStatusIcon";
import { apiGet, apiPatch } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { ORDER_STATUS } from "../config/OrdersStatusConfig";
import { toast } from "react-toastify";
import { getOrderItems } from "../service/OrderServices";
import FoodItems from "../../foods/components/FoodItems";
import { useModal } from "../../../contexts/ModalContext";

function OrderDetails({
  orderDetails,
  updateOrderStatus,
  handleCancelOrder,
  children,
  action,
}) {
  const [orderDetailsWithFoods, setOrderDetailsWithFoods] =
    useState(orderDetails);
  const [loading, setLoading] = useState(false);

  const { closeAllModal } = useModal();

  useEffect(() => {
    if (!orderDetails.orderId) return;

    const fetchOrderItems = async () => {
      try {
        const res = await getOrderItems(orderDetails.orderId);
        setOrderDetailsWithFoods((prev) => {
          return { ...prev, foods: res };
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderDetails.orderId]);

  return (
    <div className={styles.wrapper}>
      {/* {children} */}
      <div className={styles.header}>
        <h2 className={shared.h5}>Order Details</h2>
        {orderDetailsWithFoods.orderId && (
          <p>#{orderDetailsWithFoods.orderId}</p>
        )}

        {orderDetailsWithFoods.status && (
          <OrderStatusIcon status={orderDetailsWithFoods.status} size={10} />
        )}

        <OrderAddress address={orderDetailsWithFoods.address} />
        <h4 className={styles.shopName}>{orderDetailsWithFoods.shopName}</h4>
      </div>

      <div className={styles.details}>
        <div className={styles.list}>
          {loading && <p>Loading...</p>}
          {orderDetailsWithFoods?.foods?.length > 0 && (
            <FoodItems listItem={orderDetailsWithFoods.foods} />
          )}
        </div>

        <div className={styles.pay}>
          <div>
            <p>Subtotal</p>
            <p>{formatCurrency(orderDetailsWithFoods.subtotal)}</p>
          </div>
          <div>
            <p>Delivery fee</p>
            <p>{formatCurrency(orderDetailsWithFoods.shippingFee)}</p>
          </div>
          <div>
            <p>Total</p>
            <p>{formatCurrency(orderDetailsWithFoods.totalAmount)}</p>
          </div>
        </div>

        {orderDetailsWithFoods.note && (
          <div className={styles.note}>
            <h3>
              <u>Note</u>
            </h3>
            <p className={`${shared.paragraph} ${shared.bgLight}`}>
              {orderDetailsWithFoods.note}
            </p>
          </div>
        )}

        {/* {children} */}
      </div>

      <div className={styles.footer}>{action}</div>
    </div>
  );
}

export default OrderDetails;
