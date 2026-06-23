package com.example.restaurant.management.Service.Categories.Imp;

import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Payload.Request.CategoryRequest;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminCategoriesServiceImp {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    JwtHelper jwtHelper;

    public void createCategory(CategoryRequest categoryRequest) {
        Category category = categoryRepository.findByName(categoryRequest.getName());
        if (category != null) {
            throw new FieldValidationException("name","Category already exists", HttpStatus.BAD_REQUEST);
        }
        category = new Category();
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
    }

}
