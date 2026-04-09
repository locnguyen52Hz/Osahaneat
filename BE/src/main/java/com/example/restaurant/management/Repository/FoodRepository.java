package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer>, JpaSpecificationExecutor<Food> {
    Food findFoodByName(String foodName);

    List<Food> findFoodByCategories_IdAndShops_IdAndDeletedFalse(Integer categoriesId, Integer shopsId);

    List<Food> findFoodByCategories_Id(Integer categoriesId);

    Food findFoodById(Integer foodId);

    Food findByIdAndShops_IdAndCategories_IdAndDeletedFalse(Integer id, Integer shopId, Integer categoryId);

    Food findByIdAndShops_Id(Integer id, Integer shopsId);

    @Query(
            value = """
                        SELECT new com.example.restaurant.management.DTO.FoodDTO(
                            f.id,
                            f.name,
                            f.description,
                            f.price,
                            f.image,
                            s.id,
                            s.shopName
                        )
                        FROM Food f
                        JOIN f.shops s
                        WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))
                          AND f.deleted = false
                    """,
            countQuery = """
                        SELECT COUNT(f)
                        FROM Food f
                        JOIN f.shops s
                        WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))
                          AND f.deleted = false
                    """
    )
    Page<FoodDTO> searchFoodsByName(@Param("name") String name, Pageable pageable);


    @Query(value = """
                SELECT new com.example.restaurant.management.DTO.FoodDTO( f.id,f.name,f.description,f.price,f.image, s.id, s.shopName )
                 FROM Food f
                 JOIN f.shops s
                 JOIN s.categories sc
                 JOIN f.categories fc
                 WHERE LOWER(sc.name) LIKE LOWER(CONCAT('%', :name, '%'))
                 AND LOWER(fc.name) LIKE LOWER(CONCAT('%', :name, '%'))
                 AND f.deleted = false
            """,
            countQuery = """
                        SELECT COUNT(f)
                        FROM Food f
                        JOIN f.shops s
                        JOIN s.categories sc
                        WHERE LOWER(sc.name) = LOWER(:name)
                          AND LOWER(f.categories.name) = LOWER(:name)
                          AND f.deleted = false
                    """)
    Page<FoodDTO> findFoodByCategoryName(String name, Pageable pageable);


}
