package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.ServiceInterface.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/orders")
public class OrdersController {

    @Autowired
    OrdersService ordersService;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;


    @PostMapping("/create-orders")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> createOrder(
            @RequestBody OrdersRequest ordersRequest,
            @RequestHeader("Authorization") String authorization,
            Principal principal) { // 👉 inject Principal vào controller

        System.out.println("📌 Buyer Principal: " + (principal != null ? principal.getName() : "null"));
        System.out.println("📌 Request body: " + ordersRequest);

        ResponseData responseData = new ResponseData();
        OrdersDTO ordersDTO = ordersService.createOrder(ordersRequest, authorization);

        // sau khi tạo order, gửi thông báo cho shop_manager
        int shopManagerId = ordersDTO.getShopManagerID();
        System.out.println("📌 ShopManagerId (từ ordersDTO): " + shopManagerId);

        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf(shopManagerId),
                "/queue/notify",
                "New order #" + ordersDTO.getOrderID()
        );

        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Order created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> confirmationOrder(@RequestHeader("Authorization") String authorization){
        ResponseData responseData = new ResponseData();
        List<OrdersDTO> ordersDTO = ordersService.findPendingConfirmationOrdersByBuyer(authorization);
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Order confirmation successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("shop-manager-all-orders")
    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> allOrders(@RequestHeader("Authorization") String authorization){
        ResponseData responseData = new ResponseData();
        List<OrdersDTO> ordersDTOS = ordersService.findAllOrders(authorization);
        responseData.setData(ordersDTOS);
        responseData.setSuccess(true);
        responseData.setMessage("All orders successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


}
