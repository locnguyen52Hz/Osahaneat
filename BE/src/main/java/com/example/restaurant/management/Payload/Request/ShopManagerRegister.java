package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

public class ShopManagerRegister extends RegisterRequest {

    @NotBlank(message = "Không để trống tên shop")
    @Pattern( regexp = "^[\\p{L}\\d]+(?: [\\p{L}\\d]+)*$",message = "Tên không bắt đầu và kết thúc bằng khoảng trắng, không được có 2 khoảng trắng liên tiếp, không được có chữ số và ký tự đặc biệt")
    @Length(min = 2, max = 255)
    private String shopName;

    private String description;

    private MultipartFile shopImage;

    public String getShopName() {
        return shopName;
    }

    public MultipartFile getShopImage() {
        return shopImage;
    }

    public void setShopImage(MultipartFile shopImage) {
        this.shopImage = shopImage;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
