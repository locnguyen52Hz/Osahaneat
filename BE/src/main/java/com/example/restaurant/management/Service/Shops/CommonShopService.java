package com.example.restaurant.management.Service.Shops;

import com.example.restaurant.management.DTO.Coordinate;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Service.Shops.Imp.BuyerShopServiceImp;
import com.example.restaurant.management.Service.Shops.Imp.ShopManagerShopServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonShopService {

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    FileService fileService;

    @Autowired
    RoutesService routesService;

    @Autowired
    UserRepository  userRepository;

    @Autowired
    ShopManagerShopServiceImp  shopManagerShopServiceImp;

    @Autowired
    BuyerShopServiceImp  buyerShopServiceImp;

    public ShopDTO getShopById(String authHeader, Integer shopId, double longitude, double latitude ) {

        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();

        return switch (role) {
//            case "ROLE_SHOP_MANAGER" ->  shopManagerShopServiceImp.getShopById(userId);
            case "ROLE_BUYER" ->  buyerShopServiceImp.getShopById(shopId, longitude, latitude);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };

    }



}
