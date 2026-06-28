import React, { useEffect, useRef, useState } from "react";
import { getCategories } from "../../category/service/categoryService";
import Category from "../../category/components/Category";
import styles from "../../../assets/styles/Categories.module.css";
import { useNavigate } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const listRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await getCategories();
        setCategories(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleScroll = (direction) => {
    const scrollAmount = 300;

    listRef.current?.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleClick = (category) =>{

  }

  return (
    <div className={styles.wrapperCategory}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>Khám phá theo danh mục</p>
          <p>Lựa chọn món ăn theo sở thích của bạn</p>
        </div>
        <div className={styles.controllers}>
          <button onClick={() => handleScroll("left")} className={styles.btn}>
            <i className="bi bi-caret-left-fill"></i>
          </button>

          <button onClick={() => handleScroll("right")} className={styles.btn}>
            <i className="bi bi-caret-right-fill"></i>
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div ref={listRef} className={styles.list}>
          {!loading
            ? categories.map((ct) => (
                <Category
                  key={ct.id}
                  name={ct.name}
                  image={ct.image}
                  id={ct.id}
                />
              ))
            : "Đang tải..."}
        </div>
      </div>
    </div>
  );
}

export default Categories;
