import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

function MapContainerBase({ children, center }) {


  return (
    <MapContainer
      center={center}
      zoom={12}
      // scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}

export default MapContainerBase;
