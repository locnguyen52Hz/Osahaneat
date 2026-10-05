package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class MessageRequest {
    @NotNull
    public Integer receiverId;
    @NotBlank
    public String content;
    @NotNull
    public Long clientSequence;
    @NotNull
    public Instant sentAt;


    public Integer getReceiverId() {
        return receiverId;
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

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
