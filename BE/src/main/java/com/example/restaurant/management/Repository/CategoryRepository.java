package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository  extends JpaRepository<Category,Integer> {
    @Query("""
    SELECT c 
    FROM Category c 
    WHERE LOWER(TRIM(c.name)) = LOWER(TRIM(:name)) 
      AND c.shop.id = :shopId
""")
    List<Category> findByNameAndShopId(@Param("name") String name, @Param("shopId") Integer shopId);

    boolean existsByNameIgnoreCaseAndShop_Id(String name, int shopID);
    Category findCategoryById(int id);

    List<Category> getCategoriesByShopId(Integer shopID);

    @Query("SELECT c FROM Category c WHERE c.id = :categoryId AND c.shop.id = :shopId")
    Optional<Category> findByIdAndShopId(@Param("categoryId") int categoryId, @Param("shopId") int shopId);



}
