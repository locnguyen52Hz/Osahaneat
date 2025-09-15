package com.example.restaurant.management.Security;

import com.example.restaurant.management.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        System.out.println("username: "+email);
        com.example.restaurant.management.Entity.User user = userRepository.findUserByEmail(email);
        if(user == null){
            throw new UsernameNotFoundException(email + " " + "not found");
        }
        return new com.example.restaurant.management.Security.CustomUserDetails(user);
    }
}
