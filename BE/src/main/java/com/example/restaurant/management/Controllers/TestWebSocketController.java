package com.example.restaurant.management.Controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class TestWebSocketController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(Principal principal, String message) {
        System.out.println("📌 User gửi: " + principal.getName());
        return "Hello " + principal.getName() + ", bạn gửi: " + message;
    }
}
