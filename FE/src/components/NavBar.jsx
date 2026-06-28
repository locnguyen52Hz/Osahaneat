import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";

import { useModal } from "../contexts/ModalContext";
import "../assets/styles/variables.css";
import SearchBox from "../features/search/SearchBox";
import { useState } from "react";

import { useSearch } from "../features/search/hooks/useSearch";
import IconBadge from "./common/IconBadge";
import { useCartStore } from "../stores/Cart/useCartStore";
import { useLocationStore } from "../stores/location/useLocationStore";
import AddressSelector from "./common/AddressSelector";
import LoadingSpinner from "./common/LoadingSpinner";

function NavBar({ onToggleSideBar }) {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const loading = useLocationStore((s) => s.loading);
  const error = useLocationStore((s) => s.error);

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
        <div
          className={`${style.navItem} ${shared.paragraphColor}`}
          onClick={() => openModal(<AddressSelector />, { type: "slide" })}
        >
          <i className={`${shared.textDanger} bi bi-crosshair2`}></i>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            "Không thể lấy vị trí"
          ) : currentLocation ? (
            currentLocation.address
          ) : (
            "Không xác định vị trí"
          )}
        </div>
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
