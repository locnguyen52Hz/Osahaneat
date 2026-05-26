import React, { createContext, useState, useContext, useEffect } from "react";
import { MAX_QUANTITY_FOOD, MIN_QUANTITY_FOOD } from "../../../constants/limits";
import { calcCartQuantity, calcCartTotal } from "../../../util/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  // console.log(carts);

  const addToCart = (newFood, quantityValue, shopId, shopName) => {
    // console.log(newFood);
    const quantity = Number(quantityValue);

    setCarts((prev) => {
      const shopIndex = prev.findIndex((item) => item.id === shopId);

      // Nếu đã có shop trong carts
      if (shopIndex !== -1) {
        const updatedCarts = [...prev];
        const shop = updatedCarts[shopIndex];
        console.log("shop: ", shop);

        const foodIndex = shop.foods.findIndex(
          (food) => food.foodId === newFood.foodId
        );

        if (foodIndex !== -1) {
          // Nếu món đã có -> tăng quantity
          // console.log(quantity);
          shop.foods[foodIndex] = {
            ...shop.foods[foodIndex],
            quantity:
              shop.foods[foodIndex].quantity + quantity > MAX_QUANTITY_FOOD
                ? MAX_QUANTITY_FOOD
                : shop.foods[foodIndex].quantity + quantity,
          };
        } else {
          // Nếu món chưa có -> thêm món mới
          shop.foods.push({ ...newFood, quantity });
        }

        updatedCarts[shopIndex] = { ...shop };
        return updatedCarts;
      }

      // Nếu shop chưa tồn tại trong carts -> thêm shop mới
      return [
        ...prev,
        { id: shopId, shopName, foods: [{ ...newFood, quantity }] },
      ];
    });
  };

  const increaseQuantity = (foodId, shopId) => {
    setCarts((prev) => {
      return prev.map((shop) => {
        //So sánh tên shop hiện tại với shopID được truyền vào hàm
        if (shop.id === shopId) {
          //Nếu đúng shop, tiến hành cập nhật; nếu không, trả về shop cũ.
          return {
            //Tạo bản sao của shop và cập nhật foods
            ...shop,
            foods: shop.foods.map((item) => {
              if (item.foodId === foodId) {
                const newQuantity =
                  item.quantity < MAX_QUANTITY_FOOD
                    ? item.quantity + 1
                    : MAX_QUANTITY_FOOD; // giới hạn tối đa
                return { ...item, quantity: newQuantity };
              }
              return item;
            }),
          };
        }
        //Nếu shop hiện tại không khớp shopID, giữ nguyên dữ liệu shop đó
        return shop;
      });
    });
  };

  const decreaseQuantity = (foodId, shopId) => {
    setCarts((prev) => {
      return prev.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            foods: shop.foods.map((item) => {
              if (item.foodId === foodId) {
                const newQuantity =
                  item.quantity <= MIN_QUANTITY_FOOD
                    ? MIN_QUANTITY_FOOD
                    : item.quantity - 1;
                return { ...item, quantity: newQuantity };
              }
              return item;
            }),
          };
        }
        return shop;
      });
    });
  };

  const removeFromCarts = (shopId, foodId) => {
    setCarts((prev) =>
      prev
        .map((shop) => {
          if (shop.id === shopId) {
            //tìm nếu shop tồn tại thì lọc bỏ món cần xóa
            const updateFoods = shop.foods.filter((food) => food.foodId !== foodId);
            // giữ nguyên shop, và tạo mảng mới đã lọc bỏ food cần xóa
            return { ...shop, foods: updateFoods };
          } else return shop;
        })
        //nếu ko còn food trong shop thì remove luôn shop
        .filter((shop) => shop.foods.length > 0)
    );
  };

  const clearCart = () => {
    setCarts([]);
  };

  const getTotalAmountByShop = (shopId) => {
    const shop = carts.find((item) => item.id === shopId);
    // console.log(shop)
    if (!shop) return 0;
    const totalAmount = calcCartTotal(shop.foods);
    return totalAmount;
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        addToCart,
        removeFromCarts,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalAmountByShop,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  return context;
};
