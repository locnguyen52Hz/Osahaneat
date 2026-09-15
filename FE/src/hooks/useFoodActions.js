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

  const handleBuyNow = (food) => {
    openModal(
      React.createElement(FoodDetail, {
        food,
        navigate,
      }),
      { type: "slide" },
    );
  };

  const handleAddToCart = (food) => {
    addItem(food);
  };

  return {
    handleBuyNow,
    handleAddToCart,
  };
};
