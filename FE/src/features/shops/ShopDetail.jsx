import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import style from "../../assets/styles/ShopDetail.module.css";
import ShopCard from "../../features/shops/ShopCard";
import shared from "../../assets/styles/Shared.module.css";
import FoodList from "../foods/components/FoodList";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";

import ActiveCategories from "../category/components/ActiveCategories";
import ShopHeader from "./ShopHeader";
import FoodDetail from "../foods/components/FoodDetail";
import { useCartStore } from "../../stores/Cart/useCartStore";
import { useLocationStore } from "../../stores/location/useLocationStore";
import { useFoodActions } from "../../hooks/useFoodActions";

function ShopDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foods, setFoods] = useState([]);

  const currentLocation = useLocationStore((s) => s.currentLocation);
  const { handleBuyNow, handleAddToCart } = useFoodActions();

  const addItem = useCartStore((s) => s.addItem);

  // ===== Lấy thông tin shop + categories =====
  useEffect(() => {
    if (!currentLocation) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const [shopRes, categoryResponse] = await Promise.all([
          api.get(
            `${endpoints.shop.details}?shopId=${id}&longitude=${currentLocation.longitude}&latitude=${currentLocation.latitude}`,
          ),
          api.get(`${endpoints.category.shopCategories}?shopId=${id}`),
        ]);
        setShop(shopRes.data.data);

        // console.log(shopRes.data.data);
        setCategories(categoryResponse.data.data);
        setActiveCategory(categoryResponse.data.data[0]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu shop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentLocation]);

  useEffect(() => {
    const fetchFoods = async () => {
      if (!activeCategory) return;
      try {
        const resFood = await api.get(
          `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${id}`,
        );
        setFoods(resFood.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu món ăn:", error);
      }
    };

    fetchFoods();
  }, [activeCategory]);

  return (
    <>
      {/* Banner */}

      <img className={style.bannerImg} src="/banner.jpg" alt="Banner" />
      <div className={style.pagePadding}>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : shop ? (
          <ShopHeader shop={shop} />
        ) : (
          <p>Không tìm thấy cửa hàng</p>
        )}

        {!loading && (
          <ActiveCategories
            active={activeCategory?.id}
            setActive={setActiveCategory}
            array={categories}
            btnColor={shared.btnLight}
            btnActive={shared.navActive}
            getKey={(item) => item.id}
            getLabel={(item) => item.name}
          />
        )}

        <FoodList
          foods={foods}
          handleBuyNow={handleBuyNow}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
}

export default ShopDetail;
