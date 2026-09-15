import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";

function useOrderItems(orderId) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const fetchOrderItems = async () => {
    setLoadingItems(true);
    try {
      const res = await api(`${endpoints.order.items}?orderId=${orderId}`);
   
      setItems(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, [orderId]);

  return {
    items,
    loadingItems,
  };
}

export default useOrderItems;
