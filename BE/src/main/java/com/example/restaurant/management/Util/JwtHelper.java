package com.example.restaurant.management.Util;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
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

    public String generateToken(String email, String fullName, int id){

        Date now = new Date();
        Duration expiration = Duration.ofDays(30);
        Date expiryDate = new Date(now.getTime() + expiration.toMillis());
        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(privateKey));
        return Jwts.builder()
                .subject(email)
                .claim("fullName", fullName)
                .claim("userID",id)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(privateKey));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token){
        try{
            SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(privateKey));
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
            return true;
        }catch (ExpiredJwtException e){
            System.out.println("Token đã hết hạn");
        }catch (UnsupportedJwtException e){
            System.out.println("Token ko đc hỗ trợ");
        }catch (MalformedJwtException e){
            System.out.println("Token không hợp lệ");
        }catch (SignatureException e){
            System.out.println("Chứ ký ko đúng");
        }catch (IllegalArgumentException e){
            System.out.println("Token trống");
        }
        return false;
    }

    public Integer getUserID(String authHeader){
        String token = authHeader.replace("Bearer ", "");
        Claims claims = getClaimsFromToken(token);
        Integer userID = claims.get("userID", Integer.class);
        return userID;
    }

}
