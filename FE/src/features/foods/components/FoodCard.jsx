import React, { useState } from "react";
import FreeShipIcon from "../../../components/common/FreeShipIcon";
import style from "../../../assets/styles/FoodCard.module.css";
import { formatCurrency, formatDistance } from "../../../util/format";
import endpoints from "../../../api/endpoints";
import { useCartStore } from "../../../stores/Cart/useCartStore";
import RatingDisplay from "../../../components/common/RatingDisplay";
import GeographyIcon from "../../../components/common/GeographyIcon";

function FoodCard({ food, onBuyNow, onAddItemToCart }) {
  const {
    image,
    foodName,
    price,
    description,
    foodId,
    shopName,
    ratingAvg,
    ratingCount,
    distance,
  } = food;


  const [effects, setEffects] = useState([]);

  const handleAddItemToCart = () => {
    const id = Date.now();

    setEffects((prev) => [...prev, id]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((i) => i !== id));
    }, 800);
    onAddItemToCart(food);
  };

  return (
    <div className={style.card} id={`food-${foodId}`}>
      <div className={style.imageWrapper}>
        <img src={`${endpoints.image.food}/${image}`} alt={image} />
      </div>
      <div className={style.cardTitle}>
        <p className={style.foodName}>
          {shopName ? `${foodName} - ${shopName}` : foodName}
        </p>
        {ratingAvg != null && ratingCount != null && (
          <>
            <div className={style.rating}>
              <RatingDisplay value={ratingAvg} count={ratingCount} />
            </div>
            <GeographyIcon number={formatDistance(distance)} />
          </>
        )}
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

export default FoodCard;
