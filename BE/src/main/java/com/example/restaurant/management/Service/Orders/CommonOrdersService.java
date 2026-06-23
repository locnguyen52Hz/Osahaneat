package com.example.restaurant.management.Service.Orders;
import com.example.restaurant.management.dto.*;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Repository.*;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import com.example.restaurant.management.Service.Orders.Imp.ShopManagerOrderServiceImp;
import com.example.restaurant.management.Util.JwtHelper;
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
        if (!includeTotalQuantity){
            return switch (role) {
                case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getOrdersWithPage(userId, page, pageSize);
                case "ROLE_BUYER" -> buyerOrdersServiceImp.getOrdersWithPage(userId, page, pageSize);
                default -> throw new RuntimeException("Role not authorized to access categories");
            };
        }
        else {
           return shopManagerOrderServiceImp.getOrdersWithTotalQuantity(userId, page, pageSize);
        }

    }


    public Page<OrderTimeLineDto> getActiveOrders(String authHeader , int page){
        Integer userId = jwtHelper.getUserID(authHeader);
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        String role = user.getRole().getRoleName();
        return switch (role) {
            case "ROLE_BUYER" ->  buyerOrdersServiceImp.getActiveOrdersWithPage(userId, page);
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
            case "ROLE_BUYER" ->  buyerOrdersServiceImp.getPreviousOrders(userId, page);
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
            case "ROLE_BUYER" ->
                    ordersDTO = buyerOrdersServiceImp.updateOrderStatus( newStatus, order);
            case "ROLE_SHOP_MANAGER" ->
                    ordersDTO = shopManagerOrderServiceImp.updateOrderStatus( newStatus, order);
            default -> throw new RuntimeException("Role not found" + role);
        }
        return ordersDTO;
    }


    public List<OrderItemDto> getOrdersItems(String authHeader, Integer orderId) {
        Integer userId = jwtHelper.getUserID(authHeader);
        String role = userRepository.findUserById(userId).getRole().getRoleName();
        return switch (role) {
          case "ROLE_BUYER" -> buyerOrdersServiceImp.getListOrderItems(userId,orderId);
          case "ROLE_SHOP_MANAGER" -> shopManagerOrderServiceImp.getListOrderItems(userId,orderId);
          default -> Collections.emptyList();
        };
    }

}