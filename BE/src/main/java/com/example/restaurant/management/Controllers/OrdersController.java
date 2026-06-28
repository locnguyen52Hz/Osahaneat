package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.BuyNowRequest;
import com.example.restaurant.management.Payload.Request.CreateOrderFromCartRequest;
import com.example.restaurant.management.Payload.Request.CreateRatingRequest;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.NotificationService;
import com.example.restaurant.management.Service.Orders.CommonOrdersService;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import com.example.restaurant.management.dto.OrderItemDto;
import com.example.restaurant.management.dto.OrderTimeLineDto;
import com.example.restaurant.management.dto.OrdersDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/orders")
public class OrdersController {

    @Autowired
    CommonOrdersService commonOrdersService;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    NotificationService notificationService;

    @Autowired
    BuyerOrdersServiceImp buyerOrdersServiceImp;

    @PostMapping("/create-orders")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> createOrder(@RequestBody OrdersRequest ordersRequest, @RequestHeader("Authorization") String authorization) {

        ResponseData responseData = new ResponseData();
        OrdersDto ordersDTO = buyerOrdersServiceImp.createOrder(ordersRequest, authorization);

        // sau khi tạo order, gửi thông báo cho shop_manager
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(ordersDTO.getPartnerId()), "/queue/notify", ordersDTO);
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Order created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/buy-now")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> buyNowOrder(@RequestBody BuyNowRequest buyNowRequest, @RequestHeader("Authorization") String authorization) {
        ResponseData responseData = new ResponseData();
        OrdersDto ordersDto = buyerOrdersServiceImp.buyNow(buyNowRequest, authorization);

        simpMessagingTemplate.convertAndSendToUser(String.valueOf(ordersDto.getPartnerId()), "/queue/notify", ordersDto);

        responseData.setData(ordersDto);
        responseData.setSuccess(true);
        responseData.setMessage("Order created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/from-cart")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> createOrderFromCart(@RequestBody CreateOrderFromCartRequest ordersRequest, @RequestHeader("Authorization") String authorization) {
        ResponseData responseData = new ResponseData();
        OrdersDto ordersDTO = buyerOrdersServiceImp.createOrderFromCart(ordersRequest, authorization);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(ordersDTO.getPartnerId()), "/queue/notify", ordersDTO);
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Order created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("/{orderId}/status/{status}")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> updateStatusOrder(@RequestHeader("Authorization") String authorization, @PathVariable OrdersStatus status, @PathVariable Integer orderId) {
        ResponseData responseData = new ResponseData();
        OrdersDto ordersDTO = commonOrdersService.updateOrderStatus(authorization, status, orderId);
        notificationService.notifyOrderUpdate(ordersDTO);
        responseData.setData(ordersDTO);
        responseData.setMessage("Order updated successfully");
        responseData.setStatus(HttpStatus.OK.value());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/previous")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getOrdersByStatus(@RequestHeader("Authorization") String authorization, @RequestParam int page) {
        ResponseData responseData = new ResponseData();
        Page<OrdersDto> ordersDTO = commonOrdersService.getPreviousOrders(authorization, page);
        Map<String, Object> map = new HashMap<>();
        map.put("list", ordersDTO.getContent());
        map.put("totalElement", ordersDTO.getTotalElements());
        map.put("page", ordersDTO.getNumber());
        map.put("size", ordersDTO.getSize());
        map.put("totalPages", ordersDTO.getTotalPages());
        responseData.setData(map);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER','ROLE_BUYER')")
    public ResponseEntity<ResponseData> getOrders(@RequestHeader("Authorization") String authorization, @RequestParam int page, @RequestParam(required = false, defaultValue = "10") int pageSize, @RequestParam(required = false, defaultValue = "false") boolean includeTotalQuantity) {

        Page<OrdersDto> ordersDTOS = commonOrdersService.getOrders(authorization, page, pageSize, includeTotalQuantity);
        ResponseData responseData = new ResponseData();
        Map<String, Object> map = new HashMap<>();
        map.put("list", ordersDTOS.getContent());
        map.put("totalElement", ordersDTOS.getTotalElements());
        map.put("page", ordersDTOS.getNumber());
        map.put("size", ordersDTOS.getSize());
        map.put("totalPages", ordersDTOS.getTotalPages());
        responseData.setData(map);
        responseData.setSuccess(true);
//        responseData.setData(ordersDTOS);

        return ResponseEntity.ok(responseData);
    }


    @PostMapping("shipping-fee")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getShippingFee(@RequestBody OrdersRequest ordersRequest) {
        ResponseData responseData = new ResponseData();
        OrdersDto ordersDTO = buyerOrdersServiceImp.getShippingFee(ordersRequest);
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Previous orders successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/items")
    @PreAuthorize("hasAnyRole('ROLE_BUYER', 'ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getOrdersItems(@RequestHeader("Authorization") String authorization, @RequestParam Integer orderId) {
        ResponseData responseData = new ResponseData();
        List<OrderItemDto> ordersItemList = commonOrdersService.getOrdersItems(authorization, orderId);
        responseData.setData(ordersItemList);
        responseData.setSuccess(true);
        responseData.setMessage("Orders items successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @GetMapping("/active")
    public ResponseEntity<?> getActiveOrders(@RequestHeader("Authorization") String authorization, int page) {
        Page<OrderTimeLineDto> result = commonOrdersService.getActiveOrders(authorization, page);
        ResponseData responseData = new ResponseData();
        Map<String, Object> map = new HashMap<>();
        map.put("list", result.getContent());
        map.put("totalElement", result.getTotalElements());
        map.put("page", result.getNumber());
        map.put("size", result.getSize());
        map.put("totalPages", result.getTotalPages());
        responseData.setData(map);
        responseData.setSuccess(true);
        responseData.setMessage("Active orders successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/create-rating")
    public ResponseEntity<?> createRating(@RequestBody CreateRatingRequest createRatingRequest, @RequestHeader("Authorization") String authorization) {
        ResponseData responseData = new ResponseData();
        responseData.setData(buyerOrdersServiceImp.createRating(createRatingRequest, authorization));
        responseData.setSuccess(true);
        responseData.setMessage("Rating created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());

        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }


}
