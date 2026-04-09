package com.example.restaurant.management.Controllers;
import com.example.restaurant.management.DTO.FoodDTO;
import com.example.restaurant.management.Payload.Request.FoodRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Service.Food.CommonFoodService;
import com.example.restaurant.management.Service.Food.Imp.ShopManagerFoodServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/food")
public class FoodController {

    @Autowired
    FileService fileService;

    @Autowired
    ShopManagerFoodServiceImp shopManagerFoodServiceImp;

    @Autowired
    CommonFoodService commonFoodService;



    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<?> getFoodImg(@PathVariable String filename) {
        String folder = "food";
        Resource resource = fileService.loadFileAsResource(folder,filename);
        if (resource == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"").body(resource);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('SHOP_MANAGER')")
    public ResponseEntity<?> addFood(@ModelAttribute FoodRequest foodRequest, @RequestHeader("Authorization")String  authHeader) {
        ResponseData responseData = new ResponseData();
        shopManagerFoodServiceImp.addFoodByShopManager(foodRequest, authHeader);
        responseData.setSuccess(true);
        responseData.setMessage("Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getFoodByCategoryID(@RequestParam Integer categoryId, @RequestParam(required = false) Integer shopId, @RequestHeader("Authorization")String  authHeader) {
        List<FoodDTO> foodDTOList = commonFoodService.findFoodByCategory_Id(categoryId, shopId, authHeader);
        ResponseData responseData = new ResponseData();
        responseData.setSuccess(true);
        responseData.setData(foodDTOList);
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("edit")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?>updateFood(@ModelAttribute FoodRequest foodRequest, @RequestHeader("Authorization")String  authHeader) {
        ResponseData responseData = new ResponseData();
        shopManagerFoodServiceImp.updateFood(foodRequest, authHeader);
        responseData.setSuccess(true);
        responseData.setMessage("Successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("delete/{foodId}")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> deleteFood(@RequestHeader("Authorization")String  authHeader, @PathVariable Integer foodId) {
        ResponseData responseData = new ResponseData();
        shopManagerFoodServiceImp.deleteFoodById(foodId, authHeader);
        responseData.setSuccess(true);
        responseData.setMessage("Successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
