import React from "react";
import ShopCard from "./ShopCard";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/FeaturedShops.module.css";
import endpoints from "../../api/endpoints";
import { formatDistance } from "../../util/format";

function ShopsList({ list }) {
  const navigate = useNavigate();

  return (
    <div className={styles.items}>
      {list?.map((shop) => (
        <ShopCard
          key={shop.shopId}
          shopName={shop.shopName}
          avatar={`${endpoints.image.shop}/${shop.shopAvatar}`}
          rating={shop.ratingAvg}
          ratingCount={shop.ratingCount}
          address={shop.address}
          distance={shop.distance}
          formatDistance={formatDistance}
          onClick={() => navigate(`/buyer/detail/shop/${shop.shopId}`)}
        />
      ))}
    </div>
  );
}

export default ShopsList;
