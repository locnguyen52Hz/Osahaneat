package com.example.restaurant.management.Security;

import com.example.restaurant.management.Util.JwtHelper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class CustomJwt extends OncePerRequestFilter {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            if (jwtHelper.validateToken(token)) {
                String email = jwtHelper.getClaimsFromToken(token).getSubject();
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
                SecurityContext securityContext = SecurityContextHolder.getContext();
                System.out.println(authentication);
                securityContext.setAuthentication(authentication);

            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {

            jwtHelper.sendUnauthorized(response,"Access token đã hết hạn");

        } catch (UnsupportedJwtException |
                 MalformedJwtException |
                 SignatureException |
                 IllegalArgumentException e) {
           jwtHelper.sendUnauthorized(response, "Access token ko hợp lệ");
        }


    }

    private String getTokenFromHeader(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.equals("/api/auth/login") ||
               path.equals("/api/auth/register") ||
               path.equals("/api/auth/refresh") ||
               path.equals("/api/auth/logout");
    }


}
