import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import { useLocation } from "../../../contexts/LocationContext";
import { useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import L from "leaflet";
import useReverseGeocode from "../../../hooks/useReverseGeocode";
import { toast } from "react-toastify";

function LocationPicker() {
  const { isLocationReady, setMyLocation } = useLocation();
  const [shops, setShops] = useState([]);

  const { fetchAddress, data, error, isLoading } = useReverseGeocode();

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await apiGet(`${endpoints.shop.locations}`);
        setShops(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocations();
  }, []);

  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      map.flyTo([lat, lng]);
      fetchAddress(lat, lng);
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {/* Marker user */}
      {isLocationReady?.latitude && isLocationReady?.longitude && (
        <Marker
          position={[isLocationReady.latitude, isLocationReady.longitude]}
          icon={redIcon}
        >
          <Popup>Bạn đang ở đây</Popup>
        </Marker>
      )}

      {/* Marker shops */}
      {shops.map((shop) => (
        <Marker key={shop.shopID} position={[shop.latitude, shop.longitude]}>
          <Popup>
            <strong>{shop.shopName}</strong>
          </Popup>

          <Tooltip direction="center">{shop.address}</Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default LocationPicker;
