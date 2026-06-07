import { useEffect, useState, useCallback } from "react";

function usePaginatedFetch(fetchFunction) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElement, setTotalElement] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFunction(currentPage);

      // normalize response (rất quan trọng để reuse)
      const { list, page, totalElement, totalPages } = res;

      setData(list);
      setCurrentPage(page);
      setTotalElement(totalElement);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    data,
    setData, // dùng cho optimistic update
    currentPage,
    totalPages,
    totalElement,
    setCurrentPage,
    refetch: fetchData,
  };
}

export default usePaginatedFetch;