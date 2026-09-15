import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { ApiResponse } from "../../../types/common/Api";
import { OrderDetails } from "../../../types/order/OrderDetails";

export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  const res = await api.patch(endpoints.order.updateStatus(orderId, newStatus));
  return res.data.data;
};

export const getUpcomingOrders = async (page: number) => {
  const res = await api.get(`${endpoints.order.active}?page=${page}`);

  return res.data.data;
};

export const getOrderItems = async (orderId: number) => {
  const res = await api.get(`${endpoints.order.items}?orderId=${orderId}`);
  return res.data.data;
};

export const createRating = async (request: object) => {
  const res = await api.post(endpoints.order.createRating, request);
};
export const getPreviousOrders = async (page: number) => {
  const res = await api.get(`${endpoints.order.previous}?page=${page}`);
  return res.data.data;
};

export const getTimeLine = async (orderId: number) => {
  const res = await api.get(`${endpoints.order.timeline}?orderId=${orderId}`);
  return res.data.data;
};

export const getOrderDetails = async (
  orderId: number,
): Promise<OrderDetails> => {
  const res = await api.get<ApiResponse<OrderDetails>>(
    `${endpoints.order.details}?orderId=${orderId}`,
  );

  return res.data.data;
};
