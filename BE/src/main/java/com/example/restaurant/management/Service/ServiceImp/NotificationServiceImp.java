package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.DTO.Notification;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
public class NotificationServiceImp implements NotificationService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public void notifyOrderUpdate(OrdersDTO ordersDTO) {
        Notification<OrdersDTO> notification = new Notification<>();
        notification.setData(ordersDTO);
        notification.setMessage("Order " +ordersDTO.getStatus() + " by " + ordersDTO.getPartnerName());
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(ordersDTO.getPartnerId()),
                "/queue/notify",notification);
    };

}
