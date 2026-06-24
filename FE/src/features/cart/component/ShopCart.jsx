import React from "react";
import styles from "../../../assets/styles/ShopCart.module.css";
import CartItem from "./CartItem";
import { formatCurrency } from "../../../util/format";
import { useCartStore } from "../../../stores/Cart/useCartStore";
function ShopCart({
  name,
  cartId,
  address,
  items,
  shippingFee,
  isSelected,
  onSelect,
  totalPrice,
  shopId,
}) {
  const removeCart = useCartStore((s) => s.removeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // console.log(carts);
  const handleUpdateQuantity = (foodId, quantity) => {
    updateQuantity(shopId, foodId, quantity);
  };

  const handleRemoveItem = (foodId) => {
    removeItem(shopId, foodId);
  };
  return (
    <div
      className={`${styles.wrapper} ${isSelected ? styles.isSelected : ""}`}
      onClick={() => {
        onSelect(cartId);
      }}
    >
      <div className={styles.header}>
        <div className={styles.shopAddress}>
          <span className={styles.name}>{name} - </span>
          <span className={styles.address}>{address}</span>
        </div>
        <div className={styles.addNewItem}>
          <p>Thêm món</p>
          <i className="bi bi-plus-circle"></i>
        </div>
      </div>
      <div className={styles.body}>
        {items.map((item) => (
          <CartItem
            item={item}
            key={item.foodId}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.total}>
          <p>Tổng cộng cửa hàng</p>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
        <i
          className={`bi bi-trash3  ${styles.trashIcon}`}
          onClick={(e) => {
            e.stopPropagation();
            removeCart(shopId);
          }}
        ></i>
      </div>
    </div>
  );
}

export default ShopCart;
