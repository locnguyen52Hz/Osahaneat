package com.example.restaurant.management.Service.Orders;


import com.example.restaurant.management.dto.*;

import com.example.restaurant.management.Entity.Order;
import com.example.restaurant.management.Enums.OrdersStatus;

import org.springframework.data.domain.Page;


import java.util.List;


public interface OrdersService {
    OrdersDto getOrderDetails(Integer orderId, Integer userId);
    OrdersDto updateOrderStatus(OrdersStatus newStatus, Order orders);
    Page<OrdersDto> getOrdersWithPage(Integer userId, int page, int pageSize);
    Page<OrdersDto> getPreviousOrders(Integer userId, int page);
    List<OrderItemDto> getListOrderItems(Integer userId, Integer orderId);
    OrderTimelineResponseDto getOrderTimelineItems(Integer userId, Integer orderId);
    Page<OrderTimeLineDto> getActiveOrdersWithPage(Integer userId, int page);



}
