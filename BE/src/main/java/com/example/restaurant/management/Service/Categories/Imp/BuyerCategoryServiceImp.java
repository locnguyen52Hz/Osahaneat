package com.example.restaurant.management.Service.Categories.Imp;

import com.example.restaurant.management.DTO.CategoryDTO;
import com.example.restaurant.management.Entity.Categories;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Categories.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuyerCategoryServiceImp implements CategoryService {

    @Autowired
    ShopsRepository shopsRepository;


    @Override
    public List<CategoryDTO> getCategoriesOfShop(String authHeader, Integer shopId) {
        Shops shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        List<Categories> categories = shop.getCategories();
        List<CategoryDTO> categoryDTOList = new ArrayList<>();
        for (Categories category : categories) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setName(category.getName());
            categoryDTO.setId(category.getId());
            categoryDTOList.add(categoryDTO);
        }
        return categoryDTOList;
    }
}
