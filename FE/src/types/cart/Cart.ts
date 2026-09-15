import { CartItem } from "./CartItem";

export interface Cart {
  id?: number;
  shopId: number;
  shopName: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];

  lastAddedAt?: string;
  shippingFee?: number;
}
