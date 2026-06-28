const API_BASE_URL = import.meta.env.VITE_API_URL;

const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    role: `${API_BASE_URL}/auth/get-role`,
  },
  image: {
    food: `${API_BASE_URL}/food/image`,
    shop: `${API_BASE_URL}/shops/avatar`,
    category: `${API_BASE_URL}/categories/image`,
  },
  shop: {
    top6Shop: `${API_BASE_URL}/shops/top-6-shops`,
    details: `${API_BASE_URL}/shops/details`,
    locations: `${API_BASE_URL}/shops/locations`,
    distance: `${API_BASE_URL}/shops/distance`,
    update: `${API_BASE_URL}/shops/update`,
    updateAvatar: `${API_BASE_URL}/shops/update-avatar`,
  },
  category: {
    // categories: `${API_BASE_URL}/categories/shop-category?shopID`,
    all: `${API_BASE_URL}/categories/all-categories`,
    shopCategories: `${API_BASE_URL}/categories/shop-categories`,
    toggle: `${API_BASE_URL}/categories/toggle-category`,
  },
  order: {
    create: `${API_BASE_URL}/orders/create-orders`,
    get_orders: `${API_BASE_URL}/orders`,
    updateStatus: (id, action) =>
      `${API_BASE_URL}/orders/${id}/status/${action}`,
    shippingFee: `${API_BASE_URL}/orders/shipping-fee`,
    items: `${API_BASE_URL}/orders/items`,
    active: `${API_BASE_URL}/orders/active`,
    previous: `${API_BASE_URL}/orders/previous`,
    createRating: `${API_BASE_URL}/orders/create-rating`,
    buyNow: `${API_BASE_URL}/orders/buy-now`,
    createOrderFromCart: `${API_BASE_URL}/orders/from-cart`,
  },
  routes: {
    shippingFee: `${API_BASE_URL}/routes/shipping-fee`,
  },
  food: {
    insertFood: `${API_BASE_URL}/food/add`,
    edit: `${API_BASE_URL}/food/edit`,
    delete: `${API_BASE_URL}/food/delete`,
    list: `${API_BASE_URL}/food/list`,
  },
  search: {
    shopsByCategory: `${API_BASE_URL}/search/shops-by-category`,
    foodName: `${API_BASE_URL}/search/food-name`,
    foodByCategoryName: `${API_BASE_URL}/search/food-by-category`,
  },
  messages: {
    conversation: `${API_BASE_URL}/messages/conversations`,
    latestMessage: `${API_BASE_URL}/messages/latest-message`,
    countUnreadMessage: `${API_BASE_URL}/messages/unread-count`,
    send: `${API_BASE_URL}/messages/send`,
    olderMessages: `${API_BASE_URL}/messages/older-messages`,
    markUpMessages: `${API_BASE_URL}/messages/mark-up-messages`,
  },
  chart: {
    monthlyRevenue: `${API_BASE_URL}/revenue/monthly`,
    dailyRevenue: `${API_BASE_URL}/revenue/daily`,
  },
  cart: {
    listCart: `${API_BASE_URL}/cart/list-cart`,
    syncCart: `${API_BASE_URL}/cart/sync-cart`,
  },
};
export default endpoints;
