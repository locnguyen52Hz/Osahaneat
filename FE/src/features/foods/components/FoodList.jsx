import React, { useRef } from "react";
import FoodCard from "./FoodCard";
import Modal from "../../../components/Modal";
import FoodDetail from "./FoodDetail";
import style from "../../../assets/styles/FoodList.module.css";

function FoodList({ foods, handleBuyNow, handleAddToCart }) {
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
