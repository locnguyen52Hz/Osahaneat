import { OrderPreviewData } from "./OrderPreviewData";

export interface OrderPreviewDetails extends OrderPreviewData {
  deliveredTo: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}
