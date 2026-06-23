package com.example.restaurant.management.dto;

public class CartSummaryResponseDto {
    private Integer totalItems;
    private Integer totalShops;

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public Integer getTotalShops() {
        return totalShops;
    }

    public void setTotalShops(Integer totalShops) {
        this.totalShops = totalShops;
    }
}
