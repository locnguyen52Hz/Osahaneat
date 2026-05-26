package com.example.restaurant.management.DTO;

public class ShopLocationDTO {
    private String shopName;
    private double latitude;
    private double longitude;
    private String shopAddress;
    private Integer shopId;

    public ShopLocationDTO(String shopName, double latitude, double longitude, String shopAddress, Integer shopId) {
        this.shopName = shopName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.shopAddress = shopAddress;
        this.shopId = shopId;
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


    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }



    public String getShopAddress() {
        return shopAddress;
    }

    public void setShopAddress(String shopAddress) {
        this.shopAddress = shopAddress;
    }

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }
}
