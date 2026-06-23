package com.example.restaurant.management.Payload.Request;

import java.util.List;

public class SyncCartRequest {
    private List<CartRequest> carts;



    public List<CartRequest> getCarts() {
        return carts;
    }

    public void setCarts(List<CartRequest> carts) {
        this.carts = carts;
    }
}
