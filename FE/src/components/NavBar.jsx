
import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";


import { useFormattedLocation } from "../hooks/useFormatedLocation";

function NavBar() {
  const location = useFormattedLocation()


  return (
    <nav className={`${style.navBarWrapper} ${shared.boxShadow}`}>
      {/* Left */}
      <div className={style.navLeft}>
        <div className={`${style.navItem} ${shared.paragraphColor} `}>
          <i className={` ${shared.textDanger} bi bi-crosshair2`}></i>
          {location.address ?  location.address : location}
        </div>
        <div
          className={`${style.navItem} ${shared.paragraphColor} ${shared.textUppercase}`}
        >
          <i className={`${shared.textDanger} bi bi-bag-fill`}></i>
          <p>pick up</p>
        </div>
      </div>

      {/* Right */}
      <div className={style.navRight}>
        <div className={style.inputGroup}>
          <input type="text" placeholder="Search for..." />
          <button className={style.searchBtn} aria-label="Search">
            <i className={`bi bi-search ${style.searchIcon}`}></i>
          </button>
        </div>
        <button className={style.cartButton}>
          <i className="bi bi-cart"></i>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
