import { OrderItem } from "./OrderItem";
import { OrderStatus } from "./OrderStatus";

export interface Order {
  orderId: number;
  totalAmount: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  deliveredTo: string;
  shippingFee: number;
  subtotal: number;
  distance: number;
  totalQuantity?: number;
  latitude: number;
  longitude: number;
  rating?: number;
  estimatedDeliveryTime: number;

  partnerId?: number;
  partnerName?: string;
  partnerEmail?: string;
  partnerLatitude?: number;
  partnerLongitude?: number;

  shopId?: number;
  shopName?: string;

  foods?: OrderItem[];
}
