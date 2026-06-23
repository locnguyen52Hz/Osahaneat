package com.example.restaurant.management.Service.Food;

import com.example.restaurant.management.dto.FoodDto;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public interface FoodService {
    List<FoodDto> findFoodByCategory_Id(@RequestParam Integer categoryId, @RequestParam Integer shopId, Integer userId);
}
