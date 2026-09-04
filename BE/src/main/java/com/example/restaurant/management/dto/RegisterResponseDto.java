package com.example.restaurant.management.dto;

import com.example.restaurant.management.Enums.Roles;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterResponseDto {
    private String email;
    private String fullName;
    private String descriptionRole;
    private ShopRegisterInfoDto shopRegisterInfo;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDescriptionRole() {
        return descriptionRole;
    }

    public void setDescriptionRole(String descriptionRole) {
        this.descriptionRole = descriptionRole;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }



    public ShopRegisterInfoDto getShopRegisterInfo() {
        return shopRegisterInfo;
    }

    public void setShopRegisterInfo(ShopRegisterInfoDto shopRegisterInfo) {
        this.shopRegisterInfo = shopRegisterInfo;
    }
}
