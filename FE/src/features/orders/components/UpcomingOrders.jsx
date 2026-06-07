import React, { useEffect, useState } from "react";
import UpcomingOrderCard from "../../orders/components/UpcomingOrderCard";
import styles from "../../../assets/styles/WrapperOrders.module.css";
import Paginate from "../../../components/common/Paginate";
import { updateOrderStatus, getUpcomingOrders } from "../service/OrderServices";
import { useModal } from "../../../contexts/ModalContext";
import OrdersList from "./OrdersList";
import useOrders from "../hooks/useOrders";
import useOrderActions from "../hooks/useOrderActions";

function UpcomingOrders() {
  const { loading, state, setState, setCurrentPage } =
    useOrders(getUpcomingOrders);


  const { cancelOrder } = useOrderActions(setState);
  const { closeAllModal } = useModal();

  const handleCancel = async (orderId) => {
    await cancelOrder(orderId);
    closeAllModal();
  };

  return (
    <OrdersList
      title="Upcoming Orders"
      orders={state.orders}
      loading={loading}
      currentPage={state.currentPage}
      totalPages={state.totalPages}
      totalElement={state.totalElement}
      onPageChange={setCurrentPage}
      renderItem={(order) => (
        <UpcomingOrderCard
          order={order}
          handleCancelOrder={() => handleCancel(order.orderId)}
        />
      )}
    />
    // <></>
  );
}
export default UpcomingOrders;
