package com.example.restaurant.management.Service.Message.Imp;


import com.example.restaurant.management.DTO.*;
import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.Entity.Message;
import com.example.restaurant.management.Entity.Shops;
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
import java.time.LocalDateTime;
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
    public MessageDTO sendMessage(Integer senderId, Integer buyerId, String content) {
        User receiver = userRepository.findById(buyerId).orElseThrow(() -> new EntityNotFoundException("User not found"));


        Shops shops = shopsRepository.findShopsByManager_Id(senderId);
        Conversation conversation = conversationRepository.getConversationByBuyerIdAndShopsId(buyerId, shops.getId());
        if (conversation == null) {
            conversation = new Conversation();
            conversation.setBuyer(receiver);
            conversation.setShops(shops);
            conversation.setCreatedAt(Instant.now());
            conversation.setLastMessageAt(Instant.now());
            conversationRepository.save(conversation);
        }
        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(content);
        message.setCreatedAt(Instant.now());
        message.setSender(shops.getManager());
        messageRepository.save(message);

        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        MessageDTO messageDTO = new MessageDTO(message.getId(), message.getContent(), message.getSender().getId(), message.getSender().getFullName(),message.getCreatedAt(), message.getReadAt(), message.getConversation().getId());

        simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiver.getId()), "/queue/message", messageDTO);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getSender().getId() ), "/queue/message", messageDTO);


        return messageDTO;
    }


    //  =========================================== GET CONVERSATION =============================================
    @Override
    public List<ConversationWithLatestMessageDTO> getLatestMessages(Integer id, Pageable pageable) {
        Shops shops = shopsRepository.findShopsByManager_Id(id);
        return conversationRepository.getConversationsByShopsId(shops.getId(), pageable);
    }

    //============================================== GET Messages =================================================
    @Override
    public MessagePageResponseDTO latestMessage(Integer userId, Integer conversationId, Integer buyerId, Pageable pageable) {
        Shops shops = shopsRepository.findShopsByManager_Id(userId);
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShops_Id(conversationId, buyerId, shops.getId());
        if (conversation == null) {
            throw new EntityNotFoundException("Conversation not found");
        }
        List<MessageDTO> messageDTOList = messageRepository.findMessages(conversation.getId(), pageable);

        MessagePageResponseDTO messagePageResponseDTO = null;
        if (!messageDTOList.isEmpty()) {
            MessageDTO oldestMessage = messageDTOList.get(messageDTOList.size() - 1);// message cũ
            MessageCursorDTO oldestCursor = messageDTOList.size() < 5 ? null : new MessageCursorDTO(oldestMessage.getCreatedAt(), oldestMessage.getId());// trỏ message cũ

            MessageDTO latestMessage = messageDTOList.get(0);// message mới nhất
            MessageCursorDTO latestMessageCursor = messageDTOList.size() < 5 ? null : new MessageCursorDTO(latestMessage.getCreatedAt(), latestMessage.getId());// trỏ message mới nhất
            messagePageResponseDTO = new MessagePageResponseDTO(messageDTOList, oldestCursor, latestMessageCursor);

        }

        return messagePageResponseDTO;
    }

    @Override
    public MessagePageResponseDTO getOlderMessages(Integer userId, GetOlderMessagesRequest getOlderMessagesRequest, Pageable pageable) {
        Integer shopId = shopsRepository.findShopsByManager_Id(userId).getId();
        Integer buyerId = getOlderMessagesRequest.getPartnerId();

        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShops_Id(getOlderMessagesRequest.getConversationId(), buyerId, shopId);
        Instant lastCreatedAt = getOlderMessagesRequest.getMessageCursor().getCreatedAt();
        Integer lastMessageId = getOlderMessagesRequest.getMessageCursor().getId();

        List<MessageDTO> messageDTOList = messageRepository.loadMoreMessage(conversation.getId(), lastCreatedAt, lastMessageId, pageable);
        MessagePageResponseDTO messagePageResponseDTO = null;

        if (!messageDTOList.isEmpty()) {
            MessageDTO lastMessage = messageDTOList.get(messageDTOList.size() - 1);
            MessageCursorDTO oldestCursor = messageDTOList.size() < 5 ? null : new MessageCursorDTO(lastMessage.getCreatedAt(), lastMessage.getId());
            messagePageResponseDTO = new MessagePageResponseDTO(messageDTOList, oldestCursor);
        }
        return messagePageResponseDTO;
    }

    @Override
    public Integer unreadCountTotal(Integer userId) {
        Shops shops = shopsRepository.findShopsByManager_Id(userId);
        if (shops == null) {
            throw new EntityNotFoundException("Shops not found");
        }
        return messageRepository.countUnreadMessagesForShop(userId, shops.getId());
    }

    @Override
    public UnreadCount markUnreadMessages(Integer shopManagerId, MarkReadMessage markReadMessage) {
        Integer shopId = shopsRepository.findShopsByManager_Id(shopManagerId).getId();
        messageRepository.markMessagesAsRead(shopManagerId, markReadMessage.getConversationId(), markReadMessage.getLastSeenMessageId(), markReadMessage.getLastSeenAt());
        return messageRepository.getUnreadMessageStatsForShopManager(markReadMessage.getConversationId(),shopManagerId, shopId);
    }
}
