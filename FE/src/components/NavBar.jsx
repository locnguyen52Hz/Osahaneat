
import style from "../assets/styles/Navbar.module.css";
import shared from "../assets/styles/Shared.module.css";


import { useFormattedLocation } from "../hooks/useFormatedLocation";
import SearchBox from "../pages/Buyer/SearchBox";

function NavBar() {
  const myLocation = useFormattedLocation()


  return (
    <nav className={`${style.navBarWrapper} ${shared.boxShadow}`}>
      {/* Left */}
      <div className={style.navLeft}>
        <div className={`${style.navItem} ${shared.paragraphColor} `}>
          <i className={` ${shared.textDanger} bi bi-crosshair2`}></i>
          {myLocation.address ?  myLocation.address : myLocation}
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
        <SearchBox/>
      </div>
    </nav>
  );
}

export default NavBar;
