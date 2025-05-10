package com.palettepal.my_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palettepal.my_backend.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    
}
