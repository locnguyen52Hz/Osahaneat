package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.dto.MessageCursorDto;

public class GetOlderMessagesRequest {
    private Integer conversationId;
    private Integer partnerId;
    private MessageCursorDto messageCursor;

    public GetOlderMessagesRequest(Integer conversationId, Integer partnerId, MessageCursorDto messageCursor) {
        this.conversationId = conversationId;
        this.partnerId = partnerId;
        this.messageCursor = messageCursor;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public void setConversationId(Integer conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Integer partnerId) {
        this.partnerId = partnerId;
    }

    public MessageCursorDto getMessageCursor() {
        return messageCursor;
    }

    public void setMessageCursor(MessageCursorDto messageCursor) {
        this.messageCursor = messageCursor;
    }
}
