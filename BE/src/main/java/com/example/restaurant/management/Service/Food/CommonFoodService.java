package com.example.restaurant.management.Service.Food;

import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Food.Imp.BuyerFoodServiceImp;
import com.example.restaurant.management.Service.Food.Imp.ShopManagerFoodServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommonFoodService {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ShopManagerFoodServiceImp shopManagerFoodServiceImp;

    @Autowired
    BuyerFoodServiceImp buyerFoodServiceImp;

    public List<FoodDto> findFoodByCategory_Id(Integer categoryId, Integer shopId, String  authHeader) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();

        return switch (role) {
            case "ROLE_SHOP_MANAGER" -> shopManagerFoodServiceImp.findFoodByCategory_Id(categoryId, shopId, userId);
            case "ROLE_BUYER" -> buyerFoodServiceImp.findFoodByCategory_Id(categoryId, shopId, userId);
            default -> throw new RuntimeException("Role not authorized to access categories");
        };
    }

}
