package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.Payload.Request.RegisterRequest;
import com.example.restaurant.management.Payload.Request.ShopManagerRegister;
import com.example.restaurant.management.Entity.Roles;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Repository.RolesRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Util.StringUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class RegisterServiceImp implements com.example.restaurant.management.Service.RegisterService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RolesRepository rolesRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void registerBuyer(RegisterRequest registerRequest) {
        if (userRepository.findUserByEmail(registerRequest.getEmail()) != null) {
            throw new FieldValidationException("email","Email already exists", HttpStatus.CONFLICT);
        }
        Roles defaultRole = rolesRepository.findByRoleName("ROLE_BUYER");

        User user = new User();
        user.setEmail(registerRequest.getEmail().trim());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(defaultRole);
        user.setFullName(StringUtils.capitalizeEachWord(registerRequest.getFullName()));
        userRepository.save(user);

    }

    @Override
    public void registerShopManager(ShopManagerRegister shopManagerRegister) {
        if (userRepository.findUserByEmail(shopManagerRegister.getEmail()) != null) {
            throw new FieldValidationException("email","Email already exists", HttpStatus.CONFLICT);
        }
        if (shopsRepository.findByShopName(shopManagerRegister.getShopName()) != null) {
            throw new FieldValidationException("shopName","Shop already exists", HttpStatus.CONFLICT);
        }
        Roles role  = rolesRepository.findByRoleName("ROLE_SHOP_MANAGER");
        User user = new User();
        Shops shop = new Shops();
        user.setEmail(shopManagerRegister.getEmail().trim());
        user.setPassword(passwordEncoder.encode(shopManagerRegister.getPassword()));
        user.setRole(role);
        user.setFullName(StringUtils.capitalizeEachWord(shopManagerRegister.getFullName()));
        userRepository.save(user);

        shop.setShopName(StringUtils.capitalizeEachWord(shopManagerRegister.getShopName()));

        shop.setManager(user);
        shopsRepository.save(shop);
    }


}
