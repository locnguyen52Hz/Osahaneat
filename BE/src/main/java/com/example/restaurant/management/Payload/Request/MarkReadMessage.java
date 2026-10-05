package com.example.restaurant.management.Payload.Request;

import java.time.Instant;

public class MarkReadMessage {
    Integer conversationId;
    Long firstSeenClientSequence;
    Long lastSeenClientSequence;
    Instant lastSeenAt;

    public MarkReadMessage(Integer conversationId, Long firstSeenClientSequence, Long lastSeenClientSequence, Instant lastSeenAt) {
        this.conversationId = conversationId;
        this.firstSeenClientSequence = firstSeenClientSequence;
        this.lastSeenClientSequence = lastSeenClientSequence;
        this.lastSeenAt = lastSeenAt;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Long getFirstSeenClientSequence() {
        return firstSeenClientSequence;
    }

    public void setFirstSeenClientSequence(Long firstSeenClientSequence) {
        this.firstSeenClientSequence = firstSeenClientSequence;
    }

    public Long getLastSeenClientSequence() {
        return lastSeenClientSequence;
    }

    public void setLastSeenClientSequence(Long lastSeenClientSequence) {
        this.lastSeenClientSequence = lastSeenClientSequence;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }
}
