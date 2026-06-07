package com.example.restaurant.management.Service.Orders;


import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrderTimeLineDTO;
import com.example.restaurant.management.DTO.OrderTimeLineRowDTO;

import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.Orders;
import com.example.restaurant.management.Enums.OrdersStatus;

import org.springframework.data.domain.Page;


import java.util.List;


public interface OrdersService {

    OrdersDTO updateOrderStatus( OrdersStatus newStatus, Orders orders);
    Page<OrdersDTO> getOrdersWithPage(Integer userId, int page, int pageSize);
    Page<OrdersDTO> getPreviousOrders(Integer userId, int page);
    List<OrderItemDTO> getListOrderItems(Integer userId, Integer orderId);

    Page<OrderTimeLineDTO> getActiveOrdersWithPage(Integer userId, int page);



}
