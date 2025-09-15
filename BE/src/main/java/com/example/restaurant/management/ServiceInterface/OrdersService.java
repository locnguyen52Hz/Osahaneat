package com.example.restaurant.management.ServiceInterface;


import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.Orders;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;


public interface OrdersService {
    OrdersDTO createOrder(OrdersRequest ordersRequest, @RequestHeader ("Authorization") String authHeader);
    List<OrdersDTO> findAllOrders(@RequestHeader("Authorization") String authHeader);
    List<OrdersDTO> findPendingConfirmationOrdersByBuyer(@RequestHeader("Authorization") String authHeader);
}
