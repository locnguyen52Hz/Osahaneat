package com.example.restaurant.management.Service;

import com.example.restaurant.management.Payload.Request.RegisterRequest;
import com.example.restaurant.management.Payload.Request.ShopManagerRegister;

public interface RegisterService {
    void registerBuyer(RegisterRequest registerRequest);
    void registerShopManager(ShopManagerRegister shopManagerRegister);
}

