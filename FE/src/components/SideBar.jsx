import React, { useEffect } from "react";
import style from "../assets/styles/SideBar.module.css";
import routes from "../routes/config.jsx";
import SidebarItem from "./SidebarItem.jsx";
import { useConversationStore } from "../stores/messages/useConversationStore.js";
import { useAuth } from "../app/providers/UseContext.jsx";
import { useNavigate } from "react-router-dom";

function SideBar({ isOpen }) {
  const role = localStorage.getItem("role");

  const totalUnreadCount = useConversationStore((s) => s.totalUnreadCount);

  const { username, clearAuthData } = useAuth();
  const navigate = useNavigate();

  const items = routes[role].children.filter((item) => item.showInSideBar);

  return (
    <div
      className={`${style.sidebarContainer} ${
        !isOpen ? style.sidebarHidden : ""
      }`}
    >
      <ul className={style.navItems}>
        {items.map((item) => (
          <li key={item.label}>
            <SidebarItem item={item} totalUnreadCount={totalUnreadCount} />
          </li>
        ))}
      </ul>

      <div className={style.username}>{username}</div>

      <button
        onClick={() => {
          clearAuthData();
          navigate("/login");
        }}
      >
        log out
      </button>
    </div>
  );
}

export default SideBar;
