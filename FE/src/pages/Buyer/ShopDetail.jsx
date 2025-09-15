import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../api/api";
import style from "../../assets/styles/ShopDetail.module.css";
import ShopCard from "../../components/ShopCard";
import shared from '../../assets/styles/Shared.module.css'
import FoodList from "../../components/FoodList";
import endpoints from "../../api/endpoints";

function ShopDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foods, setFoods] = useState([]);
  // console.log(shop);

  // ===== Lấy thông tin shop + categories =====
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [shopRes, categoryResponse] = await Promise.all([
          apiGet(`${endpoints.shop.shopId}/${id}`),
          apiGet(`${endpoints.category.categories}=${id}`),
        ]);

        setShop(shopRes.data.data);
        
        setCategories(categoryResponse.data.data);
        // console.log(categoryResponse.data.data[0].id)

        if(categoryResponse.data.data.length > 0){
          setActiveCategory(categoryResponse.data.data[0].id)
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() =>{

  },[])

  // ===== Lấy danh sách món ăn khi đổi category =====
  useEffect(() => {
    const fetchFoods = async () => {
      if (!activeCategory) return;
      try {
        const res = await apiGet(`/api/food/category/${activeCategory}`);
        setFoods(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu món ăn:", error);
      }
    };

    fetchFoods();
  }, [activeCategory]);

  const handleClickCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      {/* Banner */}
      <div className={style.containerBanner}>
        <img className={style.bannerImg} src="/banner.jpg" alt="Banner" />
      </div>

      {/* Thông tin shop */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : shop ? (
        <ShopCard shop={shop} type="detail" urlAvatar={endpoints.image.shop} />
      ) : (
        <p>Không tìm thấy cửa hàng</p>
      )}

      {/* Danh mục */}
      {categories.length > 0 ? (
        <ul className={shared.nav}>
          {categories.map((category) => (
            <li
              className={`${shared.navLink} ${shared.btnLight} ${
                activeCategory === category.id ? shared.navActive : ""
              }`}
              key={category.id}
              onClick={() => handleClickCategory(category.id)}
            >
              {category.categoryName}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có danh mục</p>
      )}

      {/* Danh sách món ăn */}
      <FoodList shopName={shop.shopName} shopId = {shop.id} foods={foods}/>
    </>
  );
}

export default ShopDetail;
