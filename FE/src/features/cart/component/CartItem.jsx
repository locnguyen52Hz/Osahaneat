import React, { useEffect, useState } from "react";
import styles from "../../../assets/styles/CartItem.module.css";
import QuantitySelector from "../../../components/common/QuantitySelector";
import { formatCurrency } from "../../../util/format";
import endpoints from "../../../api/endpoints";
import { useCartStore } from "../../../stores/Cart/useCartStore";

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
  const [inputValue, setInputValue] = useState(item.quantity);


  const normalizeQuantity = (value) => {
    const quantity = Number(value);

    if (Number.isNaN(quantity)) return 1;

    return Math.min(99, Math.max(1, quantity));
  };

  const handleBlur = () => {
    const quantity = normalizeQuantity(inputValue);

    setInputValue(quantity);
    onUpdateQuantity(item.foodId, quantity);
  };

  const increase = () => {
    const quantity = Math.min(99, normalizeQuantity(inputValue) + 1);

    setInputValue(quantity);
    onUpdateQuantity(item.foodId, quantity);
  };

  const decrease = () => {
    const quantity = Math.max(1, normalizeQuantity(inputValue) - 1);

    setInputValue(quantity);
    onUpdateQuantity(item.foodId, quantity);
  };

  useEffect(() => {
    setInputValue(item.quantity);
  }, [item.quantity]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.shopImage}>
          <img
            className={styles.image}
            src={`${endpoints.image.food}/${item.image}`}
            alt=""
          />
          <i
            className={`bi bi-x-circle-fill ${styles.removeIcon}`}
            onClick={() => onRemoveItem(item.foodId)}
          ></i>
        </div>

        <div className={styles.details}>
          <p className={styles.foodName}>{item.foodName}</p>
          <p className={styles.description}>{item.description}</p>
          <p>{formatCurrency(item.price)}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <QuantitySelector
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onBlur={handleBlur}
          onIncrease={increase}
          onDecrease={decrease}
        />
      </div>
    </div>
  );
}

export default CartItem;
