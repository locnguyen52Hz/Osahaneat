package com.example.restaurant.management.Payload.Request;

import com.example.restaurant.management.DTO.MessageCursorDTO;

public class GetOlderMessagesRequest {
    private Integer conversationId;
    private Integer partnerId;
    private MessageCursorDTO messageCursor;

    public GetOlderMessagesRequest(Integer conversationId, Integer partnerId, MessageCursorDTO messageCursor) {
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

    public MessageCursorDTO getMessageCursor() {
        return messageCursor;
    }

    public void setMessageCursor(MessageCursorDTO messageCursor) {
        this.messageCursor = messageCursor;
    }
}
