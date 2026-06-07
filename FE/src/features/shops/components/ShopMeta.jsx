import LocationDisplay from "../../../components/common/LocationDisplay";
import RatingDisplay from "../../../components/common/RatingDisplay";
import styles from '../../../assets/styles/ShopMeta.module.css'

function ShopMeta({ rating, ratingCount, distance, address, formatDistance }) {
  return (
    <div className={styles.ratingAndLocation}>
      <RatingDisplay value={rating} count={ratingCount} />
      <LocationDisplay
        distance={distance}
        address={address}
        format={formatDistance}
      />
    </div>
  );
}

export default ShopMeta;