package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.DTO.RoleDTO;
import com.example.restaurant.management.DTO.UserDTO;
import com.example.restaurant.management.Entity.Roles;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Repository.RolesRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class LoginServiceImp implements com.example.restaurant.management.Service.LoginService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RolesRepository rolesRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Override
    public UserDTO login(String email, String password) {
        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new FieldValidationException("email","Email not found", HttpStatus.NOT_FOUND);
        }
        if(!passwordEncoder.matches(password,user.getPassword())) {
            throw new FieldValidationException("password","Password not match", HttpStatus.BAD_REQUEST);
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(user.getFullName());
        userDTO.setPassword(passwordEncoder.encode(password));
        userDTO.setId(user.getId());
        userDTO.setEmail(email);

        return userDTO;
    }

    @Override
    public RoleDTO getRoleByToken(String authorization) {
        if(authorization != null && authorization.startsWith("Bearer ")) {

            String token = authorization.substring(7);
            Claims claims = jwtHelper.getClaimsFromToken(token);
            String email = claims.getSubject();

            System.out.println("email: " + email);
            User user = userRepository.findUserByEmail(email);
            Roles roles = user.getRole();
            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setRoleName(roles.getRoleName());
            roleDTO.setDescription(roles.getDescription());

            return roleDTO;
        }
        return null;
    }


}
