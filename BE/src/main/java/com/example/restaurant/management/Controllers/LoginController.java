package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.DTO.RoleDTO;
import com.example.restaurant.management.DTO.UserDTO;
import com.example.restaurant.management.Payload.Request.LoginRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.LoginService;
import com.example.restaurant.management.Util.JwtHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/auth")
public class LoginController {
    @Autowired
    LoginService loginService;

    @Autowired
    JwtHelper jwtHelper;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(@RequestBody LoginRequest loginRequest) {
        ResponseData responseData = new ResponseData();

        UserDTO userDTO = loginService.login(loginRequest.getEmail(), loginRequest.getPassword());

        String token = jwtHelper.generateToken(userDTO.getEmail(), userDTO.getFullName(), userDTO.getId());
        responseData.setToken(token);
        responseData.setSuccess(true);
        responseData.setMessage("Login Success");
        responseData.setData(userDTO.getFullName());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/get-role")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP_MANAGER','BUYER')")
    public ResponseEntity<ResponseData> getRole(@RequestHeader("Authorization") String authorization) {

        ResponseData responseData = new ResponseData();
        RoleDTO roleDTO = loginService.getRoleByToken(authorization);
        responseData.setSuccess(true);
        responseData.setMessage("Get Role Success");
        responseData.setData(roleDTO);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
