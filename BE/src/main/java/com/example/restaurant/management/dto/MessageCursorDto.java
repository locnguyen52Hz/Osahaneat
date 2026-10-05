package com.example.restaurant.management.dto;

import java.time.Instant;

public class MessageCursorDto {
    private Instant sentAt;
    private Integer id;
    private Long clientSequence;

    public MessageCursorDto(Instant sentAt,  Long clientSequence, Integer id) {
        this.sentAt = sentAt;
        this.id = id;
        this.clientSequence = clientSequence;
    }



    public Long getClientSequence() {
        return clientSequence;
    }

    public void setClientSequence(Long clientSequence) {
        this.clientSequence = clientSequence;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
