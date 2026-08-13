import React from "react";
import styles from "../../../assets/styles/SearchResults.module.css";
import ActiveCategories from "../../category/components/ActiveCategories";
import { RADIUS, SORT_BY } from "../constant/searchConstant";

const sortBy = [
  {
    id: 4,
    label: "Xếp hạng",
    type: SORT_BY.RATING_AVG,
    icon: <i className="bi bi-list-stars"></i>,
  },
  {
    id: 1,
    label: "Giá cao",
    type: SORT_BY.PRICE_DESC,
    icon: <i className="bi bi-sort-down"></i>,
  },
  {
    id: 2,
    label: "Giá thấp",
    type: SORT_BY.PRICE_ASC,
    icon: <i className="bi bi-sort-up"></i>,
  },
];

const SearchToolbar = ({ sort, radius, handleSort, handleChangeRadius }) => (
  <div className={styles.sort}>
    <div className={styles.sortBy}>
      <ActiveCategories
        array={sortBy}
        active={sort}
        setActive={handleSort}
        btnColor={styles.sortByNav}
        btnActive={styles.active}
        getKey={(item) => item.type}
        getLabel={(item) => item.label}
        getIcon={(item) => item.icon}
      />
    </div>

    <div className={styles.filter}>
      <label htmlFor="radius">
        <i className="bi bi-radar"></i>
      </label>

      <select
        value={radius}
        onChange={(e) => handleChangeRadius(Number(e.target.value))}
        id="radius"
      >
        {RADIUS.map((r) => (
          <option key={r} value={r}>
            {r / 1000} km
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SearchToolbar;
