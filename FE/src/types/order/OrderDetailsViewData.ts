import { OrderStatus } from "./OrderStatus";

export interface OrderDetailsViewData {
  orderId?: number;
  status?: OrderStatus;

  deliveredTo: string;
  shopName: string;

  subtotal: number;
  shippingFee: number;
  totalAmount: number;

  note?: string;
}
