package com.example.restaurant.management.Service;

import com.example.restaurant.management.DTO.OrdersDTO;

public interface NotificationService {
    void notifyOrderUpdate(OrdersDTO ordersDTO);

}
