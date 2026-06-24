package com.example.restaurant.management.Service.Orders.Imp;

import com.example.restaurant.management.Payload.Request.*;
import com.example.restaurant.management.dto.*;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
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

    @Autowired
    RatingRepository ratingRepository;

    public OrdersDto buyNow(BuyNowRequest request, String authHeader) {

        OrdersRequest ordersRequest = new OrdersRequest();

        OrdersItemRequest foodRequest = new OrdersItemRequest();
        foodRequest.setFoodId(request.getFoodId());


        if(request.getQuantity() <= 0){
            throw new RuntimeException("Quantity must be greater than 0");
        }
        foodRequest.setQuantity(request.getQuantity());
        ordersRequest.setFoods(List.of(foodRequest));

        Food food = foodRepository.findFoodById(request.getFoodId());

        ordersRequest.setShopId(food.getShop().getId());
        ordersRequest.setAddress(request.getAddress());
        ordersRequest.setNote(request.getNote());
        ordersRequest.setFromLatitude(request.getFromLatitude());
        ordersRequest.setFromLongitude(request.getFromLongitude());

        return createOrder(ordersRequest, authHeader);
    }


    public OrdersDto createOrder(OrdersRequest ordersRequest, String authHeader) {
        // lấy user từ token

        Integer buyerId = jwtHelper.getUserID(authHeader);

        User user = userRepository.findUserById(buyerId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Shop shop = shopsRepository.findById(ordersRequest.getShopId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        // Tạo order
        Order order = new Order();
        order.setUser(user);
        order.setShops(shop);
        order.setAddress(ordersRequest.getAddress());
        order.setNote(ordersRequest.getNote());
        order.setFromLocation(new Location(ordersRequest.getFromLongitude(), ordersRequest.getFromLatitude()));
        order.setToLocation(new Location(shop.getLongitude(), shop.getLatitude()));
        order.setCreatedAt(Instant.now());
        order.setStatus(OrdersStatus.PENDING);


        OsrmResponse routes = routesService.getRoutes(order.getFromLocation(), order.getToLocation());


        //set khoảng cách
        double distance = routes.getRoutes().get(0).getDistance();
        order.setDistance(distance);
        double shipFee = routesService.calculateShipFee(distance);
        order.setShipFee(shipFee);

        // set status
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory();
        orderStatusHistory.setStatus(OrdersStatus.PENDING);
        orderStatusHistory.setStartTime(Instant.now());
        orderStatusHistory.setOrder(order);
        order.getStatusHistories().add(orderStatusHistory);

        // Map OrderItemRequests -> OrderItems
        List<OrdersItem> ordersItems = ordersRequest.getFoods().stream().map(itemReq -> {
            Food food = foodRepository.findFoodById(itemReq.getFoodId());
            if (food == null) {
                throw new RuntimeException("Food not found");
            }
            OrdersItem ordersItem = new OrdersItem();
            ordersItem.setFood(food);
            ordersItem.setQuantity(itemReq.getQuantity());
            ordersItem.setOrder(order);

            return ordersItem;
        }).toList();
        order.setOrderItems(ordersItems);

        // Tính tiền

        double subTotal = 0;
        for (OrdersItem item : ordersItems) {
            double price = item.getFood().getPrice();
            int quantity = item.getQuantity();
            double total = price * quantity;
            subTotal += total;
        }
        order.setSubtotal(subTotal);
        order.setTotalAmount(subTotal + shipFee);

        // Lưu order (cascading sẽ tự lưu items nếu entity đã cấu hình CascadeType.ALL)
        ordersRepository.save(order);

        //Map sang dto
        OrdersDto ordersDTO = new OrdersDto();
        ordersDTO.setPartnerId(shop.getManager().getId());
        ordersDTO.setPartnerName(order.getUser().getFullName());

        ordersDTO.setOrderId(order.getId());
        ordersDTO.setNote(order.getNote());
        ordersDTO.setAddress(order.getAddress());
        ordersDTO.setStatus(orderStatusHistory.getStatus().toString());
        ordersDTO.setSubtotal(order.getSubtotal());
        ordersDTO.setDistance(order.getDistance());
        ordersDTO.setShippingFee(order.getShipFee());
        ordersDTO.setCreatedAt(order.getCreatedAt());
        ordersDTO.setTotalAmount(order.getTotalAmount());
        ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));

        return ordersDTO;
    }


    @Override
    @Transactional
    public OrdersDto updateOrderStatus(OrdersStatus newStatus, Order orders) {

        OrdersDto ordersDTO = new OrdersDto();

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
            ordersDTO.setPartnerName(orders.getShop().getShopName());
            ordersDTO.setPartnerId(orders.getShop().getManager().getId());

            List<OrdersItem> ordersItems = ordersItemRepository.findByOrderId(orders.getId());

            ordersDTO.setFoods(ordersHelper.mapOrderItems(ordersItems));
            ordersDTO.setOrderId(orders.getId());
            ordersDTO.setStatus(newStatus.toString());

        } else {
            throw new IllegalStateException("Update failed");
        }

        return ordersDTO;
    }

    public OrdersDto getShippingFee(OrdersRequest ordersRequest) {
        OrdersDto ordersDTO;
        ordersDTO = ordersHelper.calculateOrderPrice(ordersRequest);
        return ordersDTO;
    }


    @Override
    public Page<OrdersDto> getOrdersWithPage(Integer userId, int page, int pageSize) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Pageable pageable = PageRequest.of(page, pageSize);
        return ordersRepository.findListOrdersByUserId(user.getId(), pageable);
    }





    @Override
    public List<OrderItemDto> getListOrderItems(Integer userId, Integer orderId) {
        Order order = ordersRepository.findOrdersByIdAndUserId(orderId, userId);
        if (order == null) {
            throw new RuntimeException("Orders not found");
        }
        List<OrdersItem> ordersItems = ordersItemRepository.findByOrderId(order.getId());
        List<OrderItemDto> orderItemDtoList = new ArrayList<>();
        for (OrdersItem ordersItem : ordersItems) {
            OrderItemDto orderItemDTO = new OrderItemDto();
            orderItemDTO.setName(ordersItem.getFood().getName());
            orderItemDTO.setQuantity(ordersItem.getQuantity());
            orderItemDTO.setFoodId(ordersItem.getFood().getId());
            orderItemDTO.setPrice(ordersItem.getFood().getPrice());
            orderItemDtoList.add(orderItemDTO);

        }
        return orderItemDtoList;
    }

    @Override
    public Page<OrdersDto> getPreviousOrders(Integer userId, int page) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Pageable pageable = PageRequest.of(page, 9);
        return ordersRepository.findPreviousOrdersForBuyer(user.getId(), pageable);
    }


    @Override
    public Page<OrderTimeLineDto> getActiveOrdersWithPage(Integer userId, int page) {
        Pageable pageable = PageRequest.of(page, 9);
        Page<Integer> orderIdPage = ordersRepository.getActiveOrderIdsByUserId(userId, pageable);
        List<Integer> orderIds = orderIdPage.getContent();
        System.out.println(orderIds);

        if (orderIds.isEmpty()) {
            return Page.empty(pageable);
        }

        List<OrderTimeLineRowDto> rows = ordersRepository.getTimelineRowsByOrderIds(orderIds);

        List<OrderTimeLineDto> content = ordersHelper.groupOrders(rows);

        return new PageImpl<>(content, pageable, orderIdPage.getTotalElements());
    }


    @Transactional
    public Integer createRating(CreateRatingRequest createRatingRequest, String authHeader) {
        Integer userId = jwtHelper.getUserID(authHeader);
        Order orders = ordersRepository.findOrderById(createRatingRequest.getOrderId());

        //validate
        if (orders == null) {
            throw new RuntimeException("Orders not found");
        }
        if(!orders.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to rate this order");
        }
        if (!orders.getStatus().equals(OrdersStatus.COMPLETED)) {
            throw new RuntimeException("You can only rate completed orders");
        }
        if(ratingRepository.existsRatingByOrder_Id(orders.getId())) {
            throw new RuntimeException("You have already rated this order");
        }

        // lấy shop
        Shop shop = shopsRepository.findById(orders.getShop().getId()).orElseThrow(() -> new EntityNotFoundException("Shop not found"));

        // tạo rating
        Rating rating = new Rating();
        rating.setOrder(orders);
        rating.setRating(createRatingRequest.getRating());
        rating.setUser(userRepository.findUserById(userId));
        rating.setShop(shop);
        ratingRepository.save(rating);

        // update shop
        int count = shop.getRatingCount();
        double avg = shop.getRatingAvg();

        double newAvg = (avg * count + createRatingRequest.getRating()) / (count + 1);
        shop.setRatingAvg(newAvg);
        shop.setRatingCount(count + 1);
        Integer orderRating = rating.getRating();

        shopsRepository.save(shop);
        return orderRating;
    }


}
