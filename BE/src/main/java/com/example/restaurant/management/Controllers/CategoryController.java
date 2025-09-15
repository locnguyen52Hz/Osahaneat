package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Payload.Request.CategoryRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.ServiceInterface.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    //Shop_manager
    @PostMapping("/shopmanager/create")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> createCategoryForShopManager(@RequestBody CategoryRequest categoryRequest, @RequestHeader("Authorization") String authHeader) {
        ResponseData responseData = new ResponseData();
        categoryService.createCategoryByShopManager(categoryRequest.getName(), authHeader);
        responseData.setSuccess(true);
        responseData.setMessage("Created Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createCategoryForAdmin(@RequestBody CategoryRequest categoryRequest) {
        ResponseData responseData = new ResponseData();
        categoryService.createCategoryByAdmin(categoryRequest.getName(), categoryRequest.getShopID());
        responseData.setSuccess(true);
        responseData.setMessage("Created Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData,HttpStatus.CREATED);
    }

    @GetMapping("shop-category")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getAllCategories(@RequestParam Integer shopID) {
        ResponseData responseData = new ResponseData();
        List<CategoryDTO>  categoryDTOS = categoryService.getAllCategories(shopID);
        responseData.setSuccess(true);
        responseData.setMessage("All Categories");
        responseData.setData(categoryDTOS);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

}
