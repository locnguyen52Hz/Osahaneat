package com.example.restaurant.management.Payload.Request;

import java.time.Instant;
import java.time.LocalDateTime;

public class MarkReadMessage {
    Integer conversationId;
    Integer lastSeenMessageId;
    Instant lastSeenAt;

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getLastSeenMessageId() {
        return lastSeenMessageId;
    }

    public void setLastSeenMessageId(Integer lastSeenMessageId) {
        this.lastSeenMessageId = lastSeenMessageId;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }
}
