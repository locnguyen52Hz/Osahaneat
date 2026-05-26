import React from "react";
import ShopLocation from "../../location/components/ShopLocation";
import styles from "../../../assets/styles/TrackStatus.module.css";
import OrderTimeline from "../components/OrderTimeline";
import { formatDistance } from "../../../util/format";
import StatusTimeLine from "../../TimeLine/StatusTimeLine";
import shared from "../../../assets/styles/Shared.module.css";
import MapContainerBase from "../../../features/map/MapContainerBase";
import Routing from "../../../components/Routing";
import { LocationContext, useLocation } from "../../../contexts/LocationContext";
import UserMarker from "../../../features/map/UserMarker";
import ShopsMarker from "../../../features/map/ShopsMarker";
import ProgressTimeline from "../../TimeLine/ProgressTimeline";

function TrackStatus({ order }) {
  const { fromLocation, toLocation, shopAddress, shopName, shopId } = order;
  const shopLocation = {
    shopId,
    shopName,
    shopAddress,
    latitude: toLocation.latitude,
    longitude: toLocation.longitude,
  };
  const userLocation = {
    latitude: fromLocation.latitude,
    longitude: fromLocation.longitude,
  };
  return (
    <div className={styles.container}>
      <h2>Track Status</h2>
      <div className={styles.map}>
        <MapContainerBase
          center={[fromLocation.latitude, fromLocation.longitude]}
        >
          <Routing
            from={[fromLocation.latitude, fromLocation.longitude]}
            to={[toLocation.latitude, toLocation.longitude]}
          />
          <UserMarker location={userLocation} />
          <ShopsMarker shops={[shopLocation]} />
        </MapContainerBase>
      </div>
      {/* <ShopLocation latitude={order.latitude} longitude={order.longitude} /> */}
      <div className={styles.statusTrack}>
        <div className={styles.distance}>
          <i className="bi bi-map"></i>
          <div>
            <p>Distance</p>
            <p>{formatDistance(order.distance)} km</p>
          </div>
        </div>
        <ProgressTimeline currentStatus={order.status} statuses={order.statuses}/>
        <StatusTimeLine
          currentStatus={order.status}
          statuses={order.statuses}
        />
      </div>
      <div className={styles.footer}>
        <button className={shared.submitBtn}>
          Message to ({order.shopName} )
        </button>
      </div>
    </div>
  );
}

export default TrackStatus;
