import { useEffect, useState } from "react";

import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import AddressSelector from "../../../components/common/AddressSelector";
import { useModal } from "../../../contexts/ModalContext";
import OrderActions from "./OrderActions";
import OrderDetailsView from "./OrderDetailsView";

function OrderPreview({ orderInfo, createOrder, loading, location }) {

  const [details, setDetails] = useState(orderInfo);
  const [loadShippingFee, setLoadShippingFee] = useState(false);
  const { openModal } = useModal();

  const handleSelectAddress = () => {
    openModal(<AddressSelector />, { type: "slide" });
  };

  useEffect(() => {
    if (!location) return;
    setLoadShippingFee(true);
    const fetchShippingFee = async () => {
      try {
        const resPreview = await api.post(endpoints.order.shippingFee, {
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
          deliveredTo: location.address,
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
      handleSelectAddress={handleSelectAddress}
      order={details}
      foods={details.foods}
      loadingItems={loading}
      footer={<OrderActions action={createOrder} label="Đặt hàng" />}
    />
  );
}

export default OrderPreview;
