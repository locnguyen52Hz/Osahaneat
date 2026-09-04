package com.example.restaurant.management.Service.UserSecurity;

import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Enums.Roles;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Security.UserSecurityContext;
import com.example.restaurant.management.Util.JwtHelper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityService {
    @Autowired
    JwtHelper jwtHelper;
    @Autowired
    UserRepository userRepository;

    public UserSecurityContext getUserSecurityContext(String authHeader) {
        Integer userId = jwtHelper.getUserID(authHeader);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Roles role = Roles.valueOf(user.getRole().getRoleName());

        return new UserSecurityContext(userId, role);
    }
}
