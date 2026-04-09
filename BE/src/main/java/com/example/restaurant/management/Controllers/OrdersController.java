package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.OrderItemDTO;
import com.example.restaurant.management.DTO.OrdersDTO;
import com.example.restaurant.management.Entity.OrdersItem;
import com.example.restaurant.management.Enums.OrdersStatus;
import com.example.restaurant.management.Payload.Request.OrdersRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.NotificationService;
import com.example.restaurant.management.Service.Orders.CommonOrdersService;
import com.example.restaurant.management.Service.Orders.Imp.BuyerOrdersServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    public ResponseEntity<?> createOrder(
            @RequestBody OrdersRequest ordersRequest,
            @RequestHeader("Authorization") String authorization,
            Principal principal) { // 👉 inject Principal vào controller

//        System.out.println("📌 Buyer Principal: " + (principal != null ? principal.getName() : "null"));
//        System.out.println("📌 Request body: " + ordersRequest);

        ResponseData responseData = new ResponseData();
        OrdersDTO ordersDTO = buyerOrdersServiceImp.createOrder(ordersRequest, authorization);

        // sau khi tạo order, gửi thông báo cho shop_manager
        System.out.println("📌 ShopManagerId (từ ordersDTO): " + ordersDTO.getPartnerID());

        simpMessagingTemplate.convertAndSendToUser(
                String.valueOf( ordersDTO.getPartnerID()),
                "/queue/notify",
                ordersDTO
        );
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Order created successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("/{orderId}/status/{status}")
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> updateStatusOrder(@RequestHeader("Authorization") String authorization,
                                               @PathVariable OrdersStatus status,
                                               @PathVariable Integer orderId) {
        ResponseData responseData = new ResponseData();
        OrdersDTO ordersDTO = commonOrdersService.updateOrderStatus(authorization, status, orderId);
        notificationService.notifyOrderUpdate(ordersDTO);
        responseData.setData(ordersDTO);
        responseData.setMessage("Order updated successfully");
        responseData.setStatus(HttpStatus.OK.value());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('ROLE_BUYER','ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getOrdersByStatus(@RequestHeader("Authorization") String authorization,
                                               @RequestParam OrdersStatus status,
                                               @RequestParam int page) {
        ResponseData responseData = new ResponseData();
        Page<OrdersDTO> ordersDTO = commonOrdersService.findOrdersByStatus(authorization, status, page);
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
    public ResponseEntity<ResponseData> getOrders(
            @RequestHeader("Authorization") String authorization,
            @RequestParam int page
    ) {
//
        Page<OrdersDTO> ordersDTOS = commonOrdersService.getOrdersWithPage(authorization, page);
        ResponseData responseData = new ResponseData();
        Map<String,Object> map = new HashMap<>();
        map.put("list",ordersDTOS.getContent());
        map.put("totalElement",ordersDTOS.getTotalElements());
        map.put("page",ordersDTOS.getNumber());
        map.put("size",ordersDTOS.getSize());
        map.put("totalPages",ordersDTOS.getTotalPages());
        responseData.setData(map);
//        responseData.setData(ordersDTOS);

        return ResponseEntity.ok(responseData);
    }


    @PostMapping("preview")
    @PreAuthorize("hasAnyRole('ROLE_BUYER')")
    public ResponseEntity<?> getOrdersPrevView(@RequestBody OrdersRequest ordersRequest) {
        ResponseData responseData = new ResponseData();
        OrdersDTO ordersDTO = buyerOrdersServiceImp.orderPreview(ordersRequest);
        responseData.setData(ordersDTO);
        responseData.setSuccess(true);
        responseData.setMessage("Previous orders successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/items")
    @PreAuthorize("hasAnyRole('ROLE_BUYER', 'ROLE_SHOP_MANAGER')")
    public ResponseEntity<?> getOrdersItems(@RequestHeader("Authorization") String authorization, @RequestParam Integer ordersId) {
        ResponseData responseData = new ResponseData();
        List<OrderItemDTO> ordersItemList = commonOrdersService.getOrdersItems(authorization, ordersId);
        responseData.setData(ordersItemList);
        responseData.setSuccess(true);
        responseData.setMessage("Orders items successfully");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }




//    @GetMapping("/filter")
//    @PreAuthorize("hasAnyRole('ROLE_SHOP_MANAGER','ROLE_BUYER')")
//    public ResponseEntity<?> filterOrders(@RequestHeader("Authorization") String authorization, @RequestParam OrdersStatus status) {
//        ResponseData responseData = new ResponseData();
//        List<OrdersDTO> ordersDTOS = ordersService.findOrdersWithFilters(authorization, status);
//        responseData.setData(ordersDTOS);
//        responseData.setSuccess(true);
//        responseData.setMessage("Find orders successfully");
//        responseData.setStatus(HttpStatus.OK.value());
//        return new ResponseEntity<>(responseData, HttpStatus.OK);
//    }


}
