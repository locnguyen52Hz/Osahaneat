package com.example.restaurant.management.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShopDto {
    private Integer shopId;
    private String shopName;
    private double latitude;
    private double longitude;
    private String shopAvatar;
    private String description;
    private double distance;
    private String address;
    private Location location;
    private double ratingAvg;
    private Integer ratingCount;
    private List<CategoryDto> categories;

    //
    public ShopDto(double longitude, double latitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public ShopDto(Integer shopId,
                   String name,
                   double latitude,
                   double longitude,
                   String shopAvatar,
                   String shopAddress,
                   double ratingAvg,
                   Integer ratingCount) {

        this.shopId = shopId;
        this.shopName = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.shopAvatar = shopAvatar;
        this.address = shopAddress;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }


    public ShopDto(Integer shopId, String shopName) {
        this.shopId = shopId;
        this.shopName = shopName;

    }



    public ShopDto(Integer shopId, String name, String shopAvatar, String address, double ratingAvg, Integer ratingCount) {
        this.shopId = shopId;
        this.shopName = name;
        this.shopAvatar = shopAvatar;
        this.address = address;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }
    //
    public ShopDto() {}

    // Getters & Setters


    public double getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(double ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

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

    public String getShopAvatar() {
        return shopAvatar;
    }
    public void setShopAvatar(String shopAvatar) {
        this.shopAvatar = shopAvatar;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public List<CategoryDto> getCategories() {
        return categories;
    }
    public void setCategories(List<CategoryDto> categories) {
        this.categories = categories;
    }
}
