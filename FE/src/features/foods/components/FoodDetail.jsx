import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import style from "../../../assets/styles/FoodDetail.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import FloatingLabel from "../../../components/common/FloatingLabel";
import QuantitySelector from "../../../components/common/QuantitySelector";
import {
  MAX_LENGTH_NOTE,
  MAX_QUANTITY_FOOD,
  MIN_QUANTITY_FOOD,
  MODAL_ANIMATION_DURATION,
} from "../../../constants";
import { useModal } from "../../../contexts/ModalContext";
import useQuantity from "../../../hooks/useQuantity";
import { formatCurrency } from "../../../util/format";
import { createQuantityRegex } from "../../../util/regex";
import OrderPreview from "../../orders/components/OrderPreview";

import { toast } from "react-toastify";
import { useLocationStore } from "../../../stores/location/useLocationStore";

function FoodDetail({ food, navigate }) {
  const { foodName, image, price, description, foodId, shopName, shopId } =
    food;

  const [isProcessing, setIsProCessing] = useState(true);
  const [note, setNote] = useState("");
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const currentLocation = useLocationStore((s) => s.currentLocation);

  const { quantity, decrease, handleBlur, handleChange, increase } =
    useQuantity(MAX_QUANTITY_FOOD, MAX_QUANTITY_FOOD);

  useEffect(() => {
    //đợi cho đến khi animation chạy xong thì mới có thể bấm thêm giỏ hàng
    setTimeout(() => {
      setIsProCessing(false);
    }, MODAL_ANIMATION_DURATION);
  }, []);

  const { openModal, closeAllModal } = useModal();
  const foods = [
    {
      ...food,
      quantity: Number(quantity),
    },
  ];

  // console.log(normalize);

  const createOrderBuyNow = async () => {
    if (!currentLocation) return;
    setBuyNowLoading(true);

    try {
      await api.post(`${endpoints.order.buyNow}`, {
        foodId: food.foodId,
        quantity,
        fromLatitude: currentLocation.latitude,
        fromLongitude: currentLocation.longitude,
        deliveredTo: currentLocation.address,
        note: note,
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

  const handleBuyNow = () => {
    if (isProcessing) {
      return;
    }

    const normalize = { shopName, shopId, note, foods };
    console.log(normalize);

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
          onClick={() => handleBuyNow()}
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
