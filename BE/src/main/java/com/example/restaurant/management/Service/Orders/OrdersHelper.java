package com.example.restaurant.management.Service.Orders;

import com.example.restaurant.management.dto.*;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersItemRequest;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.FoodRepository;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.OrdersRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.RoutesService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrdersHelper {

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    FoodRepository foodRepository;

    @Autowired
    RoutesService routesService;

    @Autowired
    OrdersRepository ordersRepository;

    public OrdersDto orderPreview(OrdersRequest ordersRequest) {
        OrdersDto ordersDTO;
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


    public void applyNewStatus(Order order,
                               OrderStatusHistory currentStatus,
                               OrdersStatus newStatus) {
        Instant now = Instant.now();

        // 1. End current status
        currentStatus.setEndTime(now);

        // 2. Create a new status
        OrderStatusHistory newStatusHistory = new OrderStatusHistory();
        newStatusHistory.setStatus(newStatus);
        newStatusHistory.setStartTime(now);
        newStatusHistory.setOrder(order);

        // 3. Add vào collection
        order.getStatusHistories().add(newStatusHistory);
    }

    public List<OrderItemDto> mapOrderItems(List<OrdersItem> ordersItems) {
        return ordersItems.stream()
                .map(item -> {
                    OrderItemDto dto = new OrderItemDto();
                    dto.setFoodId(item.getFood().getId());
                    dto.setName(item.getFood().getName());
                    dto.setQuantity(item.getQuantity());
                    dto.setPrice(item.getFood().getPrice());
                    return dto;
                })
                .toList();
    }

    public OrdersDto calculateOrderPrice(OrdersRequest ordersRequest) {
        //lấy thông tin shop
        Shop shop = shopsRepository.findById(ordersRequest.getShopId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        //tính giá món
        double subtotal = 0;

        for (OrdersItemRequest item : ordersRequest.getFoods()) {
            Food food = foodRepository.findFoodById(item.getFoodId());
            if (food == null) {
                throw new RuntimeException("Food not found");
            }
            double itemTotal = food.getPrice() * item.getQuantity();
            subtotal = subtotal + itemTotal;
        }
        OrdersDto ordersDTO = new OrdersDto();
        ordersDTO.setSubtotal(subtotal);
        double shippingFee = routesService.getShippingFee(ordersRequest.getFromLongitude(), ordersRequest.getFromLatitude(), shop.getId());
        ordersDTO.setShippingFee(shippingFee);
        ordersDTO.setTotalAmount(shippingFee + subtotal);

        return ordersDTO;
    }

    public List<OrderTimeLineDto> groupOrders(List<OrderTimeLineRowDto> rows) {
        Map<Integer, OrderTimeLineDto> map = new LinkedHashMap<>();

        for (OrderTimeLineRowDto row : rows) {
            OrderTimeLineDto order = map.computeIfAbsent(
                    row.getOrderId(),
                    id -> {
                        OrderTimeLineDto dto = new OrderTimeLineDto();
                        dto.setOrderId(row.getOrderId());
                        dto.setUserId(row.getUserId());
                        dto.setTotalAmount(row.getTotalAmount());
                        dto.setShippingFee(row.getShippingFee());
                        dto.setSubtotal(row.getSubtotal());
                        dto.setDistance(row.getDistance());
                        dto.setNote(row.getNote());
                        dto.setAddress(row.getAddress());
                        dto.setShopName(row.getShopName());
                        dto.setShopAddress(row.getShopAddress());
                        dto.setShopId(row.getShopId());
                        dto.setCreatedAt(row.getCreatedAt());
                        dto.setFromLocation(row.getFromLocation());
                        dto.setToLocation(row.getToLocation());
                        dto.setStatus(row.getCurrentStatus());
                        return dto;
                    }
            );
            order.getStatuses().add(new StatusDto(
                            row.getOhsStatus(),
                            row.getStartTime(),
                            row.getEndTime()
                    )
            );
        }

        return new ArrayList<>(map.values());
    }

}
