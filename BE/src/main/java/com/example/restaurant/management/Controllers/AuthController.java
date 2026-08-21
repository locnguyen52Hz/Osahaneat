package com.example.restaurant.management.Controllers;


import com.example.restaurant.management.Payload.Request.LoginRequest;
import com.example.restaurant.management.Payload.ResponseData;
import com.example.restaurant.management.Service.AuthService;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.LoginResponseDto;
import com.example.restaurant.management.dto.RoleDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;


@RestController
@RequestMapping("api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @Autowired
    JwtHelper jwtHelper;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        ResponseData responseData = new ResponseData();
        LoginResponseDto responseDto = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", responseDto.getRefreshToken())
                .httpOnly(true)
                .secure(false) // true : chỉ gửi qua https, http ko đc
                .sameSite("Lax")
                .path("/api/auth/")
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());


        responseData.setSuccess(true);
        responseData.setMessage("Login Success");
        responseData.setData(responseDto);
        responseData.setStatus(HttpStatus.OK.value());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/get-role")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP_MANAGER','BUYER')")
    public ResponseEntity<ResponseData> getRole(@RequestHeader("Authorization") String authorization) {

        ResponseData responseData = new ResponseData();
        RoleDto roleDTO = authService.getRoleByToken(authorization);
        responseData.setSuccess(true);
        responseData.setMessage("Get Role Success");
        responseData.setData(roleDTO);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue("refreshToken") String refreshToken) {
        ResponseData responseData = new ResponseData();
        responseData.setSuccess(true);
        responseData.setData(authService.refresh(refreshToken));
        responseData.setMessage("Refresh Success");
        responseData.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("refreshToken","")
                .path("/api/auth/")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}
