import React from "react";
import styles from "../../assets/styles/PopupComfirm.module.css";
import { useModal } from "../../contexts/ModalContext";

function PopupComfirm({
  label,
  onComfirm,
  message,
  icon,
  actionType,
  data = {},
}) {
  const { closeTopModal } = useModal();

  return (
    <div className={styles.containerBorder}>
      <div className={styles.container}>
        <div className={`${styles[`${actionType}Background`]} ${styles.icon}`}>
          {icon}
        </div>
        <div className={styles.title}>
          <h2>{label}?</h2>
          <p>{message}</p>
        </div>
        <div className={styles.btnGroup}>
          <button
            className={`${styles[`${actionType}Btn`]} ${styles.btn}`}
            onClick={() => onComfirm(data)}
          >
            Xác nhận
          </button>
          <button
            className={`${styles.cancelBtn} ${styles.btn}`}
            onClick={() => closeTopModal()}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupComfirm;
