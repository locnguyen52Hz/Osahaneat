package com.example.restaurant.management.Service.Food;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public interface FoodService {
    List<FoodDTO> findFoodByCategory_Id(@RequestParam Integer categoryId, @RequestParam Integer shopId, Integer userId);
}
