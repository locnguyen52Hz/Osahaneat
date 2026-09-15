import React from "react";
import styles from "../../../assets/styles/ProductTable.module.css";
import endpoints from "../../../api/endpoints";

function ProductTable({ orderItems }) {
  return (
    <>
      <table className={styles.orderTable}>
        <colgroup>
          <col className={styles.productCol} />
          <col className={styles.quantityCol} />
          <col className={styles.priceCol} />
          <col className={styles.totalCol} />
        </colgroup>

        <thead>
          <tr className={styles.titleRow}>
            <th colSpan={4}>
              <div className={styles.tableHeader}>
                <span>Danh sách sản phẩm</span>
                <span>{orderItems.length} món</span>
              </div>
            </th>
          </tr>

          <tr>
            <th className={`${styles.productCol} ${styles.titleCol}`}>
              Sản phẩm
            </th>
            <th className={`${styles.quantityCol} ${styles.titleCol}`}>
              Số lượng
            </th>
            <th className={`${styles.priceCol} ${styles.titleCol}`}>Đơn giá</th>
            <th className={`${styles.totalCol} ${styles.titleCol}`}>
              Thành tiền
            </th>
          </tr>
        </thead>

        <tbody>
          {orderItems.map((item) => (
            <tr className={styles.row} key={item.foodId}>
              <td className={styles.productCol}>
                <div className={styles.productCell}>
                  <img
                    className={styles.foodImage}
                    src={`${endpoints.image.food}/${item.image}`}
                    alt=""
                  />

                  <p className={styles.foodName}>{item.foodName}</p>
                </div>
              </td>
              <td className={styles.quantityCol}>{item.quantity}</td>
              <td className={styles.priceCol}>{item.price}</td>
              <td className={styles.totalCol}>{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductTable;
