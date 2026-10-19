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
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CommonMessageService {

    @Autowired
    MessageRepository messageRepository;

    public MessageDto saveMessage(MessageRequest request, User sender, Conversation conversation) {

        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(request.content);
        message.setCreatedAt(Instant.now());
        message.setSender(sender);
        message.setSentAt(request.sentAt);
        message.setClientMessageId(request.clientMessageId);
        message.setClientSequence(request.clientSequence);
        messageRepository.save(message);
        conversation.setLastMessageAt(request.sentAt);

        return new MessageDto(
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
    }
}
