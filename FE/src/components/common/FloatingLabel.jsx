import React, { useState } from "react";
import styles from "../../assets/styles/FloatingLabel.module.css";
import {MAX_LENGTH_NOTE} from '../../constants/limits'

function FloatingLabel({ label, type = "text", textarea = false, value, onChange }) {
  const [focused, setFocused] = useState(false);


  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    if (!e.target.value) setFocused(false);
  };

  const InputTag = textarea ? "textarea" : "input";

  return (
    <div className={styles.floatingGroup}>
      <InputTag
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={styles.floatingInput}
        maxLength={MAX_LENGTH_NOTE}
      />
      <label
        className={`${styles.floatingLabel} ${focused || value ? styles.active : ""}`}
      >
        {label}
      </label>
      <span >{`${value.length}/${MAX_LENGTH_NOTE}`}</span>
    </div>
  );
}

export default FloatingLabel;
