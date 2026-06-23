package com.example.restaurant.management.Service.ServiceImp;


import com.example.restaurant.management.dto.UserDto;

import com.example.restaurant.management.Entity.User;

import com.example.restaurant.management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserServiceImp implements com.example.restaurant.management.Service.UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        for (User user : users) {
            UserDto userDTO = new UserDto();
            userDTO.setId(user.getId());
            userDTO.setEmail(user.getEmail());
            userDTO.setFullName(user.getFullName());
            userDTO.setRole(user.getRole().toString());
            userDTO.setPassword(passwordEncoder.encode(user.getPassword()));
            userDtos.add(userDTO);
        }
        return userDtos;
    }
}
