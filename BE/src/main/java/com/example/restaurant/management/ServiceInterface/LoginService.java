package com.example.restaurant.management.ServiceInterface;

import com.example.restaurant.management.DTO.RoleDTO;
import com.example.restaurant.management.DTO.UserDTO;

public interface LoginService {
    UserDTO login(String email, String password);
    RoleDTO getRoleByToken(String token );

}
