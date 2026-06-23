package com.example.restaurant.management.Service.Categories;

import com.example.restaurant.management.dto.CategoryDto;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getCategoriesOfShop(@RequestHeader("Authorization") String authHeader, Integer shopId);
}
