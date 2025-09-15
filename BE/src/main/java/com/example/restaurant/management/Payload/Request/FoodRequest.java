package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.Entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

public class FoodRequest {

    @NotBlank(message = "Food name ko để trống")
    @Pattern(regexp = "^[\\p{L}\\p{M}]+(?: [\\p{L}\\p{M}]+)*$",message = "Tên chỉ được chứa chữ cái, không có chữ số, mỗi từ cách nhau đúng một khoảng trắng và không có khoảng trắng ở đầu/cuối")
    @Length(min = 3, max = 100, message = "Độ dài từ 3-100 ký tự")
    private String foodName;

    @NotBlank(message = "description ko để trống")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\d]+(?: [\\p{L}\\p{M}\\d]+)*$", message = "Không dùng ký tự đặc biệt")
    @Length(min = 3, max = 500, message = "Độ dài từ 3-500 ký tự")
    private String description;

    @NotBlank(message = "price ko để trống")
    @Pattern(regexp = "^\\d+(\\.\\d+)?$\n",message = "Chỉ nhận chữ số")
    private double price;

    @NotBlank(message = "file ko để trống")
    @Pattern(regexp = "(?i)^.+\\\\.(jpg|jpeg|png|gif|bmp|webp)$",message = "định dạng file ko hợp lệ")
    private MultipartFile image;

    @NotBlank(message = "Chưa chọn categoryID")
    private int categoryID;


    public int getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(int categoryID) {
        this.categoryID = categoryID;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
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
}
