package com.example.restaurant.management.Controllers;

import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.ServiceInterface.FileService;
import com.example.restaurant.management.ServiceInterface.ShopService;
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
@RequestMapping("api/shops")
public class ShopController {

    @Autowired
    FileService fileService;

    @Autowired
    ShopService shopService;


    @GetMapping("/top-6-shops")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getTop6Shop(){
        ResponseData responseData = new ResponseData();
        List<ShopDTO> shopDTOList = shopService.getTop6Shops();
        responseData.setData(shopDTOList);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/avatar/{filename:.+}")
    public ResponseEntity<?> getShopImg(@PathVariable String filename) {
        String folder = "shops";
        Resource resource = fileService.loadFileAsResource(folder, filename);
        if (resource == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"").body(resource);
    }

    @PostMapping("/add-avatar")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> addImageByShopManager(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeader ){
        ResponseData responseData = new ResponseData();
        shopService.addShopImgByShopManager(file, authHeader);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getShopById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        ShopDTO shopDTO = shopService.getShopById(id);
        responseData.setData(shopDTO);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
