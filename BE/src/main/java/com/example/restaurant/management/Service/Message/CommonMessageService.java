package com.example.restaurant.management.Service.Message;


import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.Roles;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import com.example.restaurant.management.Payload.Request.MessageRequest;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Service.Message.Imp.BuyerMessageService;
import com.example.restaurant.management.Service.Message.Imp.ShopManagerMessageService;
import com.example.restaurant.management.Service.UserSecurity.UserSecurityService;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.ConversationWithLatestMessageDto;
import com.example.restaurant.management.dto.MessageDto;
import com.example.restaurant.management.dto.MessagePageResponseDto;
import com.example.restaurant.management.dto.UnreadCount;
import jakarta.persistence.EntityNotFoundException;
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
    ShopManagerMessageService shopManagerChatService;

    @Autowired
    BuyerMessageService buyerChatService;

    @Autowired
    UserSecurityService userSecurityService;

    public MessageDto sendMessage(@RequestHeader("Authorization") String authHeader, MessageRequest messageRequest) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER ->
                    buyerChatService.sendMessage(userSecurityContext.userId(), messageRequest.getReceiverId(), messageRequest.getContent());
            case ROLE_SHOP_MANAGER ->
                    shopManagerChatService.sendMessage(userSecurityContext.userId(), messageRequest.getReceiverId(), messageRequest.getContent());
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };

    }

    public List<ConversationWithLatestMessageDto> getConversations(@RequestHeader("Authorization") String authHeader, int page) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);


        Pageable pageable = PageRequest.of(page, 10);
        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerChatService.getLatestMessages(userSecurityContext.userId(), pageable);
            case ROLE_SHOP_MANAGER -> shopManagerChatService.getLatestMessages(userSecurityContext.userId(), pageable);
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };

    }

    public MessagePageResponseDto latestMessage(@RequestHeader("Authorization") String authHeader, Integer conversationId, Integer partnerId) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        Pageable pageable = PageRequest.ofSize(10);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER ->
                    buyerChatService.latestMessage(userSecurityContext.userId(), conversationId, partnerId, pageable);
            case ROLE_SHOP_MANAGER ->
                    shopManagerChatService.latestMessage(userSecurityContext.userId(), conversationId, partnerId, pageable);
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };

    }

    public MessagePageResponseDto getOlderMessages(@RequestHeader("Authorization") String authHeader,
                                                   GetOlderMessagesRequest getOlderMessagesRequest) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        Pageable pageable = PageRequest.ofSize(5);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerChatService.getOlderMessages(userSecurityContext.userId(), getOlderMessagesRequest, pageable);
            case ROLE_SHOP_MANAGER ->
                    shopManagerChatService.getOlderMessages(userSecurityContext.userId(), getOlderMessagesRequest, pageable);
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };
    }

    public Integer unreadCountTotal(@RequestHeader("Authorization") String authHeader) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerChatService.unreadCountTotal(userSecurityContext.userId());
            case ROLE_SHOP_MANAGER -> shopManagerChatService.unreadCountTotal(userSecurityContext.userId());
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };
    }


    @Transactional
    public UnreadCount markReadMessages(@RequestHeader("Authorization") String authHeader, MarkReadMessage markReadMessage) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);



        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerChatService.markUnreadMessages(userSecurityContext.userId(), markReadMessage);
            case ROLE_SHOP_MANAGER -> shopManagerChatService.markUnreadMessages(userSecurityContext.userId(), markReadMessage);
            default -> throw new IllegalStateException("Unexpected value: " + userSecurityContext.role());
        };

    }

}
