import { useEffect, useState } from "react";
import { api} from "../../../api/api";
import endpoints from "../../../api/endpoints";

export default function useOrderTimeline(orderId) {

  const [loadingTimeLine, setLoadingTimeline] = useState(true);
  const [timeline, setTimeline] = useState({
    currentStatus: "",
    statuses: [],
  });

  const fetchOrderTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await api(
        `${endpoints.order.timeline}?orderId=${orderId}`,
      );
      // console.log(res.data.data);
      setTimeline(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    fetchOrderTimeline();
  }, []);

  return {
    loadingTimeLine,
    timeline,
    fetchOrderTimeline
  };
}
