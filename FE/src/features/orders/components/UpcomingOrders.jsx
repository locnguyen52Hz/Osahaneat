import React, { useEffect, useState } from "react";
import UpcomingOrderCard from "../../orders/components/UpcomingOrderCard";

import Paginate from "../../../components/common/Paginate";
import { updateOrderStatus, getUpcomingOrders } from "../service/OrderServices";
import { useModal } from "../../../contexts/ModalContext";
import OrdersList from "./OrdersList";
import useOrders from "../hooks/useOrders";
import useOrderActions from "../hooks/useOrderActions";
import { toast } from "react-toastify";

function UpcomingOrders() {
  const { loading, state, setState, setCurrentPage } =
    useOrders(getUpcomingOrders);
  // console.log(state);

  // const { cancelOrder } = useOrderActions(setState);

  const { closeAllModal } = useModal();

  const handleCancel = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "CANCELLED");

      setState((prev) => {
        const newOrders = prev.orders.filter((o) => o.orderId !== orderId);

        let newPage = prev.currentPage;
        if (newOrders.length === 0 && prev.currentPage > 0) {
          newPage = prev.currentPage - 1;
        }

        return {
          ...prev,
          orders: newOrders,
          totalElement: prev.totalElement - 1,
          currentPage: newPage,
        };
      });

      toast.success("Hủy thành công");
      closeAllModal();
    } catch (error) {
      toast.error("Hủy thất bại");
    }
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
