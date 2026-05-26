import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/SearchBox.module.css";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import { useModal } from "../../contexts/ModalContext";
import SearchFilter from "./SearchFilter";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?type=shop&keyword=${encodeURIComponent(keyword)}&page=0`);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Search for..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onEnter}
        />
        <button onClick={handleSearch} className={styles.searchBtn}>
          <i className={`bi bi-search ${styles.searchIcon}`}></i>
        </button>
      </div>
    </>
  );
}

export default SearchBox;
