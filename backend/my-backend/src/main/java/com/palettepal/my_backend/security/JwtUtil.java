package com.palettepal.my_backend.security;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;


@Component
public class JwtUtil {
    // secret key for signing tokens
    private final String SECRET = "palette_pal_092703";

    // generate JWT token for username
    public String generateToken(String username) {
        return Jwts.builder().setSubject(username).setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(SignatureAlgorithm.HS256, SECRET).compact();
    }

    // Get the username from a token
    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token)
                .getBody().getSubject();
    }

    // Check if token is valid for a given user
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        
        // Token's user must match actual user
        return username.equals(userDetails.getUsername()); 
    }

}
