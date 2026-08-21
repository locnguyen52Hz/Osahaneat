package com.example.restaurant.management.Service.Orders;

import com.example.restaurant.management.Entity.Order;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.OrdersRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import com.example.restaurant.management.Service.Orders.Imp.ShopManagerOrderServiceImp;
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


    public Page<OrdersDto> getOrders(String authHeader, int page, int pageSize, boolean includeTotalQuantity) {
        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        System.out.println("role: " + role);
        if (!includeTotalQuantity) {
            return switch (role) {
                case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrdersWithPage(userId, page, pageSize);
                case "ROLE_BUYER" -> buyerOrdersServiceImp.getOrdersWithPage(userId, page, pageSize);
                default -> throw new RuntimeException("Role not authorized to access categories");
            };
        } else {
            return shopManagerOrderServiceImp.getOrdersWithTotalQuantity(userId, page, pageSize);
        }

    }


    public Page<OrderTimeLineDto> getActiveOrders(String authHeader, int page) {
        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getActiveOrdersWithPage(userId, page);
//            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getActiveOrders(userID);
            default -> throw new RuntimeException("Role not found" + role);
        };
    }


    public Page<OrdersDto> getPreviousOrders(String authHeader, int page) {
        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getPreviousOrders(userId, page);
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getPreviousOrders(userId, page);
            default -> throw new RuntimeException("Role not found" + role);
        };
    }


    public OrdersDto updateOrderStatus(String authHeader, OrdersStatus newStatus, Integer orderId) {
        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        Order order = ordersRepository.findOrderById(orderId);
        if (order == null) {
            throw new RuntimeException("Orders not found");
        }
        OrderStatusHistory currentStatus = orderStatusHistoryRepository.findCurrentStatus(order.getId());
        if (currentStatus == null) {
            throw new RuntimeException("Order status history not found");
        }
        OrdersDto ordersDTO;
        switch (role) {
            case "ROLE_BUYER" -> ordersDTO = buyerOrdersServiceImp.updateOrderStatus(newStatus, order);
            case "ROLE_SHOP_MANAGER" -> ordersDTO = shopManagerOrderServiceImp.updateOrderStatus(newStatus, order);
            default -> throw new RuntimeException("Role not found" + role);
        }
        return ordersDTO;
    }


    public List<OrderItemDto> getOrdersItems(String authHeader, Integer orderId) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getListOrderItems(userId, orderId);
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getListOrderItems(userId, orderId);
            default -> throw new RuntimeException("Role not found" + role);
        };
    }

    public OrderTimelineResponseDto getOrderTimeLineItems(String authHeader, Integer orderId) {

        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String role = user.getRole().getRoleName();

        return switch (role) {
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getOrderTimelineItems(userId, orderId);
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrderTimelineItems(userId, orderId);
            default -> throw new RuntimeException("Role not found" + role);
        };

    }

    public OrdersDto getOrderDetails (String auth, Integer orderId) {
        Integer userId = jwtHelper.getUserID(auth);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getOrderDetails(orderId, userId);
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrderDetails( orderId, userId);
            default -> throw new RuntimeException("Role not found" + role);
        };
    }

}