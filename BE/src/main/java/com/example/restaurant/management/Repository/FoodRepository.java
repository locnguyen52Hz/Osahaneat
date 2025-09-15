package com.example.restaurant.management.Repository;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
 Food findFoodByFoodName(String foodName);
 List<Food> findFoodByCategory_Id(Integer categoryId);

 Food findFoodById(int foodId);

}
