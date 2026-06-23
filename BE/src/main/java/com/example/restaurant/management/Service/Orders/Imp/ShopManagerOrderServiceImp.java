package com.example.restaurant.management.Service.Orders.Imp;

import com.example.restaurant.management.dto.OrderItemDto;
import com.example.restaurant.management.dto.OrderTimeLineDto;

import com.example.restaurant.management.dto.OrdersDto;
import com.example.restaurant.management.Entity.OrderStatusHistory;
import com.example.restaurant.management.Entity.Order;
import com.example.restaurant.management.Entity.OrdersItem;
import com.example.restaurant.management.Entity.Shop;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Repository.OrderStatusHistoryRepository;
import com.example.restaurant.management.Repository.OrdersItemRepository;
import com.example.restaurant.management.Repository.OrdersRepository;
import com.example.restaurant.management.Repository.ShopsRepository;
import com.example.restaurant.management.Service.Orders.OrdersHelper;
import com.example.restaurant.management.Service.Orders.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
    @Transactional
    public OrdersDto updateOrderStatus(OrdersStatus newStatus, Order orders) {
        OrdersDto ordersDTO = new OrdersDto();

        // 1. lấy current status
        OrderStatusHistory currentStatus = orderStatusHistoryRepository.findCurrentStatus(orders.getId());


        // 2. validate
        if (!currentStatus.getStatus().equals(OrdersStatus.CANCELLED) && !currentStatus.getStatus().equals(OrdersStatus.COMPLETED)) {
            ordersHelper.applyNewStatus(orders, currentStatus, newStatus);

            //3. save
            orders.setStatus(newStatus);
            ordersRepository.save(orders);

            // build dot
            ordersDTO.setPartnerName(orders.getShop().getShopName());
            ordersDTO.setPartnerId(orders.getUser().getId());

            List<OrdersItem> ordersItems = ordersItemRepository.findByOrderId(orders.getId());
            ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));
            ordersDTO.setOrderId(orders.getId());
            ordersDTO.setStatus(newStatus.toString());
        } else {
            throw new IllegalStateException("Update failed");
        }
        return ordersDTO;
    }

    @Override
    public Page<OrdersDto> getOrdersWithPage(Integer userId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return ordersRepository.findListOrdersByShopsId(userId, pageable);
    }


    public Page<OrdersDto> getOrdersWithTotalQuantity(Integer userId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return ordersRepository.findOrdersWithQuantity(userId,pageable);
    }

    @Override
    public Page<OrdersDto> getPreviousOrders(Integer userId, int page) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        Pageable pageable = PageRequest.of(page, 10);
        Page<OrdersDto> ordersPage = ordersRepository.findPreviousOrdersForShopManager( shop.getId(), pageable);

        return ordersPage;
    }

    @Override
    public List<OrderItemDto> getListOrderItems(Integer userId, Integer orderId) {
        Shop shop = shopsRepository.findShopsByManager_Id(userId);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        Order order = ordersRepository.findOrdersByIdAndShop_Id(orderId, shop.getId());
        if (order == null) {
            throw new RuntimeException("Orders not found");
        }
        List<OrdersItem> ordersItems = ordersItemRepository.findByOrderId(order.getId());
        List<OrderItemDto> orderItemDtos = new ArrayList<>();
        for (OrdersItem ordersItem : ordersItems) {
            OrderItemDto orderItemDTO = new OrderItemDto();
            orderItemDTO.setFoodId(ordersItem.getFood().getId());
            orderItemDTO.setName(ordersItem.getFood().getName());
            orderItemDTO.setPrice(ordersItem.getFood().getPrice());
            orderItemDTO.setQuantity(ordersItem.getQuantity());
            orderItemDtos.add(orderItemDTO);
        }
        return orderItemDtos;
    }


    @Override
    public Page<OrderTimeLineDto> getActiveOrdersWithPage(Integer userId, int page) {
        return Page.empty();
    }


}
