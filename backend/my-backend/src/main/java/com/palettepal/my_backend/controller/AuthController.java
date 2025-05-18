package com.palettepal.my_backend.controller;

import com.palettepal.my_backend.dto.UserDTO;
import com.palettepal.my_backend.model.User;
import com.palettepal.my_backend.repository.UserRepository;
import com.palettepal.my_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // POST auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        user.setId(UUID.randomUUID().toString()); 
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(403).body("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
