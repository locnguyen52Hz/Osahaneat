import React, { useEffect } from "react";
import OrderCard from "./UpcomingOrderCard";

function InfiniteList({
  list,
  loadMoreOrders,
  loading,
  updateOrderStatus,
  status,
  flag,
}) {
  const styles = {
    cardList: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    },
  };

  useEffect(() => {
    const checkContentHeight = () => {
      if (!flag) return;
      if (document.body.scrollHeight <= window.innerHeight) {
        loadMoreOrders();
      }
    };
    checkContentHeight();
  }, [list]);

  useEffect(() => {
    if (!flag) return;
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        loadMoreOrders();
        console.log(window.innerHeight + window.scrollY);
        console.log(document.documentElement.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status, loadMoreOrders, loading]);

  return (
    <>
      {!loading && (
        <div style={styles.cardList}>
          {list.map((item) => (
            <OrderCard
              updateOrderStatus={updateOrderStatus}
              order={item}
              key={item.orderID}
            />
          ))}
        </div>
      )}

      {!flag && (
        <h1 style={{ display: "flex", justifyContent: "center" }}>Đã hết</h1>
      )}
      {/* {loading && <div style={{ marginTop: "20px" }}>Đang tải...</div>} */}
    </>
  );
}

export default InfiniteList;
