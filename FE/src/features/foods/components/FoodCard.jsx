import React from "react";
import FreeShipIcon from "../../../components/common/FreeShipIcon";
import style from "../../../assets/styles/FoodCard.module.css";
import { formatCurrency } from "../../../util/format";
import endpoints from "../../../api/endpoints";
import { useCartStore } from "../../../stores/Cart/useCartStore";

function FoodCard({ food, onClick, type = "default" }) {
  const { image, foodName, price, description, ratting, foodId } = food;
  console.log(food)


  if (type === "default") {
    return (
      <div className={style.card} id={`food-${foodId}`}>
        <div className={style.imageWrapper}>
          <img src={`${endpoints.image.food}/${image}`} alt={image} />
        </div>
        <div className={style.cardTitle}>
          <p className={style.foodName}>{foodName}</p>
          <p className={style.price}>Giá: {formatCurrency(price)}</p>
        </div>
        <div className={style.action}>
          <button onClick={onClick} className={style.buyNow}>
            Mua nhanh
          </button>

          <i className={`bi bi-cart-plus ${style.addToCart}`}></i>
        </div>
      </div>
    );
  }

  // if (type === "detail") {
  //   return (
  //     <div className={style.cardDetail} id={`food-${foodId}`}>
  //       <div className={style.imageWrapper}>
  //         <img src={`${endpoints.image.food}/${image}`} alt={foodName} />
  //       </div>
  //       <div className={style.cardTitle}>
  //         <p className={style.foodName}>{foodName}</p>
  //         <FreeShipIcon />
  //       </div>
  //       <div className={style.extraInfo}>
  //         <p className={style.description}>{description}</p>
  //         <p className={style.price}>Giá: {price}₫</p>
  //         <p className={style.description}>{description}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return null;
}

export default FoodCard;
