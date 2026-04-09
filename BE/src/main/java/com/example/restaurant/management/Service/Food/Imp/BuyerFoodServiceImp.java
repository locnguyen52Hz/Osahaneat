package com.example.restaurant.management.Service.Food.Imp;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Entity.Categories;
import com.example.restaurant.management.Entity.Food;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Food.FoodService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuyerFoodServiceImp implements FoodService {

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    FoodRepository foodRepository;

    @Override
    public List<FoodDTO> findFoodByCategory_Id(Integer categoryId, Integer shopId, Integer userId) {
        Shops shops = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        Categories category = categoryRepository.getCategoriesById(categoryId);
        if (category == null) {
            throw new RuntimeException("Category not found");
        }
        List<FoodDTO> foodDTOList = new ArrayList<>();
        List<Food> foodList = foodRepository.findFoodByCategories_IdAndShops_IdAndDeletedFalse(category.getId(), shops.getId());
        for (Food food : foodList) {
            FoodDTO foodDTO = new FoodDTO();
            foodDTO.setName(food.getName());
            foodDTO.setPrice(food.getPrice());
            foodDTO.setImage(food.getImage());
            foodDTO.setDescription(food.getDescription());
            foodDTO.setFoodId(food.getId());
            foodDTOList.add(foodDTO);
        }
        return foodDTOList;
    }
}
