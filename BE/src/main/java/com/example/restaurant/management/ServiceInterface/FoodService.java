package com.example.restaurant.management.ServiceInterface;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public interface FoodService {
    void addFoodByShopManager(FoodRequest foodRequest, @RequestHeader("Authorization") String authHeader);
    List<FoodDTO> findFoodByCategory_Id(Integer categoryId);
}
