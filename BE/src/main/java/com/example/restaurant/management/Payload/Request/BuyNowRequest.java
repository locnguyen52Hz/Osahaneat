package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.dto.Location;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class BuyNowRequest {
    Integer foodId;

    @Valid
            @Min(1)
            @Max(99)
    int quantity;
    String address;
    String note;
    private double fromLatitude;
    private double fromLongitude;

    public Integer getFoodId() {
        return foodId;
    }

    public void setFoodId(Integer foodId) {
        this.foodId = foodId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getFromLatitude() {
        return fromLatitude;
    }

    public void setFromLatitude(double fromLatitude) {
        this.fromLatitude = fromLatitude;
    }

    public double getFromLongitude() {
        return fromLongitude;
    }

    public void setFromLongitude(double fromLongitude) {
        this.fromLongitude = fromLongitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
