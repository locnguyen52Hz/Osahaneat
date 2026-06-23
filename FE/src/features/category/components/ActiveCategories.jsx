import React, { useEffect, useState } from "react";
import shared from "../../../assets/styles/Shared.module.css";

function ActiveCategories({ array, btnColor, btnActive, active, setActive }) {

  return (
    <>
      {array.length > 0 ? (
        <ul className={shared.nav}>
          {array.map((item) => (
            <li
              key={item.id}
              className={`${shared.navLink} ${btnColor} ${
                active === item.id ? btnActive : ""
              }`}
              onClick={() => setActive(item)}
            >
              {item?.icon}
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có danh mục</p>
      )}
    </>
  );
}

export default ActiveCategories;
