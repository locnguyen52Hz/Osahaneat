import React, { useEffect, useState } from "react";
import FeaturedShops from "../../components/FeaturedShops.jsx";
import axios from "axios";
import { apiGet } from "../../api/api";
import style from "../../assets/styles/Home.module.css";
import useWebSocket from "../../hooks/useWebSocket.js";
import endpoints from "../../api/endpoints.js";

function Home() {
  const [shops, setShops] = useState([]);
  const token = localStorage.getItem("token");
  // useWebSocket(token);
  // console.log(shops)
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiGet(endpoints.shop.top6Shop);

        setShops(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className={style.main}>
      <FeaturedShops shops={shops} />
 
    </div>
  );
}

export default Home;
