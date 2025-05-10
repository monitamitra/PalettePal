package com.palettepal.my_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palettepal.my_backend.model.Video;

public interface VideoRepository extends JpaRepository<Video, String> {
    
}
