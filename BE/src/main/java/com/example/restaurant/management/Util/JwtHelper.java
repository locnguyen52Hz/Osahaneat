package com.example.restaurant.management.Util;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtHelper {

    @Value("${jwt.privateKey}")
    private String privateKey;


    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(
                Base64.getDecoder().decode(privateKey)
        );
    }

    public String generateAccessToken(String email, String fullName, int id) {

        Date now = new Date();
        Duration expiration = Duration.ofMinutes(15);
        Date expiryDate = new Date(now.getTime() + expiration.toMillis());

        return Jwts.builder()
                .subject(email)
                .claim("fullName", fullName)
                .claim("userID", id)
                .claim("type", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getKey())
                .compact();
    }


    public String generateRefreshToken(int userId) {
        Date now = new Date();

        Date expiryDate = new Date(
                now.getTime() + Duration.ofDays(7).toMillis()
        );


        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getKey())
                .compact();
    }

    public Claims getClaimsFromToken(String token) {

        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        getClaimsFromToken(token);
        return true;
    }

    public Integer getUserID(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = getClaimsFromToken(token);
        return claims.get("userID", Integer.class);
    }

    public Integer getUserIdFromRefreshToken(String token) {

        Claims claims = getClaimsFromToken(token);

        String type = claims.get("type", String.class);

        if (!"refresh".equals(type)) {
            throw new RuntimeException("Invalid refresh token");
        }

        return Integer.valueOf(claims.getSubject());
    }

    public void sendUnauthorized(
            HttpServletResponse response,
            String message
    ) throws java.io.IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(
                "{\"message\":\"" + message + "\"}"
        );
    }

}
