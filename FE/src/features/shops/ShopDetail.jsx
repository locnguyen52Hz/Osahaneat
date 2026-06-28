import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPatchFile,
  apiPostFile,
} from "../../api/api";
import style from "../../assets/styles/ShopDetail.module.css";
import ShopCard from "../../features/shops/ShopCard";
import shared from "../../assets/styles/Shared.module.css";
import FoodList from "../foods/components/FoodList";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useModal } from "../../contexts/ModalContext";
import ActiveCategories from "../category/components/ActiveCategories";
import ShopHeader from "./ShopHeader";
import FoodDetail from "../foods/components/FoodDetail";
import { useCartStore } from "../../stores/Cart/useCartStore";
import { useLocationStore } from "../../stores/location/useLocationStore";

function ShopDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foods, setFoods] = useState([]);

  const currentLocation = useLocationStore((s) => s.currentLocation);

  const { closeAllModal, openModal } = useModal();
  const navigate = useNavigate();

  const addItem = useCartStore((s) => s.addItem);

  // ===== Lấy thông tin shop + categories =====
  useEffect(() => {
    if (!currentLocation) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const [shopRes, categoryResponse] = await Promise.all([
          apiGet(
            `${endpoints.shop.details}?shopId=${id}&longitude=${currentLocation.longitude}&latitude=${currentLocation.latitude}`,
          ),
          apiGet(`${endpoints.category.shopCategories}?shopId=${id}`),
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
        const resFood = await apiGet(
          `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${id}`,
        );
        setFoods(resFood.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu món ăn:", error);
      }
    };

    fetchFoods();
  }, [activeCategory]);

  const handleBuyNow = (food) => {
    openModal(
      <FoodDetail
        food={food}
        shopName={shop.shopName}
        shopId={shop.shopId}
        navigate={navigate}
      />,
      { type: "slide" },
    );
  };

  const handleAddToCart = (food) => {
    addItem(shop, food);
  };

  // const handleDeleteFood = async (foodId) => {
  //   console.log(foodId);
  //   try {
  //     await apiDelete(`${endpoints.food.delete}/${foodId}`);
  //     const resFood = await apiGet(
  //       `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`,
  //     );
  //     setFoods(resFood.data.data);
  //     closeAllModal();
  //     toast.success("Xóa thành công");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Xóa thất bại");
  //   }
  // };

  // ========= thêm mới food ===========
  // const onSubmitNewFood = async (newFood) => {
  //   const formData = new FormData();
  //   formData.append("name", newFood.name);
  //   formData.append("description", newFood.description);
  //   formData.append("price", newFood.price);
  //   formData.append("image", newFood.image);
  //   formData.append("categoryId", activeCategory.id);

  //   console.log(formData);
  //   try {
  //     const res = await apiPostFile(`${endpoints.food.insertFood}`, formData);
  //     const resFood = await apiGet(
  //       `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`,
  //     );
  //     setFoods(resFood.data.data);
  //     closeAllModal();
  //     toast.success("Thành công");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Thất bại");
  //   }
  // };

  //==========edit food==============
  // const onSubmitEditFood = async (editFood) => {
  //   console.log(editFood);

  //   const formData = new FormData();
  //   formData.append("name", editFood.name);
  //   formData.append("description", editFood.description);
  //   formData.append("price", editFood.price);
  //   formData.append("foodId", editFood.foodId);
  //   formData.append("categoryId", activeCategory.id);

  //   if (editFood.image instanceof File) {
  //     formData.append("image", editFood.image);
  //   }
  //   try {
  //     const res = await apiPatchFile(endpoints.food.edit, formData);
  //     const resFood = await apiGet(
  //       `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`,
  //     );

  //     setFoods(resFood.data.data);
  //     closeAllModal();
  //     toast.success("Chỉnh sửa thành công");
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Cập nhật thất bại");
  //   }
  // };

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
          />
        )}

        <FoodList
          shopName={shop.shopName}
          shopId={shop.shopId}
          foods={foods}
          handleBuyNow={handleBuyNow}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
}

export default ShopDetail;
