package com.example.restaurant.management.Service.Categories.Imp;

import com.example.restaurant.management.dto.CategoryDto;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Categories.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuyerCategoryServiceImp implements CategoryService {

    @Autowired
    ShopsRepository shopsRepository;


    @Override
    public List<CategoryDto> getCategoriesOfShop(String authHeader, Integer shopId) {
        Shop shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        List<Category> categories = shop.getCategories();
        List<CategoryDto> categoryDtoList = new ArrayList<>();
        for (Category category : categories) {
            CategoryDto categoryDTO = new CategoryDto();
            categoryDTO.setName(category.getName());
            categoryDTO.setId(category.getId());
            categoryDtoList.add(categoryDTO);
        }
        return categoryDtoList;
    }
}
