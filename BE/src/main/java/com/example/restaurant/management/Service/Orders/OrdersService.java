package com.example.restaurant.management.Service.Orders;


import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.Orders;
import com.example.restaurant.management.Entity.OrdersItem;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


public interface OrdersService {

    OrdersDTO updateOrderStatus(OrderStatusHistory currentStatus, OrdersStatus newStatus, Orders orders);
    Page<OrdersDTO> getOrdersWithPage(Integer userId, int page);
    Page<OrdersDTO> getOrdersByStatus(Integer userId,OrdersStatus status, int page);
    List<OrderItemDTO> getListOrderItems(Integer userId, Integer orderId);
}
