package com.example.restaurant.management.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShopDTO {
    private Integer id;
    private String name;
    private double latitude;
    private double longitude;
    private String shopAvatar;
    private String description;
    private double distance;
    private String address;
    private Location location;
    private double ratingAvg;
    private Integer ratingCount;
    private List<CategoryDTO> categories;

    //
    public ShopDTO(double longitude, double latitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public ShopDTO(Integer id,
                   String name,
                   double latitude,
                   double longitude,
                   String shopAvatar,
                   String shopAddress,
                   double ratingAvg,
                   Integer ratingCount) {

        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.shopAvatar = shopAvatar;
        this.address = shopAddress;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }


    public ShopDTO(Integer shopId, String shopName) {
        this.id = shopId;
        this.name = shopName;

    }



    public ShopDTO(Integer id, String name, String shopAvatar, String address, double ratingAvg, Integer ratingCount) {
        this.id = id;
        this.name = name;
        this.shopAvatar = shopAvatar;
        this.address = address;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
    }
    //
    public ShopDTO() {}

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

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
    public List<CategoryDTO> getCategories() {
        return categories;
    }
    public void setCategories(List<CategoryDTO> categories) {
        this.categories = categories;
    }
}
