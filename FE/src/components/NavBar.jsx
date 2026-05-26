import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";
import { useLocation } from "../contexts/LocationContext";
import { useModal } from "../contexts/ModalContext";

import { useFormattedLocation } from "../hooks/useFormatedLocation";
import SearchBox from "../features/search/SearchBox";
import LoadingSpinner from "./common/LoadingSpinner";
import SavedAddress from "./SavedAddress";

function NavBar() {
  const { location, loading, error } = useLocation();
  const { openModal } = useModal();

  return (
    <nav className={`${style.navBarWrapper} ${shared.boxShadow}`}>
      {/* Left */}
      <div className={style.navLeft}>
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

        <div
          className={`${style.navItem} ${shared.paragraphColor} ${shared.textUppercase}`}
        >
        </div>
      </div>

      {/* Right */}
      <div className={style.navRight}>
        <SearchBox />
      </div>
    </nav>
  );
}

export default NavBar;
