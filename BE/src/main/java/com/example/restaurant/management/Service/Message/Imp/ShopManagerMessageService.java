package com.example.restaurant.management.Service.Message.Imp;


import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.Entity.Message;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import com.example.restaurant.management.Payload.Request.MessageRequest;
import com.example.restaurant.management.Repository.ConversationRepository;
import com.example.restaurant.management.Repository.MessageRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Message.MessageService;
import com.example.restaurant.management.dto.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public MessageDto sendMessage(MessageRequest messageRequest, Integer senderId) {
        User receiver = userRepository.findById(messageRequest.receiverId).orElseThrow(() -> new EntityNotFoundException("User not found"));


        Shop shop = shopsRepository.findShopsByManager_Id(senderId);
        Conversation conversation = conversationRepository.getConversationByBuyerIdAndShopId(messageRequest.receiverId, shop.getId());
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
        message.setContent(messageRequest.content);
        message.setCreatedAt(Instant.now());
        message.setSender(shop.getManager());
//        message.setSentAt(messageRequest.sentAt);
        message.setSentAt(Instant.now());

        message.setClientSequence(messageRequest.clientSequence);

        messageRepository.save(message);

        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        MessageDto messageDTO = new MessageDto(
                message.getId(),
                message.getContent(),
                message.getSender().getId(),
                message.getSender().getFullName(),
                message.getCreatedAt(),
                message.getReadAt(),
                message.getConversation().getId(),
                message.getClientSequence(),
                message.getSentAt()
        );


        simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiver.getId()), "/queue/message", messageDTO);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(message.getSender().getId()), "/queue/message", messageDTO);


        return messageDTO;
    }


    //  =========================================== GET CONVERSATION =============================================
    @Override
    public List<ConversationMeta> getConversations(Integer id, Pageable pageable) {
        Shop shop = shopsRepository.findShopsByManager_Id(id);
        List<ConversationMeta> conversationMetas = conversationRepository.getConversationsByShopManager(shop.getId(), pageable);
        if (conversationMetas.isEmpty()) {
            return conversationMetas;
        }
        List<Integer> conversationIds = conversationMetas.stream().map(ConversationMeta::getId).toList();
        List<ConversationSequenceDto> dtoList = conversationRepository.getConversationSequences(id, conversationIds);
        Map<Integer, ConversationSequenceDto> sequenceMap = dtoList.stream()
                .collect(Collectors.toMap(
                        ConversationSequenceDto::getConversationId,
                        dto -> dto
                ));
        for (ConversationMeta conversationMeta : conversationMetas) {
            ConversationSequenceDto sequenceDto =
                    sequenceMap.get(conversationMeta.getId());

            if (sequenceDto != null) {
                conversationMeta.setClientSequence(
                        new ConversationSequenceDto(
                                sequenceDto.getConversationId(),
                                sequenceDto.getMySequence(),
                                sequenceDto.getPartnerSequence()
                        )
                );
            }
        }

        return conversationMetas;
    }

    //============================================== GET Messages =================================================
    @Override
    public MessagePageResponseDto latestMessage(Integer userId, Integer conversationId, Integer buyerId, Pageable pageable) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);

        Conversation conversation =
                conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(
                        conversationId,
                        buyerId,
                        shop.getId());

        if (conversation == null) {
            throw new EntityNotFoundException("Conversation not found");
        }
        List<MessageDto> messageDtoList =
                messageRepository.findLastestMessagesByConversationId(conversation.getId(), pageable);

        MessagePageResponseDto messagePageResponseDTO = null;
        if (!messageDtoList.isEmpty()) {
            MessageDto oldestMessage =
                    messageDtoList.get(messageDtoList.size() - 1);

            MessageCursorDto oldestCursor =
                    messageDtoList.size() < pageable.getPageSize()
                            ? null
                            : new MessageCursorDto(
                            oldestMessage.getSentAt(),
                            oldestMessage.getClientSequence(),
                            oldestMessage.getId()
                    );

            MessageDto latestMessage = messageDtoList.get(0);

            MessageCursorDto latestMessageCursor =
                    messageDtoList.size() < pageable.getPageSize()
                            ? null
                            : new MessageCursorDto(
                            latestMessage.getSentAt(),
                            latestMessage.getClientSequence(),
                            latestMessage.getId()
                    );

            messagePageResponseDTO = new MessagePageResponseDto(
                    messageDtoList,
                    oldestCursor,
                    latestMessageCursor
            );
        }

        return messagePageResponseDTO;
    }

    @Override
    public MessagePageResponseDto getOlderMessages(Integer userId, GetOlderMessagesRequest getOlderMessagesRequest, Pageable pageable) {
        Integer shopId = shopsRepository.findShopsByManager_Id(userId).getId();
        Integer buyerId = getOlderMessagesRequest.getPartnerId();

        Conversation conversation = conversationRepository.getConversationsByIdAndBuyer_IdAndShop_Id(
                getOlderMessagesRequest.getConversationId(),
                buyerId,
                shopId);

        Instant lastSentAt = getOlderMessagesRequest.getMessageCursor().getSentAt();
        Integer lastMessageId = getOlderMessagesRequest.getMessageCursor().getId();
        Long lastClientSequence = getOlderMessagesRequest.getMessageCursor().getClientSequence();

        List<MessageDto> messageDtoList = messageRepository.
                getOlderMessages(conversation.getId(), lastSentAt, lastClientSequence, lastMessageId, pageable);
        MessagePageResponseDto messagePageResponseDTO = null;

        if (!messageDtoList.isEmpty()) {
            MessageDto oldestMessage = messageDtoList.get(messageDtoList.size() - 1);
            MessageCursorDto oldestCursor = messageDtoList.size() < 5 ? null :
                    new MessageCursorDto(oldestMessage.getSentAt(), oldestMessage.getClientSequence(), oldestMessage.getId());
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
    public UnreadCount markUnreadMessages(Integer userId, MarkReadMessage markReadMessage) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new EntityNotFoundException("Shops not found");
        }
        Conversation conversation =
                conversationRepository.getConversationsByIdAndShop_Id(markReadMessage.getConversationId(), shop.getId());
        if (conversation == null) {
            throw new EntityNotFoundException("Conversation not found");
        }
        messageRepository.markMessagesAsRead(
                userId,
                markReadMessage.getConversationId(),
                markReadMessage.getFirstSeenClientSequence(),
                markReadMessage.getLastSeenClientSequence(),
                markReadMessage.getLastSeenAt());
        return messageRepository.getUnreadMessageStatsForShopManager(markReadMessage.getConversationId(), userId, shop.getId());
    }
}
