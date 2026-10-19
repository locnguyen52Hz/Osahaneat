package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

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
    @NotBlank
    @Length(min = 36, max = 36)
    public String clientMessageId;


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

    public String getClientMessageId() {
        return clientMessageId;
    }

    public void setClientMessageId(String clientMessageId) {
        this.clientMessageId = clientMessageId;
    }
}
