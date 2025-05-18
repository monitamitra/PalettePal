package com.palettepal.my_backend.security;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.palettepal.my_backend.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtUtil {
    // secret key for signing tokens
    private final String SECRET = "palette_pal_092703palette_pal_092703";

    // generate JWT token for username
    public String generateToken(User user) {
        return Jwts.builder().setSubject(user.getId().toString()).setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), SignatureAlgorithm.HS256)
        .compact();
    }

    // Get the username from a token
    public String extractUsername(String token) {
    return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
        .build().parseClaimsJws(token).getBody().getSubject();
    }

    // Check if token is valid for a given user
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        
        // Token's user must match actual user
        return username.equals(userDetails.getUsername()); 
    }

}
