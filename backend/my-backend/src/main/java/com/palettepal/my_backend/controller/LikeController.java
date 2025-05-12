package com.palettepal.my_backend.controller;

import com.palettepal.my_backend.dto.LikeDTO;
import com.palettepal.my_backend.model.Like;
import com.palettepal.my_backend.model.User;
import com.palettepal.my_backend.repository.LikeRepository;
import com.palettepal.my_backend.repository.UserRepository;
import com.palettepal.my_backend.security.UserPrincipal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all likes for the authenticated user
    @GetMapping
    public List<LikeDTO> getLikes(@AuthenticationPrincipal UserPrincipal user) {
    List<Like> likes = likeRepository.findByUserId(user.getId());
    List<LikeDTO> likeDTOs = new ArrayList<>();

    for (Like like : likes) {
        likeDTOs.add(new LikeDTO(
            like.getId(),
            like.getVideoId(),
            like.getMood(),
            like.getSkillLevel()
        ));
    }

    return likeDTOs;
}

    @PostMapping("/{videoId}")
    public ResponseEntity<Like> likeVideo(@PathVariable String videoId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
    
    User user = userRepository.findById(userPrincipal.getId())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    String mood = payload.get("mood");
    String skillLevel = payload.get("skillLevel");

    Like like = new Like(user, videoId, mood, skillLevel);
    like.setUser(user);
    like.setVideoId(videoId);
    like.setMood(mood);
    like.setSkillLevel(skillLevel);

    return ResponseEntity.ok(likeRepository.save(like));
}


    // Unlike a video (delete the record)
    @DeleteMapping("/{videoId}")
    public void unlikeVideo(@AuthenticationPrincipal UserPrincipal userPrincipal,
                        @PathVariable String videoId) {
        // User user = userRepository.findById(userPrincipal.getId())
        //     .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Like like = likeRepository.findByUserIdAndVideoId(userPrincipal.getId(), videoId);
        System.out.println("*******IN DELETE METHOD!!********");
        if (like != null) {
            System.out.println("*******Video is NOT NULL!!********");
            likeRepository.delete(like);
        }
}
}
