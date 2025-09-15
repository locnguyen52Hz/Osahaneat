package com.example.restaurant.management.ServiceInterface.ServiceImp;


import com.example.restaurant.management.DTO.UserDTO;

import com.example.restaurant.management.Entity.User;

import com.example.restaurant.management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserServiceImp implements com.example.restaurant.management.ServiceInterface.UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setEmail(user.getEmail());
            userDTO.setFullName(user.getFullName());
            userDTO.setRole(user.getRole().toString());
            userDTO.setPassword(passwordEncoder.encode(user.getPassword()));
            userDTOs.add(userDTO);
        }
        return userDTOs;
    }
}
