import React, { useEffect, useState } from "react";
import shared from "../../../assets/styles/Shared.module.css";
import { useCart } from "../../cart/context/CartContext";
import style from "../../../assets/styles/FoodDetail.module.css";

import { useModal } from "../../../contexts/ModalContext";
import {
  MODAL_ANIMATION_DURATION,
  MAX_QUANTITY_FOOD,
  MIN_QUANTITY_FOOD,
  MAX_LENGTH_NOTE,
} from "../../../constants";
import { createQuantityRegex } from "../../../util/regex";
import { formatCurrency } from "../../../util/format";
import endpoints from "../../../api/endpoints";
import QuantitySelector from "../../../components/common/QuantitySelector";
import useQuantity from "../../../hooks/useQuantity";
import OrderDetailsView from "../../orders/components/OrderDetailsView";
import OrderPreview from "../../orders/components/OrderPreview";
import FloatingLabel from "../../../components/common/FloatingLabel";
import { apiPost } from "../../../api/api";

import { toast } from "react-toastify";
import { useLocationStore } from "../../../stores/location/useLocationStore";

function FoodDetail({ food, shopName, shopId, navigate }) {
  const { foodName, image, price, description, foodId } = food;
  const [isProcessing, setIsProCessing] = useState(true);
  const regex = createQuantityRegex(MIN_QUANTITY_FOOD, MAX_QUANTITY_FOOD);
  const [note, setNote] = useState("");
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const currentLocation = useLocationStore((s) => s.currentLocation);

  const {
    quantity,
    decrease,
    handleBlur,
    handleChange,
    increase,
    setQuantity,
  } = useQuantity(MAX_QUANTITY_FOOD, MAX_QUANTITY_FOOD);
  useEffect(() => {
    //đợi cho đến khi animation chạy xong thì mới có thể bấm thêm giỏ hàng
    setTimeout(() => {
      setIsProCessing(false);
    }, MODAL_ANIMATION_DURATION);
  }, []);

  const { openModal, closeAllModal, modalStack } = useModal();
  const foods = [
    {
      ...food,
      quantity: Number(quantity),
    },
  ];

  const normalize = { shopName, shopId, note, foods };
  console.log(normalize);

  const createOrderBuyNow = async () => {
    if (!currentLocation) return;
    setBuyNowLoading(true);

    try {
      const res = await apiPost(`${endpoints.order.buyNow}`, {
        foodId: food.foodId,
        quantity,
        fromLatitude: currentLocation.latitude,
        fromLongitude: currentLocation.longitude,
        deliveredTo: currentLocation.address,
      });
      closeAllModal();

      toast.success("Đặt hàng thành công", {
        onClose: () => {
          navigate("/buyer/orders/upcoming");
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Đặt hàng thất bại");
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleBuyNow = (payload) => {
    if (isProcessing) {
      return;
    }

    openModal(
      <OrderPreview
        orderInfo={normalize}
        loading={buyNowLoading}
        location={currentLocation}
        createOrder={createOrderBuyNow}
      />,
      {
        type: "slide",
      },
    );

    setTimeout(() => {
      setIsProCessing(false);
    }, MODAL_ANIMATION_DURATION);
  };
  const handleOnchange = (e) => {
    setNote(e.target.value);
  };
  return (
    <>
      <div className={style.header}>
        <h1>{foodName}</h1>
      </div>
      <div className={style.body}>
        <div className={style.imgWrapper}>
          <div>
            <i className="bi bi-suit-heart-fill"></i>
          </div>
          <img src={`${endpoints.image.food}/${image}`} alt={name} />
        </div>
        <p className={`${shared.textDark} ${shared.small}`}>{description}</p>
        <FloatingLabel
          label="Note"
          textarea
          value={note}
          onChange={handleOnchange}
          maxLength={MAX_LENGTH_NOTE}
        />
      </div>

      <div className={style.footer}>
        <div className={style.quantitySection}>
          <label>Số lượng</label>

          <QuantitySelector
            value={quantity}
            onBlur={handleBlur}
            onChange={handleChange}
            onDecrease={decrease}
            onIncrease={increase}
          />
        </div>

        <div className={style.totalPrice}>
          <span>Tổng tiền:</span>
          <strong>{formatCurrency(quantity * price)}</strong>
        </div>

        <button
          onClick={() => handleBuyNow(normalize)}
          className={style.addToCartBtn}
          disabled={quantity <= 0}
        >
          <i className="bi bi-cart-fill"></i> Xác nhận
        </button>
      </div>
    </>
  );
}

export default FoodDetail;
