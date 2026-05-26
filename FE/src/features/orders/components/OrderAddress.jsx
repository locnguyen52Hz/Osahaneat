import React from "react";
import styles from "../../../assets/styles/OrderAddress.module.css";
import shared from "../../../assets/styles/Shared.module.css";

function OrderAddress({ address, location, border = true }) {
  return (
    <div className={`${styles.location} ${border && styles.border}`}>
      <div>
        <p className={shared.textDanger}>Delivered to</p>
        <p className={styles.address}>
          {address || location?.address || location || ""}
        </p>
      </div>
      {location && <p className={`${styles.edit} ${shared.textInfo}`}>Edit</p>}
    </div>
  );
}

export default OrderAddress;
