package com.example.restaurant.management.Service.Food.Imp;

import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Food;
import com.example.restaurant.management.Entity.Shop;
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
    public List<FoodDto> findFoodByCategory_Id(Integer categoryId, Integer shopId, Integer userId) {
        Shop shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        Category category = categoryRepository.getCategoryById(categoryId);
        if (category == null) {
            throw new RuntimeException("Category not found");
        }
        List<FoodDto> foodDtoList = new ArrayList<>();
        List<Food> foodList = foodRepository.findFoodByCategory_IdAndShop_IdAndDeletedFalse(category.getId(), shop.getId());
        for (Food food : foodList) {
            FoodDto foodDTO = new FoodDto();
            foodDTO.setFoodName(food.getName());
            foodDTO.setPrice(food.getPrice());
            foodDTO.setImage(food.getImage());
            foodDTO.setDescription(food.getDescription());
            foodDTO.setFoodId(food.getId());
            foodDtoList.add(foodDTO);
        }
        return foodDtoList;
    }
}
