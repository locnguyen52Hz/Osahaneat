import { useLocation } from "../contexts/LocationContext";

export const useFormattedLocation = () => {
  const { location, loading, error } = useLocation();

  if (loading) return "Đang lấy vị trí...";
  if (error) return error;
  if (!location?.address) return "Không xác định được vị trí";

  const { city, country, town, village, city_district } = location.address;
  const { latitude, longitude } = location;
  const formatedLocation = {
    address: `${town || village || city_district}, ${city}, ${country}`,
    latitude,
    longitude,
  };


  return formatedLocation
};
