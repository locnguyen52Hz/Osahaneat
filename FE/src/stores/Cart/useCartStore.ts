import { debounce, isEqual } from "lodash";
import { create } from "zustand";

import { api } from "../../api/api";
import endpoints from "../../api/endpoints";
import { Cart } from "../../types/cart/Cart";
import { getTotalCartItems, normalizeItems } from "../../util/cart";

import { CartStore } from "../../types/cart/CartStore";
import { CheckoutCart } from "../../types/cart/CheckoutCart";
import { Food } from "../../types/food/Food";
import { ApiResponse } from "../../types/common/Api";
import { Order } from "../../types/order/Order";

const createCart = (food: Food, quantity: number) => ({
  shopId: food.shopId,
  shopName: food.shopName,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastAddedAt: new Date().toISOString(),
  cartItems: [
    {
      ...food,
      quantity,
    },
  ],
});

export const useCartStore = create<CartStore>((set, get) => ({
  carts: [] as Cart[],
  originalCarts: [] as Cart[],

  isLoading: false,
  isSyncing: false,
  hasPendingChanges: false,
  cartShippingLoading: {},
  dirtyShopIds: new Set(),

  totalCartItem: 0,
  lastSync: null,

  // ============================= FETCH CART =============================
  fetchCart: async () => {
    set({ isLoading: true });

    try {
      const res = await api.get<ApiResponse<Cart[]>>(endpoints.cart.listCart);

      const carts = res.data.data;
  
      set({
        carts,
        originalCarts: structuredClone(carts),
        totalCartItem: getTotalCartItems(carts),
        dirtyShopIds: new Set(),
        hasPendingChanges: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  // ============================= CEATE ORDER FROM CART =============================
  createOrderFromCart: async (cart: CheckoutCart) => {
    const res = await api.post<ApiResponse<Order>>(
      endpoints.order.createOrderFromCart,
      {
        shopId: cart.shopId,
        fromLatitude: cart.fromLatitude,
        fromLongitude: cart.fromLongitude,
        deliveredTo: cart.deliveredTo,
        note: cart.note,
      },
    );

    useCartStore.getState().removeCartLocal(cart.shopId);

    return res.data.data;
  },

  // ============================= UPDATE DIRTY =============================
  updateDirtyState: (state, shopId, items) => {
    const originalCart = state.originalCarts.find((c) => c.shopId === shopId);

    const originalItems = normalizeItems(originalCart?.cartItems ?? []);

    const currentItems = normalizeItems(items);

    const changed = !isEqual(currentItems, originalItems);

    const dirtyShopIds = new Set(state.dirtyShopIds);

    if (changed) {
      dirtyShopIds.add(shopId);
    } else {
      dirtyShopIds.delete(shopId);
    }

    return {
      dirtyShopIds,
      hasPendingChanges: dirtyShopIds.size > 0,
    };
  },

  // ============================= UPDATE CART BY SHOP =============================
  updateCartByShop: (shopId, updater) => {
    set((state) => {
      const carts = [...state.carts];

      const index = carts.findIndex((c) => c.shopId === shopId);

      if (index === -1) return state;

      const cart = carts[index];

      const updatedItems = updater(cart.cartItems);

      carts[index] = {
        ...cart,
        cartItems: updatedItems,
        updatedAt: new Date().toISOString(),
      };

      const dirtyState = get().updateDirtyState(state, shopId, updatedItems);
      console.log(dirtyState);

      return {
        carts,
        ...dirtyState,
        totalCartItem: getTotalCartItems(carts),
      };
    });
  },

  // ============================= ADD ITEM =============================
  addItem: (food, quantity = 1) => {
    set((state) => {
      const carts = [...state.carts];

      let index = carts.findIndex((c) => c.shopId === food.shopId);

      // tạo cart mới
      if (index === -1) {
        carts.unshift(createCart(food, quantity));

        const dirtyShopIds = new Set(state.dirtyShopIds);

        dirtyShopIds.add(food.shopId);

        return {
          carts,
          dirtyShopIds,
          hasPendingChanges: true,
          totalCartItem: getTotalCartItems(carts),
        };
      }

      const cart = carts[index];

      const updatedItems = [...cart.cartItems];

      const itemIndex = updatedItems.findIndex((i) => i.foodId === food.foodId);

      let isNewItem = false;

      if (itemIndex !== -1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + quantity,
        };
      } else {
        updatedItems.push({
          ...food,
          quantity,
        });

        isNewItem = true;
      }

      carts[index] = {
        ...cart,
        cartItems: updatedItems,
        updatedAt: new Date().toISOString(),

        ...(isNewItem && {
          lastAddedAt: new Date().toISOString(),
        }),
      };

      const dirtyState = get().updateDirtyState(
        state,
        food.shopId,
        updatedItems,
      );

      return {
        carts,
        ...dirtyState,
        totalCartItem: getTotalCartItems(carts),
      };
    });

    get().scheduleSync();
  },

  // ============================= SET SHIPPING LOADING =============================
  setShippingLoading: (shopId, loading) =>
    set((state) => ({
      cartShippingLoading: {
        ...state.cartShippingLoading,
        [shopId]: loading,
      },
    })),

  // ============================= FETCH SHIPPING FEE =============================
  fetchShippingFee: async (shopId, latitude, longitude) => {
    get().setShippingLoading(shopId, true);

    try {
      const res = await api.get<ApiResponse<number>>(
        `${endpoints.routes.shippingFee}?fromLongitude=${longitude}&fromLatitude=${latitude}&shopID=${shopId}`,
      );

      get().updateShippingFee(shopId, res.data.data);
    } catch (error) {
      // xử lý sau
      console.log(error);
    } finally {
      get().setShippingLoading(shopId, false);
    }
  },

  // ============================= REMOVE CART =============================
  removeCart: (shopId) => {
    get().updateCartByShop(shopId, () => []);

    get().scheduleSync();
  },

  // ============================= REMOVE CART LOCAL =============================
  removeCartLocal: (shopId) => {
    set((state) => {
      const carts = state.carts.filter((cart) => cart.shopId !== shopId);

      return {
        carts,
        totalCartItem: getTotalCartItems(carts),
      };
    });
  },

  // ============================= REMOVE ITEM =============================
  removeItem: (shopId, foodId) => {
    get().updateCartByShop(shopId, (items) =>
      items.filter((i) => i.foodId !== foodId),
    );

    get().scheduleSync();
  },

  // ============================= UPDATE QUANTITY =============================
  updateQuantity: (shopId, foodId, quantity) => {
    get().updateCartByShop(shopId, (items) =>
      items.map((item) =>
        item.foodId === foodId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );

    get().scheduleSync();
  },

  // ============================= SYNC CART =============================
  syncCart: async () => {
    const state = useCartStore.getState();

    if (state.isSyncing || !state.hasPendingChanges) {
      return;
    }

    set({
      isSyncing: true,
    });

    try {
      const payload = {
        carts: state.carts
          .filter((cart) => state.dirtyShopIds.has(cart.shopId))
          .map((cart) => ({
            shopId: cart.shopId,

            items: cart.cartItems.map((item) => ({
              foodId: item.foodId,
              quantity: item.quantity,
            })),
          })),
      };

      const res = await api.put<ApiResponse<Cart[]>>(
        endpoints.cart.syncCart,
        payload,
      );

      const serverCarts = res.data.data;

      const carts = state.carts.map((cart) => {
        const serverCart = serverCarts.find((c) => c.shopId === cart.shopId);

        if (!serverCart) {
          return cart;
        }

        return {
          ...cart,
          ...serverCart,
        };
      });

      set({
        carts,
        originalCarts: structuredClone(carts),
        totalCartItem: getTotalCartItems(carts),
        dirtyShopIds: new Set(),
        hasPendingChanges: false,
        isSyncing: false,
        lastSync: Date.now(),
      });
    } catch (err) {
      console.error(err);

      set({
        isSyncing: false,
      });
    }
  },

  // ============================= UPDATE SHIPPING FEE =============================
  updateShippingFee: (shopId, shippingFee) =>
    set((state) => ({
      carts: state.carts.map((shop) =>
        shop.shopId === shopId
          ? {
              ...shop,
              shippingFee,
            }
          : shop,
      ),
    })),

  // ============================= SCHEDULE SYNC =============================
  scheduleSync: debounce(() => {
    const state = useCartStore.getState();

    if (!state.hasPendingChanges) {
      return;
    }

    state.syncCart();
  }, 1000),
}));
