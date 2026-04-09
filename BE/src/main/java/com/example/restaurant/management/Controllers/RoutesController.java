package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.OsrmTableResponse;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.RoutesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/routes")
@PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
public class RoutesController {
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private RoutesService routesService;

    @GetMapping
    public OsrmResponse getRoutes(
            @RequestParam double fromLong,
            @RequestParam double fromLat,
            @RequestParam double toLong,
            @RequestParam double toLat) {
        String url = String.format(
                "http://localhost:5000/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                fromLong,fromLat,toLong,toLat
        );

        return restTemplate.getForObject(url, OsrmResponse.class);

    }

    @GetMapping("/distance")
    public ResponseEntity<?> getDistance(@RequestParam double fromLongitude,@RequestParam double fromLatitude,@RequestParam double toLongitude,@RequestParam double toLatitude){
        OsrmTableResponse distance = routesService.getDistance(fromLongitude,fromLatitude, toLongitude, toLatitude);
        ResponseData responseData = new ResponseData();
        responseData.setData(distance);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/shipping-fee")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getShippingFee(@RequestParam double fromLongitude, @RequestParam double fromLatitude ,@RequestParam Integer shopID){
        double shippingFee = routesService.getShippingFee(fromLongitude, fromLatitude, shopID );
        ResponseData responseData = new ResponseData();
        responseData.setData(shippingFee);
        return ResponseEntity.ok(responseData);
    }

}
