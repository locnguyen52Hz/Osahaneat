package com.example.restaurant.management.Repository;

import com.example.restaurant.management.dto.ShopCategoryProjection;
import com.example.restaurant.management.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByName(String name);


    @Query("SELECT COUNT(c) > 0 FROM Shop s JOIN s.categories c WHERE s.id = :shopId AND c.id = :categoryId")
    boolean existsShopCategory(@Param("shopId") Integer shopId, @Param("categoryId") Integer categoryId);

    @Modifying
    @Query(value = "DELETE FROM shops_categories WHERE shop_id = :shopId AND category_id = :categoryId", nativeQuery = true)
    void deleteShopCategory(@Param("shopId") Integer shopId, @Param("categoryId") Integer categoryId);

    @Modifying
    @Query(value = "INSERT INTO shops_categories (shop_id, category_id) VALUES (:shopId, :categoryId)", nativeQuery = true)
    void insertShopCategory(@Param("shopId") Integer shopId, @Param("categoryId") Integer categoryId);


    @Query("""
    SELECT
        s.id as shopId,
        c.id as categoryId,
        c.name as categoryName
    FROM Shop s
    JOIN s.categories c
    WHERE s.id IN :shopIds
    """)
    List<ShopCategoryProjection> findCategoriesByShopIds(
            @Param("shopIds") List<Integer> shopIds
    );

    Category getCategoryById(Integer id);
}

