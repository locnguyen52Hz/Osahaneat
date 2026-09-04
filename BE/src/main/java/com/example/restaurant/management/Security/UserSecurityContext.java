package com.example.restaurant.management.Security;

import com.example.restaurant.management.Enums.Roles;


public record UserSecurityContext(Integer userId, Roles role) {

}
