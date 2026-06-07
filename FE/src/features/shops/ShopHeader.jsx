import React from "react";
import styles from "../../assets/styles/ShopHeader.module.css";
import endpoints from "../../api/endpoints.js";
import GeographyIcon from "../../components/common/GeographyIcon.jsx";
import { formatDistance } from "../../util/format.js";
import ShopAvatar from "./components/ShopAvatar.jsx";
import ShopMeta from "./components/ShopMeta.jsx";
import ShopInfo from "./components/ShopInfo.jsx";

function ShopHeader({ shop }) {
  return (


    <div className={styles.container}>
      <div className={styles.wrapperAvatar}>
        <ShopAvatar
          src={`${endpoints.image.shop}/${shop.shopAvatar}`}
          alt={shop.name}
          size="large"
        />
      </div>

      <div className={styles.content}>
        <ShopInfo name={shop.name} description={shop.description} />
        <ShopMeta
          rating={shop.ratingAvg}
          ratingCount={shop.ratingCount}
          distance={shop.distance}
          address={shop.address}
          formatDistance={formatDistance}
        />
      </div>
    </div>
  );
}

export default ShopHeader;
