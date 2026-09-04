import style from "../assets/styles/SideBar.module.css";
import routes from "../routes/config.jsx";
import SidebarItem from "./SidebarItem.jsx";

import { useNavigate } from "react-router-dom";

import useSidebarBadges from "../hooks/useSidebarBadges.js";
import { useAuthStore } from "../stores/Auth/useAuthStore.js";

function SideBar({ isOpen }) {
  const role = useAuthStore((s) => s.role);
  const username = useAuthStore((s) => s.username);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const badgeCounts = useSidebarBadges();

  const navigate = useNavigate();

  const items = routes[role].children.filter((item) => item.showInSideBar);
  const handleLogout = async () => {
    const logoutSuccess = await clearAuth();
    if (logoutSuccess) {
      navigate("/login");
    }
  };

  return (
    <div
      className={`${style.sidebarContainer} ${
        !isOpen ? style.sidebarHidden : ""
      }`}
    >
      <ul className={style.navItems}>
        {items.map((item) => (
          <li key={item.label}>
            <SidebarItem item={item} badgeCounts={badgeCounts} />
          </li>
        ))}
      </ul>

      <div className={style.username}>{username}</div>

      <button
        onClick={() => {
          handleLogout();
        }}
      >
        log out
      </button>
    </div>
  );
}

export default SideBar;
