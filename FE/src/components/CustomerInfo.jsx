import React from "react";
import styles from "../assets/styles/CustomerInfo.module.css";

function CustomerInfo({ fullName, email, deliveredTo }) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Thông tin khách hàng</p>
      <div className={styles.name}>
        <p className={styles.lable}>Tên</p>
        <p>{fullName}</p>
      </div>
      <div className={styles.email}>
        <p className={styles.lable}>Email</p>
        <p>{email}</p>
      </div>
      <div className={styles.deliveredTo}>
        <p className={styles.lable}>ĐỊA CHỈ GIAO HÀNG</p>
        <p>{deliveredTo}</p>
      </div>
    </div>
  );
}

export default CustomerInfo;
