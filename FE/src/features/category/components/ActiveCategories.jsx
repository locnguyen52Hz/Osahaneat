import React, { useEffect, useState } from "react";
import shared from "../../../assets/styles/Shared.module.css";

function ActiveCategories({
  array,
  btnColor,
  btnActive,
  active,
  setActive,
  getKey,
  getLabel,
  getIcon,
}) {
  return (
    <>
      {array.length > 0 ? (
        <ul className={shared.nav}>
          {array.map((item) => {
            const key = getKey(item);


            return (
              <li
                key={key}
                className={`${shared.navLink} ${btnColor} ${
                  active === key ? btnActive : ""
                }`}
                onClick={() => setActive(item)}
              >
                {getIcon?.(item)}
                <p>{getLabel(item)}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Không có danh mục</p>
      )}
    </>
  );
}

export default ActiveCategories;
