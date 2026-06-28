import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/api";
import endpoints from "../../api/endpoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [resCategories, resShopCategories] = await Promise.all([
          apiGet(`${endpoints.category.all}`),
          apiGet(`${endpoints.category.shopCategories}`),
        ]);
        setCategories(resCategories.data.data);
        setShopCategories(resShopCategories.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectCategory = async (category) => {
    if (loading) return;

    try {
      const res = await apiPost(
        `${endpoints.category.toggle}?categoryId=${category.id}`
      );
      console.log(res.data);

      setShopCategories((prev) => {
        const exists = prev.some((c) => c.id === category.id);
        if (exists) {
          return prev.filter((c) => c.id !== category.id);
        } else {
          return [...prev, category];
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Categories</h1>
      <div>
        {categories.map((category) => {
          const isChecked = shopCategories.some((c) => c.id === category.id);
          return (
            <div key={category.id}>
              <label htmlFor={category.id}>
                <input
                  type="checkbox"
                  id={category.id}
                  name={category.name}
                  checked={isChecked}
                  onChange={() => handleSelectCategory(category)}
                  disabled={loading}
                />
                {category.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
