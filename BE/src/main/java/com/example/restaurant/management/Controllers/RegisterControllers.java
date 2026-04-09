package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.Payload.Request.RegisterRequest;
import com.example.restaurant.management.Payload.Request.ShopManagerRegister;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth/register")
public class RegisterControllers {

    @Autowired
    RegisterService registerService;

    @PostMapping(value = "/buyer", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerBuyer(@Valid @RequestBody RegisterRequest registerRequest){
        ResponseData responseData = new ResponseData();
        registerService.registerBuyer(registerRequest);
        responseData.setSuccess(responseData.isSuccess());
        responseData.setMessage("Registered Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PostMapping(value = "/shop-manager",consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerShopManager(@Valid @RequestBody ShopManagerRegister shopManagerRegister){
        ResponseData responseData = new ResponseData();
        registerService.registerShopManager(shopManagerRegister);
        responseData.setSuccess(true);
        responseData.setMessage("Registered Successfully");
        responseData.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
}
