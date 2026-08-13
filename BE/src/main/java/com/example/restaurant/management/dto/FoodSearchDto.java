package com.example.restaurant.management.dto;

public class FoodSearchDto {

     private Long foodId;
     private String foodName;
     private String image;
     private String description;
     private Double price;
     private Long shopId;
     private String shopName;
     private Integer ratingCount;
     private Double ratingAvg;
     private Double distance;

     public FoodSearchDto(
             Long foodId,
             String foodName,
             String image,
             String description,
             Double price,
             Long shopId,
             String shopName,
             Integer ratingCount,
             Double ratingAvg,
             Double distance
     ) {
          this.foodId = foodId;
          this.foodName = foodName;
          this.image = image;
          this.description = description;
          this.price = price;
          this.shopId = shopId;
          this.shopName = shopName;
          this.ratingCount = ratingCount;
          this.ratingAvg = ratingAvg;
          this.distance = distance;
     }

     public Long getFoodId() {
          return foodId;
     }

     public void setFoodId(Long foodId) {
          this.foodId = foodId;
     }

     public String getFoodName() {
          return foodName;
     }

     public void setFoodName(String foodName) {
          this.foodName = foodName;
     }

     public String getImage() {
          return image;
     }

     public void setImage(String image) {
          this.image = image;
     }

     public String getDescription() {
          return description;
     }

     public void setDescription(String description) {
          this.description = description;
     }

     public Double getPrice() {
          return price;
     }

     public void setPrice(Double price) {
          this.price = price;
     }

     public Long getShopId() {
          return shopId;
     }

     public void setShopId(Long shopId) {
          this.shopId = shopId;
     }

     public String getShopName() {
          return shopName;
     }

     public void setShopName(String shopName) {
          this.shopName = shopName;
     }

     public Integer getRatingCount() {
          return ratingCount;
     }

     public void setRatingCount(Integer ratingCount) {
          this.ratingCount = ratingCount;
     }

     public Double getRatingAvg() {
          return ratingAvg;
     }

     public void setRatingAvg(Double ratingAvg) {
          this.ratingAvg = ratingAvg;
     }

     public Double getDistance() {
          return distance;
     }

     public void setDistance(Double distance) {
          this.distance = distance;
     }
}
