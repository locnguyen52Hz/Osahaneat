import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "./LocationPicker";
import { useLocation } from "../../../contexts/LocationContext";
import Routing from "../../../components/Routing";

function ShopLocation({ latitude, longitude }) {
  const { isLocationReady } = useLocation();
  // console.log(isLocationReady)
  return (
    <div
      style={{
        height: "400px",
        // width: "100%",
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isLocationReady && (
          <Routing
            from={[isLocationReady.latitude, isLocationReady.longitude]}
            to={[latitude, longitude]}
          />
        )}

        <LocationPicker />
      </MapContainer>
    </div>
  );
}

export default ShopLocation;
