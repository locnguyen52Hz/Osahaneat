import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import style from "../assets/styles/SideBar.module.css";
import IconBadge from "./common/IconBadge";

function SidebarItem({ item, level = 0, badgeCounts }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isGroup = item.type === "group";

  // auto open nếu đang ở route con
  useEffect(() => {
    if (isGroup) {
      const match = item.children?.some((child) => {
        return location.pathname.startsWith(child.path || "");
      });
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
          <div className={style.navLinkIcon}>
            <IconBadge icon={item.icon} />
          </div>
          <p className={style.label}>{item.label}</p>
        </div>

        {/* dropdown */}
        {open &&
          item.children.map((child) => (
            <SidebarItem
              key={child.label}
              item={child}
              level={level + 1}
              badgeCounts={badgeCounts}
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
      <div className={style.navLinkIcon}>
        <IconBadge icon={item.icon} count={badgeCounts?.[item.badge] || 0} />
      </div>

      <p className={style.label}>{item.label}</p>
    </NavLink>
  );
}

export default SidebarItem;
