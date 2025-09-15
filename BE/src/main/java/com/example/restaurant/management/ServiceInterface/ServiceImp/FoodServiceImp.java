package com.example.restaurant.management.ServiceInterface.ServiceImp;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Food;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.ServiceInterface.FileService;
import com.example.restaurant.management.ServiceInterface.FoodService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FoodServiceImp implements FoodService {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    FileService fileService;

    @Autowired
    FoodRepository foodRepository;


    @Override
    public void addFoodByShopManager(FoodRequest foodRequest, @RequestHeader("Authorization") String authHeader) {
        // 1. Lấy userID từ token
        String token = authHeader.replace("Bearer ", "");
        Integer userID = jwtHelper.getClaimsFromToken(token).get("userID", Integer.class);

        // 2. Lấy shop của user
        Shops shop = shopsRepository.findShopByUserId(userID);
        if (shop == null) {
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }

        // 3. Kiểm tra category có thuộc shop của user không
        Category category = categoryRepository.findByIdAndShopId(foodRequest.getCategoryID(), shop.getId())
                .orElseThrow(() -> new FieldValidationException("categoryID", "Category not found in your shop", HttpStatus.BAD_REQUEST));

        // 4. Lưu food
        try {
            String foodImg = fileService.saveFile(foodRequest.getImage(), "food");

            Food food = new Food();
            food.setFoodName(foodRequest.getFoodName());
            food.setImage(foodImg);
            food.setPrice(foodRequest.getPrice());
            food.setDescription(foodRequest.getDescription());
            food.setCategory(category);

            foodRepository.save(food);
        } catch (IOException e) {
            throw new FieldValidationException("image", "Failed to save food image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @Override
    public List<FoodDTO> findFoodByCategory_Id(Integer categoryId) {
       List <Food> food = foodRepository.findFoodByCategory_Id(categoryId);

        List<FoodDTO> foodDTOList = new ArrayList<>();
        for (Food foodItem : food) {
            FoodDTO foodDTO = new FoodDTO();
            foodDTO.setFoodName(foodItem.getFoodName());
            foodDTO.setPrice(foodItem.getPrice());
            foodDTO.setDescription(foodItem.getDescription());
            foodDTO.setFoodImage(foodItem.getImage());
            foodDTO.setId(foodItem.getId());
            foodDTOList.add(foodDTO);
        }
        return foodDTOList;
    }


}
