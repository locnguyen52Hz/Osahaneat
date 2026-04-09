package com.example.restaurant.management.DTO;

import java.time.Instant;
import java.time.LocalDateTime;

public class ConversationWithLatestMessageDTO {

    private Integer id;
    private String lastMessage;
    private Instant lastMessageAt;
    private String senderName;
    private Integer senderId;
    private Instant readAt;
    private String partnerName;
    private Integer partnerId;
    private String partnerType;
    private Number unreadCount;

    public ConversationWithLatestMessageDTO(Integer id, String lastMessage, Instant lastMessageAt,
                                            String senderName, Integer senderId,Instant readAt, String partnerName,
                                            Integer partnerId, String partnerType, Number unreadCount) {
        this.id = id;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.senderName = senderName;
        this.senderId = senderId;
        this.readAt = readAt;
        this.partnerName = partnerName;
        this.partnerId = partnerId;
        this.partnerType = partnerType;
        this.unreadCount = unreadCount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Instant lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public Integer getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Integer partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerType() {
        return partnerType;
    }

    public void setPartnerType(String partnerType) {
        this.partnerType = partnerType;
    }

    public Number getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(Number unreadCount) {
        this.unreadCount = unreadCount;
    }
}
