package com.example.restaurant.management.dto;

import java.time.Instant;

public class MessageDto {
    private Integer id;
    private Integer conversationId;
    private Integer senderId;
    private String content;
    private Instant readAt;
    private Instant createdAt;
    private Long clientSequence;
    private Instant sentAt;
    private String senderName;

    public MessageDto(
            Integer id,
            String content,
            Integer senderId,
            String senderName,
            Instant createdAt,
            Instant readAt,
            Integer conversationId,
            Long clientSequence,
            Instant sentAt
    ) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.senderName = senderName;
        this.createdAt = createdAt;
        this.readAt = readAt;
        this.conversationId = conversationId;
        this.clientSequence = clientSequence;
        this.sentAt = sentAt;
    }

    public MessageDto(Integer id,
                      String content,
                      String senderName,
                      Integer conversationId,
                      Instant createdAt,
                      Integer senderId,
                      Instant readAt,
                      Long clientSequence,
                      Instant sentAt) {
        this.id = id;
        this.content = content;
        this.senderName = senderName;
        this.conversationId = conversationId;
        this.createdAt = createdAt;
        this.senderId = senderId;
        this.readAt = readAt;
        this.clientSequence = clientSequence;
        this.sentAt = sentAt;
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

