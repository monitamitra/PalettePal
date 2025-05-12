package com.palettepal.my_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palettepal.my_backend.model.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByUserId(String userId);
    
    Like findByUserIdAndVideoId(String userId, String videoId);
}
