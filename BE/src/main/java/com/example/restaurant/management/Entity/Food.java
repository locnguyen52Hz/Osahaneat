package com.example.restaurant.management.Entity;

import jakarta.persistence.*;

@Entity
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "food_name", unique = false, nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "deleted")
    private boolean deleted;

    @Column(name = "price")
    private double price;

    @Column(name = "ratting")
    private double ratting = 0;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Categories categories;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shops shops;

    public Categories getCategories() {
        return categories;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public void setCategories(Categories categories) {
        this.categories = categories;
    }

    public Shops getShops() {
        return shops;
    }

    public void setShops(Shops shops) {
        this.shops = shops;
    }

    public Integer getId() {
        return id;
    }

    public String getImage() {
        return image;
    }

    public double getRatting() {
        return ratting;
    }

    public void setRatting(double ratting) {
        this.ratting = ratting;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Categories getCategory() {
        return categories;
    }

    public void setCategory(Categories categories) {
        this.categories = categories;
    }
}
