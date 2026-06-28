import { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import endpoints from "../api/endpoints";
import { useCartStore } from "../stores/Cart/useCartStore";

export default function useShippingFee(selectedCart, currentLocation, loading) {
  const updateShippingFee = useCartStore((s) => s.updateShippingFee);

  const [isLoadingShippingFee, setIsLoadingShippingFee] = useState(false);

  useEffect(() => {
    if (loading || !selectedCart || !currentLocation) return;

    if (selectedCart.shippingFee != null) return;

    const controller = new AbortController();

    const fetchShippingFee = async () => {
      setIsLoadingShippingFee(true);

      try {
        const res = await apiGet(
          `${endpoints.routes.shippingFee}?fromLongitude=${currentLocation.longitude}&fromLatitude=${currentLocation.latitude}&shopID=${selectedCart.shopId}`,
          { signal: controller.signal },
        );

        updateShippingFee(selectedCart.shopId, res.data.data);
      } catch (error) {
        if (error.name !== "AbortError" && error.name !== "CanceledError") {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingShippingFee(false);
        }
      }
    };

    fetchShippingFee();

    return () => controller.abort();
  }, [
    loading,
    selectedCart?.shopId,
    currentLocation?.latitude,
    currentLocation?.longitude,
  ]);

  return isLoadingShippingFee;
}
