import React from "react";
import MapContainerBase from "../features/map/MapContainerBase";
import styles from "../assets/styles/DeliveryLocation.module.css";
import Routing from "./Routing";
import UserMarker from "../features/map/UserMarker";
import ShopMarker from "../features/map/ShopMarker";

function DeliveryLocation({ fromLat, fromLong, toLat, toLong, customerName }) {
  // console.log(from)
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Vị trí giao hàng</h3>
      <div className={styles.map}>
        <MapContainerBase center={[fromLat, fromLong]}>
          <Routing from={[fromLat, fromLong]} to={[toLat, toLong]} />
          <UserMarker
            latitude={fromLat}
            longitude={fromLong}
            popup={customerName}
          />
          <ShopMarker latitude={toLat} longitude={toLong} />
        </MapContainerBase>
      </div>
    </div>
  );
}

export default DeliveryLocation;
