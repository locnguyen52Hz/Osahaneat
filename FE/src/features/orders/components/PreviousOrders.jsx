import useOrderActions from "../hooks/useOrderActions";
import useOrders from "../hooks/useOrders";
import { getPreviousOrders } from "../service/orderApi";
import OrdersList from "./OrdersList";
import PreviousOrdersCard from "./PreviousOrdersCard";

function PreviousOrders() {
  const { loading, state, setState, setCurrentPage } =
    useOrders(getPreviousOrders);

  const { rateOrder } = useOrderActions(setState);

  return (
    <OrdersList
      title="Previous Orders"
      orders={state.orders}
      loading={loading}
      currentPage={state.currentPage}
      totalPages={state.totalPages}
      totalElement={state.totalElement}
      onPageChange={setCurrentPage}
      renderItem={(order) => (
        <PreviousOrdersCard
          order={order}
          submitRating={(rating) => rateOrder(order.orderId, rating)}
        />
      )}
    />
  );
}

export default PreviousOrders;
