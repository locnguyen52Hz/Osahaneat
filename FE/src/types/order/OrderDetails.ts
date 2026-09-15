export interface OrderDetails {
  orderId: number;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  deliveredTo: string;
  shippingFee: number;
  subtotal: number;
  distance: number;
  latitude: number;
  longitude: number;
  estimatedDeliveryTime: number;
  partnerId: number;
  partnerName: string;
  partnerEmail: string;
  partnerLatitude: number;
  partnerLongitude: number;
}
