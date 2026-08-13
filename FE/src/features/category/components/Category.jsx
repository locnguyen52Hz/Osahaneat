import React from "react";
import endpoints from "../../../api/endpoints";
import styles from "../../../assets/styles/Categories.module.css";

function Category({ id, image, name, onClick }) {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.imgWrapper}>
        <img src={`${endpoints.image.category}/${image}`} alt="" />
      </div>
      <p className={styles.name}>{name}</p>
    </div>
  );
}

export default Category;
