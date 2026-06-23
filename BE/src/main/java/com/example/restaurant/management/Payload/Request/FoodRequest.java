package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

public class FoodRequest {

    @NotBlank(message = "Food name ko để trống")
    @Pattern(regexp = "^[\\p{L}\\p{M}]+(?: [\\p{L}\\p{M}]+)*$",message = "Tên chỉ được chứa chữ cái, không có chữ số, mỗi từ cách nhau đúng một khoảng trắng và không có khoảng trắng ở đầu/cuối")
    @Length(min = 3, max = 100, message = "Độ dài từ 3-100 ký tự")
    private String name;

    @NotBlank(message = "description ko để trống")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\d]+(?: [\\p{L}\\p{M}\\d]+)*$", message = "Không dùng ký tự đặc biệt")
    @Length(min = 3, max = 500, message = "Độ dài từ 3-500 ký tự")
    private String description;

    @NotBlank(message = "price ko để trống")
    @Pattern(regexp = "^\\d+(\\.\\d+)?$\n",message = "Chỉ nhận chữ số")
    private double price;

    private MultipartFile image;

    private Integer shopId;

    private int quantity;

    private Integer foodId;

    public Integer getFoodId() {
        return foodId;
    }

    public void setFoodId(Integer foodId) {
        this.foodId = foodId;
    }

    private Integer categoryId;

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
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


    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getQuantity() {
        return quantity;
    }
}
