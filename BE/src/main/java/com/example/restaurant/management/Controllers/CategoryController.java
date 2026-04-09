package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Payload.Request.CategoryRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.Categories.Imp.AdminCategoriesServiceImp;
import com.example.restaurant.management.Service.Categories.CommonCategoryService;
import com.example.restaurant.management.Service.Categories.Imp.ShopManagerCategoriesServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    ShopManagerCategoriesServiceImp shopManagerCategoriesServiceImp;

    @Autowired
    AdminCategoriesServiceImp adminService;

    @Autowired
    CommonCategoryService commonService;

    //Shop_manager
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest categoryRequest) {
        ResponseData responseData = new ResponseData();
        adminService.createCategory(categoryRequest);
        responseData.setSuccess(true);
        responseData.setMessage("Created Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }


    @GetMapping("all-categories")
    public ResponseEntity<?> getAllCategories() {
        ResponseData responseData = new ResponseData();
        List<CategoryDTO>  categoryDTOS = commonService.getAllCategories();
        responseData.setSuccess(true);
        responseData.setMessage("All Categories");
        responseData.setData(categoryDTOS);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @GetMapping("shop-categories")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER','ROLE_BUYER')")
    public ResponseEntity<?> getShopCategories(@RequestHeader ("Authorization") String authHeader, @RequestParam(required = false) Integer shopId) {
        ResponseData responseData = new ResponseData();
        List<CategoryDTO> categoryDTOS = commonService.getCategoriesOfShop(authHeader, shopId);
        responseData.setSuccess(true);
        responseData.setMessage("Shop Categories");
        responseData.setData(categoryDTOS);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @PostMapping("/toggle-category")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> toggleShopCategory(@RequestHeader("Authorization")  String authHeader, @RequestParam(required = false) Integer categoryId) {
        ResponseData responseData = new ResponseData();
        String message = shopManagerCategoriesServiceImp.toggleShopCategory(authHeader,categoryId);
        responseData.setSuccess(true);
        responseData.setMessage(message);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }


}
