package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.dto.ConversationWithLatestMessageDto;
import com.example.restaurant.management.dto.MessageDto;
import com.example.restaurant.management.dto.MessagePageResponseDto;
import com.example.restaurant.management.dto.UnreadCount;
import com.example.restaurant.management.Payload.Request.GetOlderMessagesRequest;
import com.example.restaurant.management.Payload.Request.MarkReadMessage;
import com.example.restaurant.management.Payload.Request.MessageRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.Message.CommonMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/messages")
public class MessageController {

    @Autowired
    CommonMessageService commonMessageService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> sendMessage(@RequestHeader("Authorization") String authorization, @RequestBody MessageRequest messageRequest) {
        ResponseData responseData = new ResponseData();
        MessageDto messageDTO = commonMessageService.sendMessage(authorization, messageRequest);
        responseData.setData(messageDTO);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/conversations")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getLatestMessages(@RequestHeader("Authorization") String authorization, @RequestParam int page) {
        ResponseData responseData = new ResponseData();
        List<ConversationWithLatestMessageDto> conversations = commonMessageService.getConversations(authorization, page);
        responseData.setData(conversations);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("latest-message")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> latestMessage(@RequestHeader("Authorization") String authorization, @RequestParam Integer conversationId,
                                           @RequestParam Integer partnerId) {
        ResponseData responseData = new ResponseData();
        MessagePageResponseDto messageDTOS = commonMessageService.latestMessage(authorization, conversationId, partnerId);
        responseData.setData(messageDTOS);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("older-messages")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getOlderMessages(@RequestHeader("Authorization") String authorization, @RequestBody GetOlderMessagesRequest getOlderMessagesRequest) {
        ResponseData responseData = new ResponseData();
        MessagePageResponseDto messageDTOS = commonMessageService.getOlderMessages(authorization, getOlderMessagesRequest);
        responseData.setData(messageDTOS);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("unread-count")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> unreadCountTotal(@RequestHeader("Authorization") String authorization) {
        ResponseData responseData = new ResponseData();
        Integer unreadCountTotal = commonMessageService.unreadCountTotal(authorization);
        responseData.setData(unreadCountTotal);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("mark-up-messages")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> markUpMessages(@RequestHeader("Authorization") String authorization, @RequestBody MarkReadMessage markReadMessage) {
        ResponseData responseData = new ResponseData();
        UnreadCount unreadCount = commonMessageService.markReadMessages(authorization, markReadMessage);
        responseData.setData(unreadCount);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
