import { useLocationStore } from "../stores/location/useLocationStore";

export const useFormattedLocation = () => {
  const currentLocation = useLocationStore((s) => currentLocation);
  const loading = useLocationStore((s) => loading);
  const error = useLocationStore((s) => error);

  if (loading) {
    return {
      loading: true,
      error: null,
      address: null,
      latitude: null,
      longitude: null,
      message: "Đang lấy vị trí...",
    };
  }

  if (error) {
    return {
      loading: false,
      error,
      address: null,
      latitude: null,
      longitude: null,
      message: error,
    };
  }

  if (!currentLocation) {
    return {
      loading: false,
      error: null,
      address: null,
      latitude: null,
      longitude: null,
      message: "Không xác định được vị trí",
    };
  }

  return {
    loading: false,
    error: null,
    address: currentLocation.address,
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    message: null,
  };
};
