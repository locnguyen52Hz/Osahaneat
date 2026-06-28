import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../../features/location/components/LocationPicker";
import Routing from "../../../components/Routing";
import { useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import styles from "../../../assets/styles/Nearest.module.css";
import MapContainerBase from "../../map/MapContainerBase";
import UserMarker from "../../map/UserMarker";
import ShopsMarker from "../../map/ShopsMarker";
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
        const res = await apiGet(endpoints.shop.locations);
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
          <UserMarker />
          <ShopsMarker shops={shopLocations} />
        </MapContainerBase>
      )}
    </div>
  );
}

export default Nearest;
