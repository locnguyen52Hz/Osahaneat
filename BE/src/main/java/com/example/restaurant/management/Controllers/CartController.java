package com.example.restaurant.management.Controllers;

import com.example.restaurant.management.Payload.Request.AddToCartRequest;
import com.example.restaurant.management.Payload.Request.SyncCartRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.Cart.BuyerCartService;
import com.example.restaurant.management.dto.AddToCartResponseDto;
import com.example.restaurant.management.dto.CartDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cart")
public class CartController {

    @Autowired
    BuyerCartService buyerCartService;

    @PostMapping("/add-to-cart")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String authorization,
                                       @RequestBody AddToCartRequest addToCartRequest) {
        ResponseData responseData = new ResponseData();
        AddToCartResponseDto addToCartResponseDto = buyerCartService.addItemToCart(authorization, addToCartRequest);
        responseData.setData(addToCartResponseDto);
        responseData.setSuccess(true);
        responseData.setMessage("Added to Cart");
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);

    }

    @PutMapping("/sync-cart")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> syncCart(@RequestHeader("Authorization") String authorization, @RequestBody SyncCartRequest syncCartRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(buyerCartService.syncCart(authorization, syncCartRequest));
        responseData.setSuccess(true);
        responseData.setMessage("Updated Cart");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/list-cart")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getListCart(@RequestHeader("Authorization") String authorization) {
        ResponseData responseData = new ResponseData();
        List<CartDto> cartDtos = buyerCartService.getCarts(authorization);
        responseData.setData(cartDtos);
        responseData.setSuccess(true);
        responseData.setMessage("List Cart");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
