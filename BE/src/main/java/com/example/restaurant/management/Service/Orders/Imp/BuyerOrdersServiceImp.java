package com.example.restaurant.management.Service.Orders.Imp;

import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.DTO.OsrmResponse;
import com.example.restaurant.management.DTO.ShopDTO;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.*;
import com.example.restaurant.management.Service.Orders.CommonOrdersService;
import com.example.restaurant.management.Service.Orders.OrdersHelper;
import com.example.restaurant.management.Service.Orders.OrdersService;
import com.example.restaurant.management.Service.RoutesService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        Integer buyerID = claims.get("userID", Integer.class);

        User user = userRepository.findUserById(buyerID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Shops shop = shopsRepository.findById(ordersRequest.getShopId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        // Tạo order
        Orders orders = new Orders();
        orders.setUser(user);
        orders.setShop(shop);
        orders.setAddress(ordersRequest.getAddress());
        orders.setNote(ordersRequest.getNote());
        orders.setFromLatitude(ordersRequest.getFromLatitude());
        orders.setFromLongitude(ordersRequest.getFromLongitude());

        ShopDTO shopLocation = shopsRepository.findShopLocationById(ordersRequest.getShopId());

        OsrmResponse routes = routesService.getRoutes(orders.getFromLongitude(), orders.getFromLatitude(), shopLocation.getLongitude(), shopLocation.getLatitude());

        System.out.println(routes);
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
        ordersDTO.setPartnerID(shop.getManager().getId());
        ordersDTO.setPartnerName(orders.getUser().getFullName());

        ordersDTO.setOrderID(orders.getId());
        ordersDTO.setNote(orders.getNote());
        ordersDTO.setAddress(orders.getAddress());
        ordersDTO.setStatus(orderStatusHistory.getStatus().toString());
        OrderStatusHistory currentStatusHistory = orderStatusHistoryRepository.findCurrentStatus(orders.getId());
        ordersDTO.setSubtotal(orders.getSubtotal());
        ordersDTO.setDistance(orders.getDistance());
        ordersDTO.setShippingFee(orders.getShipFee());
        ordersDTO.setTime(currentStatusHistory.getStartTime());
        ordersDTO.setTotalAmount(orders.getTotalAmount());
        ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));

        return ordersDTO;
    }



    @Override
    public OrdersDTO updateOrderStatus(OrderStatusHistory currentStatus, OrdersStatus newStatus, Orders orders) {
        OrdersDTO ordersDTO = new OrdersDTO();
        // nếu stt hiện tại là pending và stt mới là canceled thì cho cập nhật
        if (currentStatus.getStatus().equals(OrdersStatus.PENDING) && newStatus.equals(OrdersStatus.CANCELLED)) {
            ordersHelper.applyNewStatus(orders, currentStatus, newStatus);

            ordersDTO.setPartnerName(orders.getShop().getShopName());
            ordersDTO.setPartnerID(orders.getShop().getManager().getId());

            List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(orders.getId());
            ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));
            ordersDTO.setOrderID(orders.getId());
            ordersDTO.setStatus(newStatus.toString());
        }
        else {
            throw new IllegalStateException("Buyer can only cancel PENDING orders.");
        }
        return ordersDTO;
    }

    public OrdersDTO orderPreview(OrdersRequest ordersRequest) {
        OrdersDTO ordersDTO = new OrdersDTO();
        ordersDTO = ordersHelper.calculateOrderPrice(ordersRequest);
        return ordersDTO;
    }

    @Override
    public Page<OrdersDTO> getOrdersWithPage(Integer userId, int page) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Pageable pageable = PageRequest.of(page, 12);
        Page<OrdersDTO> ordersPage = ordersRepository.findListOrdersByUserId(user.getId(), pageable);
        return ordersPage;
    }

    @Override
    public Page<OrdersDTO> getOrdersByStatus( Integer userId, OrdersStatus status, int page) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Pageable pageable = PageRequest.of(page, 12);
        Page<OrdersDTO> ordersPage = ordersRepository.findListOrdersByStatusForBuyer(status,user.getId(), pageable);

        return ordersPage;
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
}
