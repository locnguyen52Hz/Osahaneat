package com.example.restaurant.management.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Shops {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "shop_name", nullable = false, length = 50, unique = true)
    private String shopName;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

    @Column(name = "shop_image")
    private String shopImage;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @OneToMany(mappedBy = "shops")
    private List<Orders> orders;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shops_categories", joinColumns = @JoinColumn(name = "shop_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Categories> categories;

    @Column(name = "rating_avg", nullable = false)
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount = 0;

    @Version
    private Integer version =0;


    @OneToMany(mappedBy = "shops")
    private List<Food> foods;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User manager;


    public List<Categories> getCategories() {
        return categories;
    }

    public List<Food> getFoods() {
        return foods;
    }

    public void setFoods(List<Food> foods) {
        this.foods = foods;
    }

    public void setCategories(List<Categories> categories) {
        this.categories = categories;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(Double ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
}
