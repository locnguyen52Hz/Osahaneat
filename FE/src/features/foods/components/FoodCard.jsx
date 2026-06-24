import React, { useState } from "react";
import FreeShipIcon from "../../../components/common/FreeShipIcon";
import style from "../../../assets/styles/FoodCard.module.css";
import { formatCurrency } from "../../../util/format";
import endpoints from "../../../api/endpoints";
import { useCartStore } from "../../../stores/Cart/useCartStore";

function FoodCard({ food, onBuyNow, type = "default", onAddItemToCart }) {
  const { image, foodName, price, description, ratting, foodId } = food;
  const [effects, setEffects] = useState([]);


  const handleAddItemToCart = () => {
    const id = Date.now();

    setEffects((prev) => [...prev, id]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((i) => i !== id));
    }, 800);
    onAddItemToCart(food);
  };


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
          <button onClick={onBuyNow} className={style.buyNow}>
            Mua nhanh
          </button>

          <div style={{ position: "relative" }}>
            <i
              onClick={handleAddItemToCart}
              className={`bi bi-cart-plus ${style.addToCart}`}
            ></i>

            {effects.map((id) => (
              <span key={id} className={style.addEffect}>
                +1
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }



  return null;
}

export default FoodCard;
