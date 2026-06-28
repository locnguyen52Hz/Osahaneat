import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "./LocationPicker";
import Routing from "../../../components/Routing";
import { useLocationStore } from "../../../stores/location/useLocationStore";

function ShopLocation({ latitude, longitude }) {
  const currentLocation = useLocationStore((s) => s.currentLocation);

  // console.log(currentLocation)
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
        {currentLocation && (
          <Routing
            from={[currentLocation.latitude, currentLocation.longitude]}
            to={[latitude, longitude]}
          />
        )}

        <LocationPicker />
      </MapContainer>
    </div>
  );
}

export default ShopLocation;
