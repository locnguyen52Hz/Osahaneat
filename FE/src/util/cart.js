// utils/cart.js

import { formatCurrency } from "./format"; //

/**
 * Tính tổng tiền của 1 shop (foods)
 * @param {Array} foods - danh sách món ăn [{price, quantity}, ...]
 * @returns {number} tổng tiền (dạng số)
 */
export const calcCartTotal = (foods = []) => {
  if (!foods || foods.length === 0) return 0;
  return foods.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Tính tổng số lượng món trong giỏ hàng (cho 1 shop)
 * @param {Array} foods - danh sách món ăn
 * @returns {number} tổng số lượng
 */
export const calcCartQuantity = (foods = []) => {
  if (!foods || foods.length === 0) return 0;
  return foods.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Lấy tổng tiền và format thành tiền tệ
 * @param {Array} foods
 * @returns {string} ví dụ: "120.000 ₫"
 */
export const getFormattedCartTotal = (foods = []) => {
  if (!Array.isArray(foods) || foods.length === 0) return formatCurrency(0);

  const total = foods.reduce((sum, food) => {
    const price = Number(food.price) || 0;
    const quantity = Number(food.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  return formatCurrency(total);
};

export function getTotalCartItems(carts) {
  return carts.reduce((sum, cart) => sum + cart.cartItems.length, 0);
}

export const calculateCartTotal = (cartItems) =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const normalizeItems = (items) => {
  return items
    .map((item) => ({
      foodId: item.foodId,
      quantity: item.quantity,
    }))
    .sort((a, b) => a.foodId - b.foodId);
};
