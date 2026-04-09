import React from "react";
import FreeShipIcon from "./common/FreeShipIcon";
import style from "../assets/styles/FoodCard.module.css";
import { formatCurrency } from "../util/format";
import endpoints from "../api/endpoints";

function FoodCard({ food, onClick, type = "default" }) {
  const { image, name, price, description, ratting, id } = food;

  if (type === "default") {
    return (
      <div className={style.card} id={`food-${id}`} onClick={onClick}>
        <div className={style.imageWrapper}>
          <img src={`${endpoints.image.food}/${image}`} alt={image} />
        </div>
        <div className={style.cardTitle}>
          <p className={style.foodName}>{name}</p>
          <div>
            <FreeShipIcon />
            <p className={style.rating}>⭐ 0 {ratting} </p>
          </div>
          <p className={style.price}>Giá: {formatCurrency(price)}</p>
        </div>
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className={style.cardDetail} id={`food-${id}`}>
        <div className={style.imageWrapper}>
          <img src={`${endpoints.image.food}/${image}`} alt={foodName} />
        </div>
        <div className={style.cardTitle}>
          <p className={style.foodName}>{name}</p>
          <FreeShipIcon />
        </div>
        <div className={style.extraInfo}>
          <p className={style.rating}>⭐ {ratting}</p>
          <p className={style.description}>{description}</p>
          <p className={style.price}>Giá: {price}₫</p>
          <p className={style.description}>{description}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default FoodCard;
