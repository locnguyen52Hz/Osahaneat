import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../../features/location/components/LocationPicker";
import { useLocation } from "../../../contexts/LocationContext";
import Routing from "../../../components/Routing";
import { useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import styles from "../../../assets/styles/Nearest.module.css";
import MapContainerBase from "../../map/MapContainerBase";
import UserMarker from "../../map/UserMarker";
import ShopsMarker from "../../map/ShopsMarker";
import { latLng } from "leaflet";

function Nearest() {
  const { location, loading } = useLocation();
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
        <MapContainerBase center={[location.latitude, location.longitude]}>
          <UserMarker />
          <ShopsMarker shops={shopLocations} />
        </MapContainerBase>
      )}
    </div>
  );
}

export default Nearest;
