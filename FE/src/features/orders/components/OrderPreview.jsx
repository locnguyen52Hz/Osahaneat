import React, { useEffect, useState } from "react";
import { useLocation } from "../../../contexts/LocationContext";
import { apiGet, apiPost } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import OrderDetails from "./OrderDetails";
import OrderActions from "./OrderActions";

function OrderPreview({ currentShop, note, myLocation, createOrder }) {
  const [details, setDetails] = useState(currentShop);
  const [loading, setLoading] = useState(true);
  console.log(currentShop);
  useEffect(() => {
    if (!myLocation) return;

    const fetchShippingFee = async () => {
      const payload = {
        shopId: currentShop.id,
        foods: currentShop.foods,
        fromLatitude: myLocation.latitude,
        fromLongitude: myLocation.longitude,
      };
      console.log(payload);
      try {
        const resPreview = await apiPost(
          `${endpoints.order.shippingFee}`,
          payload,
        );

        console.log(resPreview.data.data);

        const { shippingFee, subtotal, totalAmount } = resPreview.data.data;
        setDetails((prev) => ({
          ...prev,
          shippingFee,
          subtotal,
          totalAmount,
          note,
          address: myLocation.address,
        }));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchShippingFee();
  }, [myLocation]);
  // latitude : 21.011484983052767
  //longitude: 105.65814493445289
  return (
    <>
      {!loading && (
        <>
          <OrderDetails
            orderDetails={details}
            action={<OrderActions action={createOrder} label={"Confirm"} />}
          />
        </>
      )}
    </>
  );
}

export default OrderPreview;
