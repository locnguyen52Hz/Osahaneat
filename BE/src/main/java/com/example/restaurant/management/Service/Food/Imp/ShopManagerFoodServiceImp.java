package com.example.restaurant.management.Service.Food.Imp;

import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.Entity.Category;
import com.example.restaurant.management.Entity.Food;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import com.example.restaurant.management.Repository.CategoryRepository;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Service.Food.FoodService;
import com.example.restaurant.management.Util.JwtHelper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
public class ShopManagerFoodServiceImp implements FoodService {

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

    @Autowired
    UserRepository userRepository;

    public void addFoodByShopManager(FoodRequest foodRequest, @RequestHeader("Authorization") String authHeader) {
        Integer userID = jwtHelper.getUserID(authHeader);

        // Lấy shop của user
        Shop shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }

        Category category = categoryRepository.getCategoryById(foodRequest.getCategoryId());

        //  Kiểm tra category có thuộc shop của user không
        boolean exists = categoryRepository.existsShopCategory(shop.getId(), foodRequest.getCategoryId());
        if (!exists) {
            throw new RuntimeException("This This category does not belong to your shop");
        }

        //  Lưu food
        try {
            String foodImg = fileService.saveFile(foodRequest.getImage(), "food");
            Food food = new Food();
            food.setName(foodRequest.getName());
            food.setImage(foodImg);
            food.setPrice(foodRequest.getPrice());
            food.setDescription(foodRequest.getDescription());
            food.setCategory(category);
            food.setShop(shop);

            foodRepository.save(food);
        } catch (IOException e) {
            throw new FieldValidationException("image", "Failed to save food image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public List<FoodDto> findFoodByCategory_Id(Integer categoryId, Integer shopId, Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));


        Shop shop = shopsRepository.findShopsByManager_Id(user.getId());
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        List<Food> foods = foodRepository.findFoodByCategory_IdAndShop_IdAndDeletedFalse(categoryId, shop.getId());
        List<FoodDto> foodDtoList = new ArrayList<>();
        for(Food food : foods) {
            FoodDto foodDTO = new FoodDto();
            foodDTO.setFoodName(food.getName());
            foodDTO.setImage(food.getImage());
            foodDTO.setPrice(food.getPrice());
            foodDTO.setDescription(food.getDescription());
            foodDTO.setFoodId(food.getId());
            foodDtoList.add(foodDTO);
        }

        return foodDtoList;
    }

    public void updateFood(FoodRequest foodRequest, String authHeader) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }

        Category category = categoryRepository.getCategoryById(foodRequest.getCategoryId());
        if (category == null) {
            throw new FieldValidationException("category", "Category not found", HttpStatus.BAD_REQUEST);
        }

        Food food = foodRepository.findByIdAndShop_IdAndCategory_IdAndDeletedFalse(
                foodRequest.getFoodId(), shop.getId(), category.getId());
        if (food == null) {
            throw new FieldValidationException("food", "Food not found", HttpStatus.BAD_REQUEST);
        }

        // Cập nhật thông tin cơ bản
        food.setName(foodRequest.getName());
        food.setDescription(foodRequest.getDescription());
        food.setPrice(foodRequest.getPrice());

        MultipartFile newImage = foodRequest.getImage();
        String oldImage = food.getImage();

        if (newImage != null && !newImage.isEmpty()) {
            // Chỉ upload ảnh mới khi có file
            String newImageName = null;
            try {
                newImageName = fileService.saveFile(newImage, "food");
                food.setImage(newImageName);
                foodRepository.save(food);

                if (oldImage != null) {
                    fileService.deleteFile("food", oldImage);
                }
            } catch (Exception e) {
                // Nếu upload ảnh mới thất bại, giữ nguyên ảnh cũ
                if (newImageName != null) {
                    try {
                        fileService.deleteFile("food", newImageName);
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
                throw new FieldValidationException("image", "Failed to update food image", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Không có ảnh mới → giữ nguyên ảnh cũ và chỉ cập nhật thông tin khác
            foodRepository.save(food);
        }
    }

    @Transactional
    public void deleteFoodById(Integer foodId, @RequestHeader("Authorization") String authHeader) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shop shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new FieldValidationException("shop", "Shop not found", HttpStatus.BAD_REQUEST);
        }
        Food food = foodRepository.findByIdAndShop_Id(foodId, shop.getId());
        if (food == null) {
            throw new FieldValidationException("food", "Food not found", HttpStatus.BAD_REQUEST);
        }
        food.setDeleted(true);
        foodRepository.save(food);
    }
}
