import { useLocation } from "../contexts/LocationContext";

export const useFormattedLocation = () => {
  const { isLocationReday, loading, error } = useLocation();


  if (loading) return "Đang lấy vị trí...";
  if (error) return error;
  if (!isLocationReday.address) return "Không xác định được vị trí";

  const { address} = isLocationReday;
  const { latitude, longitude } = isLocationReday;
  const formatedLocation = {
    address,
    latitude,
    longitude,
  };
  return formatedLocation
};
