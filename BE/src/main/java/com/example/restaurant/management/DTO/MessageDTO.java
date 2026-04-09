package com.example.restaurant.management.DTO;

import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.Entity.User;

import java.time.Instant;
import java.time.LocalDateTime;

public class MessageDTO {
    private Integer id;
    private Integer conversationId;
    private Integer senderId;
    private String content;
    private Instant readAt;
    private Instant createdAt;
    private String senderName;

    public MessageDTO(
            Integer id,
            String content,
            Integer senderId,
            String senderName,
            Instant createdAt,
            Instant readAt,
            Integer conversationId
    ) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.senderName = senderName;
        this.createdAt = createdAt;
        this.readAt = readAt;
        this.conversationId = conversationId;
    }

    public MessageDTO(Integer id, String content, String senderName, Integer conversationId, Instant createdAt, Integer senderId, Instant readAt) {
        this.id = id;
        this.content = content;
        this.senderName = senderName;
        this.conversationId = conversationId;
        this.createdAt = createdAt;
        this.senderId = senderId;
        this.readAt = readAt;

    }


    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}

