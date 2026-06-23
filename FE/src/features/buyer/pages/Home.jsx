import React, { useEffect, useState } from "react";
import FeaturedShops from "../../../features/shops/FeaturedShops.jsx";
import { apiGet } from "../../../api/api";
import style from "../../../assets/styles/Home.module.css";
import endpoints from "../../../api/endpoints.js";
import { useLocation } from "../../../contexts/LocationContext.jsx";
import QuickSearch from "../../search/QuickSearch.jsx";

function Home() {
  return (
    <>
      <div className={style.banner}>
        <div className={style.desc}>
          <h1>
            Giao món bạn yêu, <span>chỉ trong tích tắc</span>
          </h1>
          <p>
            Hàng ngàn món ngon từ những nhà hàng tốt nhất xung quanh bạn. Cam
            kết giao hàng nóng hổi trong vòng 20 phút.
          </p>
          <QuickSearch />
        </div>
      </div>
      <div className={style.main}>
        <FeaturedShops />
      </div>
    </>
  );
}

export default Home;
