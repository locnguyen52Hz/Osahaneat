package com.example.restaurant.management.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Location {

    @Column(name = "lat")
    private double latitude;

    @Column(name = "lng")
    private double longitude;

    public Location() {}

    public Location( double longitude, double latitude) {
        this.longitude = longitude;
        this.latitude = latitude;

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
}