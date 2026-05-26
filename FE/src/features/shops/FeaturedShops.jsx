import ShopCard from "../../features/shops/ShopCard";
import { useNavigate } from "react-router-dom";
import style from "../../assets/styles/FeaturedShops.module.css";
import shared from "../../assets/styles/Shared.module.css";
import endpoints from "../../api/endpoints";
import { useEffect } from "react";


function FeaturedShops({ shops}) {
  const navigate = useNavigate();

  const shopDetailPage = (id) => {
    navigate(`/buyer/detail/shop/${id}`);
  };


// console.log(shops)
  return (
    < >
      <div className={style.header}>
        <h5 className={shared.h5}>Featured Shops</h5>
        <a
          className={`${shared.fontWeightBold} ${shared.textDark} ${shared.smail}`}
          href=""
        >
          See all
        </a>
      </div>

      <div className={style.items}>
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}          
            onClick={() => shopDetailPage(shop.id)}
            type = 'card'
          />
        ))}
      </div>
    </>
  );
}

export default FeaturedShops;