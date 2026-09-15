import { useEffect, useState } from "react";
import { getTimeLine } from "../service/orderApi";

export default function useOrderTimeline(orderId) {
  const [loadingTimeLine, setLoadingTimeline] = useState(true);
  const [timeline, setTimeline] = useState({
    currentStatus: "",
    statuses: [],
  });

  const fetchOrderTimeline = async () => {
    setLoadingTimeline(true);
    try {
      setTimeline(await getTimeLine(orderId));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    fetchOrderTimeline();
  }, [orderId]);

  return {
    loadingTimeLine,
    timeline,
    fetchOrderTimeline,
  };
}
