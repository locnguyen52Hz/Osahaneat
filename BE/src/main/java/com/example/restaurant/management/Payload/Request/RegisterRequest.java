package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

public class RegisterRequest {
    @NotBlank(message = "Họ tên không được để trống")
    @Pattern( regexp = "^[\\p{L}]+(?: [\\p{L}]+)*$",message = "Tên không bắt đầu và kết thúc bằng khoảng trắng, không được có 2 khoảng trắng liên tiếp, không được có chữ số và ký tự đặc biệt")
    @Length(min = 2, max = 255)
    private String fullName;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Mật khẩu không chứa ký tự đặc biệt")
    @Size(min = 8, max = 255 ,message = "Độ dài từ 8-255 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Pattern(regexp = "^(?!.*\\.\\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email không hợp lệ")
    private String email;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
