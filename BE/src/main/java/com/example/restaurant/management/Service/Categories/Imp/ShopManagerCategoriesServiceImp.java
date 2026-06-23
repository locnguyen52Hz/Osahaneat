package com.example.restaurant.management.Service.Categories.Imp;

import com.example.restaurant.management.dto.CategoryDto;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Categories.CategoryService;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopManagerCategoriesServiceImp implements CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    JwtHelper jwtHelper;


    @Transactional
    public String toggleShopCategory(String authHeader, Integer categoryId) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        Category category = categoryRepository.getCategoryById(categoryId);
        if (category == null) {
            throw new RuntimeException("Category not found");
        }
        boolean exists = categoryRepository.existsShopCategory(shop.getId(), categoryId);
        if (!exists) {
            categoryRepository.insertShopCategory(shop.getId(), categoryId);
            return "Insert category successfully";
        }
        else {
            categoryRepository.deleteShopCategory(shop.getId(), categoryId);
            return "Delete category successfully";
        }
    }


    @Override
    public List<CategoryDto> getCategoriesOfShop(String authHeader, Integer shopId) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
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
