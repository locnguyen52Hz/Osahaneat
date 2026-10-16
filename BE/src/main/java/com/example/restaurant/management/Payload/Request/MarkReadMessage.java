package com.example.restaurant.management.Payload.Request;

import java.time.Instant;

public class MarkReadMessage {
    Integer conversationId;
    Long maxClientSequence;
    Long minClientSequence;
    Instant lastSeenAt;

    public MarkReadMessage(Integer conversationId, Long maxClientSequence, Long minClientSequence, Instant lastSeenAt) {
        this.conversationId = conversationId;
        this.maxClientSequence = maxClientSequence;
        this.minClientSequence = minClientSequence;
        this.lastSeenAt = lastSeenAt;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Long getMaxClientSequence() {
        return maxClientSequence;
    }

    public void setMaxClientSequence(Long maxClientSequence) {
        this.maxClientSequence = maxClientSequence;
    }

    public Long getMinClientSequence() {
        return minClientSequence;
    }

    public void setMinClientSequence(Long minClientSequence) {
        this.minClientSequence = minClientSequence;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }
}
