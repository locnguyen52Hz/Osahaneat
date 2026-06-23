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
public class BuyerMessageService implements MessageService {


    @Autowired
    ConversationRepository conversationRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    //    =========================================== SEND MESSAGE ===========================================
    @Override
    public MessageDto sendMessage(Integer senderId, Integer shopId, String content) {
        //tìm shop nhận tin nhắn
        Shop shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        User receiver = userRepository.findUserById(shop.getManager().getId());

        //người gửi tin nhắn
        User user = userRepository.findUserById(senderId);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        //kiểm tra cuộc hội thoại đã tôn tại chưa, nếu chưa tạo hội thoại mới
        Conversation conversation = conversationRepository.getConversationByBuyerIdAndShopId(senderId, shop.getId());
        if (conversation == null) {
            conversation = new Conversation();
            conversation.setBuyer(user);
            conversation.setShop(shop);
            conversation.setCreatedAt(Instant.now());
            conversation.setLastMessageAt(Instant.now());
            conversation = conversationRepository.save(conversation);
        }
        // tạo message mới
        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(content);
        message.setCreatedAt(Instant.now());
        message.setSender(user);

        messageRepository.save(message);

        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        MessageDto messageDTO = new MessageDto(message.getId(), message.getContent(), message.getSender().getId(), message.getSender().getFullName(),message.getCreatedAt(), message.getReadAt(), message.getConversation().getId());

        //gửi thông báo cho receiver
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiver.getId()), "/queue/message", messageDTO);
        // gửi thông báo cho sender
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getSender().getId()), "/queue/message", messageDTO);

        return messageDTO;
    }


    //  =========================================== GET CONVERSATION =============================================
    @Override
    public List<ConversationWithLatestMessageDto> getLatestMessages(Integer id, Pageable pageable) {

        return conversationRepository.getLastMessageDTOByBuyerId(id, pageable);
    }

    @Override
    public MessagePageResponseDto latestMessage(Integer userId, Integer conversationId, Integer shopId, Pageable pageable) {
        Shop shop = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(conversationId, userId, shop.getId());
        if (conversation == null) {
            throw new RuntimeException("Conversation not found");
        }

        List<MessageDto> messageDtoList = messageRepository.findMessages(conversation.getId(), pageable);//

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

        Shop shop = shopsRepository.findById(getOlderMessagesRequest.getPartnerId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(getOlderMessagesRequest.getConversationId(), userId, shop.getId());
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
        return messageRepository.countUnreadMessagesByBuyerId(userId);
    }

    @Override
    public UnreadCount markUnreadMessages(Integer buyerId, MarkReadMessage markReadMessage) {
        messageRepository.markMessagesAsRead(buyerId, markReadMessage.getConversationId(), markReadMessage.getLastSeenMessageId(), markReadMessage.getLastSeenAt());

        return messageRepository.getUnreadMessageStatsForBuyer(markReadMessage.getConversationId(), buyerId);
    }
}
