package com.example.restaurant.management.DTO;

import java.time.Instant;
import java.time.LocalDateTime;

public class MessageCursorDTO {
    private Instant createdAt;
    private Integer id;

    public MessageCursorDTO(Instant createdAt, Integer id) {
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
