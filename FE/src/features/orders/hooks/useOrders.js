import { useEffect, useState, useCallback } from "react";

function useOrders(fetchFunction) {
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    orders: [],
    currentPage: 0,
    totalPages: 0,
    totalElement: 0,
  });
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFunction(state.currentPage);
      const { list, totalPages, totalElement } = res;

      setState((prev) => ({
        ...prev,
        orders: list,
        totalPages,
        totalElement,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, state.currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // change page
  const setCurrentPage = (page) => {
    setState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  return {
    loading,
    state,
    setState, // dùng cho advanced mutate
    setCurrentPage,
    refetch: fetchOrders,
  };
}

export default useOrders;
