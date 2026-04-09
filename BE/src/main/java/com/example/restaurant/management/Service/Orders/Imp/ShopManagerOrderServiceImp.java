package com.example.restaurant.management.Service.Orders.Imp;

import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.Orders;
import com.example.restaurant.management.Entity.OrdersItem;
import com.example.restaurant.management.Entity.Shops;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.OrdersItemRepository;
import com.example.restaurant.management.Repository.OrdersRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Orders.OrdersHelper;
import com.example.restaurant.management.Service.Orders.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShopManagerOrderServiceImp implements OrdersService {


    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    OrdersRepository ordersRepository;

    @Autowired
    OrdersItemRepository ordersItemRepository;

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    OrdersHelper ordersHelper;


    @Override
    public OrdersDTO updateOrderStatus(OrderStatusHistory currentStatus, OrdersStatus newStatus, Orders orders) {
        OrdersDTO ordersDTO = new OrdersDTO();

        if (!currentStatus.getStatus().equals(OrdersStatus.CANCELLED) && !currentStatus.getStatus().equals(OrdersStatus.COMPLETED)) {
            ordersHelper.applyNewStatus(orders, currentStatus, newStatus);

            ordersDTO.setPartnerName(orders.getShop().getShopName());
            ordersDTO.setPartnerID(orders.getUser().getId());

            List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(orders.getId());
            ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));
            ordersDTO.setOrderID(orders.getId());
            ordersDTO.setStatus(newStatus.toString());
        } else {
            throw new IllegalStateException("Buyer can only cancel PENDING orders.");
        }
        return ordersDTO;
    }

    @Override
    public Page<OrdersDTO> getOrdersWithPage(Integer userId, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return shopsRepository.findListOrdersByShopsId(userId, pageable);
    }

    @Override
    public Page<OrdersDTO> getOrdersByStatus(Integer userId,OrdersStatus status, int page) {
        Shops shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        Pageable pageable = PageRequest.of(page, 12);
        Page<OrdersDTO> ordersPage = ordersRepository.findOrdersByStatusForShopManager(status, shop.getId(), pageable);

        return ordersPage;
    }

    @Override
    public List<OrderItemDTO> getListOrderItems(Integer userId, Integer orderId) {
        Shops shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        Orders orders = ordersRepository.findOrdersByIdAndShops_Id(orderId, shop.getId());
        if (orders == null) {
            throw new RuntimeException("Orders not found");
        }
        List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(orders.getId());
        List<OrderItemDTO> orderItemDTOS = new ArrayList<>();
        for (OrdersItem ordersItem : ordersItems) {
            OrderItemDTO orderItemDTO = new OrderItemDTO();
            orderItemDTO.setFoodId(ordersItem.getFood().getId());
            orderItemDTO.setName(ordersItem.getFood().getName());
            orderItemDTO.setPrice(ordersItem.getFood().getPrice());
            orderItemDTO.setQuantity(ordersItem.getQuantity());
            orderItemDTOS.add(orderItemDTO);
        }

        return orderItemDTOS;
    }


}
