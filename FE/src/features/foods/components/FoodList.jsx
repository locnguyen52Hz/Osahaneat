import React, { useRef, useState } from "react";
import FoodCard from "./FoodCard";
import Modal from "../../../components/Modal";
import FoodDetail from "./FoodDetail";
import style from "../../../assets/styles/FoodList.module.css";
import { useModal } from "../../../contexts/ModalContext";
import { useNavigate } from "react-router-dom";

function FoodList({
  foods,
  shopName,
  shopId,
}) {
  const { openModal } = useModal();
  const navigate = useNavigate();

  // console.log(shopName)

  const handleOpenModals = (food) => {
    openModal(
      <FoodDetail
        food={food}
        shopName={shopName}
        shopId={shopId}
        navigate={navigate}
      />,
      {
        type: "slide",
      },
    );

    // openModal()
  };

  return (
    <>
      <div className={style.foodList}>
        {foods?.map((food) => (
          <FoodCard
            key={food.foodId}
            food={food}
            onClick={() => handleOpenModals(food)}
          />
        ))}
      </div>
    </>
  );
}

export default FoodList;
