import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import endpoints from "../../api/endpoints";
import shared from "../../assets/styles/Shared.module.css";
import style from "../../assets/styles/ShopDetail.module.css";
import FoodList from "../foods/components/FoodList";

import { useLocationStore } from "../../stores/location/useLocationStore";
import ActiveCategories from "../category/components/ActiveCategories";
import ShopHeader from "./ShopHeader";

function ShopDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foods, setFoods] = useState([]);

  const currentLocation = useLocationStore((s) => s.currentLocation);

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

        <FoodList foods={foods} />
      </div>
    </>
  );
}

export default ShopDetail;
