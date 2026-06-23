package com.example.restaurant.management.dto;

import java.time.Instant;

public class MessageCursorDto {
    private Instant createdAt;
    private Integer id;

    public MessageCursorDto(Instant createdAt, Integer id) {
        this.createdAt = createdAt;
        this.id = id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
