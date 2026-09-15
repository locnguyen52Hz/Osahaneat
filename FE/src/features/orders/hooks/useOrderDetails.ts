import { useEffect, useState } from "react";
import { getOrderDetails } from "../service/orderApi";
import { OrderDetails } from "../../../types/order/OrderDetails";

export default function useOrderDetails(orderId : number) {
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<OrderDetails | null> (null)

  const fectchOrderDetails = async () => {
    setLoading(true);
    try {
      setOrder(await getOrderDetails(orderId));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fectchOrderDetails();
  }, [orderId]);

  return {
    loading,
    order,
    fectchOrderDetails,
    setOrder,
  };
}
