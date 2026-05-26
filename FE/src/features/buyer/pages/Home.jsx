import React, { useEffect, useState } from "react";
import FeaturedShops from "../../../features/shops/FeaturedShops.jsx";
import { apiGet } from "../../../api/api";
import style from "../../../assets/styles/Home.module.css";
import endpoints from "../../../api/endpoints.js";
import { useLocation } from "../../../contexts/LocationContext.jsx";

function Home() {
  const [shops, setShops] = useState([]);
  const { location, loading } = useLocation();

  const [distances, setDistances] = useState([]);

  useEffect(() => {
    if (loading) return;

    const fetchDistance = async () => {
      try {
        const resDistance = await apiGet(
          `${endpoints.shop.distance}?fromLongitude=${location.longitude}&fromLatitude=${location.latitude}`,
        );
        setDistances(resDistance.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDistance();
  }, [loading]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiGet(endpoints.shop.top6Shop);
        setShops(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    if (distances.length === 0) return;

    setShops((prev) =>
      prev.map((shop) => {
        const found = distances.find((distance) => distance.shopId === shop.id);
        return { ...shop, distance: found?.distance ?? null };
      }),
    );
  }, [distances]);

  return (
    <div className={style.main}>
      <FeaturedShops shops={shops} />
    </div>
  );
}

export default Home;
