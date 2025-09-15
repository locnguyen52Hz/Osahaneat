package com.example.restaurant.management.ServiceInterface;

import com.example.restaurant.management.DTO.CategoryDTO;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public interface CategoryService {
    void createCategoryByShopManager(String name, @RequestHeader("Authorization") String authHeader);
    void createCategoryByAdmin(String categoryName, int shopID);
    List<CategoryDTO> getAllCategories(Integer shopID);
}
