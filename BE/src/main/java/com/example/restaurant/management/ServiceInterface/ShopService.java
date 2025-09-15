package com.example.restaurant.management.ServiceInterface;

import com.example.restaurant.management.DTO.ShopDTO;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ShopService {
    List<ShopDTO> getTop6Shops();
    ShopDTO getShopById(int shopID);

    void addShopImgByShopManager(MultipartFile file,  @RequestHeader ("Authorization")  String authHeader);
}
