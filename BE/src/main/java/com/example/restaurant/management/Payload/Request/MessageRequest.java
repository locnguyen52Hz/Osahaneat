package com.example.restaurant.management.Payload.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;

public class MessageRequest {
    @NotNull
    public Integer partnerId;

    @NotBlank
    @Length( max = 500)
    public String content;

    @NotNull
    @Positive
    public Long clientSequence;

    @NotNull
    public Instant sentAt;

    @NotBlank
    @Length(min = 36, max = 36)
    @Pattern(
            regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
            message = "clientMessageId phải có định dạng UUID hợp lệ"
    )
    public String clientMessageId;


    public Integer getPartnerId() {
        return partnerId;
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

    public void setPartnerId(Integer partnerId) {
        this.partnerId = partnerId;
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
