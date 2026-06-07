import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";
import { useLocation } from "../contexts/LocationContext";
import { useModal } from "../contexts/ModalContext";
import "../assets/styles/variables.css";

import SearchBox from "../features/search/SearchBox";
import LoadingSpinner from "./common/LoadingSpinner";
import SavedAddress from "./SavedAddress";
import { useState } from "react";

function NavBar({ onToggleSideBar }) {
  const { location, loading, error } = useLocation();
  const { openModal } = useModal();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  return (
    <nav className={`${style.navBarWrapper} ${shared.boxShadow}`}>
      {/* Left */}
      <div className={style.logo}>
        <i className={`bi bi-list ${style.menu}`} onClick={onToggleSideBar}></i>
        <img src="/logo.png" alt="" />
      </div>

      <div className={style.center}>
        <div
          className={`${style.navItem} ${shared.paragraphColor}`}
          onClick={() => openModal(<SavedAddress />, { type: "slide" })}
        >
          <i className={`${shared.textDanger} bi bi-crosshair2`}></i>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            "Không thể lấy vị trí"
          ) : location ? (
            location.address
          ) : (
            "Không xác định vị trí"
          )}
        </div>
      </div>

      {/* Right */}
      <div className={style.searchGroup}>
        <i
          className="bi bi-search"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
        ></i>
        {mobileSearchOpen && (
          <div className={style.extend}>
            <SearchBox />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
