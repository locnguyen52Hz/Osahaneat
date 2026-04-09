package com.example.restaurant.management.Service.Shops;

import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.DTO.ShopLocationDTO;
import com.example.restaurant.management.Payload.Request.ShopUpdateRequest;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ShopService {
    ShopDTO getShopById(Integer shopId);
    List<ShopLocationDTO> getAllShopLocations();
}
