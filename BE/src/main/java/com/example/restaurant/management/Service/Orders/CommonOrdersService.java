package com.example.restaurant.management.Service.Orders;

import com.example.restaurant.management.Entity.Order;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.OrdersRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import com.example.restaurant.management.Service.Orders.Imp.ShopManagerOrderServiceImp;
import com.example.restaurant.management.Service.UserSecurity.UserSecurityService;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
public class CommonOrdersService {

    @Autowired
    JwtHelper jwtHelper;


    @Autowired
    UserRepository userRepository;

    @Autowired
    OrdersRepository ordersRepository;

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    BuyerOrdersServiceImp buyerOrdersServiceImp;

    @Autowired
    ShopManagerOrderServiceImp shopManagerOrderServiceImp;

    @Autowired
    UserSecurityService userSecurityService;


    public Page<OrdersDto> getOrders(String authHeader, int page, int pageSize, boolean includeTotalQuantity) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        if (!includeTotalQuantity) {
            return switch (userSecurityContext.role()) {
                case ROLE_SHOP_MANAGER -> shopManagerOrderServiceImp.getOrdersWithPage(userSecurityContext.userId(), page, pageSize);
                case ROLE_BUYER -> buyerOrdersServiceImp.getOrdersWithPage(userSecurityContext.userId(), page, pageSize);
                default -> throw new RuntimeException("Role not authorized to access categories");
            };
        } else {
            return shopManagerOrderServiceImp.getOrdersWithTotalQuantity(userSecurityContext.userId(), page, pageSize);
        }

    }


    public Page<OrderTimeLineDto> getActiveOrders(String authHeader, int page) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerOrdersServiceImp.getActiveOrdersWithPage(userSecurityContext.userId(), page);
//            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getActiveOrders(userID);
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        };
    }


    public Page<OrdersDto> getPreviousOrders(String authHeader, int page) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerOrdersServiceImp.getPreviousOrders(userSecurityContext.userId(), page);
            case ROLE_SHOP_MANAGER -> shopManagerOrderServiceImp.getPreviousOrders(userSecurityContext.userId(), page);
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        };
    }


    public OrdersDto updateOrderStatus(String authHeader, OrdersStatus newStatus, Integer orderId) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        Order order = ordersRepository.findOrderById(orderId);
        if (order == null) {
            throw new RuntimeException("Orders not found");
        }
        OrderStatusHistory currentStatus = orderStatusHistoryRepository.findCurrentStatus(order.getId());
        if (currentStatus == null) {
            throw new RuntimeException("Order status history not found");
        }
        OrdersDto ordersDTO;
        switch (userSecurityContext.role()) {
            case ROLE_BUYER -> ordersDTO = buyerOrdersServiceImp.updateOrderStatus(newStatus, order);
            case ROLE_SHOP_MANAGER -> ordersDTO = shopManagerOrderServiceImp.updateOrderStatus(newStatus, order);
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        }
        return ordersDTO;
    }


    public List<OrderItemDto> getOrdersItems(String authHeader, Integer orderId) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerOrdersServiceImp.getListOrderItems(userSecurityContext.userId(), orderId);
            case ROLE_SHOP_MANAGER -> shopManagerOrderServiceImp.getListOrderItems(userSecurityContext.userId(), orderId);
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        };
    }

    public OrderTimelineResponseDto getOrderTimeLineItems(String authHeader, Integer orderId) {

        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);


        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerOrdersServiceImp.getOrderTimelineItems(userSecurityContext.userId(), orderId);
            case ROLE_SHOP_MANAGER -> shopManagerOrderServiceImp.getOrderTimelineItems(userSecurityContext.userId(), orderId);
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        };

    }

    public OrdersDto getOrderDetails (String authHeader, Integer orderId) {
        UserSecurityContext userSecurityContext = userSecurityService.getUserSecurityContext(authHeader);

        return switch (userSecurityContext.role()) {
            case ROLE_BUYER -> buyerOrdersServiceImp.getOrderDetails(orderId, userSecurityContext.userId());
            case ROLE_SHOP_MANAGER -> shopManagerOrderServiceImp.getOrderDetails( orderId, userSecurityContext.userId());
            default -> throw new RuntimeException("Role not found" + userSecurityContext.role());
        };
    }

}