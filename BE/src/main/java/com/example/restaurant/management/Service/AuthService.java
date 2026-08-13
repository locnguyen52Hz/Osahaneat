package com.example.restaurant.management.Service;

import com.example.restaurant.management.dto.LoginResponseDto;
import com.example.restaurant.management.dto.RefreshResponseDto;
import com.example.restaurant.management.dto.RoleDto;

public interface AuthService {
    LoginResponseDto login(String email, String password);
    RoleDto getRoleByToken(String token );
    RefreshResponseDto refresh(String refreshToken);

}
