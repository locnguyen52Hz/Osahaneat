package com.example.restaurant.management.Service.ServiceImp;

import com.example.restaurant.management.Entity.Role;
import com.example.restaurant.management.Entity.User;
import com.example.restaurant.management.Excetion.FieldValidationException;
import com.example.restaurant.management.Repository.RolesRepository;
import com.example.restaurant.management.Repository.UserRepository;
import com.example.restaurant.management.Service.AuthService;
import com.example.restaurant.management.Util.JwtHelper;
import com.example.restaurant.management.dto.LoginResponseDto;
import com.example.restaurant.management.dto.RefreshResponseDto;
import com.example.restaurant.management.dto.RoleDto;
import com.example.restaurant.management.dto.UserDto;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImp implements AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RolesRepository rolesRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Override
    public LoginResponseDto login(String email, String password) {
        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new FieldValidationException("email", "Email not found", HttpStatus.NOT_FOUND);
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new FieldValidationException("password", "Password not match", HttpStatus.BAD_REQUEST);
        }
        LoginResponseDto responseDto = new LoginResponseDto();
        UserDto userDto = new UserDto();
        String accessToken = jwtHelper.generateAccessToken(user.getEmail(), user.getFullName(), user.getId());
        String refreshToken = jwtHelper.generateRefreshToken(user.getId());
        responseDto.setAccessToken(accessToken);
        responseDto.setRefreshToken(refreshToken);
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        responseDto.setUser(userDto);

        return responseDto;
    }

    @Override
    public RoleDto getRoleByToken(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {

            String token = authorization.substring(7);
            Claims claims = jwtHelper.getClaimsFromToken(token);
            String email = claims.getSubject();

            System.out.println("email: " + email);
            User user = userRepository.findUserByEmail(email);
            Role role = user.getRole();
            RoleDto roleDTO = new RoleDto();
            roleDTO.setRoleName(role.getRoleName());
            roleDTO.setDescription(role.getDescription());

            return roleDTO;
        }
        return null;
    }

    @Override
    public RefreshResponseDto refresh(String refreshToken) {
        if ((refreshToken == null) || refreshToken.isBlank()) {
            throw new FieldValidationException("refreshToken", "Refresh token is required", HttpStatus.BAD_REQUEST);
        }
        Claims claims = jwtHelper.getClaimsFromToken(refreshToken);

        String type = claims.get("type", String.class);

        if (type == null || !type.equals("refresh")) {
            throw new FieldValidationException("refreshToken", "Invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        Integer userId = jwtHelper.getUserIdFromRefreshToken(refreshToken);

        User user = userRepository.findById(userId).orElseThrow(()
                -> new FieldValidationException("refreshToken", "user not found", HttpStatus.BAD_REQUEST));

        RefreshResponseDto refreshResponseDto = new RefreshResponseDto();
        UserDto userDto = new UserDto();
        refreshResponseDto.setAccessToken(jwtHelper.generateAccessToken(user.getEmail(), user.getFullName(), user.getId()));
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        userDto.setRole(user.getRole().getRoleName());
        refreshResponseDto.setUser(userDto);

        return refreshResponseDto;
    }


}
