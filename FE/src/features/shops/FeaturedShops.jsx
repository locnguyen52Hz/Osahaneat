import ShopCard from "../../features/shops/ShopCard";
import { useNavigate } from "react-router-dom";
import style from "../../assets/styles/FeaturedShops.module.css";
import shared from "../../assets/styles/Shared.module.css";
import endpoints from "../../api/endpoints";
import { useEffect, useState } from "react";
import { apiGet } from "../../api/api";
import { formatDistance } from "../../util/format";
import { useLocationStore } from "../../stores/location/useLocationStore";

function FeaturedShops() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);

  const currentLocation = useLocationStore((s) => s.currentLocation);
  const loading = useLocationStore((s) => s.loading);

  const shopDetailPage = (id) => {
    navigate(`/buyer/detail/shop/${id}`);
  };

  useEffect(() => {
    if (loading) return;
    const fetchShops = async () => {
      try {
        const response = await apiGet(
          `${endpoints.shop.top6Shop}?fromLongitude=${currentLocation.longitude}&fromLatitude=${currentLocation.latitude}`,
        );

        setShops(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShops();
  }, [loading]);

  return (
    <div className={style.content}>
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
            shopName={shop.shopName}
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
    </div>
  );
}

export default FeaturedShops;
