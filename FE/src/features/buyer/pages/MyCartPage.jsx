import React, { useEffect, useMemo, useState } from "react";
import styles from "../../../assets/styles/MyCartPage.module.css";
import ShopCart from "../../cart/component/ShopCart";
import OrderSummary from "../../cart/component/OrderSummary";
import { useOutletContext } from "react-router-dom";
import "../../../assets/styles/variables.css";
import { useCartStore } from "../../../stores/Cart/useCartStore";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { calculateCartTotal } from "../../../util/cart";
import { useLocation } from "../../../contexts/LocationContext";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import CartEmpty from "../../cart/component/CartEmpty";
import useQuantity from "../../../hooks/useQuantity";
import { MAX_QUANTITY_FOOD, MIN_QUANTITY_FOOD } from "../../../constants";

function MyCartPage() {
  const { showSideBar } = useOutletContext();
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [isLoadingShippingFee, setIsLoadingShippingFee] = useState(false);

  const carts = useCartStore((s) => s.carts);

  const visibleCarts = carts.filter((c) => c.cartItems.length > 0);

  const isLoading = useCartStore((s) => s.isLoading);
  const totalCartItem = useCartStore((s) => s.totalCartItem);
  const updateShippingFee = useCartStore((s) => s.updateShippingFee);

  const { location, loading } = useLocation();
  const { quantity, decrease, increase, handleChange, handleBlur } =
    useQuantity(MIN_QUANTITY_FOOD, MAX_QUANTITY_FOOD);

  const selectedShop = visibleCarts.find(
    (shop) => shop.shopId === selectedCartId,
  );

  const subTotal = useMemo(
    () => (selectedShop ? calculateCartTotal(selectedShop.cartItems) : 0),
    [selectedShop],
  );

  useEffect(() => {
    if (loading || !selectedShop || !location) return;

    // Đã fetch rồi thì không gọi nữa
    if (selectedShop.shippingFee != null) return;

    const controller = new AbortController();

    const fetchShippingFee = async () => {
      setIsLoadingShippingFee(true);

      try {
        const res = await apiGet(
          `${endpoints.routes.shippingFee}?fromLongitude=${location.longitude}&fromLatitude=${location.latitude}&shopID=${selectedShop.shopId}`,
          {
            signal: controller.signal,
          },
        );

        updateShippingFee(selectedShop.shopId, res.data.data);
      } catch (error) {
        const isCanceled =
          error.name === "AbortError" || error.name === "CanceledError";

        if (!isCanceled) {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingShippingFee(false);
        }
      }
    };

    fetchShippingFee();

    return () => {
      controller.abort();
    };
  }, [
    loading,
    selectedShop,
    location?.latitude,
    location?.longitude,
    updateShippingFee,
  ]);

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
                  visibleCarts.map((shop) => (
                    <ShopCart
                      key={shop.shopId}
                      name={shop.shopName}
                      cartId={shop.id}
                      shopId={shop.shopId}
                      address={shop.address}
                      shippingFee={shop.shippingFee}
                      items={shop.cartItems}
                      isSelected={selectedCartId === shop.shopId}
                      onSelect={() => setSelectedCartId(shop.shopId)}
                      totalPrice={calculateCartTotal(shop.cartItems)}
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
                  shippingFee={selectedShop?.shippingFee ?? 0}
                  subTotal={subTotal}
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
