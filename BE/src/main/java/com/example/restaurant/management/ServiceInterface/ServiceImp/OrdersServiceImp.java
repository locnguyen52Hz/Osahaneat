package com.example.restaurant.management.ServiceInterface.ServiceImp;

import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.*;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersItemRequest;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Repository.*;
import com.example.restaurant.management.ServiceInterface.OrdersService;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Service
public class OrdersServiceImp implements OrdersService {

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


    @Override
    public OrdersDTO createOrder(OrdersRequest ordersRequest, String authHeader) {
        // lấy user từ token
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        Integer buyerID = claims.get("userID",Integer.class);

        User user = userRepository.findUserById(buyerID);
        if (user == null) {
            throw  new RuntimeException("User not found");
        }

        Shops shop = shopsRepository.findShopsById(ordersRequest.getShopId());
        if(shop==null){
            throw new RuntimeException("Shop not found");
        }

        // Tạo order
        Orders orders = new Orders();

        orders.setUser(user);
        orders.setShop(shop);
        orders.setAddress(ordersRequest.getAddress());
        orders.setNote(ordersRequest.getNote());
        orders.setLatitude(ordersRequest.getLatitude());
        orders.setLongitude(ordersRequest.getLongitude());
        orders.setCreatedDate(LocalDateTime.now());
        orders.setOrdersStatus(OrdersStatus.PENDING);


        System.out.println(orders);

        // Map OrderItemRequests -> OrderItems
        List<OrdersItem> ordersItems = ordersRequest.getOrdersItemRequests().stream().map(itemReq -> {
            Food food = foodRepository.findFoodById(itemReq.getFoodId());
            if(food==null){
                throw new RuntimeException("Food not found");
            }
            OrdersItem ordersItem = new OrdersItem();
            ordersItem.setFood(food);
            ordersItem.setQuantity(itemReq.getQuantity());
            ordersItem.setOrders(orders);

            return ordersItem;
        }).toList();


        // Tính tổng tiền
        orders.setOrderItems(ordersItems);
        double tatolAmount = 0;
        for (OrdersItem item : ordersItems) {
            double price = item.getFood().getPrice();
            int quantity = item.getQuantity();
            double total = price * quantity;
            tatolAmount += total;
        }
        orders.setTotalAmount(tatolAmount);


        // Lưu order (cascading sẽ tự lưu items nếu entity đã cấu hình CascadeType.ALL)
        Orders savedOrder = ordersRepository.save(orders);

        //Map sang dto
        OrdersDTO ordersDTO = new OrdersDTO();
        ordersDTO.setOrderID(savedOrder.getId());
        ordersDTO.setStatus(savedOrder.getOrdersStatus().toString());
        ordersDTO.setTotalAmount(savedOrder.getTotalAmount());
        ordersDTO.setNote(savedOrder.getNote());
        ordersDTO.setCreatedDate(savedOrder.getCreatedDate());
        ordersDTO.setShopID(savedOrder.getShop().getId());
        ordersDTO.setBuyerName(orders.getUser().getFullName());
        ordersDTO.setShopName(orders.getShop().getShopName());
        ordersDTO.setBuyerID(orders.getUser().getId());
        ordersDTO.setAddress(orders.getAddress());



        //map danh sách món ăn
        List<OrderItemDTO> items = savedOrder.getOrderItems().stream().map(item -> {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setFoodID(item.getFood().getId());
            dto.setFoodName(item.getFood().getFoodName());
            dto.setQuantity(item.getQuantity());
            dto.setPrice(item.getFood().getPrice());
            return dto;
        }).toList();
        ordersDTO.setOrderItemDTOList(items);
        return ordersDTO;
    }

    @Override
    public List<OrdersDTO> findAllOrders(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        //lấy shop manager id từ token
        Integer shopManagerID = claims.get("userID",Integer.class);
        if (shopManagerID == null) {
            throw new RuntimeException("User not found");
        }
        //tìm shop mà shop manager đang phụ trách
        Shops shop = shopsRepository.findShopByUserId(shopManagerID);
        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }
        //lấy orders từ shopId
        List<Orders> orders = ordersRepository.findAllByShopId(shop.getId());
        if (orders.isEmpty()) {
            throw new RuntimeException("Orders not found");
        }
        List<OrdersDTO> ordersDTOs = new ArrayList<>();
        for (Orders order : orders) {
            OrdersDTO ordersDTO = new OrdersDTO();
            ordersDTO.setOrderID(order.getId());
            ordersDTO.setStatus(order.getOrdersStatus().toString());
            ordersDTO.setTotalAmount(order.getTotalAmount());
            ordersDTO.setNote(order.getNote());
            ordersDTO.setCreatedDate(order.getCreatedDate());
            ordersDTO.setAddress(order.getAddress());
            ordersDTO.setBuyerName(order.getUser().getFullName());

            //lấy các ordersItem theo orders hiện tại
            List<OrdersItem> ordersItems = ordersItemRepository.findByOrdersId(order.getId());

            //convert sang DTO
            List<OrderItemDTO> orderItemDTOs = ordersItems.stream()
                    .map(item -> {
                        OrderItemDTO dto = new OrderItemDTO();
                        dto.setFoodID(item.getFood().getId());
                        dto.setFoodName(item.getFood().getFoodName());
                        dto.setQuantity(item.getQuantity());
                        dto.setPrice(item.getFood().getPrice()); // ✅ set price
                        return dto;
                    })
                    .toList();
            ordersDTO.setOrderItemDTOList(orderItemDTOs);
            ordersDTOs.add(ordersDTO);
        }

        return ordersDTOs;
    }

    @Override
    public List<OrdersDTO> findPendingConfirmationOrdersByBuyer(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtHelper.getClaimsFromToken(token);
        Integer buyerID = claims.get("userID",Integer.class);

        if (buyerID == null) {
            throw new RuntimeException("User not found");
        }
        List<Orders> orders = ordersRepository.findPendingConfirmationOrders(buyerID);
        if (orders.isEmpty()) {
            throw new RuntimeException("Orders not found");
        }

        List<OrdersDTO> ordersDTOs = new ArrayList<>();
        for (Orders order : orders) {
            OrdersDTO ordersDTO = new OrdersDTO();
            ordersDTO.setOrderID(order.getId());
            ordersDTO.setStatus(order.getOrdersStatus().toString());
            ordersDTO.setTotalAmount(order.getTotalAmount());
            ordersDTO.setNote(order.getNote());
            ordersDTO.setCreatedDate(order.getCreatedDate());
            ordersDTO.setShopID(order.getShop().getId());
            ordersDTO.setShopName(order.getShop().getShopName());
            ordersDTO.setAddress(order.getAddress());
            ordersDTO.setCreatedDate(order.getCreatedDate());
            ordersDTOs.add(ordersDTO);
        }

        return ordersDTOs;
    }
}
