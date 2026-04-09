package com.example.restaurant.management.DTO;

import org.springframework.web.multipart.MultipartFile;

public class FoodDTO {
  private String image;
  private String name;
  private String description;
  private double price;
  private Integer foodId;

    public FoodDTO(Integer foodId, String name, String description, double price, String image, Integer shopId, String shopName) {
        this.foodId = foodId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.shopName = shopName;
        this.shopId = shopId;
    }

    public FoodDTO() {}

    private Integer shopId;
    private String shopName;


    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Integer getFoodId() {
        return foodId;
    }

    public void setFoodId(Integer foodId) {
        this.foodId = foodId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
