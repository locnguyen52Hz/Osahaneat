import styles from "../../../assets/styles/OrderDetails.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import AddressDisplay from "../../../components/common/AddressDisplay";
import { OrderDetailsViewProps } from "../../../types/order/OrderDetailsViewProps";
import { formatCurrency } from "../../../util/format";
import FoodItems from "../../foods/components/FoodItems";
import StatusBadge from "./StatusBadge";

function OrderDetailsView({
  order,
  foods,
  loadingItems,
  footer,
  handleSelectAddress,
}: OrderDetailsViewProps) {
  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={shared.h5}>Order Details</h2>

        {order.orderId && (
          <p>
            #{order.orderId}{" "}
            {order.status && (
              <StatusBadge status={order.status} size={"10px"} />
            )}
          </p>
        )}

        <AddressDisplay
          address={order.deliveredTo}
          onClick={handleSelectAddress}
          border
        />
        <h4 className={styles.shopName}>{order.shopName}</h4>
      </div>

      {/* DETAILS */}
      <div className={styles.details}>
        <div className={styles.list}>
          {loadingItems && <p>Loading...</p>}
          {foods.length > 0 && <FoodItems listItem={foods} />}
        </div>

        <div className={styles.pay}>
          <div>
            <p>Subtotal</p>
            <p>{formatCurrency(order.subtotal)}</p>
          </div>
          <div>
            <p>Delivery fee</p>
            <p>{formatCurrency(order.shippingFee)}</p>
          </div>
          <div>
            <p>Total</p>
            <p>{formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        {order.note && (
          <div className={styles.note}>
            <h3>
              <u>Note</u>
            </h3>
            <p className={`${shared.paragraph} ${shared.bgLight}`}>
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* FOOTER (inject từ ngoài) */}
      <div className={styles.footer}>{footer}</div>
    </div>
  );
}

export default OrderDetailsView;
