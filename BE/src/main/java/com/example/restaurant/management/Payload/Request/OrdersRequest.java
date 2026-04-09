package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.Entity.OrdersItem;

import java.util.List;

public class OrdersRequest {
    private Integer shopId;
    private List<OrdersItemRequest> foods;
    private String address;
    private String note;
    private double fromLatitude;
    private double fromLongitude;


    public double getFromLatitude() {
        return fromLatitude;
    }

    public void setFromLatitude(double fromLatitude) {
        this.fromLatitude = fromLatitude;
    }

    public double getFromLongitude() {
        return fromLongitude;
    }

    public void setFromLongitude(double fromLongitude) {
        this.fromLongitude = fromLongitude;
    }


    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public List<OrdersItemRequest> getFoods() {
        return foods;
    }

    public void setFoods(List<OrdersItemRequest> foods) {
        this.foods = foods;
    }
}
