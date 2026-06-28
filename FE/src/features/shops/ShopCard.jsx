import React from "react";
import shared from "../../assets/styles/Shared.module.css";
import style from "../../assets/styles/ShopCard.module.css";
import RatingDisplay from "../../components/common/RatingDisplay";
import LocationDisplay from "../../components/common/LocationDisplay";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ShopAvatar from "./components/ShopAvatar";
import GeographyIcon from "../../components/common/GeographyIcon";

function ShopCard({
  shopName,
  avatar,
  rating,
  ratingCount,
  address,
  distance,
  onClick,
  formatDistance,
}) {
  console.log(`${distance} km`);
  return (
    <div className={`${style.card} ${shared.boxShadow}`} onClick={onClick}>
      <div className={`${style.shopAvatarPadding} ${shared.bgLight}`}>
        <ShopAvatar src={avatar} />
      </div>

      <div className={style.shopDesc}>
        <h3>{shopName}</h3>

        <div className={`${shared.textDark} ${shared.fontWeightBold}`}>
          <RatingDisplay value={rating ?? 0} count={ratingCount} />
        </div>
        <GeographyIcon number={formatDistance(distance)} />
      </div>
    </div>
  );
}

export default ShopCard;
