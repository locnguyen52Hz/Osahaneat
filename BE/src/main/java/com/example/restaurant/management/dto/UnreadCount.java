package com.example.restaurant.management.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnreadCount {
    Integer conversationId;
    Long conversationUnreadCount;
    Long totalUnreadCount;

    public UnreadCount(Integer conversationId, Long conversationUnreadCount, Long totalUnreadCount) {
        this.conversationId = conversationId;
        this.conversationUnreadCount = conversationUnreadCount;
        this.totalUnreadCount = totalUnreadCount;
    }



    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Long getConversationUnreadCount() {
        return conversationUnreadCount;
    }

    public void setConversationUnreadCount(Long conversationUnreadCount) {
        this.conversationUnreadCount = conversationUnreadCount;
    }

    public Long getTotalUnreadCount() {
        return totalUnreadCount;
    }

    public void setTotalUnreadCount(Long totalUnreadCount) {
        this.totalUnreadCount = totalUnreadCount;
    }
}
