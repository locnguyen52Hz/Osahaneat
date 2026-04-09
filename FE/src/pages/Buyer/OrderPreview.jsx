import React, { useEffect, useState } from "react";
import { useLocation } from "../../contexts/LocationContext";
import { apiGet, apiPost } from "../../api/api";
import endpoints from "../../api/endpoints";
import OrderDetails from "../Common/OrderDetails";
import OrderActions from "../../components/OrderActions";

function OrderPreview({ currentShop, note, myLocation, createOrder }) {
  const [details, setDetails] = useState(currentShop);
  const [loading, setLoading] = useState(true);
  console.log(myLocation);
  console.log(details);
  useEffect(() => {
    if (!myLocation) return;

    const fetchOrderPreview = async () => {
      const payload = {
        shopId: currentShop.id,
        foods: currentShop.foods,
        fromLatitude: myLocation.latitude,
        fromLongitude: myLocation.longitude,
      };
      // console.log(payload);
      try {
        const resPreview = await apiPost(`${endpoints.order.preview}`, payload);

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

    fetchOrderPreview();
  }, [myLocation]);

  return (
    <>
      {!loading && <OrderDetails orderDetails={details} />}
      <OrderActions action={createOrder} cancelBtn={false} label={"Comfirm"} />
    </>
  );
}

export default OrderPreview;
