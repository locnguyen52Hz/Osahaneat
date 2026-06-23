package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.dto.ShopDto;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.Search.Imp.BuyerSearchServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/search")
@PreAuthorize("hasAnyRole('ROLE_BUYER')")
public class SearchController {

    @Autowired
    BuyerSearchServiceImp buyerSearchServiceImp;

    @GetMapping("/shops-by-category")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getShopByCategory(@RequestParam String category,
                                                           @RequestParam double userLat,
                                                           @RequestParam double userLon,
                                                           @RequestParam int page
    ) {
        ResponseData  responseData = new ResponseData();
        Page<ShopDto> shopDTOSPage = buyerSearchServiceImp.findShopsByCategoryWithQuantity(category, userLon,userLat, page);
        Map<String,Object> map = new HashMap<>();
        map.put("list",shopDTOSPage.getContent());
        map.put("totalElement",shopDTOSPage.getTotalElements());
        map.put("page",shopDTOSPage.getNumber());
        map.put("size",shopDTOSPage.getSize());
        map.put("totalPages",shopDTOSPage.getTotalPages());
        responseData.setData(map);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/food-name")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> searchFoodName(@RequestParam String name, @RequestParam int page) {
        ResponseData  responseData = new ResponseData();
        Map<String,Object> map = buyerSearchServiceImp.searchFoods(name,page);
        responseData.setData(map);
        responseData.setMessage("success");
        responseData.setSuccess(true);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/food-by-category")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getFoodByCategory(@RequestParam String category, @RequestParam int page) {
        ResponseData  responseData = new ResponseData();
        Map<String,Object> map = buyerSearchServiceImp.searchFoodsByCategoryName(category, page);
        responseData.setData(map);
        responseData.setMessage("success");
        responseData.setSuccess(true);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


}
