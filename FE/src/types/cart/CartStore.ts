import { Food } from "../food/Food";
import { Cart } from "./Cart";
import { CartItem } from "./CartItem";
import { CheckoutCart } from "./CheckoutCart";

export interface CartStore {
  // state
  carts: Cart[];
  originalCarts: Cart[];

  isLoading: boolean;
  isSyncing: boolean;
  hasPendingChanges: boolean;

  dirtyShopIds: Set<number>;

  totalCartItem: number;
  lastSync: number | null;

  cartShippingLoading: Record<number, boolean>;

  // actions
  fetchCart: () => Promise<void>;

  createOrderFromCart: (cart: CheckoutCart) => Promise<unknown>;

  updateDirtyState: (
    state: CartStore,
    shopId: number,
    items: CartItem[],
  ) => {
    dirtyShopIds: Set<number>;
    hasPendingChanges: boolean;
  };

  updateCartByShop: (
    shopId: number,
    updater: (items: CartItem[]) => CartItem[],
  ) => void;

  addItem: (food: Food, quantity?: number) => void;

  setShippingLoading: (shopId: number, loading: boolean) => void;

  fetchShippingFee: (
    shopId: number,
    latitude: number,
    longitude: number,
  ) => Promise<void>;

  removeCart: (shopId: number) => void;

  removeCartLocal: (shopId: number) => void;

  removeItem: (shopId: number, foodId: number) => void;

  updateQuantity: (shopId: number, foodId: number, quantity: number) => void;

  syncCart: () => Promise<void>;

  updateShippingFee: (shopId: number, shippingFee: number) => void;

  scheduleSync: () => void;
}
