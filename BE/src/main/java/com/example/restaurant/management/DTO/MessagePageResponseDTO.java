package com.example.restaurant.management.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessagePageResponseDTO {
    private List<MessageDTO> messages;
    private MessageCursorDTO oldestCursor;
    private MessageCursorDTO latestCursor;

    public MessagePageResponseDTO(List<MessageDTO> messages, MessageCursorDTO oldestCursor, MessageCursorDTO latestCursor) {
        this.messages = messages;
        this.oldestCursor = oldestCursor;
        this.latestCursor = latestCursor;
    }

    public MessagePageResponseDTO(List<MessageDTO> messages, MessageCursorDTO oldestCursor) {
        this.messages = messages;
        this.oldestCursor = oldestCursor;

    }

    public List<MessageDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDTO> messages) {
        this.messages = messages;
    }

    public MessageCursorDTO getOldestCursor() {
        return oldestCursor;
    }

    public void setOldestCursor(MessageCursorDTO oldestCursor) {
        this.oldestCursor = oldestCursor;
    }

    public MessageCursorDTO getLatestCursor() {
        return latestCursor;
    }

    public void setLatestCursor(MessageCursorDTO latestCursor) {
        this.latestCursor = latestCursor;
    }
}
