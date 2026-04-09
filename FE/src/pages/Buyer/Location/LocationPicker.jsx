import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import { useLocation } from "../../../contexts/LocationContext";
import { useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { map } from "leaflet";

function LocationPicker() {
  const { isLocationReday, setMyLocation } = useLocation();
  const [shops, setShops] = useState([]);

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
        console.log(res.data);
        setShops(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocations();
  }, []);



  const map = useMapEvents({
  click: async (e) => {
    const { lat, lng } = e.latlng;

    // zoom tới vị trí vừa click
    map.flyTo([lat, lng]);

    const res = await fetch(
      `http://localhost:5000/route/v1/driving/${lng},${lat};106.7009,10.7769?overview=full&geometries=geojson`,
      {
        headers: {
          "Accept-Language": "vi",
        },
      }
    );
    console.log(res)

    const resAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)

    const data = await resAddress.json();
    console.log(data)
    setMyLocation({
      address: data.display_name,
      latitude: lat,
      longitude: lng,
    });
  },
});

  if (!isLocationReday || !isLocationReday.latitude || !isLocationReday.longitude) {
    return null;
  }

  return (
    <>
      {/* Marker vị trí user chọn */}
      {isLocationReday?.latitude && isLocationReday?.longitude && (
        <Marker
          position={[isLocationReday.latitude, isLocationReday.longitude]}
          icon={redIcon}
        >
          <Popup>{isLocationReday.address || "Bạn đang ở đây"}</Popup>
        </Marker>
      )}

      {/* Marker danh sách shop */}
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
