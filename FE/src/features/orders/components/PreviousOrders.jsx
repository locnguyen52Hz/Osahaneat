import React, { useEffect, useState } from "react";
import PreviousOrdersCard from "./PreviousOrdersCard";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import styles from "../../../assets/styles/WrapperOrders.module.css";

function PreviousOrders() {
  const [loading, setLoading] = useState(false);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
console.log(previousOrders)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apiGet(
          `${endpoints.order.previous}?page=${currentPage}`,
        );

        const { list, page, totalElement, totalPages } = res.data.data;
        console.log(res.data.data)
        setPreviousOrders(list);
        setCurrentPage(page);
        setTotalElement(totalElement);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentPage]);

  return (
    <div className={styles.container}>
      <h5>Previous orders ({totalElement})</h5>
      <div className={styles.orderList}>
        {!loading &&
          previousOrders.map((order) => (
            <div className={styles.item} key={order.orderId}>
              <PreviousOrdersCard order={order} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default PreviousOrders;
