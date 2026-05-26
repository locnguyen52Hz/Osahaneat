import { useLocation } from "../contexts/LocationContext";

export const useFormattedLocation = () => {
  const { location, loading, error } = useLocation();

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

  if (!location) {
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
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    message: null,
  };
};