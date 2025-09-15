package com.example.restaurant.management.Config;

import com.example.restaurant.management.Util.JwtHelper;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.*;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtHelper jwtHelper;

    public WebSocketConfig(JwtHelper jwtHelper) {
        this.jwtHelper = jwtHelper;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // client subscribe được
        config.setApplicationDestinationPrefixes("/app"); // client gửi lên server
        config.setUserDestinationPrefix("/user"); // cho user riêng
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket")
                .setAllowedOriginPatterns("*"); // dùng WebSocket thuần, không SockJS
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Lấy Authorization header từ connectHeaders
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    System.out.println("🔎 CONNECT FRAME Authorization = " + authHeader);

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);

                        try {
                            if (jwtHelper.validateToken(token)) {
                                String userId = jwtHelper.getClaimsFromToken(token).get("userID").toString();
                                System.out.println("✅ Token OK, userId = " + userId);

                                // Gán Principal cho session
                                accessor.setUser(() -> userId);
                            } else {
                                System.out.println("❌ Token invalid");
                                return null; // reject connect
                            }
                        } catch (Exception e) {
                            System.out.println("⚠️ Token error: " + e.getMessage());
                            return null; // reject connect
                        }
                    } else {
                        System.out.println("⚠️ Không tìm thấy Authorization header trong CONNECT");
                        return null; // reject connect
                    }
                }

                return message;
            }
        });
    }

}
