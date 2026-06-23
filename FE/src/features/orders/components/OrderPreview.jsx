import React, { useEffect, useState } from "react";
import { useLocation } from "../../../contexts/LocationContext";
import { apiGet, apiPost } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import OrderDetails from "./OrderDetails";
import OrderActions from "./OrderActions";
import OrderDetailsView from "./OrderDetailsView";

function OrderPreview({ orderInfo, createOrder, loading, location }) {
  const [details, setDetails] = useState(orderInfo);
  const [loadShippingFee, setLoadShippingFee] = useState(false);

  console.log(orderInfo);

  useEffect(() => {
    if (!location) return;
    setLoadShippingFee(true);
    const fetchShippingFee = async () => {
      try {
        const resPreview = await apiPost(endpoints.order.shippingFee, {
          shopId: orderInfo.shopId,
          foods: orderInfo.foods,
          fromLatitude: location.latitude,
          fromLongitude: location.longitude,
        });

        const { shippingFee, subtotal, totalAmount } = resPreview.data.data;

        setDetails((prev) => ({
          ...prev,
          shippingFee,
          subtotal,
          totalAmount,
          address: location.address,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadShippingFee(false);
      }
    };

    fetchShippingFee();
  }, [location, orderInfo]);
  if (loadShippingFee) return <p>Loading...</p>;
  return (
    <OrderDetailsView
      order={details}
      foods={details.foods}
      loadingItems={loading}
      footer={<OrderActions action={createOrder} label="Đặt hàng" />}
    />
  );
}

export default OrderPreview;
