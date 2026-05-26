import React, { useEffect, useState } from "react";
import endpoints from "../../../api/endpoints";
import UpcomingOrderCard from "../../orders/components/UpcomingOrderCard";
import { apiGet } from "../../../api/api";
import styles from "../../../assets/styles/WrapperOrders.module.css";
import Paginate from "../../../components/common/Paginate";
import { updateOrderStatus, getUpcomingOrders } from "../service/OrderServices";
import { toast } from "react-toastify";
import { useModal } from "../../../contexts/ModalContext";

function UpcomingOrders() {
  const [loading, setLoading] = useState(true);
  const [upcomingOrders, setUpcomningOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const { closeAllModal } = useModal();

  const handleCancelOrder = async (orderId) => {
    fetchUpcomingOrders();
    try {
      const res = await updateOrderStatus(orderId, "CANCELLED");
      console.log(res);
      toast.success(`Order cancelled successfully`);
      closeAllModal();
    } catch (error) {
      console.log(error);
      toast.error(`Cancelled failed`);
    }
  };

  const handleOnchangePage = (newPage) => {
    setCurrentPage(newPage.selected);
  };

  useEffect(() => {
    fetchUpcomingOrders();
  }, [currentPage]);

  const fetchUpcomingOrders = async () => {
    setLoading(true);
    try {
      const res = await getUpcomingOrders(currentPage);
      const { list, page, size, totalElement, totalPages } = res;

      setTotalElement(totalElement);
      setUpcomningOrders(list);
      setCurrentPage(page);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <h5>Upcoming Orders ({totalElement})</h5>
      <div className={styles.orderList}>
        {upcomingOrders.map((order) => (
          <div className={styles.item} key={order.orderId}>
            <UpcomingOrderCard
              order={order}
              handleCancelOrder={handleCancelOrder}
            />
          </div>
        ))}
      </div>
      {totalPages > 0 && (
        <Paginate
          forcePage={currentPage}
          onPageChange={handleOnchangePage}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
        />
      )}
    </div>
  );
}

export default UpcomingOrders;
