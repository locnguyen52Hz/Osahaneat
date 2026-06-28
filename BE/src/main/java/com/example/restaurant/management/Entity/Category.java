package com.example.restaurant.management.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "categories", uniqueConstraints = @UniqueConstraint(columnNames = {"shop_id", "category_name"}))
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name",nullable = false)
    private String name;

    @ManyToMany(mappedBy = "categories")
    private List<Shop> shop;

    @OneToMany(mappedBy = "category")
    private List<Food> food;

    @Column(name = "image", nullable = false)
    private String image;


    public void setImage(String image) {
        this.image = image;
    }

    public List<Shop> getShop() {
        return shop;
    }

    public void setShop(List<Shop> shop) {
        this.shop = shop;
    }

    public String getImage() {
        return image;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public List<Food> getFood() {
        return food;
    }

    public void setFood(List<Food> food) {
        this.food = food;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Shop> getShops() {
        return shop;
    }

    public void setShops(List<Shop> shops) {
        this.shop = shop;
    }
}
