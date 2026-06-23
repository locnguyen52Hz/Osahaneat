package com.example.restaurant.management.Payload.Request;

import jakarta.validation.Valid;

import java.util.List;

public class CartRequest {
    private Integer shopId;

    @Valid
    private List<CartItemRequest> items;

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }
}
