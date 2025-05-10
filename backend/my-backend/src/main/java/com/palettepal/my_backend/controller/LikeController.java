package com.palettepal.my_backend.controller;

import com.palettepal.my_backend.model.Like;
import com.palettepal.my_backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;

    @PostMapping
    public Like addLike(@RequestBody Like like) {
        return likeRepository.save(like);
    }

    @GetMapping("/{userId}")
    public List<Like> getLikesByUser(@PathVariable Long userId) {
        return likeRepository.findByUserId(userId);
    }

    @GetMapping
    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }
}