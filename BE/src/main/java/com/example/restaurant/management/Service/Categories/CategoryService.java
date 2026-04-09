package com.example.restaurant.management.Service.Categories;

import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Payload.Request.CategoryRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getCategoriesOfShop(@RequestHeader("Authorization") String authHeader,  Integer shopId);
}
