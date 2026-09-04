package com.example.restaurant.management.Service.Categories;


import com.example.restaurant.management.Enums.Roles;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Service.UserSecurity.UserSecurityService;
import com.example.restaurant.management.dto.CategoryDto;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Categories.Imp.BuyerCategoryServiceImp;
import com.example.restaurant.management.Service.Categories.Imp.ShopManagerCategoriesServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommonCategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ShopManagerCategoriesServiceImp shopManagerCategoriesServiceImp;

    @Autowired
    BuyerCategoryServiceImp buyerCategoryServiceImp;



    @Autowired
    UserSecurityService userSecurityService;


    public List<CategoryDto> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();
        List<CategoryDto> categoryDtoList = new ArrayList<>();
        for (Category category : categoryList) {
            CategoryDto categoryDTO = new CategoryDto();
            categoryDTO.setName(category.getName());
            categoryDTO.setId(category.getId());
            categoryDTO.setImage(category.getImage());
            categoryDtoList.add(categoryDTO);
        }
        return categoryDtoList;
    }


    public List<CategoryDto> getCategoriesOfShop(@RequestHeader("Authorization") String authHeader, Integer shopId) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_SHOP_MANAGER -> shopManagerCategoriesServiceImp.getCategoriesOfShop(authHeader, shopId);
            case ROLE_BUYER -> buyerCategoryServiceImp.getCategoriesOfShop(authHeader, shopId);
            default -> throw new RuntimeException("Role not authorized to access categories");
        };

    }



}
