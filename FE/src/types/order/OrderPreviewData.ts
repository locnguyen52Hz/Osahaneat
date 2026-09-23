import { CartItem } from "../cart/CartItem";

export interface OrderPreviewData {
  shopName: string;
  shopId: number;
  note: string;
  foods: CartItem[];
}
