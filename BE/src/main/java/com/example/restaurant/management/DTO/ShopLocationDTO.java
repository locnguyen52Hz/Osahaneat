package com.example.restaurant.management.DTO;

public class ShopLocationDTO {
    private String shopName;
    private double latitude;
    private double longitude;
    private String address;
    private Integer shopID;

    public ShopLocationDTO(String shopName, double latitude, double longitude, String address, Integer shopID) {
        this.shopName = shopName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.shopID = shopID;
    }

    public String getShopName() {
        return shopName;
    }
    public double getLatitude() {
        return latitude;
    }
    public double getLongitude() {
        return longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getShopID() {
        return shopID;
    }

    public void setShopID(Integer shopID) {
        this.shopID = shopID;
    }
}
