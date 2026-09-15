import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../../../assets/styles/MyCartPage.module.css";
import "../../../assets/styles/variables.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useCartStore } from "../../../stores/Cart/useCartStore";
import { calculateCartTotal } from "../../../util/cart";
import OrderSummary from "../../cart/component/OrderSummary";
import ShopCart from "../../cart/component/ShopCart";

import CartEmpty from "../../cart/component/CartEmpty";

import { toast } from "react-toastify";
import { useModal } from "../../../contexts/ModalContext";
import useShippingFee from "../../../hooks/useShippingFee";
import { useLocationStore } from "../../../stores/location/useLocationStore";
import { CheckoutCart } from "../../../types/cart/CheckoutCart";
import OrderActions from "../../orders/components/OrderActions";
import OrderDetailsView from "../../orders/components/OrderDetailsView";

function MyCartPage() {
  const { showSideBar } = useOutletContext<{ showSideBar: boolean }>();

  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);

  const carts = useCartStore((s) => s.carts);

  const createOrderFromCart = useCartStore((s) => s.createOrderFromCart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const isLoading = useCartStore((s) => s.isLoading);
  const totalCartItem = useCartStore((s) => s.totalCartItem);

  const currentLocation = useLocationStore((s) => s.currentLocation);
  const loading = useLocationStore((s) => s.loading);

  const cartShippingLoading = useLocationStore((s) => s.cartShippingLoading);

  const { openModal } = useModal();
  const visibleCarts = carts.filter((c) => c.cartItems.length > 0);

  const selectedCart = visibleCarts.find(
    (shop) => shop.shopId === selectedCartId,
  );

  const isLoadingShippingFee = useShippingFee(
    selectedCart,
    currentLocation,
    loading,
  );

  const navigate = useNavigate();
  const { closeAllModal } = useModal();
  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(
    () => (selectedCart ? calculateCartTotal(selectedCart.cartItems) : 0),
    [selectedCart],
  );

  const onCheckoutCart = async (cart: CheckoutCart) => {
    try {
      await createOrderFromCart(cart);

      closeAllModal();

      toast.success("Đặt hàng thành công", {
        onClose: () => {
          navigate("/buyer/orders/upcoming");
        },
      });
    } catch (error) {
      console.error(error);

      toast.error("Đặt hàng thất bại");
    }
  };

  const handleOpenCheckout = () => {
    console.log(carts);
    if (loading || cartShippingLoading || !selectedCart?.shippingFee) return;
    const shippingFee = selectedCart.shippingFee;
    const cart = {
      ...selectedCart,
      subtotal,
      shippingFee,
      totalAmount: subtotal + selectedCart.shippingFee,
      deliveredTo: currentLocation.address,
      fromLatitude: currentLocation.latitude,
      fromLongitude: currentLocation.longitude,
    };

    openModal(
      <OrderDetailsView
        order={cart}
        foods={cart.cartItems}
        footer={
          <OrderActions action={() => onCheckoutCart(cart)} label="Đặt hàng" />
        }
      />,
      {
        type: "slide",
      },
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (visibleCarts.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageContent}>
          <div className={styles.empty}>
            <CartEmpty />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        {visibleCarts.length > 0 && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Giỏ hàng của bạn</h1>
              {!isLoading && (
                <p>
                  Bạn đang có {totalCartItem} món ăn từ {visibleCarts.length}{" "}
                  cửa hàng
                </p>
              )}
            </div>

            <div className={styles.body}>
              <div className={styles.details}>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  visibleCarts.map((cart) => (
                    <ShopCart
                      key={cart.shopId}
                      name={cart.shopName}
                      cartId={cart.id}
                      shopId={cart.shopId}
                      address={cart.address}
                      shippingFee={cart.shippingFee}
                      items={cart.cartItems}
                      isSelected={selectedCartId === cart.shopId}
                      onSelect={() => setSelectedCartId(cart.shopId)}
                      totalPrice={calculateCartTotal(cart.cartItems)}
                    />
                  ))
                )}
              </div>

              <div
                className={`${styles.checkout} ${
                  showSideBar ? styles.sidebarOpen : ""
                }`}
              >
                <OrderSummary
                  loadingShippingFee={isLoadingShippingFee}
                  shippingFee={selectedCart?.shippingFee}
                  subtotal={subtotal}
                  onOpenCheckout={handleOpenCheckout}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyCartPage;
