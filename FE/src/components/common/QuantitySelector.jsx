import React from "react";
import styles from "../../assets/styles/QuantitySelector.module.css";

function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
  onChange,
  onBlur,
}) {
  return (
    <div className={styles.quantityControls}>
      <button
        type="button"
        onClick={onDecrease}
      >
        -
      </button>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />

      <button
        type="button"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;