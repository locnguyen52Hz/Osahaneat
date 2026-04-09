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
    public MessageDTO sendMessage(Integer senderId, Integer shopId, String content) {
        //tìm shop nhận tin nhắn
        Shops shops = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        User receiver = userRepository.findUserById(shops.getManager().getId());

        //người gửi tin nhắn
        User user = userRepository.findUserById(senderId);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        //kiểm tra cuộc hội thoại đã tôn tại chưa, nếu chưa tạo hội thoại mới
        Conversation conversation = conversationRepository.getConversationByBuyerIdAndShopsId(senderId, shops.getId());
        if (conversation == null) {
            conversation = new Conversation();
            conversation.setBuyer(user);
            conversation.setShops(shops);
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

        MessageDTO messageDTO = new MessageDTO(message.getId(), message.getContent(), message.getSender().getId(), message.getSender().getFullName(),message.getCreatedAt(), message.getReadAt(), message.getConversation().getId());

        //gửi thông báo cho receiver
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiver.getId()), "/queue/message", messageDTO);
        // gửi thông báo cho sender
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getSender().getId()), "/queue/message", messageDTO);

        return messageDTO;
    }


    //  =========================================== GET CONVERSATION =============================================
    @Override
    public List<ConversationWithLatestMessageDTO> getLatestMessages(Integer id, Pageable pageable) {

        return conversationRepository.getLastMessageDTOByBuyerId(id, pageable);
    }

    @Override
    public MessagePageResponseDTO latestMessage(Integer userId, Integer conversationId, Integer shopId, Pageable pageable) {
        Shops shops = shopsRepository.findById(shopId).orElseThrow(() -> new EntityNotFoundException("Shop not found"));
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShops_Id(conversationId, userId, shops.getId());
        if (conversation == null) {
            throw new RuntimeException("Conversation not found");
        }

        List<MessageDTO> messageDTOList = messageRepository.findMessages(conversation.getId(), pageable);//

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

        Shops shops = shopsRepository.findById(getOlderMessagesRequest.getPartnerId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));
        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShops_Id(getOlderMessagesRequest.getConversationId(), userId, shops.getId());
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
        return messageRepository.countUnreadMessagesByBuyerId(userId);
    }

    @Override
    public UnreadCount markUnreadMessages(Integer buyerId, MarkReadMessage markReadMessage) {
        messageRepository.markMessagesAsRead(buyerId, markReadMessage.getConversationId(), markReadMessage.getLastSeenMessageId(), markReadMessage.getLastSeenAt());

        return messageRepository.getUnreadMessageStatsForBuyer(markReadMessage.getConversationId(), buyerId);
    }
}
