import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../location/components/LocationPicker";
import Routing from "../../../components/Routing";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import styles from "../../../assets/styles/Nearest.module.css";
import MapContainerBase from "../../map/MapContainerBase";
import UserMarker from "../../map/UserMarker";
import ShopMarker from "../../map/ShopMarker";
import { latLng } from "leaflet";
import { useLocationStore } from "../../../stores/location/useLocationStore";

function Nearest() {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const loading = useLocationStore((s) => s.loading);

  const [shopLocations, setShopLocations] = useState([]);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fetchShopLocations = async () => {
      try {
        const res = await api.get(endpoints.shop.locations);
        setShopLocations(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShopLocations();
  }, []);

  return (
    <div className={styles.container}>
      {!loading && (
        <MapContainerBase
          center={[currentLocation.latitude, currentLocation.longitude]}
        >
          <UserMarker
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
          />
          {shopLocations.map((shop) => (
            <ShopMarker
              key={shop.shopId}
              latitude={shop.latitude}
              longitude={shop.longitude}
              popup={shop.shopName}
              tooltip={shop.shopAddress}

            />
          ))}
        </MapContainerBase>
      )}
    </div>
  );
}

export default Nearest;
