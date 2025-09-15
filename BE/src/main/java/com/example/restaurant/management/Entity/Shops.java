package com.example.restaurant.management.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Shops {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "shop_name", nullable = false, length = 50, unique = true)
    private String shopName;

    @Column(name = "latitude ")
    private double latitude;

    @Column(name = "longitude ")
    private double longitude;

    @Column(name = "shop_image")
    private String shopImage;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "shop")
    private List<Orders> orders;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User manager;

    @OneToMany(mappedBy = "shop")
    private List<Category> categories;

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public List<Orders> getOrders() {
        return orders;
    }

    public void setOrders(List<Orders> orders) {
        this.orders = orders;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public double getLatitude() {
        return latitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getShopImage() {
        return shopImage;
    }

    public void setShopImage(String shopImage) {
        this.shopImage = shopImage;
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

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }
}
