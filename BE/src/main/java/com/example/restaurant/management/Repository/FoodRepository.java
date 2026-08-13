package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Entity.Food;
import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.dto.FoodSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer>, JpaSpecificationExecutor<Food> , FoodRepositoryCustom{
    Food findFoodByName(String foodName);

    List<Food> findFoodByCategory_IdAndShop_IdAndDeletedFalse(Integer categoriesId, Integer shopsId);

    List<Food> findFoodByCategory_Id(Integer categoriesId);

    Food findFoodById(Integer foodId);

    Food findByIdAndShop_IdAndCategory_IdAndDeletedFalse(Integer id, Integer shopId, Integer categoryId);

    Food findByIdAndShop_Id(Integer id, Integer shopsId);

    @Query(value = """
                SELECT new com.example.restaurant.management.dto.FoodDto(
                    f.id,
                    f.name,
                    f.description,
                    f.price,
                    f.image,
                    s.id,
                    s.shopName
                )
                FROM Food f
                JOIN f.shop s
                WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))
                  AND f.deleted = false
            """, countQuery = """
                SELECT COUNT(f)
                FROM Food f
                JOIN f.shop s
                WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))
                  AND f.deleted = false
            """)
    Page<FoodSearchDto> searchFoodsByKeyword(@Param("name") String name, Pageable pageable);


    @Query(value = """
                SELECT new com.example.restaurant.management.dto.FoodDto( f.id,f.name,f.description,f.price,f.image, s.id, s.shopName )
                 FROM Food f
                 JOIN f.shop s
                 JOIN s.categories sc
                 JOIN f.category fc
                 WHERE LOWER(sc.name) LIKE LOWER(CONCAT('%', :name, '%'))
                 AND LOWER(fc.name) LIKE LOWER(CONCAT('%', :name, '%'))
                 AND f.deleted = false
            """, countQuery = """
                SELECT COUNT(f)
                FROM Food f
                JOIN f.shop s
                JOIN s.categories sc
                WHERE LOWER(sc.name) = LOWER(:name)
                  AND LOWER(f.category.name) = LOWER(:name)
                  AND f.deleted = false
            """)
    Page<FoodDto> findFoodByCategoryName(String name, Pageable pageable);

    @Query(value = """
            SELECT new com.example.restaurant.management.dto.FoodDto(
                f.id,
                f.name,
                f.description,
                f.price,
                f.image,
                s.id,
                s.shopName
            )
            FROM Food f
            JOIN f.shop s
            WHERE f.category.id = :categoryId
              AND f.deleted = false
            """, countQuery = """
            SELECT COUNT(f)
            FROM Food f
            WHERE f.category.id = :categoryId
              AND f.deleted = false
            """)
    Page<FoodDto> findFoodByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);


    @Query(value = """
                SELECT
                f.id AS foodId,
                f.food_name AS foodName,
                f.image AS image,
                f.description AS description,
                f.price AS price,
                f.shop_id AS shopId,
                s.shop_name AS shopName,
                s.rating_count AS ratingCount,
                s.rating_avg AS ratingAvg,
                ST_Distance_Sphere(
                    POINT(s.longitude, s.latitude),
                    POINT(:userLng, :userLat)
                ) AS distance
            
            FROM foods f
            JOIN shops s ON f.shop_id = s.id
            
            WHERE (:keyword IS NULL OR f.food_name LIKE CONCAT('%', :keyword, '%'))
            AND ST_Distance_Sphere(
                    POINT(s.longitude, s.latitude),
                    POINT(:userLng, :userLat)
                ) <= :radiusInMeters
            
            ORDER BY s.rating_avg DESC
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM foods f
            JOIN shops s ON f.shop_id = s.id
            WHERE
                (:keyword IS NULL OR f.food_name LIKE CONCAT('%', :keyword, '%'))
                AND ST_Distance_Sphere(
                    POINT(s.longitude, s.latitude),
                    POINT(:userLng, :userLat)
                ) <= :radiusInMeters
            """, nativeQuery = true)
    Page<FoodSearchDto> searchFoodByDistance(@Param("keyword") String keyword, @Param("userLat") double userLat, @Param("userLng") double userLng, @Param("radiusInMeters") double radiusInMeters, Pageable pageable);


}
