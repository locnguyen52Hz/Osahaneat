import React from "react";
import style from "../assets/styles/Sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UseContext";

import routes from "../routes/config.jsx";

function SideBar() {
  const role = localStorage.getItem("role");

  const { username, clearAuthData } = useAuth();
  const navigate = useNavigate();
  const sideBarItems = routes[role].children.filter(
    (item) => item.showInSideBar === true
  );

  const handleLogout = () => {
    navigate("/login");
    clearAuthData();
  };

  return (
    <div className={style.sidebarContainer}>
      <div className={style.header}>
        <img className={style.logo} src="/logo.png" />
      </div>
      <ul className={`${style.navItems} `}>
        {sideBarItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${style.navLink} ${isActive ? style.active : ""}`.trim()
              }
            >
              <i className={item.icon}></i>
              <p>{item.label}</p>
            </NavLink>
          </li>
        ))}
      </ul>

      <div>{username ? <p>{username}</p> : ""}</div>
      <button onClick={() => handleLogout()}>log out</button>
    </div>
  );
}

export default SideBar;
