import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/styles/FloatingLabel.module.css";
import { MAX_LENGTH_NOTE } from "../../constants/limits";
import { getFormattedCartTotal } from "../../util/cart";
import { formatCurrency } from "../../util/format";

function FloatingLabel({
  label,
  type = "text",
  textarea,
  value,
  onChange,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    if (!e.target.value) setFocused(false);
  };

  const InputTag = textarea ? "textarea" : "input";

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef && textarea) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className={styles.floatingGroup}>
      <InputTag
        ref={textarea ? textAreaRef : null}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={
          type === "text"
            ? `${styles.floatingInput}`
            : `${styles.floatingInputNumber}`
        }
        maxLength={maxLength}
      />
      <label
        className={`${styles.floatingLabel} ${
          focused || value ? styles.active : ""
        }`}
      >
        {label}
      </label>
      {type === "number" ? "" : <span>{`${value?.length}/${maxLength}`}</span>}
    </div>
  );
}

export default FloatingLabel;
