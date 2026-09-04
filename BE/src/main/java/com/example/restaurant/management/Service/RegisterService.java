package com.example.restaurant.management.Service;

import com.example.restaurant.management.Payload.Request.RegisterRequest;
import com.example.restaurant.management.Payload.Request.ShopManagerRegister;
import com.example.restaurant.management.dto.RegisterResponseDto;

public interface RegisterService {
    RegisterResponseDto registerBuyer(RegisterRequest registerRequest);
    RegisterResponseDto registerShopManager(ShopManagerRegister shopManagerRegister);
}

