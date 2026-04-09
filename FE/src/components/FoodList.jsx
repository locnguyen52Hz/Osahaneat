import React, { useRef, useState } from "react";
import FoodCard from "./FoodCard";
import Modal from "./Modal";
import FoodDetail from "./FoodDetail";
import style from "../assets/styles/FoodList.module.css";
import { useModal } from "../contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import EditFood from "../pages/ShopManager/EditFood";
import InsertFood from "../pages/ShopManager/InsertFood";

function FoodList({
  foods,
  shopName,
  shopId,
  onSubmitNewFood,
  onSubmitEditFood,
  onDeleteFood,
}) {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  // console.log(shopName)

  const handleOpenModals = (food) => {
    openModal(
      role === "ROLE_BUYER" ? (
        <FoodDetail
          food={food}
          shopName={shopName}
          shopId={shopId}
          navigate={navigate}
        />
      ) : (
        <EditFood
          food={food}
          onSubmitEditFood={onSubmitEditFood}
          onDeleteFood={onDeleteFood}
        />
      ),
      { type: "slide" }
    );
    // openModal()
  };

  return (
    <>
      <div className={style.foodList}>
        {role === "ROLE_SHOP_MANAGER" && (
          <div
            className={style.insertBox}
            onClick={() =>
              openModal(<InsertFood onSubmitNewFood={onSubmitNewFood} />, {
                type: "slide",
              })
            }
          >
            <i className="bi bi-plus-circle"></i>{" "}
          </div>
        )}
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
