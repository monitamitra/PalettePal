package com.palettepal.my_backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserDetailsService userDetailsService;

    // runs before any controller for every request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse 
    response, FilterChain filterChain) throws ServletException, IOException {

        // Look for Authorization: Bearer <token> header
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        // Check if the header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // remove "Bearer "
            token = authHeader.substring(7); 
            // extract username from token
            username = jwtUtil.extractUsername(token); 
        }

        // If username is found and no auth has been set yet
        if (username != null && SecurityContextHolder.getContext()
            .getAuthentication() == null) {
            // Load the user from the database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate token and set authentication if it's legit
            if (jwtUtil.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, 
                    userDetails.getAuthorities());

                // Set the user in Spring Security context so controllers know who's logged in
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Continue with the request (now user info is available if valid)
        filterChain.doFilter(request, response);
    }
}
