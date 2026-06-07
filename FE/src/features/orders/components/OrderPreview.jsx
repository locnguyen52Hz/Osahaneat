import React, { useEffect, useState } from "react";
import { useLocation } from "../../../contexts/LocationContext";
import { apiGet, apiPost } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import OrderDetails from "./OrderDetails";
import OrderActions from "./OrderActions";
import OrderDetailsView from "./OrderDetailsView";

function OrderPreview({ currentShop, note, myLocation, createOrder }) {
  const [details, setDetails] = useState(currentShop);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!myLocation) return;

    const fetchShippingFee = async () => {
      try {
        const resPreview = await apiPost(endpoints.order.shippingFee, {
          shopId: currentShop.id,
          foods: currentShop.foods,
          fromLatitude: myLocation.latitude,
          fromLongitude: myLocation.longitude,
        });

        const { shippingFee, subtotal, totalAmount } = resPreview.data.data;
        console.log(resPreview.data.data)
        setDetails((prev) => ({
          ...prev,
          shippingFee,
          subtotal,
          totalAmount,
          note,
          address: myLocation.address,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingFee();
  }, [myLocation, currentShop, note]);
  if (loading) return <p>Loading...</p>;
  return (
    <OrderDetailsView
      order={details}
      foods={details.foods}
      loadingItems={false}
      footer={<OrderActions action={createOrder} label="Confirm" />}
    />
  );
}

export default OrderPreview;
