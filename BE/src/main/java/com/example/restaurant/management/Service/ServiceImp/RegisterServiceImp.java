package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.Entity.Role;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.Roles;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Payload.Request.RegisterRequest;
import com.example.restaurant.management.Payload.Request.ShopManagerRegister;
import com.example.restaurant.management.Repository.RolesRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Util.StringUtils;
import com.example.restaurant.management.dto.RegisterResponseDto;
import com.example.restaurant.management.dto.ShopRegisterInfoDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    FileService fileService;

    @Override
    public RegisterResponseDto registerBuyer(RegisterRequest registerRequest) {
        if (userRepository.findUserByEmail(registerRequest.getEmail()) != null) {
            throw new FieldValidationException("email", "Email already exists", HttpStatus.CONFLICT);
        }
        Role defaultRole = rolesRepository.findByRoleName(Roles.ROLE_BUYER.name());

        User user = new User();
        user.setEmail(registerRequest.getEmail().trim());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(defaultRole);
        user.setFullName(StringUtils.capitalizeEachWord(registerRequest.getFullName()));
        userRepository.save(user);
        RegisterResponseDto registerResponseDto = new RegisterResponseDto();
        registerResponseDto.setEmail(user.getEmail());
        registerResponseDto.setFullName(user.getFullName());


        return registerResponseDto;
    }

    @Transactional
    @Override
    public RegisterResponseDto registerShopManager(ShopManagerRegister request) {

        String email = request.getEmail().trim();
        String shopName = request.getShopName().trim();

        if (userRepository.findUserByEmail(email) != null) {
            throw new FieldValidationException("email", "Email already exists", HttpStatus.CONFLICT);
        }

        if (shopsRepository.findByShopName(shopName) != null) {
            throw new FieldValidationException("shopName", "Shop name already exists", HttpStatus.CONFLICT);
        }

        MultipartFile image = request.getShopImage();

        if (image == null || image.isEmpty()) {
            throw new FieldValidationException("shopImage", "Shop image is required", HttpStatus.BAD_REQUEST);
        }

        Role role = rolesRepository.findByRoleName(Roles.ROLE_SHOP_MANAGER.name());

        if (role == null) {
            throw new IllegalStateException(Roles.ROLE_SHOP_MANAGER.name() + " role not found");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setFullName(StringUtils.capitalizeEachWord(request.getFullName()));

        userRepository.save(user);

        String fileName = null;
        Shop shop = new Shop();

        try {
            fileName = fileService.saveFile(image, "shops");

            shop.setShopName(StringUtils.capitalizeEachWord(shopName));
            shop.setShopImage(fileName);
            shop.setManager(user);

            shopsRepository.save(shop);

        } catch (Exception e) {

            if (fileName != null) {
                fileService.deleteFile("shops", fileName);
            }

            throw new RuntimeException(e);
        }

        RegisterResponseDto registerResponseDto = new RegisterResponseDto();
        ShopRegisterInfoDto shopRegisterInfoDto = new ShopRegisterInfoDto();
        registerResponseDto.setEmail(user.getEmail());
        registerResponseDto.setFullName(user.getFullName());
        registerResponseDto.setDescriptionRole(role.getDescription());
        shopRegisterInfoDto.setShopName(shop.getShopName());

        registerResponseDto.setShopRegisterInfo(shopRegisterInfoDto);
        return registerResponseDto;
    }


}
