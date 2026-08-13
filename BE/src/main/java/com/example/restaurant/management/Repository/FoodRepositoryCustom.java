package com.example.restaurant.management.Repository;

import com.example.restaurant.management.Payload.Request.SearchFoodByKeywordRequest;
import com.example.restaurant.management.dto.FoodSearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FoodRepositoryCustom {
    Page<FoodSearchDto> searchFoods (SearchFoodByKeywordRequest request, Pageable pageable);
}
