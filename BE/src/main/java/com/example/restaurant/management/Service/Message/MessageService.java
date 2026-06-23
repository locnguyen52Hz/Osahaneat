package com.example.restaurant.management.Service.Message;

import com.example.restaurant.management.dto.ConversationWithLatestMessageDto;
import com.example.restaurant.management.dto.MessageDto;
import com.example.restaurant.management.dto.MessagePageResponseDto;
import com.example.restaurant.management.dto.UnreadCount;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MessageService {
    MessageDto sendMessage(Integer senderId, Integer receiverId, String content);

    List<ConversationWithLatestMessageDto> getLatestMessages(Integer id, Pageable pageable);

    MessagePageResponseDto latestMessage(Integer userId, Integer conversationId, Integer partnerId, Pageable pageable);

    MessagePageResponseDto getOlderMessages(Integer userId, GetOlderMessagesRequest getOlderMessagesRequest, Pageable pageable);

    Integer unreadCountTotal(Integer userId);

    UnreadCount markUnreadMessages(Integer userId, MarkReadMessage markReadMessage);
}
