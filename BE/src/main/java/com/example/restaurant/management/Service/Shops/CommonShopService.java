package com.example.restaurant.management.Service.Shops;

import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Service.Shops.Imp.BuyerShopServiceImp;
import com.example.restaurant.management.Service.UserSecurity.UserSecurityService;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.ShopDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonShopService {


    @Autowired
    JwtHelper jwtHelper;


    @Autowired
    UserRepository userRepository;


    @Autowired
    BuyerShopServiceImp buyerShopServiceImp;

    @Autowired
    UserSecurityService userSecurityService;

    public ShopDto getShopById(String authHeader, Integer shopId, double longitude, double latitude) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);


        return switch (userSecurityContext.role()) {
//            case "ROLE_SHOP_MANAGER" ->  shopManagerShopServiceImp.getShopById(userId);
            case ROLE_BUYER -> buyerShopServiceImp.getShopById(shopId, longitude, latitude);
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };

    }


}
