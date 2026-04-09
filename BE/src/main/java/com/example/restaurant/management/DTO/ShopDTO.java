package com.example.restaurant.management.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShopDTO {
    private Integer id;
    private String name;
    private double latitude;
    private double longitude;
    private String shopAvatar;
    private String description;
    private double distance;

    // ✅ Constructor đầy đủ để JPA map trực tiếp
    public ShopDTO(double longitude, double latitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public ShopDTO(Integer id, Double longitude, Double latitude) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
    }


    // ✅ Constructor rỗng (JPA / Jackson cần)
    public ShopDTO() {}

    // Getters & Setters
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
}
