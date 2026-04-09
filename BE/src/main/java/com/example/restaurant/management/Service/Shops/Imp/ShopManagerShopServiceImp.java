package com.example.restaurant.management.Service.Shops.Imp;

import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.DTO.ShopLocationDTO;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Payload.Request.ShopUpdateRequest;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Service.Shops.ShopService;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ShopManagerShopServiceImp implements ShopService {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    ShopsRepository  shopsRepository;

    @Autowired
    FileService fileService;


    @Override
    public ShopDTO getShopById(Integer userId) {
        Shops shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        ShopDTO shopDTO = new ShopDTO();
        shopDTO.setName(shop.getShopName());
        shopDTO.setShopAvatar(shop.getShopImage());
        shopDTO.setId(shop.getId());
        shopDTO.setDescription(shop.getDescription());
        return shopDTO;
    }


    public void addShopImgByShopManager(MultipartFile file, String authHeader) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shops shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        try {
            String shopImg = fileService.saveFile(file, "shops");
            shop.setShopImage(shopImg);
            shopsRepository.save(shop);

        } catch (Exception e) {
            throw new RuntimeException(e);

        }
    }

    @Override
    public List<ShopLocationDTO> getAllShopLocations() {
        return List.of();
    }





    public void shopUpdate(String authHeader, ShopUpdateRequest shopUpdateRequest) {
        Integer userID = jwtHelper.getUserID(authHeader);
        Shops shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new RuntimeException("Shops not found");
        }
        if (shopUpdateRequest != null) {
            if (shopUpdateRequest.getName() != null) shop.setShopName(shopUpdateRequest.getName());
            if (shopUpdateRequest.getDescription() != null) shop.setDescription(shopUpdateRequest.getDescription());
            if (shopUpdateRequest.getAddress() != null){
                shop.setAddress(shopUpdateRequest.getAddress());
                shop.setLatitude(shopUpdateRequest.getLatitude());
                shop.setLongitude(shopUpdateRequest.getLongitude());
            }
            shopsRepository.save(shop);
        }
    }

    @Transactional
    public void updateShopAvatar(String authHeader, MultipartFile file) {
        if(file == null){
            throw new FieldValidationException("avatar","File is required", HttpStatus.BAD_REQUEST);
        }
        Integer userID = jwtHelper.getUserID(authHeader);
        Shops shop = shopsRepository.findShopsByManager_Id(userID);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        String oldAvatar = shop.getShopImage();
        String newAvatar = null;
        try {
            newAvatar = fileService.saveFile(file, "shops");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        shop.setShopImage(newAvatar);
        shopsRepository.save(shop);

        // ✅ Chỉ xóa sau khi DB transaction commit thành công
        if (oldAvatar != null && !oldAvatar.isBlank()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
                @Override
                public void afterCommit() {
                    fileService.deleteFile("shops", oldAvatar);
                }
            });
        }
    }
}
