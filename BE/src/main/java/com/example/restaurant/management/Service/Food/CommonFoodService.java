package com.example.restaurant.management.Service.Food;

import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.Roles;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Service.UserSecurity.UserSecurityService;
import com.example.restaurant.management.dto.FoodDto;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Food.Imp.BuyerFoodServiceImp;
import com.example.restaurant.management.Service.Food.Imp.ShopManagerFoodServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
import jakarta.persistence.EntityNotFoundException;
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

    @Autowired
    UserSecurityService userSecurityService;

    public List<FoodDto> findFoodByCategory_Id(Integer categoryId, Integer shopId, String  authHeader) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);


        return switch (userSecurityContext.role()) {
            case ROLE_SHOP_MANAGER -> shopManagerFoodServiceImp.findFoodByCategory_Id(categoryId, shopId, userSecurityContext.userId());
            case ROLE_BUYER -> buyerFoodServiceImp.findFoodByCategory_Id(categoryId, shopId, userSecurityContext.userId());
            default -> throw new RuntimeException("Role not authorized to access categories");
        };
    }

}
