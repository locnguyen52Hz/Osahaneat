import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";

function ShopsMarker({ shops = [] }) {
  console.log(shops)
  return (
    <>
      {shops.map((shop) => (
        <Marker key={shop.shopId} position={[shop.latitude, shop.longitude]}>
          <Popup>{shop.shopAddress}</Popup>
          <Tooltip >{shop.shopName}</Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default ShopsMarker;
