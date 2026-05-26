import React, { useEffect, useState } from "react";
import shared from "../../../assets/styles/Shared.module.css";
import { useCart } from "../../cart/context/CartContext";
import style from "../../../assets/styles/FoodDetail.module.css";
import MyCart from "../../cart/component/MyCart";
import { useModal } from "../../../contexts/ModalContext";
import {
  MODAL_ANIMATION_DURATION,
  MAX_QUANTITY_FOOD,
  MIN_QUANTITY_FOOD,
} from "../../../constants";
import { createQuantityRegex } from "../../../util/regex";
import { formatCurrency } from "../../../util/format";
import endpoints from "../../../api/endpoints";

function FoodDetail({ food, shopName, shopId, navigate }) {
  const { name, image, price, description } = food;
  const [isProcessing, setIsProCessing] = useState(true);
  const [quantity, setQuantity] = useState("1");
  const regex = createQuantityRegex(MIN_QUANTITY_FOOD, MAX_QUANTITY_FOOD);

  useEffect(() => {
    //đợi cho đến khi animation chạy xong thì mới có thể bấm thêm giỏ hàng
    setTimeout(() => {
      setIsProCessing(false);
    }, MODAL_ANIMATION_DURATION);
  }, []);

  // console.log("quantity: ", quantity);
  const { addToCart } = useCart();
  const { openModal } = useModal();

  const handleOnChange = (value) => {
    if (value === "" || regex.test(value)) {
      setQuantity(value);
    } else {
      console.log("nhập số lượng");
    }
  };

  const handlerOnclick = (operator) => {
    if (operator === "plus") {
      if (quantity < MAX_QUANTITY_FOOD) {
        setQuantity(Number(quantity) + 1);
      }
    }
    if (operator === "minus" && quantity >= 1) {
      setQuantity(Number(quantity) - 1);
    }
  };

  const handleAddToCart = () => {
    if (isProcessing) {
      return;
    }
    if (quantity === 0) {
      openModal(<MyCart shopId={shopId} shopName={shopName} navigate={navigate} />, {
        type: "slide",
      });
    }

    if (quantity > 0) {
      addToCart(food, quantity, shopId, shopName); // thêm vào giỏ
      openModal(<MyCart shopId={shopId} shopName={shopName} navigate={navigate} />, {
        type: "slide",
      });
    }

    setTimeout(() => {
      setIsProCessing(false);
    }, MODAL_ANIMATION_DURATION);
  };

  const validateQuantity = (value, min, max) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max;
  };

  const handleBlur = () => {
    if (!validateQuantity(quantity, MIN_QUANTITY_FOOD, MAX_QUANTITY_FOOD)) {
      console.log(`Số lượng từ ${MIN_QUANTITY_FOOD} - ${MAX_QUANTITY_FOOD}`);
      setQuantity(0);
    }
  };

  const test = () => {
    console.log("click");
  };

  return (
    <>
      <div className={style.header}>
        <h1>{name}</h1>
      </div>
      <div className={style.body}>
        <div className={style.imgWrapper}>
          <div>
            <i className="bi bi-suit-heart-fill"></i>
          </div>
          <img src={`${endpoints.image.food}/${image}`} alt={name} />
        </div>
        <p className={`${shared.textDark} ${shared.small}`}>{description}</p>
      </div>

      <div className={style.footer}>
        <div className={style.quantitySection}>
          <label>Số lượng</label>
          <div className={style.quantityControls}>
            <button onClick={() => handlerOnclick("minus")}>-</button>
            <input
              type="number"
              min={MIN_QUANTITY_FOOD}
              max={MAX_QUANTITY_FOOD}
              value={quantity}
              onChange={(e) => handleOnChange(e.target.value)}
              onBlur={handleBlur}
            />
            <button onClick={() => handlerOnclick("plus")}>+</button>
          </div>
        </div>

        <div className={style.totalPrice}>
          <span>Tổng tiền:</span>
          <strong>{formatCurrency(quantity * price)}</strong>
        </div>

        {quantity ? (
          <button
            onClick={isProcessing ? test : handleAddToCart}
            className={style.addToCartBtn}
          >
            <i className="bi bi-cart-fill"></i> Thêm vào giỏ hàng
          </button>
        ) : (
          <button
            onClick={isProcessing ? test : handleAddToCart}
            className={style.addToCartBtn}
          >
            <i className="bi bi-cart-fill"></i> Xem giỏ hàng
          </button>
        )}
      </div>
    </>
  );
}

export default FoodDetail;
