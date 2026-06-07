import React from "react";
import Paginate from "../../../components/common/Paginate";
import styles from "../../../assets/styles/WrapperOrders.module.css";

function OrdersList({
  title,
  orders,
  loading,
  currentPage,
  totalPages,
  totalElement,
  onPageChange,
  renderItem,
}) {
  return (
    <div className={styles.container}>
      <h5>
        {title} ({totalElement})
      </h5>

      <div className={styles.orderList}>
        {!loading &&
          orders.map((order) => (
            <div className={styles.item} key={order.orderId}>
              {renderItem(order)}
            </div>
          ))}
      </div>

      {totalPages > 0 && (
        <Paginate
          forcePage={currentPage}
          onPageChange={(e) => onPageChange(e.selected)}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
        />
      )}
    </div>
  );
}

export default OrdersList;
