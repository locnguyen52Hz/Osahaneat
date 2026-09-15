import { useState } from "react";
import endpoints from "../../../api/endpoints";
import style from "../../../assets/styles/FoodCard.module.css";
import GeographyIcon from "../../../components/common/GeographyIcon";
import RatingDisplay from "../../../components/common/RatingDisplay";
import { formatCurrency, formatDistance } from "../../../util/format";
import { useFoodActions } from "../../../hooks/useFoodActions";

export default function FoodCard({ food }) {
  const {
    image,
    foodName,
    price,
    foodId,
    shopName,
    ratingAvg,
    ratingCount,
    distance,
    shopId,
  } = food;

  const { handleBuyNow, handleAddToCart } = useFoodActions();

  const [effects, setEffects] = useState([]);

  const handleAddItemToCart = () => {
    const id = Date.now();

    setEffects((prev) => [...prev, id]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((i) => i !== id));
    }, 800);
    handleAddToCart(food, shopName, shopId);
  };

  return (
    <div className={style.card}>
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
        <button onClick={() => handleBuyNow(food)} className={style.buyNow}>
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
