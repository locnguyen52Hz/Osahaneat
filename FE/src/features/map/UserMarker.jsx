import React from "react";

import { Marker, Popup, useMapEvents } from "react-leaflet";

function UserMarker({location}) {


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

    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        map.flyTo([lat, lng]);
        // fetchAddress(lat, lng);
        console.log(lat,lng)
      },
    });
  return (
    <>
      {location && (
        <Marker
          position={[location.latitude, location.longitude]}
          icon={redIcon}
        >
          <Popup>Bạn đang ở dây</Popup>
        </Marker>
      )}
    </>
  );
}

export default UserMarker;
