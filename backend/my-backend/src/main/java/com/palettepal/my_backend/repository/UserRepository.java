package com.palettepal.my_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palettepal.my_backend.model.User;

import io.micrometer.common.lang.NonNull;

public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
}
