import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";
import { useModal } from "../contexts/ModalContext";
import "../assets/styles/variables.css";
import { useState } from "react";
import { useSearch } from "../features/search/hooks/useSearch";
import IconBadge from "./common/IconBadge";
import { useCartStore } from "../stores/Cart/useCartStore";

import AddressSelector from "./common/AddressSelector";
import LoadingSpinner from "./common/LoadingSpinner";
import { buildSearchUrl } from "../features/search/service/searchService";
import SearchBox from "../features/search/components/SearchBox";
import { useLocationStore } from "../stores/location/useLocationStore";

function NavBar({ onToggleSideBar }) {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const loading = useLocationStore((s) => s.loading);
  const error = useLocationStore((s) => s.error);
  const { openModal } = useModal();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const search = useSearch(buildSearchUrl);
  const totalCartItem = useCartStore((s) => s.totalCartItem);

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
          <SearchBox />
        </div>
        <div className={style.searchMobile}>
          <i
            className="bi bi-search"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
          ></i>
          <div
            className={`${style.searchDropdown}  ${mobileSearchOpen ? style.open : ""}`}
          >
            <SearchBox />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
