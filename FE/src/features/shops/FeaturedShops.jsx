import ShopCard from "../../features/shops/ShopCard";
import { useNavigate } from "react-router-dom";
import style from "../../assets/styles/FeaturedShops.module.css";
import shared from "../../assets/styles/Shared.module.css";
import endpoints from "../../api/endpoints";
import { useEffect, useState } from "react";
import { apiGet } from "../../api/api";
import { useLocation } from "../../contexts/LocationContext";
import { formatDistance } from "../../util/format";

function FeaturedShops() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const { location, loading } = useLocation();

  const shopDetailPage = (id) => {
    navigate(`/buyer/detail/shop/${id}`);
  };

  useEffect(() => {
    if (loading) return;
    const fetchShops = async () => {
      try {
        const response = await apiGet(
          `${endpoints.shop.top6Shop}?fromLongitude=${location.longitude}&fromLatitude=${location.latitude}`,
        );

        setShops(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShops();
  }, [loading]);

  return (
    <>
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
            key={shop.shopId}
            name={shop.shopName}
            avatar={`${endpoints.image.shop}/${shop.shopAvatar}`}
            rating={shop.ratingAvg}
            ratingCount={shop.ratingCount}
            address={shop.address}
            distance={shop.distance}
            formatDistance={formatDistance}
            onClick={() => shopDetailPage(shop.shopId)}
          />
        ))}
      </div>
    </>
  );
}

export default FeaturedShops;
