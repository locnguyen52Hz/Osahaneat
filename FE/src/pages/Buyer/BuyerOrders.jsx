import React, { useEffect, useState } from "react";
import shared from "../../assets/styles/Shared.module.css";
import styles from "../../assets/styles/BuyerOrders.module.css";
import Select from "../../components/common/Select";
import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import OrderStatusIcon from "../../components/common/OrderStatusIcon";

function BuyerOrders() {
  const stt = ["pending", "processing", "shipping", "completed", "cancelled"];
  const [filterMode, setFilterMode] = useState(stt[0]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  console.log(orders);
  const handleOnchange = (value) => {
    console.log(value);
    setFilterMode(value);
  };

  useEffect(() => {
    const controller = new AbortController();
    console.log("call api");
    const fetchData = async () => {
      try {
        const res = await apiGet(`${endpoints.order.get_orders}/${filterMode}`);
        // console.log(res.data);
        setOrders(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [filterMode]);

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <Select
          handleOnchange={handleOnchange}
          array={stt}
          selected={filterMode}
        />
      </div>
      <div className={styles.cardList}>
        {!loading
          ? orders.map((item) => (
              <div className={styles.cardOrder} key={item.orderID}>

                {/* card header */}
                <div className={styles.cardHeader}>
                  <p className={`${shared.titleText} `}>{item.shopName}</p>
                  <OrderStatusIcon status={filterMode} />
                </div>

                {/* card body */}
                <div className={styles.cardBody}>
                  <i className="bi bi-map"></i>
                  <div className={styles.distance}>
                    <p className={`${shared.paragraphColor} ${shared.small}`}>Distance</p>
                    <h2>10 km</h2>
                  </div>
                  <button className={styles.orderDetailBtn}>Detail</button>
                </div>
                {/* card footer */}
                <div></div>
              </div>
            ))
          : "Đang tải"}
      </div>
    </div>
  );
}

export default BuyerOrders;
