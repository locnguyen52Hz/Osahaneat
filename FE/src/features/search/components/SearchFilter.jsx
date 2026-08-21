import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";
import { useModal } from "../../../contexts/ModalContext";
import styles from "../../assets/styles/SearchFilter.module.css";
import ActiveCategories from "../../category/components/ActiveCategories";

let cacheCategories = null;

function SearchFilter({ navigate }) {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [categories, setCategories] = useState([]);

  const { closeAllModal } = useModal();

  const handleSetFilter = (item) => {
    setSelectedFilter(item);
  };

  //lấy danh sách categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(endpoints.category.all);
        cacheCategories = res.data.data;
        setCategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const applyFilter = () => {
    if (!selectedFilter) return;
    navigate(`/search?category=${encodeURIComponent(selectedFilter.name)}`);
    closeAllModal();
  };
  return (
    <>
      <h3>Search Filter</h3>
      {/* <div>Sort by</div>
      <div>Price range</div> */}
      <div>
        <p>Categories</p>
        <ActiveCategories
          array={categories}
          setActive={handleSetFilter}
          btnColor={styles.category}
          btnActive={styles.active}
          active={selectedFilter?.id}
        />
      </div>
      <button onClick={applyFilter}>APPLY FILTER</button>
    </>
  );
}

export default SearchFilter;
