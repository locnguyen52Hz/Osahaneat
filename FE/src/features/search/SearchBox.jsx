import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/SearchBox.module.css";

import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import { useModal } from "../../contexts/ModalContext";
import SearchFilter from "./SearchFilter";

function SearchBox({ keyword, setKeyword, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={styles.inputGroup}>
      <input
        type="text"
        placeholder="Search for..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={onSearch} className={styles.searchBtn}>
        <i className={`bi bi-search ${styles.searchIcon}`} />
      </button>
    </div>
  );
}

export default SearchBox;
