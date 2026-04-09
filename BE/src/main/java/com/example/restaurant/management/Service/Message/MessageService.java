package com.example.restaurant.management.Service.Message;

import com.example.restaurant.management.DTO.ConversationWithLatestMessageDTO;
import com.example.restaurant.management.DTO.MessageDTO;
import com.example.restaurant.management.DTO.MessagePageResponseDTO;
import com.example.restaurant.management.DTO.UnreadCount;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface MessageService {
    MessageDTO sendMessage(Integer senderId, Integer receiverId, String content);

    List<ConversationWithLatestMessageDTO> getLatestMessages(Integer id, Pageable pageable);

    MessagePageResponseDTO latestMessage(Integer userId, Integer conversationId, Integer partnerId, Pageable pageable);

    MessagePageResponseDTO getOlderMessages(Integer userId, GetOlderMessagesRequest getOlderMessagesRequest, Pageable pageable);

    Integer unreadCountTotal(Integer userId);

    UnreadCount markUnreadMessages(Integer userId, MarkReadMessage markReadMessage);
}
