import { createContext, useContext, useState } from "react";
import { useCart } from "./CartContext";
import { sanitizeInput } from "../util/format";

import endpoints from "../api/endpoints";
import { apiPost } from "../api/api";

import { useFormattedLocation } from "../hooks/useFormatedLocation";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { carts } = useCart();
  const location = useFormattedLocation();

  //   console.log(carts)

  const createOrder = async (shopId, note) => {
    const safeNote = sanitizeInput(note);
    const currentShop = carts.find((shop) => shop.id === shopId);
    if (!currentShop) throw new Error(`Không tìm thấy giỏ hàng của shop này`);

    const payload = {
      shopId,
      note: safeNote,
      address: location.address,
      fromLatitude: location.latitude,
      fromLongitude: location.longitude,
      foods: currentShop.foods.map((food) => ({
        foodId: food.id,
        quantity: food.quantity,
      })),
    };
    console.log(payload)

    try {
      const res = await apiPost(endpoints.order.create, payload);
      console.log(res.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const userOrder = () => useContext(OrderContext);
