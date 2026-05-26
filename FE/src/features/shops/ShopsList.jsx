import React from "react";
import ShopCard from "./ShopCard";
import { useNavigate } from "react-router-dom";
import styles from '../../assets/styles/FeaturedShops.module.css'

function ShopsList({ list }) {
  const navigate = useNavigate();

  return (
    <div className={styles.items}>
      {list?.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          onClick={() => navigate(`/buyer/detail/shop/${shop.id}`)}
          type='card'
        />
      ))}
    </div>
  );
}

export default ShopsList;
