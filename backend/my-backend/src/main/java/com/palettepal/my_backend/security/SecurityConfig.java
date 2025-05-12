package com.palettepal.my_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.palettepal.my_backend.repository.UserRepository;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

   @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
            .map(UserPrincipal::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }


    // This method defines the main security configuration for the entire app
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection since we're working with stateless APIs (not browser forms)
            .csrf(csrf -> csrf.disable())

            // Define which endpoints are open to the public and which require auth
            .authorizeHttpRequests(auth -> auth
                // Allow anyone to register or log in without authentication
                .requestMatchers("/auth/**").permitAll()
                // All other endpoints require a valid JWT
                .anyRequest().authenticated()
            )

            // Add our custom JWT filter to the security filter chain
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Return the fully configured filter chain
    }

    // Registers our JWT filter as a bean so Spring can use it
    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    // Password encoder bean — used to hash passwords with BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
