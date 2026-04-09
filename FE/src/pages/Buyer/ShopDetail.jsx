import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPatchFile,
  apiPostFile,
} from "../../api/api";
import style from "../../assets/styles/ShopDetail.module.css";
import ShopCard from "../../components/ShopCard";
import shared from "../../assets/styles/Shared.module.css";
import FoodList from "../../components/FoodList";
import endpoints from "../../api/endpoints";
import { toast } from "react-toastify";
import { useModal } from "../../contexts/ModalContext";
import ActiveCategories from "../../components/common/ActiveCategories";

function ShopDetail() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [foods, setFoods] = useState([]);
  const { closeAllModal } = useModal();

  const role = localStorage.getItem("role");

  // ===== Lấy thông tin shop + categories =====
  useEffect(() => {
    if (role === "ROLE_BUYER") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [shopRes, categoryResponse] = await Promise.all([
            apiGet(`${endpoints.shop.details}?shopId=${id}`),
            apiGet(`${endpoints.category.shopCategories}?shopId=${id}`),
          ]);
          setShop(shopRes.data.data);
          console.log(shopRes.data.data);
          setCategories(categoryResponse.data.data);
          setActiveCategory(categoryResponse.data.data[0]);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu shop:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [shopRes, categoryResponse] = await Promise.all([
            apiGet(`${endpoints.shop.details}`),
            apiGet(`${endpoints.category.shopCategories}`),
          ]);
          setShop(shopRes.data.data);
          setCategories(categoryResponse.data.data);
          setActiveCategory(categoryResponse.data.data[0]);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);
  // console.log(shop);

  const handleUpdateShop = async (key, newValue) => {
    try {
      await apiPatch(`${endpoints.shop.update}`, {
        [key]: newValue,
      });
      console.log("success");
      setShop((prev) => ({ ...prev, [key]: newValue }));
    } catch (error) {
      console.log(error);
    }
  };

  // ===== Lấy danh sách món ăn khi đổi category =====
  useEffect(() => {
    const fetchFoods = async () => {
      if (!activeCategory) return;
      try {
        const resFood = await apiGet(
          `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`
        );
        setFoods(resFood.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu món ăn:", error);
      }
    };

    fetchFoods();
  }, [activeCategory]);

  //==========xóa món=============
  const handleDeleteFood = async (foodId) => {
    console.log(foodId);
    try {
      await apiDelete(`${endpoints.food.delete}/${foodId}`);
      const resFood = await apiGet(
        `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`
      );
      setFoods(resFood.data.data);
      closeAllModal();
      toast.success("Xóa thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xóa thất bại");
    }
  };

  const handleClickCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // ========= thêm mới food ===========
  const onSubmitNewFood = async (newFood) => {
    const formData = new FormData();
    formData.append("name", newFood.name);
    formData.append("description", newFood.description);
    formData.append("price", newFood.price);
    formData.append("image", newFood.image);
    formData.append("categoryId", activeCategory.id);

    console.log(formData);
    try {
      const res = await apiPostFile(`${endpoints.food.insertFood}`, formData);
      const resFood = await apiGet(
        `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`
      );
      setFoods(resFood.data.data);
      closeAllModal();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error("Thất bại");
    }
  };

  //==========edit food==============
  const onSubmitEditFood = async (editFood) => {
    console.log(editFood);

    const formData = new FormData();
    formData.append("name", editFood.name);
    formData.append("description", editFood.description);
    formData.append("price", editFood.price);
    formData.append("foodId", editFood.foodId);
    formData.append("categoryId", activeCategory.id);

    if (editFood.image instanceof File) {
      formData.append("image", editFood.image);
    }
    try {
      const res = await apiPatchFile(endpoints.food.edit, formData);
      const resFood = await apiGet(
        `${endpoints.food.list}?categoryId=${activeCategory.id}&shopId=${shop.id}`
      );

      setFoods(resFood.data.data);
      closeAllModal();
      toast.success("Chỉnh sửa thành công");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thất bại");
    }
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
        <ShopCard
          handleChange={handleUpdateShop}
          setShop={setShop}
          shop={shop}
          type="detail"
          urlAvatar={endpoints.image.shop}
        />
      ) : (
        <p>Không tìm thấy cửa hàng</p>
      )}

      {/* Danh mục */}
      {!loading && (
        <ActiveCategories
          active={activeCategory?.id}
          setActive={setActiveCategory}
          array={categories}
          btnColor={shared.btnLight}
          btnActive={shared.navActive}
        />
      )}

      {/* Danh sách món ăn */}
      <FoodList
        shopName={shop.name}
        shopId={shop.id}
        foods={foods}
        onDeleteFood={handleDeleteFood}
        onSubmitNewFood={onSubmitNewFood}
        onSubmitEditFood={onSubmitEditFood}
      />
    </>
  );
}

export default ShopDetail;
