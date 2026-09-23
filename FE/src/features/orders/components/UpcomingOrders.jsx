import UpcomingOrderCard from "../../orders/components/UpcomingOrderCard";

import { toast } from "react-toastify";
import { useModal } from "../../../contexts/ModalContext";
import useOrders from "../hooks/useOrders";
import OrdersList from "./OrdersList";
import { getUpcomingOrders, updateOrderStatus } from "../service/orderApi";

function UpcomingOrders() {
  const { loading, state, setState, setCurrentPage } =
    useOrders(getUpcomingOrders);
  // console.log(state);

  // const { cancelOrder } = useOrderActions(setState);

  const { closeAllModal } = useModal();

  const handleCancel = async (orderId) => {
    console.log(orderId);
    try {
      const res = await updateOrderStatus(orderId, "CANCELLED");
      console.log(res.data);
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
      console.log(error);
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
