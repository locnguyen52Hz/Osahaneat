package com.example.restaurant.management.Service.Message;


import com.example.restaurant.management.DTO.ConversationWithLatestMessageDTO;
import com.example.restaurant.management.DTO.MessageDTO;
import com.example.restaurant.management.DTO.MessagePageResponseDTO;
import com.example.restaurant.management.DTO.UnreadCount;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import com.example.restaurant.management.Payload.Request.MessageRequest;
import com.example.restaurant.management.Repository.ConversationRepository;
import com.example.restaurant.management.Repository.MessageRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Message.Imp.BuyerMessageService;
import com.example.restaurant.management.Service.Message.Imp.ShopManagerMessageService;
import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@Service
public class CommonMessageService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    ShopManagerMessageService shopManagerChatService;

    @Autowired
    BuyerMessageService buyerChatService;

    @Autowired
    ConversationRepository conversationRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    ShopsRepository  shopsRepository;

    public MessageDTO sendMessage(@RequestHeader("Authorization") String authHeader, MessageRequest messageRequest) {
        Integer senderId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(senderId).getRole().getRoleName();

        return switch (role) {
            case "ROLE_BUYER" ->
                    buyerChatService.sendMessage(senderId, messageRequest.getReceiverId(), messageRequest.getContent());
            case "ROLE_SHOP_MANAGER" ->
                    shopManagerChatService.sendMessage(senderId, messageRequest.getReceiverId(), messageRequest.getContent());
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };

    }

    public List<ConversationWithLatestMessageDTO> getConversations(@RequestHeader("Authorization") String authHeader, int page) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        Pageable pageable = PageRequest.of(page, 10);
        return switch (role) {
            case "ROLE_BUYER" -> buyerChatService.getLatestMessages(userId, pageable);
            case "ROLE_SHOP_MANAGER" -> shopManagerChatService.getLatestMessages(userId, pageable);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };

    }

    public MessagePageResponseDTO latestMessage(@RequestHeader("Authorization") String authHeader, Integer conversationId, Integer partnerId) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        Pageable pageable = PageRequest.ofSize(5);


        return switch (role) {
            case "ROLE_BUYER" -> buyerChatService.latestMessage(userId, conversationId, partnerId, pageable);
            case "ROLE_SHOP_MANAGER" ->
                    shopManagerChatService.latestMessage(userId, conversationId, partnerId, pageable);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };

    }

    public MessagePageResponseDTO getOlderMessages(@RequestHeader("Authorization") String authHeader,
                                                   GetOlderMessagesRequest getOlderMessagesRequest) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        Pageable pageable = PageRequest.ofSize(5);

        return switch (role) {
            case "ROLE_BUYER" -> buyerChatService.getOlderMessages(userId, getOlderMessagesRequest, pageable);
            case "ROLE_SHOP_MANAGER" ->
                    shopManagerChatService.getOlderMessages(userId, getOlderMessagesRequest, pageable);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };
    }

    public Integer unreadCountTotal(@RequestHeader("Authorization") String authHeader) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" -> buyerChatService.unreadCountTotal(userId);
            case "ROLE_SHOP_MANAGER" -> shopManagerChatService.unreadCountTotal(userId);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };
    }


    @Transactional
    public UnreadCount markReadMessages(@RequestHeader("Authorization") String authHeader, MarkReadMessage markReadMessage) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();


//        messageRepository.markMessagesAsRead(userId, markReadMessage.getConversationId(), markReadMessage.getLastSeenMessageId(), markReadMessage.getLastSeenAt());
//        return messageRepository.getUnreadMessageStatsForShopManager(markReadMessage.getConversationId(), userId, shopId);
        return switch (role) {
            case "ROLE_BUYER" -> buyerChatService.markUnreadMessages(userId, markReadMessage);
            case "ROLE_SHOP_MANAGER" -> shopManagerChatService.markUnreadMessages(userId, markReadMessage);
            default -> throw new IllegalStateException("Unexpected value: " + role);
        };

    }

}
