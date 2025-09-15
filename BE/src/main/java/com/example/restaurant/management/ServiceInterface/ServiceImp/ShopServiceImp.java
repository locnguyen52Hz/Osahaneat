package com.example.restaurant.management.ServiceInterface.ServiceImp;

import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.ServiceInterface.FileService;
import com.example.restaurant.management.ServiceInterface.ShopService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShopServiceImp implements ShopService {

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    FileService fileService;

    @Override
    public List<ShopDTO> getTop6Shops() {
        List<Shops> shops = shopsRepository.findTop6ByOrderByIdDesc();
        List<ShopDTO> shopDTOS = new ArrayList<>();
        for (Shops shop : shops) {
            ShopDTO shopDTO = new ShopDTO();
            shopDTO.setShopName(shop.getShopName());
            shopDTO.setLatitude(shop.getLatitude());
            shopDTO.setLatitude(shop.getLatitude());
            shopDTO.setShopAvatar(shop.getShopImage());
            shopDTO.setId(shop.getId());
            shopDTOS.add(shopDTO);
        }
        return shopDTOS;
    }

    @Override
    public ShopDTO getShopById(int shopID) {
        Shops shop = shopsRepository.findShopsById(shopID);
        if (shop != null) {
            ShopDTO shopDTO = new ShopDTO();
            shopDTO.setShopName(shop.getShopName());
            shopDTO.setLatitude(shop.getLatitude());
            shopDTO.setLatitude(shop.getLatitude());
            shopDTO.setShopAvatar(shop.getShopImage());
            shopDTO.setId(shop.getId());
            shopDTO.setDescription(shop.getDescription());
            return shopDTO;
        }
        return null;
    }

    @Override
    public void addShopImgByShopManager(MultipartFile file, String authHeader) {
        String  token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        Integer userID = claims.get("userID", Integer.class);
        Shops shop = shopsRepository.findShopByUserId(userID);
        if(shop == null){
            throw new RuntimeException("Shop not found");
        }
        try{
            String shopImg = fileService.saveFile(file, "shops");
            shop.setShopImage(shopImg);
            shopsRepository.save(shop);

        }catch (Exception e){}
    }


}
