package com.example.restaurant.management.dto;

import java.time.Instant;

public class ConversationDto {

    private Integer id;

    private Integer buyerId;
    private String buyerName;

    private Integer shopId;
    private String shopName;

    private Integer shopManagerId;
    private String shopManagerName;

    private String lastMessage;
    private Instant lastMessageTime;
    private int unreadCount;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Integer buyerId) {
        this.buyerId = buyerId;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public Integer getShopId() {
        return shopId;
    }

    public void setShopId(Integer shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Integer getShopManagerId() {
        return shopManagerId;
    }

    public void setShopManagerId(Integer shopManagerId) {
        this.shopManagerId = shopManagerId;
    }

    public String getShopManagerName() {
        return shopManagerName;
    }

    public void setShopManagerName(String shopManagerName) {
        this.shopManagerName = shopManagerName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Instant getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(Instant lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}

