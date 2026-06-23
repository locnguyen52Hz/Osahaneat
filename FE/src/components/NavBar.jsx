import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";
import { useLocation } from "../contexts/LocationContext";
import { useModal } from "../contexts/ModalContext";
import "../assets/styles/variables.css";
import SearchBox from "../features/search/SearchBox";
import LoadingSpinner from "./common/LoadingSpinner";
import SavedAddress from "./SavedAddress";
import { useState } from "react";

import { useSearch } from "../features/search/hooks/useSearch";
import IconBadge from "./common/IconBadge";
import { useCartStore } from "../stores/Cart/useCartStore";

function NavBar({ onToggleSideBar }) {
  const { location, loading, error } = useLocation();

  const { openModal } = useModal();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { keyword, setKeyword, handleSearch } = useSearch();

  const totalCartItem = useCartStore((s) => s.totalCartItem);

  const onSearch = () => {
    if (!keyword.trim()) return;
    setMobileSearchOpen(false);
    handleSearch();
  };

  const searchProps = {
    keyword,
    setKeyword,
    onSearch,
  };
  return (
    <nav className={`${style.navBarWrapper} ${shared.boxShadow}`}>
      {/* Left */}
      <div className={style.logo}>
        <i className={`bi bi-list ${style.menu}`} onClick={onToggleSideBar}></i>
        <img src="/logo.png" alt="" />
      </div>

      <div className={style.center}>
        {" "}
        {/* <div
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
        </div> */}
      </div>

      {/* Right */}
      <div className={style.searchGroup}>
        {" "}
        <div className={style.cart}>
          <IconBadge
            icon={<i className="bi bi-cart2"></i>}
            backgroundColor={"#d9513d"}
            count={totalCartItem}
          />
        </div>
        <div className={style.searchDesktop}>
          <SearchBox {...searchProps} />
        </div>
        <div className={style.searchMobile}>
          <i
            className="bi bi-search"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
          ></i>
          <div
            className={`${style.searchDropdown}  ${mobileSearchOpen ? style.open : ""}`}
          >
            <SearchBox {...searchProps} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
