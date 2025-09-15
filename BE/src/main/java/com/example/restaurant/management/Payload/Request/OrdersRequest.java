package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.Entity.OrdersItem;

import java.util.List;

public class OrdersRequest {
    private int shopId;
    private List<OrdersItemRequest> ordersItemRequests;
    private String address;
    private String note;
    private double latitude;
    private double longitude;

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
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

    public int getShopId() {
        return shopId;
    }

    public void setShopId(int shopId) {
        this.shopId = shopId;
    }

    public List<OrdersItemRequest> getOrdersItemRequests() {
        return ordersItemRequests;
    }

    public void setOrdersItemRequests(List<OrdersItemRequest> ordersItemRequests) {
        this.ordersItemRequests = ordersItemRequests;
    }
}
