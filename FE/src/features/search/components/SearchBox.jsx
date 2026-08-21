import React, { useEffect, useState } from "react";
import styles from "../../../assets/styles/SearchBox.module.css";

import endpoints from "../../../api/endpoints";
import { useModal } from "../../../contexts/ModalContext";

import { useSearch } from "../hooks/useSearch";
import { buildSearchUrl } from "../service/searchService";
import { useQueryParams } from "../hooks/useQueryParams";
import { SORT_BY } from "../constant/searchConstant";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const search = useSearch(buildSearchUrl);

  const { updateParams, resetSearchType } = useQueryParams();

  const handleKeyDown = (e) => {
    if (!keyword) return;
    const normalizedKeyword = keyword.trim();
    console.log(normalizedKeyword);
    if (e.key === "Enter") {
      updateParams({
        keyword: normalizedKeyword,
        page: 0,
        sort: SORT_BY.RATING_AVG,
      });
    }
  };

  const handleOnClick = (keyword) => {
    if (!keyword) return;
    const normalizedKeyword = keyword.trim();

    updateParams(
      resetSearchType("keyword", {
        keyword: normalizedKeyword,
        sort: SORT_BY.RATING_AVG,
        page: 0,
      }),
    );
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

      <button
        onClick={() => handleOnClick(keyword)}
        className={styles.searchBtn}
      >
        <i className={`bi bi-search ${styles.searchIcon}`} />
      </button>
    </div>
  );
}

export default SearchBox;
