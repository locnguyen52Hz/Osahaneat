import { getPreviousOrders } from "../service/OrderServices";
import styles from "../../../assets/styles/WrapperOrders.module.css";
import PreviousOrderCard from "./PreviousOrdersCard";
import OrdersList from "./OrdersList";
import useOrders from "../hooks/useOrders";
import useOrderActions from "../hooks/useOrderActions";
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
