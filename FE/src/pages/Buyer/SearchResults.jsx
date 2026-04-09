import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ActiveCategories from "../../components/common/ActiveCategories";
import styles from "../../assets/styles/SearchResults.module.css";
import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import { useLocation as location } from "../../contexts/LocationContext";
import ShopsList from "../../components/ShopsList";
import FoodCard from "../../components/FoodCard";
import { useModal } from "../../contexts/ModalContext";
import FoodDetail from "../../components/FoodDetail";
import Paginate from "../../components/common/Paginate";

const types = [
  { name: "shop", id: 1, icon: <i className="bi bi-house-door-fill"></i> },
  { name: "food", id: 2, icon: <i className="bi bi-fork-knife"></i> },
];

function SearchResults() {
  const [params, setParams] = useSearchParams();
  const { isLocationReday } = location();
  // console.log(isLocationReday);
  const [searchType, setSearchType] = useState(types[0].id);
  console.log(searchType);
  const type = params.get("type") ?? "shop";
  const keyword = params.get("keyword");
  const page = params.get("page") ?? 0;
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState(null);
  const [foods, setFoods] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const updatePage = (newPage) => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", newPage);
    setParams(newParams, { replace: true });
  };

  const onChangeType = (newType) => {
    console.log(newType);
    const newParams = new URLSearchParams(params);
    newParams.set("type", newType.name);
    setParams(newParams, { replace: true });
    setSearchType(newType.id);
  };

  useEffect(() => {
    if (!keyword || !isLocationReday) return;
    setLoading(true);
    setIsFetched(false);

    // nếu type = shop
    if (type === "shop") {
      const fetchShops = async () => {
        try {
          const res = await apiGet(
            `${endpoints.search.shopsByCategory}?category=${keyword}&userLat=${isLocationReday.latitude}&userLon=${isLocationReday.longitude}&page=${page}`
          );
          console.log(res.data.data);
          setShops(res.data.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          setIsFetched(true);
        }
      };
      fetchShops();
    }

    // nếu type = food
    if (type === "food") {
      const fetchFoods = async () => {
        try {
          const res = await apiGet(
            `${endpoints.search.foodByCategoryName}?category=${keyword}&page=${page}`
          );
          console.log(res.data.data);

          setFoods(res.data.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          setIsFetched(true);
        }
      };
      fetchFoods();
    }
  }, [type, keyword, page, isLocationReday]);

  useEffect(() => {});

  const { openModal } = useModal();
  const navigate = useNavigate();
  const handleOpenModal = (food, shopName, shopId) => {
    openModal(
      <FoodDetail
        food={food}
        shopName={shopName}
        shopId={shopId}
        navigate={navigate}
      />,
      {
        type: "slide",
      }
    );
  };

  return (
    <>
      <div className={styles.header}>
        {shops?.list.length > 0 ? (
          <h1>Search results for "{keyword}" </h1>
        ) : (
          <h1>Search results</h1>
        )}
      </div>
      <>
        <ActiveCategories
          array={types}
          active={searchType}
          setActive={onChangeType}
          btnColor={styles.searchTypes}
          btnActive={styles.active}
        />
      </>
      <div>
        {loading && "đang tải"}
        {!loading && type === "shop" && <ShopsList list={shops?.list} />}
        {shops?.totalPages > 1 ? (
          <Paginate pageCount={shops?.list} onPageChange={updatePage} />
        ) : (
          ""
        )}
        {!loading && type === "food" && (
          <div className={styles.foodList}>
            {foods?.list.map((item) => (
              <FoodCard
                food={item}
                key={item.foodId}
                onClick={() =>
                  handleOpenModal(item, item.shopName, item.shopId)
                }
              />
            ))}
          </div>
        )}

        {foods?.totalPages > 1 ? (
          <Paginate pageCount={foods?.list} onPageChange={updatePage} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default SearchResults;
