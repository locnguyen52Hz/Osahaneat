import React, { useEffect } from "react";
import style from "../assets/styles/Sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../app/providers/UseContext.jsx";

import routes from "../routes/config.jsx";
import { useWebSocketContext } from "../contexts/WebSocketContext.jsx";
import { useConversationStore } from "../stores/messages/useConversationStore";

function SideBar() {
  const role = localStorage.getItem("role");
  const totalUnreadCount = useConversationStore((s) => s.totalUnreadCount);
  const fetchUnreadMessage = useConversationStore((s) => s.fetchUnreadMessage);

  useEffect(() => {
    fetchUnreadMessage();
  }, []);

  const { username, clearAuthData } = useAuth();
  const navigate = useNavigate();
  const sideBarItems = routes[role].children.filter(
    (item) => item.showInSideBar === true,
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
              {item.notify === "message" && <span>{totalUnreadCount}</span>}
              {/* {item.notify === 'orders' && <span>{ordersNotify.length}</span>} */}
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
