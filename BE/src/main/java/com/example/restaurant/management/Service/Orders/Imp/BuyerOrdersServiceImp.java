package com.example.restaurant.management.Service.Orders.Imp;

import com.example.restaurant.management.DTO.*;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.*;

import com.example.restaurant.management.Service.Orders.OrdersHelper;
import com.example.restaurant.management.Service.Orders.OrdersService;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import java.util.*;


@Service
public class BuyerOrdersServiceImp implements OrdersService {


    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    ShopsRepository shopsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FoodRepository foodRepository;

    @Autowired
    OrdersRepository ordersRepository;

    @Autowired
    OrdersItemRepository ordersItemRepository;

    @Autowired
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    RoutesService routesService;

    @Autowired
    OrdersHelper  ordersHelper;


    public OrdersDTO createOrder(OrdersRequest ordersRequest, String authHeader) {
        // lấy user từ token
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        Integer buyerId = claims.get("userID", Integer.class);

        User user = userRepository.findUserById(buyerId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Shops shop = shopsRepository.findById(ordersRequest.getShopId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        // Tạo order
        Orders orders = new Orders();
        orders.setUser(user);
        orders.setShops(shop);
        orders.setAddress(ordersRequest.getAddress());
        orders.setNote(ordersRequest.getNote());
        orders.setFromLocation(new Location(ordersRequest.getFromLongitude(), ordersRequest.getFromLatitude()));
        orders.setToLocation(new Location(shop.getLongitude(), shop.getLatitude()));
        orders.setCreatedAt(Instant.now());
        orders.setStatus(OrdersStatus.PENDING);


        OsrmResponse routes = routesService.getRoutes(orders.getFromLocation(), orders.getToLocation());


        //set khoảng cách
        double distance = routes.getRoutes().get(0).getDistance();
        orders.setDistance(distance / 1000);
        double shipFee = routesService.calculateShipFee(distance);
        orders.setShipFee(shipFee);

        // set status
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory();
        orderStatusHistory.setStatus(OrdersStatus.PENDING);
        orderStatusHistory.setStartTime(Instant.now());
        orderStatusHistory.setOrder(orders);
        orders.getStatusHistories().add(orderStatusHistory);

        // Map OrderItemRequests -> OrderItems
        List<OrdersItem> ordersItems = ordersRequest.getFoods().stream().map(itemReq -> {
            Food food = foodRepository.findFoodById(itemReq.getFoodId());
            if (food == null) {
                throw new RuntimeException("Food not found");
            }
            OrdersItem ordersItem = new OrdersItem();
            ordersItem.setFood(food);
            ordersItem.setQuantity(itemReq.getQuantity());
            ordersItem.setOrders(orders);

            return ordersItem;
        }).toList();
        orders.setOrderItems(ordersItems);

        // Tính tiền

        double subTotal = 0;
        for (OrdersItem item : ordersItems) {
            double price = item.getFood().getPrice();
            int quantity = item.getQuantity();
            double total = price * quantity;
            subTotal += total;
        }
        orders.setSubtotal(subTotal);
        orders.setTotalAmount(subTotal + shipFee);

        // Lưu order (cascading sẽ tự lưu items nếu entity đã cấu hình CascadeType.ALL)
        ordersRepository.save(orders);

        //Map sang dto
        OrdersDTO ordersDTO = new OrdersDTO();
        ordersDTO.setPartnerId(shop.getManager().getId());
        ordersDTO.setPartnerName(orders.getUser().getFullName());

        ordersDTO.setOrderId(orders.getId());
        ordersDTO.setNote(orders.getNote());
        ordersDTO.setAddress(orders.getAddress());
        ordersDTO.setStatus(orderStatusHistory.getStatus().toString());
        OrderStatusHistory currentStatusHistory = orderStatusHistoryRepository.findCurrentStatus(orders.getId());
        ordersDTO.setSubtotal(orders.getSubtotal());
        ordersDTO.setDistance(orders.getDistance());
        ordersDTO.setShippingFee(orders.getShipFee());
        ordersDTO.setCreatedAt(orders.getCreatedAt());
        ordersDTO.setTotalAmount(orders.getTotalAmount());
        ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));

        return ordersDTO;
    }


    @Override
    @Transactional
    public OrdersDTO updateOrderStatus(OrdersStatus newStatus, Orders orders) {

        OrdersDTO ordersDTO = new OrdersDTO();

        // 1. Lấy current status trong transaction
        OrderStatusHistory currentStatus = orderStatusHistoryRepository.findCurrentStatus(orders.getId());

        // 2. Validate
        if (currentStatus.getStatus().equals(OrdersStatus.PENDING)
            && newStatus.equals(OrdersStatus.CANCELLED)) {

            // 3. Apply change (chỉ modify memory)
            ordersHelper.applyNewStatus(orders, currentStatus, newStatus);

            //  4. SAVE
            orders.setStatus(newStatus);
            ordersRepository.save(orders);

            // 5. Build DTO
            ordersDTO.setPartnerName(orders.getShops().getShopName());
            ordersDTO.setPartnerId(orders.getShops().getManager().getId());

            List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(orders.getId());

            ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));
            ordersDTO.setOrderId(orders.getId());
            ordersDTO.setStatus(newStatus.toString());

        } else {
            throw new IllegalStateException("Update failed");
        }

        return ordersDTO;
    }

    public OrdersDTO getShippingFee(OrdersRequest ordersRequest) {
        OrdersDTO ordersDTO;
        ordersDTO = ordersHelper.calculateOrderPrice(ordersRequest);
        return ordersDTO;
    }


    @Override
    public Page<OrdersDTO> getOrdersWithPage(Integer userId, int page, int pageSize) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Pageable pageable = PageRequest.of(page, pageSize);
        return ordersRepository.findListOrdersByUserId(user.getId(), pageable);
    }





    @Override
    public List<OrderItemDTO> getListOrderItems(Integer userId, Integer orderId) {
        Orders orders = ordersRepository.findOrdersByIdAndUserId(orderId, userId);
        if (orders == null) {
            throw new RuntimeException("Orders not found");
        }
        List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(orders.getId());
        List<OrderItemDTO> orderItemDTOList = new ArrayList<>();
        for (OrdersItem ordersItem : ordersItems) {
            OrderItemDTO orderItemDTO = new OrderItemDTO();
            orderItemDTO.setName(ordersItem.getFood().getName());
            orderItemDTO.setQuantity(ordersItem.getQuantity());
            orderItemDTO.setFoodId(ordersItem.getFood().getId());
            orderItemDTO.setPrice(ordersItem.getFood().getPrice());
            orderItemDTOList.add(orderItemDTO);

        }
        return orderItemDTOList;
    }

    @Override
    public Page<OrdersDTO> getPreviousOrders( Integer userId,  int page) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Pageable pageable = PageRequest.of(page, 6);
        return ordersRepository.findPreviousOrdersForBuyer(user.getId(), pageable);
    }


    @Override
    public Page<OrderTimeLineDTO> getActiveOrdersWithPage(Integer userId,int page) {
        Pageable pageable = PageRequest.of(page, 3);
        Page<Integer> orderIdPage = ordersRepository.getActiveOrderIdsByUserId(userId, pageable);
        List<Integer> orderIds = orderIdPage.getContent();
        System.out.println(orderIds);

        if (orderIds.isEmpty()) {
            return Page.empty(pageable);
        }

        List<OrderTimeLineRowDTO> rows = ordersRepository.getTimelineRowsByOrderIds(orderIds);

        List<OrderTimeLineDTO> content = ordersHelper.groupOrders(rows);

        return new PageImpl<>(content, pageable, orderIdPage.getTotalElements());
    }

    @Override
    public Page<OrderTimeLineDTO> getPreviousOrdersWithPage(Integer userId, int page) {
        return null;
    }


}
