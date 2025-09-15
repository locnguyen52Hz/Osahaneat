package com.example.restaurant.management.ServiceInterface.ServiceImp;


import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.ServiceInterface.CategoryService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImp implements CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Override
    public void createCategoryByShopManager(String name , String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        Integer userID = claims.get("userID", Integer.class);
        System.out.println(userID);
        //lấy shop từ userID
        Shops shops = shopsRepository.findShopByUserId(userID);

        if( shops == null){
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }

        createCategoryCommon(name,shops.getId());
    }

    @Override
    public void createCategoryByAdmin(String categoryName, int shopID) {
        Shops shops = shopsRepository.findShopsById(shopID);
        if( shops == null){
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }
        createCategoryCommon(categoryName,shops.getId());
    }

    @Override
    public List<CategoryDTO> getAllCategories(Integer shopID) {
        List<Category> categories = categoryRepository.getCategoriesByShopId(shopID);
        List<CategoryDTO> categoryDTOS = new ArrayList<>();
        for (Category category : categories) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryName(category.getCategoryName());
            categoryDTO.setId( category.getId());
            categoryDTOS.add(categoryDTO);
        }
        return categoryDTOS;
    }


    //hàm dùng chung cho admin và shop_manager
    private void createCategoryCommon(String categoryName, int shopID) {
        if(categoryRepository.existsByNameIgnoreCaseAndShop_Id(categoryName, shopID)){
            throw new FieldValidationException("category", "Category already exists", HttpStatus.BAD_REQUEST);
        }
        Category category = new Category();
        category.setCategoryName(categoryName.trim());
        category.setShop(shopsRepository.findShopsById(shopID));
        categoryRepository.save(category);
    }



}
