// hooks/useFoodActions.js
import { useNavigate } from "react-router-dom";

import { useModal } from "../contexts/ModalContext";
import { useCartStore } from "../stores/Cart/useCartStore";
import FoodDetail from "../features/foods/components/FoodDetail";
import React from "react";

export const useFoodActions = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const addItem = useCartStore((s) => s.addItem);

  const handleBuyNow = (food, shopName, shopId) => {
    openModal(
      React.createElement(FoodDetail, {
        food,
        shopName,
        shopId,
        navigate,
      }),
      { type: "slide" },
    );
  };

  const handleAddToCart = (food, shopName, shopId) => {
    const shop = {
      shopName,
      shopId,
    };
    addItem(shop, food);
  };

  return {
    handleBuyNow,
    handleAddToCart,
  };
};
