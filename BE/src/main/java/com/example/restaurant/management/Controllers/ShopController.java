package com.example.restaurant.management.Controllers;

import com.example.restaurant.management.DTO.Coordinate;
import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.DTO.ShopLocationDTO;
import com.example.restaurant.management.Payload.Request.ShopUpdateRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.FileService;
import com.example.restaurant.management.Service.Shops.CommonShopService;
import com.example.restaurant.management.Service.Shops.Imp.BuyerShopServiceImp;
import com.example.restaurant.management.Service.Shops.Imp.ShopManagerShopServiceImp;
import com.example.restaurant.management.Service.Shops.ShopService;
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
    CommonShopService  commonShopService;

    @Autowired
    ShopManagerShopServiceImp shopManagerShopServiceImp;

    @Autowired
    BuyerShopServiceImp buyerShopServiceImp;

    @GetMapping("/top-6-shops")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getTop6Shop(@RequestParam double fromLongitude,
                                         @RequestParam double fromLatitude,
                                         @RequestParam(required = false, defaultValue = "5") double radius){
        ResponseData responseData = new ResponseData();
        List<ShopDTO> shopDTOList = buyerShopServiceImp.getNearbyShops(fromLongitude, fromLatitude, radius);
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
    public ResponseEntity<?> addImageByShopManager(@RequestParam("file") MultipartFile file,
                                                   @RequestHeader("Authorization") String authHeader ){
        ResponseData responseData = new ResponseData();
        shopManagerShopServiceImp.addShopImgByShopManager(file, authHeader);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/details")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getShopById(@RequestHeader ("Authorization") String authHeader,
                                         @RequestParam(required = false) Integer shopId,
                                         @RequestParam double longitude,
                                         @RequestParam double latitude) {
        ResponseData responseData = new ResponseData();
        ShopDTO shopDTO = commonShopService.getShopById(authHeader,shopId, longitude, latitude);
        responseData.setData(shopDTO);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

//    @GetMapping("/distance")
//    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
//    public ResponseEntity<?> getShopsDistance(@RequestParam double fromLongitude,
//                                              @RequestParam double fromLatitude) {
//        ResponseData responseData = new ResponseData();
//        responseData.setStatus(HttpStatus.OK.value());
//        responseData.setMessage("Success");
//        responseData.setSuccess(true);
//        List<OsrmTableResponse> osrmTableResponseList = buyerShopServiceImp.getLocationsOfTop6Shops(fromLongitude, fromLatitude);
//        responseData.setData(osrmTableResponseList);
//        return new ResponseEntity<>(responseData, HttpStatus.OK);
//    }

    @GetMapping("locations")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getShopLocations() {
        ResponseData responseData = new ResponseData();
        List<ShopLocationDTO> shopLocationDTOS = buyerShopServiceImp.getAllShopLocations();
        responseData.setData(shopLocationDTOS);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("update")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?>  updateShop(@RequestHeader ("Authorization") String authHeader,
                                         @RequestBody(required = false) ShopUpdateRequest shopUpdateRequest) {
        ResponseData responseData = new ResponseData();
        shopManagerShopServiceImp.shopUpdate(authHeader,shopUpdateRequest);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("update-avatar")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> updateShopAvatar(@RequestHeader ("Authorization") String authHeader,
                                              @RequestPart(required = true) MultipartFile file) {
        ResponseData responseData = new ResponseData();
        shopManagerShopServiceImp.updateShopAvatar(authHeader,file);
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setMessage("Success");
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
