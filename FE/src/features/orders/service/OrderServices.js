import { toast } from "react-toastify";
import { apiGet, apiPatch, apiPost } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { sanitizeInput } from "../../../util/format";

export const createOrder = async (shopId, note, carts, location) => {
  const safeNote = sanitizeInput(note);
  const currentShop = carts.find((shop) => shop.id === shopId);
  if (!currentShop) throw new Error("Không tìm thấy giỏ hàng của shop này");
  console.log(currentShop);
  const payload = {
    shopId,
    note: safeNote,
    address: location.address,
    fromLatitude: location.latitude,
    fromLongitude: location.longitude,
    foods: currentShop.foods.map((food) => ({
      foodId: food.foodId,
      quantity: food.quantity,
    })),
  };
  console.log(payload);

  try {
    const res = await apiPost(endpoints.order.create, payload);
    console.log(res.data.data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const res = await apiPatch(endpoints.order.updateStatus(orderId, newStatus));

  return res.data.data;
};

export const getUpcomingOrders = async (currentPage) => {
  const res = await apiGet(`${endpoints.order.active}?page=${currentPage}`);

  return res.data.data;
};

export const getOrderItems = async (orderId) => {
  const res = await apiGet(`${endpoints.order.items}?orderId=${orderId}`);
  return res.data.data;
};
