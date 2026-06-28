package com.example.restaurant.management.dto;

public class CategoryDto {
    private Integer id;
    private String name;
    private String image;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getId() {
        return id;
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

    public CategoryDto() {}

    public CategoryDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
