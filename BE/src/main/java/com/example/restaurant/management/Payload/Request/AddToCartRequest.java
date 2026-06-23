package com.example.restaurant.management.Payload.Request;

import java.util.List;

public class AddToCartRequest {
    private List<CartItemRequest> cartItems;

    public List<CartItemRequest> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemRequest> cartItems) {
        this.cartItems = cartItems;
    }
}
