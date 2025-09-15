import React, { useState } from "react";
import styles from "../../assets/styles/Select.module.css";

function Select({ array, icon, selected, handleOnchange }) {


  return (
    <div className={styles.selectBox}>
      {icon && <i className={icon}></i>}
      <select value={selected} onChange={(e) => handleOnchange(e.target.value)}>
        {array.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
