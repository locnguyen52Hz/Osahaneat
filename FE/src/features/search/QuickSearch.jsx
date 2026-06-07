import React from "react";
import styles from "../../assets/styles/QuickSearch.module.css";
function QuickSearch() {
  return (
    <div className={styles.container}>
      <div className={styles.inputBox}>
        <i className="bi bi-search"></i>{" "}
        <input
          type="text"
          name=""
          id=""
          placeholder=" Search food or restaurants"
          className={styles.customInput}
        />
      </div>

      <button>Search</button>
    </div>
  );
}

export default QuickSearch;
