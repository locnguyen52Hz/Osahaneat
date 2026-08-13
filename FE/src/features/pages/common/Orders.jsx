import React, { useEffect, useState } from "react";
import styles from "../../../assets/styles/Orders.module.css";
import { apiGet, apiPatch } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { ORDER_STATUS } from "../../orders/config/OrdersStatusConfig";
import { groupOrdersByDateArray } from "../../../util/grouped";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import UpcomingOrders from "../../orders/components/UpcomingOrders";
import PreviousOrders from "../../orders/components/PreviousOrders";

function Orders() {
  return (
    <div className={styles.container}>
      <UpcomingOrders />

      <PreviousOrders />
    </div>
  );
}

export default Orders;
