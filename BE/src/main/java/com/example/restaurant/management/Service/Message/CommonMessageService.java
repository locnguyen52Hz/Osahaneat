package com.example.restaurant.management.Service.Message;


import com.example.restaurant.management.Entity.Conversation;
import com.example.restaurant.management.Entity.Message;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Payload.Request.MessageRequest;
import com.example.restaurant.management.Repository.ConversationRepository;
import com.example.restaurant.management.Repository.MessageRepository;
import com.example.restaurant.management.dto.MessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Objects;

@Service
public class CommonMessageService {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    MessagePersistenceService messagePersistenceService;

    public MessageDto sendMessageIdempotently(
            MessageRequest request,
            User buyer,
            Shop shop,
            Integer receiverId
    ) {
        User sender = Objects.equals(receiverId, buyer.getId())
                ? shop.getManager()
                : buyer;

        try {
            MessageDto messageDto = messagePersistenceService.saveMessage(request, buyer, shop, sender);
            simpMessagingTemplate.convertAndSendToUser(String.valueOf(receiverId),
                    "/queue/message", messageDto);
            return messageDto;

        } catch (DataIntegrityViolationException exception) {
            if (isDuplicateClientMessageId(exception)) {
                Message existingMessage =
                        messageRepository.findMessageByClientMessageIdAndSender_Id(request.clientMessageId, sender.getId());
                if (existingMessage != null) {
                    return new MessageDto(
                            existingMessage.getId(),
                            existingMessage.getContent(),
                            existingMessage.getSender().getId(),
                            existingMessage.getSender().getFullName(),
                            existingMessage.getCreatedAt(),
                            existingMessage.getReadAt(),
                            existingMessage.getConversation().getId(),
                            existingMessage.getClientSequence(),
                            existingMessage.getSentAt(),
                            existingMessage.getClientMessageId()
                    );
                }
            }

            throw exception;
        }
    }


    public boolean isDuplicateClientMessageId(Throwable exception) {
        Throwable cause = exception;

        while (cause != null) {
            if (cause instanceof org.hibernate.exception.ConstraintViolationException ex) {
                String constraintName = ex.getConstraintName();

                return constraintName != null
                       && constraintName.endsWith(
                        "uk_message_sender_client_message_id"
                );
            }

            cause = cause.getCause();
        }

        return false;
    }
}
