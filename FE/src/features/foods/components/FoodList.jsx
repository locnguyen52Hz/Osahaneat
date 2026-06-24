import React, { useRef } from "react";
import FoodCard from "./FoodCard";
import Modal from "../../../components/Modal";
import FoodDetail from "./FoodDetail";
import style from "../../../assets/styles/FoodList.module.css";
import { useModal } from "../../../contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/Cart/useCartStore";

function FoodList({ foods, handleBuyNow, handleAddToCart }) {
  const { openModal } = useModal();
  const navigate = useNavigate();

  return (
    <>
      <div className={style.foodList}>
        {foods?.map((food) => (
          <FoodCard
            key={food.foodId}
            food={food}
            onBuyNow={() => handleBuyNow(food)}
            onAddItemToCart={handleAddToCart}
          />
        ))}
      </div>
    </>
  );
}

export default FoodList;
