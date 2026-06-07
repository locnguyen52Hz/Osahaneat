import { toast } from "react-toastify";
import { apiPost } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { updateOrderStatus } from "../service/OrderServices";

function useOrderActions(setState) {
  //  Cancel order
  const cancelOrder = async (orderId) => {
    let snapshot;

    setState((prev) => {
      snapshot = prev;

      const newOrders = prev.orders.filter((o) => o.orderId !== orderId);

      //  page rỗng
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

    try {
      await updateOrderStatus(orderId, "CANCELLED");
      toast.success("Order cancelled");
    } catch (err) {
      setState(snapshot); // rollback toàn bộ
      toast.error("Cancel failed");
    }
  };

  //  Rating
  const rateOrder = async (orderId, rating) => {
    let snapshot;

    console.log("rating:", rating);
    console.log("orderId:", orderId);
    setState((prev) => {
      snapshot = prev;

      return {
        ...prev,
        orders: prev.orders.map((o) =>
          o.orderId === orderId ? { ...o, rating } : o,
        ),
      };
    });

    try {
      // await apiPost(endpoints.order.createRating, { orderId, rating });
      toast.success("Rating success");
    } catch (err) {
      setState(snapshot);
      toast.error("Rating failed");
    }
  };

  return {
    cancelOrder,
    rateOrder,
  };
}

export default useOrderActions;
