package com.example.restaurant.management.Controllers;

import com.example.restaurant.management.DTO.ChartResponse;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.Revenue.ShopRevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/revenue")
public class RevenueController {

    @Autowired
    ShopRevenueService shopRevenueService;

    @GetMapping("/monthly")
    @PreAuthorize("hasAnyRole('SHOP_MANAGER')")
    public ResponseEntity<?> getRevenueByMonth(@RequestHeader ("Authorization") String authorization, @RequestParam String startMonth){
        ResponseData responseData = new ResponseData();
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setSuccess(true);
        responseData.setData( shopRevenueService.getMonthlyRevenueByShop(authorization, startMonth));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/daily")
    @PreAuthorize("hasAnyRole('SHOP_MANAGER')")
    public ResponseEntity<?> getRevenueByDaily(@RequestHeader ("Authorization") String authorization, @RequestParam String startDate){
        ResponseData responseData = new ResponseData();
        responseData.setStatus(HttpStatus.OK.value());
        responseData.setSuccess(true);
        responseData.setData( shopRevenueService.getDailyRevenueByShop(authorization, startDate));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
