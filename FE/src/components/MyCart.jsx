import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../contexts/CartContext";
import style from "../assets/styles/MyCart.module.css";
import shared from "../assets/styles/Shared.module.css";
import CartEmpty from "./common/CartEmpty";
import { getFormattedCartTotal } from "../util/cart";
import FloatingLabel from "./common/FloatingLabel";
import { userOrder } from "../contexts/OrderContext";
import { useFormattedLocation } from "../hooks/useFormatedLocation";
import { useLocation } from "../contexts/LocationContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import endpoints from "../api/endpoints";
import { useModal } from "../contexts/ModalContext";
import { toast } from "react-toastify";

function MyCart({ shopId, shopName, navigate }) {
  const { carts, removeFromCarts, increaseQuantity, decreaseQuantity,clearCart } =
    useCart();
  const { createOrder } = userOrder();
  const [currentShop, setCurrentShop] = useState(undefined);
  const cartDetailRef = useRef(null);
  const [note, setNote] = useState("");
  const location = useFormattedLocation();
  const { ready } = useLocation();
  const { closeAllModal } = useModal();
  console.log(typeof closeAllModal);
  

  // cập nhật giỏ hàng hiện tại theo shopId
  useEffect(() => {
    setCurrentShop(carts.find((item) => item.id === shopId));
  }, [shopId, carts]);

  // xử lý cuộn trong modal cart
  useEffect(() => {
    const cartDetail = cartDetailRef.current;
    if (!cartDetail) return;

    const handleWheel = (e) => {
      cartDetail.scrollTop += e.deltaY;
    };

    cartDetail.addEventListener("wheel", handleWheel, { passive: false });
    return () => cartDetail.removeEventListener("wheel", handleWheel);
  }, [currentShop]);

  const handleOrder = async (shopId, note) => {
    const isSuccess = await createOrder(shopId, note);
    if (isSuccess) {
      clearCart()
      toast.success("Đặt hàng thành công",{
        onClose: ()=>{
          closeAllModal()
          navigate('/buyer/orders')
        }
      });
      
    } else {
      toast.error("Đặt hàng thất bại, thử lại");
    }
  };

  const handleOnchange = (e) => {
    setNote(e.target.value);
  };

  return (
    <div className={style.cartContent}>
      <div className={style.header}>
        <h3>My cart</h3>
        <div className={style.address}>
          <div>
            <p className={shared.textDanger}>Delivered to</p>
            {location.address ? location.address : location}
          </div>
          <p className={`${style.edit} ${shared.textInfo}`}>Edit</p>
        </div>
      </div>

      {(currentShop && (
        <>
          <div className={style.cartDetail} ref={cartDetailRef}>
            <h4 className={style.shopName}>{shopName}</h4>
            <div className={style.foodList}>
              {currentShop.foods
                .slice()
                .reverse()
                .map((food) => (
                  <div className={style.foodItem} key={food.id}>
                    <img
                      className={style.img}
                      src={`${endpoints.image.food}/${food.foodImage}`}
                      alt={food.foodName}
                    />
                    <div className={style.quantityController}>
                      <button
                        onClick={() =>
                          increaseQuantity(food.id, currentShop.id)
                        }
                      >
                        <i className="bi bi-caret-up-fill"></i>
                      </button>
                      <h3>{food.quantity}</h3>
                      <button
                        onClick={() =>
                          decreaseQuantity(food.id, currentShop.id)
                        }
                      >
                        <i className="bi bi-caret-down-fill"></i>
                      </button>
                    </div>
                    <div className={style.price}>
                      <h2>{food.foodName}</h2>
                      <p>{food.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCarts(currentShop.id, food.id)}
                      className={style.btnDetele}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                ))}
            </div>

            {/* ============= ghi chú ============= */}
            <div className={style.note}>
              <FloatingLabel
                label="Ghi chú"
                textarea
                value={note}
                onChange={handleOnchange}
              />
            </div>
          </div>

          <div className={style.footer}>
            {ready ? (
              <button
                onClick={() => handleOrder(currentShop.id, note)}
                className={shared.submitBtn}
              >
                {getFormattedCartTotal(currentShop.foods)}
              </button>
            ) : (
              <button className={shared.disabledBtn}>
                <LoadingSpinner />
              </button>
            )}
          </div>
        </>
      )) || <CartEmpty />}
    </div>
  );
}

export default MyCart;
