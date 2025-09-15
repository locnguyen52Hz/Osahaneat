package com.example.restaurant.management.Payload.Request;

public class CategoryRequest {
    private String name;
    private int shopID;


    public int getShopID() {
        return shopID;
    }

    public void setShopID(int shopID) {
        this.shopID = shopID;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

}
