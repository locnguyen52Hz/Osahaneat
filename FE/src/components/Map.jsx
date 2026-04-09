import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../pages/Buyer/Location/LocationPicker";
import { useLocation } from "../contexts/LocationContext";
import Routing from "./Routing";
import { useEffect, useRef, useState } from "react";
import { apiGet } from "../api/api";
import endpoints from "../api/endpoints";

function Map() {
  const { isLocationReday } = useLocation();
  const [shopLocations, setShopLocations] = useState([]);
  const shopLocationsRef = useRef(null);
  console.log(shopLocations);

  //fetch shops location
  useEffect(() => {
    const fetchLocations = async () => {
      if (shopLocationsRef.current) {
        console.log("bỏ qua vì trùng dữ liệu cũ");
        setShopLocations(shopLocationsRef.current);
        return;
      }
      try {
        const res = await apiGet(`${endpoints.shop.locations}`);

        shopLocationsRef.current = res.data.data;

        setShopLocations(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocations();
  }, []);

  if (!isLocationReday) return;
  return (
    <MapContainer
      center={[isLocationReday.latitude, isLocationReday.longitude]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker />
      <Routing
        from={[isLocationReday.longitude, isLocationReday.latitude]}
        to={[105.835, 21.037]}
      />
    </MapContainer>
  );
}

export default Map;
