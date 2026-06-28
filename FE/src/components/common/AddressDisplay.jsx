import React from "react";
import styles from "../../assets/styles/AddressDisplay.module.css";
import shared from "../../assets/styles/Shared.module.css";

function AddressDisplay({ address, border , onClick }) {
  return (
    <div
      className={`${styles.location} ${border && styles.border}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div>
        <p className={shared.textDanger}>Địa chỉ giao hàng</p>
        <p className={styles.address}>{address}</p>
      </div>
      {onClick && (
        <i
          className={` bi bi-chevron-right ${styles.edit} ${shared.textInfo}`}
        ></i>
      )}
    </div>
  );
}

export default AddressDisplay;
