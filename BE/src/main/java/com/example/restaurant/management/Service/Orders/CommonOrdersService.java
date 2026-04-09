package com.example.restaurant.management.Service.Orders;

import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersItemRequest;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.*;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import com.example.restaurant.management.Service.Orders.Imp.ShopManagerOrderServiceImp;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class CommonOrdersService {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    UserRepository userRepository;


    @Autowired
    OrdersRepository ordersRepository;

    @Autowired
    OrdersItemRepository ordersItemRepository;

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    BuyerOrdersServiceImp buyerOrdersServiceImp;

    @Autowired
    ShopManagerOrderServiceImp shopManagerOrderServiceImp;

    @Autowired
    OrdersHelper ordersHelper;


    public Page<OrdersDTO> getOrdersWithPage(String authHeader, int page) {
        Integer userID = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrdersWithPage(userID,page);
            case "ROLE_BUYER" -> buyerOrdersServiceImp.getOrdersWithPage(userID, page);
            default -> throw new RuntimeException("Role not authorized to access categories");
        };
    }






    public Page<OrdersDTO> findOrdersByStatus(String authHeader, OrdersStatus status, int page) {
        Integer userID = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" ->  buyerOrdersServiceImp.getOrdersByStatus(userID,status, page);
            case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrdersByStatus(userID,status, page);
            default -> throw new RuntimeException("Role not found" + role);
        };
    }




    public OrdersDTO updateOrderStatus(String authHeader, OrdersStatus newStatus, Integer orderId) {
        Integer userID = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        Orders orders = ordersRepository.findOrdersById(orderId);
        if (orders == null) {
            throw new RuntimeException("Orders not found");
        }
        OrderStatusHistory currentStatus = orderStatusHistoryRepository.findCurrentStatus(orders.getId());
        if (currentStatus == null) {
            throw new RuntimeException("Order status history not found");
        }
        OrdersDTO ordersDTO = new OrdersDTO();
        switch (role) {
            case "ROLE_BUYER" ->
                    ordersDTO = buyerOrdersServiceImp.updateOrderStatus(currentStatus, newStatus, orders);
            case "ROLE_SHOP_MANAGER" ->
                    ordersDTO = shopManagerOrderServiceImp.updateOrderStatus(currentStatus, newStatus, orders);
            default -> throw new RuntimeException("Role not found" + role);
        }
        return ordersDTO;
    }


    public List<OrderItemDTO> getOrdersItems(String authHeader,  Integer ordersId) {
        Integer userID = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userID).getRole().getRoleName();
        return switch (role) {
          case "ROLE_BUYER" -> buyerOrdersServiceImp.getListOrderItems(userID,ordersId);
          case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getListOrderItems(userID,ordersId);
          default -> Collections.emptyList();
        };
    }

}