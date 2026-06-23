package com.example.restaurant.management.Service;

import com.example.restaurant.management.dto.OrdersDto;

public interface NotificationService {
    void notifyOrderUpdate(OrdersDto ordersDTO);

}
