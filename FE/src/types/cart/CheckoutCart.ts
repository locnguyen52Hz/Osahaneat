import { Cart } from "./Cart";

export interface CheckoutCart extends Cart {
  fromLatitude: number;
  fromLongitude: number;
  deliveredTo: string;
  note?: string;
  subtotal: number;
  totalAmount: number;
}
