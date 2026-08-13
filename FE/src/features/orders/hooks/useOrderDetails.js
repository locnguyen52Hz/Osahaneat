import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";

export default function useOrderDetails(orderId) {
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState({
    orderId: null,
    totalAmount: null,
    status: null,
    createdAt: null,
    deliveredTo: null,
    shippingFee: null,
    subtotal: null,
    distance: null,
    latitude: null,
    longitude: null,
    partnerId: null,
    partnerName: null,
    partnerEmail: null,
    partnerLatitude: null,
    partnerLongitude: null,
  });

  const fectchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await apiGet(`${endpoints.order.details}?orderId=${orderId}`);
      setOrder(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fectchOrderDetails();
  }, []);

  return {
    loading,
    order,
    fectchOrderDetails,
    setOrder,
  };
}
