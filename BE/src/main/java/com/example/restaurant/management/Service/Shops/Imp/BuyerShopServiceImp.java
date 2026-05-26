package com.example.restaurant.management.Service.Shops.Imp;

import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.DTO.ShopLocationDTO;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Payload.Request.ShopUpdateRequest;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Service.Shops.ShopService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuyerShopServiceImp implements ShopService {

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    RoutesService  routesService;

    public List<ShopDTO> getTop6Shops() {
        List<Shops> shops = shopsRepository.findTop6ByOrderByIdDesc();
        List<ShopDTO> shopDTOS = new ArrayList<>();
        for (Shops shop : shops) {
            ShopDTO shopDTO = new ShopDTO();
            shopDTO.setName(shop.getShopName());
            shopDTO.setShopAvatar(shop.getShopImage());
            shopDTO.setId(shop.getId());
            shopDTOS.add(shopDTO);
            shopDTO.setAddress(shop.getAddress());
        }
        return shopDTOS;
    }

    @Override
    public ShopDTO getShopById(Integer shopId) {
        Shops shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        ShopDTO shopDTO = new ShopDTO();
        shopDTO.setName(shop.getShopName());
        shopDTO.setShopAvatar(shop.getShopImage());
        shopDTO.setId(shop.getId());
        shopDTO.setDescription(shop.getDescription());
        return shopDTO;
    }


    @Override
    public List<ShopLocationDTO> getAllShopLocations() {
        return shopsRepository.getAllShopsLocations();
    }

    public List<OsrmTableResponse> getLocationsOfTop6Shops(double fromLongitude, double fromLatitude) {
        List<ShopDTO> shopDTOS = shopsRepository.findTop6ShopsLocation();
        List<OsrmTableResponse> osrmTableResponses = new ArrayList<>();

        for (ShopDTO shopDTO : shopDTOS) {
            OsrmTableResponse osrmTableResponse = routesService.getDistance(
                    fromLongitude, fromLatitude,
                    shopDTO.getLongitude(), shopDTO.getLatitude()
            );

            osrmTableResponse.setShopId(shopDTO.getId());

            // Lấy ra khoảng cách [0][1] từ dữ liệu OSRM
            if (osrmTableResponse.getDistances() != null &&
                    !osrmTableResponse.getDistances().isEmpty() &&
                    osrmTableResponse.getDistances().get(0).size() > 1) {
                double distance = osrmTableResponse.getDistances().get(0).get(1) / 1000;
                osrmTableResponse.setDistance(distance);
            } else {
                osrmTableResponse.setDistance(null);
            }
            osrmTableResponses.add(osrmTableResponse);
        }

        return osrmTableResponses;
    }


}
