package com.example.restaurant.management.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessagePageResponseDto {
    private List<MessageDto> messages;
    private MessageCursorDto oldestCursor;
    private MessageCursorDto latestCursor;

    public MessagePageResponseDto(List<MessageDto> messages, MessageCursorDto oldestCursor, MessageCursorDto latestCursor) {
        this.messages = messages;
        this.oldestCursor = oldestCursor;
        this.latestCursor = latestCursor;
    }

    public MessagePageResponseDto(List<MessageDto> messages, MessageCursorDto oldestCursor) {
        this.messages = messages;
        this.oldestCursor = oldestCursor;

    }

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }

    public MessageCursorDto getOldestCursor() {
        return oldestCursor;
    }

    public void setOldestCursor(MessageCursorDto oldestCursor) {
        this.oldestCursor = oldestCursor;
    }

    public MessageCursorDto getLatestCursor() {
        return latestCursor;
    }

    public void setLatestCursor(MessageCursorDto latestCursor) {
        this.latestCursor = latestCursor;
    }
}
