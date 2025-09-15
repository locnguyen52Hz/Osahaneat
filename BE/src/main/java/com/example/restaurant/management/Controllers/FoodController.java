package com.example.restaurant.management.Controllers;

import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.ServiceInterface.FileService;
import com.example.restaurant.management.ServiceInterface.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/food")
public class FoodController {

    @Autowired
    FoodService foodService;
    @Autowired
    FileService fileService;

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<?> getFoodImg(@PathVariable String filename) {
        String folder = "food";
        Resource resource = fileService.loadFileAsResource(folder,filename);
        if (resource == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"").body(resource);
    }

    @PostMapping("/shop-manager/add-food")
    @PreAuthorize("hasAnyRole('SHOP_MANAGER')")
    public ResponseEntity<?> addFood(@ModelAttribute FoodRequest foodRequest, @RequestHeader("Authorization")String  authHeader) {
        ResponseData responseData = new ResponseData();
        foodService.addFoodByShopManager(foodRequest, authHeader);
        responseData.setSuccess(true);
        responseData.setMessage("Added Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/category/{id}")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getFoodByCategoryID(@PathVariable Integer id) {
        ResponseData responseData = new ResponseData();
        List<FoodDTO> foodDTOList = foodService.findFoodByCategory_Id(id);
        responseData.setSuccess(true);
        responseData.setData(foodDTOList);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


}
