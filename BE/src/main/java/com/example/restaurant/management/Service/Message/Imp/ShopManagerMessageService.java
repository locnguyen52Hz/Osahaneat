package com.example.restaurant.management.Service.Message.Imp;


import com.example.restaurant.management.dto.*;
import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.Entity.Message;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import com.example.restaurant.management.Repository.ConversationRepository;
import com.example.restaurant.management.Repository.MessageRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Message.MessageService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ShopManagerMessageService implements MessageService {


    @Autowired
    ConversationRepository conversationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    ShopsRepository shopsRepository;

    //    =========================================== SEND MESSAGE ===========================================
    @Override
    public MessageDto sendMessage(Integer senderId, Integer buyerId, String content) {
        User receiver = userRepository.findById(buyerId).orElseThrow(() -> new EntityNotFoundException("User not found"));


        Shop shop = shopsRepository.findShopsByManager_Id(senderId);
        Conversation conversation = conversationRepository.getConversationByBuyerIdAndShopId(buyerId, shop.getId());
        if (conversation == null) {
            conversation = new Conversation();
            conversation.setBuyer(receiver);
            conversation.setShop(shop);
            conversation.setCreatedAt(Instant.now());
            conversation.setLastMessageAt(Instant.now());
            conversationRepository.save(conversation);
        }
        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(content);
        message.setCreatedAt(Instant.now());
        message.setSender(shop.getManager());
        messageRepository.save(message);

        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        MessageDto messageDTO = new MessageDto(message.getId(), message.getContent(), message.getSender().getId(), message.getSender().getFullName(),message.getCreatedAt(), message.getReadAt(), message.getConversation().getId());

        simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiver.getId()), "/queue/message", messageDTO);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getSender().getId() ), "/queue/message", messageDTO);


        return messageDTO;
    }


    //  =========================================== GET CONVERSATION =============================================
    @Override
    public List<ConversationWithLatestMessageDto> getLatestMessages(Integer id, Pageable pageable) {
        Shop shop = shopsRepository.findShopsByManager_Id(id);
        return conversationRepository.getConversationsByShopsId(shop.getId(), pageable);
    }

    //============================================== GET Messages =================================================
    @Override
    public MessagePageResponseDto latestMessage(Integer userId, Integer conversationId, Integer buyerId, Pageable pageable) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(conversationId, buyerId, shop.getId());
        if (conversation == null) {
            throw new EntityNotFoundException("Conversation not found");
        }
        List<MessageDto> messageDtoList = messageRepository.findMessages(conversation.getId(), pageable);

        MessagePageResponseDto messagePageResponseDTO = null;
        if (!messageDtoList.isEmpty()) {
            MessageDto oldestMessage = messageDtoList.get(messageDtoList.size() - 1);// message cũ
            MessageCursorDto oldestCursor = messageDtoList.size() < 5 ? null : new MessageCursorDto(oldestMessage.getCreatedAt(), oldestMessage.getId());// trỏ message cũ

            MessageDto latestMessage = messageDtoList.get(0);// message mới nhất
            MessageCursorDto latestMessageCursor = messageDtoList.size() < 5 ? null : new MessageCursorDto(latestMessage.getCreatedAt(), latestMessage.getId());// trỏ message mới nhất
            messagePageResponseDTO = new MessagePageResponseDto(messageDtoList, oldestCursor, latestMessageCursor);

        }

        return messagePageResponseDTO;
    }

    @Override
    public MessagePageResponseDto getOlderMessages(Integer userId, GetOlderMessagesRequest getOlderMessagesRequest, Pageable pageable) {
        Integer shopId = shopsRepository.findShopsByManager_Id(userId).getId();
        Integer buyerId = getOlderMessagesRequest.getPartnerId();

        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(getOlderMessagesRequest.getConversationId(), buyerId, shopId);
        Instant lastCreatedAt = getOlderMessagesRequest.getMessageCursor().getCreatedAt();
        Integer lastMessageId = getOlderMessagesRequest.getMessageCursor().getId();

        List<MessageDto> messageDtoList = messageRepository.loadMoreMessage(conversation.getId(), lastCreatedAt, lastMessageId, pageable);
        MessagePageResponseDto messagePageResponseDTO = null;

        if (!messageDtoList.isEmpty()) {
            MessageDto lastMessage = messageDtoList.get(messageDtoList.size() - 1);
            MessageCursorDto oldestCursor = messageDtoList.size() < 5 ? null : new MessageCursorDto(lastMessage.getCreatedAt(), lastMessage.getId());
            messagePageResponseDTO = new MessagePageResponseDto(messageDtoList, oldestCursor);
        }
        return messagePageResponseDTO;
    }

    @Override
    public Integer unreadCountTotal(Integer userId) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new EntityNotFoundException("Shops not found");
        }
        return messageRepository.countUnreadMessagesForShop(userId, shop.getId());
    }

    @Override
    public UnreadCount markUnreadMessages(Integer shopManagerId, MarkReadMessage markReadMessage) {
        Integer shopId = shopsRepository.findShopsByManager_Id(shopManagerId).getId();
        messageRepository.markMessagesAsRead(shopManagerId, markReadMessage.getConversationId(), markReadMessage.getLastSeenMessageId(), markReadMessage.getLastSeenAt());
        return messageRepository.getUnreadMessageStatsForShopManager(markReadMessage.getConversationId(),shopManagerId, shopId);
    }
}
