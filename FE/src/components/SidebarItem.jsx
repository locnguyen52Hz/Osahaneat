import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import style from "../assets/styles/SideBar.module.css";

function SidebarItem({ item, level = 0, totalUnreadCount }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isGroup = item.type === "group";

  // auto open nếu đang ở route con
  useEffect(() => {
    if (isGroup) {
      const match = item.children?.some((child) =>
        location.pathname.startsWith(child.path || ""),
      );
      if (match) setOpen(true);
    }
  }, [location.pathname]);

  const paddingLeft = 15 + level * 30;

  if (isGroup) {
    return (
      <>
        <div
          className={style.navLink}
          style={{ paddingLeft }}
          onClick={() => setOpen(!open)}
        >
          <i className={`${item.icon} ${style.navLinkIcon}`}></i>
          <p>{item.label}</p>
        </div>

        {/* dropdown */}
        {open &&
          item.children.map((child) => (
            <SidebarItem
              key={child.label}
              item={child}
              level={level + 1}
              totalUnreadCount={totalUnreadCount}
            />
          ))}
      </>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${style.navLink} ${isActive ? style.active : ""}`
      }
      style={{ paddingLeft }}
    >
      {item.icon && <i className={`${item.icon} ${style.navLinkIcon}`}></i>}
      <p>{item.label}</p>

      {item.badge === "message" && totalUnreadCount > 0 && (
        <span className={style.badge}>{totalUnreadCount}</span>
      )}
    </NavLink>
  );
}

export default SidebarItem;
