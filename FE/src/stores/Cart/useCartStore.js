import { create } from "zustand";
import { apiGet, apiPost, apiPut } from "../../api/api";
import endpoints from "../../api/endpoints";
import { getTotalCartItems } from "../../util/cart";
import { debounce, isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";

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
    console.log(shop);
    set((state) => {
      const carts = [...state.carts];

      let cartIndex = carts.findIndex((c) => c.shopId === shop.shopId);

      // chưa có cart → tạo mới
      if (cartIndex === -1) {
        carts.unshift({
          id: uuidv4(),
          shopId: shop.shopId,
          shopName: shop.shopName,
          address: shop.address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cartItems: [
            {
              ...food,
              quantity,
            },
          ],
        });

        const dirtyShopIds = new Set(state.dirtyShopIds);
        dirtyShopIds.add(shop.shopId);

        return {
          carts,
          dirtyShopIds,
          hasPendingChanges: true,
          totalCartItem: getTotalCartItems(carts),
        };
      }

      // cart đã tồn tại
      const cart = carts[cartIndex];

      const itemIndex = cart.cartItems.findIndex(
        (item) => item.foodId === food.foodId,
      );

      let updatedItems = [...cart.cartItems];

      // food đã tồn tại → cộng quantity
      if (itemIndex !== -1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + quantity,
        };
      }

      // food chưa tồn tại → thêm mới
      else {
        updatedItems.push({
          ...food,
          quantity,
        });
      }

      const updatedCart = {
        ...cart,
        cartItems: updatedItems,
        updatedAt: new Date().toISOString(),
      };

      // bỏ cart cũ
      carts.splice(cartIndex, 1);

      // đưa lên đầu
      carts.unshift(updatedCart);

      const dirtyShopIds = new Set(state.dirtyShopIds);
      dirtyShopIds.add(shop.shopId);

      return {
        carts,
        dirtyShopIds,
        hasPendingChanges: true,
        totalCartItem: getTotalCartItems(carts),
      };
    });

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

    // Nếu đang sync thì không cho gọi tiếp
    // tránh spam API hoặc race condition
    if (state.isSyncing) return;

    // B2:
    // Không có thay đổi thì không cần sync
    if (!state.hasPendingChanges) return;

    // Đánh dấu bắt đầu sync
    set({
      isSyncing: true,
    });

    try {
      // Chuyển state FE thành payload tối thiểu

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

      // Gửi trạng thái cuối lên server
      const res = await apiPut(endpoints.cart.syncCart, payload);

      // Server trả cart mới nhất
      // (đã validate + đồng bộ DB)
      const carts = res.data.data;
      console.log(carts);

      // Replace toàn bộ state local
      // FE luôn lấy server làm nguồn dữ liệu thật
      set({
        carts,
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
  }, 1000),
}));
