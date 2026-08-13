import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ActiveCategories from "../../category/components/ActiveCategories";
import styles from "../../../assets/styles/SearchResults.module.css";
import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import ShopsList from "../../shops/ShopsList";
import FoodCard from "../../foods/components/FoodCard";
import { useModal } from "../../../contexts/ModalContext";
import FoodDetail from "../../foods/components/FoodDetail";
import Paginate from "../../../components/common/Paginate";
import { useLocationStore } from "../../../stores/location/useLocationStore";
import FoodList from "../../foods/components/FoodList";
import { SORT_BY, RADIUS } from "../../search/constant/searchConstant";
import { useFoodActions } from "../../../hooks/useFoodActions";
import { updateParams } from "../../search/helper/helper";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SearchToolbar from "../../search/components/SearchToolbar";

function SearchResults() {
  const [params, setParams] = useSearchParams();

  const query = {
    keyword: params.get("keyword"),
    categoryId: params.get("categoryId"),
    category: params.get("category"),
    sort: params.get("sort"),
    page: Number(params.get("page") ?? 0),
    radius: Number(params.get("radius") ?? RADIUS[0]),
  };

  const { keyword, categoryId, category, sort, page, radius } = query;

  const { handleBuyNow, handleAddToCart } = useFoodActions();

  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState({
    list: [],
    page,
    totalElement: 0,
    totalPages: 0,
    totalPages: 0,
  });

  console.log(results);

  const currentLocation = useLocationStore((s) => s.currentLocation);

  const handleChangeRadius = (value) => {
    updateParams(params, setParams, {
      radius: value,
      page: 0,
    });
  };

  const handleSort = (item) => {
    updateParams(params, setParams, {
      sort: item.type,
      page: 0,
    });
  };

  const handleChangePage = (page) => {
    console.log(page);
    updateParams(params, setParams, {
      page: page.selected,
    });
  };

  useEffect(() => {
    if (!currentLocation) return;
    const params = {
      keyword,
      categoryId,
      sortBy: sort,
      fromLatitude: currentLocation.latitude,
      fromLongitude: currentLocation.longitude,
      page,
      radius,
    };
    const fetchFoods = async () => {
      if (categoryId && keyword) return;
      setLoading(true);
      try {
        const res = await apiGet(endpoints.search.foodByKeyword, {
          params,
        });

        setResults(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [keyword, categoryId, sort, page, radius, currentLocation]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const searchText = keyword || category;

  return (
    <div className={styles.container}>
      <SearchToolbar
        sort={sort}
        radius={radius}
        handleSort={handleSort}
        handleChangeRadius={handleChangeRadius}
      />
      {results.list.length > 0 ? (
        <>
          <div className={styles.header}>
            <div className={styles.title}>
              <h3 className={styles.keyword}>"{searchText}"</h3>

              <p>
                Tìm thấy {results.totalElement} kết quả cho "{searchText}" tại
                khu vực của bạn
              </p>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.listResults}>
              <FoodList
                foods={results.list}
                handleAddToCart={handleAddToCart}
                handleBuyNow={handleBuyNow}
              />
            </div>
          </div>

          {results.totalPages > 0 && (
            <div className={styles.paginate}>
              <Paginate
                forcePage={results.page}
                onPageChange={handleChangePage}
                pageCount={results.totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={1}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          Không tìm thấy kết quả cho "{searchText}" trong bán kính{" "}
          {radius / 1000} km
        </div>
      )}
    </div>
  );
}

export default SearchResults;
