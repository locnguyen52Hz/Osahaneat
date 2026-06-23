import { create } from "zustand";
import { apiGet, apiPost, apiPut } from "../../api/api";
import endpoints from "../../api/endpoints";
import { getTotalCartItems } from "../../util/cart";
import { debounce, isEqual } from "lodash";

export const useCartStore = create((set, get) => ({
  carts: [],
  originalCarts: [],

  isLoading: false,
  isSyncing: false,
  hasPendingChanges: false,
  lastSync: null,
  dirtyShopIds: new Set(),
  totalCartItem: 0,

  fetchCart: async () => {
    set({ isLoading: true });

    try {
      const res = await apiGet(endpoints.cart.listCart);

      const carts = res.data.data;

      set({
        carts,
        originalCarts: carts,
        totalCartItem: getTotalCartItems(carts),
        hasPendingChanges: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCartByShop: (shopId, updater) => {
    set((state) => {
      const carts = [...state.carts];

      const cartIndex = carts.findIndex((c) => c.shopId === shopId);

      if (cartIndex === -1) return state;

      const cart = carts[cartIndex];

      const updatedItems = updater(cart.cartItems);

      carts[cartIndex] = {
        ...cart,
        cartItems: updatedItems,
        updatedAt: new Date().toISOString(),
      };

      // lấy cart gốc từ snapshot
      const originalCart = state.originalCarts.find((c) => c.shopId === shopId);

      const originalItems = originalCart?.cartItems ?? [];

      // so sánh dữ liệu thật
      const changed = !isEqual(updatedItems, originalItems);

      const dirtyShopIds = new Set(state.dirtyShopIds);

      if (changed) {
        dirtyShopIds.add(shopId);
      } else {
        dirtyShopIds.delete(shopId);
      }

      return {
        carts,
        dirtyShopIds,
        hasPendingChanges: dirtyShopIds.size > 0,
        totalCartItem: getTotalCartItems(carts),
      };
    });
  },

  addItem: (shop, food, quantity = 1) => {
    get().updateCartByShop(
      shop.shopId,
      (items) => {
        const index = items.findIndex((i) => i.foodId === food.foodId);

        if (index === -1) {
          return [
            ...items,
            {
              ...food,
              quantity,
            },
          ];
        }

        return items.map((i) =>
          i.foodId === food.foodId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      },
      shop,
    );

    get().scheduleSync();
  },

  removeCart: (shopId) => {
    get().updateCartByShop(shopId, () => []);

    get().scheduleSync();
  },

  updateQuantity: (shopId, foodId, quantity) => {
    get().updateCartByShop(shopId, (items) => {
      const updated = items.map((item) =>
        item.foodId === foodId ? { ...item, quantity } : item,
      );

      return updated;
    });

    get().scheduleSync();
  },

  removeItem: (shopId, foodId) => {
    get().updateCartByShop(shopId, (items) =>
      items.filter((item) => item.foodId !== foodId),
    );

    get().scheduleSync();
  },

  syncCart: async () => {
    // Lấy state hiện tại
    const state = get();

    // B1:
    // Nếu đang sync thì không cho gọi tiếp
    // tránh spam API hoặc race condition
    if (state.isSyncing) return;

    // B2:
    // Không có thay đổi thì không cần sync
    if (!state.hasPendingChanges) return;

    // B3:
    // Đánh dấu bắt đầu sync
    set({
      isSyncing: true,
    });

    try {
      // B4:
      // Chuyển state FE thành payload tối thiểu
      // Chỉ gửi dữ liệu BE thực sự cần

      const dirtyCarts = state.carts.filter((cart) =>
        state.dirtyShopIds.has(cart.shopId),
      );
      const payload = {
        carts: dirtyCarts.map((cart) => ({
          shopId: cart.shopId,

          items: cart.cartItems.map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
        })),
      };

      // B5:
      // Gửi trạng thái cuối lên server
      const res = await apiPut(endpoints.cart.syncCart, payload);
      console.log(res);

      // B6:
      // Server trả cart mới nhất
      // (đã validate + đồng bộ DB)
      // const carts = res.data.data;

      // B7:
      // Replace toàn bộ state local
      // FE luôn lấy server làm nguồn dữ liệu thật
      set({
        // carts,
        // totalCartItem: getTotalCartItems(carts),
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

  scheduleSync: debounce(() => {
    useCartStore.getState().syncCart();
  }, 3000),
}));
