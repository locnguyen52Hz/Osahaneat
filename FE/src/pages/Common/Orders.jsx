import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/Orders.module.css";
import Select from "../../components/common/Select";
import { apiGet, apiPatch } from "../../api/api";
import endpoints from "../../api/endpoints";
import { ORDER_STATUS } from "../../config/OrdersStatusConfig";
import InfiniteList from "../../components/InfiniteList";
import { groupOrdersByDateArray } from "../../util/grouped";
import OrderCard from "../../components/OrderCard";
import Paginate from "../../components/common/Paginate";
import { useSearchParams } from "react-router-dom";

function Orders() {
  const listStatus = Object.keys(ORDER_STATUS).map((stt) => stt);

  const [filterMode, setFilterMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [flag, setFlag] = useState(true);
  console.log(orders);
  // console.log(page);

  const handleOnchange = (value) => {
    // console.log(value);
    setFilterMode(value);
  };

  const handleOnChangePage = (newPage) => {
    setPage(newPage.selected);
  };

  const updateOrderStatus = async (orderID, newStatus) => {
    console.log(orderID);
    console.log(newStatus);
    const validStatus = ["CANCELLED", "PROCESSING", "SHIPPING", "COMPLETED"];

    if (!validStatus.includes(newStatus)) throw new Error("Invalid action");

    setOrders((prevOrders) =>
      prevOrders?.list?.map((order) =>
        order.orderID === orderID ? { ...order, status: newStatus } : order
      )
    );
  };

  useEffect(() => {

    // setOrders([])
    setLoading(true);

    const fetchData = async () => {
      try {
        const res =
          filterMode === "all"
            ? await apiGet(
                `${endpoints.order.get_orders}/${filterMode}?page=${page}`
              )
            : await apiGet(
                `${endpoints.order.get_orders}?status=${filterMode}&page=${page}`
              );
        setOrders(res.data.data);
        setFlag(true);
      } catch (error) {
        console.log(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
 
  }, [filterMode, page]);

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <Select
          handleOnchange={handleOnchange}
          array={listStatus}
          selected={filterMode}
        />
      </div>
      <div className={styles.orderList}>
        {orders?.list?.map((order) => (
          <div key={order.orderID}>
            <OrderCard order={order} updateOrderStatus={updateOrderStatus} />
          </div>
        ))}
      </div>
      <Paginate
        pageCount={orders?.totalPages}
        onPageChange={handleOnChangePage}
      />
    </div>
  );
}

export default Orders;
