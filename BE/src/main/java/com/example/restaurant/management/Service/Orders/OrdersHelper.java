package com.example.restaurant.management.Service.Orders;

import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersItemRequest;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.RoutesService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdersHelper {

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    ShopsRepository  shopsRepository;

    @Autowired
    FoodRepository  foodRepository;

    @Autowired
    RoutesService routesService;

    public OrdersDTO orderPreview(OrdersRequest ordersRequest) {
        OrdersDTO ordersDTO = new OrdersDTO();
        ordersDTO = calculateOrderPrice(ordersRequest);
        return ordersDTO;
    }

    private boolean isValidStatus(OrdersStatus newStatus, OrdersStatus currentStatus) {
        return switch (currentStatus) {
            case PENDING -> newStatus.equals(OrdersStatus.PROCESSING) || newStatus.equals(OrdersStatus.CANCELLED);
            case PROCESSING -> newStatus.equals(OrdersStatus.SHIPPING) || newStatus.equals(OrdersStatus.CANCELLED);
            case SHIPPING -> newStatus.equals(OrdersStatus.COMPLETED) || newStatus.equals(OrdersStatus.CANCELLED);
            case COMPLETED, CANCELLED -> false;
        };
    }


    public void applyNewStatus(Orders orders, OrderStatusHistory currentStatus, OrdersStatus newStatus) {
        // kết thúc trạng thái cũ
        currentStatus.setEndTime(Instant.now());
        orderStatusHistoryRepository.save(currentStatus);

        // tạo trạng thái mới
        OrderStatusHistory newStatusHistory = new OrderStatusHistory();
        newStatusHistory.setStatus(newStatus);
        newStatusHistory.setStartTime(Instant.now());
        newStatusHistory.setOrder(orders);
        orderStatusHistoryRepository.save(newStatusHistory);
    }

    public List<OrderItemDTO> mapOrderItems(List<OrdersItem> ordersItems) {
        return ordersItems.stream()
                .map(item -> {
                    OrderItemDTO dto = new OrderItemDTO();
                    dto.setFoodId(item.getFood().getId());
                    dto.setName(item.getFood().getName());
                    dto.setQuantity(item.getQuantity());
                    dto.setPrice(item.getFood().getPrice());
                    return dto;
                })
                .toList();
    }

    public OrdersDTO calculateOrderPrice(OrdersRequest ordersRequest) {
        //lấy thông tin shop
        Shops shop = shopsRepository.findById(ordersRequest.getShopId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        //tính giá món
        List<OrdersItem> items = new ArrayList<>();
        double subtotal = 0;

        for (OrdersItemRequest item: ordersRequest.getFoods() ){
            Food food = foodRepository.findFoodById(item.getFoodId());
            if (food == null) {
                throw new RuntimeException("Food not found");
            }
            double itemTotal = food.getPrice()*item.getQuantity();
            subtotal = subtotal + itemTotal;
        }
        OrdersDTO ordersDTO = new OrdersDTO();
        ordersDTO.setSubtotal(subtotal);
        double shippingFee = routesService.getShippingFee(shop.getLongitude(), shop.getLatitude(), ordersRequest.getShopId());
        ordersDTO.setShippingFee(shippingFee);
        ordersDTO.setTotalAmount(shippingFee + subtotal);

        return ordersDTO;
    }

}
