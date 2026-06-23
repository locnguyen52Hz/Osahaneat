package com.example.restaurant.management.Service;

import com.example.restaurant.management.dto.RoleDto;
import com.example.restaurant.management.dto.UserDto;

public interface LoginService {
    UserDto login(String email, String password);
    RoleDto getRoleByToken(String token );

}
