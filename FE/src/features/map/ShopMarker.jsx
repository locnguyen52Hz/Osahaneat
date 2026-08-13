import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";

function ShopMarker({ shopId, latitude, longitude, popup = 'Vị trí cửa hàng', tooltip }) {

  return (
    <>
      <Marker position={[latitude, longitude]}>
        <Popup>{popup}</Popup>
        {tooltip && <Tooltip >{tooltip}</Tooltip>}
      </Marker>

    </>
  );
}

export default ShopMarker;
